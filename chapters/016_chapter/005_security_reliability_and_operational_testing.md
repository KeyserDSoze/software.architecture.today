## Testare security, reliability e operabilità

Una suite funzionale può essere completamente verde mentre il sistema attraversa tenant, non sa ripristinare un database o produce alert che nessuno riceve.

Questo succede quando trattiamo quality attribute come requisiti “non funzionali” nel senso sbagliato: importanti, ma fuori dal comportamento da verificare.

Per Order Operations la correttezza non è soltanto:

```text
investigare un ordine
accettare una Payment Escalation
consegnare una Payment Escalation
```

È farlo:

```text
senza attraversare tenant
senza perdere intent committed
senza duplicare l’effetto business
entro il reliability envelope dichiarato
con privilege limitati
con recovery praticabile
con evidence osservabile
```

La Testing Architecture deve quindi ereditare claim da Threat Model, Reliability Contract, Failure Mode Map e Observability Contract.

## Security: dal threat alla falsificazione del controllo

Il Threat Model del Capitolo 13 ci dà scenari concreti. La suite non parte da “facciamo penetration test”, ma da:

```text
threat
→ control
→ claim
→ verification boundary
```

Per esempio:

```text
T-02 cross-tenant access
→ server-side tenant authorization
→ operator A cannot read/write tenant B
→ application + authenticated integration
```

Oppure:

```text
runtime identity compromise
→ least privilege
→ runtime cannot assign RBAC or modify infrastructure
→ Azure negative permission test
```

OWASP ASVS può fornire una baseline di verification requirement per technical security control, ma non sostituisce il threat model specifico del workload.

Fonte:

