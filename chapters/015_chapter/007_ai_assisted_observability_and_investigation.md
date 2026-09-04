## AI-assisted observability: accelerare l’indagine senza inventare la causa

L’observability è uno dei contesti in cui l’AI può ridurre davvero il tempo umano necessario per orientarsi. Durante un incidente possiamo avere migliaia di log, centinaia di trace, decine di metriche, deployment recenti, runbook e incident history che cambiano contemporaneamente.

Un agente può comprimere questo spazio di ricerca. Ma la stessa capacità che lo rende utile introduce un rischio preciso: trasformare rapidamente una correlazione plausibile in una causalità raccontata con troppa sicurezza.

Per questo il ruolo dell’AI nell’investigazione deve seguire una sequenza diversa da “leggi i log e dimmi la root cause”:

```text
evidence
→ observation
→ hypothesis
→ discriminating check
→ updated confidence
→ human/controlled action
```

## Prima osservare, poi spiegare

Supponiamo che durante un incidente vediamo:

```text
SLO burn in aumento
outbox oldest age crescente
Service Bus publish error
release v42 pochi minuti prima
read journey ancora sano
```

Un agente può essere molto utile nel sintetizzare questi fatti e costruire una timeline. Il valore sta nel distinguere ciò che è direttamente osservato da ciò che viene inferito.

Può quindi proporre ipotesi come:

```text
H1 — Service Bus unavailable
H2 — private DNS resolution failure
H3 — runtime identity/RBAC regression
H4 — publisher code regression
```

La qualità dell’output cresce se ogni ipotesi porta con sé tre cose:

```text
supporting evidence
contradicting evidence
next discriminating check
```

A quel punto il modello non sta cercando di “avere ragione” in un colpo solo. Sta aiutando il team a scegliere la query o il test che riduce più rapidamente l’incertezza.

## Correlazione temporale non è causal proof

Se un deployment avviene alle 14:04 e gli errori iniziano alle 14:07, il deployment diventa un candidato importante. Non diventa automaticamente la causa.

Potrebbero essere cambiati nello stesso intervallo DNS, credenziali, traffico o una dependency esterna. Oppure il deployment potrebbe aver reso visibile una latent condition che esisteva già.

Questo vale per ogni signal. Una spike di database latency non dimostra da sola che “il database è la root cause”; può essere il risultato di retry amplification, una migration concorrente o un downstream che sta trattenendo connessioni più a lungo.

> **L’AI può ordinare le ipotesi. Non può saltare il passaggio che trasforma una ipotesi in evidence.**

## L’assenza di telemetry non prova l’assenza del comportamento

Un altro errore frequente è trattare il log store come realtà completa.

Se un evento non compare, può significare che non è successo. Ma può anche significare instrumentation mancante, sampling, ingestion failure, query incompleta, clock skew o retention.

Questa distinzione è particolarmente importante per un agente, perché i modelli tendono naturalmente a costruire una storia coerente a partire dai dati disponibili. La storia può essere internamente plausibile e mancare proprio del signal che la smentirebbe.

Quindi il formato ESI per l’investigazione deve rendere visibile anche ciò che non sappiamo.

## Investigation Bundle

Un agente può produrre un bundle compatto che una persona riesca a verificare senza rileggere ogni log:

```markdown
# Investigation Bundle

## Incident window

## Affected SLI / journey

## Observations
- evidence diretta

## Hypotheses
### H1
- supporting evidence
- contradicting evidence
- confidence
- next discriminating check

## Representative evidence
- query definitions / links
- trace IDs
- structured events
- deployment/configuration changes

## Unknowns

## Recommended next check

## Stop condition
```

Il bundle non è un verdetto. È una compressione riproducibile dell’investigazione.

L’umano può così controllare il ragionamento usando query, trace e timestamp specifici invece di fidarsi di una spiegazione narrativa difficile da falsificare.

## Le identity dell’observability devono restare semanticamente distinte

Il Capitolo 15 ha già distinto `traceId`, `messageId`, `escalationId` e `correlationId`. Un investigation agent deve ricevere lo stesso context engineering.

Se tratta `traceId` ed `EscalationId` come equivalenti, può interpretare un retry come una nuova business operation o considerare due trace differenti come due escalation differenti.

Lo stesso vale per una metric come:

```text
queue depth = 1000
```

Senza arrival rate, drain rate, oldest age e business threshold, il numero è ambiguo. L’agente deve conoscere la semantic definition del signal, non soltanto il valore.

Ecco perché repository artifact come Observability Contract, Reliability Contract e Failure Mode Map aumentano direttamente la qualità dell’investigazione AI-assisted: trasformano numeri grezzi in context.

## Read access e remediation access non sono la stessa capability

Un investigation agent non ha bisogno, per default, di poter modificare produzione.

Per molte analisi bastano:

```text
read telemetry
read deployment metadata
read architecture docs
read runbooks
read incident history
```

Non servono automaticamente:

```text
write production
RBAC administration
secret read
arbitrary customer-data export
```

Osservare e modificare sono capability differenti. La remediation può richiedere un livello di autonomia, permission boundary e approval diverso.

Questa separazione segue esattamente il modello del libro: l’autonomia cresce soltanto quando reversibilità, blast radius ed evidence lo consentono.

## Over-query e data minimization

Un agente capace di interrogare telemetry può generare rapidamente molte query costose o chiedere più dati sensibili del necessario.

L’investigation interface deve quindi ereditare cardinality budget, retention policy, access control e data minimization. Anche l’AI deve preferire la **next discriminating query**, non “scarica tutto e vediamo”.

Questo è un altro motivo per cui l’Observability Contract diventa context engineering: spiega quali signal esistono, che cosa significano e quali dati non devono essere usati come shortcut.

## AI-generated instrumentation: generare dopo il contract

Un agente può scrivere span, metric, structured event, dashboard definition e alert query in pochi minuti. Se gli chiediamo semplicemente “rendi osservabile questo servizio”, possiamo ottenere instrumentation explosion: molti signal validi localmente ma nessuna gerarchia di valore.

È molto più utile usare l’AI come reviewer di un contract già esplicito:

```text
Trova metric dimensions unbounded.
Trova log che possono contenere token o PII.
Confronta Failure Mode Map e signal disponibili.
Trova alert senza owner o response path.
Trova metriche senza SLI, alert, dashboard o investigation consumer.
Trova correlation boundary spezzati.
```

Queste richieste hanno input, criteri ed evidence molto più verificabili di “migliora l’observability”.

## Context engineering dell’investigation

Un agente diventa più affidabile quando può leggere insieme:

```text
Observability Contract
Reliability Contract
Failure Mode Map
Threat Model
runbook
service ownership
metric semantics
alert semantics
recent deployment metadata
```

Il repository non sostituisce runtime evidence, ma impedisce al modello di osservare una serie temporale senza sapere quale promessa del prodotto rappresenti.

## Regola ESI

L’AI può ridurre il tempo necessario per trovare evidence e scegliere il prossimo controllo discriminante.

Non può trasformare:

```text
plausibilità
```

in:

```text
causalità dimostrata
```

senza verifica.

Fonti di base:

- [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)

Le modalità operative degli agenti sono il modello proposto dal libro, non uno standard esterno.

> **L’AI può trovare più velocemente una storia nei dati. Il nostro compito è verificare che quella storia sia davvero successa.**