## Scegliere il modello dai pattern di accesso

Una volta chiarita l’ownership, arriva una domanda inevitabile: **come dobbiamo memorizzare e interrogare questo dato?** La tentazione è rispondere con un prodotto. “PostgreSQL o MongoDB?” è una domanda familiare, ma arriva troppo presto.

Microsoft Azure Architecture Center suggerisce di valutare access pattern, relazioni, consistency, concorrenza, lifecycle, latency, scale, governance e cost prima di scegliere un data store.

Fonti:

- [Microsoft Learn — Prepare to choose a data store](https://learn.microsoft.com/azure/architecture/guide/technology-choices/data-stores-getting-started)
- [Microsoft Learn — Understand data models](https://learn.microsoft.com/azure/architecture/data-guide/technology-choices/understand-data-store-models)

La domanda utile diventa quindi: **quali access pattern e invarianti dobbiamo servire, e quale modello li sostiene con il miglior fit complessivo?**

## Quando il modello relazionale coincide con il problema

Per molti workload operativi, le relazioni non sono un incidente dello schema: sono parte del dominio. Order, Payment, Shipment, OperatorAssignment, Tenant e AuditEvent non sono semplicemente documenti indipendenti; tra loro esistono vincoli, ownership e transazioni che il sistema deve proteggere.

In questo contesto un modello relazionale rimane un candidato forte perché offre relazioni esplicite, vincoli di integrità, transazioni, query articolate e tooling maturo. Microsoft cita proprio workload come order management, inventory, billing e operational reporting tra gli esempi naturali per modelli relazionali.

Questo non significa che “gli ordini devono stare in SQL”. Significa che il modello deve pagare bene le forze presenti. Se un assignment appartiene a un ordine, un ordine a un tenant e una transizione deve rispettare un invariant, il modello relazionale parte con un fit credibile.

## Document store: flessibilità quando l’aggregato è davvero l’unità naturale

Un document store può avere molto senso quando il principale pattern di accesso riguarda aggregati letti e scritti come unità relativamente autonome. Un catalog item con attributi variabili o un profilo con sezioni opzionali possono adattarsi bene a questa forma.

La flessibilità dello schema, però, non elimina la semantica. Se tre consumer interpretano lo stesso campo in modi diversi, il fatto che viva in JSON non ci ha resi più flessibili: ci ha soltanto resi meno espliciti. Anche in un document database lo schema esiste; può essere imposto più dall’applicazione che dal motore, ma deve comunque essere progettato.

## Key-value: specializzazione utile quando la domanda è semplice

Un key-value store è potente proprio perché restringe il problema a una forma simile a:

```text
key → value
```

Session state, deduplication key, rate-limit counter, cache entry e alcuni lookup ad alta frequenza possono beneficiarne. La specializzazione diventa invece un limite quando il workload richiede continuamente join, filtri dinamici, traversal fra relazioni o aggregazioni complesse.

La domanda non è se il key-value store sia veloce. È se il nostro workload assomigli davvero a una lookup per chiave.

## Graph: quando la relazione è la query

Un graph database diventa interessante quando percorsi e connessioni sono il centro della domanda: account collegati a device, payment method e merchant; componenti collegati da dipendenze e ownership; reti di relazione in cui il traversal multi-hop è un’operazione primaria.

In questi casi un graph model può essere più naturale di join complessi o denormalizzazioni crescenti. Ma Order Operations non ha oggi un problema di questo tipo abbastanza forte da giustificare un graph database. Conoscere il modello ci dà un’opzione, non un obbligo.

## Store specializzati: quando un access pattern diventa abbastanza diverso

Search index, time-series store e vector store esistono perché alcuni workload sono sufficientemente specifici da meritare strutture differenti. Full-text search e ranking, finestre temporali su telemetria o similarity search sugli embedding sono problemi reali con proprietà proprie.

Il rischio è trasformare ogni nuovo access pattern in un nuovo datastore. Microsoft osserva che sistemi reali possono usare più modelli, ma il valore emerge quando access pattern o lifecycle divergono davvero. La parola importante è **davvero**.

## Polyglot persistence: specializzazione in cambio di una tassa operativa

Un sistema può usare PostgreSQL come source of truth transazionale, un search index per la ricerca testuale, object storage per documenti e un warehouse per analytics. Non c’è nulla di sbagliato in questa topologia se ogni store svolge un lavoro specifico.

Il costo, però, continua dopo l’adozione. Ogni nuovo datastore porta provisioning, access control, backup e recovery, observability, data movement, schema evolution, failure mode, competenze e costi da possedere. **Polyglot persistence è utile quando la specializzazione del workload paga questa tassa operativa.**

## L’access pattern viene prima dello schema

Prendiamo la lista futura degli ordini problematici. Potremmo dover leggere per tenant, ordinare per anzianità, filtrare per categoria, mostrare ciò che è assegnato a un operatore e aprire il dettaglio per `orderId`. Queste domande influenzano index, ordering, pagination, eventuale denormalizzazione e forma del read model.

Se domani arrivasse invece il requisito “cerca qualsiasi frase nelle conversazioni del customer support associate agli ordini”, sarebbe cambiato l’access pattern. A quel punto potrebbe emergere un search index. Non perché il prodotto è diventato abbastanza maturo da meritare una nuova tecnologia, ma perché è cambiata la domanda.

## Il test di fit del datastore

Per i datastore non banali manteniamo una piccola scheda operativa:

```text
Access pattern
Quali query o write dominano?

Consistency
Quale staleness o atomicità è accettabile?

Relationships
Quali relazioni devono essere navigate o vincolate?

Scale
Quali volumi e growth pattern sono reali o stimati?

Lifecycle
Retention, archival, deletion, rebuild?

Security
Quali dati e quali boundary di accesso?

Operations
Il team sa gestire questa tecnologia?

Cost
Che costo fisso e variabile introduce?

Exit
Come migriamo se il fit cambia?
```

La scheda non produce automaticamente una risposta. Serve a rendere difficile scegliere una tecnologia perché è popolare, nuova o presente nella reference architecture di qualcun altro.

## ESI: PostgreSQL resta perché il contesto non è cambiato abbastanza

Nel contesto corrente di Order Operations non esiste ancora un access pattern che giustifichi un secondo datastore operativo. Il modello relazionale sostiene bene dati strutturati, assignment, audit, relazioni, access control e le query oggi note.

Questo non significa che PostgreSQL sarà l’unico store per sempre. Significa che **oggi la complessità di aggiungerne un altro non è ancora pagata da un requisito reale**.

Quando cambieranno access pattern, scale o lifecycle, rivaluteremo. Non prima.