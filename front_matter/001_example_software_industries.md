# Example Software Industries S.p.A.

> **Scenario fittizio del libro.** Azienda, persone, prodotti, numeri, clienti e incidenti descritti in questa sezione sono inventati a fini didattici. Quando il libro usa casi reali, questi vengono dichiarati esplicitamente e supportati da fonti verificabili.

Prima di entrare nei capitoli tecnici ci serve un luogo in cui far vivere le decisioni. Non un progetto giocattolo isolato, non una startup con tre persone e nessun vincolo, e nemmeno una multinazionale reale raccontata per sentito dire. Useremo una società immaginaria:

> **Example Software Industries S.p.A. — ESI**

ESI è una grande software product company europea con clienti internazionali, più business unit e prodotti che operano in domini molto diversi. Il nome è volutamente trasparente: ESI non vuole sembrare un'azienda reale. È il nostro laboratorio enterprise, abbastanza ampio da far emergere conflitti di priorità, vincoli organizzativi, pressioni commerciali e costi operativi senza attribuire fatti inventati a nessuno.

## Che cosa fa ESI

ESI costruisce e gestisce software in più famiglie di prodotto. Nell'area **Engineering Software** sviluppa configuratori tecnici, workflow di progettazione, gestione documentale, integrazioni CAD/PLM, simulazione e raccolta dati da processi industriali. Qui correttezza, tracciabilità, compatibilità e cicli di vita lunghi pesano spesso più della rapidità con cui si può sostituire una tecnologia.

La business unit **Commerce & Operations** supporta ordini, fulfillment, customer operations e processi commerciali. È qui che nasce **Order Operations**, il capstone principale del libro.

**Payments & Risk** gestisce capability legate a pagamenti, refund, riconciliazione, fraud signal, ledger, audit e integrazione con payment provider. In questo dominio un difetto apparentemente piccolo può diventare un problema economico, di sicurezza o di compliance.

**Marketing Technology** lavora su campagne, audience, contenuti, experimentation e customer engagement. Qui time-to-market, integrazione con molti canali, volumi variabili e velocità di sperimentazione esercitano una pressione diversa rispetto ai sistemi con cicli di vita più lunghi.

I **Mobile Products** servono clienti, operatori sul campo e partner. Offline behavior, sincronizzazione, compatibilità client/server e release distribuite attraverso gli store rendono visibili vincoli che nel backend possono restare nascosti più a lungo.

La divisione **Data & AI** costruisce piattaforme dati, analytics, recommendation, document intelligence e capability AI condivise. Ci permetterà di affrontare ownership del dato, qualità, lifecycle dei modelli, RAG, evaluation, inference cost e agenti senza trasformare questi temi in un libro separato.

**Platform Engineering & Cloud** fornisce identity integration, CI/CD, observability, cloud landing zone, secret management, runtime platform, developer experience, policy e guardrail. La sua sfida è standardizzare abbastanza da ridurre il costo operativo senza diventare un collo di bottiglia per i team prodotto.

Infine, i **Corporate Systems** coprono ERP, finance, HR, procurement, legal workflow e integrazioni interne. Sono meno visibili ai clienti, ma possono essere essenziali per il funzionamento dell'azienda e introdurre dipendenze che un progetto apparentemente locale non può ignorare.

## Una sola azienda, interessi differenti

Nel libro non fingeremo che esista una soluzione capace di massimizzare contemporaneamente tutto. Product cercherà valore e time-to-market; Engineering vorrà comprensibilità ed evolvibilità; Security cercherà di ridurre rischio e blast radius; Operations pretenderà osservabilità, recovery e semplicità operativa. Platform Engineering spingerà verso standardizzazione e leverage, mentre Finance e FinOps guarderanno sostenibilità e prevedibilità dei costi. Legal e Compliance imporranno obblighi che non sono semplici preferenze; Sales e Customer Success porteranno commitment e scadenze; la leadership dovrà infine decidere quali trade-off siano accettabili per il business.

Il lavoro dell'architect non consiste nel far vincere sempre una di queste funzioni. Consiste nel rendere visibili conseguenze e alternative abbastanza bene da permettere una decisione consapevole.

> **L'architettura non elimina il compromesso. Impedisce che il compromesso rimanga nascosto.**

## Il capstone principale: Order Operations

