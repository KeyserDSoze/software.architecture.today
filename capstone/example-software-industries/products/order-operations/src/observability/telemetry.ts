export type EnvironmentName = "dev" | "staging" | "prod";

export type OperationResult =
  | "accepted"
  | "already-accepted"
  | "rejected"
  | "failed";

export type PublishFailureClass =
  | "TransientBrokerUnavailable"
  | "AuthorizationFailure"
  | "Timeout"
  | "Unknown";

/**
 * Metric attributes must remain bounded by design.
 *
 * Business identifiers such as caseId, escalationId, messageId, userId and
 * traceId deliberately do not belong here. They can exist in correlated
 * diagnostic/audit events without becoming metric dimensions.
 */
export interface BoundedMetricContext {
  readonly environment: EnvironmentName;
  readonly serviceVersion: string;
}

export interface CorrelationContext {
  readonly traceId?: string;
  readonly correlationId?: string;
  readonly caseId?: string;
  readonly escalationId?: string;
  readonly messageId?: string;
}

export interface PaymentEscalationAcceptedMetric {
  readonly result: Extract<OperationResult, "accepted" | "already-accepted">;
  readonly durationMs: number;
}

export interface PublishFailureEvent {
  readonly failureClass: PublishFailureClass;
  readonly attempt: number;
  readonly correlation: CorrelationContext;
}

export interface OutboxBacklogSnapshot {
  readonly pending: number;
  readonly oldestAgeMs: number;
}

/**
 * Application-level telemetry contract.
 *
 * An OpenTelemetry/Application Insights adapter can implement this port later.
 * The application model does not depend directly on a telemetry vendor SDK.
 */
export interface OrderOperationsTelemetry {
  paymentEscalationAccepted(
    context: BoundedMetricContext,
    measurement: PaymentEscalationAcceptedMetric,
    correlation: CorrelationContext,
  ): void;

  paymentEscalationRejected(
    context: BoundedMetricContext,
    reasonClass:
      | "NotFound"
      | "TenantScope"
      | "WrongCategory"
      | "ConflictingIntent",
    correlation: CorrelationContext,
  ): void;

  outboxPublishSucceeded(
    context: BoundedMetricContext,
    durationMs: number,
    correlation: CorrelationContext,
  ): void;

  outboxPublishFailed(
    context: BoundedMetricContext,
    event: PublishFailureEvent,
  ): void;

  observeOutboxBacklog(
    context: BoundedMetricContext,
    snapshot: OutboxBacklogSnapshot,
  ): void;
}

/**
 * A no-op implementation keeps telemetry optional at composition time while
 * preserving a stable application contract. Production composition should
 * replace it with a verified adapter.
 */
export const noOpTelemetry: OrderOperationsTelemetry = {
  paymentEscalationAccepted: () => {},
  paymentEscalationRejected: () => {},
  outboxPublishSucceeded: () => {},
  outboxPublishFailed: () => {},
  observeOutboxBacklog: () => {},
};
