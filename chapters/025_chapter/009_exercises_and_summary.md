# Esercizi e sintesi

## Idee chiave

1. **One-Man Project non significa hero developer.** È un operating model in cui una singola persona governa più execution grazie ad agenti, automazione e piattaforme.
2. **Execution concentration e knowledge concentration sono problemi differenti.** Possiamo concentrare molta execution senza rendere una persona l'unica memoria del sistema.
3. **Il collo di bottiglia si sposta.** Quando gli agenti aumentano il data plane dell'execution, attention, judgment, decision throughput e verification bandwidth diventano risorse più scarse.
4. **Più agenti non significano più leverage.** Se review e decision backlog crescono, altri agenti aumentano soltanto WIP cognitivo.
5. **Giocare fuori ruolo non significa fingere competenza.** L'AI riduce il costo di esplorare aree diverse; non trasferisce automaticamente authority o responsabilità specialistica.
6. **Functional literacy diventa ancora più importante.** Chi governa agenti deve capire bene il comportamento del prodotto, non soltanto l'implementazione.
7. **Platform Engineering rende possibile molta autonomia locale.** Un progetto apparentemente gestito da una persona poggia spesso su identity, cloud, CI/CD, security e observability costruiti da molti altri.
8. **La continuity deve essere progettata.** Secondary maintainer, repository context e continuity drill impediscono che il leverage individuale diventi single point of failure umano.
9. **Il One-Man Project deve avere exit trigger.** Restare one-man quando il prodotto ha superato quel modello non è disciplina: è inerzia.
10. **La metrica giusta non è quanta execution produciamo.** È quanto outcome verificato riusciamo a governare mantenendo qualità, comprensione, continuità e costo sostenibile.

---

# Esercizio 1 — Hero developer o leverage?

Considera questo scenario:

```text
un senior engineer
+ 6 coding agent
+ 20 PR a settimana
+ nessun secondary maintainer
+ decisioni architetturali in chat private
+ incidenti sempre gestiti dallo stesso engineer
```

Rispondi:

1. quali parti sono leverage reale?
2. quali parti aumentano il bus/continuity risk?
3. quali informazioni devono diventare repository context?
4. quale activity metric potrebbe ingannare il management?
5. che cosa cambieresti prima di aumentare ancora il numero di agenti?

---

# Esercizio 2 — Attention budget

Hai cinque task pronti:

```text
A. rename di un type locale
B. nuovo index PostgreSQL
C. cambio retry policy
D. nuova pagina read-only
E. nuovo endpoint refund
```

Classificali come:

```text
T0 Mechanical
T1 Local behavioral
T2 Cross-boundary
T3 Decision-changing
```

Poi scegli quali eseguiresti in parallelo con un solo accountable lead.

Spiega il ragionamento in termini di:

- decision surface;
- verification;
- specialist gate;
- blast radius;
- review capacity.

---

# Esercizio 3 — Giocare fuori ruolo

Scegli una capability fuori dalla tua specializzazione principale:

```text
security
cloud
frontend
data
observability
product analysis
```

Usa un agente per costruire una prima proposta.

Poi, senza accettarla subito, rispondi:

1. quali failure mode sei in grado di riconoscere personalmente?
2. quale source of truth devi consultare?
3. quale decisione non ti senti autorizzato a prendere da solo?
4. quale specialist trigger definiresti?
5. quale parte del lavoro puoi comunque portare avanti prima della review specialistica?

Scopo:

> distinguere role elasticity da competence illusion.

---

# Esercizio 4 — Continuity Test

Prendi un repository che conosci bene.

Immagina:

```text
sei offline per due settimane
```

Un collega competente riceve soltanto:

- repository;
- ticket system;
- strumenti enterprise autorizzati.

Può capire:

- product purpose?
- current architecture?
- build/test command?
- owner dei dati?
- deployment/recovery route?
- task aperti?
- decisioni ancora pending?
- escalation path?

Ogni risposta che richiede:

> “deve chiedere a me”

va registrata come **knowledge/continuity debt candidate**.

---

# Esercizio 5 — One-Man Project Fit Review

Valuta tre sistemi:

### Sistema A

Tool interno read-only usato da 50 engineer.

### Sistema B

Servizio payment che autorizza movimenti economici e gestisce più paesi.

### Sistema C

Pipeline di migrazione temporanea con target architecture e verification già definiti.

Per ciascuno valuta:

```text
business criticality
decision density
one-way-door density
external consumer
platform support
specialist gate
operational burden
continuity
```

Non rispondere soltanto `sì/no`.

Spiega quale operating model avrebbe fit e quali condizioni potrebbero modificarlo.

---

# Esercizio 6 — WIP agentico

Supponi che un lead possa lanciare 10 agent task contemporaneamente.

Nell'ultima settimana osservi:

```text
10 task launched
9 completed
4 accepted without changes
3 required one repair
2 required major rework
review backlog = 7
2 semantic questions unresolved for 4 days
```

