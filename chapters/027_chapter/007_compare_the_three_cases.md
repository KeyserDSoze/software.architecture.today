# 7. Tre casi, un solo metodo

A questo punto abbiamo tre sistemi molto diversi.

Metterli uno accanto all'altro è più utile che studiarli separatamente.

## Confronto sintetico

| Dimensione | Campaign Launchpad | Priority Migration | Case Explanation Assistant |
|---|---|---|---|
| Tipo | greenfield piccolo | brownfield enterprise | AI-native feature |
| Business unit | Marketing Technology | Commerce & Operations | Commerce & Operations |
| Primary risk | publish/control | semantic regression | unsupported/unsafe interpretation |
| Primary owner | Marketing Technology | Commerce & Operations + Product/Operations | Commerce & Operations |
| External authority | Identity / Brand | legacy behavior + domain owners | Orders/Payments/Shipping facts |
| Architecture bias | managed/simple | coexistence/seam | bounded model boundary |
| Key evidence | publish/rollback/deploy | characterization/shadow | eval/runtime model evidence |
| Main rollback | publication version | legacy path | feature disable/fallback |
| Current topology pressure | low | migration complexity | model/provider boundary |

La tabella mostra una cosa importante.

Le parole del metodo restano:

```text
scope
ownership
quality
failure
trade-off
evidence
readiness
```

ma il contenuto cambia completamente.

## Modularity

Campaign Launchpad può avere pochi moduli.

La sua modularità protegge soprattutto:

```text
authoring
approval
publication
```

Nel brownfield la modularità serve a separare:

```text
target semantics
legacy compatibility
migration mechanism
```

Nell'AI Assistant serve a separare:

```text
deterministic context
model port
provider adapter
output validation
```

Stesso principio.

Boundary diversi.

## Data ownership

Campaign Launchpad possiede quasi tutto il proprio business state.

La Priority migration invece dipende dalla distinzione:

```text
legacy observed behavior
≠
target authoritative policy
```

L'AI Assistant deve vivere sopra più authoritative source senza diventare una di esse.

Quindi lo stesso concetto di ownership produce tre decisioni differenti.

> **Data ownership non significa sempre “quale database contiene il dato”. Significa chi ha il diritto di definire il significato del fatto.**

## Reliability

Campaign Launchpad può privilegiare static public delivery e rollback di publication.

La Priority migration privilegia rollback semantico verso la legacy implementation.

L'AI Assistant privilegia fallback:

```text
assistant unavailable
→ core product remains usable
```

Non esiste una tecnica universale chiamata `resilience`.

Esistono failure diversi che chiedono recovery diversi.

## Security

Campaign Launchpad:

```text
internal authoring
public publishing
```

Il confine principale è fra chi può modificare e chi può leggere.

Priority migration:

```text
no new external security boundary
```

ma la coexistence deve evitare accessi illeciti al legacy e conservare tenant/domain rule.

AI Assistant:

```text
prompt injection
cross-tenant context
provider data boundary
future tool permission
```

Qui la security riguarda anche **quale informazione consegniamo al modello e quale potere gli diamo dopo**.

## Observability

Campaign Launchpad deve sapere:

```text
publish succeeded?
public artifact available?
rollback succeeded?
```

La Priority migration deve sapere:

```text
legacy vs candidate match?
expected difference?
unexpected difference?
```

L'AI Assistant deve sapere:

```text
which model/config?
latency?
source support?
fallback?
eval/runtime quality drift?
```

Una dashboard comune di CPU e request count non sostituirebbe nessuna delle tre observability requirement.

## Testing

Campaign Launchpad:

```text
workflow/state tests
publish/rollback E2E
identity negative test
```

Priority migration:

```text
characterization
target policy
shadow classification
```

AI Assistant:

```text
deterministic boundary tests
versioned eval
security eval
real model comparison
```

Questo è il motivo per cui nel Capitolo 16 abbiamo evitato di trasformare una piramide in una legge universale.

## Cost

Anche i cost driver sono differenti.

Campaign Launchpad:

```text
managed hosting
public traffic
storage
small serverless execution
```

Priority migration:

```text
coexistence cost
migration telemetry
legacy operation
extra verification
```

AI Assistant:

```text
model inference
context size
retry
provider
human verification
rework
```

> **Il costo è sempre una proprietà del comportamento che stiamo comprando, non soltanto della risorsa che appare in fattura.**

## Organization

Il primo caso può avere:

```text
one accountable lead
+ Marketing owner
+ platform/security leverage
```

Il brownfield richiede inevitabilmente una conoscenza distribuita:

```text
Product
Operations
legacy maintainer
Engineering
```

L'AI Assistant richiede inoltre:

```text
Product usefulness
Security/provider review
potential Legal/Privacy review
FinOps
```

Quindi neppure il miglior agente rende uguale l'organizzazione necessaria per sistemi diversi.

## Fit before fashion, end-to-end

Se il libro avesse una sola regola tecnica, sarebbe facile.

Ma la regola più importante è decisionale:

> **Non chiedere quale soluzione è più moderna. Chiedi quale soluzione ha il fit migliore con il problema reale e quale evidence ci autorizza a mantenerla.**

Campaign Launchpad ci mostra che una soluzione piccola può essere matura.

Priority migration ci mostra che mantenere temporaneamente il legacy può essere più responsabile che eliminarlo.

Case Explanation Assistant ci mostra che limitare l'AI può essere una feature architetturale, non una mancanza di ambizione.

## I casi reali come evidence, non come template

Anche le fonti reali del capitolo vanno lette così.

### Microsoft

Azure Static Web Apps documenta una capability gestita per static/full-stack web application con integrazione repository e API serverless:

- https://learn.microsoft.com/en-us/azure/static-web-apps/overview

Non significa:

```text
small web product
→ always Static Web Apps
```

### GitHub

GitHub documenta dual boot e rollout incrementale nel proprio upgrade Rails:

- https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/

Non significa:

```text
legacy migration
→ always dual boot
```

### Uber

Uber documenta golden set, RAG/agentic-RAG e evaluation nel proprio copilot interno:

- https://www.uber.com/us/en/blog/enhanced-agentic-rag/

Non significa:

```text
AI application
→ always RAG
```

La fonte reale dimostra che una proprietà o un problema è stato affrontato nel mondo reale.

Il nostro metodo decide se quella proprietà conta nel nostro sistema.

> **Studiare una grande architettura non significa copiarla. Significa imparare quali domande il suo contesto ha costretto qualcuno a fare.**