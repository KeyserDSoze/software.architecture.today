import test from "node:test";
import assert from "node:assert/strict";

import {
  ConflictingPaymentEscalationError,
  OperationalCaseNotVisibleError,
  PaymentEscalationNotAllowedError,
  requestPaymentEscalation,
} from "../dist/application/request-payment-escalation.js";
import { observedRequestPaymentEscalation } from "../dist/observability/observed-request-payment-escalation.js";

function createHarness({
  operationalCase = {
    id: "case-1",
    tenantId: "tenant-a",
    problemCategory: "Payment",
  },
  existingEscalations = [],
} = {}) {
  const escalations = [...existingEscalations];
  const outbox = [];

  const tx = {
    async loadOperationalCase(caseId) {
      return operationalCase !== null && operationalCase.id === caseId
        ? operationalCase
        : null;
    },
    async findEscalationById(escalationId) {
      return escalations.find((item) => item.escalationId === escalationId) ?? null;
    },
    async findActiveEscalationForCase(caseId) {
      return escalations.find((item) => item.caseId === caseId) ?? null;
    },
    async insertEscalation(escalation) {
      escalations.push(escalation);
    },
    async appendOutboxMessage(message) {
      outbox.push(message);
    },
  };

  const unitOfWork = {
    async run(work) {
      return work(tx);
    },
  };

  return { unitOfWork, escalations, outbox };
}

function command(overrides = {}) {
  return {
    caseId: "case-1",
    tenantId: "tenant-a",
    escalationId: "esc-1",
    messageId: "msg-1",
    requestedBy: "operator-1",
    reasonCode: "PaymentInvestigationRequired",
    requestedAt: new Date("2026-09-03T12:00:00.000Z"),
    correlationId: "corr-1",
    ...overrides,
  };
}

test("accepts a Payment case and creates escalation plus outbox intent", async () => {
  const harness = createHarness();

  const result = await requestPaymentEscalation(harness.unitOfWork, command());

  assert.equal(result.kind, "accepted");
  assert.equal(harness.escalations.length, 1);
  assert.equal(harness.outbox.length, 1);
  assert.equal(harness.escalations[0].escalationId, "esc-1");
  assert.equal(harness.escalations[0].deliveryState, "Pending");
  assert.equal(harness.outbox[0].aggregateId, "esc-1");
  assert.equal(harness.outbox[0].messageId, "msg-1");
});

test("rejects a non-Payment case without creating escalation or outbox intent", async () => {
  const harness = createHarness({
    operationalCase: {
      id: "case-1",
      tenantId: "tenant-a",
      problemCategory: "Shipping",
    },
  });

  await assert.rejects(
    requestPaymentEscalation(harness.unitOfWork, command()),
    PaymentEscalationNotAllowedError,
  );

  assert.equal(harness.escalations.length, 0);
  assert.equal(harness.outbox.length, 0);
});

test("rejects a case outside the caller tenant scope without side effects", async () => {
  const harness = createHarness({
    operationalCase: {
      id: "case-1",
      tenantId: "tenant-b",
      problemCategory: "Payment",
    },
  });

  await assert.rejects(
    requestPaymentEscalation(harness.unitOfWork, command()),
    OperationalCaseNotVisibleError,
  );

  assert.equal(harness.escalations.length, 0);
  assert.equal(harness.outbox.length, 0);
});

test("returns the existing escalation for an idempotent replay of the same intent", async () => {
  const existing = {
    escalationId: "esc-1",
    caseId: "case-1",
    tenantId: "tenant-a",
    reasonCode: "PaymentInvestigationRequired",
    requestedBy: "operator-1",
    requestedAt: new Date("2026-09-03T12:00:00.000Z"),
    status: "Requested",
    deliveryState: "Pending",
  };
  const harness = createHarness({ existingEscalations: [existing] });

  const result = await requestPaymentEscalation(harness.unitOfWork, command());

  assert.equal(result.kind, "already-accepted");
  assert.equal(result.escalation, existing);
  assert.equal(harness.escalations.length, 1);
  assert.equal(harness.outbox.length, 0);
});

test("rejects reuse of the same idempotency key for a different case", async () => {
  const existing = {
    escalationId: "esc-1",
    caseId: "case-other",
    tenantId: "tenant-a",
    reasonCode: "PaymentInvestigationRequired",
    requestedBy: "operator-1",
    requestedAt: new Date("2026-09-03T12:00:00.000Z"),
    status: "Requested",
    deliveryState: "Pending",
  };
  const harness = createHarness({ existingEscalations: [existing] });

  await assert.rejects(
    requestPaymentEscalation(harness.unitOfWork, command()),
    ConflictingPaymentEscalationError,
  );

  assert.equal(harness.escalations.length, 1);
  assert.equal(harness.outbox.length, 0);
});

test("observable wrapper emits a bounded acceptance metric and keeps identifiers in correlation context", async () => {
  const harness = createHarness();
  const accepted = [];
  const rejected = [];
  let time = 100;

  const telemetry = {
    paymentEscalationAccepted(context, measurement, correlation) {
      accepted.push({ context, measurement, correlation });
    },
    paymentEscalationRejected(context, reasonClass, correlation) {
      rejected.push({ context, reasonClass, correlation });
    },
    outboxPublishSucceeded() {},
    outboxPublishFailed() {},
    observeOutboxBacklog() {},
  };

  const result = await observedRequestPaymentEscalation({
    unitOfWork: harness.unitOfWork,
    command: command(),
    telemetry,
    metricContext: { environment: "dev", serviceVersion: "test" },
    clock: { nowMs: () => (time += 5) },
  });

  assert.equal(result.kind, "accepted");
  assert.equal(accepted.length, 1);
  assert.equal(rejected.length, 0);
  assert.deepEqual(accepted[0].context, {
    environment: "dev",
    serviceVersion: "test",
  });
  assert.equal(accepted[0].measurement.result, "accepted");
  assert.equal(accepted[0].measurement.durationMs, 5);
  assert.equal(accepted[0].correlation.escalationId, "esc-1");
  assert.equal("escalationId" in accepted[0].context, false);
});

test("observable wrapper classifies a wrong-category rejection", async () => {
  const harness = createHarness({
    operationalCase: {
      id: "case-1",
      tenantId: "tenant-a",
      problemCategory: "Shipping",
    },
  });
  const rejected = [];

  const telemetry = {
    paymentEscalationAccepted() {},
    paymentEscalationRejected(context, reasonClass, correlation) {
      rejected.push({ context, reasonClass, correlation });
    },
    outboxPublishSucceeded() {},
    outboxPublishFailed() {},
    observeOutboxBacklog() {},
  };

  await assert.rejects(
    observedRequestPaymentEscalation({
      unitOfWork: harness.unitOfWork,
      command: command(),
      telemetry,
      metricContext: { environment: "dev", serviceVersion: "test" },
      clock: { nowMs: () => 100 },
    }),
    PaymentEscalationNotAllowedError,
  );

  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].reasonClass, "WrongCategory");
  assert.equal(rejected[0].correlation.caseId, "case-1");
});
