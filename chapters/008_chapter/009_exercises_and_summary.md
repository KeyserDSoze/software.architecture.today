## Esercizi, autovalutazione e sintesi

Questo capitolo non chiede di scegliere una squadra.

Chiede di imparare a vedere la topologia come una decisione economica, organizzativa e operativa.

### Idee chiave

1. **Monolite non significa automaticamente legacy.**
2. **Modularità logica e distribuzione fisica sono due problemi distinti.**
3. **Un modular monolith può avere confini forti e un solo deployable.**
4. **I microservizi comprano proprietà utili soltanto se producono vera autonomia.**
5. **Deploy independence, failure isolation e scaling independence devono essere reali, non nominali.**
6. **La distribuzione sposta complessità verso rete, dati, observability, security e operations.**
7. **Team boundary e service boundary possono allinearsi, ma non devono coincidere meccanicamente.**
8. **Un distributed monolith combina spesso i costi dei microservizi con il coupling di un monolite mal progettato.**
9. **Prima rendi credibile un boundary nel codice; poi valuta se merita un boundary di rete.**
10. **L'AI riduce il costo dell'estrazione, non dimostra che l'estrazione abbia senso.**

---

## Esercizio 1 — Monolite o big ball of mud?

Prendi un'applicazione che conosci bene.

Descrivi:

- deployable principali;
- moduli logici;
- ownership dei dati;
- dipendenze tra moduli;
- componenti che possono modificare direttamente dati altrui.

Poi rispondi:

> Il problema principale è davvero il fatto che sia un monolite, oppure la mancanza di boundary interni?

Non usare la parola “monolite” come spiegazione.

Spiega il meccanismo concreto del problema.

---

## Esercizio 2 — Separazione logica vs operativa

Per tre componenti del tuo sistema compila questa tabella:

| Componente | Boundary logico forte? | Deploy indipendente utile? | Scaling indipendente utile? | Failure isolation utile? | Team autonomo? |
|---|---:|---:|---:|---:|---:|
| A | | | | | |
| B | | | | | |
| C | | | | | |

Poi individua almeno un componente che dovrebbe essere **modulare ma non necessariamente distribuito**.

---

## Esercizio 3 — Il prezzo della distribuzione

Scegli un modulo che vorresti estrarre.

Elenca tutto ciò che dovresti aggiungere dopo l'estrazione:

- deployment;
- networking;
- auth tra servizi;
- observability;
- retry/timeout;
- contract versioning;
- data migration;
- backup;
- on-call;
- incident ownership;
- cost attribution.

Poi scrivi una frase:

> “Paghiamo questi costi per comprare __________.”

Se il completamento è vago, la motivazione dell'estrazione probabilmente lo è altrettanto.

---

## Esercizio 4 — Cerca il distributed monolith

Analizza un sistema distribuito reale che conosci.

Cerca almeno cinque segnali tra:

- deploy coordinati;
- database condiviso senza ownership;
- shared domain package;
- catene sincrone profonde;
- release train obbligatorio;
- DTO condivisi ovunque;
- modifiche multi-repository quasi sistematiche;
- test end-to-end come unico safety net;
- incidenti che attraversano sempre molti servizi.

Per ogni segnale proponi una modifica che migliori autonomia **senza necessariamente unire i servizi**.

---

## Esercizio 5 — Service extraction test

Scegli un modulo e valuta i sette segnali discussi nel capitolo:

