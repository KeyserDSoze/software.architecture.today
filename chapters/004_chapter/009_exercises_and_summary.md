## Idee chiave

La Software Architecture non coincide con i diagrammi.

I diagrammi sono rappresentazioni utili.

L'architettura riguarda soprattutto le decisioni che hanno conseguenze significative sul comportamento, sul rischio, sul costo e sull'evoluzione del sistema.

Le idee principali del capitolo sono:

1. **Non ogni decisione tecnica è architetturale.** Il peso cresce con blast radius, costo di inversione, persistenza e rischio.
2. **Gli Architecturally Significant Requirements restringono il design space.** Possono essere funzionali o non funzionali.
3. **Gli aggettivi non bastano.** “Scalabile”, “sicuro” e “resiliente” devono diventare condizioni che discriminano tra alternative.
4. **Ogni decisione importante contiene un trade-off.** Se vediamo soltanto vantaggi, probabilmente non abbiamo analizzato abbastanza.
5. **Il team è parte del contesto architetturale.** Competenze, ownership e capacità operativa influenzano ciò che è sostenibile.
6. **Non tutte le decisioni meritano lo stesso processo.** Two-way door e one-way door richiedono livelli diversi di analisi.
7. **La reversibilità si può progettare.** Boundary, adapter, feature flag, contract e migration path possono ridurre il costo di cambiare idea.
8. **Gli ADR conservano il ragionamento.** Non servono a rendere una decisione autorevole, ma a renderla comprensibile e contestabile.
9. **Una decisione può essere corretta e temporanea.** I trigger di revisione permettono di cambiare strada quando cambia il contesto.
10. **L'AI è molto utile per alternative e review.** Non deve diventare il giudice finale del trade-off.
11. **Il consenso tra agenti non è evidenza.** Una stessa assunzione sbagliata può propagarsi tra reviewer differenti.
12. **L'architettura è un sistema decisionale continuo.** Requisito → decisione → implementazione → osservazione → revisione.

## Esercizi

### Esercizio 1 — Design o architecture?

Classifica le seguenti decisioni come prevalentemente:

- implementazione locale;
- design;
- architettura.

Per ogni risposta spiega il criterio usato.

1. rinominare `OrderService` in `OrderApplicationService`;
2. introdurre una queue tra checkout e fulfillment;
3. scegliere una libreria JSON;
4. usare un database per servizio;
5. cambiare l'algoritmo di sorting di una tabella;
6. rendere pubblica una nuova versione dell'API;
7. decidere il modello di tenant isolation;
8. introdurre retry su una chiamata esterna.

Nota: alcune risposte dipendono dal contesto. È parte dell'esercizio.

### Esercizio 2 — Trova gli ASR

Scenario:

Una piattaforma B2B gestisce documenti fiscali per aziende europee.

Requisiti dichiarati:

- upload di documenti PDF;
- ricerca per cliente;
- conservazione dei documenti per dieci anni;
- accesso soltanto agli utenti autorizzati dell'azienda;
- ripristino del servizio entro quattro ore dopo un incidente grave;
- esportazione massiva su richiesta del cliente;
- supporto a 500 utenti contemporanei.

Identifica gli ASR e spiega perché lo sono.

Poi indica almeno tre domande mancanti che potrebbero cambiare l'architettura.

### Esercizio 3 — Il requisito vago

Trasforma questi aggettivi in requisiti più utili:

- veloce;
- sicuro;
- scalabile;
- altamente disponibile;
- economico.

Non cercare numeri “giusti” universali.

Inventali come parte di uno scenario e rendi esplicite le assunzioni.

### Esercizio 4 — Trade-off matrix

Devi costruire un'applicazione interna per cinquanta operatori.

Confronta:

1. modular monolith;
2. microservices;
3. serverless functions indipendenti.

Usa almeno questi criteri:

- time to market;
- semplicità operativa;
- isolation;
- costo;
- deployability;
- competenze del team;
- reversibilità.

Non assegnare un vincitore prima di aver definito il contesto.

### Esercizio 5 — Conseguenze negative

Scegli una decisione tecnica che hai preso in un progetto reale o simulato.

Scrivi:

```text
Decisione
Vantaggi
Conseguenze negative
Rischi
Trigger di revisione
```

Se fai fatica a trovare conseguenze negative, chiedi a un agente AI di assumere che la decisione sia sbagliata e di attaccarla.

