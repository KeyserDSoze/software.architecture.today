# 28.6 — L'architect come governor di agenti

Se una parte crescente dell'execution viene prodotta da agenti, l'architect non deve diventare il "prompt writer senior". Deve contribuire a progettare il sistema dentro cui gli agenti possono lavorare velocemente senza diventare una nuova sorgente di cambiamento incontrollato.

Il problema è quindi architetturale prima ancora che operativo: context, scope, permission, verification, stop condition, handoff e human gate devono essere leggibili quanto i boundary del software.

> **Il lavoro dell'architect non è ottenere la risposta migliore dall'agente. È costruire un ambiente in cui una risposta sbagliata abbia blast radius limitato e venga scoperta abbastanza presto.**

## Context engineering come repository design

Un agente che entra in un repository deve poter capire che prodotto sta modificando, quali file sono canonical, quali decisioni sono già state prese, quali boundary non deve violare, come si verifica il lavoro e quando deve fermarsi.

Nel capstone queste informazioni non vivono in un prompt gigantesco. Sono distribuite in `AGENTS.md`, Repository Map, Functional Analysis, ADR, fitness function, Testing Strategy e work item.

Questo rende il contesto persistente e riusabile. Ma lo rende anche una dependency: se i documenti sono stale, l'AI amplifica la staleness.

Il criterio non è quindi "più documentazione". È **contesto abbastanza piccolo da essere usabile, abbastanza canonical da essere affidabile e abbastanza discoverable da poter essere aggiornato**.

## Discovery non deve assorbire scope automaticamente

Un executor capace trova quasi sempre lavoro adiacente: refactoring, test mancanti, inconsistenze, dipendenze vecchie, TODO. Questa discovery è preziosa finché non viene confusa con authorization.

Un task deve rendere espliciti in-scope, out-of-scope, follow-up e stop condition. Altrimenti una modifica bounded può trasformarsi in un cleanup trasversale che nessuno ha chiesto e che aumenta blast radius e verification cost.

> **Discovery può essere autonoma. Assorbire nuovo scope non dovrebbe esserlo per default.**

## Capability, permission e autonomy sono tre cose diverse

Un agente può essere tecnicamente capace di eseguire shell, scrivere file, chiamare API, creare risorse cloud o modificare database. Questa capability non implica permission, e la permission non implica autonomia completa.

L'architect deve lavorare con Security e Platform per rendere chiari workspace isolation, network access, secret boundary, credential lifetime, production access, approval gate e artifact provenance.

OpenAI ha descritto nel 2026 pratiche interne per l'uso sicuro di coding agent, incluse configuration gestita, execution vincolata, network policy, approval umana per azioni più rischiose e telemetry specifica per agenti.

Fonte:

- [OpenAI — Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)

La lezione non è copiare una configurazione. È riconoscere che **agent autonomy è anche permission architecture e observability**.

## Un secondo agente non è automaticamente un verifier

`Agent A implementa` e `Agent B reviewa` non producono da soli independent verification. Se entrambi condividono lo stesso contesto errato, lo stesso oracle debole o la stessa misconception, possono confermarsi a vicenda.

Serve evidence diversity: deterministic test, integration su dependency reale, architecture fitness, security negative test, runtime signal e review umana o specialistica quando la decisione lo richiede.

Il reviewer non deve rifare tutto il lavoro. Deve poter ispezionare claim, evidence e limitation senza dipendere dal racconto dell'executor.

Questo è il valore del modello `Agent Verification Bundle` costruito nei capitoli precedenti.

> **Verification without re-execution richiede evidence che sopravviva a chi l'ha prodotta.**

## I guardrail migliori possono fallire automaticamente

Una policy architetturale spiegata in documentazione è utile. Quando la policy è meccanicamente verificabile, una fitness function è ancora più efficace.

Nel capstone possiamo far fallire import vietati, provider coupling nel semantic core, assenza di metadata richiesti o altri boundary già compresi. Il sistema risponde con evidence invece di affidarsi alla memoria del reviewer.

Questo non elimina l'architect. Sposta il suo lavoro: dalle review ripetitive alla progettazione del guardrail e alla decisione su quando quel guardrail deve cambiare.

> **Le fitness function sono architecture guidance che sa rispondere.**

## Il governor non deve diventare l'orchestrator universale

Un nuovo anti-pattern sarebbe creare una persona che scrive tutti i task, assegna tutti gli agenti, reviewa tutto e accetta tutto. È lo stesso collo di bottiglia di una Architecture centralizzata, soltanto con più execution a valle.

L'obiettivo è costruire un operating model in cui repository context, issue readiness, local ownership e automated evidence permettano ai task bounded di procedere senza supervisione continua.

L'architect entra quando cambia architecture policy, business meaning, risk acceptance, one-way door o cross-team boundary.

## Quale sistema stiamo amplificando?

DORA descrive l'AI come amplificatore delle strength e weakness del sistema organizzativo.

Fonte:

- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)

Un repository confuso produce confusione più velocemente. Ownership debole produce semantic drift più rapidamente. Un review system lento può trasformare l'aumento di throughput in verification backlog. Boundary leggibili e test forti, invece, rendono più sicura la delega.

OpenAI descrive inoltre Codex usato internamente per code understanding, refactoring, feature development e incident investigation, mostrando come gli agenti possano amplificare fasi diverse del ciclo di engineering.

Fonte:

- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

La domanda architetturale resta indipendente dal vendor:

> **Quale sistema di engineering stiamo amplificando?**

## ESI: Agentic Engineering Governance

La Capability Map ESI richiede che chi esercita responsabilità architetturale sappia definire context persistente, riconoscere task delegabili, separare scope da discovery, progettare permission boundary, scegliere evidence adeguata, distinguere executor da authority e costruire stop condition.

Non serve conoscere ogni agent framework. Serve riconoscere la struttura del rischio anche quando cambiano tool e modelli.

> **Il futuro dell'architect non è scrivere prompt migliori. È progettare sistemi in cui persone e agenti possono prendere velocità senza perdere responsabilità.**
