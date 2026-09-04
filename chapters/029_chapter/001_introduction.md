# Capitolo finale — Il timone resta a noi

All'inizio del libro abbiamo incontrato una situazione ormai comune.

Un agente aveva prodotto molto software in poco tempo.

La feature sembrava funzionare.

Il repository era pieno di codice nuovo.

Eppure, davanti alle prime domande serie, il team non riusciva a spiegare con sufficiente precisione:

- perché quella soluzione fosse stata scelta;
- quali assunzioni sostenesse;
- quali failure mode introducesse;
- come sapessimo che fosse corretta;
- chi fosse responsabile delle conseguenze.

Quella scena non parlava davvero di AI.

Parlava di **responsabilità**.

L'AI aveva soltanto reso il problema più visibile, perché aveva compresso il tempo fra una decisione implicita e la quantità di software costruita sopra quella decisione.

Da allora abbiamo attraversato requisiti, confini, API, dati, distribuzione, cloud, security, reliability, observability, testing, legacy, refactoring, costi, repository AI-ready, issue-driven development, agenti, runtime AI e produzione.

Ma la domanda non è cambiata.

> **Chi governa le conseguenze?**

Questa è la domanda a cui torniamo adesso.

Non per aggiungere un'altra tecnologia.

Non per prevedere quale modello dominerà il mercato.

Non per dichiarare morta una professione e inventarne una nuova.

Per capire che cosa rimane quando una parte crescente dell'execution può essere delegata.

---

## Il software non è diventato facile

Una delle tesi iniziali del libro era:

> **Il software non è diventato facile. È diventato più facile produrre software.**

Dopo tutto il percorso possiamo renderla più precisa.

È diventato più facile produrre:

```text
codice
configurazioni
migration
infrastruttura
query
test
documentazione
alternative architetturali
analisi candidate
proof of concept
```

Quello che non è diventato automaticamente facile è decidere:

```text
quale problema merita di essere risolto
quale comportamento è corretto
quale dato possiede quale dominio
quale failure possiamo accettare
quale rischio possiamo trasferire
quale costo compra una proprietà utile
quale evidence è sufficiente
quale decisione richiede uno specialista
quando una migrazione può procedere
quando dobbiamo fermarci
```

L'execution può diventare abbondante.

Il judgment no.

Il judgment può essere coltivato, supportato, reso più informato e distribuito meglio.

Ma non compare automaticamente perché un sistema genera più output.

---

## Il codice costa meno. Le conseguenze no

Quando generare una nuova implementazione costa meno, diventa naturale provarne di più.

È un vantaggio enorme.

Possiamo esplorare alternative che prima non avremmo avuto il tempo di costruire.

Possiamo generare test, benchmark candidate, migration plan, threat scenario e prototipi.

Possiamo chiedere a un agente di fare in minuti il lavoro meccanico che avrebbe richiesto ore.

Ma alcune conseguenze continuano a vivere fuori dal diff:

```text
clienti che dipendono dal contratto
operatori che devono capire il sistema
pagamenti che non possiamo duplicare
account compromessi
backup che devono realmente ripristinare
team che devono sostenere l'on-call
budget che devono pagare l'infrastruttura
legacy che continua a produrre comportamento
regole funzionali che cambiano il business
```

Per questo un altro principio del libro era:

> **Nell'era dell'AI il codice costa meno, ma le decisioni sbagliate costano di più.**

Non necessariamente perché ogni singolo errore sia più costoso di prima.

Ma perché possiamo costruire molto più velocemente sopra un'assunzione sbagliata.

La velocità aumenta anche il **blast radius del pensiero debole**.

---

## Non siamo qui per rallentare

La risposta non è tornare a produrre software lentamente.

Non è diffidare di ogni automazione.

Non è obbligare una persona a riscrivere manualmente tutto ciò che un agente ha prodotto.

Non è creare un comitato per ogni decisione.

Il libro ha cercato il contrario:

> **come aumentare la velocità senza perdere il controllo del significato?**

La risposta che abbiamo costruito non è una singola pratica.

È un sistema:

```text
problema comprensibile
→ confini espliciti
→ decisioni motivate
→ execution delegabile
→ verification proporzionata
→ evidence
→ feedback
→ revisione della decisione
```

Questo sistema può usare persone.

Può usare agenti.

Quasi certamente userà entrambi.

Il punto non è chi ha digitato il codice.

Il punto è se sappiamo spiegare **perché quel codice merita di governare una parte della realtà**.

---

## Torniamo al pilota

Nel Capitolo 0 abbiamo usato una metafora semplice:

> **Sii il pilota, non il copilota.**

Dopo ventotto capitoli, possiamo evitare un possibile equivoco.

Essere il pilota non significa muovere personalmente ogni comando.

Un pilota moderno usa automazione.

Usa strumenti che controllano, stabilizzano, calcolano e suggeriscono.

Il punto è un altro.

Deve sapere:

```text
qual è la destinazione
quale stato sta osservando
quale automazione è attiva
quali limiti ha
quando intervenire
quando interrompere
chi risponde della decisione
```

Nel software vale lo stesso.

Possiamo delegare molta execution.

Possiamo delegare discovery candidate.

Possiamo delegare refactoring.

Possiamo delegare testing e review preliminare.

Possiamo perfino delegare parte dell'orchestrazione.

Ma l'organizzazione deve ancora sapere **chi tiene il timone**.

---

## Il cerchio del libro

Possiamo ora riscrivere l'intero percorso in quattro parole:

```text
execution
→ decisione
→ verifica
→ responsabilità
```

E poi il ciclo ricomincia.

La verifica produce nuova informazione.

La nuova informazione può cambiare la decisione.

La decisione produce nuova execution.

La responsabilità decide quando quell'execution può diventare parte del sistema reale.

Questa non è soltanto una sequenza di sviluppo.

È un modello di governo del software.

Il resto di questo capitolo prova a condensare ciò che abbiamo imparato senza trasformarlo ancora in slogan.

Gli slogan arriveranno soltanto alla fine.

Prima dobbiamo meritarseli.