# 22.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 22 ha trasformato la issue da elemento di backlog a **boundary operativo fra decisione ed execution**.

Il repository del Capitolo 21 contiene ciò che resta vero fra molti task. Il work item aggiunge ciò che deve cambiare ora: outcome, scope, canonical context, acceptance, verification e punti in cui l'executor deve fermarsi.

La distinzione più importante non riguarda il formato del ticket. Riguarda il tipo di decisione che stiamo delegando.

Un task è execution-ready quando molte scelte locali possono essere lasciate all'executor senza costringerlo a inventare semantics, ownership o policy. Quando questo non è ancora possibile, il lavoro corretto può essere discovery.

Possiamo riassumere il flusso così:

```text
intent
→ current evidence
→ bounded work item
→ discovery or execution
→ acceptance property
→ verification evidence
→ closure
→ residual gaps / follow-up
```

La issue è buona quando rende questo percorso più chiaro, non quando contiene più campi.

## Le distinzioni che devono restare

**Problem e Outcome** non sono sinonimi: il primo spiega perché vale la pena cambiare qualcosa, il secondo descrive ciò che deve risultare vero.

**Scope e file list** non sono la stessa cosa: lo scope protegge il boundary semantico, mentre i path sono soltanto una possibile superficie tecnica.

**Acceptance e Verification** sono livelli diversi: la prima nomina la proprietà, la seconda il meccanismo che produce evidence.

**Discovery ed Execution** hanno output diversi: la discovery riduce uncertainty; l'execution modifica il sistema sulla base di uncertainty già abbastanza ridotta.

**Closure e project completion** non coincidono: un task può essere chiuso correttamente mentre restano gap espliciti fuori scope.

Infine, **stop condition e fallimento** non sono sinonimi. Fermarsi perché il task ha attraversato una nuova decisione è un comportamento corretto del sistema di delegazione.

> **Il work item non deve eliminare tutte le scelte. Deve eliminare soltanto quelle che l'executor non è autorizzato a inventare.**

## Artefatti operativi

Il capitolo introduce due artifact complementari nel capstone:

```text
work-items/TEMPLATE.md
→ struttura riusabile per Discovery / Execution

work-items/OO-001-postgresql-escalation-outbox-atomicity.md
→ prima istanza concreta
```

Il repository aggiunge inoltre:

```text
tests/issue-readiness-fitness.test.mjs
```

che protegge meccanicamente l'esistenza del contratto minimo, il routing verso il contesto canonical e il boundary dell'evidence.

Questa automation non dimostra che il task sia semanticamente perfetto. Dimostra soltanto ciò che può verificare senza fingere judgment.

## Esercizio 1 — Da richiesta vaga a execution contract

Parti da:

```text
Migliorare performance ricerca ordini.
```

Trasformala in un work item con `Problem`, `Outcome`, `Current evidence`, `Scope`, `Out of scope`, `Canonical context`, `Acceptance`, `Verification` e `Stop conditions`.

Poi verifica se hai definito davvero il critical journey e la metrica. Se hai prescritto Redis, un indice o una cache prima di conoscere il driver, riscrivi il task partendo dalla property.

## Esercizio 2 — Property o meccanismo?

Classifica queste frasi come **acceptance property**, **verification mechanism** oppure **ambigua**:

```text
p95 < 300 ms
k6 test verde
no duplicate economic effect after retry
100% code coverage
wrong tenant receives 403
Playwright suite passata
```

Per ogni frase ambigua scrivi prima la property e poi il meccanismo che potrebbe dimostrarla.

## Esercizio 3 — Discovery o execution?

Valuta questi lavori:

1. trovare tutti i consumer di un export legacy;
2. sostituire un consumer già confermato;
3. capire perché un indice cresce;
4. aggiungere un indice già giustificato da una decisione;
5. definire la semantica di partial refund;
6. implementare il contract dopo la decisione funzionale.

Per le discovery scrivi gli exit criteria: quale evidence renderebbe decidibile il task successivo?

## Esercizio 4 — Decomporre per evidence

Hai questo work item:

```text
Migrare Order Operations in una nuova region,
aggiungere failover automatico,
aggiornare routing,
creare runbook,
aggiungere alert,
eseguire il cutover.
```

Non dividerlo per team o directory. Dividilo per **evidence che abilita il passo seguente**. Identifica le one-way door e indica quali parti possono realmente procedere in parallelo.

## Esercizio 5 — Task amplification

Un agente riceve:

```text
Add an integration test for PostgreSQL atomicity.
```

Durante il lavoro scopre un typo, una dependency outdated, una migration semanticamente sospetta, una doc obsoleta e un possibile tenant-isolation bug.

Classifica ogni scoperta come:

