# Piano parlato — Software Architecture nell'era dell'AI

Queste note sono il racconto da usare come traccia. Non vanno riportate integralmente sulle slide.

## 1 — Software Architecture nell'era dell'AI

Aprire chiarendo che non è una presentazione su quale LLM usare o su come scrivere prompt. Il tema è più profondo: cosa cambia nel nostro mestiere quando una parte crescente dell'execution diventa economica e automatizzabile. La domanda guida è: **se cambia il costo fondamentale del software, quali delle nostre abitudini architetturali vanno rilette?**

## 2 — Una volta il codice costava

Raccontare l'esperienza personale. Per anni il collo di bottiglia era riuscire a produrre abbastanza codice: endpoint, mapping, validazione, accesso dati, test, configurazioni. Ogni feature chiedeva una quantità importante di lavoro manuale. Non era solo un problema di eleganza: era capacità produttiva.

## 3 — Scrivere meno era un vantaggio competitivo

Da questo contesto nascono molte pratiche che abbiamo imparato ad amare: DRY, riuso, astrazione, componentizzazione. Una riga non scritta dieci volte era tempo risparmiato dieci volte. Spiegare che questi principi non erano sbagliati: rispondevano anche a un costo economico molto concreto.

## 4 — Costruivamo macchine per scrivere software

Framework interni, scaffolding, code generation, wrapper e convenzioni erano spesso strumenti per comprimere il lavoro ripetitivo. Quando lo sviluppatore era il collo di bottiglia, costruire una macchina che generasse velocemente la plumbing aveva senso.

## 5 — Il mio Repository Pattern

Portare il caso personale. Avevi costruito un repository pattern che wrappava anche Entity Framework, con pipeline e convenzioni che permettevano di costruire API molto rapidamente. Il punto non è dire che fosse sbagliato. All'epoca risolveva un problema reale: non riuscire a stare dietro alla quantità di codice necessaria per ogni endpoint. Oggi chiedersi: se un agente può generare quel boilerplate in pochi minuti, ho ancora bisogno dello stesso livello di astrazione?

## 6 — Abbiamo confuso due obiettivi

Separare due obiettivi che per anni si sono spesso sovrapposti: **migliorare la qualità del design** e **ridurre il lavoro umano necessario per produrlo**. Un pattern può servire entrambi, ma non è garantito. Quando il costo del lavoro umano cambia, dobbiamo rivalutare le astrazioni create prevalentemente per la seconda ragione.

## 7 — Poi è cambiato il costo del codice

L'AI non rende il software facile. Rende più economica una parte dell'execution. Oggi posso specificare una feature e farmi produrre controller, service, test, mapping e integrazione con l'ORM. Il boilerplate esiste ancora, ma non pesa più nello stesso modo sulla produttività.

## 8 — La domanda cambia

Prima la domanda frequente era: “Come faccio a scrivere meno?”. Oggi diventa: **“Come faccio a rendere questo sistema facile da capire, verificare e modificare?”**. Questa è la transizione che guida tutto il resto della presentazione.

## 9 — L'astrazione ha un costo

Ogni interfaccia, factory, layer, mapper o wrapper introduce un salto mentale. Per capire una feature devo attraversare più file e ricostruire più relazioni. Per un agente questo significa consumare contesto e aumentare la possibilità di perdere un'invariante. L'astrazione continua a essere preziosa quando protegge qualcosa di importante; non deve essere automatica.

## 10 — Locality matters

Distinguere **duplicazione del codice** da **duplicazione della conoscenza**. Posso tollerare qualche riga simile se rende una feature leggibile localmente. Non posso permettere che una regola di business, per esempio “oltre 10.000 euro serve approvazione”, venga implementata in dodici posti con dodici varianti. La conoscenza deve avere un'autorità chiara.

## 11 — SOLID non è morto. Va riletto.

Single Responsibility continua a essere fondamentale: rende chiaro cosa fa un componente. Dependency Inversion resta prezioso nei boundary veri. Ma creare un'interfaccia per ogni classe o cinque livelli di estensione per un cambiamento ipotetico può essere solo rituale. **Il principio resta. L'applicazione meccanica no.**

## 12 — Every abstraction must pay rent

Ogni astrazione deve pagare l'affitto. Deve nascondere vera complessità, proteggere un boundary, rappresentare una regola di dominio, isolare una dipendenza instabile o migliorare testabilità e sicurezza. “Perché facciamo sempre così” non è una motivazione architetturale.

## 13 — Il componente universale

Richiamare l'esperienza frontend: il componente che wrappa tutto e con tre proprietà dovrebbe fare qualsiasi cosa. All'inizio dà velocità; poi arriva una feature che la libreria originale supporta, il wrapper no, e iniziamo a mantenere una seconda piattaforma. Spesso l'astrazione universale aumenta il lavoro invece di ridurlo.

## 14 — Non wrappare ciò che non hai capito

