import {
  createOperationalCasePaymentEscalatedV1,
  type OperationalCasePaymentEscalatedV1,
} from "../contracts/operational-case-payment-escalated-v1.js";

export type ProblemCategory = "Payment" | "Shipping" | "Order";
export type PaymentEscalationStatus = "Requested";
export type DeliveryState = "Pending" | "Delivered" | "Delayed" | "DeadLettered";

export interface OperationalCaseSnapshot {
  readonly id: string;
  readonly tenantId: string;
  readonly problemCategory: ProblemCategory;
}

export interface PaymentEscalation {
  readonly escalationId: string;
  readonly caseId: string;
  readonly tenantId: string;
  readonly reasonCode: "PaymentInvestigationRequired";
  readonly requestedBy: string;
  readonly requestedAt: Date;
  readonly status: PaymentEscalationStatus;
  readonly deliveryState: DeliveryState;
}

export interface OutboxMessage {
  readonly messageId: string;
  readonly messageType: "OperationalCasePaymentEscalated";
  readonly schemaVersion: 1;
  readonly aggregateType: "PaymentEscalation";
  readonly aggregateId: string;
  readonly correlationId?: string;
  readonly payload: OperationalCasePaymentEscalatedV1;
  readonly occurredAt: Date;
  readonly nextAttemptAt: Date;
}

export interface PaymentEscalationTransaction {
  loadOperationalCase(caseId: string): Promise<OperationalCaseSnapshot | null>;
  findEscalationById(escalationId: string): Promise<PaymentEscalation | null>;
  findActiveEscalationForCase(caseId: string): Promise<PaymentEscalation | null>;
  insertEscalation(escalation: PaymentEscalation): Promise<void>;
  appendOutboxMessage(message: OutboxMessage): Promise<void>;
}

export interface PaymentEscalationUnitOfWork {
  run<T>(work: (tx: PaymentEscalationTransaction) => Promise<T>): Promise<T>;
}

export interface RequestPaymentEscalationCommand {
  readonly caseId: string;
  readonly tenantId: string;
  readonly escalationId: string;
  readonly messageId: string;
  readonly requestedBy: string;
  readonly reasonCode: "PaymentInvestigationRequired";
  readonly requestedAt: Date;
  readonly correlationId?: string;
}

export type RequestPaymentEscalationResult =
  | { readonly kind: "accepted"; readonly escalation: PaymentEscalation }
  | { readonly kind: "already-accepted"; readonly escalation: PaymentEscalation };

export class OperationalCaseNotFoundError extends Error {}
export class OperationalCaseNotVisibleError extends Error {}
export class PaymentEscalationNotAllowedError extends Error {}
export class ConflictingPaymentEscalationError extends Error {}

export async function requestPaymentEscalation(
  unitOfWork: PaymentEscalationUnitOfWork,
  command: RequestPaymentEscalationCommand,
): Promise<RequestPaymentEscalationResult> {
  return unitOfWork.run(async (tx) => {
    // Same escalationId means the caller is retrying the same business intent.
    // Returning the existing record makes the command idempotent at this boundary.
    const existing = await tx.findEscalationById(command.escalationId);
    if (existing !== null) {
      if (existing.caseId !== command.caseId || existing.tenantId !== command.tenantId) {
        throw new ConflictingPaymentEscalationError(
          "The idempotency key is already associated with a different escalation intent.",
        );
      }

      return { kind: "already-accepted", escalation: existing };
    }

    const operationalCase = await tx.loadOperationalCase(command.caseId);
    if (operationalCase === null) {
      throw new OperationalCaseNotFoundError("Operational case does not exist.");
    }

    if (operationalCase.tenantId !== command.tenantId) {
      throw new OperationalCaseNotVisibleError(
        "Operational case is outside the caller tenant scope.",
      );
    }

    if (operationalCase.problemCategory !== "Payment") {
      throw new PaymentEscalationNotAllowedError(
        "Only Payment operational cases can be escalated to Payments & Risk.",
      );
    }

    const activeForCase = await tx.findActiveEscalationForCase(command.caseId);
    if (activeForCase !== null) {
      throw new ConflictingPaymentEscalationError(
        "An active payment escalation already exists for this operational case.",
      );
    }

    const escalation: PaymentEscalation = {
      escalationId: command.escalationId,
      caseId: command.caseId,
      tenantId: command.tenantId,
      reasonCode: command.reasonCode,
      requestedBy: command.requestedBy,
      requestedAt: command.requestedAt,
      status: "Requested",
      deliveryState: "Pending",
    };

    const event = createOperationalCasePaymentEscalatedV1({
      messageId: command.messageId,
      occurredAt: command.requestedAt,
      caseId: command.caseId,
      escalationId: command.escalationId,
      tenantRef: command.tenantId,
      reasonCode: command.reasonCode,
      ...(command.correlationId === undefined
        ? {}
        : { correlationId: command.correlationId }),
    });

    const outboxMessage: OutboxMessage = {
      messageId: command.messageId,
      messageType: event.type,
      schemaVersion: event.schemaVersion,
      aggregateType: "PaymentEscalation",
      aggregateId: command.escalationId,
      ...(command.correlationId === undefined
        ? {}
        : { correlationId: command.correlationId }),
      payload: event,
      occurredAt: command.requestedAt,
      nextAttemptAt: command.requestedAt,
    };

    // The adapter implementing this transaction must persist both records in
    // the same local database transaction. If one insert fails, both roll back.
    await tx.insertEscalation(escalation);
    await tx.appendOutboxMessage(outboxMessage);

    return { kind: "accepted", escalation };
  });
}
