## Compatibility: progettare per il cambiamento

un'API utile cambia.

Nuovi campi arrivano.

Nuove capability vengono aggiunte.

Alcuni comportamenti diventano obsoleti.

Il problema non è impedire il cambiamento.

È evitare che ogni cambiamento richieda una migrazione simultanea di tutti i consumer.

> **Un contratto evolvibile riduce il bisogno di coordinamento temporale.**

### Breaking change

Una breaking change non è soltanto un URL diverso.

Può essere:

- rimuovere un campo;
- cambiarne il tipo;
- rendere obbligatorio un campo prima opzionale;
- cambiare il significato di un valore;
- modificare una regola di ordering;
- cambiare la semantica di un errore;
- ridurre un limite;
- cambiare default;
- introdurre una nuova autorizzazione necessaria;
- modificare timing o consistency in modo osservabile.

Un contratto può restare sintatticamente valido e diventare semanticamente incompatibile.

### Additive non significa sempre innocuo

Aggiungere un campo JSON spesso è compatibile quando i client ignorano proprietà sconosciute.

Azure Architecture Center usa proprio questo come esempio di modifica che può essere backward compatible, mentre rimuovere campi può rompere client esistenti.

Fonte:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)

Ma “aggiungere” non è sempre innocuo.

Aggiungere un enum value può rompere un consumer che implementa uno switch esaustivo senza fallback.

Aggiungere risultati a una collection può cambiare assunzioni di pagination.

Aggiungere un nuovo side effect a un'operazione esistente è chiaramente una modifica semantica.

La compatibility deve essere letta dal punto di vista del consumer.

### Versionare è una tecnica, non la strategia completa

Possiamo versionare con:

```text
/v1/orders
```

oppure media type, header o altre convenzioni.

La scelta del meccanismo conta meno di alcune domande:

- che cosa costituisce una versione?
- quanto supportiamo la precedente?
- come annunciamo deprecation?
- come misuriamo chi la usa ancora?
- possiamo migrare i consumer gradualmente?
- esistono client fuori dal nostro controllo?

Microsoft sottolinea che il versioning consente a client differenti di usare versioni differenti, ma ogni approccio porta trade-off.

Fonte:

- [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design)

### Compatibilità prima del versioning

Un errore frequente è usare nuove major version troppo presto.

Se possiamo aggiungere una capability mantenendo compatibilità, spesso è preferibile farlo.

Ogni versione parallela introduce costo:

```text
code path
+ test
+ documentation
+ monitoring
+ security fixes
+ support
+ deprecation
```

Versionare non elimina il costo del cambiamento.

Lo distribuisce nel tempo.

### Consumer-driven thinking

Prima di cambiare un contratto chiediamo:

1. chi consuma questa parte?
2. quali assunzioni osservabili fa?
3. possiamo vedere il traffico dei consumer?
4. esistono consumer sconosciuti?
5. quale finestra di migrazione è realistica?

un'API interna con tre consumer nello stesso repository è diversa da un'API pubblica usata da migliaia di integrazioni.

Il livello di governance deve essere proporzionato al blast radius.

### Schemi e code generation

OpenAPI, JSON Schema, Protocol Buffers e GraphQL schema possono rendere il contratto machine-readable.

Questo abilita:

- code generation;
- validation;
- compatibility check automatizzati;
- documentazione;
- contract testing;
- linting.

Ma uno schema non descrive automaticamente tutta la semantica.

Questo:

```yaml
status:
  type: string
```

non ci dice:

- quali transizioni sono valide;
- chi può cambiarlo;
- quanto è fresco;
- cosa succede durante una failure.

Per questo il nostro `API Contract` conterrà schema **e** significato.

### Deprecation come lifecycle

Una deprecation utile ha almeno:

- ciò che viene deprecato;
- alternativa;
- data o condizione di rimozione;
- consumer coinvolti;
- telemetria sull'uso;
- owner della migrazione.

Senza queste informazioni “deprecated” può significare semplicemente “nessuno osa toccarlo”.

### Compatibility budget

Possiamo pensare alla compatibilità come a un budget di coordinamento.

Più consumer indipendenti abbiamo, più una breaking change costa.

Più il contratto è pubblico, persistente o asincrono, più quel costo aumenta.

Per questo:

> **l'evolvibilità di un'API è parte dell'architettura del sistema, non manutenzione futura da lasciare a chi verrà dopo.**