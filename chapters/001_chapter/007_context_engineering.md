## Context engineering

Per molto tempo abbiamo parlato di **prompt engineering**. La disciplina non scompare: saper formulare bene una richiesta continua a essere utile. Nel software engineering reale, però, il singolo prompt è soltanto una parte del problema.

Un agente che deve modificare un repository non ha bisogno soltanto di una frase ben scritta. Deve capire il contesto operativo in cui quella frase va interpretata. Da qui nasce il concetto di **context engineering**.

### Il prompt è un ingresso, non il sistema

Supponiamo di chiedere: “Aggiungi il supporto ai webhook”. La frase è comprensibile, ma per lavorare bene un agente deve ricostruire molto di più. Deve sapere chi invia quei webhook, come autentichiamo il sender, quale formato accettiamo, quando consideriamo riuscita l’elaborazione, come gestiamo duplicati e ordering e quali dati siano sensibili. Deve inoltre capire quali eventi esistono già, quali convenzioni usa il repository, come vengono trattati retry e logging, quali test sono obbligatori e quali boundary non devono essere attraversati.

Potremmo mettere tutto nel prompt. Ma se molte di queste informazioni sono stabili e ricorrenti, ripeterle a ogni task è inefficiente e fragile. Dovrebbero vivere nel sistema di contesto del progetto.

### Le fonti di contesto

Il contesto non arriva da un solo posto. Istruzioni globali, repository, documentazione, ADR, issue, codice esistente, test, contratti, esempi, tool disponibili, permission boundary e stato dell’ambiente contribuiscono tutti a costruire ciò che l’agente considera vero e rilevante.

La qualità del risultato dipende anche da come queste fonti si combinano. Se sono coerenti, l’agente può muoversi con maggiore autonomia. Se si contraddicono, deve decidere quale fonte considerare autorevole. Se non abbiamo definito una gerarchia, quella decisione rischia di essere implicita.

### Source of truth

Una domanda centrale del context engineering è: **dove vive la verità operativa del progetto?**

Il requisito è nell’issue o nel documento di feature? Il contratto API è nel codice, in OpenAPI o in una wiki? La decisione architetturale è nel README o nell’ADR? Il comando di build corretto è quello documentato o quello che esegue davvero la CI? Una policy di sicurezza descrive ancora l’implementazione attuale oppure è rimasta indietro?

Un sistema con cinque fonti autorevoli che si contraddicono non ha più contesto. Ha rumore. Per questo un repository AI-ready deve essere anche un repository in cui le source of truth sono dichiarate e mantenute.

### Context quality > prompt cleverness

Un prompt brillante non può compensare completamente un contesto povero. Se il repository non documenta boundary, test, comandi, decisioni o convenzioni, possiamo scrivere una richiesta molto sofisticata e continuare comunque a chiedere all’agente di indovinare parti importanti del sistema.

Se invece il repository contiene una overview architetturale, decisioni attive, contratti, feature description, test rappresentativi e istruzioni operative, il task può essere più breve perché rimanda a fonti stabili. Abbiamo spostato conoscenza da un’interazione effimera a una memoria riutilizzabile.

> **La qualità dell’agente dipende spesso più dal contesto operativo che dalla brillantezza del singolo prompt.**

### Contesto minimo sufficiente

Anche il context engineering può degenerare. Possiamo riempire l’agente di documenti, policy, history ed esempi fino a creare un contesto enorme e contraddittorio. Più contesto non significa automaticamente contesto migliore.

Serve il **contesto minimo sufficiente** per prendere bene le decisioni richieste dal task. Una modifica locale può richiedere soltanto issue, modulo interessato, contract, test e convenzioni. Una decisione architetturale può aver bisogno anche di NFR, deployment model, security assumptions, cost constraint, ADR precedenti e roadmap.

Context engineering significa quindi anche selezione: non dare tutto ciò che sappiamo, ma rendere disponibile ciò che cambia la qualità della decisione.

### Context window e contesto organizzato

Una finestra di contesto molto grande non risolve da sola il problema. Possiamo caricare centinaia di file e sperare che il modello trovi ciò che serve, ma un repository ben organizzato fa qualcosa di più utile: rende esplicite le relazioni fra feature, contract, owner, ADR, test e impatto sul deployment.

Il contesto non deve essere soltanto disponibile. Deve essere **navigabile**.

### Tool access è contesto operativo

Un agente non è definito soltanto da ciò che sa, ma anche da ciò che può fare. Leggere il repository, modificare file, eseguire test, interrogare un database, accedere al cloud, aprire una pull request, fare deploy o leggere secret sono capability diverse con profili di rischio diversi.

Questi permessi fanno parte del context engineering perché cambiano il tipo di decisione che possiamo delegare. Un agente in sola lettura può essere usato con una tolleranza al rischio diversa da un agente capace di modificare produzione. Il contesto comprende quindi anche **capability e permission boundary**.

### Esempi come specifica implicita

Gli esempi sono una forma potente di contesto. Un’issue ben scritta, un ADR ben fatto o un test rappresentativo insegnano una convenzione senza bisogno di trasformarla in una lunga lista di regole astratte.

Ma gli esempi possono anche perpetuare errori. Un vecchio test copiato dieci volte diventa rapidamente uno pseudo-standard; un workaround storico può essere interpretato come il pattern preferito. Anche gli esempi devono quindi avere qualità e freshness.

### Documentation drift

La documentazione introduce un rischio inevitabile: il drift. Un documento obsoleto può essere peggiore dell’assenza di documentazione perché fornisce una falsa certezza.

Per questo non basta creare documenti. Dobbiamo progettare il modo in cui restano collegati al sistema. Documenti piccoli e vicini al codice, ADR con stato esplicito, contract generabili o validabili, test che esprimono invarianti architetturali, link tra feature e decisioni e ownership dei documenti critici sono tutte strategie che riducono la distanza tra descrizione e realtà. Anche la documentazione dovrebbe essere revisionata nello stesso change set quando il cambiamento la rende obsoleta.

> **Documentation is part of the architecture soltanto se rimane abbastanza affidabile da guidare decisioni.**

### Dal prompt al sistema operativo del progetto

L’evoluzione che ci interessa può essere riassunta così:

```text
prompt engineering
→ task engineering
→ context engineering
→ repository engineering
```

All’inizio ottimizziamo la singola richiesta. Poi impariamo a definire meglio il task, costruiamo un contesto riutilizzabile e infine trasformiamo il repository stesso in un ambiente in cui umani e agenti possono lavorare con meno ambiguità.

Questo tema tornerà in modo molto più approfondito nella parte AI-native del libro. Per ora ci serve una conclusione semplice:

> **Se dobbiamo spiegare da zero il progetto a ogni task, il problema non è soltanto il prompt. È l’architettura del contesto.**