Domande:

1. la capacità di execution è il collo di bottiglia?
2. aumenteresti il numero di agenti?
3. quale WIP limit proveresti?
4. quale metrica vuoi osservare nella settimana successiva?
5. quale task class probabilmente richiede migliore preparation?

---

# Esercizio 7 — Specialist gate

Progetta una tabella per il tuo progetto:

| Trigger | Lead può procedere? | Specialist | Evidence richiesta |
|---|---:|---|---|
| nuova business rule | | | |
| nuova tabella | | | |
| public ingress | | | |
| nuovo payment side effect | | | |
| nuovo model provider | | | |
| dependency patch | | | |

L'obiettivo non è aumentare i gate.

È capire quali decisioni **non devono dipendere dalla capacità dell'agente di produrre una risposta convincente**.

---

# Esercizio 8 — Activity vs outcome

Un manager propone di misurare il pilot One-Man Project con:

```text
agent task / week
PR / week
lines changed
```

Costruisci una scorecard alternativa che includa almeno:

```text
verified outcome
lead time
rework
review backlog
quality signal
agent cost
human review effort
continuity
business outcome
```

Spiega quali metriche useresti come:

```text
outcome
leading indicator
diagnostic signal
guardrail
```

---

# Esercizio 9 — ESI Case Explanation Assistant

Partendo dal pilot descritto nel capitolo, immagina che Product chieda:

> “Facciamo anche eseguire automaticamente il refund all'assistant. Così il One-Man Project diventa ancora più efficiente.”

Descrivi:

1. quale boundary cambia;
2. quale task class cambia;
3. quali artifact devono essere riaperti;
4. quali specialist gate scattano;
5. perché non basta aumentare l'autonomia dell'agente;
6. se il One-Man Project mantiene ancora lo stesso fit.

---

# Esercizio 10 — Exit trigger

Scrivi cinque segnali che ti farebbero passare da:

```text
one accountable lead
```

ad almeno:

```text
stable multi-maintainer team
```

Per ogni segnale specifica:

```text
signal
evidence
risk
organizational response
```

Esempio:

```text
Signal
24/7 incident volume exceeds sustainable lead coverage

Evidence
pager/on-call data

Risk
human SPOF + delayed recovery

Response
create shared on-call/maintainer rotation
```

---

# Autovalutazione

Alla fine del capitolo dovresti saper rispondere:

1. Che cosa intendiamo davvero per One-Man Project?
2. Perché non è sinonimo di hero developer?
3. Qual è la differenza fra execution throughput e decision throughput?
4. Perché troppi agenti possono ridurre il leverage?
5. Che cos'è un attention budget?
6. Che cosa significa giocare fuori ruolo senza fingere competenza?
7. Perché functional literacy diventa più importante con gli agenti?
8. Quando serve uno specialist gate?
9. Perché una piattaforma enterprise è parte invisibile del leverage individuale?
10. Che cosa deve dimostrare un Continuity Test?
11. Perché un secondary maintainer non annulla il concetto di One-Man Project?
12. Quali project shape hanno fit migliore?
13. Perché one-way-door density conta?
14. Quali metriche non useresti da sole per misurare successo?
15. Quali exit trigger possono invalidare il modello?

---

# Artefatto operativo

Il capitolo introduce:

> **One-Man Project Operating Model**

Struttura minima:

```text
Mission
Accountable lead
Explicit non-authorities
Secondary maintainer
Agent portfolio
WIP policy
Decision rights
Verification model
Specialist triggers
Continuity plan
Operating cadence
Metrics
Exit criteria
```

---

# Cosa cambia con l'AI

Senza agenti, la quantità di execution producibile da una singola persona imponeva un limite relativamente evidente.

Con gli agenti, quel limite può spostarsi rapidamente.

Questo rende possibile:

```text
broader individual scope
more parallel execution
faster exploration
more automation
```

ma rende anche più facili:

```text
knowledge concentration
review collapse
attention fragmentation
synthetic seniority
self-certification
organizational fragility
```

Il professionista deve quindi imparare non soltanto a fare più cose.

Deve imparare a **governare il proprio leverage**.

---

# Corollario

> **La vera promessa del One-Man Project non è che una persona possa fare tutto. È che una persona possa governare molto più lavoro senza dover produrre tutto personalmente.**

Ma perché il modello sia sostenibile, dobbiamo poter aggiungere subito:

> **e il progetto deve continuare a sapere che cosa fare anche quando quella persona non è disponibile.**

Con questo si chiude la Parte VI — AI-native software engineering.

Abbiamo costruito:

```text
AI-ready repository
→ issue-driven execution
→ agent governance
→ AI runtime boundary
→ individual leverage operating model
```

Il passo successivo è diverso.

Non basta più sapere costruire e governare il sistema.

Dobbiamo decidere se il sistema è **pronto per essere affidato al mondo reale**.

È il **Capitolo 26 — Production Readiness**.
