# Order Operations — Architecture Fitness Checklist

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 19. Questo documento collega architectural intent, meccanismi di verifica, evidence, owner e review trigger. Non è una checklist universale di best practice.

## Principle

> **Il buon guardrail blocca il drift. Non blocca l'evoluzione intenzionale.**

## Status vocabulary

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Additional states:

```text
At Risk
Exception Active
Review Required
```

## Executable structural fitness

| ID | Property | Why | Mechanism | Failure action | Owner | Current state | Review trigger |
|---|---|---|---|---|---|---|---|
| AF-001 | `src/` non importa direttamente Operations Desk Classic | evitare legacy leakage | `tests/architecture-fitness.test.mjs` | fail local/PR gate | Commerce & Operations | Codified | legacy retirement / coexistence redesign |
| AF-002 | `src/application` non dipende da `src/integration` | mantenere dependency direction | architecture test | fail gate | Commerce & Operations | Codified | application boundary redesign |
| AF-003 | `src/contracts` non dipende da application/integration/observability/priority | mantenere contract boundary indipendente | architecture test | fail gate | Commerce & Operations | Codified | contract packaging redesign |
| AF-004 | `src/priority` non dipende da integration/observability | mantenere policy isolata e testabile | architecture test | fail gate | Commerce & Operations | Codified | priority capability redesign |
| AF-005 | application/contracts/priority non importano package `@azure/*` | evitare vendor leakage nella semantica core | architecture test | fail gate | Commerce & Operations + Platform | Codified | explicit cloud-coupling decision |

## Functional / domain fitness

| ID | Property | Mechanism | State | Owner / trigger |
|---|---|---|---|---|
| AF-FUN-01 | business rule nuova passa dalla Functional Analysis | review + requirements trace | Designed / practiced | Product + Engineering; trigger: new behavior |
| AF-FUN-02 | legacy behavior non diventa requirement senza `Confirmed` | Legacy Understanding Map | Codified/documented | Product/Operations |
| AF-FUN-03 | Payments mantiene ownership della semantica economica | API/event/data ownership review | Designed | Payments & Risk; trigger: economic action |

## Data fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-DATA-01 | ogni persisted business fact ha owner esplicito | Data Ownership Map + schema review | Designed | new table/copy |
| AF-DATA-02 | derived copy dichiara source, freshness e reconciliation | Data Ownership Map | Designed | first async projection |
| AF-DATA-03 | migration chain verificata su PostgreSQL reale | integration suite | Designed / Pending | before production readiness |

## Security fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-SEC-01 | production ingress private | Bicep + future connectivity/drift verification | Codified, not Azure-Verified | public/partner/mobile ingress |
| AF-SEC-02 | runtime identity ≠ deployment identity | IaC/RBAC review + negative test | Designed/Codified partially | identity/topology change |
| AF-SEC-03 | no production secret in repo | secure-SDLC scanning direction | Designed / Pending automated gate | pipeline implementation |
| AF-SEC-04 | tenant boundary preserved | application negative tests + future authenticated integration | locally exercised, boundary verification Pending | auth model change |

## Reliability fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-REL-01 | core journey SLO 99.9% / 28d | runtime SLI | Designed / not Monitored | production telemetry |
| AF-REL-02 | escalation publication 99% <= 5m | `publishedAt-requestedAt` | Designed / not Monitored | production telemetry |
| AF-REL-03 | region disaster RTO <= 8h, RPO <= 1h | recovery drill | Designed / Pending | readiness / architecture change |
| AF-REL-04 | retries bounded | unit/component tests | Codified + locally Verified | retry policy change |

> I valori quantitativi sono requirement simulati ESI, non benchmark industriali.

## Observability fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-OBS-01 | metric dimensions bounded | telemetry type contract + tests | Codified + locally exercised | telemetry adapter/change |
| AF-OBS-02 | critical journey correlation preservata | telemetry contract | Codified at application boundary | adapter implementation |
| AF-OBS-03 | critical alert ha owner/action/runbook | alert review/drill | Designed / Pending | alert creation/readiness |
| AF-OBS-04 | telemetry cost/cardinality governati | cardinality budget + cost review | Designed | cost/cardinality growth |

## Testing fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-TST-01 | risk critico mappa a evidence layer appropriato | Testing Strategy | Codified/documented | risk/topology change |
| AF-TST-02 | flaky test trattato come defect | suite policy | Designed | first flakiness |
| AF-TST-03 | local test non promuove boundary esterno a Verified | evidence audit | Practiced | every evidence claim |

## Evolution fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-EVO-01 | ADR significativo ha review trigger | ADR review | Partially Codified | new/updated ADR |
| AF-EVO-02 | architecture exception ha owner + expiry | exception policy | Designed | first exception |
| AF-EVO-03 | migration include cleanup/removal stage | Refactoring Safety Plan | Codified | every migration |
| AF-EVO-04 | expected shadow difference pre-authorized | Safety Plan + test | Codified + locally Verified for ED-001 | new expected difference |

## Cost fitness

| ID | Property | Mechanism | State | Trigger |
|---|---|---|---|---|
| AF-COST-01 | managed capability nuova dichiara costo/trade-off | ADR / Compromise Ledger | Practiced | new paid capability/tier |
| AF-COST-02 | security/reliability premium cost resta reviewable | FinOps review direction | Designed | spend data / chapter 20 |

## Architecture exception policy

Una eccezione temporanea deve dichiarare:

```text
Exception ID
Fitness rule violated
Reason
Alternatives considered
Risk accepted
Owner
Evidence
Expiry/review date
Removal condition
```

No generic inline `architecture-ignore` is accepted by the current executable gate.

## Fitness portfolio review

Periodically ask:

1. quale rule ha intercettato drift utile?
2. quale è diventata rumorosa?
3. quale protegge un'assunzione obsoleta?
4. quale rischio importante dipende ancora soltanto dalla memoria?
5. quale fitness function può essere rimossa?

## Sources

- [Thoughtworks — Building Evolutionary Architectures, 2nd Edition](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition)
- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)
- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)
- [Microsoft Learn — Azure Well-Architected Framework workloads](https://learn.microsoft.com/en-us/azure/well-architected/workloads)
- [GitHub Engineering — SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

> **La checklist non certifica che l'architettura sia buona. Rende visibili le proprietà che abbiamo deciso di proteggere e l'evidence che abbiamo — o che ci manca — per sostenerle.**
