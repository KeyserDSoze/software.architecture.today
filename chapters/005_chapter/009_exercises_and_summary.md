## Idee chiave

1. Una feature descrive lavoro; un confine descrive responsabilità.
2. La modularità utile contiene il cambiamento, non moltiplica cartelle.
3. Cohesion alta significa che le parti interne condividono ragioni forti per cambiare insieme.
4. Coupling basso non significa zero dipendenze: significa dipendenze comprensibili e con costo controllato.
5. Il coupling semantico può essere molto più forte di quello visibile nelle firme o nei diagrammi.
6. Information hiding serve a mantenere locali le decisioni volatili.
7. Un database condiviso non obbliga a condividere ownership.
8. Dependency inversion riguarda la direzione della conoscenza, non il numero di interface.
9. Il domain model deve proteggere significato e invarianti, non riprodurre lo schema database.
10. Un bounded context non implica automaticamente un microservizio.
11. Duplicate data può essere accettabile; duplicate meaning è molto più pericoloso.
12. Il Component Responsibility Map rende visibili ownership, overlap, gap e dipendenze.
13. Gli agenti possono proporre confini velocemente, ma tendono anche verso pattern-shaped architecture.
14. Boilerplate economico non significa complessità gratuita.
15. Un buon confine riduce il contesto necessario per cambiare il sistema senza nascondere dipendenze essenziali.

## Artefatto operativo — Component Responsibility Map

Per una responsibility significativa, prova a compilare:

```text
Component:

Responsabilità:

È autorevole su:

Invarianti principali:

Espone:

Nasconde:

Dipende da:

Non deve conoscere:

Failure rilevanti:

Ragioni tipiche di cambiamento:
```

Poi cerca tre categorie di problema:

```text
overlap
→ più componenti possiedono la stessa regola

gap
→ una regola importante non ha un proprietario chiaro

leak
→ un consumer conosce dettagli che dovrebbero restare interni
```

Non correggere automaticamente ogni problema con un nuovo servizio.

Prima verifica se serve un confine logico, una responsabilità più chiara o semplicemente un contratto migliore.

## Esercizi

### 1. Dal layout tecnico ai confini

Hai un'applicazione organizzata così:

```text
controllers/
services/
repositories/
models/
utils/
```

Una nuova feature “modifica indirizzo di consegna” richiede cambiamenti in nove file distribuiti in tutte le cartelle.

Ricostruisci almeno due possibili responsabilità di dominio che potrebbero essere nascoste dal layout tecnico.

Per ciascuna indica:

- dati rilevanti;
- invarianti;
- dipendenze;
- dettagli da nascondere.

Non proporre ancora microservizi.

### 2. Cohesion review

Un modulo `CustomerManagement` contiene:

- registrazione cliente;
- preferenze marketing;
- autenticazione;
- calcolo loyalty points;
- esportazione CSV clienti;
- reset password;
- rendering invoice PDF.

Dividi le responsabilità soltanto dove ritieni che esistano ragioni di cambiamento realmente differenti.

Spiega anche quali elementi lasceresti insieme e perché.

### 3. Coupling invisibile

Due servizi comunicano attraverso un'API con una sola operazione:

```text
POST /reserve
```

Il consumer deve però conoscere:

- timeout di 3 secondi;
- reservation TTL di 10 minuti;
- tre codici di errore retryable;
- ordine obbligatorio rispetto a una seconda operazione;
- comportamento speciale nei weekend.

Analizza il coupling reale.

Proponi come rendere più esplicito il contratto senza necessariamente cambiare il protocollo.

### 4. Information hiding

In un sistema, cinque moduli leggono direttamente `payments.transactions`.

Uno usa la tabella per visualizzare lo stato, uno per decidere se spedire, uno per reporting, uno per customer support e uno per refund.

Per ciascun consumer chiediti:

- quale informazione gli serve davvero?
- deve essere sincrona?
- è storica o autorevole?
- quale dettaglio della persistenza potrebbe essere nascosto?

Disegna almeno due contratti differenti invece di sostituire tutte le query con una singola API generica.

### 5. Dependency inversion

Considera questo codice:

```ts
class InvoiceService {
  constructor(
    private readonly sql: PostgresClient,
    private readonly blob: AzureBlobClient,
    private readonly mail: MailProviderClient
  ) {}
}
```

Non creare interface meccanicamente.

Identifica prima:

- policy;
- dettagli infrastrutturali;
- decisioni che vale la pena rendere locali;
- dipendenze che possono restare concrete.

Poi proponi una versione migliorata.

### 6. Duplicate meaning

Frontend, backend e mobile implementano indipendentemente questa regola:

```text
un ordine può essere annullato se status = PAID e shippedAt è null
```

