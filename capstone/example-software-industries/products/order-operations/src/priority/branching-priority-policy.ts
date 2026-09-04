import type {
  CasePriorityInput,
  PriorityDecision,
  PriorityPolicy,
} from "./priority-policy.js";

export type PriorityRolloutMode = "legacy" | "shadow" | "candidate";

export type PriorityComparisonClass =
  | "Match"
  | "ExpectedDifference"
  | "UnexpectedDifference";

export interface PriorityComparison {
  readonly caseId: string;
  readonly tenantId: string;
  readonly legacy: PriorityDecision;
  readonly candidate: PriorityDecision;
  readonly classification: PriorityComparisonClass;
  readonly expectedDifferenceId?: "ED-001";
}

export interface PriorityComparisonSink {
  record(comparison: PriorityComparison): void;
}

export class BranchingPriorityPolicy implements PriorityPolicy {
  constructor(
    private readonly legacy: PriorityPolicy,
    private readonly candidate: PriorityPolicy,
    private readonly mode: PriorityRolloutMode,
    private readonly comparisonSink: PriorityComparisonSink,
  ) {}

  decide(input: CasePriorityInput): PriorityDecision {
    if (this.mode === "legacy") {
      return this.legacy.decide(input);
    }

    if (this.mode === "candidate") {
      return this.candidate.decide(input);
    }

    const legacyDecision = this.legacy.decide(input);
    const candidateDecision = this.candidate.decide(input);
    const expectedDifferenceId = classifyExpectedDifference(
      input,
      legacyDecision,
      candidateDecision,
    );

    this.comparisonSink.record({
      caseId: input.caseId,
      tenantId: input.tenantId,
      legacy: legacyDecision,
      candidate: candidateDecision,
      classification:
        legacyDecision.priority === candidateDecision.priority
          ? "Match"
          : expectedDifferenceId === undefined
            ? "UnexpectedDifference"
            : "ExpectedDifference",
      ...(expectedDifferenceId === undefined ? {} : { expectedDifferenceId }),
    });

    // Shadow mode deliberately preserves legacy behavior.
    return legacyDecision;
  }
}

/**
 * ED-001 was approved before rollout in the simulated ESI scenario:
 * the historical Enterprise + 30 minute urgency rule is intentionally removed.
 */
function classifyExpectedDifference(
  input: CasePriorityInput,
  legacy: PriorityDecision,
  candidate: PriorityDecision,
): "ED-001" | undefined {
  if (legacy.priority !== "Urgent" || candidate.priority !== "Standard") {
    return undefined;
  }

  if (input.status === "Closed" || input.manualHold) {
    return undefined;
  }

  if (input.problemCategory === "Payment" && input.failedAttempts >= 3) {
    return undefined;
  }

  if ((input.customerTier ?? "").trim().toUpperCase() !== "ENTERPRISE") {
    return undefined;
  }

  const ageMs = input.evaluatedAt.getTime() - input.createdAt.getTime();
  if (!Number.isFinite(ageMs) || ageMs < 30 * 60 * 1000) {
    return undefined;
  }

  return "ED-001";
}
