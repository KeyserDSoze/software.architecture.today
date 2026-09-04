# Book Manifesto — Software Architecture Today

## Perché questo libro esiste

L'AI sta rendendo più economica una parte crescente dell'execution software.

Questo cambia il lavoro di developer, tech lead e architect, ma non nel modo più superficiale.

Il problema interessante non è stabilire se un modello riesca a scrivere una funzione, un test o una configurazione cloud. Il problema è capire che cosa succede alla professione quando produrre artefatti diventa più veloce della nostra capacità di comprenderne tutte le conseguenze.

Il libro parte da qui:

> **Il software non è diventato facile. È diventato più facile produrre software.**

E sviluppa una tesi conseguente:

> **Nell'era dell'AI il codice costa meno, ma le decisioni sbagliate costano di più.**

## La promessa al lettore

Questo libro non promette di insegnare “l'architettura corretta”.

Promette qualcosa di più utile: aiutare il lettore a formulare domande migliori, rendere espliciti i trade-off, riconoscere i failure mode e costruire un metodo con cui prendere decisioni tecniche sotto vincoli reali.

Alla fine del percorso il lettore dovrebbe essere più capace di rispondere a domande come:

- quale problema stiamo realmente risolvendo?
- quali decisioni sono architetturalmente significative?
- quali requisiti non funzionali contano davvero?
- quando una soluzione semplice è sufficiente?
- quando la distribuzione è giustificata?
- quali failure mode abbiamo creato con la nostra scelta?
- come verifichiamo un sistema senza rieseguire manualmente tutto?
- quali decisioni possiamo delegare a un agente e quali richiedono un gate?
- come costruiamo repository e documentazione che funzionino come contesto operativo?
- come cambiano software engineering e architecture quando una singola persona può governare molto più lavoro di prima?

## Pubblico

Il libro parla a più livelli di esperienza:

- junior developer che vuole imparare a vedere oltre il singolo task;
- developer che vuole comprendere il sistema, non soltanto il proprio componente;
- senior developer e tech lead che devono prendere decisioni e guidare altri;
- cloud, platform e DevOps engineer che vogliono collegare infrastruttura e prodotto;
- software architect che cerca un metodo pragmatico, non un catalogo di diagrammi;
- engineering manager che vuole capire il rapporto tra decisioni tecniche, rischio e capacità di execution.

Non richiede che tutti diventino specialisti di tutto.

Promuove invece una forma di **profondità con visione sistemica**: essere molto competenti in almeno alcune aree e sufficientemente alfabetizzati nelle altre da riconoscere dipendenze, rischi e momenti in cui serve coinvolgere uno specialista.

## Posizione editoriale

Il libro prende posizione contro alcuni automatismi.

Non considera i microservizi più maturi di un monolite.

Non considera il cloud-native automaticamente appropriato.

Non considera un design pattern una risposta prima che esista una domanda.

Non considera una demo una prova di production readiness.

Non considera molti test una prova di confidenza.

Non considera più autonomia degli agenti automaticamente migliore.

Non considera più documentazione automaticamente migliore.

Non considera una soluzione più economica automaticamente migliore se riduce una proprietà che il workload deve garantire.

Non considera l'AI una ragione per conoscere meno software engineering.

Il libro preferisce domande come:

> Quale problema risolve?

> Quale costo introduce?

> Come può fallire?

> Come lo sappiamo?

## Principi ricorrenti

### Prima capire, poi costruire

La capacità di generare rapidamente software rende più costoso partire da una comprensione debole.

### Prima sincronizzare il pensiero, poi parallelizzare l'esecuzione

Più agenti non compensano un contesto incoerente. Lo moltiplicano.

### Delegare execution, non responsabilità

La provenienza artificiale di un output non riduce l'accountability professionale di chi lo porta in produzione.

### Pilota, non copilota

L'AI può proporre, implementare, testare e criticare. Direzione, giudizio e decisione restano al professionista.

### Documentation is part of the architecture

La documentazione che esplicita decisioni, confini, contratti e criteri di verifica è parte del sistema operativo del progetto.

### Un diagramma non è l'architettura

