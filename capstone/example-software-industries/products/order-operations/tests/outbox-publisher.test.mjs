import test from "node:test";
import assert from "node:assert/strict";

import {
  OutboxDeliveryExhaustedError,
  publishOutboxBatch,
} from "../dist/integration/outbox-publisher.js";

function pendingMessage(overrides = {}) {
  return {
    messageId: "msg-1",
    messageType: "OperationalCasePaymentEscalated",
    schemaVersion: 1,
    payload: { escalationId: "esc-1" },
    occurredAt: new Date("2026-09-03T12:00:00.000Z"),
    attemptCount: 0,
    ...overrides,
  };
}

function createStore(messages) {
  const state = messages.map((message) => ({ ...message }));
  const published = [];
  const failures = [];

  return {
    state,
    published,
    failures,
    store: {
      async nextBatch({ limit, now }) {
        return state
          .filter((message) => {
            if (message.publishedAt !== undefined) return false;
            if (message.nextAttemptAt === undefined) return true;
            return message.nextAttemptAt <= now;
          })
          .slice(0, limit);
      },
      async markPublished({ messageId, publishedAt }) {
        const message = state.find((item) => item.messageId === messageId);
        if (message !== undefined) {
          message.publishedAt = publishedAt;
        }
        published.push({ messageId, publishedAt });
      },
      async recordFailure({ messageId, attemptCount, nextAttemptAt, error }) {
        const message = state.find((item) => item.messageId === messageId);
        if (message !== undefined) {
          message.attemptCount = attemptCount;
          message.nextAttemptAt = nextAttemptAt;
        }
        failures.push({ messageId, attemptCount, nextAttemptAt, error });
      },
    },
  };
}

function createObserver() {
  const events = {
    published: [],
    failed: [],
    exhausted: [],
  };

  return {
    events,
    observer: {
      published(messageId) {
        events.published.push(messageId);
      },
      failed(event) {
        events.failed.push(event);
      },
      exhausted(event) {
        events.exhausted.push(event);
      },
    },
  };
}

const policy = {
  batchSize: 10,
  maxAttempts: 3,
  nextDelayMs({ attempt }) {
    return attempt * 1000;
  },
};

test("publishes a pending message with its stable identity and marks it delivered locally", async () => {
  const storeHarness = createStore([pendingMessage()]);
  const observerHarness = createObserver();
  const brokerCalls = [];
  const clock = { now: () => new Date("2026-09-03T12:00:00.000Z") };

  await publishOutboxBatch({
    store: storeHarness.store,
    broker: {
      async publish(message) {
        brokerCalls.push(message);
      },
    },
    policy,
    clock,
    observer: observerHarness.observer,
  });

  assert.equal(brokerCalls.length, 1);
  assert.equal(brokerCalls[0].messageId, "msg-1");
  assert.equal(storeHarness.published.length, 1);
  assert.equal(storeHarness.published[0].messageId, "msg-1");
  assert.deepEqual(observerHarness.events.published, ["msg-1"]);
  assert.equal(observerHarness.events.failed.length, 0);
});

test("records a bounded retry after a publish failure and preserves the same message identity", async () => {
  const storeHarness = createStore([pendingMessage()]);
  const observerHarness = createObserver();
  const brokerCalls = [];
  let now = new Date("2026-09-03T12:00:00.000Z");

  await publishOutboxBatch({
    store: storeHarness.store,
    broker: {
      async publish(message) {
        brokerCalls.push(message);
        throw new Error("broker unavailable");
      },
    },
    policy,
    clock: { now: () => now },
    observer: observerHarness.observer,
  });

  assert.equal(brokerCalls.length, 1);
  assert.equal(brokerCalls[0].messageId, "msg-1");
  assert.equal(storeHarness.failures.length, 1);
  assert.equal(storeHarness.failures[0].messageId, "msg-1");
  assert.equal(storeHarness.failures[0].attemptCount, 1);
  assert.equal(
    storeHarness.failures[0].nextAttemptAt.toISOString(),
    "2026-09-03T12:00:01.000Z",
  );
  assert.equal(observerHarness.events.failed.length, 1);
  assert.equal(observerHarness.events.exhausted.length, 0);
});

test("throws and exposes the exhausted path when the bounded retry budget is consumed", async () => {
  const storeHarness = createStore([
    pendingMessage({ attemptCount: 2 }),
  ]);
  const observerHarness = createObserver();

  await assert.rejects(
    publishOutboxBatch({
      store: storeHarness.store,
      broker: {
        async publish() {
          throw new Error("persistent broker failure");
        },
      },
      policy,
      clock: { now: () => new Date("2026-09-03T12:00:00.000Z") },
      observer: observerHarness.observer,
    }),
    (error) => {
      assert.ok(error instanceof OutboxDeliveryExhaustedError);
      assert.equal(error.messageId, "msg-1");
      assert.equal(error.attempts, 3);
      return true;
    },
  );

  assert.equal(observerHarness.events.failed.length, 1);
  assert.equal(observerHarness.events.exhausted.length, 1);
  assert.equal(storeHarness.published.length, 0);
});

test("a later retry republishes the same messageId after a previous transient failure", async () => {
  const storeHarness = createStore([pendingMessage()]);
  const observerHarness = createObserver();
  const brokerCalls = [];
  let failFirst = true;
  let now = new Date("2026-09-03T12:00:00.000Z");

  const broker = {
    async publish(message) {
      brokerCalls.push(message);
      if (failFirst) {
        failFirst = false;
        throw new Error("temporary failure");
      }
    },
  };

  await publishOutboxBatch({
    store: storeHarness.store,
    broker,
    policy,
    clock: { now: () => now },
    observer: observerHarness.observer,
  });

  now = new Date("2026-09-03T12:00:01.000Z");

  await publishOutboxBatch({
    store: storeHarness.store,
    broker,
    policy,
    clock: { now: () => now },
    observer: observerHarness.observer,
  });

  assert.equal(brokerCalls.length, 2);
  assert.equal(brokerCalls[0].messageId, "msg-1");
  assert.equal(brokerCalls[1].messageId, "msg-1");
  assert.equal(storeHarness.published.length, 1);
});
