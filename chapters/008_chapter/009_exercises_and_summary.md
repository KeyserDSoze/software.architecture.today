## Esercizi, autovalutazione e sintesi

Questo capitolo non chiede di scegliere una squadra.

Non chiede di essere “pro monolite” o “pro microservizi”.

Chiede di trattare la topologia come una decisione economica, organizzativa e operativa che deve comprare proprietà precise.

La sequenza che useremo è:

```text
boundary logico
→ proprietà richiesta
→ limite della topologia attuale
→ alternative
→ costo della separazione
→ decisione
→ verifica del beneficio
→ trigger di revisione
```

Il network boundary viene dopo il reasoning, non prima.

### Idee chiave

Monolite non significa automaticamente legacy e microservizio non significa automaticamente autonomia. Il primo può contenere ottima modularità; il secondo può essere parte di un distributed monolith.

La distinzione decisiva è fra **separazione logica** e **separazione operativa**. Responsabilità, ownership, modello e contratti possono essere forti dentro un singolo deployable. Processo, storage, scaling e failure domain separati diventano utili quando comprano qualcosa che il boundary logico non riesce più a ottenere da solo.

Deploy independence, failure isolation e scaling independence devono quindi essere osservabili. Due repository separati non bastano. Se i servizi devono evolvere insieme, condividono lo stesso dato senza ownership o cadono sempre insieme nel critical journey, la separazione è soprattutto nominale.

La distribuzione non elimina complessità. La sposta verso rete, consistency, contract evolution, security, observability, pipeline, recovery e incident ownership. A questa superficie si aggiunge il costo cognitivo di ricostruire i journey end-to-end.

Anche l'organizzazione fa parte della scelta. Team boundary e service boundary possono rafforzarsi a vicenda, ma trasformare meccanicamente l'organigramma in servizi produce dipendenze tecniche che possono sopravvivere molto più a lungo della struttura organizzativa che le ha generate.

Un servizio merita di essere estratto quando più forze convergono: ciclo di cambiamento distinto, scaling realmente asimmetrico, failure o security boundary più forti, ownership stabile, dati già posseduti e technology fit differente con una ragione concreta.

Con l'AI l'estrazione è diventata più economica da eseguire. Questo non riduce automaticamente il costo di possedere il servizio. Più è facile generare infrastruttura, più dobbiamo essere severi nel dimostrare quale proprietà stiamo comprando.

Per Order Operations questa analisi ha prodotto ADR-002: **restare modular monolith finché la distribuzione non compra abbastanza autonomia, isolation o scaling da pagare il proprio costo**.

---

# Esercizi

## Esercizio 1 — Monolite o big ball of mud?

Prendi un'applicazione che conosci bene.

Descrivi:

- deployable principali;
- moduli logici;
- ownership dei dati;
- dipendenze tra moduli;
- componenti che possono modificare direttamente dati altrui;
- cambiamenti che attraversano frequentemente più aree.

Poi rispondi:

> Il problema principale è davvero il singolo deployable, oppure la mancanza di boundary interni?

Non usare la parola “monolite” come spiegazione.

Descrivi il meccanismo concreto del problema.

---

## Esercizio 2 — Separazione logica vs operativa

Per tre componenti del tuo sistema compila questa tabella:

| Componente | Boundary logico forte? | Deploy indipendente utile? | Scaling indipendente utile? | Failure isolation utile? | Team autonomo? |
|---|---:|---:|---:|---:|---:|
| A | | | | | |
| B | | | | | |
| C | | | | | |

Poi individua almeno un componente che dovrebbe essere **modulare ma non necessariamente distribuito**.

Spiega quale valore perderesti rendendolo un modulo più debole e quale valore, invece, non otterresti ancora trasformandolo in servizio.

---

## Esercizio 3 — Il prezzo della distribuzione

Scegli un modulo che vorresti estrarre.

Elenca la nuova superficie da possedere dopo l'estrazione:

- deployment;
- networking;
- auth tra servizi;
- observability;
- retry e timeout;
- contract versioning;
- data migration;
- consistency;
- backup e restore;
- on-call;
- incident ownership;
- cost attribution.

Poi completa:

> “Paghiamo questi costi per comprare __________.”

Se la frase contiene soltanto “scalabilità”, “modernità” o “flessibilità”, rendila più concreta.

Infine scrivi come verificheresti che la proprietà sia stata davvero ottenuta dopo sei mesi.

---

