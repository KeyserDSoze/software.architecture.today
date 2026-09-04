# 24.7 — Casi reali e failure mode: quando l'AI smette di essere una demo

Le applicazioni generative mostrano spesso lo stesso pattern narrativo:

```text
demo impressionante
→ rollout
→ quality/security/cost problem
→ architecture catches up
```

I casi reali più utili non sono quelli che dimostrano che “l'AI funziona”.

Sono quelli che rendono visibili i problemi che compaiono quando l'AI deve diventare affidabile, sicura e operabile.

## Caso reale — Uber Genie

Uber ha documentato **Genie**, un copilot interno per supportare gli on-call engineer rispondendo a domande su Slack usando documentazione interna.

Il contesto è utile perché non nasce da un problema astratto.

Uber descrive un volume elevato di domande ricorrenti nei canali di supporto interni e la necessità di ridurre tempi di risposta e carico sugli on-call engineer.

Per la prima architettura, Uber ha valutato fine-tuning e RAG e ha scelto RAG anche per ridurre il time-to-market e mantenere accesso a knowledge source aggiornabili. Il sistema indicizza fonti interne e usa retrieval per costruire il contesto delle risposte.  
Fonte: [Uber Engineering — Genie: Uber’s Gen AI On-Call Copilot](https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/).

Il punto interessante non è:

> Uber usa RAG, quindi ESI deve usare RAG.

Anzi.

Uber aveva un problema di retrieval su molte fonti documentali.

ESI, nel primo Case Explanation Assistant, conosce già deterministicamente le source del singolo Operational Case.

**Stesso obiettivo generale — grounding — architetture diverse perché cambiano le forze.**

## Quando il primo RAG non basta

Uber ha poi documentato un'evoluzione di Genie per i domini engineering security e privacy.

Gli SME avevano costruito un golden set di oltre cento query e il sistema iniziale non raggiungeva la qualità necessaria per un rollout più ampio: risposte incomplete, inaccurate o retrieval insufficiente.

Uber racconta di aver introdotto evaluation automatizzata e un'architettura agentic-RAG migliorata; riporta una crescita relativa del 27% delle risposte accettabili e una riduzione relativa del 60% dei consigli errati nel proprio scenario misurato.  
Fonte: [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/au/en/blog/enhanced-agentic-rag/).

Questi numeri appartengono al caso Uber.

Non sono benchmark trasferibili a ESI.

La lezione è un'altra:

> **La qualità di una pipeline AI non si deduce dal nome del pattern. Si misura sul workload reale.**

Uber sottolinea anche il costo umano della valutazione SME e usa LLM-as-a-Judge per accelerare gli esperimenti, mantenendo una baseline costruita da esperti.

Questo rafforza il modello del Capitolo 24:

```text
human-labeled evidence
→ automated evaluator
→ faster iteration
→ periodic human calibration
```

non:

```text
model generates
→ another model says PASS
→ production
```

## Caso reale — il source/sink model di OpenAI per prompt injection

OpenAI ha pubblicato nel 2026 un approccio alla prompt injection che la tratta in parte come un problema simile alla social engineering.

La formulazione source/sink è particolarmente utile architetturalmente:

```text
source
→ content that can influence the model

sink
→ capability through which compromise can cause impact
```

L'obiettivo non è soltanto riconoscere ogni stringa malevola.

È anche limitare ciò che un modello compromesso può fare, proteggendo trasmissioni sensibili e azioni pericolose con controlli ulteriori.  
Fonte: [OpenAI — Designing AI agents to resist prompt injection](https://openai.com/index/designing-agents-to-resist-prompt-injection/).

Per ESI questa idea giustifica direttamente il primo boundary:

```text
untrusted case text
→ possible source

refund / email / external navigation
→ dangerous sinks
```

Nel primo slice i sink non vengono forniti al modello.

Questa è security by architecture, non prompt tuning.

## Caso reale — Uber Gen AI Gateway

Uber ha documentato anche una **Gen AI Gateway** che offre un access layer comune a modelli esterni e modelli ospitati internamente.

Fra le capability descritte compaiono:

- logging e auditing;
- cost guardrail e attribution;
- safety/policy guardrail;
- PII redaction;
- accesso uniforme a modelli diversi.

Uber collega inoltre la piattaforma a LLM evaluation, prompt versioning e production monitoring.  
Fonte: [Uber Engineering — From Predictive to Generative: Michelangelo](https://www.uber.com/ci/en/blog/from-predictive-to-generative-ai/).

Anche qui la lezione non è:

> costruisci subito un enterprise AI gateway.

Per Order Operations sarebbe oggi premature platforming.

La lezione è:

> **Quando il numero di workload AI cresce, policy, auditing, cost e model routing possono diventare una platform responsibility invece di essere duplicati in ogni prodotto.**

Questo sarà un possibile trigger ESI, non una decisione già presa.

## Failure mode catalog

### Hallucinated authority

Il modello trasforma un'interpretazione in un fatto autorevole.

```text
Mitigation
→ output taxonomy
→ source references
→ deterministic authority boundary
```

### Missing-evidence optimism

Il modello completa una storia nonostante manchino dati essenziali.

```text
Mitigation
→ InsufficientEvidence
→ eval missing-source cases
```

### Stale grounding

Il contesto era valido al retrieval ma non più al momento della decisione dell'operatore.

```text
Mitigation
→ observedAt/freshness
→ refresh action
→ no hidden stale claim
```

### Prompt injection

Testo non fidato viene interpretato come instruction.

```text
Mitigation
→ instruction/data separation
→ context minimization
→ least privilege
→ no dangerous sink in v1
→ adversarial eval
```

### Cross-tenant context contamination

Il context builder include dati non autorizzati.

```text
Mitigation
→ deterministic authorization before retrieval
→ negative tests
→ critical severity
```

### Tool escalation

Una feature nata read-only acquisisce nel tempo write tool senza riaprire threat model e authorization.

```text
Mitigation
→ AI Feature Contract review trigger
→ Autonomy/Threat Matrix update
```

### Eval overfitting

Prompt e pipeline vengono ottimizzati per il golden set ma peggiorano sui casi reali.

```text
Mitigation
→ holdout
→ production sampling
→ dataset diversity
→ human review
```

### Judge capture

Il model evaluator premia output che sfruttano il grader anziché soddisfare davvero l'utente.

```text
Mitigation
→ human calibration
→ multiple evidence mechanism
→ grader validity checks
```

### Model upgrade regression

Nuovo modello migliora il benchmark generale ma peggiora un boundary critico del workload.

```text
Mitigation
→ workload regression eval
→ canary/model routing
→ rollback configuration
```

### Cost runaway

Prompt, context e retry crescono senza migliorare outcome.

```text
Mitigation
→ token/context budget
→ cost per useful explanation
→ bounded retry
→ model routing trigger
```

### AI dependency cascade

Un provider outage rende indisponibile un journey che avrebbe potuto funzionare senza AI.

```text
Mitigation
→ optional assistant
→ deterministic operational view remains available
```

## Una regola importante sui casi reali

I casi Uber e OpenAI non dimostrano che una specifica tecnologia sia universalmente corretta.

Dimostrano qualcosa di più utile:

- retrieval quality deve essere misurata;
- evaluation richiede design;
- source quality conta;
- prompt injection è un problema di sistema;
- permission e sink cambiano il blast radius;
- cost, audit e model policy diventano platform concern quando la scala lo giustifica.

> **Il caso reale utile non ci presta la sua architettura. Ci presta le conseguenze che ha dovuto imparare a governare.**