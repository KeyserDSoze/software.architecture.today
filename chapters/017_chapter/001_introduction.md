# Capitolo 17 — Legacy e comprensione

Un sistema legacy non è necessariamente scritto in COBOL.

Può essere un'applicazione Java di quindici anni fa.

Può essere un monolite Rails che continua a ricevere decine di deploy al giorno.

Può essere una codebase TypeScript nata tre anni fa e cresciuta più velocemente della comprensione del team.

Può perfino essere codice generato sei mesi fa da agenti AI che nessuno ha realmente letto.

La caratteristica che ci interessa non è l'età.

È questa:

> **non comprendiamo il sistema abbastanza bene da modificarlo con confidenza.**

È qui che il legacy diventa un problema architetturale.

## Il problema non è che il sistema è vecchio

Un sistema può essere vecchio e perfettamente governabile.

Può avere:

- boundary chiari;
- test affidabili;
- ownership esplicita;
- deploy ripetibili;
- dipendenze note;
- business rule leggibili;
- observability utile;
- rollback credibile;
- team che conoscono il dominio.

Un sistema del genere può avere vent'anni e continuare a produrre valore.

Al contrario, un sistema relativamente recente può essere già legacy-like quando presenta:

- regole duplicate e contraddittorie;
- dipendenze invisibili;
- shared database modificato da più applicazioni;
- cron job che nessuno sa se servono ancora;
- feature flag permanenti;
- configuration drift;
- integrazioni via file o mailbox;
- procedure manuali indispensabili ma non documentate;
- test che verificano l'implementazione e non il comportamento;
- nessun modo affidabile per capire il blast radius di una modifica.

La prima tesi del capitolo è quindi:

> **Legacy è prima di tutto un problema di conoscenza.**

La tecnologia può essere una parte del problema.

La perdita di comprensione è spesso il problema più pericoloso.

## Il brownfield cambia il metodo

Finora abbiamo fatto crescere Order Operations conoscendo progressivamente:

- problema;
- analisi funzionale;
- boundary;
- dati;
- failure mode;
- security;
- reliability;
- observability;
- testing strategy.

Nel mondo reale capita spesso l'opposto.

Arriviamo quando:

```text
codice
+ database
+ job
+ integrazioni
+ infrastruttura
+ workaround
+ procedure operative
```

esistono già.

Ma non esiste più una rappresentazione condivisa del perché.

Il lavoro non comincia quindi da:

> “Quale architettura vogliamo?”

Comincia da:

> **“Che sistema abbiamo davvero?”**

Microsoft, nella propria guida di application modernization, mette l'assessment prima del piano di trasformazione: inventario di applicazioni, dati, infrastruttura, costi e readiness organizzativa sono input necessari per decidere dove e come modernizzare. La modernizzazione viene inoltre presentata come un ciclo continuo di assessment, planning, execution e maintenance, non come una riscrittura una tantum.

Fonti:

- [Microsoft Learn — Assess your application modernization needs](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/assess/)
- [Microsoft Learn — Application modernization life cycle](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/get-started/application-modernization-life-cycle)

## Il repository non è il sistema

Quando ereditiamo una codebase, la tentazione è aprire il repository e pensare che tutto ciò che dobbiamo capire sia lì.

Raramente è vero.

Il comportamento reale può dipendere da:

- configurazione runtime;
- dati storici;
- schema e stored procedure;
- feature flag;
- queue e topic;
- scheduler;
- identity provider;
- secret e certificati;
- DNS;
- regole del load balancer;
- job esterni;
- file condivisi;
- consumer non documentati;
- procedure umane;
- contratti impliciti con altri team.

Il codice ci mostra una parte della verità.

Il runtime ce ne mostra un'altra.

Le persone spesso ne conservano un'altra ancora.

Per questo il legacy discovery deve combinare almeno:

```text
static evidence
+ runtime evidence
+ data evidence
+ operational evidence
+ human/domain evidence
```

## Code archaeology non significa leggere tutto

Una codebase grande può contenere milioni di linee.

Leggerla linearmente non è comprensione.

