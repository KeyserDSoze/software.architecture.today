# Capitolo 26 — Production Readiness

Per venticinque capitoli abbiamo costruito Order Operations distinguendo sistematicamente ciò che era soltanto deciso da ciò che era codificato, verificato o osservato nel runtime.

```text
Designed
→ Codified
→ Verified
→ Monitored
```

La Production Readiness Review è il momento in cui questa distinzione diventa impossibile da ignorare.

La domanda non è “abbiamo finito lo sviluppo?” e nemmeno “la demo funziona?”. È più impegnativa:

> **Se affidiamo questo launch boundary a utenti reali, abbiamo abbastanza evidence per sostenere la promessa che stiamo facendo e sappiamo chi si assume il rischio quando l’evidence non è completa?**

## Production-ready non è una proprietà del repository

Un repository può compilare e avere ottima coverage senza essere operabile. Può mancare restore evidence, rollback praticabile, ownership, alert azionabili, capacity evidence, support access o una persona capace di capire da dove iniziare durante un incidente.

Queste proprietà spesso restano invisibili durante lo sviluppo perché il sistema viene ancora osservato in condizioni controllate. Production Readiness serve a portare prima del go-live le domande che altrimenti emergerebbero dopo il primo failure serio.

AWS descrive l’operational readiness come una valutazione che riguarda workload, processi, procedure e persone necessarie a supportarlo; la relativa guidance include runbook, playbook, support plan e review coerenti. Google SRE, nella propria storica Launch Coordination Checklist, include architecture, capacity, failure, monitoring e operational procedures fra le domande pre-lancio.

Fonti:

- [AWS Well-Architected — How do you know that you are ready to support a workload?](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops-07.html)
- [AWS — Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html)
- [Google SRE — Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)

Il punto non è adottare la checklist di qualcun altro. È riconoscere che il launch riguarda **il sistema e l’organizzazione che dovrà sostenerlo**, non soltanto il codice.

## Readiness non significa perfezione

Nessun sistema serio entra in produzione con zero bug, zero unknown e zero technical debt. Se questa fosse la soglia, nessun launch sarebbe possibile.

La review deve invece rendere leggibili quattro stati diversi:

```text
BLOCKER
→ senza closure non sosteniamo il launch boundary

ACCEPTED RISK
→ rischio compreso, bounded, owned e accettato dall’autorità corretta

FOLLOW-UP
→ miglioramento non necessario alla promessa corrente

UNKNOWN
→ non abbiamo ancora abbastanza evidence per classificare il rischio
```

Il più pericoloso è spesso `UNKNOWN` travestito da “dovrebbe andare”.

Una readiness review matura non elimina l’incertezza. Le impedisce di cambiare nome per comodità.

## La checklist non può accettare il rischio

Una riga può dire che il restore drill manca. Non può decidere se il business sia disposto a lanciare comunque.

Engineering può descrivere il gap e la mitigation. Security può giudicare un residual security risk. Product può accettare una limitazione funzionale o di availability. Payments & Risk mantiene authority sui rischi economici del proprio dominio. Operations deve poter dichiarare se il workload è realmente supportabile.

La review quindi non è una votazione e non è un automatismo.

> **L’architettura rende leggibile chi sta accettando quale compromesso, non elimina il bisogno di accettarlo.**

## Il launch boundary viene prima del giudizio

“Order Operations è pronto?” è una domanda troppo grande.

Il core read journey, Payment Escalation, Priority cutover e Case Explanation Assistant non hanno necessariamente la stessa readiness.

Un launch può includere un bounded internal cohort e tenere disabilitate capability che richiedono evidence diversa. Questo evita sia che una feature opzionale blocchi inutilmente il core, sia che la readiness del core venga estesa per contagio a una capability non verificata.

Per ESI distingueremo quindi launch boundary separati e prenderemo decisioni rispetto a ciascuno.

## La PRR raccoglie decisioni preparate molto prima

AWS raccomanda che le Operational Readiness Review entrino nel ciclo di sviluppo e incorporino lesson learned dagli incidenti invece di nascere cinque minuti prima del launch.

Fonte:

- [AWS — ORR gaining adoption](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/gaining-adoption.html)

È esattamente ciò che abbiamo fatto nel libro. Functional Analysis ci dice che cosa promettiamo. Threat Model e Reliability Contract descrivono failure e recovery. Observability e Testing Strategy descrivono come ottenere evidence. Cost Model rende visibile la sostenibilità. AI Feature Contract limita l’authority del modello. One-Man Project Operating Model descrive chi governa execution e continuity.

La PRR non reinventa queste risposte. Le **riunisce e verifica se la loro maturity è sufficiente per il launch boundary proposto**.

## Lo stato ESI all’ingresso del capitolo

Il repository mostra ancora gap espliciti: PostgreSQL transaction evidence, Azure deployment/network/RBAC evidence, restore/failover drill, runtime observability, capacity, continuity e real model evaluation.

Alcuni gap riguardano il core. Altri bloccano soltanto Payment Escalation o AI.

Quindi il capitolo non parte dalla premessa “siamo quasi pronti”. Parte da una domanda aperta e lascia che sia l’evidence a rispondere.

Questo rende possibile anche una conclusione apparentemente scomoda:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Un `NO-GO` può essere un ottimo risultato se impedisce di trasformare `Designed` o `Codified` in una promessa di produzione che non sappiamo ancora difendere.

> **Readiness non è ottenere un sì. È rendere costoso dire sì senza sapere perché.**
