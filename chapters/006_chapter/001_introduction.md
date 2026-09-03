# Capitolo 6 — Qualità prima della tecnologia

## Gli aggettivi non sono requisiti

“Deve essere veloce.”

“Deve essere scalabile.”

“Deve essere sicuro.”

“Deve essere resiliente.”

“Deve essere economico.”

Sono frasi che sentiamo continuamente nei progetti software.

Sembrano requisiti.

Spesso non lo sono ancora.

Sono direzioni.

Intenzioni.

A volte desideri.

Per diventare requisiti utili devono essere trasformati in condizioni che possiamo discutere, confrontare e verificare.

Dire che un sistema deve essere veloce non ci dice se 80 millisecondi siano eccellenti, necessari o inutilmente costosi.

Dire che deve essere altamente disponibile non ci dice se una singola ora di downtime all'anno sia accettabile, catastrofica o irrilevante.

Dire che deve scalare non ci dice fino a quale carico, con quale profilo di traffico e con quale degradazione consentita.

Dire che deve essere sicuro non identifica minacce, asset, trust boundary o rischio accettabile.

L'architettura comincia a diventare concreta quando gli aggettivi smettono di essere aspirazioni e diventano proprietà osservabili.

Per esempio:

> Il 95° percentile di `GET /orders/{id}` deve rimanere sotto 300 ms fino a 500 richieste al secondo nel profilo di traffico atteso.

Oppure:

> La perdita massima accettabile di dati confermati è cinque minuti e il ripristino del servizio deve avvenire entro sessanta minuti da un incidente classificato come disaster.

Oppure:

> Un operatore non deve poter visualizzare ordini appartenenti a tenant per i quali non possiede autorizzazione esplicita.

Adesso possiamo progettare.

### Prima la qualità, poi il prodotto

Un errore ricorrente consiste nel scegliere una tecnologia e solo dopo chiederci quali requisiti può soddisfare.

```text
Kubernetes
→ microservizi
→ broker
→ database distribuito
→ adesso cerchiamo il problema
```

Il processo dovrebbe funzionare al contrario.

```text
problema
+ comportamento
+ qualità richiesta
+ vincoli
+ rischio
↓
alternative
↓
scelta
```

Questo capitolo parte quindi da una regola semplice:

> **Prima definiamo che cosa deve essere vero. Poi discutiamo con che cosa renderlo vero.**

La tecnologia viene dopo perché è una risposta.

### La soluzione migliore non esiste nel vuoto

Quando diciamo “scegliamo la tecnologia migliore” rischiamo di porre una domanda mal definita.

Migliore rispetto a che cosa?

Una soluzione può avere throughput superiore e costare molto di più.

Può avere disponibilità maggiore e richiedere un team operativo che non abbiamo.

Può ridurre la latency e introdurre consistency più debole.

Può essere estremamente flessibile e molto più difficile da comprendere.

Può essere moderna, elegante e completamente sproporzionata al problema.

Non esiste quasi mai una tecnologia universalmente migliore.

Esiste una soluzione con un **fit migliore rispetto al contesto**.

Quel contesto comprende almeno:

- ciò che il sistema deve fare;
- quanto bene deve farlo;
- i failure mode che non possiamo accettare;
- il volume e la crescita attesi;
- il budget;
- il team;
- la capacità operativa;
- il rischio;
- i vincoli normativi e organizzativi;
- il costo del cambiamento futuro.

La domanda utile non è:

> “Qual è il database migliore?”

È:

> **“Quale soluzione soddisfa meglio i requisiti che contano, dentro i vincoli reali che abbiamo, pagando costi e rischi che siamo disposti ad accettare?”**

### Fit before fashion

In questo libro useremo spesso un principio:

> **Fit before fashion. Il fit prima della moda.**

Una tecnologia non diventa adatta perché:

- è nuova;
- è popolare;
- la usa una grande azienda;
- compare in molte conferenze;
- è considerata cloud-native;
- è interessante da mettere nel curriculum;
- un agente AI la propone con sicurezza.

Questi elementi possono essere segnali utili.

Non sono criteri sufficienti.

Allo stesso modo, una tecnologia non diventa automaticamente sbagliata perché è vecchia, semplice o poco affascinante.

PostgreSQL potrebbe essere più adatto di tre database specializzati.

Un processo singolo potrebbe essere più adatto di una costellazione di servizi.

Una VM potrebbe essere più adatta di Kubernetes.

Una queue potrebbe essere indispensabile in un sistema e puro overhead in un altro.

La tecnologia non viene giudicata per prestigio.

Viene giudicata per la qualità della risposta che offre al problema reale.

### Fashion-driven architecture

Chiameremo **fashion-driven architecture** il pattern in cui scegliamo prima una tecnologia desiderata e successivamente costruiamo una narrativa per giustificarla.

Il segnale tipico è una conversazione che parte da:

> “Dobbiamo usare X.”

invece di:

> “Quale proprietà del sistema stiamo cercando di ottenere?”

Questo non significa che curiosità, sperimentazione e innovazione siano sbagliate.

Sono essenziali.

Ma dobbiamo distinguere tra:

```text
esperimento tecnologico
```

e:

```text
decisione di produzione
```

Nel primo possiamo permetterci di provare qualcosa perché vogliamo imparare.

Nel secondo dobbiamo poter spiegare quale requisito giustifica il costo introdotto.

### Il vero scopo dei requisiti non funzionali

I non-functional requirements non servono a riempire una sezione del documento di architettura.

Servono a rendere visibili le proprietà che cambiano materialmente le nostre decisioni.

Se la latency richiesta passa da due secondi a cinquanta millisecondi, alcune opzioni diventano meno plausibili.

Se l'RPO passa da ventiquattro ore a zero, la strategia dati cambia.

Se il sistema può essere indisponibile per una notte, multi-region potrebbe essere completamente inutile.

Se una funzionalità gestisce denaro o salute, il livello di controllo cambia.

La qualità richiesta orienta l'architettura.

Per questo il capitolo viene prima delle tecnologie specifiche.

> **Non scegliamo prima il mezzo e poi inventiamo il requisito. Definiamo il requisito e valutiamo quale mezzo ha il fit migliore.**
