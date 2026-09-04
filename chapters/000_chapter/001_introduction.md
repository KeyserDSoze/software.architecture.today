# Capitolo 0 — Al timone

> **Nota editoriale sui casi del libro.** In queste pagine distingueremo sempre tra **casi reali documentati** e **casi simulati/compositi**. I primi riguardano organizzazioni, incidenti, architetture o pratiche sostenuti da fonti pubbliche attendibili. I secondi sono costruiti a fini didattici: nomi, numeri e circostanze possono essere inventati o combinare dinamiche plausibili. Un caso simulato serve a ragionare; non verrà mai presentato come cronaca.

## Il software non è diventato facile

Immaginiamo una scena che, fino a poco tempo fa, sarebbe sembrata esagerata. Un team deve aggiungere una nuova funzionalità a un prodotto esistente e, nel giro di poche ore, un agente esplora il repository, individua i punti di estensione, propone un piano, modifica backend e frontend, aggiunge una migration, aggiorna alcuni test, apre una pull request e prepara persino una descrizione ragionevole del cambiamento. La demo funziona e la feature sembra pronta.

Poi qualcuno chiede: “Perché abbiamo modificato proprio questa parte del sistema?”. Nessuno ha una risposta convincente. Arriva una seconda domanda: “Che cosa succede se la migration viene applicata mentre due versioni dell'applicazione sono contemporaneamente in produzione?”. Di nuovo, il ragionamento non è immediatamente disponibile. Quando qualcuno domanda se il servizio possa essere chiamato due volte per la stessa operazione, il team finisce per aprire il codice e la conversazione con l'agente, cercando di ricostruire a posteriori le decisioni che hanno prodotto una soluzione già implementata.

A quel punto il problema non è che il codice sia stato scritto da un'AI. Il problema è che **il codice è arrivato prima della comprensione condivisa del sistema che stavamo cambiando**. Questa distinzione attraverserà tutto il libro.

Il software non è diventato facile; è diventato più facile **produrre software**. Sono due affermazioni molto diverse. Scrivere una funzione, generare un'API, aggiungere test, creare un container, preparare una pipeline, cercare una dipendenza o modificare cento file sono attività che possono diventare drasticamente più veloci quando una parte dell'esecuzione viene affidata a sistemi artificiali. Ma un sistema software non è la somma dei file che contiene: è un insieme di decisioni che interagiscono nel tempo.

Decidiamo dove mettere lo stato e quali componenti possono dipendere da quali altri. Decidiamo quale dato è autorevole, che cosa deve succedere quando un servizio non risponde e quali operazioni possono essere ripetute senza produrre effetti indesiderati. Decidiamo che cosa possiamo perdere, quanto downtime possiamo accettare, chi può accedere a una risorsa, come cambieremo uno schema e quali segnali useremo per capire che qualcosa si è rotto. Molte di queste decisioni non sono visibili in una demo, e alcune diventano costose soltanto mesi dopo.

### Il nuovo collo di bottiglia

Per molto tempo una parte importante del costo del software è stata l'esecuzione materiale del lavoro. Avevamo una specifica e servivano giorni per implementarla; avevamo un repository sconosciuto e servivano ore per orientarsi; avevamo bisogno di test e qualcuno doveva scriverli. Anche confrontare due approcci poteva essere costoso, perché spesso ne implementavamo uno soltanto per evitare di pagare due volte il costo dell'esplorazione.

Quando questi costi scendono, una parte del processo diventa davvero più semplice. Possiamo esplorare più alternative, automatizzare lavori ripetitivi, produrre prototipi rapidamente e chiedere una seconda opinione quasi a costo marginale. Possiamo delegare task che prima avrebbero occupato ore di lavoro manuale. Ma ogni aumento di capacità sposta anche il punto in cui possiamo fare danni.

Se generare una modifica repository-wide richiede pochi minuti, il costo di **iniziare la modifica sbagliata** diventa proporzionalmente più importante. Se produrre cinquanta test è facile, conta di più sapere se quei test stanno proteggendo il comportamento che ci interessa. Se creare un nuovo servizio è semplice, diventa essenziale chiedersi se il servizio debba esistere. E se un agente può applicare autonomamente una migration, il problema non è più soltanto scrivere bene la migration: è aver stabilito prima quando l'agente debba fermarsi.

La scarsità non scompare: si sposta.

> **Quando l'execution diventa abbondante, il judgment diventa più prezioso.**

Da qui nasce una delle tesi centrali del libro:

> **Nell'era dell'AI il codice costa meno, ma le decisioni sbagliate costano di più.**

Non perché ogni decisione architetturale sia improvvisamente più difficile, ma perché possiamo trasformare una cattiva decisione in moltissimo output con una velocità che prima non avevamo.

### La demo è il momento più pericoloso

Una demo funzionante produce una sensazione potente: *ci siamo quasi*. Il bottone risponde, i dati compaiono, l'API restituisce `200`, il container parte e il test passa. È un momento utile, ma può diventare una forma di falsa confidenza, perché un sistema pronto per una demo e un sistema pronto per la produzione sono due oggetti diversi.

La demo ci dice che un percorso ha funzionato almeno una volta nelle condizioni che abbiamo appena osservato. La produzione ci chiede di capire che cosa accade quando due richieste arrivano insieme o quando una dipendenza rallenta; se una richiesta può essere ripetuta senza duplicare effetti; quali dati possiamo permetterci di perdere e come possiamo tornare indietro. Ci chiede di sapere chi può leggere o modificare un'informazione, come scoprire un errore che non genera un'eccezione, come il sistema reagirà al carico e quanto costerà tenerlo acceso. E ci chiede ancora chi interverrà quando qualcosa andrà storto e se fra sei mesi saremo in grado di cambiare la decisione presa oggi.

