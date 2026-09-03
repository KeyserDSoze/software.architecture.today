## Idee chiave

Questo capitolo introduce una regola che useremo in quasi tutte le decisioni tecnologiche del libro:

> **Prima definiamo la qualità richiesta. Poi scegliamo la tecnologia.**

Gli aggettivi non sono requisiti.

“Veloce”, “sicuro”, “scalabile”, “resiliente” e “enterprise-ready” devono essere trasformati in target, invarianti, scenari o condizioni verificabili.

Le quality attribute non esistono nel vuoto.

Cambiano rispetto a:

- critical journey;
- rischio;
- utenti;
- scala;
- valore economico;
- costo del downtime;
- team;
- operabilità;
- budget.

Non possiamo massimizzarle tutte contemporaneamente.

Ogni architettura paga trade-off.

Per questo la tecnologia deve essere scelta per **fit**, non per moda.

Una tecnologia nuova non è automaticamente migliore.

Una tecnologia vecchia non è automaticamente peggiore.

Una tecnologia popolare non è automaticamente appropriata.

Una tecnologia familiare non è automaticamente sufficiente.

La scelta migliore è quella che soddisfa bene ciò che conta nel contesto reale pagando un prezzo che siamo disposti ad accettare.

### Il vocabolario del capitolo

Abbiamo introdotto o consolidato:

- latency;
- percentile;
- throughput;
- capacity;
- availability;
- reliability;
- correctness;
- consistency;
- durability;
- operability;
- maintainability;
- security;
- privacy;
- cost;
- RTO;
- RPO;
- graceful degradation;
- quality priority;
- explicit non-goal;
- technology fit;
- fashion-driven architecture;
- copy-paste architecture;
- quality trade-off.

### Artefatto operativo

L'artefatto principale del capitolo è la:

## Non-Functional Requirements Card

Serve a trasformare qualità generiche in input di decisione.

Una forma sintetica può contenere:

```text
critical journey
→ target
→ vincoli
→ priorità
→ non-goal
→ verifica
→ trigger di revisione
```

Non deve diventare una checklist universale.

Un piccolo tool interno può aver bisogno di poche righe.

Un sistema mission-critical può richiedere analisi molto più profonda.

Il peso dell'artefatto deve seguire il rischio.

---

# Esercizi

## Esercizio 1 — Distruggi gli aggettivi

Ricevi questi requisiti:

```text
Il sistema deve essere:
- veloce;
- altamente scalabile;
- sicuro;
- affidabile;
- economico.
```

Per ciascuno:

1. spiega perché non è ancora un requisito sufficiente;
2. scrivi almeno due domande di chiarimento;
3. trasformalo in una proprietà verificabile;
4. indica quale scelta architetturale potrebbe cambiare in funzione della risposta.

Non scegliere ancora tecnologie.

## Esercizio 2 — Percentili contro media

Un endpoint ha:

```text
average latency = 120 ms
p50 = 70 ms
p95 = 280 ms
p99 = 2.8 s
```

Il team dichiara:

> “Siamo sotto 150 ms, quindi la performance è ottima.”

Critica l'affermazione.

Descrivi almeno tre scenari che potrebbero spiegare la coda del p99 e quali dati raccoglieresti prima di intervenire.

## Esercizio 3 — Scrivi una NFR Card

Scegli un prodotto reale o inventato:

- e-commerce;
- sistema prenotazioni;
- SaaS B2B;
- applicazione bancaria;
- piattaforma media;
- tool interno.

Compila una **Non-Functional Requirements Card** con almeno:

- due critical journey;
- latency;
- capacity;
- availability;
- consistency;
- recovery;
- security;
- cost;
- tre explicit non-goal;
- verification method;
- review trigger.

Per ogni numero inventato dichiara il livello di confidence.

## Esercizio 4 — Availability non uniforme

Una piattaforma contiene:

```text
checkout
catalogo
raccomandazioni
area amministrativa
reportistica
newsletter
```

Non puoi permetterti lo stesso livello di disponibilità per tutto.

Ordina i journey per criticità e proponi livelli differenti di comportamento durante un incidente.

Per almeno due funzioni definisci una graceful degradation.

## Esercizio 5 — RTO e RPO

Un team dichiara:

```text
RTO = 15 minuti
RPO = zero
```

ma:

- il backup viene fatto ogni 6 ore;
- il restore non è mai stato provato;
- il failover richiede accesso manuale a tre console;
- una sola persona conosce la procedura completa.

Spiega quali contraddizioni vedi.

Produci un piano minimo per rendere gli obiettivi credibili oppure proponi target più realistici.

## Esercizio 6 — Fit before fashion

Il CTO vuole introdurre Kubernetes perché:

> “È lo standard del settore e dobbiamo essere cloud-native.”

Il sistema ha:

- tre developer;
- una singola applicazione;
- due deploy al mese;
- traffico prevedibile;
- nessun requisito di deploy indipendente;
- downtime di pochi minuti tollerabile durante manutenzione pianificata.

