## Artefatto operativo — Problem & Outcome Brief

Abbiamo introdotto problema, outcome, scope, vincoli, requisiti e acceptance criteria. Ora li comprimiamo in un artefatto operativo.

Il **Problem & Outcome Brief** non deve diventare un documento cerimoniale. Il suo valore sta nel costringerci a rendere esplicite poche cose importanti prima che il lavoro si allarghi. Può stare in una pagina, direttamente nella issue per un cambiamento piccolo oppure in una cartella `features/` o `docs/` per un’iniziativa più ampia. La forma conta meno della funzione.

### Template

Qui la struttura è intenzionale: il template deve essere scansionabile e riutilizzabile.

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

Il brief non dovrebbe contenere automaticamente framework, class diagram, schema database, provider cloud, nomi delle classi o numero di microservizi. Queste sono decisioni che possono arrivare dopo.

Se una scelta tecnica è già un constraint reale, va dichiarata come tale. Dire che il componente deve essere eseguito sulla piattaforma.NET già supportata dal team può essere un vincolo legittimo; scrivere in anticipo che la soluzione dovrà essere composta da tre microservizi.NET, Azure Service Bus e Cosmos DB significa invece usare il brief per nascondere il solution-first development.

### Le assunzioni meritano una sezione propria

Le assunzioni sono spesso il materiale più prezioso del documento. Potremmo assumere, per esempio, che gli operatori lavorino prevalentemente in orario europeo, che il volume di ordini problematici sia inferiore a una certa soglia, che lo stato presente nel sistema ordini sia sufficiente per classificare i casi o che non serva un aggiornamento sub-secondo.

Non stiamo affermando che queste cose siano vere. Stiamo rendendo visibile ciò su cui stiamo costruendo. Un’assunzione esplicita può essere verificata; una implicita può diventare architettura senza che nessuno se ne accorga.

### Open decisions

Un buon brief non finge di sapere tutto. Può dichiarare che la scelta tra push e polling è ancora aperta, che non abbiamo deciso la retention dell’audit trail o la strategia di concorrenza, oppure che il target di latency verrà fissato dopo aver misurato una baseline.

Dichiarare una decisione aperta è meglio che riempire il vuoto con una scelta arbitraria. Aiuta anche gli agenti, perché possiamo dir loro esplicitamente di non prendere autonomamente le decisioni marcate come aperte e di proporre invece alternative.

### Quanto deve essere dettagliato?

Il dettaglio dipende dal costo dell’errore. Per un cambiamento piccolo e reversibile possono bastare problema, outcome, scope e acceptance. Una feature significativa può richiedere attori, constraint, behavior, NFR, assunzioni e open decision. Un cambiamento ad alto blast radius può invece collegare il brief a threat model, ADR, migration plan, data contract, reliability analysis, compliance review o rollback plan.

Non dobbiamo gonfiare il brief fino a farlo contenere tutto. Dobbiamo collegarlo agli artefatti giusti.

### Un documento vivo, ma non instabile

Il brief può cambiare quando impariamo, ma le modifiche significative devono essere riconoscibili. Se cambia l’outcome, forse è cambiato il progetto; se cambia un hard constraint, alcune decisioni vanno rivalutate; se cresce lo scope dobbiamo capire se siamo ancora nella stessa iterazione; se cade un’assunzione dobbiamo risalire alle scelte che dipendevano da essa.

In questo modo il brief diventa un piccolo punto di sincronizzazione tra Product, Engineering e agenti.

### Il brief come contesto per l’AI

“Costruisci la dashboard degli ordini problematici” chiede all’agente di ricostruire da solo gran parte del problema. “Leggi il Problem & Outcome Brief in `features/order-operations/brief.md`, proponi prima le decisioni tecniche necessarie, evidenzia quelle non derivabili dal brief e non implementare le open decision senza approvazione” è un’istruzione molto più forte.

Non perché il prompt sia più sofisticato, ma perché il progetto possiede un contesto stabile. Questo è context engineering applicato alla foundation.

### Anti-pattern: documentare dopo per giustificare prima

Esiste anche una versione teatrale del brief: il team sceglie già la soluzione e poi ricostruisce a posteriori un problema che la faccia sembrare inevitabile. È l’equivalente architetturale di disegnare il bersaglio intorno alla freccia.

Il brief perde valore se non può ancora cambiare la soluzione. Una domanda di controllo è:

> **Se scoprissimo qualcosa di importante durante questa fase, saremmo ancora disposti a non costruire la feature?**

Se la risposta è no, probabilmente non stiamo facendo problem framing. Stiamo preparando una giustificazione.

### Il risultato che vogliamo

Il Problem & Outcome Brief è riuscito quando produce due effetti. Una persona nuova nel progetto riesce a capire rapidamente perché il lavoro esiste; un agente può ricevere execution senza dover inventare il problema che dovrebbe risolvere.

In entrambi i casi il vantaggio è lo stesso:

> **meno contesto ricostruito per inferenza, più decisioni rese esplicite.**
