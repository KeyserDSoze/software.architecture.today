## Order Operations — la qualità diventa una scelta esplicita

> **Caso simulato/composito.** Order Operations è un prodotto fittizio di Example Software Industries S.p.A. I numeri di questa sezione, quando presenti, sono **requisiti simulati del caso**, non benchmark industriali né misurazioni di sistemi reali.

Finora abbiamo chiarito il problema, reso visibili i confini e registrato una prima decisione architetturale. Ora possiamo smettere di dire genericamente che Order Operations debba essere “veloce, affidabile e scalabile” e decidere che cosa queste parole significhino per il prodotto che stiamo costruendo.

## I journey che vogliamo proteggere

Nella prima iterazione ci interessano soprattutto due percorsi: l'operatore consulta la lista degli ordini problematici e apre il dettaglio operativo di un ordine. Le future action, come retry o refund, non fanno ancora parte del critical journey autorizzato; un report mensile, anche se utile, non ha necessariamente la stessa criticità.

Questa distinzione ci impedisce di applicare a tutto lo stesso livello di disponibilità, latency e recovery.

## Numeri simulati e misure reali non sono la stessa cosa

Il team potrebbe sostituire “la pagina deve essere veloce” con “p95 sotto 200 ms” e sentirsi improvvisamente preciso. Ma un numero arbitrario è soltanto vaghezza con più cifre.

Nel capstone distingueremo sempre due categorie. Un **requirement simulato** è un target deciso nello scenario ESI per esercitare il metodo. Un **measurement del capstone** arriverà quando esisteranno codice, workload e ambiente eseguibile.

I due non vanno confusi. Possiamo prendere una decisione iniziale su un target simulato, ma dovremo conservare la possibilità di correggerlo quando arriverà evidence reale.

## Non-Functional Requirements Card — Order Operations v1

La card resta un artefatto strutturato, proprio perché dovrà essere aggiornata e usata come input di decisione:

```markdown
# Non-Functional Requirements Card — Order Operations v1

## Critical journeys
- lista ordini problematici;
- dettaglio operativo dell'ordine.

## Latency — requisito simulato
- lista: p95 < 500 ms nel workload previsto;
- dettaglio: p95 < 400 ms nel workload previsto.

## Capacity — assunzione simulata
- workload iniziale modesto;
- crescita da misurare prima di introdurre caching o partitioning dedicato;
- stress test richiesto prima del rollout esteso.

## Availability — requisito simulato
- obiettivo iniziale coerente con uno strumento operativo interno;
- nessun requisito corrente di active-active multi-region.

## Consistency
- lo stato mostrato deve essere sufficientemente fresco da non indurre decisioni operative errate;
- quando un dato non è live o è potenzialmente stale, la sua freshness deve essere rappresentabile.

## Durability
- Order Operations non deve introdurre perdita di dati autorevoli appartenenti ai domini Orders, Payments o Shipping.

## Recovery
- RTO e RPO devono essere quantificati prima della production readiness;
- per ora sono open requirement, non numeri inventati.

## Security and privacy
- accesso autenticato;
- authorization coerente con il ruolo dell'operatore;
- nessun dato fuori dal perimetro autorizzato;
- nessun dettaglio infrastrutturale sensibile esposto alla UI.

## Operability
- deployment ripetibile;
- rollback documentato;
- metriche e log sufficienti a distinguere errore applicativo da dipendenza lenta;
- failure parziali delle fonti dati devono essere diagnosticabili.

## Maintainability and changeability
- Orders, Payments e Shipping mantengono ownership dei propri stati;
- il provider infrastrutturale non entra nel modello di dominio;
- la classificazione operativa rimane separata dagli stati autorevoli.

## Cost constraints
- nessun requisito attuale giustifica active-active multi-region;
- nessun requisito attuale giustifica una cache distribuita dedicata;
- la soluzione deve essere operabile dal team senza creare una piattaforma parallela.

## Quality priorities
1. correctness;
2. authorization e data isolation;
3. operability;
4. latency del journey operativo;
5. availability coerente con il bisogno;
6. cost.

## Explicit non-goals
- RPO zero dichiarato senza business case;
- active-active multi-region;
- analytics real-time;
- sub-50-ms latency;
- microservizi per ogni boundary.

## Verification method
- integration test di authorization;
- test sulle combinazioni di stato;
- load test del critical journey;
- synthetic check quando esisterà l'ambiente;
- review periodica dei costi;
- restore drill quando il prodotto possiederà dati persistenti propri.

## Review triggers
- crescita del traffico oltre il workload previsto;
- SLA enterprise più severi;
- nuovo requisito geografico;
- incidenti ricorrenti sul percorso live;
- costo del downtime rivalutato dal business.
```

