# 17.3 — Characterization: proteggere il comportamento prima di giudicarlo

Quando ereditiamo codice che non comprendiamo, il primo test utile non è sempre un test di correttezza.

Spesso è un test di **caratterizzazione**.

La domanda non è ancora:

> “Questo comportamento è giusto?”

È:

> **“Che cosa fa il sistema oggi, in condizioni osservabili e ripetibili?”**

## Behavior first

Un characterization test cattura un comportamento esistente per poter rilevare variazioni durante una modifica successiva.

Microsoft descrive esplicitamente i characterization test come una regression suite utile a determinare il comportamento di codice esistente e come base per affrontare refactoring di legacy o codice non familiare.

Fonte:

- [Microsoft Learn — IntelliTest: Characterization tests](https://learn.microsoft.com/en-us/visualstudio/test/intellitest-manual/)

Martin Fowler ha discusso lo stesso uso nel lavoro con codice legacy: prima rendere osservabile il comportamento, poi introdurre seam e refactoring con una rete di sicurezza.

Fonte:

- [Martin Fowler — Modern Mocking Tools and Black Magic](https://martinfowler.com/articles/modernMockingTools.html)

## Characterization non significa approvazione

Questo punto è fondamentale.

Supponiamo che il legacy produca:

```text
Enterprise tenant + Payment case + age > 30 min
→ Priority = Urgent
```

Un characterization test può fissare:

```text
input X
→ output Urgent
```

Questo dimostra che il comportamento esiste.

Non dimostra che:

- sia ancora richiesto;
- sia corretto;
- sia stato progettato intenzionalmente;
- debba essere portato nel nuovo sistema.

Per questo separiamo:

```text
Observed behavior
≠
Confirmed requirement
```

## Tre categorie di comportamento

Durante la discovery classifichiamo progressivamente ciò che osserviamo.

### 1. Required behavior

Il comportamento è confermato da:

- Product/domain owner;
- contratto;
- compliance;
- processo operativo corrente;
- requirement esplicito.

Deve essere preservato o sostituito con una semantica deliberatamente equivalente.

### 2. Compatibility behavior

Il comportamento esiste perché un consumer legacy lo richiede ancora.

Potrebbe non essere desiderabile nel target finale, ma non può essere rimosso immediatamente.

### 3. Accidental behavior

Il comportamento è un effetto storico non più desiderato.

Può essere:

- bug;
- workaround obsoleto;
- default sbagliato;
- dead branch;
- output non più consumato.

La modernizzazione dovrebbe eliminarlo, non conservarlo per fedeltà archeologica.

## Golden master

Per sistemi complessi può essere utile catturare output esistenti su un insieme rappresentativo di input e confrontare il nuovo comportamento con il baseline.

Schema:

```text
representative input corpus
→ legacy implementation
→ normalized observable output
→ baseline

new implementation
→ same input corpus
→ normalized observable output
→ diff
```

Questo approccio è spesso chiamato **golden master**.

È potente quando:

- l'output è deterministico o normalizzabile;
- la semantica è complessa;
- non abbiamo ancora una specifica completa;
- possiamo costruire un corpus rappresentativo.

È pericoloso quando fotografiamo indiscriminatamente tutto.

## Snapshot illusion

Un enorme snapshot può dare falsa sicurezza.

Se contiene:

- timestamp;
- ID random;
- ordering accidentale;
- formatting irrilevante;
- implementation detail;
- cache metadata;

ogni modifica produrrà rumore.

Il team inizierà ad aggiornare snapshot senza capirli.

A quel punto il test non protegge più il comportamento.

Protegge il file snapshot.

Regola:

> **Caratterizza l'output semanticamente importante, non ogni byte che il sistema produce.**

## Testare dal boundary

Quando possibile, caratterizziamo il sistema attraverso boundary stabili:

```text
public function
API
message contract
DB result
batch output
file format
```

Questo riduce il rischio di legare i test alla struttura interna che vogliamo proprio cambiare.

### Esempio

Fragile:

```text
assert private method A calls private method B twice
```

Più utile:

```text
when Payment case has current legacy input X
then priority result is Urgent
and nightly-export eligibility is true
```

## Il problema delle dipendenze reali

Il legacy spesso è difficile da testare perché il comportamento è intrecciato con:

- clock globale;
- filesystem;
- database statico;
- singleton;
- network call;
- environment variable;
- framework lifecycle;
- global configuration.

Non dobbiamo necessariamente risolvere tutto prima del primo test.

Possiamo iniziare catturando un comportamento abbastanza esterno.

Poi introdurre seam progressivamente.

Ma un mock molto potente può nascondere quanto il codice sia accoppiato.

Il test passa.

La progettazione resta fragile.

Fowler mostra proprio questa tensione: strumenti di mocking potenti possono rendere testabile il legacy senza costringerci a migliorare i seam; una piccola ristrutturazione può rendere sia codice sia test più leggibili.

## Characterization corpus

Per una capability significativa costruiamo un corpus intenzionale.

Categorie:

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

Il corpus deve includere soprattutto casi che hanno conseguenze business.

Non soltanto input facili da generare.

## Production-derived input

I dati di produzione possono aiutare a trovare casi che non avremmo immaginato.

Ma non copiamo production data senza governance.

Possibili strategie:

- synthetic reconstruction;
- anonymization;
- schema-preserving generation;
- sampled identifier-free fixtures;
- aggregate distribution analysis;
- privacy-reviewed replay.

Security e privacy restano quality floor anche durante la modernization.

## Characterization e incidenti

Gli incidenti storici sono una fonte preziosa di casi.

Per ogni incidente significativo chiediamo:

- quale input/stato lo ha reso possibile?
- esiste oggi un regression test?
- il test vive al layer giusto?
- quale assumption mancava?
- quale monitoring lo ha scoperto?

Il legacy spesso contiene conoscenza sedimentata proprio negli incidenti.

## Characterization con AI

Un agente può accelerare molto questa fase.

Può:

- enumerare branch;
- trovare boundary value;
- generare input candidate;
- confrontare output;
- minimizzare un failing case;
- proporre regression test;
- estrarre fixture da trace/log anonimizzati.

Ma non deve decidere da solo che un comportamento osservato sia desiderabile.

Workflow:

```text
AI finds behavior
→ characterization test
→ runtime evidence if needed
→ domain review
→ classify behavior
   required / compatibility / accidental
```

## Un test può preservare anche un bug

È una conseguenza intenzionale della fase.

Se non sappiamo ancora se il comportamento sia corretto, possiamo temporaneamente preservarlo per ridurre il rischio di cambiamento simultaneo.

Poi apriamo una decisione separata:

```text
current behavior
→ confirmed bug
→ new requirement
→ explicit behavior change
→ test updated deliberately
```

Non cambiamo semantica nel mezzo di una modernization tecnica senza renderlo visibile.

## Il valore della baseline

Una characterization suite ben costruita non rende il legacy buono.

Rende il legacy **misurabile durante il cambiamento**.

Questo cambia la nostra posizione.

Prima:

> “Speriamo di non rompere niente.”

Dopo:

> “Questi comportamenti noti sono protetti; questi altri restano non verificati.”

È ancora incompleto.

Ma è una forma molto più onesta di confidence.

> **Prima di migliorare un comportamento dobbiamo essere capaci di accorgerci quando lo abbiamo cambiato.**