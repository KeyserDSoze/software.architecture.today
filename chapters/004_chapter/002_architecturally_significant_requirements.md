## Architecturally Significant Requirements

Non tutti i requisiti pesano allo stesso modo sull'architettura.

Alcuni descrivono comportamenti locali.

Altri cambiano la forma stessa del sistema.

Questi ultimi vengono spesso chiamati **Architecturally Significant Requirements**, o ASR.

Un ASR è un requisito che influenza in modo sostanziale una o più decisioni architetturali.

Non deve essere per forza un requisito non funzionale.

Anche un requisito funzionale può essere architetturalmente significativo.

Per esempio:

- “un cliente può modificare il proprio indirizzo” potrebbe essere locale;
- “un pagamento confermato non può mai essere elaborato due volte” influenza idempotenza, persistenza e integrazioni;
- “il sistema deve continuare a operare anche durante la perdita di una zona di disponibilità” influenza deployment, state management e recovery;
- “ogni modifica amministrativa deve essere auditabile per sette anni” influenza storage, identity, logging e retention;
- “un utente deve vedere lo stato ordine aggiornato entro cinque secondi” può influenzare data flow, caching e consistency.

La domanda utile è:

> **Se questo requisito cambia, quali parti importanti dell'architettura potrebbero cambiare con lui?**

Se la risposta è “molte”, probabilmente abbiamo davanti un ASR.

### Gli ASR non sono soltanto qualità

È facile associare gli ASR a parole come:

- performance;
- security;
- availability;
- scalability;
- compliance.

Ma il significato architetturale nasce dal contesto.

“Availability 99,9%” da sola non basta.

Dobbiamo capire:

- di quale journey?
- misurata dove?
- in quale finestra?
- con quali esclusioni?
- quali funzioni possono degradare?
- quale costo è accettabile per raggiungerla?

Allo stesso modo, un requisito apparentemente funzionale può avere conseguenze profonde.

“Permettere il rimborso parziale di un ordine” potrebbe richiedere cambiamenti a:

- modello dati;
- accounting;
- payment provider;
- idempotency;
- audit;
- API compatibility;
- workflow di fulfillment.

Il requisito è funzionale.

La sua conseguenza è architetturale.

### Individuare gli ASR

Un metodo pratico è cercare requisiti associati a uno di questi segnali:

**Ampiezza.** Tocca più componenti o domini.

**Rischio.** Un errore ha conseguenze elevate.

**Irreversibilità.** Cambiare idea dopo è costoso.

**Vincolo esterno.** È imposto da normativa, contratto, piattaforma o integrazione.

**Qualità critica.** Determina performance, availability, security, operability o consistency del sistema.

**Scala.** Il requisito cambia comportamento al crescere di dati, utenti o traffico.

**Evoluzione.** Influenza quanto sarà facile modificare il sistema in futuro.

Non è necessario assegnare punteggi formali.

Serve sviluppare sensibilità.

### ASR espliciti e ASR nascosti

Alcuni requisiti sono dichiarati chiaramente.

> “RPO massimo cinque minuti.”

Altri sono nascosti dentro frasi innocenti.

> “L'operatore deve poter vedere sempre l'ultimo stato noto dell'ordine.”

Qui la parola “sempre” apre domande su:

- disponibilità;
- freshness;
- fallback;
- cache;
- replica;
- degradazione.

Oppure:

> “Il cliente non deve poter vedere ordini di altri tenant.”

Sembra ovvio.

Ma è un requisito di isolation che deve attraversare autenticazione, query, cache, logging, testing e observability.

Gli ASR nascosti sono pericolosi perché entrano nel sistema senza essere trattati come decisioni.

### ASR e priorità

Non possiamo ottimizzare tutto contemporaneamente.

Se chiediamo:

- latency minima;
- consistency forte;
- availability massima;
- costi minimi;
- zero lock-in;
- sviluppo velocissimo;
- operazioni semplicissime;

stiamo chiedendo un sistema senza trade-off.

Non esiste.

Gli ASR devono quindi essere non soltanto identificati, ma **ordinati e contestualizzati**.

Per Order Operations, per esempio, potremmo scoprire che:

1. tenant isolation è non negoziabile;
2. dati vecchi di qualche secondo sono accettabili;
3. il lookup deve rimanere disponibile anche se un sistema secondario è lento;
4. il costo operativo deve restare molto basso nella fase iniziale.

Questa gerarchia cambia le decisioni possibili.

### Il rischio degli aggettivi

Riprenderemo questo tema in modo molto più approfondito nel Capitolo 6.

Per ora fissiamo una regola:

> **“Scalabile”, “sicuro”, “resiliente” e “performante” non sono ASR finché non sappiamo cosa significano nel contesto.**

Un requisito diventa utile all'architettura quando discrimina tra alternative.

Se due soluzioni completamente diverse soddisfano allo stesso modo una frase vaga, quella frase non ci sta aiutando a decidere.

### ASR e AI

Un agente può estrarre candidati ASR da documentazione, ticket e conversazioni.

Può essere molto utile.

Ma non può stabilire autonomamente la priorità reale se questa dipende da business, rischio o conseguenze organizzative non presenti nel contesto.

Quindi un buon uso dell'AI è:

1. estrarre possibili requisiti significativi;
2. classificare il tipo di impatto;
3. identificare ambiguità;
4. proporre domande mancanti;
5. far decidere priorità e soglie a chi conosce il contesto.

L'obiettivo non è produrre una lista più lunga.

È trovare **le poche condizioni che cambiano davvero il design space**.