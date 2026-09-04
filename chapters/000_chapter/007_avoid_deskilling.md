## Evitare il deskilling

L'AI può rendere una persona più produttiva prima di renderla più competente.

Questa è una delle sue caratteristiche più utili.

Ed è anche uno dei suoi rischi più seri.

Possiamo ottenere output di livello superiore alle nostre capacità attuali molto prima di essere in grado di giudicare davvero quell'output.

Se usiamo male questa possibilità, cresciamo nella capacità di consegnare e diminuiamo nella capacità di capire.

### Outsourcing dell'execution, outsourcing del reasoning

Dobbiamo distinguere due forme di delega.

La prima è l'**outsourcing dell'execution**.

Conosciamo il problema, comprendiamo il metodo e usiamo l'AI per eseguire più velocemente.

Per esempio, possiamo delegare la generazione di boilerplate e test ripetitivi, l'esplorazione di un repository o la conversione di configurazioni. Possiamo far preparare una prima implementazione, cercare riferimenti nella documentazione o produrre più varianti della stessa soluzione senza rinunciare per questo a comprenderne il metodo e il problema.

La seconda è l'**outsourcing del reasoning**.

Non sappiamo perché una soluzione funzioni, non comprendiamo le alternative, non sapremmo riconoscere un errore e accettiamo comunque il risultato.

Il primo può moltiplicare la produttività.

Il secondo può erodere competenza.

### La produttività apparente

Immaginiamo due developer junior.

Il primo usa l'AI per produrre velocemente un'API, ma poi continua a interrogare la soluzione: vuole sapere perché sia stata scelta quella struttura, che cosa accada con richieste concorrenti, quali errori possano essere ritentati, come cambierebbe la soluzione senza il framework e quali test dimostrino davvero il comportamento.

Il secondo copia il risultato, lo fa compilare e passa al task successivo.

Nel breve periodo potrebbero sembrare ugualmente produttivi.

Dopo mesi, la distanza tra i due può diventare enorme.

Il primo ha usato l'AI come acceleratore di apprendimento.

Il secondo come sostituto dell'apprendimento.

### Non usare l'AI per sembrare più senior

Un senior non è una persona che produce output dall'aspetto senior.

È una persona che riconosce conseguenze che gli altri non vedono ancora.

Sa individuare assunzioni nascoste e failure mode, riconoscere coupling, costi futuri e incompatibilità, vedere rischi operativi e discutere trade-off fra alternative entrambe plausibili.

Un modello può aiutarci a produrre un documento pieno di questi concetti.

Ma se non sappiamo valutarli, il documento non ci ha resi senior.

Ci ha soltanto permesso di imitarne temporaneamente la forma.

Da qui un principio che useremo spesso:

> **Non utilizzare l'AI per sembrare più senior. Utilizzala per diventarlo.**

### Un metodo di studio AI-native

L'AI può essere uno strumento di apprendimento straordinario se la usiamo come sparring partner.

Un ciclo efficace può essere:

1. prova a risolvere il problema;
2. esplicita il tuo ragionamento;
3. chiedi una critica;
4. confronta almeno due alternative;
5. implementa;
6. misura o testa;
7. prova a spiegare nuovamente la soluzione senza AI.

Il punto più importante è il settimo.

Se non sappiamo ricostruire il modello mentale dopo aver chiuso la chat, abbiamo probabilmente consumato una risposta senza trasformarla in competenza.

### Chiedere spiegazioni non basta

Anche qui esiste una scorciatoia pericolosa.

Possiamo chiedere:

> “Spiegami questo codice.”

E ricevere una spiegazione perfetta.

Ma capire una spiegazione mentre la leggiamo non significa saper ragionare autonomamente sul problema.

Per trasformare l'informazione in competenza dobbiamo recuperarla e applicarla.

Possiamo chiudere la risposta e provare a rispiegare il concetto, modificare un requisito e prevedere che cosa cambierà, cercare un controesempio o implementare una variante. Possiamo anche criticare la soluzione proposta e, soprattutto, spiegare in quali condizioni non la useremmo.

La comprensione si vede quando il contesto cambia.

### Depth e breadth

L'AI rende possibile esplorare moltissimi domini tecnici.

Questo incoraggia una maggiore breadth.

È positivo.

Un backend developer può capire meglio UX, networking e cloud.

Un frontend developer può esplorare database e security.

Un architect può leggere codice in linguaggi che non usa ogni giorno.

Ma la breadth senza depth produce familiarità superficiale.

Per questo il libro sosterrà entrambe: **profondità reale almeno in alcuni domini** e **ampiezza sufficiente per comprendere l'intero sistema**.

La profondità ci insegna quanto può essere ingannevole una risposta apparentemente corretta.

L'ampiezza ci impedisce di ottimizzare il nostro rettangolo ignorando il sistema.

### Giocare fuori ruolo

Una conseguenza positiva dell'AI è che abbassa il costo di esplorare discipline adiacenti.

Dobbiamo sfruttarla.

Un engineer dovrebbe abituarsi a fare domande fuori dal proprio ruolo. Che cosa vede l'utente e quale requisito di business stiamo davvero soddisfacendo? Chi paga il costo cloud e chi opera la feature alle tre di notte? Che cosa succederà ai dati fra cinque anni, quale superficie di attacco stiamo introducendo e che cosa dovrà capire il prossimo developer che entrerà nel sistema?

Questo non elimina la specializzazione.

Elimina il silo cognitivo.

### Il falso comfort della risposta immediata

Prima dell'AI, non sapere qualcosa produceva attrito.

Dovevamo cercare documentazione, provare, fallire, leggere codice, confrontare fonti.

Parte di quell'attrito era inefficienza.

Parte era apprendimento.

Con una risposta immediata rischiamo di eliminare entrambi.

Per questo a volte è utile introdurre deliberatamente una piccola frizione: formulare una propria ipotesi e prevedere l'output prima di eseguire, scrivere i trade-off prima di chiedere un confronto, tentare un debug prima di chiedere la soluzione o chiedere un hint invece della risposta completa.

Non perché soffrire renda migliori.

Perché il cervello impara molto quando deve costruire e correggere un modello.

### AI fatigue

C'è anche il problema opposto.

Usare l'AI tutto il giorno può diventare cognitivamente estenuante.

Prompt, output, correzione, nuovo prompt, nuovo output, diff, altra correzione.

Se ogni decisione viene trasformata in una conversazione, il vantaggio di velocità può diventare rumore.

La soluzione non è necessariamente usare meno AI.

Spesso è usare meglio il contesto.

Una foundation stabile permette deleghe più grandi e meno frammentate:

```text
problema chiaro
→ requisiti
→ architettura
→ contratti
→ issue ben definita
→ execution
→ checkpoint
```

invece di:

```text
prompt
→ output
→ correzione
→ prompt
→ deviazione
→ nuovo prompt
→ refactoring
→ altra correzione
```

La qualità del contesto riduce sia l'errore sia la fatica.

### La prova più semplice

Ogni tanto dovremmo chiederci:

> “Se domani questo strumento non fosse disponibile, quali parti del lavoro saprei ancora spiegare e governare?”

Non è un invito a tornare indietro.

Non chiediamo a un engineer di rinunciare all'IDE per dimostrare di saper programmare.

Serve però distinguere tra una capacità aumentata dallo strumento e una capacità completamente sostituita dallo strumento.

Il professionista AI-native non è quello che lavora come se l'AI non esistesse.

È quello che usa l'AI per aumentare la propria leva senza perdere il diritto di stare al timone.