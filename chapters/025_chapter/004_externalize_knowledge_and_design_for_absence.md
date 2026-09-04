# Esternalizzare conoscenza e progettare per l'assenza

Il rischio più serio di un One-Man Project non è tecnico.

È organizzativo.

Se una persona governa molta execution, quella persona può diventare rapidamente il luogo in cui si accumulano:

- rationale;
- workaround;
- priorità;
- credenziali operative;
- contatti;
- procedure;
- eccezioni;
- memoria degli incidenti;
- conoscenza dei consumer nascosti;
- interpretazione dei requisiti.

A quel punto il progetto può sembrare efficiente finché il lead è presente.

Poi arrivano:

```text
vacation
illness
role change
incident while offline
organizational move
burnout
```

E scopriamo che il sistema aveva una replica del database, ma non una replica della conoscenza.

## Bus factor non è un insulto al modello

Il problema non è che una sola persona lavori molto sul progetto.

Il problema è che una sola persona sia necessaria per:

```text
understand
operate
decide
recover
change
```

Possiamo quindi distinguere:

```text
execution concentration
≠
knowledge concentration
```

Un One-Man Project può avere execution concentration alta e knowledge concentration relativamente bassa se il sistema rende esplicito ciò che altrimenti vivrebbe nella testa del lead.

## Il repository come memoria esterna

Nel nostro percorso abbiamo costruito progressivamente:

```text
Functional Analysis
Requirements
Architecture Context
ADR
Data Ownership Map
API Contract
Failure Mode Map
Threat Model
Reliability Contract
Observability Contract
Testing Strategy
Legacy Understanding Map
Refactoring Safety Plan
Architecture Fitness Checklist
Cost Model
Repository Map
Work Items
Agent governance artifacts
AI Feature Contract
```

Questi file non servono a produrre un repository “enterprise-looking”.

Servono a ridurre una proprietà molto precisa:

> **la quantità di contesto che deve esistere soltanto nella memoria di una persona.**

La documentazione è quindi parte della continuity architecture.

## Documentare decisioni, non cronaca

Il rischio opposto è produrre una quantità enorme di testo che nessuno sa più usare.

Per la continuity ci interessano soprattutto informazioni come:

```text
what is true?
who owns it?
why did we choose this?
what must not change silently?
what evidence exists?
what remains pending?
what should trigger a review?
how do we recover?
where do we start?
```

Non serve documentare ogni conversazione.

Serve evitare che una decisione significativa diventi folklore.

> **La knowledge redundancy non nasce copiando tutto. Nasce rendendo recuperabile ciò che servirebbe a una persona competente per riprendere il controllo.**

## Maintainer, non proprietario assoluto

GitHub ha raccontato l'introduzione di `SERVICEOWNERS` per associare componenti e servizi ai loro maintainer. Il valore descritto include una terminologia condivisa, collegamenti più stabili fra software e persone e la capacità di individuare rapidamente chi contattare durante incidenti e cambi organizzativi.

Fonte:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

Un dettaglio interessante è il linguaggio scelto da GitHub: *maintainer* rende meglio del concetto assoluto di ownership.

Per il One-Man Project questa sfumatura è utile.

Il lead mantiene il progetto.

Non possiede personalmente la verità del business, della security policy o della piattaforma.

## Il Continuity Test

Introduciamo quindi un test operativo semplice:

> **Se il lead sparisse per due settimane domani mattina, una persona competente riuscirebbe a capire lo stato del progetto, non fare danni e portare avanti almeno il lavoro necessario?**

Non deve riuscire istantaneamente a essere produttiva al 100%.

Deve però poter ricostruire:

### 1. Purpose

```text
che cosa fa il prodotto?
per chi?
quali outcome protegge?
```

### 2. Current architecture

```text
quali boundary?
quali dipendenze?
quali owner?
```

### 3. Current work

```text
quali task aperti?
quali sono execution-ready?
quali sono bloccati da una decisione?
```

### 4. Evidence

```text
che cosa è Verified?
che cosa è soltanto Designed?
quali test/gate esistono?
```

### 5. Operations

```text
come si builda?
come si testa?
come si osserva?
come si recupera?
```

### 6. Decision rights

```text
che cosa può decidere il maintainer?
che cosa richiede Product?
Security?
Payments?
Platform?
```

### 7. Failure state

```text
quali rischi noti?
quali workaround temporanei?
quali fallback?
```

Se queste risposte richiedono una telefonata al lead, abbiamo trovato knowledge debt.

## Vacation test

Il Continuity Test può diventare molto concreto.

Prima di considerare maturo il One-Man Project, ESI introduce un **vacation test** simulato:

```text
lead unavailable
→ second maintainer receives only repo + approved enterprise systems
→ must reconstruct current state
→ run golden verification
→ explain open work and known risk
→ perform one bounded safe change or incident drill
```

Non serve aspettare davvero le ferie.

Può essere un game day organizzativo.

L'obiettivo non è dimostrare che il secondo maintainer sappia tutto.

È scoprire quali informazioni erano ancora soltanto tribali.

## Secondary maintainer

One-Man Project non significa zero backup umano.

ESI richiede almeno un **secondary maintainer** per progetti che superano una certa criticità.

Il secondary maintainer non deve partecipare a ogni task.

Deve però:

- conoscere il product purpose;
- sapere usare Repository Map e AGENTS.md;
- sapere eseguire i golden command;
- conoscere escalation path e decision owner;
- partecipare periodicamente a continuity review o game day;
- poter assumere il control plane in caso di assenza.

Questo costa meno di duplicare permanentemente tutto il lavoro.

Ma evita di trasformare il leverage individuale in rischio organizzativo incontrollato.

## Decision log e handoff

Quando il lead interrompe il lavoro, non dovrebbe lasciare soltanto:

```text
branch with half-finished code
```

Dovrebbe lasciare almeno:

```text
current goal
current hypothesis
what changed
what evidence exists
what failed
what remains undecided
next safe step
stop conditions
```

Gli agenti possono aiutare a produrre questo handoff.

Ma il lead deve verificarne la correttezza.

## Knowledge freshness

Esternalizzare conoscenza crea un nuovo rischio:

```text
documented
but stale
```

Quindi continuiamo a usare fitness e review trigger.

Una source of truth obsoleta è peggiore di una source of truth mancante quando dà falsa confidenza.

Per questo il Continuity Test deve usare la documentazione per **fare qualcosa**, non soltanto controllare che i file esistano.

> **La documentazione è continuity evidence quando un'altra persona riesce davvero a usarla per prendere il controllo senza inventare il sistema da capo.**
