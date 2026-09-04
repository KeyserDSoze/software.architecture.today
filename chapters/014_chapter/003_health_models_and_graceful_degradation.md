## Health model e graceful degradation

Fra `up` e `down` esiste uno stato che vale la pena progettare con molta più attenzione:

```text
Degraded
```

È spesso qui che si vede se un sistema possiede davvero un modello di reliability oppure soltanto una collezione di health check.

Microsoft propone di derivare la health del workload da stati come `Healthy`, `Degraded` e `Unhealthy`, combinando segnali misurabili con il significato dei business scenario.

Fonte:

- [Microsoft Learn — Health modeling for workloads](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)

## La health del prodotto non è la media dei componenti

Possiamo avere App Service, PostgreSQL, Service Bus e Key Vault tutti verdi mentre il consumer di Payments & Risk è fermo da quarantacinque minuti. Dal punto di vista dell’infrastruttura, molte risorse sono sane; dal punto di vista del critical flow `Payment Escalation delivery`, il prodotto è degradato.

Possiamo avere anche il contrario: l’applicazione e il database sono perfettamente raggiungibili, ma Entra non permette agli operatori di autenticarsi. In quel momento Order Operations è inutilizzabile per il suo utente principale.

> **La health del prodotto non è la somma della resource health. È il significato dei critical flow nello stato corrente del sistema.**

Questa distinzione ci obbliga a ragionare per journey.

Per Order Operations ne abbiamo almeno tre:

```text
CF-01 Investigation
operator → accesso → case → dati autorevoli/locali → operational view

CF-02 Payment Escalation acceptance
operator → authorization → local transaction → escalation + outbox

CF-03 Payment Escalation delivery
outbox → publisher → broker → Payments & Risk
```

Questi flow possono avere health diverse nello stesso istante.

Se Service Bus è indisponibile ma PostgreSQL è sano, per esempio, l’operatore può continuare a investigare e può ancora registrare localmente una Payment Escalation. La delivery accumula backlog, ma l’acceptance non deve per forza fermarsi.

```text
CF-01 = Healthy
CF-02 = Healthy
CF-03 = Degraded
```

Questa possibilità esiste perché nel Capitolo 11 abbiamo separato il commit locale dalla consegna downstream. La graceful degradation, quindi, non nasce da un `if` aggiunto all’ultimo momento: nasce da boundary e semantiche progettati prima.

## Degradare significa ridurre la promessa, non nascondere il failure

Una modalità degradata non è “qualcosa non funziona ma restituiamo comunque `200`”. Deve dire quali capability restano valide, quali informazioni sono meno affidabili, quali azioni vengono bloccate e quando il sistema deve uscire da quello stato.

Microsoft descrive la graceful degradation come una strategia di self-preservation in cui il workload continua a fornire valore riducendo temporaneamente funzionalità in modo intenzionale.

Fonte:

