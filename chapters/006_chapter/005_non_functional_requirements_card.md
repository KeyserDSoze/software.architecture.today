## La Non-Functional Requirements Card

I requisiti non funzionali diventano utili quando smettono di essere una lista generica e iniziano a funzionare come input di decisione.

Per questo introduciamo un artefatto operativo:

## Non-Functional Requirements Card

Non è un documento obbligatorio per ogni task.

Serve quando le proprietà di qualità possono cambiare materialmente l'architettura, il costo o il rischio.

Una forma possibile è questa:

```markdown
# Non-Functional Requirements Card

## Critical journeys

## Latency

## Throughput and capacity

## Availability

## Consistency

## Durability

## Recovery
- RTO:
- RPO:

## Security and privacy

## Operability

## Maintainability and changeability

## Cost constraints

## Growth assumptions

## Quality priorities

## Explicit non-goals

## Verification method

## Review triggers
```

La parte importante non è riempire ogni campo.

È scoprire quali campi contano.

### Critical journeys

Prima delle metriche, identifichiamo i percorsi che meritano protezione.

Per ciascuno possiamo avere requisiti differenti.

Esempio:

| Journey | Criticità | Qualità dominante |
| --- | --- | --- |
| creare ordine | alta | correctness, availability |
| consultare ordine | alta | latency, availability |
| esportare report | bassa | throughput batch |
| aggiornare preferenze | media | consistency |

Questa differenziazione evita di ottimizzare tutto allo stesso livello.

### Target, non desideri

Un requisito utile tende a contenere:

```text
metrica
+ soglia
+ condizione
+ finestra
+ metodo di verifica
```

Per esempio:

> Il p95 della consultazione ordine deve restare sotto 300 ms fino a 500 richieste al secondo, misurato end-to-end in un ambiente con dataset rappresentativo.

Oppure:

> In caso di perdita completa della regione primaria, il critical journey di consultazione deve poter essere ripristinato entro 60 minuti con perdita massima di 5 minuti di dati confermati.

Non tutti i requisiti possono essere espressi con una formula.

Per security, maintainability o operability potremmo usare invarianti e scenari.

Esempio:

> Nessun modulo esterno a Orders può aggiornare direttamente lo stato di un ordine nel database.

Oppure:

> Una modifica al provider di pagamento non deve richiedere una modifica al modello dominio Orders.

Il requisito rimane verificabile anche senza percentile.

### Quality priorities

Non possiamo massimizzare tutto.

Per questo la card deve rendere esplicite le priorità.

Esempio:

```text
1. correctness
2. tenant isolation
3. availability del lookup
4. operability
5. latency
6. cost
```

Questo non significa che il costo sia irrilevante.

Significa che, in caso di conflitto, sappiamo quali dimensioni hanno maggiore peso.

Senza una priorità, ogni discussione tecnologica può trasformarsi in una gara tra metriche diverse.

### Explicit non-goals

Uno dei campi più utili è ciò che **non** stiamo cercando di ottimizzare.

Per esempio:

```text
- non progettiamo oggi per 100.000 richieste al secondo;
- non richiediamo active-active multi-region;
- non richiediamo RPO zero;
- non richiediamo deploy indipendente di ogni modulo;
- non ottimizziamo il sistema per analytics real-time.
```

Questi non-goal impediscono alla paura del futuro di trasformarsi in complessità presente.

### Growth assumptions

La crescita prevista va distinta dalla crescita immaginabile.

Possiamo avere:

```text
carico attuale: 20 req/s
picco attuale: 70 req/s
stima a 12 mesi: 150 req/s
stress target: 500 req/s
```

Questo fornisce un margine senza progettare per una scala arbitraria.

L'assunzione deve avere un trigger di revisione.

Se il business cambia, la card cambia.

### Verification method

Ogni proprietà importante dovrebbe avere un modo plausibile per essere verificata.

Per esempio:

- load test;
- chaos test;
- restore drill;
- contract test;
- security review;
- architecture test;
- synthetic monitoring;
- audit log review;
- cost review;
- incident exercise.

Se non sappiamo come verificare una proprietà, dobbiamo almeno dichiarare il limite.

### Review triggers

I requisiti non funzionali non sono eterni.

Trigger possibili:

- traffico raddoppia;
- nuovo mercato geografico;
- nuova normativa;
- nuovo tenant enterprise;
- cambiamento nel costo del downtime;
- nuovo critical journey;
- aumento degli incidenti;
- cambiamento del team operativo;
- introduzione di un nuovo sistema esterno.

Il requisito può cambiare perché cambia il prodotto.

E quindi può cambiare anche la scelta tecnologica.

### La card non sceglie la tecnologia

Questo è fondamentale.

La Non-Functional Requirements Card non dovrebbe contenere frasi come:

```text
availability → Kubernetes
scalability → microservices
performance → Redis
```

Sono salti logici.

La card descrive il problema di qualità.

Le tecnologie verranno confrontate dopo.

> **Un buon NFR restringe lo spazio delle soluzioni senza fingere che esista una sola soluzione possibile.**
