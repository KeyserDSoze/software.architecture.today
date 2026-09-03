# Source Policy — Software Architecture Today

Questo libro distingue tra **principio editoriale**, **scenario simulato**, **caso reale documentato** e **claim fattuale verificabile**.

L'obiettivo non è riempire ogni pagina di link. È fare in modo che le affermazioni tecniche importanti possano essere ricondotte a evidenze affidabili e che i casi reali non vengano trasformati in folklore.

## Gerarchia delle fonti

Quando esiste una fonte primaria o ufficiale adeguata, viene preferita.

Ordine indicativo:

1. standard e specifiche normative;
2. RFC e documentazione dei protocolli;
3. documentazione ufficiale dei vendor o dei progetti open source;
4. paper accademici e pubblicazioni tecniche originali;
5. postmortem e engineering blog dell'organizzazione che ha operato il sistema;
6. testi e articoli di autori tecnici riconosciuti;
7. fonti secondarie soltanto quando aggiungono interpretazione utile o quando la primaria non è disponibile.

Tra le fonti ricorrenti potranno comparire, senza esclusività:

- Microsoft Learn e Azure Architecture Center;
- AWS Well-Architected Framework e Amazon Builders' Library;
- Google Cloud Architecture Framework e Google SRE resources;
- CNCF e documentazione Kubernetes;
- IETF RFC;
- NIST;
- OWASP;
- OpenTelemetry;
- PostgreSQL, Redis e altri progetti tramite documentazione ufficiale;
- Martin Fowler e altri autori riconosciuti quando la fonte è appropriata al claim.

## Claim proporzionato alla fonte

Una fonte deve sostenere ciò che il testo dice davvero.

Se una pagina documenta che un'organizzazione usa una certa tecnica, non possiamo automaticamente concludere che quella tecnica sia la causa del suo successo.

Se un postmortem descrive un incidente, non inventiamo dettagli non presenti.

Se una reference architecture mostra una soluzione possibile, non la presentiamo come soluzione universale.

## Fonti vendor: utili, non oracoli

La documentazione di Microsoft, AWS, Google o altri vendor è preziosa perché raccoglie esperienza operativa, pattern, failure mode e trade-off.

Rimane però documentazione prodotta da un vendor.

Quando il claim riguarda concetti generali, cercheremo quando utile convergenza tra più fonti o una fonte standard/vendor-neutral.

Il libro non deve trasformarsi in marketing indiretto.

## Evidence close to the claim

Quando una fonte supporta un'affermazione significativa, il riferimento deve stare vicino al punto che sostiene, non in una bibliografia irraggiungibile a fine libro.

Nei file Markdown useremo link o note leggibili.

Per capitoli con forte contenuto fattuale potranno esistere file di reference dedicati.

## ESI e i casi reali

**Example Software Industries S.p.A. (ESI)** è lo scenario enterprise interamente fittizio del libro.

Order Operations e gli altri prodotti ESI sono casi simulati/compositi. Persone, clienti, numeri, vincoli aziendali e incidenti ESI non devono essere interpretati come fatti reali.

Lo scenario ESI serve a mostrare:

- evoluzione end-to-end;
- compromessi fra stakeholder;
- cambiamenti di requisito;
- decisioni architetturali nel tempo;
- applicazione concreta delle pratiche discusse.

**Caso reale documentato** significa invece che esistono fonti verificabili per gli elementi essenziali del racconto.

Quando usiamo un caso reale:

- lo dichiariamo esplicitamente;
- preferiamo la fonte primaria dell'organizzazione coinvolta;
- distinguiamo fatti, interpretazioni e inferenze;
- non usiamo ESI per riempire i dettagli mancanti del caso reale.

## Compromessi ESI ed evidenza

Ogni capitolo contiene almeno un compromesso significativo nello scenario ESI.

Il bisogno aziendale può essere simulato, ma le proprietà tecniche su cui si basa la decisione non devono essere inventate.

Se il compromesso dipende da HTTP, database, cloud, distributed systems, security, observability, AI o altra tecnologia reale, cerchiamo evidenza appropriata.

La struttura attesa è:

```text
scenario simulato
+ proprietà tecniche verificate
+ trade-off esplicito
+ quality floor
+ guardrail
+ trigger di revisione
```

Il compromise ledger vive in:

- `capstone/example-software-industries/COMPROMISE_LEDGER.md`.

## Dati quantitativi

Benchmark, percentuali, costi, throughput, latency e altri numeri in grado di influenzare una decisione richiedono particolare cautela.

Quando sono fattuali devono avere:

- una fonte;
- il contesto di misurazione;
- la data quando rilevante;
- le condizioni che ne limitano la generalizzazione.

Quando sono numeri dello scenario ESI devono essere marcati come requisiti o assunzioni simulate, non come benchmark reali.

Quando Order Operations diventerà eseguibile, le misure del capstone dovranno indicare ambiente, workload e metodo di misura.

## Informazioni soggette a cambiamento

Cloud service, limiti, prezzi, feature di prodotto, versioni, capability dei modelli AI e raccomandazioni vendor cambiano rapidamente.

Queste informazioni devono essere verificate vicino alla pubblicazione e non trattate come conoscenza stabile.

## AI-assisted research

L'AI può aiutare a:

- trovare fonti candidate;
- confrontare documenti;
- cercare contraddizioni;
- individuare claim senza evidenza;
- proporre fonti primarie;
- preparare audit fattuali.

Non può trasformare una fonte non letta in evidenza.

La regola editoriale è:

> **prima la fonte, poi il claim; mai il contrario con una citazione decorativa aggiunta alla fine.**

## Prime fonti di riferimento

Queste fonti hanno già influenzato il metodo del libro:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Design Principles for Azure Applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [Microsoft Learn — Build for business needs](https://learn.microsoft.com/azure/architecture/guide/design-principles/build-for-business)
- [Microsoft Learn — Use Domain Analysis to Model Microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis)
- [Microsoft Learn — Manage requirements for Agile teams in Azure DevOps](https://learn.microsoft.com/azure/devops/cross-service/manage-requirements)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [AWS — Evaluate how trade-offs impact customers and architecture efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)
- [The Scrum Guide](https://scrumguides.org/scrum-guide.html)
- [Martin Fowler — Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html)

La lista crescerà con il manoscritto.