- [Microsoft Learn — Self-preservation and graceful degradation](https://learn.microsoft.com/azure/well-architected/reliability/self-preservation)

Prendiamo il caso del consumer Payments indisponibile. Una soluzione sincrona fragile trasformerebbe l’escalation dell’operatore in una catena di timeout e outcome ambigui. Il design corrente fa invece:

```text
POST escalation
→ local transaction
→ Requested + Outbox Pending
→ 202 Accepted
```

Il prodotto può quindi dire la verità: la richiesta è stata accettata localmente, ma la delivery è ancora pending o delayed.

Il sistema non finge un successo downstream. Continua a fare soltanto ciò che può garantire.

## Il problema più delicato: fallback di dati autorevoli

La degradazione diventa più difficile quando una dependency live fornisce dati che influenzano decisioni operative.

Supponiamo che la vista Order dipenda da una source autorevole momentaneamente lenta. Possiamo fallire l’intera pagina, oppure mostrare la parte locale del case e rendere esplicito che il dettaglio autorevole non è disponibile.

Questa seconda opzione può essere molto utile, ma soltanto se conserva **provenance e freshness**.

Un fallback tipo:

```text
source down → usa cache
```

non è automaticamente resiliente. Se il payment status vecchio dice `Failed` mentre il sistema autorevole è già passato a `Captured`, presentarlo come truth corrente può indurre un’azione economicamente sbagliata.

Perciò ogni degraded data path deve definire almeno:

```text
provenance
freshness
label
azioni consentite
azioni bloccate
```

> **La graceful degradation non deve degradare la verità senza dirlo.**

Nel Reliability Contract di ESI questa idea diventa `DM-01 — Authoritative read dependency unavailable`: possiamo mostrare lo stato locale, ma non inventare la current truth né permettere azioni che richiedono facts che non siamo riusciti a verificare.

## Liveness, readiness e business health sono domande diverse

Un endpoint `/health` può essere utile, ma non deve diventare il luogo in cui comprimiamo tutto il modello di reliability.

La **liveness** chiede se il processo è vivo abbastanza da non meritare un restart. La **readiness** chiede se l’istanza può ricevere nuovo lavoro utile. La **business health** chiede se un critical journey sta mantenendo il proprio contratto.

Sono tre livelli diversi.

Se Payments & Risk è lento ma Order Operations può ancora accettare escalation localmente, rendere l’istanza web `unready` potrebbe peggiorare il problema. Se una dependency rallenta e la nostra liveness probe inizia a riavviare istanze sane, possiamo creare:

```text
DB slow
→ health check fail
→ restart
→ reconnect storm
→ DB ancora più slow
→ altri restart
```

Un meccanismo pensato per self-healing diventa un amplificatore.

> **Self-healing senza failure model può diventare self-harm.**

La probe dell’orchestrazione deve quindi rispondere a una domanda locale e precisa. Il business health model vive sopra di essa.

## Una health tree leggibile

Per il capstone possiamo rappresentare il sistema così:

```text
Order Operations
├── CF-01 Investigation
│   ├── workforce identity/access
│   ├── App runtime
│   ├── PostgreSQL local state
│   ├── Orders authoritative dependency
│   ├── Payments authoritative dependency
│   └── Shipping authoritative dependency
│
├── CF-02 Escalation acceptance
│   ├── App runtime
│   ├── application authorization
│   └── PostgreSQL transaction
│
└── CF-03 Escalation delivery
    ├── Outbox Publisher
    ├── Service Bus
    └── Payments consumer
```

La root non viene calcolata con una media matematica dei figli. Alcuni nodi sono critical per un flow e irrilevanti per un altro.

Una piccola degradation matrix aiuta a rendere questa semantica esplicita:

| Failure | Investigation | Escalation acceptance | Delivery | Comportamento atteso |
|---|---|---|---|---|
| Payments consumer down | normale | normale | Degraded | backlog/pending visibile |
| Service Bus down | normale | normale | Degraded | outbox durable, retry bounded |
| PostgreSQL down | Degraded/Unhealthy | Unhealthy | broker già popolato può proseguire | nuovi write bloccati |
| Orders dependency down | Degraded | dipende dai facts già locali | normale | dato autorevole indicato unavailable |
| Entra incident | Degraded/Unhealthy per user flow | Degraded/Unhealthy | background può continuare | nessun bypass dell’identity |
| telemetry backend down | functional flow può continuare | può continuare | può continuare | observability Degraded |

La Failure Mode Map spiega **come** il failure viene gestito. Questa matrice aggiunge un’altra domanda: **quanto valore resta ancora disponibile al prodotto?**

## Feature criticality evita di proteggere tutto allo stesso modo

Non ogni capability merita lo stesso investimento di reliability. Nel modello ESI iniziale, authentication/authorization, visualizzazione del case locale e durable escalation acceptance appartengono al critical journey. Un enrichment non essenziale o una dashboard secondaria possono invece essere degradabili.

La classificazione non è una tassonomia universale. Serve a impedire che una feature di convenienza consumi la stessa capacity o lo stesso failure budget del percorso che mantiene operativo il business.

Da qui emergono pattern come bulkhead e load shedding. Il loro valore non sta nel nome, ma nella domanda che ci costringono a fare:

> **Quale workload può consumare la capacità di quale altro workload?**

Se in futuro un report pesante saturasse la stessa pool del core operator journey, avremmo una ragione concreta per separare risorse o rifiutare lavoro non critico prima che il sistema diventi lentamente inutilizzabile.

## Cosa cambia con l’AI

Un agente può proporre fallback molto velocemente. Proprio per questo dobbiamo essere severi sul significato.

Una patch del tipo:

```text
if payments unavailable:
  return lastCachedPaymentStatus
```

può sembrare resiliente e violare la correctness economica.

La review deve chiedere invece:

```text
questo dato può diventare stale?
per quanto?
chi lo vede?
come viene etichettato?
quali azioni diventano unsafe?
quando il fallback deve essere rifiutato?
```

> **Un fallback non è affidabile perché restituisce qualcosa. È affidabile se restituisce qualcosa che possiamo ancora usare in sicurezza.**

Il health model di Order Operations diventa così la cerniera fra SLO e failure design: ci dice non soltanto se qualcosa è rotto, ma quale parte della promessa è ancora vera.