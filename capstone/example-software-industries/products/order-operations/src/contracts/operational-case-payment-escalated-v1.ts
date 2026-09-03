export const OPERATIONAL_CASE_PAYMENT_ESCALATED =
  "OperationalCasePaymentEscalated" as const;

export interface OperationalCasePaymentEscalatedV1 {
  readonly messageId: string;
  readonly type: typeof OPERATIONAL_CASE_PAYMENT_ESCALATED;
  readonly schemaVersion: 1;
  readonly occurredAt: string;
  readonly caseId: string;
  readonly escalationId: string;
  readonly tenantRef: string;
  readonly reasonCode: "PaymentInvestigationRequired";
  readonly correlationId?: string;
}

export function createOperationalCasePaymentEscalatedV1(input: {
  messageId: string;
  occurredAt: Date;
  caseId: string;
  escalationId: string;
  tenantRef: string;
  reasonCode: "PaymentInvestigationRequired";
  correlationId?: string;
}): OperationalCasePaymentEscalatedV1 {
  return {
    messageId: input.messageId,
    type: OPERATIONAL_CASE_PAYMENT_ESCALATED,
    schemaVersion: 1,
    occurredAt: input.occurredAt.toISOString(),
    caseId: input.caseId,
    escalationId: input.escalationId,
    tenantRef: input.tenantRef,
    reasonCode: input.reasonCode,
    ...(input.correlationId === undefined
      ? {}
      : { correlationId: input.correlationId }),
  };
}
