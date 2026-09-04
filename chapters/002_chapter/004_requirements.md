## Requisiti: descrivere comportamento, non soluzioni travestite

La parola “requisito” viene usata per cose molto diverse. Può indicare un bisogno dell’utente, una feature, un vincolo, una preferenza o perfino una decisione tecnica già presa. Se non distinguiamo queste categorie, il documento dei requisiti diventa un contenitore in cui tutto sembra avere la stessa autorità.

### Funzionale non significa dettagliato

Un requisito funzionale descrive un comportamento che il sistema deve rendere possibile o garantire. “Un operatore autorizzato deve poter visualizzare gli ordini che richiedono intervento manuale” descrive un comportamento. “Creare una pagina React con tabella AG Grid e filtri salvati in local storage” contiene già numerose decisioni di soluzione.

Quelle decisioni potrebbero essere corrette, ma non sono il requisito. Separare comportamento e implementazione ci permette di cambiare la seconda senza perdere la prima.

Per requisiti importanti può essere utile rendere espliciti attore, condizione, comportamento, risultato osservabile ed eccezioni significative. Non è necessario trasformare ogni frase in un template, ma la struttura aiuta quando l’ambiguità rischia di cambiare il significato.

Per esempio, dire che un operatore del team Operations, autenticato e autorizzato, può vedere gli ordini classificati come bisognosi di intervento è più utile se chiarisce anche quali informazioni devono essere visibili e che gli ordini di tenant non autorizzati non devono comparire. Il requisito resta indipendente dalla pagina, dalla libreria UI o dalla struttura delle classi che lo implementeranno.

### Requisiti come contratti di significato

Un requisito utile riduce la possibilità che due persone costruiscano due comportamenti diversi. La frase “gli utenti possono cancellare gli ordini recenti” sembra semplice finché non chiediamo che cosa significhi “recente”: cinque minuti, un’ora, prima della spedizione o prima della cattura del pagamento?

Parole come *attivo*, *valido*, *completato*, *disponibile*, *amministratore*, *prioritario*, *fallito* o *verificato* possono nascondere regole di business. Un servizio può considerare un ordine completato quando il pagamento è confermato, un altro quando la spedizione parte e un terzo quando il cliente riceve la merce. Ogni componente può essere corretto localmente e il sistema risultare sbagliato globalmente.

Per questo i requisiti aiutano anche l’architettura: definiscono il linguaggio con cui separiamo responsabilità, stati e contratti.

### Happy path, edge case e failure path

Quando il contesto non dice altro, la generazione automatica tende naturalmente a produrre l’happy path. Non è un difetto misterioso dell’AI; è una conseguenza della specifica.

Se chiediamo di implementare il pagamento di un ordine, restano undefined molti comportamenti che cambiano il rischio: il provider può rifiutare la richiesta o andare in timeout, una risposta può arrivare duplicata o in ritardo, l’utente può riprovare, l’ordine può risultare già pagato, l’importo può cambiare e la persistenza può fallire dopo un’autorizzazione riuscita.

Non dobbiamo elencare ogni failure possibile per ogni feature. Dobbiamo rendere espliciti quelli che cambiano significativamente stato, denaro, sicurezza, dati o esperienza utente.

Una buona euristica è:

> **Se questo caso si verifica in produzione, possiamo permetterci che il comportamento venga deciso per caso?**

Se la risposta è no, merita di essere definito.

### “Deve supportare” è spesso troppo poco

Frasi come “il sistema deve supportare più tenant” sembrano requisiti, ma possono significare cose molto diverse: isolamento dei dati, configurazioni separate, quote, identità, chiavi di cifratura, custom domain, deployment dedicati o billing differenziato.

Lo stesso problema compare quando diciamo che il sistema deve supportare offline, multi-region, real time, audit, plugin o AI. La parola “supportare” può nascondere un’intera architettura. Dobbiamo tradurre la capacità in comportamenti e qualità osservabili.

### Requisiti non funzionali: gli aggettivi non bastano

Dedicheremo un intero capitolo ai non-functional requirements. Qui ci basta fissare un principio:

> **“Scalabile”, “veloce”, “sicuro” e “affidabile” non sono requisiti sufficienti.**

Sono direzioni. Diventano requisiti quando permettono di distinguere una soluzione accettabile da una non accettabile.

Dire che una schermata deve essere veloce lascia spazio a interpretazioni arbitrarie; indicare, per il normale carico operativo, un target di latenza osservabile rende la promessa verificabile. Lo stesso vale per availability, recovery, throughput o freshness. I numeri, però, non vanno inventati per sembrare professionali: devono derivare dal bisogno. Se il target non è ancora noto, la cosa corretta è dichiararlo come decisione aperta.

### Requisiti e priorità

Non tutti i requisiti hanno lo stesso peso. Se tutto è obbligatorio, non abbiamo davvero una priorità. Una classificazione come `Must`, `Should`, `Could` e `Not now` può essere utile non per le etichette in sé, ma perché costringe a dichiarare quali richieste proteggiamo per prime e quali possiamo rimandare.

### Requisiti e AI: meno interpretazione accidentale

Un agente lavora bene quando ha spazio di manovra. Non dobbiamo prescrivere ogni dettaglio, ma dobbiamo distinguere la libertà sulle decisioni reversibili dall’ambiguità sulle regole che definiscono correttezza.

Possiamo dire a un agente di scegliere la struttura interna più semplice coerente con le convenzioni del repository. Non dovremmo invece costringerlo a indovinare se un operatore possa vedere ordini di altri tenant.

La prima è execution. La seconda è policy.

### Il requisito come test futuro

Un requisito ben scritto contiene già l’embrione della verifica. Se diciamo che un operatore può prendere in carico un ordine problematico e che gli altri operatori devono vedere chi lo sta gestendo, possiamo immaginare subito scenari e test. Se scriviamo “implementare gestione ordini avanzata”, non sappiamo nemmeno che cosa significhi successo.

Prima di considerare un requisito abbastanza maturo per l’execution, chiediamoci:

> **Sapremmo osservare se è stato soddisfatto?**

Se no, probabilmente manca ancora qualcosa.
