## Compatibility: progettare per cambiare senza muoversi tutti insieme

Un'API utile cambia.

Arrivano nuovi campi e nuove capability. Alcuni comportamenti vengono corretti, altri deprecati. Cambiano requisiti di sicurezza, limiti, performance e perfino interpretazioni del dominio.

Il problema non è impedire il cambiamento.

È impedire che ogni cambiamento richieda una migrazione simultanea di tutti i consumer.

> **La compatibility è una strategia per ridurre il coordinamento temporale.**

Questa proprietà diventa tanto più preziosa quanto più i consumer sono indipendenti dal provider.

## Una breaking change può lasciare intatto lo schema

Rimuovere un campo o cambiarne il tipo è chiaramente rischioso.

Ma molte incompatibilità sono più sottili.

Rendere obbligatorio ciò che prima era opzionale può rompere richieste esistenti. Cambiare il significato di un enum può lasciare il JSON perfettamente valido e rendere sbagliato il comportamento del client. Modificare l'ordering di default, ridurre un limite, introdurre una nuova authorization requirement o passare da dati live a una proiezione con trenta secondi di ritardo può cambiare ciò che il consumer osserva senza modificare apparentemente la struttura del payload.

Un contratto può quindi rimanere sintatticamente compatibile e diventare semanticamente incompatibile.

Questo è il motivo per cui la review non può fermarsi allo schema diff.

## Anche una modifica additiva può avere blast radius

Aggiungere un campo JSON è spesso backward compatible quando i consumer ignorano proprietà sconosciute. Azure Architecture Center usa proprio questo come esempio di evoluzione potenzialmente compatibile, in contrasto con la rimozione di informazioni su cui i client possono dipendere: [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design).

Ma “additivo” non significa automaticamente innocuo.

Un nuovo valore di enum può rompere uno switch esaustivo. Nuovi elementi in una collection possono violare assunzioni su cardinalità o pagination. Un nuovo side effect dentro un'operazione esistente è una modifica semantica anche se request e response sono identiche.

La domanda utile è quindi:

> **Che cosa potrebbe aver ragionevolmente assunto un consumer del contratto precedente?**

La compatibilità va valutata da quella prospettiva, non soltanto dalla nostra intenzione di provider.

## Versioning è un meccanismo di convivenza

Quando una modifica incompatibile è necessaria possiamo introdurre una nuova versione:

```text
/v1/orders
/v2/orders
```

oppure usare header, media type o altre convenzioni.

Il meccanismo conta.

Ma non è la strategia completa.

La vera decisione è quanto a lungo due contratti debbano convivere, come i consumer scoprano la nuova versione, come venga comunicata la deprecation e come sappiamo chi stia ancora usando quella precedente.

Microsoft sottolinea che il versioning permette a client differenti di adottare versioni differenti, ma ogni approccio introduce trade-off propri: [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design).

In altre parole, versionare non elimina il costo della breaking change.

Lo distribuisce nel tempo.

## Prima provare a evolvere compatibilmente

Creare una nuova major version per ogni cambiamento può sembrare prudente.

In realtà moltiplica code path, test, documentazione, monitoring, security fix, supporto e processi di deprecation.

Se una capability può essere introdotta in modo backward compatible, spesso è meno costoso farla evolvere nello stesso contratto.

La versione parallela diventa utile quando la compatibilità non è ragionevolmente preservabile o quando mantenere la vecchia semantica renderebbe il nuovo modello troppo ambiguo.

Quindi la sequenza sana è:

```text
cambiamento richiesto
→ possiamo mantenerlo compatibile?
→ se no, quale convivenza serve?
→ versioning
→ migrazione
→ deprecation
→ rimozione
```

non:

```text
qualcosa cambia
→ nuova v2
```

## Il blast radius dipende dai consumer

Un'API usata da tre consumer nello stesso monorepo non richiede la stessa governance di un'API pubblica usata da migliaia di integrazioni.

Prima di cambiare un contratto dobbiamo sapere chi ne dipenda, quali versioni siano ancora attive e quanto possiamo osservare il traffico reale. Dobbiamo anche considerare consumer che non controlliamo o che non conosciamo direttamente.

Più ownership e release cadence divergono, più una breaking change diventa costosa.

Questo è un **compatibility budget**: ogni dipendenza esterna riduce la libertà di cambiare unilateralmente il contratto.

Non significa che le API pubbliche non debbano evolvere.

Significa che il costo del coordinamento è parte dell'architettura.

## Gli schemi rendono visibile una parte della promessa

OpenAPI, JSON Schema, Protocol Buffers e GraphQL schema rendono una parte importante del contratto machine-readable.

Questo abilita code generation e validation, schema diff, linting, documentazione e contract test. Possiamo automatizzare la scoperta di campi rimossi, tipi cambiati o nuove required property.

Ma uno schema come:

```yaml
status:
  type: string
```

non racconta chi possa cambiare lo status, quali transizioni siano valide, quanto il valore sia fresco o se un nuovo enum value richieda un comportamento diverso nel consumer.

La machine-readable spec protegge bene la forma.

La semantica deve continuare a essere governata.

Per questo l'API Contract del capitolo conterrà entrambe.

## Deprecation è un processo, non un'etichetta

Scrivere `deprecated: true` non sposta automaticamente nessun consumer.

Una deprecation credibile deve dire che cosa venga sostituito, quale alternativa esista e quale data o condizione governi la rimozione. Servono visibilità sui consumer coinvolti, telemetria sull'uso e ownership della migrazione.

Senza queste informazioni “deprecated” può significare semplicemente “vecchio ma ancora troppo rischioso da rimuovere”.

La deprecation chiude quindi il ciclo di evoluzione:

```text
introduci
→ osserva adozione
→ migra
→ verifica uso residuo
→ rimuovi
```

## Progettare per la seconda versione

Un contratto evolvibile non prevede ogni futuro possibile.

Preserva la capacità di cambiare senza obbligare provider e consumer a una release coordinata permanente.

Questo è esattamente lo stesso valore che cercavamo nei boundary di modulo e nei service boundary: rendere locale un cambiamento finché il significato condiviso non è davvero cambiato.

> **L'evolvibilità di un'API è la capacità di modificare l'implementazione e ampliare la capability senza trasformare ogni evoluzione in un progetto di sincronizzazione fra tutti i consumer.**