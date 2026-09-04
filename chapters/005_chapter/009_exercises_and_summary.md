## Idee chiave

Una feature descrive lavoro; un confine descrive responsabilità. La modularità utile non si misura dal numero di cartelle, ma dalla capacità di contenere il cambiamento e impedire che una decisione locale diventi conoscenza globale.

Cohesion e coupling ci aiutano a giudicare questa capacità. Teniamo insieme ciò che cambia per ragioni correlate e riduciamo la conoscenza necessaria tra parti che devono poter evolvere indipendentemente. Il coupling più pericoloso non è sempre quello visibile nelle firme: timing, dati condivisi, convenzioni e significati impliciti possono creare legami molto più profondi.

Information hiding serve a localizzare decisioni volatili. Dependency inversion protegge policy e significato dai dettagli che cambiano per motivi differenti. Nessuno dei due principi richiede di introdurre interfacce o servizi per rituale: l'astrazione ha valore quando sappiamo quale decisione sta nascondendo e quale costo di cambiamento sta riducendo.

Il domain modeling aggiunge la dimensione semantica. Il database non coincide con il dominio, un bounded context non implica automaticamente un microservizio e duplicare un dato non significa duplicarne l'ownership. Il rischio maggiore è **duplicate meaning**: più parti del sistema autorizzate a definire indipendentemente la stessa regola.

La Component Responsibility Map rende questi problemi discutibili. Esplicita ownership, invarianti, contratti e dettagli nascosti e ci permette di cercare overlap, gap e leak. Con gli agenti diventa anche context containment: un buon boundary riduce la quantità di repository che deve essere compresa per eseguire una modifica corretta.

L'AI accelera enormemente boundary discovery e refactoring, ma rende anche economico produrre decomposizioni sbagliate e astrazioni superflue. Il nuovo collo di bottiglia non è spostare il codice: è capire se la nuova struttura rappresenti davvero meglio le responsabilità reali.

## Artefatto operativo — Component Responsibility Map

Per una responsabilità significativa usiamo:

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

Poi cerchiamo tre categorie di problema:

```text
overlap
→ più componenti possiedono la stessa regola

gap
→ una regola importante non ha un proprietario chiaro

leak
→ un consumer conosce dettagli che dovrebbero restare interni
```

Non correggiamo automaticamente ogni problema con un nuovo servizio. Prima chiediamo se serva un boundary logico, un contratto migliore o semplicemente ownership più esplicita.

---

# Esercizi

## 1. Dal layout tecnico ai confini

Hai un'applicazione organizzata così:

```text
controllers/
services/
repositories/
models/
utils/
```

La feature “modifica indirizzo di consegna” richiede cambiamenti in nove file distribuiti in tutte le cartelle.

Ricostruisci almeno due possibili responsabilità di dominio nascoste dal layout tecnico. Per ciascuna indica dati rilevanti, invarianti, dipendenze e dettagli che dovrebbero rimanere interni. Non proporre ancora microservizi.

## 2. Cohesion review

Un modulo `CustomerManagement` contiene registrazione cliente, preferenze marketing, autenticazione, loyalty points, esportazione CSV, reset password e rendering invoice PDF.

Dividi le responsabilità soltanto dove esistono ragioni di cambiamento realmente differenti. Spiega anche quali elementi lasceresti insieme e perché.

## 3. Coupling invisibile

Due servizi espongono una sola operazione:

```text
POST /reserve
```

Il consumer deve però conoscere timeout di tre secondi, reservation TTL di dieci minuti, tre codici di errore retryable, un ordine obbligatorio rispetto a una seconda operazione e un comportamento speciale nei weekend.

Descrivi il contratto reale e proponi come rendere esplicita quella semantica senza necessariamente cambiare protocollo.

## 4. Information hiding

Cinque moduli leggono direttamente `payments.transactions`: uno per visualizzare lo stato, uno per decidere se spedire, uno per reporting, uno per customer support e uno per refund.

Per ciascun consumer identifica l'informazione che serve davvero, se debba essere sincrona o storica e quale dettaglio della persistenza possa essere nascosto. Disegna almeno due contratti distinti invece di sostituire tutte le query con una singola API generica.

## 5. Dependency inversion

Considera:

```ts
class InvoiceService {
  constructor(
    private readonly sql: PostgresClient,
    private readonly blob: AzureBlobClient,
    private readonly mail: MailProviderClient
  ) {}
}
```

