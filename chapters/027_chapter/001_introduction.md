# Capitolo 27 — Casi end-to-end

Finora abbiamo separato il mestiere in problemi abbastanza piccoli da poterli studiare bene: analisi funzionale, boundary, dati, cloud, security, reliability, observability, testing, legacy, costi, agenti, AI runtime e production readiness.

Il lavoro reale, però, non arriva diviso per capitoli.

Una business rule può cambiare il data model. Una scelta di availability può cambiare cost e deployment. Una security boundary può cambiare networking e operability. Una migration può cambiare rollback. Un model upgrade può modificare latency, privacy e support model senza toccare una singola business rule.

Per questo il Capitolo 27 non introduce quasi nessuna tecnica nuova. Fa qualcosa di più difficile: **rimette insieme le decisioni e rende visibile la loro causalità**.

> **La Software Architecture non è la somma delle discipline. È la capacità di mantenere coerenti decisioni che si condizionano a vicenda.**

## Tre problemi che non devono produrre la stessa architettura

Useremo tre percorsi ESI.

**Campaign Launchpad** è un piccolo prodotto di Marketing Technology per creare, approvare, pubblicare e ritirare landing page basate su template approvati. Il valore del caso sta nella semplicità: bounded scope, managed platform e un failure model relativamente contenuto. La decisione corretta potrebbe essere usare molta meno tecnologia di Order Operations.

**Operations Desk Classic → Order Operations Priority** è invece un brownfield. Qui il rischio non è costruire troppo poco, ma cambiare un comportamento storico prima di aver capito quale parte sia requisito, quale accidental behavior e quale differenza sia intenzionale.

**Case Explanation Assistant** introduce infine una dependency probabilistica nel runtime. Qui la difficoltà non è soltanto produrre una risposta utile: dobbiamo preservare authority, context provenance, security, evaluation, fallback e operator trust.

Lo stesso metodo applicato bene dovrebbe produrre tre forme diverse.

Se qualunque problema ci porta sempre a microservizi, Kubernetes, event bus, vector database e AI gateway, non abbiamo un metodo: abbiamo una preferenza tecnologica.

## Il decision trace

Leggeremo ogni caso attraverso una catena comune:

```text
Problem
→ Outcome
→ Functional meaning
→ Ownership / quality floor
→ Key trade-off
→ Architecture decision
→ Failure model
→ Verification
→ Production decision
```

Il valore non sta nel completare nove caselle. Sta nel poter spiegare **perché una decisione nasce dalla precedente e quale evidence dovrebbe cambiare per farci scegliere diversamente**.

Questa vista diventa l’**End-to-End Decision Trace**. Non sostituisce ADR, contract o PRR. È il filo causale che li collega.

## Un caso end-to-end deve conservare l’incertezza

I case study raccontati dopo il successo tendono a comprimere il percorso. Una sequenza reale fatta di experiment, rollback, assumption sbagliate e decisioni rimandate viene riscritta come se ogni passo fosse stato inevitabile.

Noi manterremo visibili anche alternative scartate, capability disabilitate, evidence ancora Pending, costi di coexistence e review trigger.

Campaign Launchpad, per esempio, ha già Problem, Functional Scope, Architecture Direction e Decision Trace persistenti, ma il suo stesso artifact dichiara:

```text
Production decision
NOT READY

Reason
implementation/runtime evidence not yet available
```

Order Operations mantiene `PRR-OO-001 = NO-GO`. Priority cutover è `NOT AUTHORIZED`. Case Explanation Assistant è `NOT READY / DISABLED`.

Questo non rende i casi incompleti. Li rende credibili.

> **Un caso end-to-end utile mostra non soltanto perché abbiamo scelto, ma anche perché non siamo ancora autorizzati a scegliere il passo successivo.**

## Le fonti reali restano evidence, non template

Microsoft Well-Architected collega testing, deployment, monitoring e operation alla capacità di far evolvere un workload in sicurezza. GitHub ha raccontato l’upgrade del proprio monolite Rails attraverso dual boot, CI parallela e rollout progressivo. Uber ha descritto Genie e la successiva evoluzione guidata da evaluation e golden set.

Fonti:

- [Microsoft Learn — Operational Excellence principles](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/principles)
- [Microsoft Learn — Testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [GitHub Engineering — Upgrading GitHub from Rails 3.2 to 5.2](https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/)
- [Uber Engineering — Genie: Uber’s Gen AI On-Call Copilot](https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/)
- [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/us/en/blog/enhanced-agentic-rag/)

Nessuna di queste fonti dimostra l’architettura fittizia di ESI. Ci offre invece conseguenze e forze osservate nel mondo reale.

La domanda professionale che vogliamo allenare non è quindi:

> Qual è l’architettura giusta?

È:

> **Quale sequenza di decisioni rende questa architettura appropriata a questo problema, oggi, e quale nuova evidence ci farebbe riaprire quella sequenza?**
