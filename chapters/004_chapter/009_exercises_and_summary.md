## Idee chiave

La Software Architecture non coincide con diagrammi, tecnologie o topologie di deployment. Questi elementi possono rappresentarla, ma il nucleo del lavoro architetturale sta nelle decisioni che hanno conseguenze significative su comportamento, rischio, costo, operazioni ed evoluzione futura.

Non ogni decisione tecnica ha lo stesso peso. Una scelta diventa architetturalmente interessante quando attraversa molti confini, è costosa da invertire, rimane incorporata nel sistema a lungo o espone il business a un rischio elevato. Gli **Architecturally Significant Requirements** ci aiutano a riconoscere quali condizioni restringono davvero il design space; possono essere funzionali o non funzionali, purché cambino materialmente le alternative disponibili.

I trade-off sono inevitabili. Se una soluzione sembra avere soltanto vantaggi, probabilmente abbiamo omesso una parte del costo. Team, competenze, ownership e capacità operativa fanno parte di quel costo tanto quanto latency, consistency o lock-in. Una buona decisione non cerca di massimizzare tutto: dichiara ciò che privilegia e ciò che accetta di perdere.

La reversibilità ci permette poi di calibrare il processo. Una two-way door locale può essere presa velocemente; una one-way door con alto blast radius merita più evidenza. Possiamo anche aumentare la reversibilità attraverso boundary, adapter, feature flag, rollout progressivi, contract compatibili e migration path. L'obiettivo non è prevedere il futuro, ma ridurre il costo di scoprire che il contesto è cambiato.

Gli ADR conservano questo reasoning nel tempo. Non rendono automaticamente corretta una decisione e non devono diventare approval theater. Servono a ricordare perché una scelta aveva senso, quali alternative erano credibili, quali conseguenze negative erano accettate e quali trigger dovrebbero farci riaprire il confronto.

Con l'AI il costo di generare alternative, diagrammi e bozze di ADR si abbassa drasticamente. Il valore umano si sposta ancora di più verso selezione delle decisioni importanti, priorità tra ASR, valutazione dei trade-off, riconoscimento dell'informazione mancante e responsabilità finale della scelta.

---

# Esercizi

Gli esercizi restano strutturati perché devono essere riutilizzabili come strumenti di pratica e review.

## 1. Design o architecture?

Classifica le seguenti decisioni come prevalentemente **implementazione locale**, **design** o **architettura** e spiega il criterio utilizzato:

1. rinominare `OrderService` in `OrderApplicationService`;
2. introdurre una queue tra checkout e fulfillment;
3. scegliere una libreria JSON;
4. usare un database per servizio;
5. cambiare l'algoritmo di sorting di una tabella;
6. rendere pubblica una nuova versione dell'API;
7. decidere il modello di tenant isolation;
8. introdurre retry su una chiamata esterna.

Alcune risposte dipendono dal contesto. È parte dell'esercizio: prova a descrivere quale informazione farebbe cambiare classificazione.

## 2. Trova gli ASR

Una piattaforma B2B gestisce documenti fiscali per aziende europee. I requisiti dichiarati sono:

- upload di documenti PDF;
- ricerca per cliente;
- conservazione dei documenti per dieci anni;
- accesso soltanto agli utenti autorizzati dell'azienda;
- ripristino del servizio entro quattro ore dopo un incidente grave;
- esportazione massiva su richiesta del cliente;
- supporto a 500 utenti contemporanei.

Identifica gli ASR e spiega quali decisioni architetturali potrebbero influenzare. Poi indica almeno tre domande mancanti che potrebbero cambiare materialmente il design.

## 3. Dal requisito vago a una condizione discriminante

Trasforma questi aggettivi in requisiti più utili:

```text
veloce
sicuro
scalabile
altamente disponibile
economico
```

Non cercare valori universali. Costruisci uno scenario, rendi esplicite le assunzioni e formula il requisito in modo che possa distinguere tra una soluzione accettabile e una non accettabile.

## 4. Trade-off matrix

Devi costruire un'applicazione interna per cinquanta operatori. Confronta:

1. modular monolith;
2. microservices;
3. serverless functions indipendenti.

Usa almeno time-to-market, semplicità operativa, isolation, costo, deployability, competenze del team e reversibilità. Non scegliere un vincitore prima di aver definito il contesto e segnala dove la matrice nasconde incertezza o falsa precisione.

## 5. Scrivere anche ciò che perdi

Scegli una decisione tecnica reale o simulata e produci:

```text
Decisione
Vantaggi
Conseguenze negative
Rischi
Trigger di revisione
```

Se fai fatica a trovare conseguenze negative, chiedi a un agente AI di assumere che la scelta sia sbagliata e costruire il caso più credibile contro di essa. Poi valuta criticamente quali osservazioni siano realmente supportate dal contesto.

## 6. One-way o two-way?