- [OWASP — Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

La security vive spesso nel non-effetto. Un negative test sensibile deve quindi verificare non soltanto la response:

```text
wrong tenant
→ denied
AND no PaymentEscalation
AND no OutboxMessage
AND no unauthorized data disclosure
```

Una `403` corretta dopo un side effect già avvenuto non è un controllo riuscito.

## Gli scanner sono evidence specializzate, non la strategy

Secret scanning, SAST, SCA, DAST e IaC scanning rispondono a domande utili ma finite.

```text
secret scanning
→ trova classi di credential material

SCA
→ trova dependency/risk noto

SAST
→ trova pattern/path staticamente analizzabili

DAST
→ osserva comportamento runtime da un boundary esterno
```

Nessuno di questi dimostra da solo tenant isolation, business authorization o runtime least privilege.

La pipeline deve quindi combinare tooling automatico e scenario verification. Il valore di uno scanner è il rischio che riduce e il gate che informa, non il fatto che produca un report.

## Reliability: il Failure Mode Map diventa test backlog

Nel Capitolo 14 abbiamo scritto:

> **La resilienza che non abbiamo mai provato è ancora un’ipotesi.**

Ora ogni failure significativo deve poter essere trasformato in una struttura verificabile:

```text
fault / trigger
→ expected product state
→ degraded behavior
→ recovery path
→ measurement
→ stop condition
→ owner
```

Se Payments & Risk resta indisponibile, non basta simulare `broker.publish()` che lancia una exception. Il system-level claim è più ampio:

```text
local escalation acceptance continues
outbox/publication evidence remains durable
backlog/delay becomes visible
no duplicate business intent
recovery drains backlog within the agreed envelope
```

Il test locale verifica l’error handling. Il failure drill verifica il prodotto.

## Aumentare la fedeltà gradualmente

Non serve iniziare spegnendo una regione. La fidelity deve essere proporzionata alla claim:

```text
Level 1 — deterministic local fault
Level 2 — real integration dependency fault
Level 3 — non-production cloud fault
Level 4 — controlled production-like game day
Level 5 — production experiment soltanto con guardrail forti e ragione esplicita
```

Il livello alto non è più prestigioso. È più costoso e ha un blast radius maggiore. Deve quindi dimostrare qualcosa che non possiamo dimostrare prima.

## Recovery: misurare ciò che il runbook promette

Per Order Operations abbiamo già claim precise.

Un bad deployment deve poter tornare a un known-good artifact e ripristinare il critical journey.

Un PostgreSQL failover deve preservare committed state e rientrare nel target intra-region osservando reconnect behavior e transient impact.

Un PITR deve ripristinare un punto accettabile, permettere validation applicativa e produrre actual RTO/RPO.

Un publisher fermo deve lasciare crescere un backlog visibile e poi drenarlo senza silent loss.

Il pass criterion non viene dal fatto che Azure chiami una feature “automatic failover”. Viene dal Reliability Contract ESI.

> **Un provider capability è un input alla recovery strategy. Il drill è l’evidence del workload.**

## Backup: esistenza e recoverability sono claim differenti

`Backup job = Succeeded` dimostra che una copia è stata prodotta secondo il meccanismo del provider. Non dimostra che ESI sappia ottenere un workload utilizzabile da quella copia.

La evidence significativa è:

```text
backup exists
→ restore executed
→ data validated
→ application validation
→ elapsed time measured
→ divergence/reconciliation understood
```

Questa è la differenza tra availability del servizio backup e recoverability del prodotto.

## Performance e capacity: senza workload model il grafico non è acceptance evidence

Un load test può essere utile anche quando il target è ancora esplorativo. Ma per diventare verification deve collegarsi a:

```text
expected load shape
latency/error SLI
saturation/headroom requirement
recovery load
```

Order Operations non possiede ancora traffico reale. Non inventiamo quindi `10,000 RPS` per far sembrare il test professionale. Usiamo workload assumption esplicitamente simulate e le sostituiamo quando arriva runtime evidence.

La capacity deve includere anche il recovery path. Un sistema può sostenere lo steady state e collassare appena deve drenare trenta minuti di backlog.

```text
failure period
→ backlog accumulates
→ dependency recovers
→ backlog drain
→ interactive journey must remain protected
```

Questo è un test di fault isolation e headroom, non soltanto throughput.

## Observability: testare anche il nostro sistema di prova operativo

Se il publisher fallisce, la claim non è soltanto “il codice gestisce l’errore”. Il Capitolo 15 richiede anche:

```text
failure signal emitted
correlation preserved
outbox age changes
SLI/alert query reflects the condition
owner can investigate
```

Possiamo quindi iniettare un failure noto e verificare la sua presenza nella telemetry.

Lo stesso vale per la redaction:

```text
representative secret/token-like value
→ no forbidden field in exported telemetry
```

A quel punto l’Observability Contract smette di essere soltanto `Designed` e inizia a produrre verification evidence.

## Alert: un rule file che compila non dimostra response capability

Un alert operativo deve poter attraversare l’intera chain:

```text
known condition
→ alert fires
→ correct owner receives it
→ context/runbook available
→ recovery closes condition
```

Un alert che nessuno riceve o che nessuno sa interpretare è test debt operativo.

La review periodica deve guardare anche false positive, stale owner, acknowledgment behavior e quarantine/mute rimasti attivi troppo a lungo.

## Synthetic journey: anche il test ha un security boundary

Il private synthetic journey di Order Operations deve rispettare:

```text
private execution path
dedicated identity
synthetic tenant/data
minimum permission
no customer data
clear cleanup/lifecycle
traffic distinguishability
```

Aprire un public endpoint per rendere facile il synthetic monitoring falsificherebbe una claim del Threat Model mentre cerchiamo di verificare una claim di reliability.

Quality attribute differenti non possono essere testati ignorandosi a vicenda.

## Infrastructure as Code: attraversare progressivamente il boundary

Per `infra/main.bicep` vogliamo una evidence chain, non un singolo test:

```text
Bicep build/lint
→ template syntactically valid

policy/static checks
→ selected configuration constraints

non-production deployment
→ resources can be provisioned

negative security verification
→ public access / broad RBAC denied

application smoke/synthetic
→ workload can actually use the provisioned topology

failure drill
→ selected resilience behavior works
```

Microsoft Well-Architected raccomanda appunto cross-layer validation oltre al solo template test.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

## L’ambiente deve essere fedele alla property, non a un rituale di parity

Non ogni test richiede Azure. Non ogni test può evitare Azure.

```text
business rule
→ process-local

PostgreSQL transaction semantics
→ real PostgreSQL

private network / RBAC
→ Azure non-production

zone/failover behavior
→ environment che supporta davvero quel failure
```

Microsoft suggerisce purpose-driven environment ed environment effimeri quando appropriato proprio per comprare il realismo necessario senza mantenere permanentemente una seconda produzione.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

Lo stesso principio vale per i dati. Synthetic e deterministic fixture sono il default. Un dump production in staging introduce privacy, security, retention e non-determinism e richiede una data strategy specifica se davvero necessario.

## Production verification senza usare i clienti come test suite

In produzione verifichiamo continuamente SLI, canary, synthetic journey, health, config e rollout. Questo non rende inutile la pre-production evidence.

La domanda corretta non è “test in production sì o no?”. È:

> **Quale claim è sicuro verificare in quale ambiente e con quale blast radius?**

> **Un quality attribute che non sappiamo falsificare rimane una dichiarazione di intenti. Testing Architecture significa trasformare security, reliability e operabilità in evidence ripetibile e proporzionata al rischio.**