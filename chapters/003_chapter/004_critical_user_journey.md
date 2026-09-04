## Critical user journey: seguire ciò che conta davvero

Un diagramma può mostrare tutti i componenti e comunque non raccontare la cosa più importante.

Che cosa deve succedere affinché l'utente ottenga valore?

Questa domanda introduce il concetto di **critical user journey**.

Un critical user journey è una sequenza di interazioni che porta un utente o un attore a un outcome importante per il prodotto o per il business.

Non è necessariamente il percorso più lungo.

È quello che non possiamo permetterci di capire male.

Per un e-commerce potrebbe essere:

```text
browse
→ add to cart
→ checkout
→ payment
→ order confirmation
```

Per Order Operations, nel nostro scenario iniziale, un journey critico è:

```text
support operator
→ search order
→ read current status
→ decide customer response
```

Se il dato mostrato è vecchio, ambiguo o incoerente, il sistema può essere tecnicamente disponibile ma operativamente inutile.

## Availability non è soltanto “il server risponde”

Supponiamo che tutte le API rispondano con `200 OK`.

Ma il read model degli ordini è indietro di due ore.

Il sistema è disponibile?

Dal punto di vista infrastrutturale forse sì.

Dal punto di vista del journey di supporto, probabilmente no.

Questo mostra perché ragionare per journey è potente.

Ci obbliga a definire affidabilità e performance in relazione a un risultato, non soltanto a singoli componenti.

Un journey può fallire anche se nessun componente è completamente down.

Può fallire per stale data o autorizzazione errata, per timeout cumulativi e inconsistenza tra schermate, per una dipendenza degradata o un evento perso. Anche un errore di mapping o un workflow rimasto incompleto può rompere il journey pur lasciando molti componenti localmente sani.

## La latency si somma

Immaginiamo un percorso sincrono:

```text
UI
→ API Gateway
→ Orders
→ Customer
→ Payment
→ Database
```

Ogni hop aggiunge latency.

Se ciascun componente è “abbastanza veloce” isolatamente, il journey può comunque diventare lento.

Peggio ancora: la distribuzione delle latenze conta più della media.

Una dipendenza che occasionalmente impiega molto tempo può dominare l'esperienza end-to-end.

Questo significa che la performance va osservata anche dal punto di vista del journey.

La stessa cosa vale per l'affidabilità.

Più dipendenze obbligatorie servono per completare una richiesta, più modi esistono per non completarla.

Non ne deriva che dobbiamo eliminare tutte le chiamate.

Ne deriva che dobbiamo sapere quali sono **critiche**.

## Happy path e percorso reale

I diagrammi tendono ad amare il happy path.

```text
request → success
```

Il sistema reale contiene invece:

```text
request
→ timeout
→ retry
→ duplicate
→ partial success
→ compensation
→ delayed event
→ user retries manually
```

Quando modelliamo un critical user journey, dobbiamo includere almeno i failure mode plausibili che cambiano la decisione architetturale.

Per esempio, nel journey di annullamento ordine:

1. l'utente chiede annullamento;
2. l'ordine è ancora annullabile;
3. il pagamento deve essere rimborsato;
4. la logistica deve essere fermata;
5. lo stato deve diventare osservabile;
6. l'utente deve ricevere conferma.

Che cosa succede se il punto 3 riesce e il punto 4 fallisce?

Che cosa mostriamo al punto 5?

Che cosa diciamo al punto 6?

Queste domande ci portano direttamente verso workflow distribuiti, idempotency e compensazione, che affronteremo più avanti.

Ma il bisogno emerge già qui, prima della scelta tecnologica.

## Journey di business e journey operativi

Non esistono soltanto journey degli utenti finali.

Un sistema ha anche journey operativi.

Per esempio:

```text
alert
→ triage
→ identify affected component
→ mitigation
→ recovery
```

Oppure:

```text
deploy
→ health check
→ progressive rollout
→ validation
→ complete
```

Oppure:

```text
security incident
→ revoke credential
→ rotate secret
→ verify propagation
```

Questi percorsi possono essere critici quanto il checkout.

Un sistema che funziona bene quando tutto va bene ma non può essere operato durante un incidente è architetturalmente incompleto.

## Disegnare il journey prima dei componenti

In molti casi è utile invertire l'ordine abituale.

Invece di partire da:

```text
Frontend
Backend
Database
Queue
```

partiamo da:

```text
User intent
→ decisioni necessarie
→ informazioni necessarie
→ side effect
→ outcome osservabile
```

Solo dopo chiediamo quali componenti servono.

Questo riduce il rischio di **tool-first architecture**.

Se partiamo dal servizio cloud o dal framework, tenderemo a vedere il problema attraverso le capacità del tool.

Se partiamo dal journey, il tool deve giustificare la propria presenza.

## Criticality

Non tutti i journey richiedono lo stesso livello di protezione.

Possiamo classificarli informalmente:

**Tier 1 — business critical**

Un fallimento interrompe revenue, sicurezza, obblighi regolatori o operazioni fondamentali.

**Tier 2 — important**

Un fallimento degrada significativamente il prodotto ma esistono workaround o tolleranza temporanea.

**Tier 3 — convenience**

Un fallimento è fastidioso ma non compromette il funzionamento centrale.

Questa classificazione non è universale.

Serve a rendere esplicito che reliability, observability e recovery devono essere proporzionate all'importanza del journey.

## Order Operations

Nel brief precedente abbiamo definito un obiettivo:

> permettere al supporto di vedere rapidamente lo stato affidabile di un ordine.

Il journey iniziale può essere rappresentato così:

```text
Support operator
      ↓
Search order
      ↓
Retrieve authoritative status
      ↓
Show status + relevant timestamps
      ↓
Operator decides what to tell customer
```

Questa sequenza fa emergere domande che la semplice feature “pagina di ricerca ordine” non mostrava:

- che cosa significa authoritative?
- quali timestamp servono per capire freshness?
- quali dati può vedere un operatore?
- quanto può essere vecchio il dato?
- che cosa mostriamo se una dipendenza è indisponibile?
- possiamo distinguere “stato sconosciuto” da “ordine inesistente”?

Il journey sta già influenzando il design senza aver ancora scelto l'architettura.

## Il test del journey

Per ogni percorso critico chiediamo:

1. chi lo avvia?
2. quale outcome vuole ottenere?
3. quali passaggi sono obbligatori?
4. quali dati devono essere autorevoli?
5. quali dipendenze possono fallire?
6. dove si accumula latency?
7. quali stati intermedi sono visibili?
8. come distinguiamo failure da successo?
9. come ce ne accorgiamo in produzione?
10. come recuperiamo?

> **L'utente non consuma componenti. Consuma un comportamento end-to-end. L'architettura deve proteggere quel comportamento.**
