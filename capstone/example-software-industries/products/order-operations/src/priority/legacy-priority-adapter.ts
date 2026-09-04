import type {
  CasePriorityInput,
  Priority,
  PriorityDecision,
  PriorityPolicy,
} from "./priority-policy.js";

export interface LegacyPriorityRow {
  readonly status_code: string;
  readonly manual_hold: 0 | 1;
  readonly problem_code: string;
  readonly failed_attempts: number;
  readonly customer_tier: string;
  readonly created_at: string;
}

export type LegacyPriorityCalculator = (
  row: LegacyPriorityRow,
  nowEpochMs: number,
) => string;

/**
 * Anti-corruption adapter around Operations Desk Classic priority vocabulary.
 */
export class LegacyPriorityAdapter implements PriorityPolicy {
  constructor(private readonly calculateLegacy: LegacyPriorityCalculator) {}

  decide(input: CasePriorityInput): PriorityDecision {
    const legacyRow: LegacyPriorityRow = {
      status_code: input.status === "Closed" ? "CLOSED" : "OPEN",
      manual_hold: input.manualHold ? 1 : 0,
      problem_code: toLegacyProblemCode(input.problemCategory),
      failed_attempts: input.failedAttempts,
      customer_tier: input.customerTier ?? "",
      created_at: input.createdAt.toISOString(),
    };

    const legacyPriority = this.calculateLegacy(
      legacyRow,
      input.evaluatedAt.getTime(),
    );

    return {
      priority: fromLegacyPriority(legacyPriority),
      reason: "LegacyCompatibility",
    };
  }
}

function toLegacyProblemCode(
  category: CasePriorityInput["problemCategory"],
): string {
  switch (category) {
    case "Payment":
      return "PAY";
    case "Shipping":
      return "SHIP";
    case "Order":
      return "ORDER";
    case "Other":
      return "OTHER";
  }
}

function fromLegacyPriority(value: string): Priority {
  switch (value) {
    case "NONE":
      return "NotActionable";
    case "MANUAL_REVIEW":
      return "ManualReview";
    case "URGENT":
      return "Urgent";
    case "STANDARD":
      return "Standard";
    default:
      throw new Error(`Unsupported legacy priority: ${value}`);
  }
}
