# Order Operations — Legacy Understanding Map

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 17. Questo documento governa la comprensione della capability `legacy case priority routing` di **Operations Desk Classic** prima di qualunque refactoring o migrazione.

## Purpose

Ridurre l'incertezza necessaria per decidere se e come Order Operations debba assorbire, sostituire o eliminare la semantica di priority routing del legacy.

Principio:

> **Comportamento osservato non significa requisito confermato.**

## System / capability

```text
System: Operations Desk Classic
Capability: legacy case priority routing
Current modernization state: discovery / characterization
```

Il sistema legacy vive in:

```text
capstone/example-software-industries/legacy/operations-desk-classic/
```

## Business outcome ipotizzato

La capability sembra ordinare o classificare alcuni case operativi per priorità.

Stato:

```text
Inferred
```

Manca ancora la conferma di Product/Operations su quale outcome business debba essere preservato nel sistema target.

## Entry point

### Priority routing module

```text
legacy/operations-desk-classic/src/priority-routing.cjs
```

Stato:

```text
Found
```

Il capstone non simula ancora l'intera UI/runtime legacy; caratterizza soltanto la slice in scope.

## Current observed behavior

Characterization suite:

```text
legacy/operations-desk-classic/tests/priority-routing.characterization.test.mjs
```

| ID | Scenario | Output corrente | Evidence state | Requirement state |
|---|---|---|---|---|
| LB-01 | `status_code=CLOSED` | `NONE` | Observed | Unknown |
| LB-02 | `manual_hold=1` | `MANUAL_REVIEW` | Observed | Unknown |
| LB-03 | `problem_code=PAY` + `failed_attempts>=3` | `URGENT` | Observed | Unknown |
| LB-04 | `customer_tier=ENTERPRISE` + age >= 30 min | `URGENT` | Observed | Unknown |
| LB-05 | Enterprise case before threshold | `STANDARD` | Observed | Unknown |
| LB-06 | ordinary open case | `STANDARD` | Observed | Unknown |

Questi test congelano il comportamento corrente della slice.

Non dichiarano che il comportamento sia corretto.

## Implicit precedence osservata

L'ordine corrente dei branch suggerisce questa precedence:

```text
CLOSED
> manual hold
> repeated payment failure
> enterprise age threshold
> standard
```

State:

```text
Observed in implementation + characterization for CLOSED precedence
```

Open question:

> questa precedence è intenzionale oppure un effetto dell'ordine storico del codice?

## State and data ownership

La narrativa ESI assume che Operations Desk Classic abbia storicamente usato uno shared operations database con campi equivalenti a:

```text
case_id
priority_code
priority_updated_at
manual_hold
```

Questa parte è **scenario/discovery hypothesis**, non ancora schema codificato nel capstone.

### Questions

- chi è il writer corrente di `priority_code`?
- esistono writer manuali o batch?
- `manual_hold` è business state o operational workaround?
- esiste audit delle modifiche?
- Order Operations deve diventare owner della priority oppure consumare una capability esterna?

## Dependencies

### Found

- priority routing source;
- characterization suite.

### Inferred / scenario

- shared operations database;
- nightly export consumer della priority;
- configuration per threshold/tenant behavior.

### Missing runtime evidence

- execution frequency;
- current active callers;
- production configuration;
- current export consumer;
- traffic/volume;
- owner mapping.

## Scheduled / temporal coupling

La narrativa del capitolo introduce un **nightly export** che potrebbe consumare la priority.

Stato:

```text
Inferred / scenario — non ancora implementato nel capstone
```

Prima della migration slice dobbiamo decidere se modellarlo con codice simulato oppure mantenerlo come external legacy consumer documentato.

## Consumers

| Consumer | State | Evidence needed |
|---|---|---|
| legacy operator UI | Inferred | runtime/caller evidence |
| nightly export | Inferred | job definition + consumer owner |
| downstream reporting | Inferred | report/source query evidence |
| Order Operations | Not current consumer | explicit modernization decision |

## Operational procedures

Unknown.

Discovery questions:

- esiste override manuale della priority?
- come viene ripristinato un case classificato male?
- esistono query SQL/manual runbook?
- chi viene chiamato quando l'export non completa?
- esiste un cut-off orario legato alla priority?

## Security / identity

Unknown per il legacy completo.

Quality floor per qualsiasi coexistence futura:

- tenant isolation;
- authenticated privileged action;
- audit per override sensibile;
- nessuna nuova secret statica introdotta nel target;
- ACL/adapter con input validation;
- legacy permission non propagate automaticamente a Order Operations.

## Evidence ledger

