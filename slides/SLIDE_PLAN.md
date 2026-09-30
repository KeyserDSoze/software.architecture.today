# Piano slide — Software Architecture nell'era dell'AI

**Durata target:** 40 minuti  
**Formato:** 16:9, immagini full-bleed, testo minimo  
**Visual language:** dark / charcoal, giallo caldo come colore primario, bianco sporco per il testo, fotografia/astrazione cinematografica, molto contrasto  
**Regola:** una sola idea per slide. Il contenuto vive nel parlato; la slide deve evocare e ancorare il concetto.

## Atto I — Il costo del codice è cambiato

| # | Titolo slide | Messaggio | Visual evocativo | Tempo |
|---|---|---|---|---|
| 1 | Software Architecture nell'era dell'AI | Apertura. Non un corso sui tool, ma su come cambia il motivo per cui facciamo architettura. | Città/sistema digitale al buio con una singola rotta gialla | 0:30 |
| 2 | Una volta il codice costava | Il collo di bottiglia era produrre abbastanza software. | Officina notturna con moltissimi fogli/codice da produrre | 1:00 |
| 3 | Scrivere meno era un vantaggio competitivo | DRY, riuso e astrazione riducevano lavoro umano e time-to-market. | Una sola sorgente che alimenta molte diramazioni | 1:00 |
| 4 | Costruivamo macchine per scrivere software | Framework interni, scaffolding, generatori, wrapper: strumenti per comprimere lavoro ripetitivo. | Macchina industriale che sforna componenti software | 1:00 |
| 5 | Il mio Repository Pattern | Caso personale: wrapper di Entity Framework e pipeline per creare API molto velocemente. | Strati concentrici attorno a un database, come una macchina costruita sopra una macchina | 1:30 |
| 6 | Abbiamo confuso due obiettivi | Qualità del design e riduzione del lavoro umano spesso coincidevano. Non sono la stessa cosa. | Due strade sovrapposte che iniziano insieme e poi divergono | 1:00 |
| 7 | Poi è cambiato il costo del codice | L'AI rende economica una parte crescente dell'execution. | Linea di produzione automatizzata con agenti luminosi | 1:00 |
| 8 | La domanda cambia | Da “come scrivo meno?” a “come rendo il sistema comprensibile, verificabile e modificabile?”. | Bilancia: poche righe vs mappa comprensibile del sistema | 1:00 |

## Atto II — Astrazioni, SOLID e wrapper: cosa resta e cosa cambia

| # | Titolo slide | Messaggio | Visual evocativo | Tempo |
|---|---|---|---|---|
| 9 | L'astrazione ha un costo | Ogni layer aggiunge salti mentali, file da attraversare e contesto da ricostruire. | Labirinto di porte/file con una sola luce gialla in fondo | 1:15 |
| 10 | Locality matters | Le cose che cambiano insieme devono essere comprensibili insieme. | Blocchi vicini con connessioni corte vs elementi dispersi | 1:15 |
| 11 | SOLID non è morto. Va riletto. | I principi restano utili; cambia il costo e il motivo delle loro applicazioni rituali. | Monumento classico illuminato da una luce moderna | 1:00 |
| 12 | Every abstraction must pay rent | Ogni astrazione deve giustificare la propria esistenza con valore reale. | Grattacielo scuro: ogni piano acceso deve “pagare” la propria luce | 1:00 |
| 13 | Il componente universale | Il sogno del wrapper che con tre parametri fa tutto spesso diventa una seconda piattaforma da mantenere. | Un coltellino svizzero enorme e ingestibile | 1:15 |
| 14 | Non wrappare ciò che non hai capito | A volte il wrapper nasconde la nostra scarsa conoscenza della libreria, non una vera boundary. | Scatola nera avvolta da altre scatole | 1:15 |
| 15 | L'AI legge il manuale | L'AI riduce il costo di studiare documentazione e API ufficiali prima di procedere per tentativi. | Biblioteca/documentazione attraversata da un fascio giallo di ricerca | 1:00 |
| 16 | Use the platform | Prima di inventare una nuova astrazione, usa davvero il framework nel modo previsto. | Mano che inserisce un componente direttamente nel suo alloggiamento corretto | 1:00 |

## Atto III — Non abbiamo mai sviluppato da soli

