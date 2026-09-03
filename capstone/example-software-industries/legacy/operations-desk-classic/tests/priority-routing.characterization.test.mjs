import assert from "node:assert/strict";
import test from "node:test";
import legacyModule from "../src/priority-routing.cjs";

const { calculatePriority } = legacyModule;

const NOW = Date.parse("2026-09-03T12:00:00Z");

function row(overrides = {}) {
  return {
    status_code: "OPEN",
    manual_hold: 0,
    problem_code: "ORDER",
    failed_attempts: 0,
    customer_tier: "STANDARD",
    created_at: "2026-09-03T11:50:00Z",
    ...overrides,
  };
}

test("LB-01 closed case is characterized as NONE", () => {
  assert.equal(
    calculatePriority(
      row({
        status_code: "CLOSED",
        manual_hold: 1,
        problem_code: "PAY",
        failed_attempts: 10,
      }),
      NOW,
    ),
    "NONE",
  );
});

test("LB-02 manual hold is characterized as MANUAL_REVIEW", () => {
  assert.equal(calculatePriority(row({ manual_hold: 1 }), NOW), "MANUAL_REVIEW");
});

test("LB-03 payment case with three failed attempts is characterized as URGENT", () => {
  assert.equal(
    calculatePriority(
      row({ problem_code: "PAY", failed_attempts: 3 }),
      NOW,
    ),
    "URGENT",
  );
});

test("LB-04 enterprise case at the thirty-minute threshold is characterized as URGENT", () => {
  assert.equal(
    calculatePriority(
      row({
        customer_tier: "enterprise",
        created_at: "2026-09-03T11:30:00Z",
      }),
      NOW,
    ),
    "URGENT",
  );
});

test("LB-05 enterprise case before the threshold is characterized as STANDARD", () => {
  assert.equal(
    calculatePriority(
      row({
        customer_tier: "ENTERPRISE",
        created_at: "2026-09-03T11:31:00Z",
      }),
      NOW,
    ),
    "STANDARD",
  );
});

test("LB-06 ordinary case is characterized as STANDARD", () => {
  assert.equal(calculatePriority(row(), NOW), "STANDARD");
});
