# Example Software Industries S.p.A.

> **Scenario fittizio del libro.** Azienda, persone, prodotti, numeri, clienti e incidenti descritti in questa sezione sono inventati a fini didattici. Quando il libro usa casi reali, questi vengono dichiarati esplicitamente e supportati da fonti verificabili.

Prima di entrare nei capitoli tecnici, ci serve un luogo in cui far vivere le decisioni.

Non un progetto giocattolo isolato.

Non una startup con tre persone e nessun vincolo.

Non una multinazionale reale raccontata per sentito dire.

Useremo una società immaginaria:

> **Example Software Industries S.p.A. — ESI**

ESI è una grande software product company europea con clienti internazionali, più business unit e prodotti che operano in domini molto diversi.

Il nome è volutamente trasparente: ESI non vuole sembrare un'azienda reale. È il nostro laboratorio enterprise.

## Che cosa fa ESI

ESI costruisce e gestisce software in più famiglie di prodotto.

### Engineering Software

Prodotti per aziende industriali e ingegneristiche:

- configuratori tecnici;
- workflow di progettazione;
- gestione documentale tecnica;
- integrazione con sistemi CAD/PLM;
- simulazione e raccolta dati da processi industriali.

Qui contano molto correttezza, tracciabilità, compatibilità con sistemi esistenti e cicli di vita lunghi.

### Commerce & Operations

Prodotti che supportano ordini, fulfillment, customer operations e processi commerciali.

Il capstone principale del libro, **Order Operations**, nasce in questa area.

### Payments & Risk

Capability e prodotti relativi a:

- pagamenti;
- refund;
- riconciliazione;
- fraud/risk signal;
- ledger e audit;
- integrazione con payment provider.

Qui errori apparentemente piccoli possono avere conseguenze economiche e di compliance importanti.

### Marketing Technology

Piattaforme per campagne, audience, contenuti, experimentation e customer engagement.

Qui contano time-to-market, integrazione con molti canali, volumi variabili e velocità di sperimentazione.

### Mobile Products

Applicazioni mobile B2B e B2C usate da clienti, operatori sul campo e partner.

Qui entrano offline behavior, sincronizzazione, release distribuite attraverso gli store, compatibilità client/server e UX.

### Data & AI

Piattaforme dati, analytics, recommendation, document intelligence e capability AI condivise.

Qui il libro potrà affrontare data ownership, quality, model lifecycle, RAG, evaluation, costi di inference e agenti.

### Platform Engineering & Cloud

La piattaforma interna fornisce capability comuni:

- identity integration;
- CI/CD;
- observability;
- cloud landing zone;
- secret management;
- runtime platform;
- developer experience;
- policy e guardrail.

La piattaforma deve standardizzare abbastanza da ridurre il costo operativo senza trasformarsi in un collo di bottiglia per i team prodotto.

### Corporate Systems

ERP, finance, HR, procurement, legal workflow e integrazioni interne.

Sono sistemi meno visibili ai clienti ma possono essere essenziali per il funzionamento dell'azienda.

## Una sola azienda, interessi differenti

Nel libro non fingeremo che esista una soluzione che massimizza contemporaneamente tutto.

Una decisione importante può coinvolgere esigenze tutte legittime ma in tensione.

```text
Product
  vuole valore e time-to-market

Engineering
  vuole comprensibilità ed evolvibilità

Security
  vuole ridurre il rischio e il blast radius

Operations
  vuole osservabilità, recovery e semplicità operativa

Platform
  vuole standardizzazione e leverage

Finance / FinOps
  vuole costi sostenibili e prevedibili

Legal / Compliance
  impone obblighi che non possono essere trattati come preferenze

Sales / Customer Success
  porta commitment, clienti strategici e scadenze

Leadership
  deve decidere quali trade-off sono accettabili per il business
```

Il lavoro dell'architect non consiste nel far vincere sempre una di queste funzioni.

Consiste nel rendere visibili conseguenze e alternative abbastanza bene da permettere una decisione consapevole.

> **L'architettura non elimina il compromesso. Impedisce che il compromesso rimanga nascosto.**

## Il capstone principale: Order Operations

All'interno di ESI seguiremo soprattutto l'evoluzione di **Order Operations**, inizialmente una capability interna della business unit Commerce & Operations.

Nasce con un obiettivo modesto: aiutare gli operatori a individuare e comprendere ordini problematici.

Poi il contesto cambierà.

