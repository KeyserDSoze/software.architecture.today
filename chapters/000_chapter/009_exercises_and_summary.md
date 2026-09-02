## Idee chiave, esercizi e autovalutazione

Il Capitolo 0 non vuole insegnare una tecnologia.

Vuole stabilire il modo in cui useremo tutte le tecnologie che verranno dopo.

Prima di parlare di requisiti, modularità, distributed systems, cloud, security o agentic architecture, dobbiamo chiarire chi prende le decisioni e come costruiamo fiducia nel lavoro prodotto.

### Idee chiave

1. **Il software non è diventato facile. È diventato più facile produrre software.**
2. Quando l'execution diventa abbondante, il valore si sposta verso judgment, contesto, verifica e responsabilità.
3. **Sii il pilota, non il copilota.** L'AI può eseguire molto lavoro senza diventare proprietaria dell'intento.
4. Un manager di agenti non è un dispatcher: deve saper scomporre il problema preservando semantica, vincoli e dipendenze.
5. **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**
6. Shared context, contratti e architecture boundaries riducono l'entropia del lavoro parallelo.
7. Delegare execution non significa delegare accountability.
8. Se davanti a un errore la giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato anche una parte della comprensione che dovevamo mantenere.
9. La verifica non deve consistere nel rifare tutto a mano: test, invarianti, contracts, diff, scan e osservabilità permettono di costruire fiducia senza re-execution completa.
10. Più autonomia concediamo, più forti devono diventare guardrail e verificabilità.
11. Le stop condition sono una feature, non un fallimento del workflow.
12. Il livello di autonomia deve essere proporzionato a blast radius, reversibilità, criticità, osservabilità e testabilità.
13. L'AI può aumentare produttività prima della competenza. Questo rende il deskilling un rischio reale.
14. **Non utilizzare l'AI per sembrare più senior. Utilizzala per diventarlo.**
15. Un repository AI-ready non contiene soltanto codice: contiene abbastanza contesto da rendere le decisioni importanti meno dipendenti dall'inferenza.

### Artefatti operativi introdotti

Questo capitolo introduce due artefatti.

#### Agent Delegation Contract

Serve a definire obiettivo, scope, vincoli, acceptance criteria, permissions e stop condition prima di una delega significativa.

#### Agent Verification Bundle

Serve a consegnare insieme al risultato anche l'evidenza necessaria per giudicarlo: test, assunzioni, rischi, unresolved questions e recovery strategy.

Non devono essere usati per ogni task.

Sono strumenti da attivare quando il rischio li rende utili.

---

## Esercizi

### Esercizio 1 — Dalla richiesta alla delega

Ricevi questa richiesta:

> “Aggiungi caching alla nostra API degli ordini perché il database è lento.”

Non implementare nulla.

Produci un **Agent Delegation Contract** che renda il task delegabile.

Devi chiarire almeno:

- outcome desiderato;
- dati che possono essere messi in cache;
- requisiti di coerenza;
- tenant isolation;
- invalidazione;
- failure behavior;
- acceptance criteria;
- stop condition.

Poi chiedi a un'AI di criticare il tuo contract.

Non chiederle di riscriverlo subito.

Chiedile prima di elencare le decisioni che stai implicitamente lasciando all'esecutore.

### Esercizio 2 — Review di una modifica che “funziona”

Prendi una pull request reale o simulata che passa tutti i test.

Analizzala senza concentrarti inizialmente sullo stile del codice.

Costruisci una tabella con quattro colonne:

| Modifica | Nuova assunzione | Possibile failure mode | Evidenza disponibile |
| --- | --- | --- | --- |

Individua almeno cinque assunzioni.

Per ciascuna chiediti se i test verdi dimostrano davvero ciò che credi.

### Esercizio 3 — Definire invarianti

Scegli una feature del tuo progetto.

Scrivi almeno cinque proprietà che devono rimanere vere indipendentemente dall'implementazione.

Esempi di categorie:

- sicurezza;
- consistenza;
- autorizzazione;
- idempotenza;
- compatibilità;
- limiti economici;
- correttezza del dominio.

Per ogni invariante proponi un modo concreto per verificarla.

### Esercizio 4 — Autonomy matrix

Scegli cinque tipi di task:

- aggiornamento documentazione;
- refactoring locale;
- nuova endpoint;
- migration database;
- modifica al sistema di autorizzazione.

Per ognuno assegna un livello di autonomia da 0 a 5.

Giustifica la scelta usando almeno:

- blast radius;
- reversibilità;
- osservabilità;
- testabilità;
- criticità.

Poi prova a cambiare un vincolo.

Per esempio: “il sistema è interno e completamente sandboxato”.

Verifica se il livello di autonomia cambia.

### Esercizio 5 — Stop condition design

Prendi un task che normalmente affideresti a un coding agent.

Scrivi almeno otto stop condition.

Poi dividile in tre categorie:

```text
technical stop
security/compliance stop
product/domain stop
```

