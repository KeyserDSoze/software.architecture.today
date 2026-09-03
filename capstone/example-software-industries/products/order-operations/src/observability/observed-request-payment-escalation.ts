import {
  ConflictingPaymentEscalationError,
  OperationalCaseNotFoundError,
  OperationalCaseNotVisibleError,
  PaymentEscalationNotAllowedError,
  requestPaymentEscalation,
  type PaymentEscalationUnitOfWork,
  type RequestPaymentEscalationCommand,
  type RequestPaymentEscalationResult,
} from "../application/request-payment-escalation.js";
import type {
  BoundedMetricContext,
  CorrelationContext,
  OrderOperationsTelemetry,
} from "./telemetry.js";

export interface MonotonicClock {
  nowMs(): number;
}

export async function observedRequestPaymentEscalation(input: {
  readonly unitOfWork: PaymentEscalationUnitOfWork;
  readonly command: RequestPaymentEscalationCommand;
  readonly telemetry: OrderOperationsTelemetry;
  readonly metricContext: BoundedMetricContext;
  readonly clock: MonotonicClock;
}): Promise<RequestPaymentEscalationResult> {
  const startedAt = input.clock.nowMs();
  const correlation = buildCorrelation(input.command);

  try {
    const result = await requestPaymentEscalation(input.unitOfWork, input.command);

    input.telemetry.paymentEscalationAccepted(
      input.metricContext,
      {
        result: result.kind,
        durationMs: Math.max(0, input.clock.nowMs() - startedAt),
      },
      correlation,
    );

    return result;
  } catch (error) {
    const reasonClass = classifyRejection(error);

    if (reasonClass !== null) {
      input.telemetry.paymentEscalationRejected(
        input.metricContext,
        reasonClass,
        correlation,
      );
    }

    throw error;
  }
}

function buildCorrelation(
  command: RequestPaymentEscalationCommand,
): CorrelationContext {
  return {
    caseId: command.caseId,
    escalationId: command.escalationId,
    messageId: command.messageId,
    ...(command.correlationId === undefined
      ? {}
      : { correlationId: command.correlationId }),
  };
}

function classifyRejection(
  error: unknown,
):
  | "NotFound"
  | "TenantScope"
  | "WrongCategory"
  | "ConflictingIntent"
  | null {
  if (error instanceof OperationalCaseNotFoundError) {
    return "NotFound";
  }

  if (error instanceof OperationalCaseNotVisibleError) {
    return "TenantScope";
  }

  if (error instanceof PaymentEscalationNotAllowedError) {
    return "WrongCategory";
  }

  if (error instanceof ConflictingPaymentEscalationError) {
    return "ConflictingIntent";
  }

  return null;
}