All'interno di ESI seguiremo soprattutto l'evoluzione di **Order Operations**, inizialmente una capability interna della business unit Commerce & Operations. Nasce con un obiettivo modesto: aiutare gli operatori a individuare e comprendere ordini problematici.

Poi il contesto cambia. Entrano nuovi attori e nuovi mercati, compaiono tenancy e requisiti di sicurezza più severi, audit e API esterne, client mobile, crescita dei volumi e failure che costringono a rivedere ciò che sembrava sufficiente. Più avanti arriveranno cloud deployment, disaster recovery, nuovi team, pressione sui costi e integrazione AI.

Non conosciamo in anticipo l'architettura finale, e questo è intenzionale.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Gli altri prodotti non sono decorazione

Le altre business unit servono a creare tensioni realistiche attorno a Order Operations. Payments può imporre contratti più rigorosi; Mobile può richiedere una backward compatibility molto più lunga; Marketing può chiedere eventi quasi real-time che cambiano la data architecture. Platform può proporre uno standard che riduce il costo aziendale ma non è ottimale localmente, Security può chiedere isolamento o least privilege aumentando la complessità operativa, e Finance può rifiutare una soluzione tecnicamente elegante ma economicamente sproporzionata. Un cliente enterprise può introdurre data residency, audit o SLA non previsti; una scadenza commerciale può costringere il team a scegliere una soluzione reversibile invece di quella teoricamente più completa.

Queste tensioni ci permettono di trattare l'architettura come attività organizzativa, economica e tecnica nello stesso momento, non come semplice scelta di componenti.

## Analisi funzionale come conoscenza condivisa

ESI avrà business analyst, product manager e domain expert, ma il libro non userà questi ruoli come scusa per creare silos cognitivi. Chi modifica un prodotto deve possedere almeno una visione d'insieme sufficiente a capire chi lo usa e perché esiste, quali capability offre, quali business rule e transizioni di stato contano, quali failure hanno significato per il dominio e quali sistemi possiedono i dati autorevoli. Deve inoltre sapere quali conseguenze può produrre una modifica locale fuori dal proprio perimetro immediato.

> **L'analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

## ESI non sostituisce i casi reali

Lo scenario fittizio ci serve per sviluppare un sistema senza attribuire fatti inventati ad aziende reali. Ma un libro di architettura non può vivere soltanto di un caso immaginario. Per questo alterneremo il percorso ESI, utile a seguire decisioni ed evoluzione end-to-end, con casi reali documentati che mostrano sistemi, incidenti, pattern e trade-off descritti pubblicamente da organizzazioni reali.

Quando useremo un caso reale lo dichiareremo come tale, citeremo la fonte vicino al claim e distingueremo ciò che la fonte dimostra da ciò che stiamo inferendo. I dettagli mancanti resteranno mancanti: non verranno riempiti per rendere la storia più elegante.

## Evidenze metodologiche

La cornice del libro è coerente con una guidance architetturale che parte dai requisiti di business e rende espliciti i trade-off fra qualità diverse. Microsoft Azure Architecture Center raccomanda di partire dai business requirements e valutare le decisioni attraverso reliability, security, cost, operational excellence e performance, riconoscendo che ottimizzare una dimensione può produrre conseguenze sulle altre.

Fonti principali:

- [Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Design Principles for Azure Applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [Build for business needs](https://learn.microsoft.com/azure/architecture/guide/design-principles/build-for-business)
- [Security trade-offs](https://learn.microsoft.com/azure/well-architected/security/tradeoffs)
- [Reliability trade-offs](https://learn.microsoft.com/azure/well-architected/reliability/tradeoffs)
- [Cost Optimization trade-offs](https://learn.microsoft.com/azure/well-architected/cost-optimization/tradeoffs)

Queste fonti non dimostrano le vicende di ESI, che sono inventate. Sostengono il modello decisionale che useremo per ragionare sullo scenario.

## La regola con cui iniziamo

Quando nel libro qualcuno proporrà una soluzione non ci fermeremo alla domanda “funziona?”. Vorremo sapere per chi funziona, quale requisito soddisfa, quale costo sposta su un'altra parte dell'azienda e chi dovrà operarla. Chiederemo quale rischio stiamo accettando e che cosa succederà se il contesto cambia.

È da qui che comincia la Software Architecture.