La card non pretende di essere la verità finale. È una prima decisione esplicita e revisionabile sul profilo di qualità.

## La precisione deve dichiarare la propria origine

I target di latency sono simulati. Potrebbero risultare troppo severi o troppo permissivi quando avremo workload rappresentativi e feedback dagli operatori. Per questo possiamo annotare anche confidence e piano di validazione:

```text
latency target iniziale: 500 ms p95
origine: requisito simulato ESI
confidence: media
validazione: usability + load test
review: dopo primo workload rappresentativo
```

Questa forma è più utile di presentare un numero come se fosse una legge universale.

## La NFR Card mette alla prova ADR-001

Nel Capitolo 4 abbiamo scelto di non introdurre ancora un read model asincrono. Ora possiamo finalmente chiedere se quella scelta continua ad avere fit.

Il lookup live deve sostenere contemporaneamente latency accettabile, correctness, availability, operability e cost. Se riesce a farlo senza caricare eccessivamente i sistemi autorevoli, ADR-001 rimane sensato. Se fallisce su una proprietà importante, avremo evidence concreta per riaprirlo.

La decisione non cambia perché “CQRS è più moderno” o perché una cache sembra una buona pratica. Cambia quando il profilo di qualità dimostra che la soluzione corrente non è più sufficiente.

## La prima tecnologia che non introduciamo: Redis

“Mettiamo Redis davanti al lookup” è una proposta plausibile. La card ci costringe però a chiedere quale requisito stia pagando quella complessità: latency, database load, availability o qualcos'altro?

Se le misure mostrassero che il lookup rispetta i target e il carico è trascurabile, una cache distribuita non comprerebbe una proprietà necessaria. In cambio introdurrebbe invalidation, stale data, infrastruttura, costi e nuovi punti in cui verificare tenant isolation e authorization.

Per questa iterazione la decisione è quindi:

> **Nessuna cache distribuita finché un requisito o una misura non ne giustifica il costo.**

Non è una posizione contro Redis. È una posizione contro l'infrastruttura senza requisito.

## La seconda tecnologia che non introduciamo: active-active multi-region

“Così siamo enterprise-ready” non è un ASR. La card non contiene oggi un requisito che renda necessario pagare consistency distribuita, routing multi-region, deployment più complesso, incident response e capacity duplicata.

Potrebbe essere una soluzione corretta in un contesto futuro. Oggi sarebbe una risposta molto costosa a una domanda che non abbiamo.

## Il compromesso ESI

Product vuole evitare che la foundation rallenti il prodotto; Operations vuole una capability affidabile; Platform Engineering preferisce semplicità e standardizzazione; Finance non vuole infrastruttura senza ritorno; Security considera authorization e data isolation un quality floor, non una leva negoziabile.

La decisione è partire con la soluzione più semplice che **può dimostrare** di soddisfare i target. Accettiamo di non massimizzare availability geografica, isolamento del workload o latency teorica minima. Non accettiamo di sacrificare correctness, authorization, tracciabilità verso i dati autorevoli e operability.

I guardrail sono la NFR Card, i load test, le metriche, i review trigger e, più avanti, il production-readiness gate.

> **Fit before fashion non significa cheapest possible. Significa pagare per le proprietà che servono davvero e proteggere quelle che non possiamo perdere.**

## Evidenze metodologiche

Il metodo di partire dal workload e dai business requirement, dichiarare le quality priority e valutare i trade-off è coerente con le guide di Microsoft e AWS:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/en-us/azure/architecture/guide/)
- [Microsoft Learn — Design principles for Azure applications](https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [AWS Well-Architected — Evaluate how trade-offs impact customers and architecture efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)

Queste fonti sostengono il metodo. Non sostengono i numeri simulati di ESI.

## Quando il contesto cambierà

Tra due anni Order Operations potrebbe avere utenti globali, SLA enterprise, milioni di eventi al giorno, requisiti di data residency e un costo del downtime completamente diverso. In quel contesto Redis, un read model o un deployment multi-region potrebbero passare da overengineering a necessità.

Non sarebbe una contraddizione. Sarebbe il funzionamento corretto di un'architettura guidata dal contesto.

> **Una buona decisione non deve essere eterna. Deve avere fit oggi ed essere abbastanza esplicita da sapere quando non ce l'ha più.**
