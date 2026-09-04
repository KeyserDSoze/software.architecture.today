# Casi reali e failure mode della readiness

Una Production Readiness Review ha valore soltanto se impara anche dal mondo reale.

Non per copiare checklist altrui.

Ma per vedere **quali domande qualcuno ha imparato a fare dopo aver pagato il costo di non averle fatte abbastanza presto**.

---

## Caso 1 — AWS Operational Readiness Review

AWS descrive le Operational Readiness Review come un meccanismo per valutare se workload, processi, procedure e persone siano pronti a operare in sicurezza.

La parte interessante non è il nome `ORR`.

È il principio di fondo:

```text
incident learning
→ review question
→ operational mechanism
→ future workload/change
```

AWS sottolinea inoltre che le ORR non dovrebbero vivere soltanto come pre-launch checklist, ma entrare nel ciclo di sviluppo ed evolvere con le lesson learned.

Fonti:

- [AWS Well-Architected — Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html)
- [AWS — OPS07-BP02 Ensure a consistent review of operational readiness](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_ready_to_support_const_orr.html)

### Lezione per ESI

La nostra Production Readiness Review non deve essere una checklist scritta una volta e congelata.

Quando Order Operations avrà un incidente reale, dovremo chiedere:

> quale domanda o fitness function avrebbe potuto rendere questo failure più piccolo o più evidente prima?

---

# Caso 2 — Google Launch Coordination Checklist

La checklist storica di Google SRE includeva già categorie come:

- architecture;
- machine/datacenter;
- volume e capacity;
- performance;
- failover;
- dependency failure;
- monitoring;
- operational procedures.

- [Google SRE — Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)

Il dettaglio tecnologico è datato in alcuni punti, come è normale per una checklist del 2005.

Ma il modello mentale è ancora utile:

> **prima di un launch, il sistema deve essere letto dal punto di vista del traffico, del fallimento e dell'operazione, non soltanto della feature.**

Google ha successivamente pubblicato anche guidance sul production launch planning sottolineando che la profondità del processo deve essere proporzionata al tipo e alla scala del launch.

