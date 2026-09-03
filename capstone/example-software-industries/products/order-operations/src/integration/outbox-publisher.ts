export interface PendingOutboxMessage {
  readonly messageId: string;
  readonly messageType: string;
  readonly schemaVersion: number;
  readonly payload: unknown;
  readonly occurredAt: Date;
  readonly attemptCount: number;
}

export interface OutboxStore {
  nextBatch(input: {
    readonly limit: number;
    readonly now: Date;
  }): Promise<readonly PendingOutboxMessage[]>;

  markPublished(input: {
    readonly messageId: string;
    readonly publishedAt: Date;
  }): Promise<void>;

  recordFailure(input: {
    readonly messageId: string;
    readonly attemptCount: number;
    readonly nextAttemptAt: Date;
    readonly error: string;
  }): Promise<void>;
}

export interface MessageBroker {
  publish(input: {
    readonly messageId: string;
    readonly messageType: string;
    readonly schemaVersion: number;
    readonly payload: unknown;
  }): Promise<void>;
}

export interface OutboxPublisherPolicy {
  readonly batchSize: number;
  readonly maxAttempts: number;
  nextDelayMs(input: {
    readonly attempt: number;
    readonly messageId: string;
  }): number;
}

export interface OutboxPublisherClock {
  now(): Date;
}

export interface OutboxPublisherObserver {
  published(messageId: string): void;
  failed(input: {
    readonly messageId: string;
    readonly attempt: number;
    readonly error: unknown;
  }): void;
  exhausted(input: {
    readonly messageId: string;
    readonly attempt: number;
    readonly error: unknown;
  }): void;
}

export class OutboxDeliveryExhaustedError extends Error {
  constructor(
    readonly messageId: string,
    readonly attempts: number,
    options?: ErrorOptions,
  ) {
    super(`Outbox delivery exhausted for ${messageId} after ${attempts} attempts.`, options);
  }
}

export async function publishOutboxBatch(input: {
  readonly store: OutboxStore;
  readonly broker: MessageBroker;
  readonly policy: OutboxPublisherPolicy;
  readonly clock: OutboxPublisherClock;
  readonly observer: OutboxPublisherObserver;
}): Promise<void> {
  const now = input.clock.now();
  const batch = await input.store.nextBatch({
    limit: input.policy.batchSize,
    now,
  });

  for (const message of batch) {
    const attempt = message.attemptCount + 1;

    try {
      // The same messageId is reused on every attempt. A broker acknowledgement
      // can be lost after the broker accepted the message, so a later run may
      // publish this message again. Downstream consumers must be idempotent.
      await input.broker.publish({
        messageId: message.messageId,
        messageType: message.messageType,
        schemaVersion: message.schemaVersion,
        payload: message.payload,
      });

      await input.store.markPublished({
        messageId: message.messageId,
        publishedAt: input.clock.now(),
      });

      input.observer.published(message.messageId);
    } catch (error) {
      input.observer.failed({
        messageId: message.messageId,
        attempt,
        error,
      });

      if (attempt >= input.policy.maxAttempts) {
        // We deliberately do not delete the outbox row here. A production
        // adapter can move it to a dead-letter/quarantine path or mark it for
        // manual recovery while preserving its stable identity and payload.
        input.observer.exhausted({
          messageId: message.messageId,
          attempt,
          error,
        });

        throw new OutboxDeliveryExhaustedError(
          message.messageId,
          attempt,
          error instanceof Error ? { cause: error } : undefined,
        );
      }

      const delayMs = input.policy.nextDelayMs({
        attempt,
        messageId: message.messageId,
      });

      await input.store.recordFailure({
        messageId: message.messageId,
        attemptCount: attempt,
        nextAttemptAt: new Date(input.clock.now().getTime() + delayMs),
        error: sanitizeError(error),
      });
    }
  }
}

function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Persist a bounded technical summary, not stack traces or arbitrary
    // downstream payloads that might contain sensitive information.
    return `${error.name}: ${error.message}`.slice(0, 1024);
  }

  return "Unknown publish failure";
}
