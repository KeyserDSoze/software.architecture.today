## Context engineering

Per molto tempo abbiamo parlato di **prompt engineering**.

La disciplina non scompare.

Saper formulare bene una richiesta continua a essere utile.

Ma nel software engineering reale il singolo prompt è soltanto una parte del problema.

Un agente che deve modificare un repository ha bisogno di molto più di una frase ben scritta.

Ha bisogno di capire il contesto operativo in cui quella frase deve essere interpretata.

Da qui nasce il concetto di **context engineering**.

### Il prompt è un ingresso, non il sistema

Supponiamo di chiedere:

> “Aggiungi il supporto ai webhook.”

La frase è comprensibile.

Ma per lavorare bene un agente dovrebbe sapere almeno:

- quali webhook;
- chi li invia;
- come autentichiamo il sender;
- quale formato accettiamo;
- cosa significa elaborazione riuscita;
- se dobbiamo rispondere prima o dopo il processing;
- come gestiamo duplicati;
- come gestiamo ordering;
- quali dati sono sensibili;
- quali eventi esistono già;
- quale naming usa il repository;
- quale libreria HTTP è standard;
- come vengono gestiti retry e logging;
- quali test sono obbligatori;
- quali boundary non devono essere attraversati.

Possiamo mettere tutto nel prompt.

Ma se molte di queste informazioni sono stabili e ricorrenti, ripeterle ogni volta è inefficiente.

Dovrebbero vivere nel sistema di contesto del progetto.

### Le fonti di contesto

Un agente può ricevere contesto da molte fonti:

```text
istruzioni globali
+ repository
+ documentazione
+ ADR
+ issue
+ codice esistente
+ test
+ contratti
+ esempi
+ tool disponibili
+ permission boundary
+ stato dell'ambiente
```

La qualità del risultato dipende dal modo in cui queste fonti si combinano.

Se sono coerenti, l'agente può muoversi con maggiore autonomia.

Se si contraddicono, l'agente deve scegliere quale fonte considerare autorevole.

Se non definiamo una gerarchia, quella scelta può essere implicita.

### Source of truth

Una domanda centrale del context engineering è:

> **dove vive la verità operativa del progetto?**

Il requisito è nell'issue o nel documento di feature?

Il contratto API è nel codice, in OpenAPI o in una pagina wiki?

La decisione architetturale è nel README o nell'ADR?

Il comando di build corretto è nella documentazione o nella CI?

La policy di sicurezza è descritta in un file che non corrisponde più all'implementazione?

Un sistema con cinque fonti autorevoli che si contraddicono non ha più contesto.

Ha rumore.

Per questo un repository AI-ready deve essere anche un repository in cui le fonti di verità sono dichiarate e mantenute.

### Context quality > prompt cleverness

Un prompt brillante non può compensare completamente un contesto povero.

Consideriamo due scenari.

Nel primo, il repository non documenta boundary, test, comandi, decisioni o convenzioni.

Scriviamo un prompt lungo e sofisticato.

Nel secondo, il repository contiene:

```text
AGENTS.md
architecture/overview.md
architecture/security.md
adr/
contracts/
features/
tests/
```

Il task può essere molto più breve perché rimanda a fonti stabili.

Nel secondo caso abbiamo spostato conoscenza da una interazione effimera a una memoria riutilizzabile.

Questa è una delle idee più importanti del libro:

> **la qualità dell'agente dipende spesso più dal contesto operativo che dalla brillantezza del singolo prompt.**

### Contesto minimo sufficiente

Anche il context engineering può degenerare.

Possiamo riempire un agente di documenti, regole, esempi, policy e history fino a rendere il contesto enorme e contraddittorio.

Più contesto non significa automaticamente contesto migliore.

Serve il **contesto minimo sufficiente** per prendere bene le decisioni richieste dal task.

Per una modifica locale potrebbero bastare:

- issue;
- modulo interessato;
- contract;
- test;
- convenzioni.

Per una decisione architetturale potrebbero servire anche:

- NFR;
- deployment;
- security assumptions;
- cost constraints;
- ADR precedenti;
- roadmap.

Il context engineering è anche selezione.

### Context window e contesto organizzato

Una finestra di contesto molto grande non risolve da sola il problema.

Possiamo inserire centinaia di file e sperare che il modello trovi ciò che serve.

A volte funziona.

Ma un repository ben organizzato permette di fare qualcosa di migliore: rendere esplicite le relazioni.

Per esempio:

```text
feature
→ contract
→ owner
→ ADR rilevante
→ test
→ deployment impact
```

Questo riduce il lavoro inferenziale richiesto.

Il contesto non deve essere soltanto disponibile.

Deve essere **navigabile**.

### Tool access è contesto operativo

Un agente non è definito soltanto da ciò che sa.

È definito anche da ciò che può fare.

Può leggere il repository?

Può modificare file?

Può eseguire test?

Può interrogare un database?

Può accedere al cloud?

Può aprire una pull request?

Può fare deploy?

Può leggere secret?

Questi permessi fanno parte del context engineering perché cambiano il tipo di decisione che possiamo delegare.

Un agente con accesso in sola lettura può essere usato con una tolleranza al rischio diversa da un agente che può modificare produzione.

Il contesto include quindi anche **capability e permission boundary**.

### Esempi come specifica implicita

Gli esempi sono una forma di contesto molto potente.

Se mostriamo un'issue ben scritta, un ADR ben fatto o un test rappresentativo, stiamo insegnando una convenzione.

Questo può essere più efficace di una lunga lista di regole astratte.

Ma gli esempi possono anche perpetuare errori.

Un vecchio test copiato dieci volte diventa rapidamente una pseudo-standard.

Un workaround storico può essere interpretato come pattern preferito.

Per questo anche gli esempi devono avere qualità e freshness.

### Documentation drift

La documentazione come contesto introduce un rischio inevitabile: il drift.

Un documento obsoleto può essere peggiore dell'assenza di documento perché fornisce una falsa certezza.

Questo cambia il modo in cui dobbiamo pensare alla documentazione.

Non basta crearla.

Dobbiamo progettare il modo in cui resta collegata al sistema.

Possibili strategie:

- documenti piccoli e vicini al codice rilevante;
- ADR immutabili con stato esplicito;
- contract generabili o validabili;
- test che esprimono invarianti architetturali;
- link tra feature e decisioni;
- ownership dei documenti critici;
- review della documentazione nello stesso change set.

> **Documentation is part of the architecture soltanto se rimane abbastanza affidabile da guidare decisioni.**

### Dal prompt al sistema operativo del progetto

Il passaggio più interessante è questo:

```text
prompt engineering
→ task engineering
→ context engineering
→ repository engineering
```

All'inizio ottimizziamo la singola richiesta.

Poi impariamo a definire meglio il task.

Poi costruiamo un contesto riutilizzabile.

Infine il repository stesso diventa un ambiente in cui umani e agenti possono lavorare con meno ambiguità.

Questo tema tornerà in modo molto più approfondito nella parte AI-native del libro.

Per ora ci serve una conclusione semplice:

> **se dobbiamo spiegare da zero il progetto a ogni task, il problema non è soltanto il prompt. È l'architettura del contesto.**