| Claim | Evidence | State | Owner candidate | Missing evidence |
|---|---|---|---|---|
| priority routing module esiste | source file | Found | Operations Desk Classic team / Commerce & Operations | runtime caller |
| closed case restituisce `NONE` | characterization test LB-01 | Observed | Operations | domain confirmation |
| manual hold restituisce `MANUAL_REVIEW` | LB-02 | Observed | Operations | meaning + owner confirmation |
| 3 failed payment attempts producono `URGENT` | LB-03 | Observed | Payments & Risk + Operations | business rationale |
| enterprise case >=30 min produce `URGENT` | LB-04 | Observed | Sales/Product/Operations | contract/SLA evidence |
| threshold 30 min è requisito corrente | only code | Inferred | Product/Sales | contract/current policy |
| priority alimenta nightly export | narrative discovery hypothesis | Inferred | Ops Data | job/query/runtime evidence |
| priority deve essere portata in Order Operations | modernization pressure only | Inferred | Product | explicit decision |

## Behavior classification backlog

Ogni behavior deve diventare uno dei seguenti prima della migration:

```text
Required
Compatibility
Accidental
Removed by explicit product decision
```

Current state:

| ID | Classification |
|---|---|
| LB-01 | Unknown |
| LB-02 | Unknown |
| LB-03 | Unknown |
| LB-04 | Unknown |
| LB-05 | consequence of LB-04; Unknown |
| LB-06 | Unknown/default |

## Candidate seams

### Candidate A — PriorityRouting port

Direzione possibile:

```text
Order Operations
→ PriorityRouting port
   ├── LegacyPriorityAdapter
   └── FutureOrderOperationsPriorityPolicy
```

Potential pattern:

```text
Branch by Abstraction
```

State:

```text
Candidate only
```

Non implementare finché la semantica non è classificata.

### Candidate B — Anti-Corruption Layer

Se Order Operations deve consumare priority legacy durante coexistence, il mapping deve isolare valori come:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

Il nuovo dominio non deve adottare automaticamente questi codici come proprio ubiquitous language.

## Migration risks

1. **Semantic fossilization** — copiare regole storiche non più richieste.
2. **Silent regression** — eliminare un behavior ancora business-critical.
3. **Hidden consumer breakage** — cambiare `priority_code` rompendo nightly/reporting consumer.
4. **Dual ownership** — vecchio e nuovo sistema scrivono priority contemporaneamente.
5. **Precedence change** — refactoring cambia l'ordine delle regole.
6. **Time semantics** — threshold basato su clock/timezone interpretato diversamente.
7. **Tenant/security drift** — legacy permission trasformate in nuove capability troppo ampie.
8. **Rollback gap** — nuovo sistema produce stato che il legacy non comprende.

## Rollback constraints

Da definire nel Refactoring Safety Plan del Capitolo 18.

Minimum questions:

```text
can traffic/caller return to legacy?
who remains source of truth during coexistence?
can new writes be read by legacy?
does rollback require data compensation?
what is the point of no return?
```

## Decision blockers

Prima di implementare la new priority policy servono almeno:

1. owner corrente della capability;
2. conferma semantica di LB-01…LB-06;
3. rationale del branch enterprise `>=30 min`;
4. consumer inventory della priority;
5. decisione su `manual_hold`;
6. source-of-truth durante coexistence;
7. rollback direction;
8. tenant/security requirements;
9. strategy per nightly export se ancora attivo.

## ESI compromise — Capitolo 17

**Esigenza:** ridurre costo/rischio di Operations Desk Classic e consolidare capability in Order Operations.

**Tensione:** retirement speed vs rischio di perdere comportamento non documentato vs rischio opposto di copiare accidental complexity nel nuovo prodotto.

**Decisione:** discovery + characterization + ownership/consumer confirmation prima di refactor/rewrite/cutover.

**Costo accettato:** il legacy rimane operativo più a lungo e sosteniamo temporaneamente effort di coexistence/discovery.

**Quality floor:** nessuna semantic regression silenziosa, tenant/security invarianti preservati, ownership non ambigua, rollback richiesto prima del cutover.

**Guardrail:** questa Legacy Understanding Map, characterization suite, evidence states, behavior classification backlog, candidate seam review e Refactoring Safety Plan futuro.

## Sources

- [Microsoft Learn — Assess your application modernization needs](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/assess/)
- [Microsoft Learn — Anti-Corruption Layer](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)
- [Microsoft Learn — Strangler Fig](https://learn.microsoft.com/it-it/azure/architecture/patterns/strangler-fig)
- [AWS Prescriptive Guidance — Branch by abstraction](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)
- [Microsoft Learn — IntelliTest characterization tests](https://learn.microsoft.com/en-us/visualstudio/test/intellitest-manual/)

> **La mappa non dice ancora come deve essere il nuovo sistema. Dice ciò che dobbiamo sapere prima di avere il diritto di deciderlo.**