Controlla se alcune di queste condizioni possono essere automatizzate.

### Esercizio 6 — Verification without re-execution

Chiedi a un'AI di implementare una funzione non banale.

Non rileggere subito tutto il codice riga per riga.

Prima progetta un **Agent Verification Bundle**.

Decidi quali evidenze ti servono per aumentare la confidenza.

Solo dopo esamina l'implementazione.

Alla fine confronta:

- cosa hai scoperto attraverso la verifica;
- cosa hai scoperto attraverso la lettura del codice;
- cosa sarebbe rimasto invisibile usando soltanto uno dei due metodi.

### Esercizio 7 — Adversarial review

Produci o scegli una piccola decisione architetturale.

Per esempio:

> “Useremo eventi asincroni per propagare gli aggiornamenti degli ordini.”

Chiedi a un agente di difendere la decisione.

Chiedi a un secondo agente, senza mostrare la prima risposta, di tentare di demolirla.

Confronta:

- assunzioni;
- failure mode;
- costi;
- condizioni in cui la soluzione è appropriata;
- condizioni in cui non lo è.

Scrivi poi tu la decisione finale.

L'obiettivo non è scegliere quale agente “ha ragione”.

È usare opinioni divergenti per migliorare il tuo judgment.

### Esercizio 8 — Deskilling check

Scegli un task che hai svolto recentemente con AI.

Senza riaprire la conversazione originale, prova a rispondere:

1. Qual era il problema?
2. Quali alternative erano plausibili?
3. Perché è stata scelta la soluzione finale?
4. Quali failure mode conosci?
5. Quale parte non sapresti implementare o spiegare senza aiuto?

Il punto 5 non è una colpa.

È una mappa di apprendimento.

Scegli una di quelle lacune e usa l'AI come tutor finché riesci a spiegarla con parole tue.

### Esercizio 9 — Prima sincronizzare, poi parallelizzare

Immagina di dover implementare la cancellazione di un ordine con:

- frontend;
- API;
- database;
- pagamento;
- spedizione;
- notifiche.

Hai sei agenti disponibili.

Non assegnare ancora i task.

Scrivi prima il contesto che tutti devono condividere.

Identifica poi:

- decisioni che devono essere prese prima del parallelismo;
- attività realmente indipendenti;
- attività che sembrano indipendenti ma condividono un contratto;
- checkpoint di integrazione.

Solo alla fine assegna il lavoro.

### Esercizio 10 — Il test del pilota

Prendi un componente di cui sei responsabile.

Immagina che domani produca un incidente serio.

Scrivi, senza usare AI, una risposta a queste domande:

- perché esiste questa soluzione?
- quali alternative erano disponibili?
- quali rischi avevamo accettato?
- quali controlli dovevano intercettare il problema?
- come ci accorgeremmo del failure?
- come torneremmo in uno stato sicuro?

Se non riesci a rispondere, hai trovato un'area in cui la responsabilità formale è maggiore della comprensione reale.

Quello è lavoro architetturale.

---

## Domande di autovalutazione

1. Qual è la differenza tra delegare execution e delegare responsibility?
2. Perché più agenti in parallelo possono aumentare l'incoerenza anche quando ogni agente lavora bene?
3. Che cosa rende una stop condition diversa da un semplice errore?
4. In che modo un'invariante permette di verificare senza conoscere ogni dettaglio dell'implementazione?
5. Perché un numero elevato di test generati non equivale necessariamente a maggiore confidenza?
6. Quali fattori useresti per decidere il livello di autonomia di un coding agent?
7. Che cosa significa fare escalation di qualità?
8. Qual è la differenza tra breadth e depth nell'apprendimento AI-native?
9. Come può l'AI aumentare contemporaneamente produttività e rischio di deskilling?
10. Quali informazioni dovrebbe contenere il repository perché un agente non debba reinventare decisioni importanti?

---

## Cosa cambia con l'AI

Molti principi di questo capitolo esistevano già prima dei modelli generativi.

Delegare bene, verificare, documentare, controllare i permessi e progettare per il fallimento non sono idee nate nel 2026.

Ciò che cambia è la scala.

Un singolo professionista può oggi dirigere una quantità di execution molto maggiore.

Può produrre più codice, più test, più documentazione, più refactoring, più analisi e più alternative nello stesso tempo.

La capacità di produzione cresce più velocemente della capacità umana di leggere tutto.

Per questo diventano più importanti:

- context engineering;
- contracts;
- invariants;
- automated verification;
- architecture boundaries;
- permission boundaries;
- stop conditions;
- independent review;
- accountability.

L'AI non elimina la necessità di ingegneria.

Rende più costoso confondere produzione con ingegneria.

---

## Corollario

> **L'AI può scrivere il codice. Il timone resta a noi.**

Il prossimo passo è capire che cosa dobbiamo fare prima di chiedere a qualcuno — umano o artificiale — di costruire.

Perché il modo più veloce di realizzare la soluzione sbagliata è avere un esecutore straordinariamente efficiente.