```text
ciclo di cambiamento
profilo di carico
failure isolation
security boundary
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

Poi decidi:

```text
resta nel deployable
prepara il boundary
estrai ora
```

Motiva la decisione con massimo cinque righe.

---

## Esercizio 6 — L'organigramma non è il dominio

Prendi la struttura del tuo team o della tua organizzazione.

Confrontala con i boundary del software.

Dove coincidono bene?

Dove il software è stato diviso soltanto perché esistono team differenti?

Dove più team condividono invece una capability senza ownership end-to-end?

Proponi un cambiamento organizzativo **oppure** architetturale che riduca coordinamento inutile.

---

## Esercizio 7 — Shared database, ownership distinta

Immagina tre moduli sullo stesso PostgreSQL.

Definisci:

- tabelle possedute;
- accessi consentiti;
- accessi vietati;
- query cross-module ammesse;
- contratto da usare al posto dell'accesso diretto.

Poi chiediti:

> Se domani separassimo un modulo, quali violazioni renderebbero l'estrazione difficile?

---

## Esercizio 8 — Red team sulla migrazione a microservizi

Chiedi a un agente AI:

> “Assumi che la nostra proposta di migrazione a microservizi sia sbagliata. Cerca tutti i costi e le dipendenze che stiamo sottovalutando.”

Poi esegui il prompt opposto:

> “Assumi che mantenere questa topologia monolitica sia sbagliato. Cerca i requisiti che giustificano separazione fisica.”

Confronta i due report.

Non scegliere quello che conferma la tua idea iniziale.

Cerca l'evidenza più forte.

---

## Esercizio 9 — Acme Orders cambia contesto

Modifica il caso Acme Orders con queste nuove condizioni:

```text
Payments viene affidato a un team dedicato
il carico cresce 20x
nuovi requisiti PCI/compliance aumentano l'isolamento richiesto
Orders continua ad avere traffico moderato
Payments deve essere rilasciato più volte al giorno
```

Rivaluta la decisione del capitolo.

Quali segnali di estrazione sono diventati forti?

Quali costi nuovi accetteresti?

Quali contratti e data boundary dovrebbero essere preparati prima?

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

Ogni servizio che decidi di mantenere deve avere una giustificazione esplicita.

Questo esercizio non dimostra che il monolite sia migliore.

Misura quanta distribuzione è realmente necessaria.

---

## Autovalutazione

Prima di considerare chiuso il capitolo, prova a rispondere senza guardare il testo.

1. Perché modularità e distribuzione non sono sinonimi?
2. Che cosa distingue un modular monolith da un big ball of mud?
3. Quali proprietà possono giustificare microservizi?
4. Perché un deployable separato non garantisce deploy independence?
5. Come può un sistema a microservizi restare un unico failure domain?
6. Qual è il costo cognitivo della distribuzione?
7. Qual è la differenza tra team boundary e service boundary?
8. Quali sono tre segnali di distributed monolith?
9. Perché ownership del database conta anche se l'istanza è condivisa?
10. Quali segnali possono suggerire l'estrazione di un servizio?
11. Perché conviene rendere credibile prima il boundary logico?
12. Come cambia la decisione quando il team è molto piccolo?
13. In che modo l'AI può aiutare a valutare un'estrazione?
14. Perché generare facilmente infrastruttura non riduce automaticamente il costo operativo?
15. Quale proprietà dovrebbe comprare ogni nuova separazione fisica?

Se alcune risposte richiedono formule come “perché è più scalabile” o “perché è più moderno”, torna al contesto e rendile concrete.

---

## Artefatto operativo del capitolo

Il capitolo non introduce un nuovo documento principale, ma estende gli artefatti già costruiti.

In particolare, per una decisione di topologia dovremmo collegare:

```text
Problem & Outcome Brief
Architecture Context Map
Component Responsibility Map
Non-Functional Requirements Card
ADR
```

L'ADR di estrazione dovrebbe rispondere almeno a:

```text
Quale proprietà compriamo?
Quale boundary esiste già?
Quali dati possiede?
Quali nuovi failure mode introduciamo?
Chi lo opera?
Come migriamo?
Come verifichiamo il beneficio?
Quando rivalutiamo?
```

---

## Che cosa cambia con l'AI

Con agenti capaci di modifiche repository-wide, generazione di infrastruttura e migrazioni assistite, la separazione fisica diventa più accessibile.

Questo è un vantaggio reale.

Ma può anche abbassare troppo la soglia psicologica per introdurre distribuzione.

Quindi il principio operativo diventa:

> **più è economico costruire una topologia complessa, più dobbiamo essere rigorosi nel dimostrare che ci serve.**

L'AI può aiutarci a esplorare boundary, dependency graph, migration plan e failure mode.

Non può eliminare il fatto che qualcuno dovrà possedere il sistema risultante.

---

## Corollario

Il monolite non è il nemico.

Il coupling incontrollato lo è.

E i microservizi non sono la cura automatica.

Sono una forma di distribuzione che deve comprare qualcosa di importante.

> **Prima costruisci confini che meritano di esistere. Poi decidi se meritano anche una rete in mezzo.**