Raccontare la lezione imparata: a volte wrappiamo una tecnologia non perché serva una boundary, ma perché non vogliamo impararla fino in fondo. Il wrapper diventa un modo per ridurre la superficie che dobbiamo comprendere, ma ci lega a una semplificazione costruita da noi.

## 15 — L'AI legge il manuale

Non dire che l'AI non sbaglia. Dire che ha abbassato enormemente il costo di leggere molta documentazione prima di procedere per tentativi. Ricordare il comportamento storico: prima risposta di Stack Overflow, prove, debugging per ore o giorni, poi si scopre che la documentazione ufficiale spiegava esattamente il comportamento. Oggi possiamo chiedere all'agente di studiare prima la documentazione ufficiale e confrontarla con il nostro caso.

## 16 — Use the platform

Prima di costruire una nostra astrazione sopra Entity Framework, React, Azure, Kubernetes o qualsiasi piattaforma, proviamo davvero a usarla come è stata progettata. L'AI rende più facile apprendere API e pattern ufficiali, quindi diminuisce uno dei motivi storici per costruire wrapper interni.

## 17 — Non abbiamo mai sviluppato da soli

Correggere la narrativa “prima eravamo soli, oggi abbiamo l'AI”. Non siamo mai stati soli: framework, librerie, open source, colleghi, codice legacy, Stack Overflow. Il software è sempre stato collaborazione, spesso asincrona e differita nel tempo.

## 18 — Vediamo il risultato. Non vediamo il contesto.

Quante volte apriamo codice altrui e pensiamo: “Perché l'ha fatto così? Io l'avrei fatto diversamente”. È un comportamento umano. Vediamo il risultato ma non i vincoli: deadline, compatibilità legacy, incidente, cliente, libreria disponibile in quel momento, requisiti poi rimossi.

## 19 — Il codice conserva la decisione. Non sempre il perché.

Una classe può mostrare **cosa** è stato deciso ma non **perché**. Da qui il valore di ADR, issue, PR, documentazione, test e history. Non sono burocrazia se permettono di ricostruire le forze che hanno portato a una scelta.

## 20 — Capire costa fatica

Noi non abbiamo una context window infinita. E, soprattutto, spesso non abbiamo voglia di riempirla. Ricostruire tutto richiede leggere repository, ticket, documentazione e commit history. Per problemi piccoli o modifiche apparentemente semplici tendiamo a giudicare localmente e agire subito.

## 21 — L'AI può ricostruire il perché

Qui l'AI porta un vantaggio reale. Può analizzare repository, issue, PR, ADR, test e documentazione e aiutarci a ricostruire la storia prima di modificare il codice. Un prompt utile non è “refactor this class”, ma: “prima spiegami perché esiste, chi la usa, quali invarianti protegge e cosa rischio di rompere”.

## 22 — Meno dipinto. Più linguaggio comune.

Per anni ogni developer ha avuto una firma: propria struttura, propri helper, proprio framework interno, propri modi di fare le cose. Oggi aumenta il valore della prevedibilità. L'originalità non deve sparire, ma spostarsi dalle eccentricità della struttura alle decisioni che contano.

## 23 — Standardizzare è comprimere contesto

Una struttura convenzionale riduce ciò che bisogna spiegare. Naming chiaro, pattern noti, framework usati in modo idiomatico e repository coerenti permettono a un collega, a noi stessi tra sei mesi e a un agente di orientarsi più velocemente. **La standardizzazione è una forma di context compression.**

## 24 — Meno creatività nella plumbing. Più creatività nelle decisioni.

La creatività non deve stare nel reinventare il repository o il sistema di dependency injection. Deve stare nel capire il problema meglio degli altri, trovare il boundary corretto, semplificare un flusso, progettare una soluzione più resiliente, economica o comprensibile.

## 25 — Boring code is good code

Il codice noioso è prevedibile. Usa il framework come previsto, ha pochi livelli, naming esplicito e poca sorpresa. Non significa codice mediocre. Significa codice il cui comportamento è facile da ricostruire. Nell'era degli agenti questo diventa ancora più prezioso.

## 26 — Il pair programming sembrava uno spreco

Raccontare l'esperienza personale: quando proponevi pair programming, veniva percepito come due persone pagate per fare il lavoro di una. La produttività era misurata soprattutto in output individuale e righe prodotte.

## 27 — Oggi lavoriamo sempre in coppia

Oggi siamo quasi sempre in pair programming: noi e l'agente di turno. Uno propone, l'altro verifica; uno implementa, l'altro dirige; uno cerca, l'altro decide. Non è identico al pair programming umano, ma il modello operativo è molto simile.

## 28 — Driver / Navigator

Riprendere i ruoli classici. A volte l'agente è Driver: implementa mentre noi siamo Navigator e controlliamo direzione, architettura, edge case. A volte siamo noi Driver e l'agente fa review, ricerca, test o critica. La relazione è dinamica. Il problema nasce quando entrambi improvvisano senza una direzione condivisa.

## 29 — AI-readable architecture

