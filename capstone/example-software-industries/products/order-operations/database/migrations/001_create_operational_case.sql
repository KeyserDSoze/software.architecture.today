-- Order Operations — migration 001
-- Scenario fittizio ESI.
--
-- Introduce soltanto dati posseduti da Order Operations.
-- Non copia ancora OrderStatus, PaymentStatus o ShipmentStatus.
--
-- Questa migration è volutamente piccola: tenant enforcement, audit completo,
-- retention e projection asincrona verranno introdotti quando i requisiti
-- corrispondenti saranno espliciti nel percorso del libro.

CREATE SCHEMA IF NOT EXISTS operations;

CREATE TABLE operations.operational_case (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    order_id varchar(64) NOT NULL,
    problem_category varchar(64) NOT NULL,
    assigned_to varchar(128),
    detected_at timestamptz NOT NULL,
    assigned_at timestamptz,
    updated_at timestamptz NOT NULL,
    version bigint NOT NULL DEFAULT 0,

    CONSTRAINT operational_case_assignment_time_chk
        CHECK (assigned_to IS NOT NULL OR assigned_at IS NULL)
);

-- Access pattern corrente:
-- coda di un tenant ordinata per anzianità del caso.
-- Questo indice è una prima ipotesi di design e dovrà essere verificato
-- sul workload reale con query plan e metriche prima di aggiungere altri index.
CREATE INDEX operational_case_tenant_detected_idx
    ON operations.operational_case (tenant_id, detected_at, id);

-- L'assegnazione concorrente verrà implementata come update condizionale
-- o meccanismo equivalente. Il campo version permette inoltre di valutare
-- optimistic concurrency per evoluzioni future senza rendere questa scelta
-- obbligatoria per ogni operazione.