Ordina queste decisioni per costo di inversione:

```text
libreria di logging
cloud provider
public API contract
database engine
naming convention
tenant model
event schema pubblico
authentication provider
```

Poi scegli le tre più costose e descrivi come potresti aumentare la loro reversibilità senza implementare oggi tutte le alternative future.

## 7. Scrivi un ADR

Una startup deve decidere se usare un managed database o gestire autonomamente PostgreSQL su Kubernetes. Il team è composto da cinque persone, non ha un DBA dedicato, il traffico previsto è moderato e il prodotto deve uscire in tre mesi.

Scrivi un ADR completo includendo contesto, problema, ASR, vincoli, alternative credibili, decisione, conseguenze positive e negative, rischi e trigger di revisione.

La vera difficoltà non è riempire il template: è spiegare perché l'alternativa scartata rimane plausibile e quale cambiamento di contesto potrebbe farla diventare preferibile.

## 8. ADR avversariale

Prendi l'ADR dell'esercizio precedente e chiedi a un agente:

> **Assumi che questa decisione provocherà un problema serio entro due anni. Costruisci il caso più credibile contro di essa.**

Per ogni critica indica se è valida, troppo generica, basata su un'assunzione non supportata oppure abbastanza importante da modificare l'ADR. Specifica anche quale nuova evidenza vorresti raccogliere.

## 9. Order Operations cambia contesto

ADR-001 sceglie lookup live. Ora le condizioni cambiano:

- traffico venti volte superiore;
- p95 del lookup a 650 ms;
- la vista operativa deve rimanere disponibile durante maintenance del sistema ordini;
- nuovi consumer interni vogliono leggere la stessa rappresentazione dello stato.

Scrivi un nuovo ADR che supersede ADR-001. Non assumere automaticamente che un read model asincrono sia l'unica risposta. Confronta almeno tre opzioni e indica quale nuova evidenza rende insufficiente il reasoning precedente.

## 10. Architecture governance

Progetta un processo leggero per un team di dieci developer. Deve chiarire quali decisioni richiedono un ADR, quali possono restare locali, chi deve essere coinvolto quando cambia il blast radius, quali guardrail possono essere automatizzati e come vengono gestiti i trigger di revisione.

L'obiettivo è evitare contemporaneamente **architecture by committee** e **architecture by accident**.

---

## Domande di autovalutazione

1. Riesco a spiegare perché un diagramma non coincide con l'architettura?
2. So distinguere una technology choice da una decisione architetturale usando il contesto?
3. So identificare un Architecturally Significant Requirement?
4. Riesco a spiegare perché un requisito funzionale può essere architetturalmente significativo?
5. So descrivere almeno una conseguenza negativa di una scelta che considero buona?
6. So distinguere reversibilità del codice e reversibilità del sistema?
7. So riconoscere una one-way door e spiegare perché lo è?
8. So scrivere un trigger di revisione osservabile?
9. So spiegare perché un ADR non è un documento di approvazione?
10. So distinguere un'alternativa credibile da un'alternativa-fantoccio?
11. So usare l'AI per criticare una decisione senza delegarle il judgment?
12. So dire quali decisioni richiedono coerenza tra team e quali possono rimanere locali?

## Artefatto operativo — Architecture Decision Record

Il template standard del capitolo è:

```markdown
# ADR-xxx — Titolo

Status: proposed | accepted | superseded | deprecated | rejected

## Contesto

## Problema

## Architecturally Significant Requirements

## Vincoli

## Alternative considerate

## Decisione

## Motivazione

## Conseguenze positive

## Conseguenze negative

## Rischi

## Trigger di revisione
```

Non va usato per ogni dettaglio. È utile quando perdere il reasoning renderebbe il sistema più difficile da governare o quando una nuova evidenza potrebbe dover riaprire la scelta in futuro.

## Cosa cambia con l'AI

Generare alternative, confrontare pattern, preparare diagrammi, cercare failure mode o produrre una prima bozza di ADR costa molto meno di prima. Questo rende ancora più evidente che il valore architetturale non si misura dalla quantità di documentazione prodotta.

Il valore si concentra nella capacità di riconoscere quali decisioni meritano attenzione, quali ASR hanno davvero priorità, quale trade-off stiamo accettando e quale informazione manca ancora. Si concentra anche nella progettazione della reversibilità e nella responsabilità di dire “questa evidenza è sufficiente per decidere” oppure “questa decisione non è ancora autorizzata”.

## Corollario

Possiamo ora fissare la definizione operativa che useremo nel resto del libro:

> **La Software Architecture non è l'insieme delle tecnologie del sistema. È l'insieme delle decisioni significative, dei trade-off che accettiamo e dei meccanismi con cui possiamo verificarle e cambiarle nel tempo.**

E una versione ancora più breve:

> **L'architettura è ciò che rende alcune conseguenze intenzionali invece che accidentali.**
