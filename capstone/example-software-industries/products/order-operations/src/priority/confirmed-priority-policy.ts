import type {
  CasePriorityInput,
  PriorityDecision,
  PriorityPolicy,
} from "./priority-policy.js";

export const PAYMENT_FAILURE_URGENT_THRESHOLD = 3;

/**
 * Priority semantics confirmed in the simulated ESI Chapter 18 workshop.
 *
 * Deliberately absent: the legacy Enterprise + 30 minute urgency rule. That
 * behavior is retired through explicit product decision ED-001.
 */
export class ConfirmedPriorityPolicy implements PriorityPolicy {
  decide(input: CasePriorityInput): PriorityDecision {
    if (input.status === "Closed") {
      return { priority: "NotActionable", reason: "Closed" };
    }

    if (input.manualHold) {
      return { priority: "ManualReview", reason: "ManualHold" };
    }

    if (
      input.problemCategory === "Payment" &&
      input.failedAttempts >= PAYMENT_FAILURE_URGENT_THRESHOLD
    ) {
      return { priority: "Urgent", reason: "RepeatedPaymentFailure" };
    }

    return { priority: "Standard", reason: "Default" };
  }
}
