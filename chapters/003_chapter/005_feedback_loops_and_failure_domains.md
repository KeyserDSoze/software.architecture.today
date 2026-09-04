## Feedback loop e failure domain

Un sistema non produce soltanto output.

Produce conseguenze che tornano a influenzarlo.

Questo è un **feedback loop**.

Nel software può essere evidente:

```text
request
→ load increases
→ latency increases
→ clients retry
→ load increases further
```

Oppure meno evidente:

```text
recommendation algorithm
→ users click certain content
→ training data changes
→ future recommendations reinforce the pattern
```

I feedback loop sono importanti perché possono stabilizzare oppure destabilizzare il sistema.

## Retry come feedback loop

Un retry sembra una tecnica locale di resilienza.

Una chiamata fallisce, quindi riproviamo.

Ma se mille client fanno la stessa cosa durante un degrado, otteniamo:

```text
service slows down
→ requests fail
→ clients retry
→ traffic rises
→ service slows down more
```

Il comportamento che localmente sembra aumentare affidabilità può sistemicamente peggiorarla.

Questo è un esempio perfetto di perché il pensiero sistemico serve prima del catalogo dei pattern.

Il retry non è “buono”.

È una scelta che interagisce con timeout, backoff e jitter, ma anche con capacity, idempotency e rate limiting. Queueing e recovery time completano un sistema di feedback che non può essere compreso guardando un solo parametro.

## Autoscaling come feedback loop

Anche l'autoscaling crea un loop:

```text
load rises
→ metric crosses threshold
→ new instances start
→ capacity rises
→ load per instance falls
```

Sembra stabilizzante.

Ma contiene ritardi.

Se l'avvio delle nuove istanze richiede tempo, il sistema può continuare a degradarsi prima che la capacità arrivi.

Se la metrica scelta è sbagliata, può scalare troppo tardi o troppo presto.

Se il database non scala nello stesso modo, aumentare application instances può semplicemente spostare il collo di bottiglia.

Ancora una volta: il comportamento emerge dall'interazione.

## Feedback organizzativi

I sistemi software includono anche persone e processi.

Un sistema difficile da osservare produce incidenti lunghi.

Incidenti lunghi generano procedure manuali difensive.

Procedure manuali aumentano complessità operativa.

La complessità rende ancora più difficile capire gli incidenti.

Questo è un feedback loop organizzativo.

Oppure:

```text
release painful
→ team releases less often
→ batches become larger
→ releases become more risky
→ releases become even more painful
```

L'architettura e il processo si influenzano reciprocamente.

## Failure domain

Un **failure domain** è un insieme di elementi che possono essere coinvolti dallo stesso evento di failure.

Se dieci servizi girano sulla stessa macchina, quella macchina è un failure domain.

Se tutti dipendono dallo stesso database, il database può diventare un failure domain condiviso.

Se due region usano la stessa configurazione errata distribuita automaticamente, la separazione geografica potrebbe non proteggerci dal failure logico.

Se tutti i servizi dipendono dallo stesso identity provider, quell'integrazione può essere un failure domain trasversale.

Il punto non è soltanto capire **che cosa può fallire**.

È capire **che cosa può fallire insieme**.

## Correlated failure

Molte architetture sembrano resilienti finché assumiamo failure indipendenti.

Due istanze possono sembrare ridondanti.

Ma se condividono lo stesso processo di deploy o la stessa configurazione, la stessa image corrotta, la stessa availability zone, lo stesso database o perfino la stessa quota, possono fallire contemporaneamente.

La ridondanza fisica non implica indipendenza del failure.

> **Due copie dello stesso errore non sono alta disponibilità.**

## Blast radius

Il failure domain è strettamente collegato al blast radius.

Una modifica di configurazione centrale può avere blast radius enorme.

Una feature flag limitata a un tenant può averlo piccolo.

Un deployment globale simultaneo aumenta il numero di utenti esposti allo stesso errore.

Un rollout progressivo lo riduce.

Un permission model troppo ampio per un agente può trasformare un task locale in un rischio repository-wide.

Pensare per failure domain significa quindi anche progettare **contenimento**.

## Failure domain logici

Non tutti i failure domain sono infrastrutturali.

Immaginiamo che tutti i servizi interpretino uno stesso campo `status` attraverso una libreria condivisa.

Un bug nella libreria può propagarsi ovunque.

Oppure tutti gli agenti usano lo stesso documento architetturale obsoleto.

La documentazione errata diventa un failure domain cognitivo.

Questo è particolarmente importante nei repository AI-ready.

Una source of truth centrale è potente.

Ma se è sbagliata, può distribuire l'errore con grande efficienza.

Per questo source of truth e review devono andare insieme.

## Order Operations: failure domain iniziali

Per il nostro caso possiamo già identificare alcuni domini di failure:

```text
Support UI
Orders API
Order database
Identity provider
Network path
Deployment/configuration
```

Se scegliessimo un read model separato, ne introdurremmo altri:

```text
event publication
consumer
projection storage
lag
rebuild process
```

Questo non significa che il read model sia una cattiva idea.

Significa che una decisione architetturale cambia anche la topologia dei failure mode.

La domanda non è soltanto:

> “Quanto è elegante?”

Ma:

> **“Quali failure introduce, quali elimina e quali rende più facili da contenere?”**

## Disegnare il fallimento

Per ogni componente o journey importante possiamo chiedere:

- che cosa succede se non risponde?
- che cosa succede se risponde lentamente?
- che cosa succede se restituisce dati sbagliati?
- che cosa succede se restituisce dati vecchi?
- che cosa succede se riceviamo due volte lo stesso input?
- che cosa succede se l'ordine degli eventi cambia?
- che cosa può fallire insieme a lui?
- qual è il blast radius?
- come ce ne accorgiamo?
- come recuperiamo?

Queste domande non servono a progettare paranoia.

Servono a evitare che il happy path venga scambiato per il sistema.

> **L'architettura non è completa finché conosciamo soltanto come funziona. Dobbiamo sapere anche come smette di funzionare.**
