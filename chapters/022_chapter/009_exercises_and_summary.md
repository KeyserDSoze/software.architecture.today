# 22.9 — Esercizi, autovalutazione e sintesi

## Idee chiave

1. **La issue è un boundary fra decisione ed execution.**
2. Una issue execution-ready descrive problema, outcome, scope, acceptance, verification e stop condition.
3. **Acceptance criterion e verification non sono la stessa cosa.**
4. Una issue può essere chiara ma troppo grande.
5. Atomic task significa outcome coerente e verification relativamente autonoma, non necessariamente poche righe di codice.
6. Discovery issue ed execution issue producono output diversi.
7. **Out of scope è un controllo contro la task amplification.**
8. Una stop condition permette all'executor di fermarsi correttamente quando incontra una nuova decisione.
9. Un agente non dovrebbe poter soddisfare il task cambiando silenziosamente il proprio verification oracle.
10. Closure significa delimitare l'evidence prodotta, non scrivere semplicemente `Done`.

## Esercizio 1 — Da ticket a execution contract

Prendi questa issue:

```text
Migliorare performance ricerca ordini.
```

Riscrivila con:

```text
Problem
Outcome
Current state
Scope
Out of scope
Canonical context
Acceptance criteria
Verification
Constraints
Stop conditions
```

Poi chiediti:

- hai definito performance con una metrica?
- hai definito il journey?
- hai separato latency da throughput?
- hai già prescritto Redis senza dimostrarne il fit?

## Esercizio 2 — Acceptance vs verification

Per ciascuna frase stabilisci se è:

```text
property
verification mechanism
ambiguous
```

1. `p95 < 300 ms`.
2. `k6 test verde`.
3. `nessun duplicate economic effect dopo retry`.
4. `100% code coverage`.
5. `wrong tenant receives 403`.
6. `Playwright suite passata`.

Riscrivi le frasi che confondono property e mechanism.

## Esercizio 3 — Discovery o execution?

Classifica:

1. trovare tutti i consumer di un export legacy;
2. sostituire un consumer già confermato;
3. capire perché un indice cresce;
4. aggiungere l'indice già deciso da ADR;
5. definire la semantica di partial refund;
6. implementare un endpoint di partial refund dopo la decisione funzionale.

Per ogni discovery issue scrivi gli **exit criteria**.

## Esercizio 4 — Spezzare una issue grande

Issue:

```text
Migrare Order Operations a una nuova regione,
aggiungere failover automatico,
aggiornare DNS,
creare runbook,
aggiungere alert e fare il cutover.
```

Decomponila per evidence.

Quale issue deve venire prima?

Quali possono essere parallelizzate?

Quale contiene una one-way door?

## Esercizio 5 — Task amplification

Un agente riceve:

```text
Add an integration test for PostgreSQL atomicity.
```

Durante il lavoro trova:

- nome incoerente in un commento;
- dipendenza npm outdated;
- migration 002 semanticamente sospetta;
- README con un typo;
- possibile tenant isolation bug.

Classifica ogni scoperta come:

```text
include
follow-up
stop + escalate
```

Spiega il perché.

## Esercizio 6 — Green-by-editing-the-oracle

Scrivi tre esempi in cui un agente può far diventare verde una suite senza risolvere il problema.

Per ciascuno definisci un boundary di issue che lo impedisca.

## Esercizio 7 — Closure report

Per una modifica già fatta in un tuo progetto, prova a scrivere retroattivamente:

```text
Outcome achieved
Files changed
Verification executed
Evidence result
Known limitations
Not verified
Follow-up
```

Quanto della tua confidence precedente era implicita?

## Esercizio 8 — Issue Form

Disegna un Issue Form per **Execution Task** con massimo sette campi obbligatori.

Ogni campo deve giustificare il proprio costo.

Se non sai spiegare che decisione migliora, rimuovilo.

## Esercizio 9 — ESI PostgreSQL atomicity