| # | Titolo slide | Messaggio | Visual evocativo | Tempo |
|---|---|---|---|---|
| 17 | Non abbiamo mai sviluppato da soli | Framework, librerie, colleghi, open source: il software è sempre stato collaborazione differita. | Molte mani diverse che lavorano sullo stesso sistema | 1:00 |
| 18 | Vediamo il risultato. Non vediamo il contesto. | Quando leggiamo codice altrui giudichiamo spesso senza conoscere vincoli, storia e decisioni. | Iceberg: codice visibile sopra, enorme contesto sotto | 1:00 |
| 19 | Il codice conserva la decisione. Non sempre il perché. | Il “perché” deve diventare parte del repository: ADR, documentazione, history, test. | Fossile/strato geologico con decisione visibile e storia nascosta | 1:00 |
| 20 | Capire costa fatica | Gli esseri umani hanno context window limitata e spesso non ricostruiscono tutto prima di giudicare. | Persona davanti a una parete enorme di documenti/connessioni | 1:00 |
| 21 | L'AI può ricostruire il perché | Repository, issue, PR, docs e test possono diventare contesto interrogabile prima di modificare il codice. | Agente che ricostruisce una timeline da frammenti sparsi | 1:00 |
| 22 | Meno dipinto. Più linguaggio comune. | L'originalità non deve stare nella struttura eccentrica del repository. Servono convenzioni riconoscibili. | Dipinto astratto che si trasforma in blueprint ordinato | 1:00 |
| 23 | Standardizzare è comprimere contesto | Naming, pattern e struttura standard riducono ciò che umano e agente devono inferire. | File/cartelle che si comprimono in una mappa semplice | 1:00 |
| 24 | Meno creatività nella plumbing. Più creatività nelle decisioni. | La creatività va spostata sul problema, sui trade-off e sulle scelte, non sul reinventare infrastruttura. | Tubature industriali semplici sotto, luce creativa sopra su una mappa decisionale | 1:00 |
| 25 | Boring code is good code | Codice prevedibile, idiomatico e poco sorprendente è più facile da mantenere e da far comprendere agli agenti. | Corridoio pulito, modulare, ripetibile, con segnaletica chiara | 1:00 |
| 26 | Il pair programming sembrava uno spreco | Due persone sullo stesso problema venivano viste come duplicazione di costo. | Due sedie davanti a un unico monitor in una stanza vuota | 1:15 |
| 27 | Oggi lavoriamo sempre in coppia | Noi + agente: delega, review, ricerca, implementazione, testing. | Due postazioni affiancate: umano e presenza digitale | 1:15 |
| 28 | Driver / Navigator | I ruoli si scambiano: a volte guida l'umano, a volte esegue l'agente; la direzione resta condivisa e governata. | Cabina di pilotaggio con due ruoli distinti | 1:00 |
| 29 | AI-readable architecture | Boundary, naming, contratti, test, ADR, README e AGENTS.md rendono il sistema leggibile da umani e agenti. | Architettura trasparente con percorsi e confini illuminati | 1:00 |
| 30 | Prima ottimizzavamo le dita. Ora ottimizziamo il contesto. | Il nuovo collo di bottiglia non è battere codice, ma capire cosa cambiare senza rompere il sistema. | Tastiera che sfuma in una mappa di contesto | 1:00 |
| 31 | Il nuovo costo è capire | Possiamo generare più software di quanto siamo in grado di governare. Qui l'architettura acquista peso. | Onda enorme di codice davanti a una piccola torre di controllo | 1:00 |

## Atto IV — Il pilota e i Dieci comandamenti

| # | Titolo slide | Messaggio | Visual evocativo | Tempo |
|---|---|---|---|---|
| 32 | Sii il pilota, non il copilota | L'AI può eseguire; direzione, judgment e responsabilità restano al professionista. | Pilota umano con cockpit automatico e rotta gialla | 1:00 |
| 33 | Alla fine, cosa rimane? | Tutto il corso converge in principi semplici che condensano il metodo. | Dieci monoliti/stele in controluce | 0:30 |
| 34 | I — Non avrai altra architettura all'infuori del problema | Problema e outcome prima di tecnologia, pattern, cloud e AI. | Bussola puntata sul problema, non sulla tecnologia | 0:25 |
| 35 | II — Non nominerai “requisito” invano | Gli aggettivi non sono requisiti finché non diventano proprietà verificabili. | Parole vaghe che diventano misure concrete | 0:25 |
| 36 | III — Ricordati di santificare l'evidence | Designed ≠ verified. La confidence non sostituisce le prove. | Catena Designed → Codified → Verified → Monitored | 0:25 |
| 37 | IV — Onora il dominio e chi ne possiede la verità | Comprendere business, ownership e decision authority prima di ridurre tutto a tabelle ed endpoint. | Mappa del dominio con un nucleo luminoso | 0:25 |
| 38 | V — Non uccidere la semplicità | Ogni componente deve guadagnarsi il diritto di esistere. | Una macchina semplice accanto a una inutilmente complessa | 0:25 |
| 39 | VI — Non commettere complessità senza necessità | Il fit prima della moda. | Vetrina di tecnologie luccicanti vs soluzione semplice illuminata | 0:25 |
| 40 | VII — Non rubare la responsabilità al suo proprietario | Delegare execution non significa delegare accountability. | Firma umana su un output generato | 0:25 |
| 41 | VIII — Non dare falsa testimonianza sulla qualità del tuo sistema | Build verde e documenti non dimostrano ciò che non è stato verificato. | Spia verde davanti a un sistema con zone ancora oscure | 0:25 |
| 42 | IX — Non desiderare l'architettura d'altri | Studiare le architetture altrui sì; copiarle senza condividere le stesse forze è cargo cult. | Skyline diverse con fondamenta e carichi differenti | 0:25 |
| 43 | X — Non desiderare più autonomia di quanta tu possa governare | Più execution richiede più contesto, boundary, verification e stop condition. | Molti agenti dietro un unico pannello di controllo | 0:30 |
| 44 | L'AI può scrivere il codice. Il timone resta a noi. | Chiusura. Essere al timone non significa toccare ogni comando, ma sapere dove stiamo andando e quando intervenire. | Nave/cockpit nel buio con rotta gialla verso l'orizzonte | 1:00 |

## Ritmo complessivo

- **0–8 min:** perché certe pratiche sono nate e perché il costo del codice è cambiato.
- **8–18 min:** SOLID, astrazioni, wrapper e nuova economia della comprensione.
- **18–31 min:** collaborazione, standardizzazione, pair programming permanente e AI-readable architecture.
- **31–40 min:** pilota, decalogo, accountability e chiusura.

## Linea visuale

- Background principale: `#0B0D10` / `#111318`.
- Giallo primario: `#F5C542` o `#FFC928`.
- Testo: `#F5F2E8`.
- Grigio secondario: `#A6ABB4`.
- Evitare gradienti vistosi, neon multicolore, UI finte troppo dettagliate.
- Immagini quasi sempre full screen con overlay nero 20–45% per proteggere la leggibilità.
- Titoli grandi, 32–46 pt, massimo due righe.
- Roman numerals enormi nelle slide 34–43.
- Logo/branding minimo: nome autore e repository solo in apertura e chiusura.
