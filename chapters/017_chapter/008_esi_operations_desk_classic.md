# 17.8 — ESI: capire Operations Desk Classic prima di sostituirlo

ESI incontra ora un problema diverso da tutti quelli costruiti finora.

**Operations Desk Classic** esiste da prima di Order Operations.

Non l'abbiamo progettato noi, non possediamo una Functional Analysis affidabile e non sappiamo ancora distinguere con precisione fra regole necessarie, compatibilità storiche e accidenti del codice.

Le pressioni per intervenire sono reali.

Finance vuole ridurre runtime, pipeline e manutenzione legacy.

Platform vuole eliminare deployment fuori standard.

Security vuole ridurre identity tecniche storiche, permission ampie e secret statici.

Commerce & Operations vuole evitare che gli operatori debbano usare due console.

Operations pone però il vincolo che governa il capitolo:

> **non possiamo perdere un comportamento operativo importante soltanto perché nessuno riesce più a spiegare bene da dove provenga.**

La risposta ESI non è una rewrite.

È una discovery slice.

## Una sola capability: legacy case priority routing

Non studiamo l'intera applicazione.

Isoliamo una capability che potrebbe entrare in Order Operations:

> **legacy case priority routing**

Operations Desk Classic assegna una priority interna ad alcuni case.

Order Operations oggi non possiede la stessa semantica.

Prima di decidere se conservarla, cambiarla o eliminarla dobbiamo ricostruire:

```text
behavior
→ consumers
→ data
→ operational meaning
→ ownership
→ safe seam candidate
```

Questo è il principio della minimum sufficient understanding applicato al capstone.

## Primo inventory: sappiamo già meno di quanto sembri

La discovery trova una slice con:

```text
HTTP / UI entry point
priority-routing module
shared operations state candidate
nightly export
configuration values
```

Ma ogni elemento entra nell'Evidence Ledger con un grado diverso.

```text
priority-routing source exists          = Found
nightly export source exists            = Found
same legacy state appears referenced    = Found / Inferred
priority affects current workflow       = Inferred
enterprise special case intentional     = Unknown
current business owner                  = Unknown
```

Questa differenza di stato è fondamentale.

Se scrivessimo subito “Operations Desk Classic usa la priority per governare il workflow enterprise”, avremmo già trasformato più inferenze in fatti.

## La slice legacy che introduciamo nel repository

Il capstone contiene intenzionalmente una piccola implementazione legacy separata dal nuovo codice.

Il comportamento osservabile è simile a:

```text
closed case
→ NONE

manual hold
→ MANUAL_REVIEW

Payment + repeated failures
→ URGENT

Enterprise + age >= threshold
→ URGENT

otherwise
→ STANDARD
```

Queste regole sono **fittizie**.

Non sono benchmark, best practice o policy industriali.

Servono a mostrare come si passa da codice esistente a conoscenza governata.

## Prima characterization: osservare senza promuovere a requisito

La characterization suite produce questa baseline:

| ID | Scenario | Output osservato | Stato al Capitolo 17 |
|---|---|---|---|
| LB-01 | case closed | `NONE` | Observed |
| LB-02 | manual hold | `MANUAL_REVIEW` | Observed |
| LB-03 | Payment + repeated failures | `URGENT` | Observed |
| LB-04 | Enterprise + age >= threshold | `URGENT` | Observed, meaning unknown |
| LB-05 | Enterprise before threshold | `STANDARD` | Observed |
| LB-06 | ordinary open case | `STANDARD` | Observed |

Nessuna riga diventa automaticamente `Confirmed`.

La suite ci permette di sapere se una modifica cambia il comportamento.

Non ci dice ancora quale comportamento ESI debba scegliere per il target.

## LB-04 è il caso che ci impedisce di barare

La regola Enterprise + threshold temporale sembra importante.

Potrebbe derivare da:

```text
contractual SLA
Operations policy
historical incident workaround
temporary feature never removed
dead/unconsumed branch
```

Il repository non può scegliere fra queste spiegazioni.

Il fatto che il test osservi `URGENT` non autorizza Order Operations a introdurre la stessa regola nella propria Functional Analysis.

LB-04 resta quindi:

```text
Observed behavior
→ classification pending
→ owner confirmation required
```

Questo è il punto pedagogico più importante della slice.

## Il nightly export allarga il blast radius

Durante la discovery troviamo un export notturno che sembra includere la priority.

Improvvisamente il problema non è più soltanto la UI.

