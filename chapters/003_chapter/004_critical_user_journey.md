## Critical user journey: seguire ciò che conta davvero

Un diagramma può contenere tutti i componenti e non raccontare ancora la cosa più importante: **che cosa deve succedere affinché l’utente ottenga valore?**

Questa domanda introduce il concetto di **critical user journey**: una sequenza di interazioni che conduce un utente o un altro attore verso un outcome importante per il prodotto o per il business. Non è necessariamente il percorso più lungo o tecnicamente più sofisticato. È quello che non possiamo permetterci di capire male.

Per un e-commerce potrebbe essere il percorso che va dalla scelta del prodotto alla conferma dell’ordine; per Order Operations, nella prima iterazione, è il viaggio dell’operatore che trova un ordine problematico, ricostruisce uno stato affidabile e decide che cosa fare. Se il dato mostrato è vecchio, ambiguo o incoerente, l’applicazione può essere tecnicamente disponibile e nello stesso tempo operativamente inutile.

## Availability dal punto di vista del journey

Immaginiamo che tutte le API rispondano con `200 OK`, ma che il read model degli ordini sia indietro di due ore. L’infrastruttura potrebbe risultare healthy; per l’operatore che deve capire che cosa sta accadendo adesso, il journey è degradato o addirittura fallito.

Questo esempio ci obbliga a distinguere la salute dei componenti dalla capacità end-to-end. Un journey può fallire senza che nessun server sia completamente down: bastano stale data, autorizzazioni errate, timeout cumulativi, inconsistenze tra schermate, una dipendenza degradata, un evento perso o un errore di mapping. Il valore scompare prima ancora che la dashboard infrastrutturale diventi rossa.

Reliability e performance devono quindi essere collegate a ciò che l’utente cerca di ottenere, non soltanto alla disponibilità dei rettangoli nel diagramma.

### La latency si compone

Consideriamo un percorso sincrono:

```text
UI
→ API Gateway
→ Orders
→ Customer
→ Payment
→ Database
```

Ogni hop può rispettare il proprio obiettivo locale e contribuire comunque a un journey lento. Conta la somma delle latenze, ma contano soprattutto le code lunghe della distribuzione: una dipendenza che occasionalmente impiega molto più del normale può dominare il comportamento end-to-end.

Lo stesso vale per l’affidabilità. Più dipendenze sono obbligatorie per completare un’azione, più esistono modi in cui quell’azione può non concludersi. Non significa che dobbiamo eliminare le chiamate; significa che dobbiamo sapere quali siano davvero critiche e che cosa accada quando non sono disponibili.

## Il journey reale include gli stati intermedi

I diagrammi amano il percorso `request → success`. I sistemi reali devono convivere anche con timeout, retry, duplicati, partial success, eventi ritardati e tentativi manuali dell’utente.

Prendiamo l’annullamento di un ordine. Per arrivare all’outcome corretto dobbiamo verificare che l’ordine sia ancora annullabile, gestire eventuale rimborso, fermare la logistica, rendere lo stato osservabile e comunicare il risultato. Il problema interessante non è elencare i passaggi, ma capire le relazioni tra loro. Se il rimborso riesce e il blocco logistico fallisce, che cosa rappresentiamo? Se la richiesta viene ripetuta mentre il workflow è a metà, possiamo evitare un secondo side effect economico? Che cosa vede il cliente durante l’attesa?

Queste domande ci porteranno più avanti a idempotency, saga e compensazione. Il bisogno architetturale emerge però già dal journey, prima della scelta del pattern.

## Anche gli operatori hanno journey critici

Non esistono soltanto percorsi degli utenti finali. Un sistema ha journey operativi: un alert deve diventare triage, diagnosi, mitigazione e recovery; un deployment deve attraversare health check, rollout progressivo e validazione; un incidente di sicurezza può richiedere revoca di credenziali, rotazione di secret e verifica della propagazione.

Questi percorsi possono essere critici quanto il checkout. Un sistema che funziona bene quando tutto è normale ma non può essere compreso o recuperato durante un incidente è incompleto dal punto di vista operativo.

## Disegnare il journey prima dei componenti

Un modo efficace per evitare la tool-first architecture è invertire l’ordine abituale. Prima descriviamo l’intento dell’utente, le informazioni e le decisioni necessarie, i side effect e l’outcome osservabile; soltanto dopo chiediamo quali componenti servano per sostenerli.

```text
User intent
→ informazioni necessarie
→ decisioni
→ side effect
→ outcome osservabile
```

In questo modo il framework, il servizio cloud o il database devono giustificare la propria presenza rispetto al comportamento che vogliamo ottenere, invece di diventare il filtro attraverso cui definiamo il problema.

## Criticality e investimento

Non tutti i journey meritano lo stesso livello di protezione. Un percorso che interrompe revenue, sicurezza o obblighi regolatori richiede un investimento diverso da una capability di convenienza per cui esiste un workaround semplice. Le etichette specifiche possono cambiare da azienda ad azienda; ciò che conta è rendere esplicita la **criticality** perché reliability, observability e recovery possano essere proporzionate all’impatto.

Non ha senso proteggere ogni interazione come se fosse mission critical. È altrettanto pericoloso proteggere un journey fondamentale come se fosse una schermata accessoria.

## Order Operations: che cosa deve restare vero

Nel brief precedente abbiamo dichiarato che Operations deve poter vedere rapidamente uno stato affidabile dell’ordine. Il journey può essere sintetizzato così:

```text
Operations operator
      ↓
Search order
      ↓
Retrieve authoritative state
      ↓
Show state + freshness
      ↓
Operator decides Action / Wait / Escalation
```

La sequenza fa emergere domande che “pagina di ricerca ordine” nasconde. Che cosa significa *authoritative* quando i dati arrivano da più domini? Quali timestamp servono per capire la freshness? Quali informazioni può vedere l’operatore? Che cosa mostriamo se Payments o Shipping sono indisponibili? Come distinguiamo un ordine inesistente da uno stato che non siamo riusciti a recuperare?

Il journey sta già influenzando il design senza aver ancora deciso la topologia del sistema.

## Il test del journey

Per un percorso davvero critico dobbiamo saper spiegare chi lo avvia e quale outcome cerca, quali informazioni e side effect siano indispensabili, quali dipendenze possano interromperlo e dove latency e failure si accumulino. Dobbiamo anche sapere quali stati intermedi siano visibili, come distingueremo successo, degrado e failure in produzione e quale recovery renda di nuovo possibile l’outcome.

Non serve trasformare queste domande in una checklist universale. Servono a ricordare il punto di vista giusto:

> **L’utente non consuma componenti. Consuma un comportamento end-to-end. L’architettura deve proteggere quel comportamento.**
