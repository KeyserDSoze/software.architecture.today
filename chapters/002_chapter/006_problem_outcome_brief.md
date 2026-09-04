## Artefatto operativo — Problem & Outcome Brief

Abbiamo introdotto problema, outcome, scope, vincoli, requisiti e acceptance criteria.

Ora li comprimiamo in un artefatto operativo.

Il **Problem & Outcome Brief** non deve diventare un documento cerimoniale.

Il suo valore sta nel costringerci a rendere esplicite poche cose importanti prima che il lavoro si allarghi.

Può stare in una pagina.

Per una modifica piccola può stare direttamente nella issue.

Per un'iniziativa più ampia può vivere in `features/`, `docs/` o in uno spazio di product discovery.

La forma conta meno della funzione.

### Template

```markdown
# Problem & Outcome Brief

## Problem
Quale situazione vogliamo cambiare?
Chi la vive?
Qual è la frizione, il rischio, il costo o l'opportunità?

## Desired outcome
Che cosa dovrebbe diventare diverso se l'intervento funziona?
Come possiamo osservarlo o misurarlo?

## Users / actors
Chi interagisce con il sistema o subisce le conseguenze della decisione?

## In scope
Che cosa stiamo affrontando in questa iterazione?

## Out of scope
Che cosa stiamo deliberatamente lasciando fuori?

## Constraints
Quali limiti tecnici, economici, normativi, temporali o organizzativi conosciamo?
Quali sono hard e quali soft?

## Functional behaviors
Quali comportamenti devono essere possibili o garantiti?

## Significant non-functional requirements
Quali qualità sono abbastanza importanti da influenzare il design già adesso?

## Assumptions
Che cosa stiamo assumendo senza averlo ancora verificato?

## Acceptance evidence
Che cosa ci convincerà che l'outcome e i comportamenti richiesti sono stati raggiunti?

## Open decisions
Quali decisioni rimangono intenzionalmente aperte?

## Stop / escalation conditions
Quali scoperte devono interrompere l'execution e riportarci alla decisione?
```

### Non è una specifica tecnica

Il brief non dovrebbe contenere automaticamente framework, class diagram o uno schema database dettagliato, né prescrivere provider cloud, struttura delle directory, nomi delle classi, librerie o numero di microservizi.

Queste possono diventare decisioni successive.

Se una scelta tecnica è già un constraint reale, la inseriamo.

Per esempio:

```text
Constraint:
il componente deve essere eseguito sulla piattaforma .NET già supportata dal team.
```

Ma se scriviamo:

```text
Soluzione:
creare tre microservizi .NET con Azure Service Bus e Cosmos DB.
```

prima di avere analizzato il problema, abbiamo usato il brief per nascondere il solution-first development.

### Le assunzioni meritano una sezione propria

Le assunzioni sono spesso il materiale più prezioso del documento.

Per esempio:

```text
Assumiamo che:
- gli operatori lavorino prevalentemente durante orario europeo;
- il volume di ordini problematici sia inferiore a 10.000 al giorno;
- lo stato presente nel sistema ordini sia sufficiente per classificare i casi;
- non serva aggiornamento real-time sotto il secondo;
- il team operations possa utilizzare l'identità aziendale esistente.
```

Non stiamo affermando che siano vere.

Stiamo rendendo visibile ciò su cui stiamo costruendo.

Un'assunzione esplicita può essere verificata.

Un'assunzione implicita può diventare architettura senza che nessuno se ne accorga.

### Open decisions

Un buon brief non finge di sapere tutto.

Può contenere:

```text
Open decisions
- push vs polling per aggiornare la coda operativa;
- retention dell'audit trail;
- strategia di concorrenza sulla presa in carico;
- target preciso di latency dopo misurazione baseline.
```

Dichiarare una decisione aperta è meglio che riempire il vuoto con una scelta arbitraria.

Aiuta anche gli agenti.

Possiamo dire:

> “Non prendere autonomamente decisioni che il brief marca come open decision. Proponi alternative.”

Questo trasforma l'incertezza in una parte gestita del lavoro.

### Quanto deve essere dettagliato?

La risposta dipende dal costo dell'errore.

Possiamo immaginare tre livelli.

#### Lightweight

Per cambiamenti piccoli e reversibili:

```text
problema
outcome
scope
acceptance
```

Può stare nella issue.

#### Standard

Per feature significative:

```text
problem
outcome
actors
scope
constraints
behaviors
NFR significativi
assumptions
acceptance
open decisions
```

#### High-risk

Per cambiamenti con forte blast radius:

il brief rimane breve e, quando serve, viene accompagnato da artefatti specifici: threat model e ADR, migration plan e data contract, reliability analysis, compliance review o rollback plan.

Non dobbiamo gonfiare il brief per farlo contenere tutto.

Dobbiamo collegarlo agli artefatti giusti.

### Un documento vivo, ma non instabile

Il brief può cambiare quando impariamo.

Ma ogni modifica significativa dovrebbe essere riconoscibile.

Se l'outcome cambia, forse il progetto è cambiato.

Se un vincolo hard cambia, alcune decisioni vanno rivalutate.

Se lo scope cresce, dobbiamo decidere se stiamo ancora eseguendo la stessa iterazione.

Se un'assunzione viene smentita, dobbiamo chiederci quali scelte dipendevano da essa.

Questo rende il brief un piccolo punto di sincronizzazione tra product, engineering e agenti.

### Il brief come contesto per l'AI

Immaginiamo di dare a un agente soltanto questa richiesta:

> “Costruisci la dashboard degli ordini problematici.”

Confrontiamola con:

> “Leggi il Problem & Outcome Brief in `features/order-operations/brief.md`. Proponi prima le decisioni tecniche necessarie, evidenzia quelle non derivabili dal brief e non implementare le open decision senza approvazione.”

La seconda istruzione non è potente perché contiene un prompt più sofisticato.

È potente perché il progetto possiede un contesto stabile.

Questo è context engineering applicato alla foundation.

### Anti-pattern: documentare dopo per giustificare prima

Esiste una versione teatrale del brief.

Il team sceglie già la soluzione.

Poi scrive un documento che ricostruisce a posteriori il problema in modo che la soluzione sembri inevitabile.

È l'equivalente architetturale di disegnare il bersaglio intorno alla freccia.

Il brief perde valore se non può ancora cambiare la soluzione.

Una domanda di controllo è:

> **Se scoprissimo qualcosa di importante durante questa fase, saremmo ancora disposti a non costruire la feature?**

Se la risposta è no, non stiamo facendo problem framing.

Stiamo preparando una giustificazione.

### Il risultato che vogliamo

Il Problem & Outcome Brief è riuscito quando due effetti diventano possibili.

Primo:

un essere umano nuovo nel progetto può capire rapidamente perché il lavoro esiste.

Secondo:

un agente può ricevere execution senza dover inventare il problema che dovrebbe risolvere.

In entrambi i casi il vantaggio è lo stesso:

> **meno contesto ricostruito per inferenza, più decisioni rese esplicite.**