Prendi la issue di Order Operations del capitolo.

Proponi due implementazioni del test environment:

```text
Option A
local/containerized ephemeral PostgreSQL

Option B
shared integration environment
```

Valuta:

- fidelity;
- reproducibility;
- feedback speed;
- credentials;
- CI fit;
- cost;
- cleanup;
- contention.

Non scegliere quella più moderna.

Scegli quella col fit migliore.

## Esercizio 10 — Issue readiness review con AI

Chiedi a un agente di fare **red-team della issue**, non di implementarla.

Prompt concettuale:

```text
Trova:
- decisioni non autorizzate che l'executor dovrebbe inventare;
- acceptance criteria non verificabili;
- scope ambiguo;
- missing context;
- stop condition mancanti;
- possibili modi di diventare green senza soddisfare l'outcome.

Non implementare.
```

Confronta la review AI con una review umana.

## Autovalutazione

Dovresti saper rispondere a queste domande:

1. Perché una issue non è soltanto un ticket?
2. Qual è la differenza fra problem e outcome?
3. Perché `Out of scope` è particolarmente utile con gli agenti?
4. Acceptance criterion e test command sono la stessa cosa?
5. Quando una issue è troppo grande?
6. Che cosa significa atomic task?
7. Che differenza c'è fra discovery ed execution?
8. Quali exit criteria dovrebbe avere una discovery?
9. Che cosa deve succedere quando emerge una nuova decisione durante execution?
10. Perché una stop condition aumenta e non diminuisce l'autonomia utile?
11. Che cos'è task amplification?
12. Che cos'è green-by-editing-the-oracle?
13. Perché una issue non dovrebbe copiare tutta la documentazione del repository?
14. Che cosa deve contenere un closure report?
15. Come eviti di promuovere a `Verified` un boundary che la issue non ha realmente attraversato?

## Artefatto operativo

Il capitolo introduce due artefatti complementari:

```text
Issue Template
→ formato riusabile

Execution Work Item
→ istanza concreta del lavoro
```

Per Order Operations useremo:

```text
work-items/TEMPLATE.md
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
```

Il secondo non è una simulazione astratta.

Nasce da un gap già presente nella Testing Strategy:

```text
TST-005
PaymentEscalation + Outbox atomicity
higher-fidelity evidence pending
```

## Che cosa cambia con l'AI

Prima dell'AI una issue ambigua produceva spesso:

```text
clarification latency
```

Con un agente molto capace può produrre:

```text
interpretation
→ large coherent patch
→ late discovery of semantic error
```

Per questo aumenta il valore di:

- outcome esplicito;
- scope;
- canonical context;
- acceptance property;
- verification boundary;
- stop condition.

Ma non dobbiamo compensare creando ticket enormi.

> **L'obiettivo non è descrivere ogni riga che l'agente deve scrivere. È rendere costose le interpretazioni che non è autorizzato a fare.**

## Compromesso ESI

ESI vuole trasformare backlog in execution parallela con persone e agenti.

Il costo è maggiore disciplina nel rendere pronti i task importanti.

La decisione non è introdurre ceremony uniforme.

Usiamo più struttura dove aumentano:

```text
semantic risk
blast radius
irreversibility
cross-team ownership
security impact
```

Per task piccoli e reversibili, una issue può restare piccola.

Per task architetturalmente significativi, il work item deve esplicitare il boundary.

## Corollario

> **Il repository dice all'executor in quale mondo si trova. La issue dice quale parte di quel mondo è autorizzato a cambiare.**

Nel prossimo capitolo entreremo nel livello successivo.

Non avremo più soltanto una issue e un agente.

Avremo più agenti con responsabilità diverse, permission diverse e verification indipendenti.

La domanda diventerà:

> **come si governa un team di agenti senza trasformare l'orchestratore in un collo di bottiglia o, all'opposto, in un delegatore cieco?**

È il tema del **Capitolo 23 — Manager di agenti**.