- [Google SRE — Creating a Production Launch Plan](https://sre.google/resources/practices-and-processes/production-launch-planning/)

### Lezione per ESI

Il nostro pilot interno non deve copiare il processo di un launch globale.

Ma non può saltare tenant isolation, data integrity o ownership solo perché il cohort è piccolo.

---

# Caso 3 — GitHub: canary insufficiente

GitHub ha documentato un'evoluzione del proprio deployment system in cui il canary esistente al 2% non intercettava alcune classi di problema prima del rollout completo.

Il team introdusse una seconda fase al 20% per aumentare la capacità di osservare regressioni prima del 100%, mantenendo comunque progressività.

- [GitHub — Improving how we deploy GitHub](https://github.blog/enterprise-software/devops/improving-how-we-deploy-github/)

### Lezione

Una fase di rollout non è utile perché si chiama `canary`.

È utile se produce abbastanza evidence per decidere se avanzare.

> **Un gate troppo piccolo può essere formalmente presente e operativamente cieco.**

---

# Caso 4 — GitHub: feature flag e rollback comportamentale

GitHub ha documentato l'uso delle feature flag per isolare il rischio di cambiamenti e poterli disabilitare rapidamente senza dover necessariamente eseguire un rollback completo del deployment.

- [GitHub — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

### Lezione

`Rollback` deve essere scomposto.

A volte il rollback più efficace è:

```text
turn off new behavior
```

non:

```text
redeploy entire previous release
```

Ma questo vale soltanto se il side effect è ancora reversibile a quel livello.

Un database destructive change o un pagamento già eseguito non si spegne con una feature flag.

---

# Caso 5 — GitHub, giugno 2026: fermare il ramp

Nel GitHub Availability Report di giugno 2026, GitHub ha raccontato di aver fermato per circa un mese l'aumento di traffico verso una nuova environment dopo un incidente di stabilità e di aver poi riavviato il ramp con una **per-turnup stability gate** che richiede health verificata prima di ogni incremento.

- [GitHub Availability Report — June 2026](https://github.blog/news-insights/company-news/github-availability-report-june-2026/)

### Lezione

La cosa interessante non è la piattaforma specifica.

È il comportamento organizzativo:

```text
new evidence says not ready
→ pause expansion
→ improve gate
→ resume gradually
```

Questo è l'opposto del sunk-cost reasoning:

> siamo arrivati fin qui, quindi ormai dobbiamo continuare.

La readiness corretta può produrre una pausa.

---

# Caso 6 — GitHub, marzo 2026: rollback e nuovi guardrail

Nel report di marzo 2026 GitHub descrisse un deployment che, nel tentativo di ridurre il carico di alcune write, causò una scadenza massiva della cache, ricalcolo e aumento del load con replication delay a cascata. Il team mitigò con rollback e aggiunse successivamente kill switch e monitoraggio migliore sul meccanismo di caching.

- [GitHub Availability Report — March 2026](https://github.blog/news-insights/company-news/github-availability-report-march-2026/)

### Lezione

Un incidente può insegnare almeno tre readiness question:

```text
Do we have a kill switch?
Can we detect the dangerous load before broad user impact?
Is the failure isolated from unrelated workloads?
```

E mostra perché la ORR dovrebbe evolvere con gli incidenti reali.

---

# Caso 7 — Recovery path e circular dependency

GitHub nel 2026 ha discusso un problema operativo molto concreto: parte del deployment/recovery del servizio dipende dallo stesso GitHub.com che potrebbe essere indisponibile. Il team descrive mirror del codice e asset di rollback come parte delle mitigazioni e l'uso di eBPF per individuare dipendenze circolari nella tooling path.

- [GitHub — How GitHub uses eBPF to improve deployment safety](https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/)

### Lezione

> **Recovery infrastructure deve essere letta anche quando il sistema principale è già rotto.**

Per ESI questo significa chiedere:

```text
Can we access runbooks if primary collaboration tools fail?
Can we obtain deployment artifacts?
Can we authenticate to recovery systems?
Can we restore without relying on the failed dependency?
```

Non tutto deve avere una sofisticata soluzione offline.

Ma il dependency loop deve essere almeno conosciuto.

---

# Failure mode: checklist theatre

Sintomo:

```text
120 items
118 green
2 yellow
→ 98.3% ready
```

Problema:

uno dei due yellow potrebbe essere:

```text
restore never tested
```

mentre trenta green sono:

```text
README exists
```

La severità non è additiva.

> **Una Production Readiness Review non è un esame a punti.**

---

# Failure mode: evidence laundering

```text
unit test green
→ transaction verified

Bicep exists
→ network verified

manual AI demo
→ model evaluated

backup configured
→ recovery verified
```

È la stessa famiglia di errore vista con documentation laundering e green-by-editing-the-oracle.

La review trasforma evidence debole in claim più forte di quello che può sostenere.

---

# Failure mode: launch-date gravity

Più ci avviciniamo alla data, più ogni blocker tende a diventare improvvisamente:

```text
known issue
follow-up
accepted risk
phase 2
```

senza che sia cambiata l'evidence.

La domanda di controllo è:

> **che nuova informazione ci ha fatto riclassificare il rischio?**

Se la risposta è:

> la data è domani.

non abbiamo una nuova informazione tecnica o di business.

Abbiamo soltanto pressione.

---

# Failure mode: ownerless acceptance

```text
Engineering says risk is acceptable
```

Ma il rischio riguarda:

```text
Security policy
payment correctness
legal retention
business SLA
```

Engineering può spiegare e mitigare il rischio.

Non necessariamente può accettarlo per conto dell'azienda.

---

# Failure mode: production readiness by architecture prestige

```text
Kubernetes
multi-region
service mesh
zero trust
RAG
event streaming
```

non sono readiness evidence.

Un sistema semplice con restore provato, owner chiaro, monitoring e rollback può essere molto più production-ready di una topologia sofisticata non esercitata.

> **Production maturity descrive la capacità dimostrata di sostenere una promessa. Non il numero di tecnologie mature che abbiamo installato.**

---

# Failure mode: post-launch amnesia

Ultimo errore:

```text
PRR done
→ PDF archived
→ never revisited
```

Ma poi cambiano:

```text
traffic
owner
provider
security boundary
SLO
AI model
region topology
business criticality
```

La readiness deve avere trigger di riapertura.

Il go-live è l'inizio della production evidence.

Non la fine.

---

# La domanda che un caso reale deve lasciarci

Non:

> quale tecnologia usavano?

Ma:

> **quale domanda di readiness è diventata evidente soltanto dopo il failure, e come possiamo farla prima nel nostro sistema?**