Non creare interfacce meccanicamente. Identifica prima policy, dettagli infrastrutturali e decisioni che vale la pena rendere locali. Poi proponi una dependency direction migliore e spiega quali dipendenze possono restare concrete.

## 6. Duplicate meaning

Frontend, backend e mobile implementano indipendentemente:

```text
un ordine può essere annullato se status = PAID e shippedAt è null
```

Spiega perché non è soltanto duplicazione di codice. Proponi almeno due strategie per mantenere una fonte autorevole senza obbligare la UI a una chiamata remota per ogni dettaglio visuale.

## 7. Domain language

La parola `completed` viene usata da Payments, Warehouse, Shipping, Orders e Analytics.

Per ogni contesto descrivi che cosa potrebbe significare. Poi scegli tra definizione unica, termini differenti o mapping espliciti e giustifica la scelta.

## 8. Order Operations — cancellazione concorrente

Due richieste di cancellazione arrivano quasi contemporaneamente. La cancellation policy appartiene a Orders, mentre un eventuale refund appartiene a Payments.

Disegna invarianti, contratto tra i componenti, meccanismo di idempotenza e punto in cui la responsabilità di Orders deve fermarsi. Non risolvere il problema introducendo semplicemente una transaction database cross-module.

## 9. AI boundary discovery

Prendi un repository che conosci e chiedi a un agente di identificare responsabilità, file che cambiano frequentemente insieme, accessi diretti a dati di altre aree e tre boundary hypothesis.

Per ogni ipotesi deve fornire evidenza e incertezza. Poi critica manualmente il risultato: quale decomposizione sembrava elegante ma non reggeva alla conoscenza reale del sistema?

## 10. Adversarial decomposition

Prendi una decomposizione proposta da te o dall'AI ed esegui due review opposte.

Prima prova a dimostrare che abbiamo **separato troppo**, cercando invarianti condivise, transazioni, change coupling, latency sensibile e deployment coordinati. Poi prova a dimostrare che abbiamo **separato troppo poco**, cercando ownership distinta, vocabolari differenti, failure domain, security boundary e ragioni indipendenti di cambiamento.

Confronta le due analisi e prendi una decisione esplicita.

---

## Domande di autovalutazione

1. Riesco a distinguere una classificazione tecnica da un confine di responsabilità?
2. So spiegare la cohesion in termini di ragioni di cambiamento?
3. Quando valuto il coupling considero anche semantica, tempo, dati e cambiamenti coordinati?
4. Riesco a identificare quali decisioni un modulo dovrebbe nascondere?
5. So distinguere un'astrazione utile da un'interfaccia introdotta per rituale?
6. Riesco a spiegare la direzione delle dipendenze tra policy e dettagli?
7. So distinguere ownership del dato dalla semplice presenza del dato?
8. Riesco a riconoscere duplicate meaning anche quando il codice non è letteralmente duplicato?
9. So usare un bounded context senza trasformarlo automaticamente in un microservizio?
10. Posso descrivere per ogni component cosa possiede, espone e non deve conoscere?
11. Quando l'AI propone una decomposizione, so chiedere evidenza invece di accettare il layout?
12. Riesco a ridurre astrazioni senza perdere invarianti e reversibilità?

## Cosa cambia con l'AI

Dependency graph, change history, decomposizioni alternative, adapter, import e refactoring repository-wide diventano molto più economici. Questa capacità sposta il collo di bottiglia.

La domanda non è più soprattutto “quanto lavoro serve per riorganizzare il repository?”. Diventa:

> **Siamo sicuri che la nuova organizzazione rappresenti meglio le responsabilità reali?**

Un agente può rendere economica una ristrutturazione sbagliata e può perfino renderla pulita, coerente e ben testata. Se però abbiamo assegnato il significato al component sbagliato, il sistema continuerà a pagare quella decisione.

## Dal design alla qualità

A questo punto Order Operations ha un problema definito, un contesto sistemico, decisioni architetturali esplicite e una prima struttura di responsabilità. Manca ancora una dimensione fondamentale: sappiamo **dove** vogliamo far vivere il comportamento, ma non abbiamo ancora definito con precisione **quali qualità** il sistema debba garantire.

“Veloce”, “affidabile”, “sicuro”, “scalabile” ed “economico” non discriminano abbastanza tra alternative. Nel prossimo capitolo trasformeremo questi aggettivi in condizioni verificabili e architecturally significant quality attributes.

## Corollario

> **Un buon confine non separa il codice. Separa le ragioni per cui il codice deve cambiare.**
