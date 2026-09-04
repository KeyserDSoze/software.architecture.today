# Esercizi e sintesi

Il Capitolo 27 non aggiunge un nuovo pattern. Verifica una capacità più difficile: usare insieme analisi, ownership, quality, failure, evidence e readiness senza trasformarli in una checklist meccanica.

I tre casi hanno prodotto tre architetture diverse proprio perché la disciplina era la stessa e i problemi no.

Campaign Launchpad dimostra che la semplicità può essere una scelta matura quando scope e quality floor sono chiari. La Priority migration mostra che conservare temporaneamente il legacy può essere più responsabile che eliminarlo. Il Case Explanation Assistant mostra che limitare il potere dell’AI può essere una proprietà architetturale, non una mancanza di ambizione.

> **La maturità non sta nel pattern scelto. Sta nella relazione leggibile fra problema, compromesso ed evidence.**

## Esercizio 1 — Cambia il problema, non la tecnologia

Product aggiunge a Campaign Launchpad personalized content per customer account usando dati CRM quasi real-time.

Ricostruisci il Decision Trace: quali authoritative source entrano? quali dati diventano sensibili? quale failure model cambia? il public static artifact resta sufficiente? quale decisione del design originale deve essere riaperta?

Non scegliere ancora la tecnologia. Prima descrivi come sono cambiate le forze.

## Esercizio 2 — Non promuovere il legacy a requisito

Osservi nel legacy:

```text
customerTier == GOLD
and age > 10m
→ CRITICAL
```

Costruisci una piccola Legacy Understanding Map con claim, evidence, state, possible owner, alternative explanation e missing evidence. Poi separa `Observed behavior` da `Confirmed target requirement`.

L’esercizio è corretto anche se la conclusione finale è “non sappiamo ancora se deve sopravvivere”.

## Esercizio 3 — Expected Difference o regressione?

La shadow comparison produce:

```text
10.000 Match
73 ExpectedDifference
2 UnexpectedDifference
```

Spiega perché la percentuale aggregata non autorizza il cutover. Per ciascun unexpected mismatch descrivi business impact, affected user/tenant, authoritative expected result, cause e stop/continue decision.

Il rischio non si decide per maggioranza.

## Esercizio 4 — Aggiungi un write tool all’AI Assistant

Product propone `retryPayment()`.

Prima di implementare costruisci un decision packet con business outcome, authority owner, authorization, precondition, idempotency, failure, compensation, audit, confirmation, permission, observability ed eval security.

Poi decidi se il modello debba poter chiamare il tool oppure soltanto proporre l’azione. La risposta deve dipendere dal blast radius, non da quanto il modello sembra capace.

## Esercizio 5 — RAG o no?

Confronta quattro problemi: spiegare un Order Case da quattro source strutturate; cercare procedure in 50.000 documenti; calcolare authoritative PaymentStatus; riassumere una incident timeline già correlata.

Per ciascuno scegli deterministic context, search, RAG o nessuna AI e giustifica la scelta in termini di retrieval need, authority, security, cost, latency ed evaluation.

## Esercizio 6 — Local optimum vs enterprise optimum

Tre team chiedono una nuova logging stack, un nuovo identity provider e una nuova queue technology.

Per ciascuna richiesta rispondi: quale problema locale risolve? quale property compra? esiste già una paved road? quanto costa la varietà enterprise? quanto costa forzare lo standard? quale review trigger avrebbe l’eccezione?

L’obiettivo è distinguere standardizzazione utile da uniformità ideologica.

## Esercizio 7 — Tre Production Readiness Review

Crea una mini-PRR per Campaign Launchpad, Priority candidate cutover e Case Explanation Assistant.

Per ciascuna usa soltanto stati decisionali reali — `READY`, `CONDITIONAL`, `BLOCKED`, `NOT AUTHORIZED`, `NOT READY` — e rendi espliciti launch boundary, required evidence, blocker, disabled capability e owner.

È vietato usare percentuali come `90% ready`.

## Esercizio 8 — Leggi un caso reale senza copiarlo

Scegli un engineering blog di una grande organizzazione e ricostruisci `Problem → Context → Forces → Decision → Consequences → Evidence`.

Poi separa chiaramente:

```text
What I can learn
What I am not authorized to copy without the same context
```

Questo è il modo corretto di usare i casi reali come evidence.

## Esercizio 9 — Disegna un quarto prodotto ESI

Scegli Engineering Software, Payments & Risk, Mobile Products, Data & AI o Corporate Systems. Definisci problem/outcome, functional scope, owner, tre quality attribute, un key trade-off, tre failure mode e un production gate.

Confrontalo con i tre casi del capitolo. Se la topology è identica a una delle precedenti, verifica che siano davvero identiche anche le forze.

## Esercizio 10 — Togli complessità

Prendi uno dei tre casi e prova a rimuovere un service, datastore, async mechanism, AI layer o deployment environment.

Per ogni rimozione chiedi:

> **Quale requisito, failure protection o evidence smette di essere soddisfatto?**

Se non trovi una risposta, quella complessità potrebbe non avere un lavoro.

## Artefatto operativo — End-to-End Decision Trace

Il capitolo usa una vista sintetica, non un nuovo documento obbligatorio:

```text
Case
Problem
Outcome
Functional scope
Owners
Quality floor
Key trade-off
Architecture decision
Rejected/deferred alternative
Failure modes
Verification
Production decision
Open evidence
Review triggers
Real-world evidence anchors
```

Il trace non deve ricopiare ADR, Threat Model e PRR. Deve rendere visibile la causalità fra essi.

Campaign Launchpad possiede già questa vista nel capstone e la sua production decision resta `NOT READY`. Order Operations conserva il proprio `NO-GO`; Priority e AI rimangono rispettivamente `NOT AUTHORIZED` e `NOT READY / DISABLED`.

La disciplina del capitolo non crea finti finali felici per rendere i casi più ordinati.

## Che cosa cambia con l’AI

L’AI può accelerare discovery, analysis candidate, design alternative, implementation, test, migration tooling, evaluation e review.

Proprio per questo può comprimere pericolosamente la distanza fra “abbiamo prodotto una soluzione” e “abbiamo preso una decisione autorizzata”.

Può generare architecture senza problem, test senza property, migration senza behavior classification, AI integration senza authority boundary e production config senza readiness evidence.

La risposta non è rallentare artificialmente il lavoro. È mantenere il decision trace abbastanza esplicito da impedire alla velocità di nascondere il significato.

> **L’AI può comprimere il tempo fra decisione ed execution. Non deve comprimere la distinzione fra decisione ed execution.**

I tre casi non insegnano tre topologie da ricordare. Insegnano una competenza più difficile da automatizzare:

> **Un buon architect non riconosce la soluzione perché l’ha già vista. Riconosce le domande che devono essere risposte prima che la soluzione meriti di esistere.**

Nel Capitolo 28 torniamo proprio su quella persona: **L’architect del 2030**.