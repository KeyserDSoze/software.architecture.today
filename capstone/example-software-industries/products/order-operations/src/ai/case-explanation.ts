export type CaseExplanationStatus =
  | "Supported"
  | "PartiallySupported"
  | "InsufficientEvidence"
  | "Unavailable";

export type CaseExplanationSourceKind =
  | "OperationalCase"
  | "Orders"
  | "Payments"
  | "Shipping"
  | "Derived";

export interface CaseExplanationSource {
  readonly reference: string;
  readonly kind: CaseExplanationSourceKind;
  readonly observedAt: string;
  readonly facts: Readonly<Record<string, string | number | boolean | null>>;
}

export interface CaseExplanationContext {
  readonly caseId: string;
  readonly tenantId: string;
  readonly observedAt: string;
  readonly sources: readonly CaseExplanationSource[];
}

export interface CaseExplanationFact {
  readonly text: string;
  readonly sourceReferences: readonly string[];
}

export interface CaseExplanationHypothesis {
  readonly text: string;
  readonly sourceReferences: readonly string[];
}

export interface CaseExplanationResult {
  readonly status: CaseExplanationStatus;
  readonly summary: string;
  readonly confirmedFacts: readonly CaseExplanationFact[];
  readonly hypotheses: readonly CaseExplanationHypothesis[];
  readonly missingEvidence: readonly string[];
  readonly sourceReferences: readonly string[];
}

/**
 * Provider-neutral model boundary.
 *
 * Implementations may call an external or internally hosted model, but callers
 * depend on the product-level contract rather than provider-specific SDK types.
 */
export interface CaseExplanationPort {
  explain(context: CaseExplanationContext): Promise<CaseExplanationResult>;
}

export type CaseExplanationValidationFailure =
  | { readonly kind: "UnknownSourceReference"; readonly reference: string }
  | { readonly kind: "ConfirmedFactWithoutSource"; readonly factIndex: number }
  | { readonly kind: "HypothesisWithoutSource"; readonly hypothesisIndex: number }
  | { readonly kind: "MissingEvidenceNotDeclared" };

/**
 * Deterministic guardrails that can be checked outside the model.
 *
 * This function deliberately does not claim to prove groundedness. It verifies
 * reference integrity and a few product-level invariants before a generated
 * result can be rendered to an operator.
 */
export function validateCaseExplanationResult(
  context: CaseExplanationContext,
  result: CaseExplanationResult,
): readonly CaseExplanationValidationFailure[] {
  const knownReferences = new Set(context.sources.map((source) => source.reference));
  const failures: CaseExplanationValidationFailure[] = [];

  for (const reference of result.sourceReferences) {
    if (!knownReferences.has(reference)) {
      failures.push({ kind: "UnknownSourceReference", reference });
    }
  }

  result.confirmedFacts.forEach((fact, index) => {
    if (fact.sourceReferences.length === 0) {
      failures.push({ kind: "ConfirmedFactWithoutSource", factIndex: index });
    }

    for (const reference of fact.sourceReferences) {
      if (!knownReferences.has(reference)) {
        failures.push({ kind: "UnknownSourceReference", reference });
      }
    }
  });

  result.hypotheses.forEach((hypothesis, index) => {
    if (hypothesis.sourceReferences.length === 0) {
      failures.push({ kind: "HypothesisWithoutSource", hypothesisIndex: index });
    }

    for (const reference of hypothesis.sourceReferences) {
      if (!knownReferences.has(reference)) {
        failures.push({ kind: "UnknownSourceReference", reference });
      }
    }
  });

  if (
    (result.status === "PartiallySupported" ||
      result.status === "InsufficientEvidence") &&
    result.missingEvidence.length === 0
  ) {
    failures.push({ kind: "MissingEvidenceNotDeclared" });
  }

  return failures;
}
