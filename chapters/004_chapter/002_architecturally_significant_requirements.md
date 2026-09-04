## Architecturally Significant Requirements

Non tutti i requisiti esercitano la stessa pressione sull'architettura. Alcuni descrivono un comportamento locale; altri, se cambiano, possono costringerci a ripensare dati, deployment, integrazioni, recovery o boundary. Questi ultimi vengono spesso chiamati **Architecturally Significant Requirements**, o ASR.

Un ASR è quindi un requisito che influenza in modo sostanziale una o più decisioni architetturali. Non deve essere necessariamente non funzionale. Anche un comportamento di business può diventare architetturalmente significativo quando trascina con sé conseguenze sistemiche.

“Un cliente può modificare il proprio indirizzo” può rimanere locale. “Un pagamento confermato non può essere elaborato due volte” investe invece idempotenza, persistenza e integrazioni. “Ogni modifica amministrativa deve essere ricostruibile per sette anni” attraversa identity, audit, storage e retention. “Lo stato ordine deve diventare visibile entro pochi secondi” può cambiare data flow, caching e consistency.

La domanda utile è:

> **Se questo requisito cambia, quali parti importanti dell'architettura potrebbero cambiare con lui?**

Quando la risposta coinvolge molte decisioni costose o trasversali, siamo probabilmente davanti a un ASR.

### Il significato nasce dal contesto

È facile associare gli ASR a parole come performance, security, availability, scalability o compliance. Il problema è che queste etichette, da sole, discriminano poco tra alternative.

Dire “availability 99,9%” non è sufficiente finché non sappiamo quale journey stiamo misurando, in quale finestra, con quali esclusioni e con quale comportamento durante un degrado. Lo stesso numero può produrre architetture molto diverse a seconda che riguardi un catalogo pubblico, un pagamento o una funzione amministrativa con workaround manuale.

Anche un requisito chiaramente funzionale può avere questo effetto. “Permettere il rimborso parziale di un ordine” può sembrare una feature; in un sistema reale potrebbe modificare modello contabile, idempotency, API, audit, integrazione con il provider e workflow di fulfillment.

Il requisito resta funzionale. La sua **conseguenza** diventa architetturale.

## Riconoscere ciò che pesa

Non serve trasformare gli ASR in un sistema di punteggio rigido. È più utile sviluppare sensibilità per alcuni segnali ricorrenti. Un requisito merita attenzione quando attraversa più domini, quando l'errore ha conseguenze elevate o quando l'inversione sarebbe costosa. Lo stesso vale quando nasce da un vincolo esterno, determina una qualità critica, cambia drasticamente al crescere di dati e traffico oppure influenza la capacità futura di evolvere il sistema.

Questi segnali non sono categorie indipendenti. Spesso si sommano. Un requisito di tenant isolation, per esempio, ha impatto trasversale, costo di errore elevato e forte persistenza nel modello dati. È proprio questa combinazione a renderlo importante.

### Gli ASR nascosti sono i più pericolosi

Alcuni requisiti si presentano già nella forma giusta: “RPO massimo cinque minuti” ci costringe subito a ragionare su backup, replica e recovery.

Altri sono nascosti dentro frasi apparentemente innocue. “L'operatore deve vedere sempre l'ultimo stato noto dell'ordine” contiene almeno domande su availability, freshness, fallback, replica e comportamento in degradazione. “Il cliente non deve vedere ordini di altri tenant” sembra ovvio, ma impone isolation attraverso autenticazione, query, cache, logging, test e observability.

Il problema degli ASR nascosti non è che siano difficili da implementare. È che possono diventare architettura **senza essere stati trattati come decisioni**.

## Priorità prima di ottimizzazione

Riconoscere gli ASR non basta. Dobbiamo anche capire quali siano davvero prioritari, perché molte qualità competono tra loro.

Se chiediamo simultaneamente latency minima, consistency forte, availability massima, costo minimo, zero lock-in, delivery immediata e operazioni semplicissime, non abbiamo definito una priorità: abbiamo semplicemente chiesto che tutti i trade-off scompaiano.

Per Order Operations potremmo scoprire, per esempio, che tenant isolation è non negoziabile, che alcuni dati possono avere qualche secondo di ritardo, che il lookup deve degradare in modo comprensibile quando un sistema secondario rallenta e che il team vuole mantenere basso il costo operativo nella prima fase. Queste quattro condizioni restringono il design space molto più di una lunga lista di aggettivi.

> **“Scalabile”, “sicuro”, “resiliente” e “performante” non sono ASR finché non sappiamo che cosa significano nel contesto.**

Un requisito diventa utile all'architettura quando aiuta davvero a distinguere una soluzione accettabile da una che non lo è.

## ASR e AI

Un agente può essere molto efficace nell'estrarre candidati ASR da issue, brief, documentazione e conversazioni. Può evidenziare parole ambigue, collegare un requisito a possibili aree di impatto e proporre domande che il testo non risolve.

Il punto in cui serve ancora judgment è la priorità reale. Un modello non può sapere autonomamente se il business preferisca time-to-market a isolation operativa, se un requisito normativo sia non negoziabile o quale incidente l'organizzazione sia disposta ad accettare quando queste informazioni non sono nel contesto.

Per questo l'AI è particolarmente utile come strumento di discovery: trova candidati, rende visibili impatti e ambiguità, poi lascia a chi conosce il sistema la responsabilità di stabilire **quali poche condizioni cambiano davvero il design space**.
