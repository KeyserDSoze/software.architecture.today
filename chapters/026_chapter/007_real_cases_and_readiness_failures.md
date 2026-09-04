# Casi reali e failure mode della readiness

Una Production Readiness Review impara dal mondo reale non copiando checklist altrui, ma osservando **quali domande sono diventate evidenti dopo che qualcuno ha pagato il costo di non averle fatte abbastanza presto**.

## Le review migliori diventano memoria degli incidenti

AWS descrive le Operational Readiness Review come un meccanismo per valutare workload, procedure, processi e persone e raccomanda che le review evolvano incorporando lesson learned.

Fonti:

- [AWS Well-Architected — Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html)
- [AWS — OPS07-BP02 Ensure a consistent review of operational readiness](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_ready_to_support_const_orr.html)

La conseguenza è importante: una PRR non dovrebbe essere un documento congelato. Un incidente significativo dovrebbe lasciare dietro di sé una nuova readiness question, una fitness function, un runbook o un gate migliore.

```text
incident
→ learning
→ stronger readiness mechanism
→ next launch/change
```

Se il sistema paga due volte lo stesso failure evitabile, la review non sta imparando abbastanza.

## Un gate è utile soltanto se produce abbastanza evidence

La storica Launch Coordination Checklist di Google SRE include architecture, capacity, failover, dependency failure, monitoring e operational procedure. Google ha poi pubblicato production launch planning proporzionato al tipo e alla scala del launch.

Fonti:

- [Google SRE — Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)
- [Google SRE — Creating a Production Launch Plan](https://sre.google/resources/practices-and-processes/production-launch-planning/)

Il principio resta attuale: prima del launch dobbiamo leggere il sistema dal punto di vista di traffico, failure e operazione, non soltanto della feature.

GitHub offre un esempio concreto sul progressive rollout. Il canary al 2% non intercettava alcune regressioni prima del rollout completo; una seconda fase al 20% aumentò la capacità di osservare problemi mantenendo ancora un’esposizione controllata.

Fonte:

- [GitHub — Improving how we deploy GitHub](https://github.blog/enterprise-software/devops/improving-how-we-deploy-github/)

La lezione non sono le percentuali. È che un gate può essere formalmente presente e **operativamente cieco**.

> **Un readiness gate deve generare abbastanza signal da meritare la decisione che prende.**

## Recovery deve essere praticabile, non soltanto descritto

GitHub ha documentato l’uso di feature flag per disabilitare rapidamente behavior rischiosi senza rollback completo del deployment.

Fonte:

- [GitHub — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

Ma un flag non recupera ogni side effect. Destructive schema change, data corruption o business action già avvenuta richiedono meccanismi differenti.

La stessa concretezza vale per il recovery tooling. GitHub ha discusso il rischio di dipendere dallo stesso GitHub.com durante deployment/recovery e ha descritto mirror e rollback asset fra le mitigazioni.

Fonte:

- [GitHub — How GitHub uses eBPF to improve deployment safety](https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/)

La domanda generale è:

> **Il percorso di recovery funziona ancora quando il sistema che normalmente lo supporta è degradato?**

Un runbook raggiungibile soltanto tramite una dependency indisponibile o un artifact recuperabile soltanto dalla piattaforma che stiamo cercando di ripristinare sono circular dependency operative da conoscere.

## La readiness deve poter fermare il momentum

Nel GitHub Availability Report di giugno 2026 GitHub ha raccontato di aver fermato per circa un mese l’aumento di traffico verso una nuova environment dopo un incidente e di aver poi ripreso con una per-turnup stability gate.

Fonte:

- [GitHub Availability Report — June 2026](https://github.blog/news-insights/company-news/github-availability-report-june-2026/)

Il comportamento organizzativo è più interessante della tecnologia:

```text
new evidence says not ready
→ stop expansion
→ improve gate
→ resume gradually
```

È l’opposto del sunk-cost reasoning. Essere arrivati vicini al 100% non crea un diritto a proseguire.

Un altro report GitHub del marzo 2026 descrive un deployment che causò una cache expiration massiva, load e replication delay; la mitigazione incluse rollback e successivi kill switch e monitoring migliori.

Fonte:

- [GitHub Availability Report — March 2026](https://github.blog/news-insights/company-news/github-availability-report-march-2026/)

L’incidente lascia dietro di sé domande riutilizzabili: esiste un kill switch? Il dangerous load viene rilevato prima del broad user impact? Il failure è isolato dai workload non coinvolti?

## Failure pattern — Checklist theatre

Una review con 118 item verdi su 120 non è “98,3% ready”. Uno dei due item gialli potrebbe essere `restore never tested`, mentre decine di green descrivono artifact di peso molto minore.

La severità non è additiva.

> **Una PRR non è un esame a punti.**

## Failure pattern — Evidence laundering

Alcune equivalenze sbagliate ricorrono continuamente:

```text
unit test green
→ transaction verified

IaC exists
→ network verified

manual AI demo
→ model evaluated

backup configured
→ recovery verified
```

La review prende evidence reale ma la usa per sostenere un claim più forte di quello che può dimostrare.

È la stessa famiglia di errore di documentation laundering e green-by-editing-the-oracle.

## Failure pattern — Launch-date gravity

Avvicinandosi alla data, blocker e unknown tendono a cambiare nome: `known issue`, `phase 2`, `accepted risk`.

La domanda di controllo è sempre:

> **Quale nuova information ci ha fatto riclassificare il rischio?**

Se la risposta è “la data è domani”, non abbiamo nuova evidence. Abbiamo pressione.

Engineering inoltre non può accettare unilateralmente un rischio che appartiene a Security, Payments, Legal o al business owner. Un ownerless acceptance non è risk management.

## Failure pattern — Architecture prestige

Kubernetes, multi-region, service mesh, Zero Trust, RAG o event streaming non sono readiness evidence.

Un sistema semplice con restore provato, owner chiaro, alert efficaci e rollback praticabile può essere molto più production-ready di una topology sofisticata mai esercitata.

> **Production maturity misura la capacità dimostrata di sostenere una promessa, non il prestigio delle tecnologie usate per costruirla.**

## Dopo il launch la review continua

Anche il `GO` può diventare stale. Traffic, owner, provider, security boundary, SLO, model e business criticality cambiano.

Per questo la PRR deve avere review trigger. Il go-live non chiude la production evidence; la apre.

La domanda con cui leggere ogni caso reale resta quindi:

> **Quale domanda di readiness è diventata ovvia soltanto dopo il failure, e come possiamo renderla verificabile prima nel nostro sistema?**
