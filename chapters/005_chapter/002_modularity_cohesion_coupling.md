## Modularità, cohesion e coupling

“Dividiamo il sistema in moduli” è una frase facile da pronunciare e quasi priva di valore finché non sappiamo che cosa renda buono un modulo.

La risposta che ci interessa non riguarda la dimensione. Un modulo utile contiene responsabilità che hanno una ragione forte per stare insieme, espone il minimo necessario e limita la quantità di conoscenza che deve uscire dal proprio confine. Soprattutto, permette a una parte del sistema di cambiare senza trascinare automaticamente tutto il resto.

Cohesion e coupling descrivono due lati di questa proprietà.

## Cohesion: condividere una ragione di cambiamento

Un modulo molto coeso non deve essere piccolo. Deve contenere elementi che cambiano prevalentemente perché cambia la stessa responsabilità.

Un modulo `Orders` può ragionevolmente includere creazione e annullamento dell'ordine, validazione delle transizioni e regole che determinano lo stato commerciale. Queste parti condividono il significato di ordine e le sue invarianti.

Se nello stesso modulo troviamo invece rendering delle fatture, gestione utenti, newsletter e retry verso un carrier, il nome `Orders` sta probabilmente diventando un contenitore più che una responsabilità.

Lo stesso problema compare spesso in `utils/`, `helpers/`, `common/` o `shared/`. Questi package nascono per comodità e possono trasformarsi nel punto in cui finisce tutto ciò che non ha un proprietario chiaro. Il risultato è paradossale: cohesion bassissima e fan-in altissimo.

Un modulo shared non è sbagliato per definizione. Diventa leggibile quando la responsabilità è specifica: `shared/time`, `shared/serialization` o `shared/observability` dicono molto più di `common`.

## Coupling: quanto costa conoscere una dipendenza

Il coupling non coincide con il numero di frecce. Dipendere da una funzione pura e stabile è molto diverso dal dipendere da una tabella condivisa, da una chiamata remota sincrona o da una convenzione temporale non documentata.

Una domanda più utile è:

> **Che cosa deve sapere A per usare B correttamente?**

Più conoscenza implicita serve, più la dipendenza è profonda.

Supponiamo che Shipping esponga soltanto:

```ts
reserve(orderId: string): Promise<void>
```

La firma sembra minima. Ma se Orders deve sapere che la prenotazione dura quindici minuti, che una seconda chiamata ha una semantica particolare, che alcuni errori sono retryable e che la replica dei dati può arrivare in ritardo, il contratto reale è molto più grande della firma TypeScript.

Questo è **coupling semantico**: la dipendenza vive nelle assunzioni necessarie per usare correttamente il servizio.

## La history mostra confini che il diagramma può nascondere

Il change coupling ci offre un'altra prospettiva. Se ogni modifica ad A richiede sistematicamente modifiche in B, C e D, esiste un legame che merita attenzione anche se il diagramma non lo mostra.

Possiamo osservarlo nella history dei commit, nelle pull request che attraversano sempre le stesse aree, nei test che cambiano in cascata o nei deploy che richiedono coordinamento. Gli agenti possono accelerare molto questa analisi su repository grandi, ma il risultato va interpretato: correlazione nella history non significa automaticamente boundary di dominio.

La domanda resta **perché** quelle parti cambiano insieme.

## Un confine logico non richiede un confine di rete

Il costo del coupling cresce quando attraversiamo processo e rete. Una chiamata remota porta con sé latency, failure parziali, timeout, retry, autenticazione, observability, versioning e compatibility.

Questo significa che una separazione concettualmente elegante può essere operativamente pessima se la materializziamo subito come servizio distribuito.

Possiamo avere moduli forti dentro lo stesso deployable. La separazione logica e la separazione fisica rispondono a domande diverse.

Questo punto sarà centrale quando confronteremo modular monolith e microservices.

## High cohesion, controlled coupling

Lo slogan classico “high cohesion, low coupling” è utile se lo rendiamo operativo:

> **Tieni insieme ciò che condivide le stesse ragioni di cambiamento. Riduci la conoscenza necessaria tra ciò che deve poter cambiare indipendentemente.**

Per verificare un confine possiamo provare a completare:

```text
Questo modulo esiste per...
È autorevole su...
Nasconde...
Espone...
Dipende da...
Può cambiare senza coinvolgere...
```

Se le risposte richiedono parole vaghe come “gestione”, “common” o “varie utility”, forse il confine non è ancora abbastanza chiaro.

Un buon modulo non deve essere perfetto. Deve essere **comprensibile abbastanza da contenere il cambiamento e il significato che gli appartiene**.
