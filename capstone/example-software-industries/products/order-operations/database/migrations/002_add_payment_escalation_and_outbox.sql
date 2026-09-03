-- Order Operations — migration 002
-- Scenario fittizio ESI.
--
-- Capitolo 11: introduce la prima integrazione asincrona del capstone.
-- La transazione locale salva:
--   1. la PaymentEscalation, posseduta da Order Operations;
--   2. l'intenzione di pubblicare il relativo evento nella outbox.
--
-- Non vengono copiati PaymentStatus, provider state o altre informazioni
-- economiche possedute da Payments & Risk.

CREATE TABLE operations.payment_escalation (
    escalation_id uuid PRIMARY KEY,
    case_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    reason_code varchar(96) NOT NULL,
    requested_by varchar(128) NOT NULL,
    requested_at timestamptz NOT NULL,
    status varchar(32) NOT NULL DEFAULT 'Requested',
    delivery_state varchar(32) NOT NULL DEFAULT 'Pending',
    delivered_at timestamptz,
    updated_at timestamptz NOT NULL,

    CONSTRAINT payment_escalation_case_fk
        FOREIGN KEY (case_id)
        REFERENCES operations.operational_case (id),

    CONSTRAINT payment_escalation_status_chk
        CHECK (status IN ('Requested')),

    CONSTRAINT payment_escalation_delivery_state_chk
        CHECK (delivery_state IN ('Pending', 'Delivered', 'Delayed', 'DeadLettered')),

    CONSTRAINT payment_escalation_delivered_at_chk
        CHECK (
            (delivery_state = 'Delivered' AND delivered_at IS NOT NULL)
            OR
            (delivery_state <> 'Delivered' AND delivered_at IS NULL)
        )
);

-- Nel modello corrente un OperationalCase può avere al massimo una
-- PaymentEscalation attiva. Se il dominio introdurrà close/reopen o escalation
-- multiple nel tempo, questa constraint dovrà essere evoluta esplicitamente.
CREATE UNIQUE INDEX payment_escalation_case_unique_idx
    ON operations.payment_escalation (case_id);

CREATE INDEX payment_escalation_tenant_requested_idx
    ON operations.payment_escalation (tenant_id, requested_at, escalation_id);

CREATE TABLE operations.outbox_message (
    message_id uuid PRIMARY KEY,
    message_type varchar(128) NOT NULL,
    schema_version integer NOT NULL,
    aggregate_type varchar(64) NOT NULL,
    aggregate_id uuid NOT NULL,
    correlation_id varchar(128),
    payload jsonb NOT NULL,
    occurred_at timestamptz NOT NULL,
    published_at timestamptz,
    attempt_count integer NOT NULL DEFAULT 0,
    next_attempt_at timestamptz NOT NULL,
    last_error varchar(1024),

    CONSTRAINT outbox_schema_version_chk
        CHECK (schema_version > 0),

    CONSTRAINT outbox_attempt_count_chk
        CHECK (attempt_count >= 0)
);

-- Access pattern del polling publisher:
-- recuperare il prossimo batch non pubblicato il cui retry è già eleggibile.
CREATE INDEX outbox_pending_next_attempt_idx
    ON operations.outbox_message (next_attempt_at, occurred_at, message_id)
    WHERE published_at IS NULL;

-- La business transaction che crea una escalation deve inserire nello stesso
-- commit anche il corrispondente outbox_message.
--
-- La outbox garantisce durability dell'intenzione di pubblicare; non garantisce
-- delivery exactly-once end-to-end. Il publisher può ripubblicare lo stesso
-- message_id dopo failure o acknowledgement incerti e il consumer downstream
-- deve trattare escalation_id/message_id con semantica idempotente.