L'AI tende a rendere spettacolare la distanza percorsa nei primi minuti. L'architettura serve anche a ricordarci la distanza che resta.

### Non stiamo difendendo il codice scritto a mano

Sarebbe facile leggere queste pagine come una difesa nostalgica di un modo precedente di lavorare, ma non è questo il punto. Non c'è alcun premio professionale per aver digitato personalmente più caratteri. Se un agente può produrre in cinque minuti un adapter che avremmo scritto in un'ora, non esiste una virtù particolare nel rifiutare quel vantaggio; lo stesso vale quando può generare i primi test, proporre alternative, cercare riferimenti nel repository o preparare un refactoring meccanico.

Il problema non è delegare l'esecuzione. Il problema è delegare, insieme all'esecuzione, **la comprensione necessaria per governarne le conseguenze**.

Un software engineer che usa bene l'AI potrebbe scrivere personalmente meno codice di prima e, nello stesso tempo, dover conoscere più cose. Deve saper leggere ciò che viene prodotto, riconoscere una cattiva astrazione e capire un failure mode distribuito. Deve distinguere un requisito da un aggettivo, capire quando un database è parte del problema e quando lo è il contratto attorno al database, valutare una decisione di sicurezza anche se non ha scritto personalmente il middleware e conoscere abbastanza networking, dati, cloud, testing e operations da non considerare il proprio rettangolo del diagramma come l'intero sistema.

La competenza cambia forma; non sparisce.

### Dal produttore al governatore

Nel modello tradizionale immaginiamo spesso l'engineer come produttore diretto di artefatti:

```text
requisito
   ↓
engineer
   ↓
codice
   ↓
test
   ↓
deployment
```

Nel lavoro AI-native, lo stesso engineer può trovarsi a governare un sistema molto più ampio:

```text
                ┌───────────────┐
                │   Obiettivo   │
                └───────┬───────┘
                        │
                ┌───────▼───────┐
                │   Contesto    │
                └───────┬───────┘
                        │
           ┌────────────▼────────────┐
           │ Decisioni e contratti  │
           └────────────┬────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  coding agent     testing agent   review agent
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                 verifica umana
                        │
                        ▼
                    decisione
```

Il valore dell'engineer non è più soltanto nel numero di passaggi che esegue personalmente, ma nella qualità del sistema di lavoro che costruisce attorno all'esecuzione. Questo richiede competenze che assomigliano, per alcuni aspetti, a quelle di un manager: definire obiettivi, distribuire responsabilità, fornire contesto, stabilire acceptance criteria, osservare avanzamento, gestire eccezioni, integrare contributi diversi e fermare il lavoro quando il rischio supera ciò che era stato previsto.

C'è però una differenza fondamentale: gli agenti non sono colleghi umani più veloci. Non hanno automaticamente la stessa comprensione del contesto, la stessa memoria organizzativa, la stessa percezione del rischio o la stessa responsabilità sulle conseguenze. Per questo li tratteremo come **esecutori estremamente veloci, non come oracoli onniscienti**.

### La domanda che viene prima del prompt

Una delle tentazioni più forti del nuovo tooling è cominciare da ciò che è più facile fare: aprire la chat e scrivere “Costruiscimi l'architettura per…” oppure “Implementa questa feature”. La velocità della risposta ci premia immediatamente con diagrammi, codice, liste di servizi e tabelle di confronto. Il rischio è confondere la velocità con cui abbiamo ottenuto una risposta con la qualità della domanda che l'ha generata.

Prima del prompt viene il problema; prima del diagramma vengono gli outcome e i vincoli; prima del pattern viene la forza che quel pattern dovrebbe governare. Prima del microservizio viene il confine che pensiamo meriti autonomia, prima del database vengono il modello di dato e la semantica delle operazioni, e prima dell'automazione viene il criterio con cui sapremo se l'automazione ha fatto la cosa giusta.

Il workflow che cercheremo di costruire lungo il libro assomiglia quindi a questo:

```text
problema
→ contesto
→ requisiti
→ vincoli
→ alternative
→ decisioni
→ architettura
→ contratti
→ lavoro delegabile
→ execution
→ verifica
→ produzione
→ feedback
```

Non perché ogni progetto debba produrre una montagna di documentazione prima di scrivere una riga di codice, ma perché **la capacità di andare veloce rende ancora più importante sapere in quale direzione stiamo andando**.

### Il contratto di questo libro

Questo libro parlerà di software design, sistemi distribuiti, dati, API, cloud, security, reliability, observability, testing, legacy, refactoring, costi e agenti. Non li tratterà però come capitoli indipendenti di un catalogo tecnologico: li userà come parti dello stesso problema, quello di prendere decisioni sotto vincoli e costruire sistemi che continuino a funzionare quando incontrano il mondo reale.

Per questo torneremo spesso a una stessa serie di domande. Qui la forma di elenco è intenzionale, perché queste domande costituiscono una vera checklist di decisione che il lettore potrà riutilizzare lungo tutto il libro:

1. Quale problema stiamo risolvendo?
2. Per chi?
3. Quali vincoli contano davvero?
4. Quali alternative abbiamo?
5. Che cosa stiamo pagando con questa scelta?
6. Come può fallire?
7. Come ce ne accorgiamo?
8. Come la verifichiamo?
9. Come la cambieremo?
10. Chi se ne assume la responsabilità?

La Software Architecture, in questo libro, non sarà l'arte di disegnare scatole e frecce. Sarà il sistema con cui rendiamo esplicite le decisioni che hanno conseguenze importanti e costose da ignorare. E il punto di partenza sarà sempre lo stesso:

> **L'AI può scrivere il codice. Il timone resta a noi.**
