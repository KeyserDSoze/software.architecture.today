# Source & Factual Audit

Questo file traccia due revisioni distinte:

1. **Evidence pass** — claim fattuali, proprietà tecnologiche, standard, casi reali e raccomandazioni vengono confrontati con fonti appropriate.
2. **ESI compromise pass** — il capitolo rende leggibile almeno un compromesso con esigenza, tensione, decisione, costo, quality floor, guardrail ed eventuali trigger.

Scenario fittizio ufficiale:

> **Example Software Industries S.p.A. — ESI**

Capstone principale:

> **Order Operations** — Commerce & Operations.

Brownfield simulato introdotto dal Capitolo 17:

> **Operations Desk Classic**.

I casi reali rimangono separati da ESI.

## Stato corrente

| Capitolo | Draft | Evidence pass | ESI compromise pass | Nota |
|---|---:|---:|---:|---|
| 0 — Al timone | sì | da fare | sì — draft | agent autonomy vs accountability |
| 1 — Il software è cambiato | sì | da fare | sì — draft | velocity vs understanding |
| 2 — Prima del codice | sì | parziale | sì — draft | functional analysis condivisa |
| 3 — Pensare per sistemi | sì | da fare | sì — draft | completezza/freshness vs simplicity |
| 4 — Software Architecture | sì | da fare | sì — draft | live lookup vs async read model |
| 5 — Dalle feature ai confini | sì | da fare | sì — draft | shared infra vs ownership |
| 6 — Qualità prima della tecnologia | sì | parziale | sì — draft | fit before fashion |
| 7 — Pattern senza religione | sì | da fare | sì — draft | robustness vs complexity debt |
| 8 — Il monolite non è il nemico | sì | da fare | sì — draft | isolation vs distribution cost |
| 9 — API e contratti | sì | sì — draft | sì — draft | source-first, compatibility/idempotency |
| 10 — I dati sono architettura | sì | sì — draft | sì — draft | Microsoft/PostgreSQL/Redis/Stripe/GitHub |
| 11 — Sistemi distribuiti | sì | sì — draft | sì — draft | Microsoft/AWS/Uber; outbox/idempotency/failure |
| 12 — Cloud Architecture | sì | sì — draft | sì — draft | Microsoft/AWS/dacadoo; cloud-appropriate |
| 13 — Security by Design | sì | sì — draft | sì — draft | Microsoft/NIST/OWASP/Cloudflare |
| 14 — Reliability | sì | sì — draft | sì — draft | Google SRE/Microsoft/GitHub/Cloudflare |
| 15 — Observability | sì | sì — draft | sì — draft | OpenTelemetry/Google SRE/Microsoft |
| 16 — Testing Architecture | sì | sì — draft | sì — draft | Microsoft/Google/Meta/OWASP/Pact |
| 17 — Legacy e comprensione | sì | sì — draft | sì — draft | Microsoft/AWS/GitHub; characterization/evidence provenance |
| 18 — Refactoring nell'era dell'AI | sì | sì — draft | sì — draft | AWS/Microsoft/GitHub/OpenRewrite; Branch by Abstraction, safe rollout, state migration, agentic modernization, Refactoring Safety Plan |
| 19+ | non ancora | source-first | required | research + ESI compromise + capstone update before closure |

## Evidence vocabulary

Per artefatti/capability:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Per conoscenza legacy:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Le due scale sono indipendenti.

Esempio:

```text
characterization test = Codified + Verified
legacy behavior = Observed
business requirement = Confirmed only after explicit functional decision
```

## Verification status — infrastructure

`infra/main.bicep` è una baseline codificata.

Ancora pending:

```text
bicep build/lint
Azure Policy validation
non-production deployment
private connectivity
Entra authentication
RBAC negative test
zone/failover test
PostgreSQL HA IaC completion
PostgreSQL PITR drill
```

Nessun capitolo descrive questi gate come già superati.

## Verification status — observability

```text
Observability Contract                       Designed
bounded telemetry port/decorator             Codified + typechecked
OpenTelemetry/Application Insights adapter   Pending
SLI queries/alerts/dashboard                 Designed / Pending
private synthetic journey                    Designed / Pending
runtime telemetry evidence                   Not available
```

## Verification status — testing before refactoring

Capitolo 16:

```text
tsc -p tsconfig.json
→ PASS

Order Operations node:test
→ 11/11 PASS
```

Capitolo 17:

```text
Operations Desk Classic characterization
→ 6/6 PASS
```

Questi gate coprono soltanto il layer locale che attraversano.

## Verification status — Capitolo 18

Nuovi artefatti:

```text
products/order-operations/docs/priority-functional-analysis.md
products/order-operations/docs/refactoring-safety-plan.md
products/order-operations/src/priority/priority-policy.ts
products/order-operations/src/priority/confirmed-priority-policy.ts
products/order-operations/src/priority/legacy-priority-adapter.ts
products/order-operations/src/priority/branching-priority-policy.ts
products/order-operations/tests/priority-policy.test.mjs
```