## Esercizio 4 — Cerca il distributed monolith

Analizza un sistema distribuito reale che conosci.

Cerca almeno cinque segnali fra:

- deploy coordinati;
- database condiviso senza ownership;
- shared domain package;
- catene sincrone profonde;
- release train obbligatorio;
- DTO condivisi ovunque;
- modifiche multi-repository quasi sistematiche;
- test end-to-end come unico safety net;
- incidenti che attraversano sempre molti servizi;
- schema migration che richiedono coordinamento cross-team.

Per ogni segnale proponi una modifica che migliori autonomia **senza necessariamente unire i servizi**.

L'obiettivo è capire se il problema è la separazione fisica o il coupling rimasto dentro quella separazione.

---

## Esercizio 5 — Service extraction test

Scegli un modulo e valuta questi segnali:

```text
ciclo di cambiamento
profilo di carico
failure isolation
security/compliance boundary
ownership organizzativa
data ownership
technology fit
```

Per ciascuno assegna:

```text
forte
medio
debole
assente
```

Poi valuta anche l'extraction readiness:

```text
responsabilità chiara?
contratto intenzionale?
dipendenze note?
transazioni cross-boundary comprese?
test sufficienti?
operational owner identificato?
```

Decisione finale:

```text
resta nel deployable
rafforza prima il boundary
fai uno spike di estrazione
estrai ora
```

Motiva con proprietà attese e costi accettati.

---

## Esercizio 6 — L'organigramma non è il dominio

Prendi la struttura del tuo team o della tua organizzazione e confrontala con i boundary del software.

Dove coincidono bene perché il team possiede realmente una capability end-to-end?

Dove il software è stato diviso soltanto perché esistono team differenti?

Dove più team condividono una capability senza ownership chiara?

Dove, al contrario, un singolo team possiede troppi deployable per poterli davvero operare con autonomia?

Proponi un cambiamento organizzativo **oppure** architetturale che riduca coordinamento inutile.

---

## Esercizio 7 — Shared database, ownership distinta

Immagina tre moduli sullo stesso PostgreSQL.

Definisci:

- tabelle possedute;
- accessi consentiti;
- accessi vietati;
- query cross-module ammesse;
- contratto da usare al posto dell'accesso diretto;
- migration che richiederebbero coordinamento.

Poi immagina di estrarre uno dei moduli.

Quali violazioni del boundary diventerebbero immediatamente costose?

Quali regole puoi introdurre oggi, senza separare ancora il database, per ridurre quel costo futuro?

---

## Esercizio 8 — Red team sulla migrazione a microservizi

Chiedi a un agente AI:

> “Assumi che la nostra proposta di migrazione a microservizi sia sbagliata. Cerca tutti i costi, le transazioni, i shared data, i deploy coordinati e i failure mode che stiamo sottovalutando.”

Poi esegui il prompt opposto:

> “Assumi che mantenere questa topologia monolitica sia sbagliato. Cerca requisiti misurabili che giustifichino separazione fisica.”

Confronta i due report.

Per ogni affermazione chiedi quale evidenza del repository, delle metriche, degli incidenti o dell'organizzazione la supporti.

Non scegliere il report che conferma l'idea iniziale.

Cerca il caso più forte.

---

## Esercizio 9 — Order Operations cambia contesto

Modifica il caso Order Operations con queste nuove condizioni:

```text
Payments viene affidato a un team dedicato
il carico cresce 20x
nuovi requisiti di compliance aumentano l'isolamento richiesto
Orders continua ad avere traffico moderato
Payments deve essere rilasciato più volte al giorno
incidenti del provider non devono degradare il resto del prodotto
```

Rivaluta ADR-002.

Quali trigger sono scattati?

Quali proprietà comprerebbe ora l'estrazione?

Quali costi nuovi accetteresti?

Quali contract e data boundary devono essere preparati prima?

Scrivi una nuova ADR che `supersede` ADR-002 oppure spiega perché non è ancora il momento.

---

## Esercizio 10 — Disegna meno

Prendi un'architettura a microservizi proposta da te o generata dall'AI.

Prova a ridurla a:

```text
1 deployable
oppure
3 deployable massimo
```

senza violare i requisiti dichiarati.

Ogni servizio che decidi di mantenere deve avere una giustificazione del tipo:

```text
Se lo unissimo perderemmo questa proprietà:
...

Evidenza che la proprietà serve:
...
```