Una buona architettura deve essere human-readable e AI-readable. Boundary chiari, naming, contratti, test, ADR, README e AGENTS.md riducono ambiguità. Non stiamo scrivendo “perché l'AI è stupida”; stiamo finalmente rendendo esplicite cose che aiutano anche gli esseri umani.

## 30 — Prima ottimizzavamo le dita. Ora ottimizziamo il contesto.

Una volta riducevamo il numero di righe da battere. Oggi dobbiamo ridurre il numero di informazioni che bisogna inseguire per capire una decisione. È una sintesi efficace del passaggio dal codice come scarsità al contesto come scarsità.

## 31 — Il nuovo costo è capire

La software architecture non perde importanza perché l'AI scrive codice. Ne acquista, perché possiamo produrre molto più software di quanto una singola persona possa leggere integralmente. Il problema non è più solo generare: è governare, verificare, modificare senza perdere il controllo.

## 32 — Sii il pilota, non il copilota

Collegare al libro. Gli strumenti si chiamano spesso Copilot, ma noi non dobbiamo diventare copiloti della nostra AI. Essere pilota non significa toccare ogni comando. Significa conoscere destinazione, stato, automazione attiva, limiti e condizioni di intervento. L'AI esegue; direzione, judgment e responsabilità restano a noi.

## 33 — Alla fine, cosa rimane?

Transizione al decalogo. Abbiamo parlato di SOLID, wrapper, documentazione, pair programming, agenti, standardizzazione e responsabilità. Sembrano temi diversi, ma derivano dallo stesso cambiamento: execution abbondante, judgment scarso. Ora condensiamo tutto in dieci principi.

## 34 — I — Non avrai altra architettura all'infuori del problema

Prima il problema reale. Tecnologia, pattern, cloud e AI vengono dopo. Se partiamo dalla soluzione che vogliamo usare troveremo quasi sempre un modo per raccontarci che il problema la richiedeva. Partire da outcome, vincoli, proprietà necessarie ed evidence.

## 35 — II — Non nominerai “requisito” invano

“Scalabile”, “sicuro”, “resiliente”, “performante” sono aggettivi. Diventano requisiti quando sappiamo cosa significano nel nostro sistema e come verificarli. Le property hanno un costo: dobbiamo sapere cosa stiamo comprando.

## 36 — III — Ricordati di santificare l'evidence

Designed non significa verified. Un diagramma non dimostra il runtime; un test non dimostra ciò che non osserva. Usare la catena: Designed → Codified → Verified → Monitored. La confidence è utile; l'evidence è migliore.

## 37 — IV — Onora il dominio e chi ne possiede la verità

Comprendere il business prima di ridurlo a endpoint, tabelle ed eventi. Copiare un dato non trasferisce ownership. Implementare una business rule non autorizza il team tecnico a inventarla. La comprensione del prodotto non può essere delegata a un singolo ruolo.

## 38 — V — Non uccidere la semplicità

Ogni servizio, database, queue, cache, layer, pattern, framework e agente deve guadagnarsi il diritto di esistere. La semplicità non è assenza di architettura: è complessità con un lavoro riconoscibile.

## 39 — VI — Non commettere complessità senza necessità

Microservizi, Kubernetes, CQRS, RAG, vector database e multi-agent non rendono moderna una decisione. Una tecnologia vecchia può essere la scelta più moderna. **Il fit prima della moda.**

## 40 — VII — Non rubare la responsabilità al suo proprietario

Possiamo delegare discovery, implementation, test e review. Non trasferiamo automaticamente judgment, authority e accountability. Inserire il corollario di controllo: **se davanti a un errore la giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato troppo.**

## 41 — VIII — Non dare falsa testimonianza sulla qualità del tuo sistema

Un build verde non dimostra ciò che non è stato verificato. Un backup configurato non è un restore testato. Una dashboard non è observability. Pretendere evidence proporzionata alla promessa fatta sul sistema.

## 42 — IX — Non desiderare l'architettura d'altri

Netflix, Amazon, GitHub, Microsoft o il team accanto possono aver preso ottime decisioni per il proprio problema. Studiare gli altri è utile; copiarli senza avere le stesse forze è cargo cult. Domanda corretta: “Quale forza li ha portati lì, e quella forza esiste anche qui?”.

## 43 — X — Non desiderare più autonomia di quanta tu possa governare

Capability, permission, authorization e autonomy sono diverse. Più execution non richiede automaticamente più autonomia. Richiede context migliore, boundary più chiari, verification più forte e stop condition. Prima sincronizzare il pensiero, poi parallelizzare l'esecuzione.

## 44 — L'AI può scrivere il codice. Il timone resta a noi.

Chiudere senza fretta. Essere al timone non significa scrivere ogni riga o toccare ogni comando. Significa mantenere abbastanza comprensione per sapere dove stiamo andando, perché, con quali limiti, quale evidence, quando fermarci e quando cambiare rotta. Ultima frase, esattamente come nel libro: **“L'AI può scrivere il codice. Il timone resta a noi.”**