È consumo di tempo.

L'obiettivo della code archaeology è costruire una mappa sufficiente per la decisione che dobbiamo prendere.

Se dobbiamo cambiare l'assegnazione di un caso operativo, vogliamo sapere:

- da dove entra la richiesta;
- quali moduli partecipano;
- quali dati legge e scrive;
- quali side effect produce;
- quali job successivi dipendono da quei dati;
- quali consumer leggono il risultato;
- quali permission sono richieste;
- quali failure sono possibili;
- quale evidence ci dice che il comportamento è corretto.

Non dobbiamo necessariamente capire l'intera azienda prima di modificare una funzione.

Dobbiamo però capire **il sistema di conseguenze** della funzione che stiamo per toccare.

## Il rischio della spiegazione plausibile

L'AI rende la code archaeology molto più veloce.

Un agente può:

- esplorare directory;
- costruire call graph;
- cercare query SQL;
- trovare configuration key;
- individuare consumer di un evento;
- proporre dependency map;
- spiegare funzioni complesse;
- cercare pattern duplicati;
- produrre una prima documentazione.

Questo è estremamente utile.

Ma introduce un nuovo failure mode:

> **una spiegazione plausibile può sembrare una spiegazione verificata.**

Un agente può leggere il codice e concludere che una funzione “calcola la priorità dei casi enterprise”.

La funzione potrebbe però:

- non essere più chiamata;
- essere chiamata soltanto da un batch mensile;
- ricevere configurazione diversa in produzione;
- essere bypassata da una feature flag;
- produrre un valore che nessun consumer usa più;
- contenere un bug su cui un downstream ha costruito una compatibilità.

La spiegazione del codice è un'ipotesi sul sistema.

Non è ancora evidence del comportamento reale.

## Un linguaggio per il grado di conoscenza

Nel capitolo useremo quattro stati:

```text
Found
→ qualcosa esiste nel codice/config/schema

Inferred
→ deduciamo un ruolo o comportamento

Observed
→ abbiamo evidence runtime/test/data del comportamento

Confirmed
→ domain/owner + evidence concordano che il comportamento è intenzionale
```

Questa distinzione è importante anche per gli agenti.

Un output AI dovrebbe poter dire:

```text
Claim: il job X aggiorna la priorità del caso
Evidence: chiamata SQL + scheduler configuration
State: Inferred
Missing: runtime execution evidence + owner confirmation
```

non soltanto:

> “Il job X gestisce le priorità.”

## ESI: arriva un sistema che non abbiamo progettato noi

Example Software Industries possiede da anni un'applicazione interna che chiameremo:

> **Operations Desk Classic**

È antecedente a Order Operations.

Alcuni team di supporto la usano ancora per funzioni che non sono state migrate.

Finance vuole ridurre il costo di mantenerla.

Platform vuole eliminare runtime e pipeline fuori standard.

Security vuole ridurre vecchie identity e permission.

Commerce & Operations vuole consolidare il lavoro degli operatori dentro Order Operations.

Ma Operations pone un vincolo non negoziabile:

> non possiamo perdere comportamenti operativi importanti soltanto perché nessuno li ha documentati bene.

Questa sarà la tensione ESI del capitolo.

Non inizieremo riscrivendo Operations Desk Classic.

Inizieremo **capendola abbastanza da poter decidere come cambiarla**.

## La domanda centrale

Il Capitolo 17 risponde quindi a questa domanda:

> **Come ricostruiamo il comportamento e i confini di un sistema esistente prima che la velocità di modifica superi la nostra comprensione?**

Il percorso sarà:

```text
inventory
→ evidence map
→ behavioral characterization
→ dependency / data discovery
→ seams
→ modernization options
→ AI-assisted understanding
→ ESI legacy baseline
```

Il capitolo successivo entrerà nel refactoring.

Qui non abbiamo ancora il diritto di migliorare ciò che non comprendiamo.

> **Prima di cambiare il legacy, dobbiamo distinguere ciò che sappiamo da ciò che stiamo soltanto supponendo.**