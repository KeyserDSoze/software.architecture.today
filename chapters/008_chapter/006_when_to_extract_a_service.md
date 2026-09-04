## Quando estrarre un servizio

Se un confine logico funziona bene dentro un modular monolith, quando merita di diventare un servizio indipendente?

Non esiste una soglia universale.

Ma possiamo cercare segnali.

### Segnale 1 — Ciclo di cambiamento indipendente

Un modulo cambia molto più spesso degli altri e i suoi rilasci sono rallentati dal deploy coordinato dell'intera applicazione.

Se l'autonomia di rilascio produce valore reale, l'estrazione diventa interessante.

### Segnale 2 — Profilo di carico differente

Un modulo ha un comportamento di capacity molto diverso.

Per esempio:

```text
Search → traffico elevato e read-heavy
Billing → traffico basso ma forte requisito di consistenza
```

Scalare entrambi nello stesso modo può diventare inefficiente.

### Segnale 3 — Failure isolation importante

Una capacità instabile o dipendente da sistemi esterni rischia di degradare l'intera applicazione.

Separare una capability può comprare resource isolation, timeout e circuit breaker indipendenti, deploy e rollback separati e un migliore incident containment. Sono proprietà concrete; se non servono, il servizio rischia di essere soltanto un confine più costoso.

Ma dobbiamo verificare che il journey dell'utente possa davvero sopravvivere alla failure del servizio.

Altrimenti la separazione fisica non compra molto isolamento percepito.

### Segnale 4 — Security boundary distinto

Un modulo tratta dati, privilegi o compliance molto differenti.

La separazione può ridurre il blast radius e rendere più forte il least privilege.

Questo è spesso un motivo più solido di “vogliamo usare un runtime diverso”.

### Segnale 5 — Ownership organizzativa stabile

Una capability ha un team dedicato, una roadmap autonoma e responsabilità operativa end-to-end.

In questo caso il service boundary può rafforzare una separazione già esistente invece di inventarla.

### Segnale 6 — Dati realmente posseduti

Il modulo possiede un modello dati coerente che gli altri consumano attraverso contratti intenzionali.

Questo rende più plausibile estrarre anche lo storage senza dover spezzare arbitrariamente transazioni e ownership.

### Segnale 7 — Technology fit realmente diverso

A volte una capacità ha bisogno di proprietà tecniche particolari.

Per esempio:

- un workload compute-intensive;
- uno stack specializzato;
- isolamento runtime;
- una libreria o piattaforma non compatibile con il resto dell'applicazione.

Può essere una buona ragione.

Ma deve essere una ragione concreta, non una scusa per introdurre una nuova tecnologia.

### Un solo segnale raramente basta

Il punto importante è non trasformare questa lista in checklist meccanica.

Un modulo che scala molto può forse essere ottimizzato restando nello stesso processo.

Un team dedicato può forse lavorare benissimo dentro un modular monolith.

Un security boundary può forse essere ottenuto con process isolation senza creare un'intera architettura a microservizi.

La decisione emerge dalla combinazione dei segnali.

### Extraction readiness

Prima dell'estrazione possiamo fare un test.

Il boundary attuale ha già:

- responsabilità chiara?
- API intenzionale?
- ownership dei dati?
- dipendenze note?
- test sufficienti?
- comportamento osservabile?
- pochi accessi trasversali illegittimi?

Se no, estrarre potrebbe soltanto cementare un boundary sbagliato dietro una rete.

Quindi:

> **prima rendi il confine credibile nel codice. Poi valuta se vale la pena renderlo fisico.**

### L'estrazione come decisione reversibile

Anche l'estrazione dovrebbe essere trattata come un ADR.

Dovremmo documentare:

- problema;
- proprietà attese;
- alternative;
- costi;
- migration plan;
- contract strategy;
- data ownership;
- rollback o fallback;
- segnali che direbbero che la scelta non sta funzionando.

Questo evita di trasformare “estraiamo un servizio” in una destinazione irreversibile.

La domanda finale resta:

> **Quale problema attuale diventa materialmente più semplice o più sicuro dopo l'estrazione?**