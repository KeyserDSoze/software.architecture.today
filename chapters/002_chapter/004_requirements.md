## Requisiti: descrivere comportamento, non soluzioni travestite

La parola “requisito” viene usata per cose molto diverse.

A volte indica un bisogno dell'utente.

A volte una feature.

A volte una decisione tecnica già presa.

A volte una preferenza.

A volte un vincolo.

Se non distinguiamo queste categorie, il documento dei requisiti diventa un contenitore in cui tutto sembra avere la stessa autorità.

### Funzionale non significa dettagliato

Un requisito funzionale descrive un comportamento che il sistema deve rendere possibile o garantire.

Per esempio:

> “Un operatore autorizzato deve poter visualizzare gli ordini che richiedono intervento manuale.”

È diverso da:

> “Creare una pagina React con tabella AG Grid e filtri salvati in local storage.”

La seconda frase contiene già molte decisioni di soluzione.

Potrebbero essere corrette.

Ma non sono il comportamento richiesto.

Separare comportamento e implementazione ci permette di cambiare la seconda senza perdere la prima.

### Una forma utile

Per requisiti importanti possiamo usare una struttura semplice:

```text
Attore
Condizione
Comportamento
Risultato osservabile
Eccezioni significative
```

Esempio:

```text
Attore:
operatore del team operations.

Condizione:
utente autenticato con permesso di gestione ordini.

Comportamento:
può vedere gli ordini attualmente classificati come bisognosi di intervento.

Risultato osservabile:
per ogni ordine vede identificativo, stato, causa operativa e tempo trascorso dall'ingresso nello stato.

Eccezioni significative:
ordini appartenenti a tenant non autorizzati non devono essere visibili.
```

Non serve usare sempre questo template.

Serve imparare a distinguere ciò che il sistema deve **fare** da come pensiamo di farlo.

### Requisiti come contratti di significato

Un requisito utile riduce la possibilità che due persone costruiscano due comportamenti diversi.

Prendiamo:

> “Gli utenti possono cancellare gli ordini recenti.”

Che cosa significa “recenti”?

Cinque minuti?

Un'ora?

Prima della spedizione?

Prima della cattura del pagamento?

“Recente” sembra descrittivo, ma nasconde una regola di business.

Lo stesso vale per parole apparentemente semplici come *attivo*, *valido*, *completato*, *disponibile*, *amministratore*, *prioritario*, *fallito* o *verificato*. Molti bug che appaiono tecnici sono in realtà divergenze semantiche.

Un servizio considera un ordine “completato” quando il pagamento è confermato.

Un altro quando la spedizione parte.

Un terzo quando il cliente riceve la merce.

Il codice può essere corretto localmente e il sistema sbagliato globalmente.

Per questo i requisiti aiutano anche l'architettura: definiscono il linguaggio con cui separiamo responsabilità e contratti.

### Happy path, edge case e failure path

La generazione automatica tende naturalmente a produrre l'happy path quando il contesto non dice altro.

Questo non è un difetto misterioso dell'AI.

È una conseguenza della specifica.

Se chiediamo:

> “Implementa il pagamento di un ordine.”

esistono decine di comportamenti non definiti. Il pagamento può essere rifiutato o il provider andare in timeout; una risposta può arrivare duplicata, in ritardo o in un ordine diverso da quello atteso. L'utente può riprovare, l'ordine risultare già pagato, l'importo cambiare o la valuta non essere supportata. E possiamo perfino autorizzare correttamente il pagamento per poi fallire durante la persistenza.

Non dobbiamo elencare ogni failure possibile per ogni feature.

Dobbiamo identificare quelli che cambiano significativamente stato, denaro, sicurezza, dati o esperienza utente.

Una buona euristica è:

> **Se questo caso si verifica in produzione, possiamo permetterci che il comportamento venga deciso per caso?**

Se la risposta è no, merita di essere esplicitato.

### “Deve supportare” è spesso troppo poco

Frasi come:

> “Il sistema deve supportare più tenant.”

sembrano requisiti.

Ma che cosa implicano davvero? Potrebbero richiedere isolamento dei dati e configurazioni separate, quote o identità distinte, cifratura con chiavi differenti, custom domain, deployment dedicati o persino billing separato.

La parola “supportare” può nascondere un'intera architettura.

Lo stesso vale quando diciamo che il sistema deve supportare offline, multi-region, real time, audit, plugin o AI. Ogni volta dobbiamo tradurre la capacità in comportamenti e qualità osservabili.

### Requisiti non funzionali: gli aggettivi non bastano

Dedicheremo un intero capitolo ai non-functional requirements.

Qui ci serve anticipare un principio:

> **“Scalabile”, “veloce”, “sicuro” e “affidabile” non sono requisiti sufficienti.**

Sono direzioni.

Un requisito diventa utile quando permette di distinguere una soluzione accettabile da una non accettabile.

Non:

> “La schermata deve essere veloce.”

Meglio:

> “Per il normale carico operativo, il 95° percentile del caricamento iniziale degli ordini deve rimanere sotto 2 secondi dal browser aziendale supportato.”

Non:

> “Il sistema deve essere disponibile.”

Meglio:

> “Durante l'orario operativo europeo la funzione deve avere un target di disponibilità del 99,9%, esclusa manutenzione pianificata secondo policy.”

I numeri non vanno inventati per sembrare professionali.

Devono derivare dal bisogno.

Se non conosciamo ancora il target, possiamo dichiararlo come decisione aperta.

### Requisiti e priorità

Non tutti i requisiti hanno lo stesso peso.

Se li trattiamo tutti come obbligatori, perdiamo la capacità di decidere.

Una classificazione semplice può essere:

```text
Must
Should
Could
Not now
```

Il valore non sta nelle etichette.

Sta nella conversazione che obbligano ad avere.

Se tutto è “Must”, non abbiamo priorità.

Abbiamo soltanto accumulato desideri.

### Requisiti e AI: meno interpretazione accidentale

Un agente lavora bene con spazio di manovra.

Non dobbiamo prescrivere ogni dettaglio.

Ma esiste una differenza tra:

- lasciare libertà sulle decisioni reversibili;
- lasciare ambiguità sulle regole che definiscono correttezza.

Possiamo dire a un agente:

> “Scegli la struttura interna più semplice coerente con le convenzioni del repository.”

Ma non dovremmo costringerlo a indovinare se un operatore può vedere ordini di altri tenant.

La prima è execution.

La seconda è policy.

### Il requisito come test futuro

Un requisito ben scritto contiene già l'embrione della verifica.

Se diciamo:

> “Un operatore può prendere in carico un ordine problematico e gli altri operatori devono vedere chi lo sta gestendo.”

possiamo immaginare subito test e scenari.

Se diciamo:

> “Implementare gestione ordini avanzata.”

non sappiamo nemmeno che cosa significhi successo.

Prima di considerare un requisito abbastanza maturo per l'execution, chiediamoci:

> **Sapremmo osservare se è stato soddisfatto?**

Se no, probabilmente manca ancora qualcosa.