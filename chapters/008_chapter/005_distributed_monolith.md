## Il distributed monolith

Il **distributed monolith** è una delle topologie più costose da possedere perché combina molti costi della distribuzione con poca autonomia reale.

Può avere molti repository, molti deployable, molte pipeline e una grande quantità di traffico di rete.

E continuare comunque a richiedere coordinamento quasi totale.

Il problema non è il numero di servizi.

È che la separazione fisica non ha prodotto separazione decisionale.

## Distribuire prima dei confini

Il distributed monolith nasce spesso quando rendiamo operativo un boundary prima di averlo reso credibile semanticamente.

Disegniamo:

```text
Orders Service
Payments Service
Shipping Service
```

ma poi scopriamo che i tre servizi condividono schema dati, domain object e regole; devono essere rilasciati nella stessa finestra; una feature richiede modifiche coordinate in tutti e tre; le chiamate sincrone sono profonde e i test end-to-end sono l'unico modo per sapere se il sistema funziona.

Abbiamo distribuito la topologia.

Non abbiamo distribuito l'autonomia.

In questo stato ogni network boundary aggiunge latency, failure mode e costi operativi senza ridurre davvero il coupling che volevamo eliminare.

## Il database può essere il vero contratto

Un database condiviso non rende automaticamente il sistema un distributed monolith.

Durante una migrazione o in alcuni contesti può essere una scelta temporanea ragionevole.

Il segnale pericoloso è un altro: più servizi leggono e modificano direttamente le stesse tabelle senza ownership distinta.

In quel caso il contratto reale non è più l'API.

È lo schema fisico.

Cambiare una colonna o un'invariante può richiedere coordinamento fra consumer che il servizio owner nemmeno conosce completamente.

Possiamo condividere un'istanza database e mantenere ownership logica per schema o tabella. È molto diverso da permettere a ogni servizio di trattare tutti i dati come propri.

Quando l'obiettivo è autonomia, la sovranità del dato conta più del numero di database server.

La documentazione Microsoft sui microservizi esplicita proprio questa tensione: servizi che condividono lo stesso datastore finiscono per accoppiarsi allo schema sottostante e rendono più difficile l'evoluzione indipendente: [Microsoft Learn — Data considerations for microservices](https://learn.microsoft.com/azure/architecture/microservices/design/data-considerations).

## La shared library può diventare una rete invisibile

Il coupling non passa soltanto dal database.

Una libreria condivisa può trasformarsi nel bus nascosto del sistema.

Se un package comune contiene DTO, domain object, validation, persistence model e business rule, ogni servizio che lo importa eredita implicitamente lo stesso ciclo di evoluzione. Una modifica alla libreria può costringere a upgrade coordinati e rendere impossibile capire chi possieda davvero il significato.

Abbiamo spostato il coupling dalla rete al package manager.

Le shared library sono preziose per capacità realmente generiche e stabili. Diventano pericolose quando condividono **semantica di dominio che dovrebbe avere un owner**.

Microsoft include proprio la condivisione di common library e dependency tra microservizi fra gli antipattern che possono creare tight coupling: [Microsoft Learn — Microservices architecture style](https://learn.microsoft.com/azure/architecture/microservices/).

## La rete può mantenere il sistema sincrono come prima

Un'altra forma di coupling appare quando per completare un journey dobbiamo attraversare una catena profonda:

```text
A → B → C → D → E
```

Ogni hop aggiunge latency e probabilità di failure, un timeout da governare, tracing da ricostruire e una dependency di capacity.

Se tutti i servizi devono essere disponibili nello stesso momento, il sistema può essere molto distribuito e continuare a comportarsi come una singola unità di failure.

Questo non significa che ogni catena sincrona sia sbagliata.

Significa che quando una feature richiede coordinamento così stretto dobbiamo verificare se abbiamo separato componenti che, dal punto di vista delle forze reali, operano ancora come un'unità.

## Il deploy racconta la verità

Un test molto semplice consiste nell'osservare come avvengono i rilasci.

Se per quasi ogni feature dobbiamo fare:

```text
release A
release B
release C
```

nella stessa finestra, con ordine e compatibilità rigidamente coordinati, la deployability indipendente non è ancora reale.

Durante una migrazione questo può essere normale.

Se rimane la condizione permanente, il servizio separato non ha comprato la proprietà per cui probabilmente era stato introdotto.

La stessa verifica vale per incidenti e dati. Se un guasto locale attiva sempre una war room con tutti i team e se una modifica di schema richiede sempre una campagna cross-repository, i confini nominali stanno nascondendo dipendenze sistemiche.

## Distributed monolith e AI

Gli agenti rendono questa topologia ancora più facile da creare.

In poco tempo possono generare servizi, Dockerfile, manifest, API client, pipeline e tracing. Possono persino produrre una migrazione che compila e passa i test.

La forma distribuita appare completa.

Ma nessuna generazione di infrastruttura dimostra che i boundary siano autonomi.

Dobbiamo verificare proprietà che il diff non può certificare da solo: se i servizi possano evolvere e essere rilasciati indipendentemente, se possiedano davvero i propri dati, se una failure possa essere contenuta e se una modifica locale rimanga locale.

Se la risposta è quasi sempre no, il numero di container non sta creando rendimento architetturale.

## Il test dell'autonomia

Prima di celebrare una decomposizione possiamo porre poche domande dure.

Se cambiamo l'implementazione interna di A, B deve modificarsi? Se rilasciamo A, dobbiamo coordinare B e C? Se il database di A evolve, chi altro deve conoscere lo schema? Se A è down, il journey può degradare in modo sensato? Se un team possiede A, può davvero operarlo senza dipendere sistematicamente da altri team?

Queste domande sono più informative del conteggio dei servizi.

> **Microservizi senza autonomia sono distribuzione senza rendimento.**

Prima di contare i container, contiamo le dipendenze che continuano a richiedere coordinamento.