Costruisci:

1. il caso più forte **contro** Kubernetes;
2. il caso più forte **a favore**;
3. i requisiti che, se emergessero, potrebbero cambiare la decisione.

Non limitarti a dire “Kubernetes è troppo complesso”.

## Esercizio 7 — La tecnologia noiosa

Confronta due soluzioni per un nuovo modulo:

### A

PostgreSQL già presente nel sistema.

### B

Un nuovo database specializzato che offre query più naturali per quel tipo di dato.

Costruisci una Technology Fit Matrix considerando:

- capability;
- latency;
- scale;
- team skill;
- operability;
- backup;
- observability;
- cost;
- lock-in;
- migration;
- failure modes.

Poi scegli.

La scelta può essere B, ma deve essere giustificata dal fit.

## Esercizio 8 — Copy-paste architecture

Trova una architecture story pubblica di una grande azienda oppure usa un caso fornito dal docente.

Identifica:

- problema originale;
- scala;
- vincoli;
- team;
- failure precedenti;
- trade-off accettati.

Poi immagina una startup di sei persone.

Quali parti della soluzione sarebbero trasferibili?

Quali sarebbero probabilmente cargo cult?

## Esercizio 9 — Adversarial technology review con AI

Scegli una tecnologia che ti piace molto.

Fornisci a un agente AI un contesto realistico e chiedigli:

> “Assumi che introdurre questa tecnologia sia una cattiva idea. Costruisci il caso tecnico più forte contro la scelta.”

Poi chiedi il contrario.

Confronta le due risposte e identifica:

- assunzioni non supportate;
- requisiti mancanti;
- trade-off dimenticati;
- argomenti emotivi o di moda.

Non chiedere all'agente di decidere al posto tuo.

## Esercizio 10 — Acme Orders cresce

Modifica il caso Acme Orders.

Ora il business richiede:

```text
3.000 req/s sostenute
p95 < 150 ms
SLA enterprise più severo
utenti in tre continenti
RTO < 10 minuti
RPO prossimo a zero
```

Rivedi la Non-Functional Requirements Card.

Poi individua quali decisioni dei capitoli precedenti devono essere rivalutate.

Non saltare direttamente a una soluzione.

Elenca prima le decisioni che non reggono più.

## Esercizio 11 — Quality conflict

Hai questi obiettivi:

```text
consistency forte
availability elevata durante partition
latency globale molto bassa
costo minimo
zero complessità operativa
```

Spiega perché l'insieme è sospetto.

Costruisci una priorità esplicita e descrivi quali proprietà accetteresti di degradare.

## Esercizio 12 — La soluzione che l'AI ha reso troppo facile

Un agente ha generato in poche ore:

- broker;
- cache distribuita;
- workflow engine;
- service mesh;
- tre nuovi database;
- multi-region deployment.

Tutto funziona nella demo.

Prepara una **complexity audit**.

Per ogni componente chiedi:

1. quale requisito risolve;
2. quale alternativa più semplice esiste;
3. quale failure mode introduce;
4. chi lo opera;
5. come viene aggiornato;
6. come viene rimosso;
7. che cosa accade se non lo introduciamo.

---

# Domande di autovalutazione

1. So trasformare un aggettivo di qualità in un requisito osservabile?
2. So distinguere latency media da tail latency?
3. So distinguere throughput e capacity?
4. So spiegare la differenza tra availability e reliability?
5. So spiegare la differenza tra availability e durability?
6. So usare RTO e RPO senza ridurli a sigle?
7. So progettare una graceful degradation?
8. So dichiarare quali qualità non sto ottimizzando?
9. So riconoscere una scelta tecnologica guidata dalla moda?
10. So riconoscere anche il dogma opposto: usare sempre ciò che conosco?
11. So collegare una tecnologia a un requisito concreto?
12. So spiegare quale nuovo failure mode introduce una soluzione?
13. So considerare il team e l'operabilità nel technology fit?
14. So distinguere costo di costruzione da costo di ownership?
15. So usare l'AI per confrontare alternative senza delegarle la decisione?

---

# Cosa cambia con l'AI

L'AI rende molto più economico produrre soluzioni sofisticate.

Questo aumenta il rischio che la sofisticazione venga confusa con qualità.

Un agente può generare rapidamente:

- infrastruttura;
- configurazione;
- deployment;
- test;
- integrazioni;
- benchmark.

Ma il costo futuro di possedere quei componenti rimane reale.

Per questo, nell'era degli agenti, diventa ancora più importante chiedere:

> **Quale requisito sta pagando questa complessità?**

L'AI può aiutarci a generare alternative, benchmark e critiche.

Non può decidere automaticamente quali conseguenze il nostro prodotto sia disposto a comprare.

---

# Corollario

> **Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.**

E prima ancora:

> **Gli aggettivi non sono requisiti.**
