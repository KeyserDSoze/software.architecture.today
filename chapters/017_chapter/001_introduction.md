# Capitolo 17 — Legacy e comprensione

Un sistema legacy non è necessariamente vecchio.

Può essere un monolite Java di quindici anni fa che continua a funzionare bene.

Può essere una codebase TypeScript di tre anni fa cresciuta più velocemente della comprensione del team.

Può persino essere codice generato pochi mesi fa da agenti AI, modificato molte volte e mai realmente compreso da chi oggi deve cambiarlo.

La proprietà che ci interessa non è l'età.

È questa:

> **non comprendiamo il sistema abbastanza bene da modificarlo con confidence proporzionata al rischio.**

È qui che il legacy diventa un problema architetturale.

## Legacy come perdita di conoscenza governabile

Un sistema può avere vent'anni ed essere ancora governabile quando possiede boundary leggibili, test affidabili, deploy ripetibili, ownership chiara, dipendenze note, observability utile e persone che comprendono il dominio.

Al contrario, un sistema recente può essere già legacy-like quando contiene regole duplicate, shared database senza owner, job notturni che nessuno sa se siano ancora necessari, feature flag permanenti, procedure manuali indispensabili e nessun modo affidabile per stimare il blast radius di una modifica.

La tecnologia può contribuire al problema.

Ma la perdita di conoscenza è spesso il rischio più profondo.

La prima tesi del capitolo è quindi:

> **Legacy è prima di tutto un problema di conoscenza e verificabilità.**

## Nel brownfield il metodo si rovescia

Finora Order Operations è cresciuto in modo relativamente controllato.

Abbiamo costruito problema, analisi funzionale, boundary, dati, failure mode, security, reliability, observability e testing strategy prima che il sistema diventasse troppo grande per essere compreso.

Nel brownfield troviamo spesso l'ordine opposto:

```text
codice
+ database
+ job
+ integrazioni
+ configurazione
+ infrastruttura
+ workaround
+ procedure operative
```

esistono già.

Quello che manca è una rappresentazione condivisa del loro significato.

Il lavoro non inizia quindi chiedendo:

> Quale architettura vogliamo?

Inizia chiedendo:

> **Che sistema abbiamo davvero, e quanto di ciò che crediamo di sapere possiamo dimostrare?**

Microsoft mette l'assessment prima del modernization plan: inventory di applicazioni, dati, infrastruttura, costi e readiness organizzativa diventano input della trasformazione. La modernization viene inoltre descritta come un ciclo di assessment, planning, execution e maintenance, non come una riscrittura una tantum.

Fonti:

- [Microsoft Learn — Assess your application modernization needs](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/assess/)
- [Microsoft Learn — Application modernization life cycle](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/get-started/application-modernization-life-cycle)

## Il repository è una fonte, non il sistema

Quando ereditiamo una codebase, il repository sembra naturalmente la fonte primaria.

Lo è.

Non è però una descrizione completa del sistema operativo reale.

Il comportamento può dipendere da configuration runtime, dati storici, stored procedure, feature flag, scheduler, queue, identity, DNS, certificati, consumer fuori repository e procedure umane.

Per questo la comprensione legacy richiede almeno cinque famiglie di evidence:

```text
static evidence
runtime evidence
data evidence
operational evidence
human/domain evidence
```

Il codice può dirci che una funzione esiste.

La runtime telemetry può dirci che viene davvero eseguita.

I dati possono mostrarci quali stati produce.

Operations può dirci che durante un incidente quella funzione viene bypassata con una procedura manuale.

Product può infine confermare se il comportamento è ancora desiderato.

Sono forme di conoscenza diverse.

## Code archaeology non significa leggere tutto

Leggere milioni di linee in ordine non è comprensione.

È consumo di attenzione.

L'obiettivo della code archaeology è costruire **la mappa minima sufficiente per la decisione che dobbiamo prendere**.

Se dobbiamo modificare il routing di priorità di un case, vogliamo capire almeno:

```text
entry point
→ decision points
→ state read/write
→ side effects
→ consumers
→ recovery path
```

Poi dobbiamo sapere quali dipendenze partecipano, chi possiede i dati, quali permission sono necessarie e quale evidence potrebbe smentire la nostra ricostruzione.

Non dobbiamo capire l'intera azienda prima di ogni change.

Dobbiamo capire abbastanza del **sistema di conseguenze** del change che stiamo per fare.

## Il nuovo rischio introdotto dall'AI

Gli agenti rendono questa esplorazione molto più economica.

Possono cercare entry point, query SQL, configuration key, producer e consumer, duplicated rule, high fan-in module e candidate dependency graph in una frazione del tempo umano.

Questo è un vantaggio enorme.

Introduce però un failure mode altrettanto importante:

> **una spiegazione plausibile può sembrare una spiegazione verificata.**

Un agente può trovare una funzione chiamata `PriorityRouter` e concludere che governi la priorità operativa corrente.

La funzione potrebbe invece essere dead code, essere usata soltanto da un batch, essere bypassata da una flag, ricevere configuration diversa in produzione o produrre un valore che nessuno consuma più.

La spiegazione del codice è una claim sul sistema.

Non è ancora knowledge confermata.

## Un vocabolario per non lavare le ipotesi

Per tutto il capitolo useremo quattro stati:

```text
Found
→ qualcosa esiste nel codice, config, schema o altro artefatto

Inferred
→ deduciamo un ruolo o un comportamento dai materiali disponibili

Observed
→ test, runtime o dati mostrano che il comportamento accade

Confirmed
→ owner/domain decision + evidence concordano che il comportamento è intenzionale
```

Questa distinzione è il centro del capitolo.

Un output utile non dovrebbe dire soltanto:

> Il job X aggiorna la priorità.

Dovrebbe dire:

```text
Claim
job X modifica priority_code

Evidence
scheduler definition + SQL update

State
Inferred

Missing
runtime execution evidence + owner confirmation
```

La seconda forma è meno fluida.

È molto più sicura.

## ESI incontra un sistema che non abbiamo progettato

Example Software Industries possiede da anni **Operations Desk Classic**, un'applicazione interna precedente a Order Operations.

Alcune capability sono già state sostituite, altre vengono ancora usate da Operations.

Finance vuole ridurne il costo.

Platform vuole eliminare runtime e pipeline fuori standard.

Security vuole ridurre identity e permission storiche.

Commerce & Operations vuole consolidare l'esperienza dentro Order Operations.

Operations pone però un vincolo non negoziabile:

> **non possiamo perdere comportamenti operativi importanti soltanto perché nessuno li ha documentati bene.**

Nel capitolo studieremo una sola capability: il **legacy case priority routing**.

Non inizieremo riscrivendolo.

Inizieremo cercando di capire che cosa fa, chi dipende dal risultato e quali parti del comportamento meritino davvero di sopravvivere.

## Il percorso del capitolo

La sequenza non sarà una lista di pattern di modernization.

Sarà una riduzione progressiva dell'incertezza:

```text
inventory
→ evidence ledger
→ behavioral characterization
→ hidden contracts
→ candidate seams
→ modernization options
→ AI-assisted understanding
→ ESI legacy baseline
```

Il Capitolo 18 entrerà nel refactoring.

Qui non abbiamo ancora il diritto di migliorare ciò che non siamo in grado di descrivere senza confondere fatti, inferenze e requisiti.

> **Prima di cambiare il legacy dobbiamo sapere quali parti della nostra comprensione sono evidence e quali sono ancora ipotesi.**