Questo esercizio non dimostra che il monolite sia migliore.

Misura quanta distribuzione è realmente necessaria.

---

## Esercizio 11 — Verifica il beneficio dopo l'estrazione

Immagina che un servizio sia stato estratto sei mesi fa per ottenere deploy indipendente.

Raccogli o simula questi dati:

```text
frequenza deploy prima/dopo
deploy coordinati ancora necessari
numero di modifiche cross-repository
incidenti introdotti dalla rete
lead time
time to recovery
operational overhead
```

Poi rispondi:

> Abbiamo davvero comprato deploy independence o abbiamo soltanto spostato il coordinamento?

Se il beneficio non è emerso, proponi tre alternative: migliorare il boundary, modificare i contratti oppure riunire il servizio.

La topologia può essere rivalutata come qualsiasi altra decisione.

---

# Autovalutazione

Prima di considerare chiuso il capitolo, prova a rispondere senza guardare il testo.

1. Perché modularità e distribuzione non sono sinonimi?
2. Che cosa distingue un modular monolith da un big ball of mud?
3. Quali proprietà possono giustificare un service boundary?
4. Perché un deployable separato non garantisce deploy independence?
5. Come può un sistema a microservizi restare un unico failure domain?
6. Quando lo scaling indipendente crea valore economico reale?
7. Qual è il costo cognitivo della distribuzione?
8. Qual è la differenza tra team boundary e service boundary?
9. Quali sono tre segnali di distributed monolith?
10. Perché ownership del database conta anche se l'istanza è condivisa?
11. Perché una shared domain library può creare coupling?
12. Quali segnali possono suggerire l'estrazione di un servizio?
13. Che cosa significa extraction readiness?
14. Perché conviene rendere credibile prima il boundary logico?
15. Come cambia la decisione quando il team è molto piccolo?
16. In che modo l'AI può aiutare a valutare un'estrazione?
17. Perché generare facilmente infrastruttura non riduce automaticamente il costo operativo?
18. Quale proprietà dovrebbe comprare ogni nuova separazione fisica?
19. Come verificheresti dopo alcuni mesi che l'estrazione ha funzionato?
20. Quando avrebbe senso riunire un servizio nel monolite?

Se alcune risposte contengono soltanto “più scalabile”, “più resiliente” o “più moderno”, torna al contesto e rendile osservabili.

---

# Artefatto operativo del capitolo

Il capitolo non introduce un nuovo documento isolato. Collega gli artefatti costruiti finora dentro una **decisione di topologia**:

```text
Problem & Outcome Brief
Architecture Context Map
Component Responsibility Map
Non-Functional Requirements Card
Pattern Justification
ADR
```

Per un'estrazione significativa, l'ADR dovrebbe rispondere almeno a:

```text
Quale proprietà compriamo?
Quale boundary logico esiste già?
Quali dati possiede?
Quali dipendenze impediscono autonomia oggi?
Quali nuovi failure mode introduciamo?
Chi lo opera?
Come migriamo?
Come torniamo indietro o degradiamo?
Come verifichiamo il beneficio?
Quando rivalutiamo?
```

In Order Operations questo artefatto è ADR-002.

Non documenta “abbiamo scelto il monolite”.

Documenta perché, nel contesto attuale, un deployable condiviso ha più fit e quali condizioni renderebbero ragionevole cambiarlo.

---

# Cosa cambia con l'AI

Con agenti capaci di modifiche repository-wide, generazione di infrastruttura e migrazioni assistite, la separazione fisica è diventata molto più accessibile.

Questo è un vantaggio enorme quando vogliamo costruire spike, verificare extraction readiness o ridurre il costo meccanico di una migrazione già giustificata.

Può però abbassare troppo la soglia psicologica per introdurre distribuzione.

Per questo il principio operativo diventa:

> **più è economico costruire una topologia complessa, più dobbiamo essere rigorosi nel dimostrare che ci serve e nel misurare se ha prodotto il beneficio promesso.**

L'AI può esplorare dependency graph, boundary, contract, migration plan e failure mode.

Non elimina il fatto che qualcuno dovrà possedere il sistema risultante.

---

# Corollario

Il monolite non è il nemico.

Il coupling incontrollato lo è.

I microservizi non sono la cura automatica.

Sono una forma di distribuzione che deve comprare qualcosa di importante.

> **Prima costruisci confini che meritano di esistere. Poi decidi se meritano anche una rete in mezzo.**