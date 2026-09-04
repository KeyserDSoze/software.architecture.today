# Deployment, rollback e change safety

Un sistema può essere stabile oggi e diventare non affidabile al prossimo deployment. Production Readiness riguarda quindi non soltanto **lo stato corrente** del workload, ma la capacità di cambiarlo senza perdere il controllo.

Molti incidenti non richiedono hardware guasto o un attaccante. Basta una query più costosa, una configuration incompatibile, una migration troppo aggressiva o una feature esposta troppo rapidamente.

Microsoft Azure Well-Architected raccomanda safe deployment practice con piccoli cambiamenti, quality gate e progressive exposure; Google Cloud documenta canary deployment per limitare la quota di traffico esposta prima di avanzare una release.

Fonti:

- [Microsoft Learn — Operational Excellence design review checklist](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/checklist)
- [Google Cloud Deploy — Canary deployment](https://docs.cloud.google.com/deploy/docs/deployment-strategies/canary)

Il pattern specifico conta meno della domanda:

> **Come limiteremo il blast radius del prossimo cambiamento e quale evidence ci autorizzerà ad aumentarlo?**

## La deployment strategy deve partire dalla failure hypothesis

Blue/green, canary, rolling deployment e feature flag non sono simboli di modernità. Sono meccanismi diversi per problemi diversi.

Prima di sceglierli dobbiamo sapere che cosa può fallire, quanto rapidamente possiamo rilevarlo, quante persone o richieste possono essere esposte prima della detection, se la progressione può essere fermata e che cosa resta reversibile.

Una nuova API logic può essere protetta da flag o canary. Una additive schema migration richiede compatibility. Una irreversible data rewrite non diventa sicura soltanto perché il codice viene distribuito gradualmente.

## Rollback non è una singola capability

Dire “possiamo fare rollback” nasconde spesso il punto più importante.

Possiamo tornare indietro con l’artifact, la configuration, la feature exposure o il traffic. Possiamo invece non riuscire a riportare indietro lo schema o i dati. In quel caso servono forward repair o business compensation.

Il package può essere reversibile mentre il sistema non lo è.

Se v2 scrive un nuovo stato che v1 non sa leggere, tornare al vecchio binary non ripristina una situazione coerente. È qui che tornano expand/migrate/contract, backward compatibility e point of no return.

La PRR deve quindi chiedere **rollback di che cosa** e che cosa succede ai dati dopo il rollback.

## Progressive rollout richiede progression criteria

Un canary è utile soltanto se produce abbastanza evidence per decidere il passo successivo.

GitHub ha raccontato di aver aggiunto una seconda fase canary perché il 2% iniziale non esponeva abbastanza traffico per intercettare alcune classi di problema; la nuova fase aumentava l’evidence prima del 100%.

Fonte:

- [GitHub Engineering — Improving how we deploy GitHub](https://github.blog/enterprise-software/devops/improving-how-we-deploy-github/)

La lezione non sono le percentuali. È la relazione:

```text
current exposure
→ observed health
→ progression decision
```

I criteria possono includere SLI, error rate, latency, security signal, unexpected business mismatch e un observation window minimo. Devono includere soprattutto una stop condition.

Un rollout automatico senza criteria affidabili automatizza il blast radius.

GitHub ha anche documentato l’uso di feature flag per disabilitare rapidamente behavior rischiosi senza ritirare l’intero deployment.

Fonte:

- [GitHub — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

Anche qui il flag funziona soltanto se il side effect non ha già attraversato un boundary irreversibile.

## La stabilità del passo precedente deve meritare il passo successivo

Nel GitHub Availability Report di giugno 2026 GitHub ha raccontato di aver fermato l’aumento di traffico verso una nuova environment dopo un incidente e di aver poi introdotto una per-turnup stability gate prima di ogni incremento.

Fonte:

- [GitHub Availability Report — June 2026](https://github.blog/news-insights/company-news/github-availability-report-june-2026/)

È una formulazione molto vicina alla tesi del libro:

> **Ogni passo di rollout deve produrre abbastanza evidence da meritare il passo successivo.**

## Anche il recovery path ha dependency

Un’altra domanda di readiness riguarda gli strumenti che usiamo per recuperare.

GitHub ha descritto il rischio di dipendere da GitHub.com per distribuire GitHub.com e le mitigazioni adottate, inclusi mirror e asset per rollback.

Fonte:

- [GitHub — How GitHub uses eBPF to improve deployment safety](https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/)

La lezione generale è che recovery tooling, artifact e access path non dovrebbero dipendere completamente dal componente che stiamo cercando di recuperare.

Questo vale anche per emergency change. Una emergency path deve chiarire chi può usarla, quali gate possono essere bypassati, quali non possono esserlo, come l’eccezione viene auditata e come si torna al normal path.

Una password condivisa conosciuta da tre persone non è un deployment strategy.

## Order Operations

Per ESI la topology è già Codified in IaC direction, ma la PRR continua a richiedere evidence reale su build/lint, non-production deployment, private connectivity, RBAC negative test, application smoke, migration e rollback/fallback.

Quindi:

```text
IaC Codified
≠
Deployment Verified
```

La distinzione non è pignoleria. È la differenza fra sapere che il template esprime la nostra intenzione e sapere che il sistema reale si comporta come previsto quando lo distribuiamo e quando dobbiamo tornare indietro.

> **Un deployment sicuro non è quello che non fallisce mai. È quello in cui il failure viene rilevato presto, contenuto in un blast radius noto e seguito da un recovery path realmente praticabile.**
