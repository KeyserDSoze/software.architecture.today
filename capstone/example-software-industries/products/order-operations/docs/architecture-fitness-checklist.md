# Order Operations — Architecture Fitness Checklist

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 21. Questo documento collega architectural intent, meccanismi di verifica, evidence, owner e review trigger. Non è una checklist universale di best practice.

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
| AF-001 | `src/` non importa direttamente Operations Desk Classic | evitare legacy leakage | `tests/architecture-fitness.test.mjs` | fail local/PR gate | Commerce & Operations | Codified + locally Verified | legacy retirement / coexistence redesign |
| AF-002 | `src/application` non dipende da `src/integration` | mantenere dependency direction | architecture test | fail gate | Commerce & Operations | Codified + locally Verified | application boundary redesign |
| AF-003 | `src/contracts` non dipende da application/integration/observability/priority | mantenere contract boundary indipendente | architecture test | fail gate | Commerce & Operations | Codified + locally Verified | contract packaging redesign |
| AF-004 | `src/priority` non dipende da integration/observability | mantenere policy isolata e testabile | architecture test | fail gate | Commerce & Operations | Codified + locally Verified | priority capability redesign |
| AF-005 | application/contracts/priority non importano package `@azure/*` | evitare vendor leakage nella semantica core | architecture test | fail gate | Commerce & Operations + Platform | Codified + locally Verified | explicit cloud-coupling decision |

### Verification evidence — Capitolo 19

```text
node --test tests/architecture-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

Questa evidence verifica soltanto le dependency/import rule AF-001…AF-005.

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
| AF-OBS-04 | telemetry cost/cardinality governati | cardinality budget + Cost Model | Designed | cost/cardinality growth |

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
| AF-COST-01 | managed capability nuova dichiara costo/trade-off | ADR / Compromise Ledger / Cost Model | Practiced | new paid capability/tier |
| AF-COST-02 | security/reliability premium cost resta reviewable | Cost Model + relevant quality artifact | Designed + documented | billing evidence / quality requirement change |
| AF-COST-03 | workload/owner/environment allocation metadata non spariscono dall'IaC | `tests/cost-fitness.test.mjs` | Codified + locally exercised | IaC tagging/allocation redesign |
| AF-COST-04 | il libro non inventa un `cost-center` hardcoded | `tests/cost-fitness.test.mjs` + Finance mapping boundary | Codified + locally exercised | real/simulated finance mapping becomes explicit |
| AF-COST-05 | unit metric viene letta insieme alla quality metric relativa | `docs/cost-model.md` review | Designed | first production billing/unit metric |
| AF-COST-06 | quality-changing cost cut riapre l'artefatto di qualità | architecture review | Designed | any optimization that changes security/SLO/recovery/observability boundary |

### Verification evidence — Capitolo 20

```text
CF-001 workload / owner / environment metadata
CF-002 no fabricated hard-coded cost-center
→ 2 tests
→ 2 pass
→ 0 fail
```

Questa evidence non dimostra billing Azure, allocation correctness nel provider, forecast, budget o unit economics reali.

## Repository context / agent readiness fitness

| ID | Property | Why | Mechanism | State | Trigger |
|---|---|---|---|---|---|
| AF-CTX-01 | esiste un entry point operativo `AGENTS.md` | ridurre rediscovery e tribal knowledge | `tests/agent-context-fitness.test.mjs` | Codified + locally exercised | agent workflow/context redesign |
| AF-CTX-02 | esiste `docs/repository-map.md` | rendere navigabili responsabilità e knowledge source | context fitness | Codified + locally exercised | top-level structure/capability change |
| AF-CTX-03 | i documenti canonical referenziati dal context layer esistono | evitare instruction link stale | context fitness | Codified + locally exercised | doc rename/retirement |
| AF-CTX-04 | `typecheck` e `test` dichiarati come golden command esistono nel package | evitare execution instructions non riproducibili | context fitness | Codified + locally exercised | build/test script change |
| AF-CTX-05 | il context layer preserva `Designed→Codified→Verified→Monitored` | impedire claim di evidence gonfiati | context fitness + review | Codified + locally exercised mechanically | evidence model change |
| AF-CTX-06 | instruction file resta routing layer, non duplicazione dei documenti canonical | ridurre instruction drift/context pollution | human review | Designed / practiced | AGENTS.md growth or duplication |
| AF-CTX-07 | stop condition coprono boundary business/security/one-way-door principali | limitare task amplification e unauthorized decision | `AGENTS.md` review | Codified/documented | new critical boundary |
| AF-CTX-08 | nessuna instruction autorizza secret/production permission implicitamente | capability ≠ authorization | security review / future automated scanning | Codified/documented; automated gate Pending | agent tool/permission model change |

### Verification evidence — Capitolo 21

La struttura reale dei documenti canonical è stata verificata nel repository.

La logica del nuovo context fitness test è stata eseguita localmente su una ricostruzione della current operating context:

```text
CTX-001 agent entry point + Repository Map
CTX-002 canonical document existence
CTX-003 golden package scripts
CTX-004 routing + evidence vocabulary
→ 4 tests
→ 4 pass
→ 0 fail
```

Questa evidence dimostra soltanto proprietà meccaniche del context layer. Non dimostra che una instruction sia semanticamente corretta, non stale o sufficiente per ogni task.

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
6. quale premium di costo non sappiamo più collegare a una proprietà?
7. quale informazione stabile viene ancora riscoperta da ogni nuovo contributor/agent?
8. quale instruction sta duplicando una source of truth invece di indirizzare verso di essa?

## Sources

- [Thoughtworks — Building Evolutionary Architectures, 2nd Edition](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition)
- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)
- [Microsoft Learn — Azure Well-Architected Framework workloads](https://learn.microsoft.com/en-us/azure/well-architected/workloads)
- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)
- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)
- [GitHub Docs — Customize Copilot for your project](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-copilot-overview)
- [GitHub Docs — Support for custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/)
- [AGENTS.md — open format](https://agents.md/)

> **La checklist non certifica che l'architettura sia buona. Rende visibili le proprietà che abbiamo deciso di proteggere e l'evidence che abbiamo — o che ci manca — per sostenerle.**