```text
required for acceptance
follow-up
stop + escalate
```

La classificazione deve dipendere dal boundary del task, non dalla facilità con cui la modifica potrebbe essere aggiunta al diff.

## Esercizio 6 — Proteggere l'oracle

Immagina tre modi in cui un executor potrebbe ottenere un build verde cambiando il criterio che lo giudica invece del comportamento richiesto.

Per ciascuno scrivi quale elemento dovrebbe essere protetto nel work item e quale decisione servirebbe per modificarlo legittimamente.

## Esercizio 7 — Closure senza overclaim

Prendi una modifica già conclusa in un tuo progetto e scrivi retroattivamente:

```text
Outcome achieved
Evidence produced
Known limitations
Not verified
Follow-up
```

Poi confronta questo report con ciò che avevi dichiarato al momento del merge. Quanta confidence era evidence e quanta era inferenza?

## Esercizio 8 — Issue Form con budget di ceremony

Disegna un form per `Execution Task` con un massimo di sette campi obbligatori.

Per ogni campo spiega quale ambiguità riduce. Se non sai collegarlo a una decisione migliore, rimuovilo.

Ripeti l'esercizio per una `Discovery Issue`: dovresti ottenere domande differenti.

## Esercizio 9 — Due environment per OO-001

Confronta due modi di produrre PostgreSQL reale per l'integration test:

```text
Option A
local/containerized ephemeral PostgreSQL

Option B
shared integration environment
```

Valuta fidelity, reproducibility, feedback speed, credential surface, CI fit, cost, cleanup e contention.

Non scegliere la tecnologia più moderna. Scegli il meccanismo che compra l'evidence richiesta con il minor costo e blast radius compatibili con il task.

## Esercizio 10 — Red-team della issue con AI

Prima di delegare un work item, chiedi a un agente di **non implementarlo** e di cercare:

```text
decisioni che l'executor sarebbe costretto a inventare
acceptance non verificabile
scope ambiguo
missing canonical context
stop condition mancante
modo di diventare green senza soddisfare l'outcome
```

Confronta la review con quella di una persona che conosce il dominio. Le differenze sono esse stesse evidence sulla qualità del context layer.

## Autovalutazione

Dopo il capitolo dovresti saper prendere una richiesta vaga e decidere se richiede discovery o execution; formulare un outcome senza prescrivere inutilmente la soluzione; separare acceptance property e test command; riconoscere un task troppo grande attraverso la sua evidence surface; proteggere un oracle senza renderlo immutabile; descrivere una stop condition osservabile; e chiudere un work item senza promuovere a `Verified` ciò che la verification non ha attraversato.

Se per delegare un task devi ancora raccontare oralmente la metà delle decisioni, il repository o il work item non sono pronti. Se invece il ticket descrive ogni dettaglio implementativo, probabilmente hai spostato troppo judgment a monte.

La qualità sta nel boundary.

## Che cosa cambia con l'AI

Prima dei coding agent, un ticket ambiguo produceva spesso clarification latency. Un engineer si fermava, chiedeva, aspettava una risposta e poi ripartiva.

Con un executor capace l'ambiguità può produrre qualcosa di diverso:

```text
ambiguous intent
→ plausible interpretation
→ fast coherent implementation
→ late semantic correction
```

Questo rende più preziosi outcome, out of scope, canonical context, acceptance e stop condition. Non perché l'AI abbia bisogno di ticket più burocratici, ma perché rende molto più economico **eseguire l'interpretazione sbagliata**.

Allo stesso tempo l'AI può ridurre il costo di preparare il task: cercare context pointer, proporre decomposition, red-team dell'acceptance, sintetizzare evidence. La supervisione umana resta sul punto che conta: quali affermazioni diventano requirement e quale authority autorizza il cambiamento.

> **L'obiettivo non è descrivere ogni riga che l'agente deve scrivere. È rendere visibili le interpretazioni che non è autorizzato a fare.**

## Stato ESI dopo il Capitolo 22

Il progetto può ora affermare:

```text
Repository operating context      Codified
Work Item template                Codified
OO-001 execution contract         Codified
Issue-readiness fitness           Codified + locally verifiable
OO-001 execution                  Pending
PostgreSQL higher-fidelity proof  Pending
```

Questo è un avanzamento reale e deliberatamente incompleto.

Nel Capitolo 23 useremo questa unità di lavoro come base per una domanda nuova: non soltanto **che cosa affidiamo a un agente**, ma **come separiamo executor, verifier, permission e authority quando più agenti partecipano allo stesso cambiamento**.

## Corollario

> **Il repository dice all'executor in quale mondo si trova. Il work item dice quale parte di quel mondo può cambiare adesso e quale evidence renderà legittimo dichiarare il cambiamento concluso.**