Poi valuta criticamente l'output.

### Esercizio 6 — One-way o two-way?

Ordina queste decisioni per costo di inversione:

- libreria di logging;
- cloud provider;
- public API contract;
- database engine;
- naming convention;
- tenant model;
- event schema pubblico;
- authentication provider.

Poi descrivi come potresti aumentare la reversibilità delle tre decisioni più costose.

### Esercizio 7 — Scrivi un ADR

Scenario:

Una startup deve decidere se usare un managed database o gestire autonomamente PostgreSQL su Kubernetes.

Il team è di cinque persone, non ha un DBA dedicato, il traffico previsto è moderato e il prodotto deve uscire in tre mesi.

Scrivi un ADR completo con:

- contesto;
- problema;
- vincoli;
- alternative;
- decisione;
- conseguenze positive e negative;
- rischi;
- trigger di revisione.

### Esercizio 8 — ADR avversariale

Prendi l'ADR dell'esercizio precedente.

Chiedi a un agente:

> “Assumi che questa decisione provocherà un problema serio entro due anni. Costruisci il caso più credibile contro di essa.”

Poi rispondi:

- quale critica è valida?
- quale è troppo generica?
- quale informazione mancante cambierebbe la decisione?
- modificheresti l'ADR?

### Esercizio 9 — Order Operations cambia contesto

L'ADR-001 sceglie lookup live sul database operativo.

Ora cambiano le condizioni:

- traffico 20 volte superiore;
- p95 del lookup a 650 ms;
- il customer portal deve rimanere disponibile durante maintenance del sistema ordini;
- nuovi consumer interni vogliono leggere lo stato ordine.

Scrivi un nuovo ADR che supersede ADR-001.

Non assumere automaticamente che un read model asincrono sia l'unica soluzione.

Confronta almeno tre opzioni.

### Esercizio 10 — Architecture governance

Progetta un processo leggero per un team di dieci developer che stabilisca:

- quali decisioni richiedono ADR;
- quali possono essere locali;
- chi deve essere coinvolto;
- quali controlli possono essere automatizzati;
- come vengono gestiti i trigger di revisione.

Obiettivo: evitare sia architecture by committee sia architecture by accident.

## Domande di autovalutazione

1. Riesci a spiegare perché un diagramma non è l'architettura?
2. Sai distinguere una technology choice da una decisione architetturale usando il contesto?
3. Sai identificare un Architecturally Significant Requirement?
4. Riesci a spiegare perché un requisito funzionale può essere architetturalmente significativo?
5. Sai descrivere almeno una conseguenza negativa di una scelta che consideri buona?
6. Sai spiegare la differenza tra reversibilità del codice e reversibilità del sistema?
7. Sai riconoscere una one-way door?
8. Sai scrivere un trigger di revisione concreto?
9. Sai spiegare perché un ADR non è un documento di approvazione?
10. Sai distinguere un'alternativa credibile da un'alternativa-fantoccio?
11. Sai usare l'AI per criticare una decisione senza delegarle il judgment?
12. Sai spiegare quali decisioni devono essere coerenti tra team e quali possono rimanere locali?

## Artefatto operativo

L'artefatto principale del capitolo è l'**Architecture Decision Record**.

Template:

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

Non usarlo per ogni dettaglio.

Usalo quando perdere il ragionamento renderebbe il sistema più difficile da governare.

## Cosa cambia con l'AI

L'AI riduce drasticamente il costo di:

- generare alternative;
- confrontare pattern;
- preparare diagrammi;
- scrivere bozze di ADR;
- cercare rischi;
- eseguire adversarial review.

Questo rende ancora più evidente che il valore dell'architect non può essere misurato sulla quantità di documentazione prodotta.

Il valore si sposta su:

- selezione delle decisioni importanti;
- comprensione del contesto;
- priorità tra ASR;
- qualità del trade-off;
- capacità di riconoscere informazione mancante;
- progettazione della reversibilità;
- responsabilità della decisione.

## Corollario

Possiamo ora dare una definizione operativa che useremo nel resto del libro:

> **La Software Architecture non è l'insieme delle tecnologie del sistema. È l'insieme delle decisioni significative, dei trade-off che accettiamo e dei meccanismi con cui possiamo verificarle e cambiarle nel tempo.**

E una versione ancora più breve:

> **L'architettura è ciò che rende alcune conseguenze intenzionali invece che accidentali.**