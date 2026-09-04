# 17.3 — Characterization: proteggere il comportamento prima di giudicarlo

Quando ereditiamo codice che non comprendiamo, il primo test utile non è sempre un test di correttezza.

Spesso è un test di **caratterizzazione**.

La domanda iniziale non è:

> Questo comportamento è giusto?

È:

> **Che cosa fa il sistema oggi, in condizioni che possiamo osservare e ripetere?**

Questa distinzione è essenziale perché nel legacy il comportamento esistente e il requisito desiderato possono divergere.

## Osservare prima di prescrivere

Un characterization test cattura un comportamento corrente per permetterci di rilevare una variazione successiva.

Microsoft descrive i characterization test come una regression suite utile a determinare il comportamento del codice esistente e a sostenere il lavoro su codice non familiare o legacy.

Fonte:

- [Microsoft Learn — IntelliTest: Characterization tests](https://learn.microsoft.com/en-us/visualstudio/test/intellitest-manual/)

Martin Fowler ha discusso lo stesso principio nel lavoro sul legacy: rendere prima osservabile il comportamento, poi creare seam e migliorare la struttura con una rete di sicurezza.

Fonte:

- [Martin Fowler — Modern Mocking Tools and Black Magic](https://martinfowler.com/articles/modernMockingTools.html)

Il valore del characterization test non è dire che il sistema abbia ragione.

È dirci:

```text
prima faceva X
ora fa Y
```

così il cambiamento non resta invisibile.

## Observed non significa Confirmed

Supponiamo che Operations Desk Classic produca:

```text
Enterprise tenant
+ Payment case
+ age > 30 min
→ Priority = URGENT
```

Un test può dimostrare che quel risultato avviene davvero per un input controllato.

Lo stato della claim diventa `Observed`.

Non sappiamo ancora se la regola:

- sia richiesta da un contratto;
- sia una policy ancora valida;
- sia un workaround storico;
- sia un bug;
- debba essere portata nel target.

Per questo il capitolo insiste sulla separazione:

```text
Observed behavior
≠
Confirmed requirement
```

Il test rende il comportamento visibile.

La decisione di dominio ne stabilisce il significato.

## Classificare progressivamente il comportamento

Dopo averlo osservato, un comportamento significativo deve essere classificato.

### Required

È confermato da Product, domain owner, contratto, compliance o altro requirement esplicito.

Deve essere preservato oppure sostituito da una semantica deliberatamente equivalente.

### Compatibility

Esiste perché un consumer attuale continua a dipenderne.

Può non appartenere al target finale, ma non può essere rimosso finché la dependency non viene migrata o ritirata.

### Accidental

È un effetto storico non più desiderato: bug, workaround obsoleto, default errato, dead branch o comportamento senza consumer.

La modernization dovrebbe eliminarlo, non consacrarlo.

### Unknown

Abbiamo osservato qualcosa, ma non possediamo ancora evidence sufficiente per classificarlo.

Questa quarta categoria è importante.

Costringe il team ad ammettere che non ogni behavior deve ricevere subito una spiegazione.

## Golden master: confronto, non culto dello snapshot

Quando la semantica è complessa possiamo costruire un corpus rappresentativo e confrontare vecchia e nuova implementazione.

```text
representative inputs
→ legacy implementation
→ normalized observable outputs
→ baseline

same inputs
→ candidate implementation
→ normalized observable outputs
→ diff
```

Questo approccio, spesso chiamato **golden master**, è utile quando l'output è deterministico o normalizzabile e la specifica non è ancora completa.

Il rischio nasce quando fotografiamo indiscriminatamente ogni byte.

Timestamp, random ID, ordering accidentale, cache metadata e formatting irrilevante creano diff rumorosi.

Il team inizia allora ad approvare snapshot per far tornare verde la suite.

A quel punto il test non protegge più la semantica.

Protegge il file snapshot.

La regola è:

> **caratterizza ciò che un consumer o un operatore può realmente distinguere, non ogni dettaglio dell'implementazione corrente.**

## Il boundary del test conta

Quando possibile, caratterizziamo attraverso un boundary relativamente stabile:

```text
public function
API
message
DB result
batch output
file contract
```

Un test che verifica la sequenza di private method diventa fragile proprio quando iniziamo il refactoring.

Un test che verifica invece:

```text
input X
→ priority URGENT
→ export eligibility true
```

protegge una proprietà osservabile indipendentemente dalla struttura interna.

## Il legacy può essere difficile da osservare

Molti sistemi sono intrecciati con clock globale, filesystem, database statico, singleton, network call, environment variable e framework lifecycle.

Non dobbiamo per forza risolvere tutto prima di ottenere la prima evidence.

Possiamo iniziare dal boundary più esterno che riusciamo a controllare.

Poi creare seam più piccoli.

Ma dobbiamo evitare un'altra illusione: un mocking framework molto potente può rendere testabile qualunque cosa senza rendere il design più comprensibile.

Il test passa.

Il coupling resta.

La testability del Capitolo 16 vale anche qui: il seam dovrebbe rappresentare una dipendenza significativa, non soltanto un trucco della suite.

## Un corpus intenzionale vale più di cento input casuali

Per una capability importante vogliamo casi che rappresentino classi semantiche:

```text
normal case
boundary value
legacy special case
invalid input
missing data
time-dependent case
permission case
duplicate/retry case
historical compatibility case
```

La priorità non è massimizzare il numero di fixture.

È includere i casi che possono cambiare business outcome o compatibilità.

Production evidence può aiutarci a scoprire input che non avremmo immaginato, ma non giustifica copiare dati reali senza governance.

Possiamo usare synthetic reconstruction, anonymization, schema-preserving generation, aggregate distributions o replay sottoposto a privacy review.

La modernization non sospende Security by Design.

## Gli incidenti sono specification recovery

Un incidente storico contiene spesso informazioni preziose su ciò che il sistema non deve più permettere o deve continuare a gestire.

Per ogni incidente significativo chiediamo:

```text
quale stato/input lo ha reso possibile?
quale behavior è stato osservato?
quale regression test esiste oggi?
quale assumption mancava?
quale signal lo ha scoperto?
```

L'incidente può diventare characterization evidence e, dopo conferma, requisito o guardrail.

## L'AI accelera la raccolta, non la classificazione finale

Un agente può enumerare branch, generare candidate input, trovare boundary value, confrontare output e minimizzare failing case.

Può quindi rendere molto più economica la creazione della baseline.

Ma non dovrebbe compiere automaticamente questo salto:

```text
behavior observed
→ requirement accepted
```

Il workflow corretto è:

```text
AI finds behavior
→ characterization test
→ runtime/data evidence when needed
→ domain review
→ classify
   Required / Compatibility / Accidental / Unknown
```

## Anche un bug può essere preservato temporaneamente

Può sembrare paradossale, ma durante la fase di understanding è a volte corretto.

Se non sappiamo ancora se una differenza sia voluta, evitare di cambiarla insieme alla struttura riduce il numero di variabili contemporanee.

Quando poi il comportamento viene confermato come bug, la modifica diventa deliberata:

```text
current behavior observed
→ bug confirmed
→ target behavior decided
→ test changed intentionally
```

Questo evita di nascondere un cambiamento funzionale dentro una modernization “tecnica”.

## La baseline non rende buono il legacy

Una characterization suite non certifica il sistema.

Rende visibile una parte del suo comportamento.

Prima avevamo:

> Speriamo di non rompere niente.

Dopo abbiamo:

> Questi behavior sono osservati e protetti; questi altri restano sconosciuti; soltanto alcuni sono già confermati.

È una forma di confidence incompleta.

Ma è finalmente una confidence con confini espliciti.

> **Prima di migliorare un comportamento dobbiamo essere capaci di accorgerci quando lo abbiamo cambiato, e sapere se quel cambiamento era davvero autorizzato.**