Spiega perché il problema non è semplicemente duplicazione di codice.

Proponi almeno due strategie per avere una fonte autorevole senza rendere la UI inutilmente dipendente da chiamate remote per ogni dettaglio visuale.

### 7. Domain language

In un sistema e-commerce la parola `completed` viene usata da:

- Payments;
- Warehouse;
- Shipping;
- Orders;
- Analytics.

Per ogni contesto proponi cosa potrebbe significare.

Poi decidi se vuoi:

- una definizione unica;
- termini diversi;
- mapping espliciti tra contesti.

Giustifica la scelta.

### 8. Order Operations — cancellazione concorrente

Nel capstone, due richieste di cancellazione arrivano quasi contemporaneamente.

La cancellation policy appartiene a Orders, mentre il refund appartiene a Payments.

Disegna:

- le invarianti;
- il contratto tra i componenti;
- un meccanismo di idempotenza;
- il punto in cui la responsabilità deve fermarsi.

Non risolvere il problema distribuendo semplicemente una transaction database cross-module.

### 9. AI boundary discovery

Prendi un repository che conosci.

Chiedi a un agente di:

1. identificare responsabilità;
2. trovare file che cambiano frequentemente insieme;
3. individuare accessi diretti a dati appartenenti ad altre aree;
4. proporre 3 boundary hypothesis;
5. indicare evidenza e incertezza per ciascuna.

Poi critica manualmente il risultato.

Quale ipotesi sembrava elegante ma non reggeva alla conoscenza reale del sistema?

### 10. Adversarial decomposition

Prendi una decomposizione proposta da te o dall'AI.

Esegui due review opposte.

Prima:

> “Dimostra che abbiamo separato troppo.”

Cerca:

- invarianti condivise;
- transazioni;
- change coupling;
- latency sensibile;
- deployment sempre coordinati.

Poi:

> “Dimostra che abbiamo separato troppo poco.”

Cerca:

- ownership distinta;
- vocabolari differenti;
- failure domain;
- security boundary;
- ragioni indipendenti di cambiamento.

Confronta le due analisi e prendi una decisione.

## Domande di autovalutazione

1. Riesco a distinguere una classificazione tecnica da un confine di responsabilità?
2. So spiegare la cohesion senza usare soltanto la parola “insieme”?
3. Quando valuto il coupling considero anche semantica, tempo, dati e cambiamenti coordinati?
4. Riesco a identificare quali decisioni un modulo dovrebbe nascondere?
5. So distinguere un'astrazione utile da una interface introdotta per rituale?
6. Riesco a spiegare la direzione delle dipendenze tra policy e dettagli?
7. So distinguere ownership del dato dalla semplice presenza del dato?
8. Riesco a riconoscere duplicate meaning anche quando il codice non è letteralmente duplicato?
9. So usare un bounded context senza trasformarlo automaticamente in un microservizio?
10. Posso descrivere per ogni componente cosa possiede, espone e non deve conoscere?
11. Quando l'AI propone una decomposizione, so chiedere evidenza invece di accettare il layout?
12. Riesco a ridurre astrazioni senza perdere invarianti e reversibilità?

## Cosa cambia con l'AI

L'AI rende molto più economico:

- esplorare dependency graph;
- individuare duplicazioni;
- analizzare change history;
- proporre bounded context;
- generare adapter;
- spostare file;
- aggiornare import;
- produrre test;
- confrontare decomposizioni alternative.

Questo sposta ancora una volta il collo di bottiglia.

Il problema non è più principalmente:

> “Quanto lavoro serve per riorganizzare il repository?”

Diventa:

> **“Siamo sicuri che la nuova organizzazione rappresenti meglio le responsabilità reali?”**

Un agente può rendere economica una ristrutturazione sbagliata.

Può persino renderla pulita, coerente e ben testata.

Ma se abbiamo assegnato la regola al componente sbagliato, il sistema continuerà a pagare quella decisione.

## Dal design alla qualità

A questo punto Order Operations ha:

- un problema definito;
- un contesto sistemico;
- decisioni architetturali esplicite;
- una prima struttura di responsabilità.

Ma manca ancora una dimensione fondamentale.

Dire che il sistema deve essere:

- veloce;
- affidabile;
- sicuro;
- scalabile;
- economico;

non ci aiuta abbastanza.

Nel prossimo capitolo trasformeremo questi aggettivi in **condizioni verificabili**.

Entreremo nei non-functional requirements e negli architecturally significant quality attributes.

Perché una buona decomposizione non basta se non sappiamo che cosa il sistema deve sopportare.

## Corollario

> **Un buon confine non separa il codice. Separa le ragioni per cui il codice deve cambiare.**