Nel corso del libro potranno emergere:

- nuovi attori;
- nuovi mercati;
- tenancy;
- requisiti di sicurezza;
- audit;
- API esterne;
- mobile;
- crescita dei volumi;
- failure reali o simulati;
- cloud deployment;
- disaster recovery;
- nuovi team;
- pressione sui costi;
- integrazione AI.

Non conosciamo in anticipo l'architettura finale.

Questo è intenzionale.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Gli altri prodotti non sono decorazione

Le altre business unit servono a creare situazioni realistiche.

Per esempio:

- Payments potrebbe voler imporre un contratto più rigoroso a Commerce;
- Mobile potrebbe richiedere backward compatibility più lunga delle API;
- Marketing potrebbe chiedere eventi quasi real-time che cambiano la data architecture;
- Platform potrebbe proporre uno standard che riduce il costo aziendale ma non è ottimale localmente;
- Security potrebbe richiedere isolamento o least privilege che aumenta complessità operativa;
- Finance potrebbe rifiutare una soluzione tecnicamente elegante ma economicamente sproporzionata;
- un cliente enterprise potrebbe introdurre data residency, audit o SLA non previsti;
- una scadenza commerciale potrebbe obbligare il team a scegliere una soluzione reversibile invece di quella teoricamente più completa.

Queste tensioni ci permettono di ragionare sull'architettura come attività organizzativa, economica e tecnica allo stesso tempo.

## Analisi funzionale come conoscenza condivisa

ESI avrà business analyst, product manager e domain expert.

Ma il libro non userà questi ruoli come scusa per creare silos cognitivi.

Chi modifica un prodotto deve possedere almeno una visione d'insieme sufficiente a capire:

- chi lo usa;
- perché esiste;
- quali capability offre;
- quali business rule sono importanti;
- quali stati e transizioni esistono;
- quali failure e casi limite hanno significato per il dominio;
- quali sistemi possiedono i dati autorevoli;
- quali conseguenze può produrre una modifica locale.

> **L'analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

## ESI non sostituisce i casi reali

Lo scenario fittizio ci serve per sviluppare un sistema senza attribuire fatti inventati ad aziende reali.

Ma un libro di architettura non può vivere soltanto di un caso inventato.

Per questo alterneremo due livelli:

### Scenario ESI

Serve a mostrare il processo decisionale end-to-end e l'evoluzione del capstone.

### Casi reali documentati

Servono a confrontare ciò che stiamo imparando con sistemi, incidenti, pattern e trade-off realmente descritti da organizzazioni e fonti autorevoli.

Quando useremo un caso reale:

- lo dichiareremo come tale;
- citeremo la fonte vicino al claim;
- distingueremo ciò che la fonte dimostra da ciò che stiamo inferendo;
- non inventeremo dettagli mancanti.

## Evidenze metodologiche

La cornice del libro è coerente con la guidance moderna che parte dai requisiti di business e rende espliciti i trade-off fra qualità diverse.

Microsoft Azure Architecture Center raccomanda di partire dai business requirements e valutare le decisioni attraverso reliability, security, cost, operational excellence e performance, riconoscendo i trade-off fra questi obiettivi:

- [Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Design Principles for Azure Applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [Build for business needs](https://learn.microsoft.com/azure/architecture/guide/design-principles/build-for-business)

Il Well-Architected Framework documenta esplicitamente che ottimizzare una dimensione può avere conseguenze sulle altre, per esempio nei trade-off di security, reliability e cost:

- [Security trade-offs](https://learn.microsoft.com/azure/well-architected/security/tradeoffs)
- [Reliability trade-offs](https://learn.microsoft.com/azure/well-architected/reliability/tradeoffs)
- [Cost Optimization trade-offs](https://learn.microsoft.com/azure/well-architected/cost-optimization/tradeoffs)

Queste fonti non dimostrano le vicende di ESI, che sono inventate. Sostengono il modello decisionale che useremo per ragionare sullo scenario.

## La regola con cui iniziamo

Quando nel libro qualcuno propone una soluzione, non chiederemo soltanto:

> Funziona?

Chiederemo anche:

> Per chi funziona?

> Quale requisito soddisfa?

> Quale costo sposta su un'altra parte dell'azienda?

> Chi dovrà operarla?

> Quale rischio stiamo accettando?

> Che cosa succede se il contesto cambia?

È da qui che comincia la Software Architecture.