Functional decision simulata ESI:

```text
Preserve:
Closed → NotActionable
manualHold → ManualReview
Payment failedAttempts >= 3 → Urgent
otherwise → Standard

Intentional removal:
legacy Enterprise + age >=30m → URGENT
→ ED-001 ExpectedDifference
```

La decisione è stata inserita anche nel `functional-analysis.md` principale, quindi non resta una deduzione del codice.

### Local verification performed

Il source corrente necessario al check è stato ricostruito localmente dal repository dopo le modifiche del Capitolo 18.

```text
tsc -p tsconfig.json
→ PASS

Order Operations node:test suite
→ 19 tests
→ 19 pass
→ 0 fail

Operations Desk Classic characterization
→ 6 tests
→ 6 pass
→ 0 fail
```

Dei 19 test Order Operations:

```text
11 existing application/outbox/observability tests
8 new priority/refactoring/shadow tests
```

Questa evidence supporta:

```text
PriorityPolicy seam                  Codified + Verified locally
ConfirmedPriorityPolicy              Codified + Verified locally
LegacyPriorityAdapter                Codified + Verified locally against legacy calculator
Branching/shadow classification      Codified + Verified locally
ED-001 local classification          Verified locally
legacy behavior LB-01..LB-06         still Observed + Verified locally
```

Non supporta ancora:

```text
production shadow telemetry
runtime mismatch distribution
candidate production cutover
real feature-flag provider
legacy caller/consumer retirement
priority data ownership/persistence
PostgreSQL integration semantics
Azure identity/network
performance/capacity
recovery
```

Questi restano `Designed/Pending` o non ancora autorizzati.

## Source pass — Capitolo 18

Principali fonti usate:

- AWS Prescriptive Guidance — Branch by Abstraction;
- Microsoft Azure Architecture Center — Strangler Fig / Anti-Corruption Layer;
- Microsoft Azure Well-Architected — safe deployment practices;
- Microsoft Learn — GitHub Copilot modernization workflow;
- GitHub Engineering — feature flags, persistent-data migration, rate-limiter backend migration, server-side hooks;
- OpenRewrite official documentation — automated refactoring/recipes.

Uso delle fonti:

- proprietà dei pattern e delle piattaforme → claim fattuali;
- casi GitHub → esempi reali documentati, separati da ESI;
- ESI priority semantics/ED-001 → scenario simulato, **non** claim derivato dalle fonti.

## Important distinction — Chapter 18

Due suite possono essere entrambe verdi e richiedere output differenti:

```text
legacy characterization:
Enterprise >=30m → URGENT

confirmed target policy:
Enterprise alone → Standard
```

Non è una contraddizione editoriale.

È il risultato intenzionale della distinzione:

```text
Observed legacy behavior
≠
Confirmed target requirement
```

ED-001 deve rimanere marcata come **simulated product decision**, non come best practice generale.

## Numeri simulati ESI

SLO/RTO/RPO del Capitolo 14 restano business requirement simulati:

```text
Core journey SLO: 99.9% / rolling 28 days
Escalation publication: 99% <= 5 min
Intra-region RTO: <= 15 min
Intra-region RPO: 0 committed local state
Region disaster RTO: <= 8 h
Region disaster RPO: <= 1 h
```

La soglia priority:

```text
Payment failedAttempts >= 3 → Urgent
```

è anch'essa una policy simulata ESI, non un benchmark o standard.

## Workflow editoriale corrente

```text
outline
→ ESI tension / compromise framing
→ source discovery
→ draft
→ capstone update
→ executable verification where possible
→ claim audit
→ compromise audit
→ adversarial review
→ final editorial pass
```

Per brownfield/refactoring aggiungiamo:

```text
claim provenance
→ behavior classification
→ safety plan
→ intentional difference registry
→ stop condition / rollback review
```

## Evidence pass rules

Richiedono particolare attenzione e fonte:

- proprietà di tecnologie/protocolli;
- best practice presentate come tali;
- standard;
- limiti di prodotti;
- incidenti/casi aziendali;
- benchmark/numeri reali;
- affermazioni storiche;
- raccomandazioni che dipendono da evidence esterna.

Non ogni frase editoriale richiede citation, ma non usiamo un vendor case come prova universale.

## ESI compromise pass

Un capitolo supera il pass quando rende leggibili:

1. esigenza;
2. tensione;
3. decisione;
4. costo accettato;
5. quality floor;
6. guardrail;
7. evidence;
8. trigger di revisione.

## Release-candidate gates futuri

Prima di una release candidata del libro:

- nessun capitolo deve restare `da fare` nell'evidence pass;
- casi reali e ESI devono restare distinguibili;
- numeri ESI non devono essere presentati come benchmark;
- artefatti `Codified` non vanno descritti come `Verified` senza execution evidence;
- `Monitored` richiede runtime signal reale;
- temporary migration architecture deve avere cleanup condition;
- legacy behavior `Observed` non deve trasformarsi silenziosamente in requirement `Confirmed`.
