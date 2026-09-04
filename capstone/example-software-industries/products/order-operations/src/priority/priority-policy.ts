export type OperationalCaseStatus = "Open" | "Closed";

export type PriorityProblemCategory =
  | "Payment"
  | "Shipping"
  | "Order"
  | "Other";

export type Priority =
  | "NotActionable"
  | "ManualReview"
  | "Urgent"
  | "Standard";

export interface CasePriorityInput {
  readonly caseId: string;
  readonly tenantId: string;
  readonly status: OperationalCaseStatus;
  readonly manualHold: boolean;
  readonly problemCategory: PriorityProblemCategory;
  readonly failedAttempts: number;
  readonly customerTier?: string;
  readonly createdAt: Date;
  readonly evaluatedAt: Date;
}

export interface PriorityDecision {
  readonly priority: Priority;
  readonly reason:
    | "Closed"
    | "ManualHold"
    | "RepeatedPaymentFailure"
    | "Default"
    | "LegacyCompatibility";
}

/**
 * Boundary for the operational priority decision.
 *
 * The target model deliberately does not expose legacy column names or
 * priority codes. Compatibility belongs in an adapter, not in the domain port.
 */
export interface PriorityPolicy {
  decide(input: CasePriorityInput): PriorityDecision;
}
