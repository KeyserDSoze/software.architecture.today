# 22.2 — La issue come contratto di execution

Una issue execution-ready non è una specifica completa del sistema.

È un **contratto temporaneo** abbastanza preciso da permettere all'executor di prendere molte decisioni locali senza dover inventare decisioni di prodotto, ownership o architettura.

Il punto non è compilare campi. È mantenere visibile la relazione fra motivo del lavoro, risultato desiderato, spazio autorizzato e evidence necessaria.

## Dal problema alla closure

Il template ESI contiene sezioni come `Problem`, `Outcome`, `Current evidence`, `Scope`, `Out of scope`, `Canonical context`, `Acceptance criteria`, `Verification`, `Constraints`, `Stop conditions` e `Closure evidence`.

Letto come una lista, sembra un form. Letto come una sequenza di reasoning, racconta invece il ciclo del task:

```text
why change?
→ what must become true?
→ what do we know now?
→ what may change?
→ what must not change?
→ which decisions govern the task?
→ how do we recognize success?
→ what evidence can prove it?
→ when must execution stop?
→ what exactly did we learn on closure?
```

Questo è il valore del work item.

### Il problema mantiene il legame con il rischio

`Problem` impedisce di trasformare il task nella soluzione proposta.

Se scriviamo “add Testcontainers”, l'executor può completare perfettamente la tecnologia e non produrre l'evidence che ci serviva. Se scriviamo “la transaction semantics di PostgreSQL per escalation + outbox non è ancora verificata”, il problema resta leggibile anche se il meccanismo scelto cambia.

### L'outcome descrive lo stato desiderato

`Outcome` risponde a una domanda diversa: che cosa deve essere vero quando chiudiamo?

È più forte di una file list perché conserva il significato. Per OO-001 l'outcome non è “creare una cartella integration”. È dimostrare la proprietà atomica sul database reale attraverso un layer riproducibile.

### Current evidence impedisce di ripartire da zero

Una issue non dovrebbe fingere che il task inizi nel vuoto.

Possiamo già avere orchestration test verdi, migration presenti, un gap documentato nella Testing Strategy e ownership confermata. Dichiarare questa baseline aiuta l'executor a distinguere ciò che deve preservare da ciò che deve ancora provare.

Nel linguaggio del libro:

```text
application intent
= Codified + locally Verified

real PostgreSQL semantics
= Designed / Pending
```

Il task deve chiudere il secondo gap senza riscrivere il primo.

## Scope e out of scope definiscono la semantic surface

`Scope` non serve soltanto a elencare file modificabili. Indica la parte di sistema che il task è autorizzato a trasformare.

`Out of scope` protegge il resto dall'assorbimento incidentale. Con agenti capaci questa sezione diventa particolarmente importante perché riduce la task amplification senza imporre un rigido “non toccare mai altro”.

OO-001 può autorizzare test integration, helper test-only e package script necessari al harness. Non autorizza invece una nuova semantica di Payment Escalation, un cambio di ownership o la riscrittura delle migration storiche per far diventare verde la suite.

La distinzione lascia spazio alla soluzione e protegge l'intento.

## Canonical context: puntare, non copiare

Una issue non dovrebbe diventare una nuova source of truth.

Per questo il work item linka `AGENTS.md`, Repository Map, Testing Strategy, Data Ownership Map, Failure Mode Map e migration interessate invece di ricopiarne il contenuto.

Il task aggiunge il delta. Il repository conserva la conoscenza stabile.

Questo riduce instruction drift e rende più semplice aggiornare una decisione: non dobbiamo cercare tutte le issue in cui era stata duplicata.

## Acceptance e verification: proprietà prima del meccanismo

La separazione più importante del template è questa:

```text
Acceptance criterion
→ property that must hold

Verification
→ mechanism that can produce evidence
```

Un criterio come “il nuovo integration test deve passare” è debole perché l'executor controlla sia il test sia l'implementazione. Può scrivere un test che dimostra esattamente ciò che ha costruito.

Una proprietà più forte è:

```text
if the Outbox write fails before commit
→ no PaymentEscalation is committed
→ no OutboxMessage is committed
```

A quel punto possiamo scegliere un verification mechanism capace di esercitare la transaction su PostgreSQL reale.

> **Prima definiamo la proprietà. Poi scegliamo il test che può falsificarla.**

Questa inversione riduce il rischio di `green-by-editing-the-oracle`.

## Constraints e stop condition fanno lavori diversi

Una constraint è una decisione già presa che il task deve rispettare: niente production credential, migration correnti come baseline, no cloud dependency non necessaria, architecture fitness non indebolita.

Una stop condition descrive invece una nuova informazione che rende il task non più execution-ready.

Se il database reale contraddice Data Ownership, se una migration richiede una modifica semantica o se la verification può essere costruita soltanto attraversando una nuova one-way door, l'output corretto non è una patch più creativa.

È:

```text
Stopped
+ evidence collected
+ decision required
```

La issue resta un living contract: può essere aggiornata dopo la decisione, ma la modifica di scope deve diventare visibile.

## Closure evidence: “Done” non è provenance

La chiusura deve registrare che cosa è stato realmente fatto e verificato.

Per un task delegato è utile conservare almeno outcome raggiunto, file cambiati, command/check eseguiti, result, limitation, `Not verified` e follow-up.

La riga `Not verified` è particolarmente importante. Impedisce che un PASS locale venga raccontato in seguito come evidence di PostgreSQL Azure, performance o production readiness.

Questo anticipa il Verification Bundle del Capitolo 23, ma qui nasce già la disciplina fondamentale: **closure significa delimitare la nuova conoscenza**.

## Issue readiness senza checklist rituale

Prima di delegare, il team deve poter rispondere a poche domande sostanziali: il problema è abbastanza chiaro? l'outcome è osservabile? lo scope è piccolo rispetto al rischio? il decision context esiste? gli acceptance criterion descrivono proprietà? abbiamo un verification path realistico? sappiamo quando fermarci?

Se una risposta decisiva è no, non significa che la issue sia “scritta male”. Potrebbe semplicemente essere ancora una **discovery issue**.

> **Una issue è execution-ready quando restano molte scelte locali da fare, ma non restano decisioni di significato che l'executor dovrebbe inventare al posto degli owner.**