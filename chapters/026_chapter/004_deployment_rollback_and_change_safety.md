# Deployment, rollback e change safety

Un sistema può essere production-ready nella propria configurazione corrente e diventare non affidabile durante il prossimo deployment.

Per questo Production Readiness non riguarda soltanto **lo stato** del workload.

Riguarda anche la capacità di **cambiarlo senza perdere il controllo**.

---

## Il deployment è un failure mode

Molti incidenti non richiedono hardware rotto o un attaccante.

Basta una modifica corretta nel repository ma sbagliata nel sistema reale:

```text
query più costosa
configuration drift
migration troppo aggressiva
cache invalidation inattesa
permission sbagliata
feature enabled troppo rapidamente
```

Microsoft Azure Well-Architected raccomanda safe deployment practice con piccoli cambiamenti, quality gate e progressive exposure.

- [Microsoft Learn — Operational Excellence design review checklist](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/checklist)

Google Cloud descrive deployment canary e analisi di rollout come strumenti per ridurre la quantità di traffico esposta prima di avanzare una release.

- [Google Cloud Deploy — Canary deployment](https://docs.cloud.google.com/deploy/docs/deployment-strategies/canary)

Il punto non è usare per forza un canary.

È sapere:

> **come limiteremo il blast radius del prossimo cambiamento importante?**

---

# Deployment strategy deve avere una failure hypothesis

Non scegliere:

```text
blue/green
canary
rolling
feature flag
```

perché sono pattern moderni.

Chiedi:

```text
What can go wrong?
How quickly can we detect it?
How many users may see it before detection?
Can we stop progression?
Can we revert behavior?
Can we revert data?
```

Esempio:

```text
new API logic
→ feature flag/canary may be enough

new schema additive
→ expand-first + compatibility tests

irreversible data rewrite
→ rollout strategy alone is not enough
```

---

# Rollback is not one thing

Nel linguaggio quotidiano diciamo:

> facciamo rollback.

Ma in produzione dobbiamo distinguere:

## Code rollback

Ripristinare un artifact precedente.

## Configuration rollback

Ripristinare una configurazione precedente.

## Feature rollback

Disabilitare comportamento nuovo senza ritirare l'intero deployment.

## Traffic rollback

Rimuovere una nuova versione dal traffico.

## Schema/data rollback

Ripristinare stato persistente precedente.

Spesso molto più difficile.

## Forward repair

Correggere il sistema in avanti quando tornare indietro non è più sicuro o possibile.

## Business compensation

Produrre un nuovo fatto business che compensa un side effect già avvenuto.

Un Production Readiness Review deve sapere **quale tipo di rollback è realmente disponibile**.

---

# Il rollback deve essere compatibile con i dati

Esempio semplice:

```text
v2 application writes column new_state
```

Poi rollback a v1.

Domanda:

> v1 sa leggere il database dopo che v2 ha scritto?

Se la risposta è no, il deployment è reversibile nel package ma non nel sistema.

Da qui tornano pattern già visti:

```text
expand
→ migrate
→ contract
```

La Production Readiness Review deve controllare anche:

- backward/forward compatibility;
- database migration state;
- event/API consumers;
- cleanup non ancora eseguito;
- point of no return.

---

# Progressive rollout deve avere progression criteria

Una strategia canary non basta.

Serve sapere quando passare:

```text
1%
→ 10%
→ 50%
→ 100%
```

Criteri possibili:

```text
SLI stable
error rate within bound
latency within bound
no security signal
no unexpected business mismatch
no critical support signal
minimum observation window elapsed
```

E soprattutto:

```text
stop condition
```

Un rollout automatico senza criteria affidabili può automatizzare il blast radius.

---

# Caso reale — GitHub e i canary

GitHub ha documentato l'evoluzione del proprio deployment system aggiungendo una seconda fase canary: il primo canary al 2% non esponeva abbastanza traffico per intercettare alcune classi di problema prima del rollout completo; una seconda fase al 20% aumentava l'evidence mantenendo comunque un'esposizione controllata prima del 100%.

- [GitHub Engineering — Improving how we deploy GitHub](https://github.blog/enterprise-software/devops/improving-how-we-deploy-github/)

La lezione non è:

> usa 2% e 20%.

Quelle percentuali appartenevano al contesto GitHub descritto.

La lezione è:

> **un rollout stage deve avere abbastanza esposizione da produrre evidence utile senza rendere il failure troppo grande.**

GitHub ha anche documentato l'uso di feature flag per poter disabilitare rapidamente cambiamenti rischiosi senza dover necessariamente eseguire un rollback completo del deployment.

- [GitHub — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

---

# Caso reale recente — una stability gate prima di aumentare traffico

Nel report di availability di giugno 2026 GitHub ha descritto di aver fermato per circa un mese l'aumento di traffico verso una nuova environment dopo un incidente di stabilità e di aver poi introdotto una **per-turnup stability gate** che richiede evidence di health prima di ogni step di incremento.

- [GitHub Availability Report — June 2026](https://github.blog/news-insights/company-news/github-availability-report-june-2026/)

Questo è un esempio molto vicino al principio del nostro libro:

```text
next rollout step
requires evidence
from previous rollout step
```

> **Ogni passo deve produrre abbastanza evidence da meritare il passo successivo.**

---

# Deployment evidence

Una readiness review dovrebbe poter rispondere almeno:

```text
What artifact are we deploying?
How is it identified?
What environment was it verified in?
Who/what can deploy it?
What is the rollout strategy?
What signal stops progression?
What is the rollback/fallback?
How long does rollback take?
What happens to data?
What happens if deployment tooling is unavailable?
```

Quest'ultima domanda è importante.

Un deployment system può avere circular dependency.

GitHub nel 2026 ha descritto esplicitamente il rischio di dipendere da GitHub.com per distribuire GitHub.com e le mitigazioni adottate, come mirror del codice e asset per rollback.

- [GitHub — How GitHub uses eBPF to improve deployment safety](https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/)

La lezione generale è:

> **il percorso di recovery non dovrebbe dipendere completamente dal componente che stiamo cercando di recuperare.**

---

# Emergency deployment

Una produzione reale avrà prima o poi bisogno di un cambiamento urgente.

Quindi la readiness deve chiedere:

```text
Who may execute an emergency change?
Which normal gates can be bypassed?
Which cannot?
How is the exception audited?
How is the system returned to the normal path afterward?
```

Emergency path non significa:

> production admin password conosciuta da tre persone.

Dovrebbe essere un meccanismo progettato, limitato, osservabile e recuperabile.

---

# Order Operations

Per ESI il deployment target resta:

```text
Azure application landing zone
App Service + background publisher
PostgreSQL
Service Bus
private network direction
```

Ma il PRR deve ancora raccogliere evidence reale su:

```text
Bicep build/lint
non-production deployment
private connectivity
RBAC negative tests
application smoke
rollback/fallback
PostgreSQL migration
```

Quindi:

```text
IaC Codified
≠
Deployment Verified
```

E finché non superiamo quei gate, non possiamo promuovere la cloud topology a production-ready soltanto perché il template sembra corretto.

---

# La regola

> **Un deployment sicuro non è quello che raramente fallisce. È quello in cui un failure viene rilevato presto, contenuto in un blast radius noto e seguito da una via di recupero praticabile.**
