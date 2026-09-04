# 20.5 — Usage, rate e FinOps operating model

Quando il costo diventa visibile, la reazione più facile è una campagna: una settimana di rightsizing, un trimestre di cost cutting, una richiesta generalizzata di spegnere ciò che sembra poco utilizzato.

Queste iniziative possono produrre risparmi reali. Il problema è che raramente costruiscono una disciplina durevole.

Azure Well-Architected distingue esplicitamente **usage optimization** e **rate optimization** e raccomanda un processo continuo di cost management, non interventi isolati.

Fonti:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)
- [Microsoft Learn — Architecture strategies for getting the best rates](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/get-best-rates)

## Usage e rate sono due leve diverse

La usage optimization riduce o modifica ciò che consumiamo. Rightsizing, autoscaling, spegnimento di environment inutilizzati, minore retention non necessaria, eliminazione di orphan resource o integrazioni meno chatty appartengono a questa famiglia.

La rate optimization prova invece a pagare meno per la stessa unità di consumo attraverso commitment, reservation, discount, licensing o pricing model migliori.

La distinzione è importante perché i due interventi hanno trade-off diversi. Una reservation può non cambiare affatto il comportamento tecnico del workload ma ridurre optionality economica: paghiamo meno in cambio di una previsione più rigida sul futuro. Un rightsizing aggressivo, invece, può cambiare headroom e failure behavior.

Quindi persino una scelta commerciale può diventare rilevante per l'architettura quando riduce la nostra libertà di cambiare.

## Waste e headroom non si distinguono guardando soltanto la CPU

Una metrica di utilization bassa è un segnale, non una sentenza.

`CPU = 40%` non implica automaticamente `60% waste`. Quella capacità potrebbe servire a burst, failover, deployment, recovery o a sostenere il latency target mentre un'istanza è fuori servizio.

Allo stesso tempo, chiamare ogni capacità inutilizzata “headroom per reliability” è un modo comodo per non misurare niente.

La capacità intenzionale deve essere collegata a uno scenario:

```text
peak
failure scope
SLO
recovery target
scaling latency
```

> **Capacity senza scenario è sovrapprovisioning indistinguibile da prudenza.**

La stessa evidence che usiamo per giustificare reliability deve quindi aiutare anche il cost review.

## Environment economics: pagare fidelity soltanto dove serve

Non tutti gli environment devono riprodurre la production topology.

Azure Well-Architected suggerisce di trattare diversamente gli ambienti SDLC e, quando possibile, usare pre-production environment on-demand.

Fonte:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)

Questo si collega direttamente alla Testing Strategy del Capitolo 16. Un environment più costoso è giustificato soltanto se dimostra una proprietà che quello più economico non può verificare.

Per ESI il principio diventa:

```text
business rule
→ local / deterministic

PostgreSQL semantics
→ real PostgreSQL

Azure identity / private networking
→ Azure non-production

recovery
→ environment capace del drill
```

Non è soltanto una strategia di testing. È una strategia economica: **usare l'environment meno costoso che può produrre l'evidence necessaria**.

## Budget come feedback, non come numero magico

Un budget è utile quando apre una conversazione fra forecast, actual e variance. È molto meno utile quando viene interpretato come “spendi esattamente questa cifra indipendentemente da ciò che cambia nel prodotto”.

Un aumento di costo può essere corretto se accompagna più volume, una nuova geography, un requisito security più forte o reliability più alta. Un calo può essere un brutto segnale se dipende da traffico perso o dalla rimozione di una capability necessaria.

Il ciclo utile è:

```text
forecast
→ budget
→ actual
→ variance
→ explanation
→ decision
```

Il budget non sostituisce la decisione. Rende visibile quando dobbiamo prenderne una.

## Anomaly e trend chiedono reazioni diverse

Un picco improvviso di telemetry del 400% in un giorno è una anomaly e richiede investigation. Storage che cresce dell'8% ogni mese può invece essere un trend perfettamente regolare ma economicamente insostenibile nel lungo periodo.

La prima domanda è “che cosa è successo?”. La seconda è “che cosa succederà se continuiamo così?”.

Questa distinzione ci impedisce di trattare ogni aumento come incidente o, al contrario, di ignorare una curva prevedibile finché non supera il budget.

## FinOps non è Engineering contro Finance

Un operating model debole funziona così:

```text
Engineering builds
→ Finance sees the bill
→ cost-cutting request
```

Un altro modello ugualmente debole mette Finance davanti a ogni singola decisione tecnica e trasforma il costo in burocrazia.

La FinOps Foundation descrive invece Architecting & Workload Placement come una capability collaborativa fra Product, Engineering e FinOps.

Fonte:

- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

Product porta value, demand e priorità. Engineering spiega driver, architecture option e quality trade-off. FinOps porta billing evidence, forecast, allocation e rate. Security, Reliability e Platform rendono espliciti i constraint condivisi o non negoziabili.

Nessuno di questi attori può ottimizzare bene il workload da solo.

## Cost guardrail: automatizzare ciò che abbiamo già capito

Alcune property economiche sono abbastanza semplici da diventare guardrail: metadata di allocation richiesti, budget alert, orphan resource, non-prod TTL, retention massima per classi definite o detection di paid capability senza owner.

Ma una regola come `premium SKU forbidden` sarebbe pericolosa. Un tier Premium può essere la conseguenza di un requisito esplicito, come nel caso del private data plane di ESI.

Una forma migliore è:

```text
paid premium
→ property purchased
→ owner
→ evidence
→ review trigger
```

Il guardrail non deve decidere che il premium è sbagliato. Deve impedire che diventi invisibile.

## Visibility prima della punizione

In una organizzazione che sta maturando, showback e trasparenza possono produrre più valore di un chargeback aggressivo. Se un team scopre che observability pesa molto più del previsto o che una parte significativa della spesa viene da non-production sempre acceso, può intervenire prima ancora che Finance sposti formalmente il budget.

La metrica dovrebbe creare decisione prima di creare paura.

## FinOps come fitness function economica

Il ciclo completo è:

```text
architecture decision
→ consumption
→ cost evidence
→ unit economics
→ compare with value and quality
→ optimize, retain or redesign
```

Non sempre produce un gate rosso o verde. Spesso produce un trend, un review trigger o una nuova hypothesis da verificare.

Per Order Operations `cost per OperationalCase handled` diventa utile quando cresce più rapidamente del volume o della complessità del lavoro senza una spiegazione architetturale convincente.

> **FinOps non è il reparto che taglia il cloud. È il feedback loop che permette a Product, Engineering e Finance di capire se la tecnologia sta ancora comprando valore a un prezzo sostenibile.**