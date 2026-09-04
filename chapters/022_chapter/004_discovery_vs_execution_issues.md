# 22.4 — Discovery issue ed execution issue

Non tutto il lavoro è pronto per essere implementato.

E questo non è un difetto.

A volte la cosa più professionale che possiamo fare è aprire una issue il cui outcome non è codice.

## Due classi diverse di lavoro

Una **discovery issue** riduce incertezza.

Una **execution issue** modifica il sistema sulla base di incertezza già abbastanza ridotta.

Esempio discovery:

```text
Problem
Non sappiamo se il nightly export di Operations Desk Classic
ha ancora consumer attivi.

Outcome
consumer inventory con owner, frequenza e criticità.

Verification
evidence da job config, access log e conferma owner.

Out of scope
spegnere il job.
```

Esempio execution:

```text
Problem
Un consumer confermato dipende ancora dal nightly export.

Outcome
spostare quel consumer sul nuovo contract approvato.

Verification
consumer contract test + staging evidence.
```

Confondere i due tipi di lavoro porta spesso a big-bang prematuri.

## Il failure mode: implementation as discovery

Un agente riceve:

```text
Replace legacy export with new API.
```

Durante il lavoro scopre che:

- ci sono consumer sconosciuti;
- il file contiene campi non documentati;
- un team Finance lo usa manualmente;
- la retention ha valore audit.

Se continua comunque a implementare, stiamo usando il codice per scoprire il problema.

Questo può essere utile in un prototipo controllato.

Non dovrebbe essere il default per una migration con blast radius reale.

> **Quando l'incertezza riguarda chi dipende dal comportamento, il primo output dovrebbe essere conoscenza, non una sostituzione.**

## Spike e prototype

Discovery non significa soltanto leggere documenti.

Può includere:

- spike tecnico;
- benchmark;
- proof of concept;
- schema exploration;
- synthetic test;
- dependency graph;
- data sampling non sensibile;
- cost estimate;
- threat exploration.

La differenza sta nell'outcome.

Un prototype può produrre codice, ma quel codice non è automaticamente production implementation.

La issue deve dirlo.

```text
Deliverable
throw-away prototype allowed

Not acceptance
production-ready implementation
```

## Exit criteria della discovery

Una discovery issue dovrebbe definire quando sappiamo abbastanza per decidere.

Per esempio:

```text
Exit when:
- all current consumers are identified or explicitly classified unknown;
- data owner is confirmed;
- required compatibility window is known;
- migration blockers are documented;
- next decision can be framed as ADR or execution issue.
```

Senza exit criteria, la discovery può diventare ricerca infinita.

## L'AI nella discovery

Gli agenti sono molto utili per:

- cercare call site;
- confrontare schema;
- mappare file;
- estrarre candidate consumer;
- trovare configurazioni;
- sintetizzare log o documentazione;
- proporre hypothesis.

Ma torna la scala del Capitolo 17:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Un agente può trovare tre script che leggono un file.

Non può concludere automaticamente che siano gli unici consumer in produzione.

## Promuovere discovery a execution

Una discovery termina bene quando riduce il task successivo.

```text
broad uncertainty
        ↓
discovery
        ↓
explicit decision
        ↓
small execution issue
```

La qualità della discovery si misura quindi anche dalla capacità di rendere la prossima issue più decidibile.

> **Discovery non è il contrario della delivery. È delivery di conoscenza quando la conoscenza è il prerequisito del cambiamento.**