L'architettura vive nelle decisioni, nei trade-off, nei confini, nei contratti, nei dati, nei failure mode, nel deployment, nella sicurezza e nella capacità di evolvere.

### Failure before confidence

Ogni soluzione importante deve essere letta anche dalla prospettiva del fallimento.

### Verification without re-execution

La supervisione non può significare rifare manualmente tutto. Servono test, invarianti, contratti, static analysis, diff, observability, canary e review indipendenti.

### Giocare fuori ruolo

La specializzazione rimane utile. I silos cognitivi no.

### Non usare l'AI per sembrare più senior. Usarla per diventarlo.

Delegare execution può aumentare la capacità. Delegare reasoning senza comprenderlo produce deskilling.

## Stile

Il tono deve essere:

- diretto;
- tecnico;
- pragmatico;
- leggibile;
- non accademico quando non serve;
- non promozionale;
- disposto a dire “dipende” soltanto quando spiega da cosa dipende.

Il testo deve alternare:

- intuizione;
- meccanica;
- decisione;
- trade-off;
- failure mode;
- impatto dell'AI;
- caso reale documentato;
- caso simulato/composito;
- esercizio;
- artefatto operativo.

## Casi e fonti

Un caso reale deve essere realmente documentato.

Quando raccontiamo un'azienda, un incidente o una scelta tecnica, il claim deve restare proporzionato a ciò che la fonte sostiene.

Un esempio inventato deve essere dichiarato simulato/composito.

Il libro non userà architetture “di Netflix”, “di Amazon” o “di Uber” raccontate per tradizione orale tecnica senza una fonte primaria o attendibile.

Le fonti preferite saranno standard, RFC, documentazione ufficiale, paper, postmortem, engineering blog dell'organizzazione coinvolta e testi tecnici riconosciuti.

## Tecnologia

Il libro è language-agnostic e cloud-agnostic nei principi.

Quando serve codice, TypeScript è la scelta predefinita. C# viene usato quando rende più chiaro il concetto o quando il contesto .NET/Azure è particolarmente utile.

Azure potrà comparire spesso negli esempi, senza trasformare il libro in un manuale Azure.

Lo stesso vale per AWS, Google Cloud, Kubernetes, PostgreSQL e qualsiasi altro prodotto: sono implementazioni di decisioni, non il centro narrativo.

## Il ruolo dell'AI nel libro

Il libro non sarà costruito attorno al modello del momento.

Parlerà di capability e workflow:

- coding agents;
- specialist agents;
- orchestrazione;
- context engineering;
- permissions;
- verification;
- stop conditions;
- autonomy levels;
- AI dentro i sistemi software;
- AI-specific failure e security mode.

Gli strumenti cambieranno. I problemi di responsabilità, confine, verifica e rischio resteranno più a lungo.

## Gli artefatti

Come nel progetto precedente, gli artefatti operativi non saranno una checklist burocratica.

Saranno un vocabolario di rischi e controlli da attivare quando servono.

Il vocabolario iniziale include:

```text
Problem & Outcome Brief
Architecture Context Map
Functional Scope Map
Non-Functional Requirements Card
Architecture Decision Record
System Context Map
Component Responsibility Map
API Contract
Data Ownership Map
Failure Mode Map
Threat Model
Cloud Deployment Map
Observability Contract
Testing Strategy
Refactoring Safety Plan
Architecture Fitness Checklist
Cost Model
Agent Delegation Contract
Agent Verification Bundle
AI Autonomy Matrix
Operational Readiness Review
Production Readiness Review
```

Il vocabolario verrà raffinato durante la scrittura e validato attraverso i capitoli, non imposto a priori.

## La chiusura

I **Dieci comandamenti della Software Architecture nell'era dell'AI** non saranno usati come impalcatura del libro.

Arriveranno soltanto nell'ultimo capitolo e nell'ultima parte di quel capitolo.

Il lettore dovrà incontrarli dopo aver già discusso decisioni, sistemi distribuiti, dati, security, cloud, failure, agenti, costi e produzione.

Solo allora potranno funzionare come devono: una sintesi riconoscibile, seria nella sostanza ma con un tono volutamente goliardico.

L'ultima sensazione del libro non deve essere quella di una checklist.

Deve essere quella di rimettere le mani sul timone.
