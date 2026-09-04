# Capitolo 27 — Casi end-to-end

Finora abbiamo scomposto il mestiere.

Abbiamo parlato di problema, analisi funzionale, confini, requisiti non funzionali, API, dati, sistemi distribuiti, cloud, security, reliability, observability, testing, legacy, refactoring, costi, repository AI-ready, issue, agenti, AI runtime e production readiness.

Era necessario.

Ma il lavoro reale non arriva diviso per capitoli.

Un requisito funzionale può cambiare il data model. Una scelta di availability può cambiare il costo. Una decisione di security può cambiare il networking. Una migration può cambiare il rollback. Un nuovo modello AI può cambiare latency, privacy, observability e supporto operativo senza modificare una singola business rule.

Per questo questo capitolo non introduce quasi nessuna nuova tecnica.

Fa qualcosa di più utile: **rimette insieme le decisioni**.

> **La Software Architecture non è la somma delle sue discipline. È la capacità di mantenere coerenti decisioni che si condizionano a vicenda.**

## Tre sistemi, tre architetture diverse

Useremo tre percorsi ESI.

### Caso 1 — Campaign Launchpad

Business unit:

```text
Marketing Technology
```

Un prodotto piccolo per pubblicare landing page di campagne attraverso template approvati.

Serve per mostrare che un One-Man Project con forte leverage di piattaforma può avere senso quando:

```text
scope bounded
low semantic complexity
managed services available
small blast radius
clear product owner
simple recovery
```

Non useremo Order Operations come martello universale.

La soluzione deve essere più semplice perché il problema è più semplice.

### Caso 2 — Operations Desk Classic → Order Operations

Business unit:

```text
Commerce & Operations
```

È il brownfield che abbiamo seguito nei Capitoli 17–19.

Qui il problema non è costruire velocemente.

È capire quale comportamento storico deve sopravvivere, quale deve morire e come migrare senza confondere compatibility con correctness.

### Caso 3 — Case Explanation Assistant

Prodotto:

```text
Order Operations
```

È il primo runtime AI di ESI.

Qui la difficoltà non è soltanto generare una risposta utile.

È governare:

```text
model authority
context
source provenance
prompt injection
provider boundary
evaluation
latency
cost
fallback
operator trust
```

## Lo stesso metodo non produce la stessa architettura

Questa è una delle lezioni più importanti del libro.

Se applichiamo bene un metodo architetturale a tre problemi diversi, **dovremmo aspettarci tre architetture diverse**.

Se invece otteniamo sempre:

```text
microservices
Kubernetes
event bus
Redis
vector database
AI gateway
```

probabilmente non abbiamo un metodo.

Abbiamo una preferenza tecnologica.

I tre casi seguiranno lo stesso percorso concettuale:

```text
Problem
→ Outcome
→ Functional Analysis
→ Context / Ownership
→ Quality Attributes
→ Trade-off
→ Architecture Decision
→ Implementation Boundary
→ Failure Model
→ Verification
→ Production Decision
```

Ma ogni passaggio potrà produrre una risposta differente.

## End-to-end non significa raccontare tutto

Un case study può diventare facilmente una storia retrospettiva troppo ordinata.

Dopo che una soluzione funziona, è facile raccontarla come se ogni decisione fosse stata inevitabile.

Nel mondo reale non funziona così.

Esistono:

```text
unknown
wrong assumption
intermediate solution
reversible experiment
abandoned option
migration cost
organizational constraint
```

Quindi nei casi ESI manterremo visibili anche:

- decisioni rimandate;
- capacità disabilitate;
- evidence mancanti;
- alternative rifiutate;
- trigger di revisione;
- cose che non sappiamo ancora.

> **Un caso end-to-end utile non mostra soltanto perché abbiamo scelto. Mostra anche perché non eravamo ancora autorizzati a scegliere altro.**

## ESI resta finzione. Le proprietà tecniche no.

I tre casi ESI sono simulati.

Non li useremo come proof.

Li confronteremo con documentazione e casi reali già incontrati nel libro.

Microsoft Well-Architected, per esempio, tratta deployment, testing, monitoring e operation come capacità che devono evolvere insieme al workload, e raccomanda safe deployment practices, ambienti appropriati e progressive exposure in base al rischio:

- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/principles
- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing

GitHub ci offre invece un caso brownfield reale particolarmente adatto: l'upgrade del proprio monolite da Rails 3.2 a 5.2 fu eseguito incrementalmente con dual boot, CI parallela e rollout progressivo, senza bloccare feature development:

- https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/

Uber ci offre un caso AI reale: Genie, il proprio copilot interno, e la successiva evoluzione Agentic-RAG guidata da un golden set curato da subject matter expert prima di ampliare il rollout:

- https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/
- https://www.uber.com/us/en/blog/enhanced-agentic-rag/

Le fonti non dicono che ESI debba usare le stesse tecnologie.

Ci aiutano a verificare che le forze che stiamo discutendo esistano anche fuori dal nostro scenario.

## La domanda del capitolo

Alla fine non voglio che il lettore sappia ripetere tre architetture.

Voglio che riesca a vedere il percorso che le ha prodotte.

Perché la domanda professionale più utile non è:

> Qual è l'architettura giusta?

È:

> **Quale sequenza di decisioni rende questa architettura appropriata a questo problema, oggi?**
