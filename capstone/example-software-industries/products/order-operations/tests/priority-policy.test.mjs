import test from "node:test";
import assert from "node:assert/strict";

import legacyModule from "../../../legacy/operations-desk-classic/src/priority-routing.cjs";
import { ConfirmedPriorityPolicy } from "../dist/priority/confirmed-priority-policy.js";
import { LegacyPriorityAdapter } from "../dist/priority/legacy-priority-adapter.js";
import { BranchingPriorityPolicy } from "../dist/priority/branching-priority-policy.js";

const { calculatePriority } = legacyModule;

function priorityInput(overrides = {}) {
  return {
    caseId: "case-1",
    tenantId: "tenant-a",
    status: "Open",
    manualHold: false,
    problemCategory: "Other",
    failedAttempts: 0,
    customerTier: "STANDARD",
    createdAt: new Date("2026-09-04T07:00:00.000Z"),
    evaluatedAt: new Date("2026-09-04T07:10:00.000Z"),
    ...overrides,
  };
}

function comparisonSink() {
  const comparisons = [];
  return {
    comparisons,
    sink: {
      record(comparison) {
        comparisons.push(comparison);
      },
    },
  };
}

test("confirmed policy keeps Closed as highest-precedence NotActionable decision", () => {
  const policy = new ConfirmedPriorityPolicy();

  const decision = policy.decide(
    priorityInput({
      status: "Closed",
      manualHold: true,
      problemCategory: "Payment",
      failedAttempts: 10,
    }),
  );

  assert.deepEqual(decision, {
    priority: "NotActionable",
    reason: "Closed",
  });
});

test("confirmed policy routes manual hold to ManualReview before automatic urgency", () => {
  const policy = new ConfirmedPriorityPolicy();

  const decision = policy.decide(
    priorityInput({
      manualHold: true,
      problemCategory: "Payment",
      failedAttempts: 10,
    }),
  );

  assert.deepEqual(decision, {
    priority: "ManualReview",
    reason: "ManualHold",
  });
});

test("confirmed policy keeps repeated Payment failure urgent", () => {
  const policy = new ConfirmedPriorityPolicy();

  const decision = policy.decide(
    priorityInput({ problemCategory: "Payment", failedAttempts: 3 }),
  );

  assert.deepEqual(decision, {
    priority: "Urgent",
    reason: "RepeatedPaymentFailure",
  });
});

test("confirmed policy intentionally removes the legacy Enterprise 30 minute urgency rule", () => {
  const policy = new ConfirmedPriorityPolicy();

  const decision = policy.decide(
    priorityInput({
      customerTier: "ENTERPRISE",
      createdAt: new Date("2026-09-04T06:00:00.000Z"),
      evaluatedAt: new Date("2026-09-04T07:00:00.000Z"),
    }),
  );

  assert.deepEqual(decision, { priority: "Standard", reason: "Default" });
});

test("legacy adapter maps target input to the real legacy calculator and back", () => {
  const adapter = new LegacyPriorityAdapter(calculatePriority);

  const decision = adapter.decide(
    priorityInput({
      customerTier: "ENTERPRISE",
      createdAt: new Date("2026-09-04T06:00:00.000Z"),
      evaluatedAt: new Date("2026-09-04T07:00:00.000Z"),
    }),
  );

  assert.deepEqual(decision, {
    priority: "Urgent",
    reason: "LegacyCompatibility",
  });
});

test("shadow mode preserves legacy output and classifies ED-001 as expected", () => {
  const legacy = new LegacyPriorityAdapter(calculatePriority);
  const candidate = new ConfirmedPriorityPolicy();
  const comparison = comparisonSink();
  const policy = new BranchingPriorityPolicy(
    legacy,
    candidate,
    "shadow",
    comparison.sink,
  );

  const result = policy.decide(
    priorityInput({
      customerTier: "ENTERPRISE",
      createdAt: new Date("2026-09-04T06:00:00.000Z"),
      evaluatedAt: new Date("2026-09-04T07:00:00.000Z"),
    }),
  );

  assert.equal(result.priority, "Urgent");
  assert.equal(comparison.comparisons.length, 1);
  assert.equal(comparison.comparisons[0].legacy.priority, "Urgent");
  assert.equal(comparison.comparisons[0].candidate.priority, "Standard");
  assert.equal(
    comparison.comparisons[0].classification,
    "ExpectedDifference",
  );
  assert.equal(comparison.comparisons[0].expectedDifferenceId, "ED-001");
});

test("shadow mode treats an unapproved semantic mismatch as unexpected", () => {
  const legacy = new LegacyPriorityAdapter(calculatePriority);
  const comparison = comparisonSink();
  const badCandidate = {
    decide() {
      return { priority: "Urgent", reason: "Default" };
    },
  };
  const policy = new BranchingPriorityPolicy(
    legacy,
    badCandidate,
    "shadow",
    comparison.sink,
  );

  const result = policy.decide(priorityInput());

  assert.equal(result.priority, "Standard");
  assert.equal(comparison.comparisons.length, 1);
  assert.equal(
    comparison.comparisons[0].classification,
    "UnexpectedDifference",
  );
  assert.equal("expectedDifferenceId" in comparison.comparisons[0], false);
});

test("candidate mode returns the confirmed policy without pretending shadow evidence", () => {
  const legacy = new LegacyPriorityAdapter(calculatePriority);
  const candidate = new ConfirmedPriorityPolicy();
  const comparison = comparisonSink();
  const policy = new BranchingPriorityPolicy(
    legacy,
    candidate,
    "candidate",
    comparison.sink,
  );

  const result = policy.decide(
    priorityInput({
      customerTier: "ENTERPRISE",
      createdAt: new Date("2026-09-04T06:00:00.000Z"),
      evaluatedAt: new Date("2026-09-04T07:00:00.000Z"),
    }),
  );

  assert.equal(result.priority, "Standard");
  assert.equal(comparison.comparisons.length, 0);
});