La capability potrebbe influenzare:

```text
operator workflow
+ persisted legacy state
+ nightly export
+ downstream reporting
```

Lo stato della claim è ancora `Inferred` finché non troviamo execution evidence e owner.

Ma basta per creare un blocker:

> **nessun retirement del priority path finché i consumer dell'export non sono stati identificati.**

Una modernization prudente usa anche l'incertezza come input di stop.

## Data ownership: non dichiariamo un nuovo owner prima di trovarne uno vecchio

La discovery suggerisce stato legacy come:

```text
case_id
priority_code
priority_updated_at
manual_hold
```

Le domande sono più importanti del design target:

```text
chi scrive priority_code?
chi lo legge?
il nightly export legge o ricalcola?
manual_hold è business state o workaround operativo?
chi può modificarlo?
esiste audit?
Order Operations legge già indirettamente questi dati?
```

Finché queste risposte mancano, Order Operations non dichiara una nuova authority.

Un nuovo modello più pulito non ci dà il diritto di ignorare writer e reader esistenti.

## Perché non refactorizziamo ancora

Il legacy code contiene nomi e forme che potremmo migliorare subito.

Potremmo introdurre TypeScript, enum, dependency injection, funzioni più piccole e magic number più leggibili.

Non lo facciamo nel Capitolo 17.

La ragione non è conservatorismo.

È controllo delle variabili.

Stiamo ancora cercando di capire che cosa significhi il comportamento.

Cambiare contemporaneamente struttura e semantica renderebbe più difficile distinguere:

```text
refactoring difference
```

da:

```text
behavioral difference
```

Il Capitolo 18 costruirà il Refactoring Safety Plan proprio dopo avere ottenuto questa baseline.

## Candidate seam, non decisione già implementata

Una direzione plausibile emerge:

```text
Order Operations
→ PriorityPolicy / PriorityRouting boundary
   ├── legacy adapter
   └── future target policy
```

Questo potrebbe abilitare Branch by Abstraction e shadow comparison.

Al Capitolo 17 resta però **candidate**.

Non sappiamo ancora quali behavior debbano vivere nella target policy.

Creare subito l'implementazione nuova significherebbe usare una domanda ancora aperta come specifica.

## Legacy Understanding Map — baseline del Capitolo 17

L'artefatto persistente introdotto dal capitolo registra almeno:

```text
capability scope
entry points
evidence ledger
characterized behaviors
data / ownership questions
consumer hypotheses
operational unknowns
security unknowns
candidate seams
migration risks
decision blockers
```

Il file vivo del capstone continuerà a evolvere.

Nei capitoli successivi alcuni behavior verranno confermati, LB-04 riceverà una decisione esplicita, il seam verrà codificato e apparirà una shadow strategy.

Qui manteniamo la fotografia corretta **prima** di quelle decisioni.

## Il compromesso ESI del Capitolo 17

**Esigenza:** ridurre progressivamente costo e rischio di Operations Desk Classic e consolidare capability in Order Operations.

**Tensione:** retirement speed contro semantic safety, hidden consumers e rischio di importare accidental complexity nel nuovo dominio.

**Decisione:** nessun cutover e nessuna rewrite; prima inventory, characterization, owner discovery, hidden-consumer discovery, behavior classification e candidate seam.

**Costo accettato:** Operations Desk Classic continua a esistere e paghiamo temporaneamente discovery effort, characterization suite e doppia conoscenza.

**Quality floor:** nessuna silent semantic regression, tenant/security boundary preservati, nessuna data authority ambigua, nessun behavior significativo rimosso senza decisione, nessun cutover senza rollback.

**Guardrail:** Legacy Understanding Map, characterization tests, Evidence Ledger `Found/Inferred/Observed/Confirmed`, consumer discovery, owner confirmation e explicit decision blocker.

## Che cosa abbiamo davvero ottenuto

A fine capitolo non abbiamo rimosso una riga di legacy.

Abbiamo però trasformato:

```text
"quel codice sembra fare priority routing"
```

in:

```text
6 behavior osservati
1 regola semanticamente sospetta
consumer notturni ancora da confermare
ownership dati non risolta
candidate seam identificato
decision blocker espliciti
```

Questa è modernization progress perché riduce l'incertezza del prossimo change.

> **Il primo prodotto di una modernization sicura non è il nuovo codice. È una comprensione abbastanza affidabile da sapere quale nuovo codice abbiamo davvero il diritto di scrivere.**