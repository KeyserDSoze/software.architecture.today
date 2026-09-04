## Dalla qualità desiderata alla qualità misurabile

I requisiti non funzionali vengono spesso trattati come una lista standard: performance, scalability, availability, security, maintainability, cost. Il problema è che conoscere le categorie non ci dice ancora quali qualità cambino davvero il successo o il rischio del sistema che stiamo progettando.

Un motore di trading e un backoffice amministrativo possono entrambi avere un requisito di performance, ma non per questo devono essere ottimizzati allo stesso modo. In un pagamento, evitare duplicazioni e perdita di transazioni può contare molto più della latency media; in un sito editoriale, disponibilità e capacità di assorbire picchi possono dominare il design. Per un tool interno usato da poche persone, una sofisticata piattaforma di autoscaling può costare più valore di quanto restituisca.

La domanda utile è quindi:

> **Quali proprietà di qualità cambiano materialmente le decisioni, il rischio o l'outcome di questo sistema?**

Le categorie che seguono non sono una checklist da compilare. Sono modi diversi di rendere quella domanda concreta.

## Performance: il journey viene prima della media

La latency descrive il tempo necessario a produrre una risposta osservabile, ma una media può nascondere un'esperienza pessima nella coda della distribuzione. Per questo spesso ragioniamo in percentile:

```text
p50 < 100 ms
p95 < 300 ms
p99 < 800 ms
```

Questi numeri non sono buoni in assoluto. Diventano utili quando appartengono a un journey, a un workload e a una condizione di misura espliciti.

La stessa distinzione vale tra latency del componente e latency end-to-end. Ottimizzare un servizio a 20 ms non cambia molto se una dipendenza esterna domina il percorso con tre secondi di attesa. La quality attribute appartiene al comportamento che vogliamo proteggere, non alla metrica più facile da raccogliere.

Throughput e capacity completano il quadro. Dire che il sistema “supporta 1.000 richieste al secondo” ha senso soltanto se sappiamo con quale mix di operazioni, dataset, durata e target di latency. Un sistema che processa quel volume facendo esplodere il p99 non ha necessariamente soddisfatto il requisito.

## Availability non basta se il sistema risponde male

Availability riguarda la capacità di offrire il servizio richiesto, ma il numero globale può essere fuorviante. La pagina pubblica, un pagamento e un report amministrativo possono avere tolleranze completamente diverse. Progettare tutto secondo il journey più severo può moltiplicare costi senza aumentare valore.

Reliability e correctness aggiungono una distinzione essenziale: un sistema può essere sempre raggiungibile e produrre risultati sbagliati. Un pagamento duplicato, un ordine mostrato al tenant sbagliato o un workflow eseguito due volte sono failure anche se ogni chiamata restituisce `200 OK`.

In alcuni domini, quindi, essere temporaneamente indisponibili è preferibile a essere disponibili in uno stato semanticamente incerto.

## Consistency e freshness

Quando esistono più copie o rappresentazioni dello stesso fatto, dobbiamo decidere quanto possano divergere e per quanto tempo. “Eventually consistent” non significa “prima o poi andrà bene”. Anche l'eventual consistency ha bisogno di un profilo accettabile.

Per esempio:

> Gli aggiornamenti di stato dell'ordine devono diventare visibili nella vista operatore entro 30 secondi nel 99% dei casi.

Una frase così cambia design e verifica: eventi, polling, retry, monitoraggio e recovery possono essere valutati rispetto a una proprietà osservabile. La domanda non è se accettiamo eventual consistency come etichetta architetturale, ma quale freshness il journey possa tollerare senza produrre una decisione sbagliata.

## Durability e recovery

Durability riguarda la capacità di conservare nel tempo un dato considerato acquisito. È diversa dalla availability: un database può essere temporaneamente irraggiungibile senza aver perso nulla oppure essere online dopo una perdita non ancora rilevata.

Per dati economicamente o legalmente importanti, replica, backup, restore, retention, corruzione e cancellazione accidentale diventano parte del design. Ma nessuna di queste protezioni è credibile soltanto perché configurata. Un backup che non è mai stato ripristinato conserva un'ipotesi, non ancora una prova di recovery.

RTO e RPO trasformano questa discussione in una decisione sul tempo di ripristino e sulla perdita tollerabile. Li approfondiremo nella sezione successiva.

## Operability: chi pagherà la complessità

Un sistema può essere elegante e difficile da possedere. Operability riguarda il modo in cui viene distribuito, osservato, diagnosticato, aggiornato e recuperato. Include rollback, alert, runbook, competenze specialistiche, maintenance delle dipendenze e capacità di distinguere rapidamente un errore applicativo da una dipendenza degradata.

Questa qualità è architetturale perché ogni componente aggiuntivo crea anche una responsabilità operativa. Una soluzione che soddisfa throughput e latency ma richiede un operating model che il team non può sostenere non ha un buon fit.

## Maintainability e changeability

Non tutto ciò che conta si esprime bene con una singola metrica. Possiamo però usare invarianti e scenari osservabili.

Per esempio:

```text
una modifica al provider di pagamento non deve richiedere modifiche al dominio Orders
una nuova regola di autorizzazione deve poter essere testata senza avviare l'intero stack
una modifica al contratto pubblico deve avere una strategia di compatibilità
```

Queste condizioni descrivono la forma del cambiamento che vogliamo rendere possibile. Non sono percentili, ma discriminano comunque tra design differenti.

## Security e privacy

“Sicuro” non è più utile di “veloce”. Dobbiamo sapere quali asset proteggiamo, da chi, attraverso quali trust boundary e con quali permessi. Dobbiamo distinguere dati sensibili, azioni auditabili e rischio residuo accettato.

Un requisito come “i dati personali devono essere protetti” esprime un'intenzione importante, ma per guidare il design va tradotto in comportamenti, boundary e controlli verificabili.

## Cost è una proprietà del sistema

Se una soluzione soddisfa tutti i target tecnici ma costa dieci volte il budget disponibile, non è una soluzione valida. Il costo comprende infrastruttura, licenze, traffico, storage, osservabilità e backup, ma anche personale, on-call, formazione, migrazione e lock-in.

Per questo non ottimizziamo tutte le quality attribute. Costruiamo un profilo di qualità coerente con il prodotto e dichiariamo quali dimensioni non meritano, oggi, il prossimo incremento di complessità.

> **Un'architettura è credibile quando sa dire non soltanto che cosa ottimizza, ma anche che cosa ha deciso di non ottimizzare.**
