# Compromessi, non scorciatoie

Nel corso di questo libro Example Software Industries S.p.A. ci metterà spesso davanti a richieste incompatibili fra loro.

Product vorrà uscire prima.

Security vorrà ridurre il rischio.

Operations vorrà sistemi semplici da diagnosticare e recuperare.

Platform Engineering vorrà standardizzare.

I team prodotto vorranno autonomia.

Finance guarderà il costo totale.

Legal e Compliance introdurranno vincoli che non possono essere ignorati.

I clienti enterprise porteranno SLA, data residency, audit e integrazioni che il team non aveva previsto.

Se il libro facesse finta che tutte queste esigenze possano essere massimizzate contemporaneamente, racconterebbe un'architettura che esiste soltanto nei diagrammi.

Per questo useremo un compromesso esplicito in ogni capitolo.

## Un compromesso per capitolo

Ogni capitolo deve contenere almeno una decisione ESI in cui due o più esigenze legittime entrano in tensione.

Non deve essere una scenetta artificiale inserita per rispettare una formula.

Deve nascere dal problema del capitolo.

Per esempio:

```text
velocità
vs
comprensione

semplicità
vs
scalabilità indipendente

consistenza
vs
availability

standardizzazione
vs
autonomia

security
vs
frizione operativa

reliability
vs
costo

backward compatibility
vs
velocità di evoluzione

autonomia degli agenti
vs
blast radius
```

La domanda non sarà mai soltanto:

> Qual è la soluzione migliore?

La domanda sarà:

> **Quale soluzione ha il fit migliore con le priorità e i vincoli reali di questo momento?**

## Trade-off non significa abbassare la qualità

La parola *compromesso* può essere fraintesa.

Potrebbe sembrare il modo elegante per dire:

> Non abbiamo avuto tempo di farlo bene.

Non è ciò che intendiamo.

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Una deadline può farci scegliere una soluzione più semplice.

Non ci autorizza automaticamente a eliminare i test che ci servono per sapere se quella soluzione funziona.

Un budget limitato può farci rinunciare a un'architettura active-active multi-region.

Non ci autorizza a non avere backup o recovery coerenti con il rischio reale.

Un piccolo team può scegliere un modular monolith invece di molti servizi.

Non ci autorizza a creare un monolite senza confini, ownership e modularità.

Una maggiore autonomia degli agenti può aumentare l'execution.

Non ci autorizza a rinunciare a permission boundary, verification e stop condition.

## Il quality floor

Per ogni compromesso distingueremo tre categorie.

### Qualità che vogliamo ottimizzare

Sono le proprietà che motivano la decisione.

Per esempio:

- time-to-market;
- latency;
- costo;
- availability;
- developer experience;
- deployability;
- autonomia di team.

### Qualità che accettiamo di rendere meno ottimali

Sono costi reali della decisione.

Devono essere dichiarati.

Per esempio scegliere un modular monolith può significare accettare che non tutti i moduli abbiano deploy e failure isolation indipendenti.

### Qualità non negoziabili

Sono il **quality floor**.

Il loro livello dipende dal contesto, ma una volta definito non può essere abbassato accidentalmente per rendere più comoda la soluzione.

Possono includere:

- correctness;
- data integrity;
- requisiti normativi;
- isolamento fra tenant;
- sicurezza minima;
- possibilità di recovery;
- audit richiesto;
- compatibilità contrattuale;
- verificabilità;
- accountability.

Non tutte queste proprietà avranno la stessa soglia in tutti i prodotti.

Ma se una proprietà è realmente non negoziabile, il trade-off deve rispettarla.

## Guardrail: come rendiamo sicuro il compromesso

Un compromesso serio non finisce con la decisione.

Chiede anche:

> Come impediamo che il costo accettato superi il limite?

I guardrail possono essere:

- test;
- contract test;
- permission boundary;
- static analysis;
- architecture test;
- budget alert;
- SLO;
- feature flag;
- canary;
- rate limit;
- backup;
- rollback;
- observability;
- ADR;
- manual gate;
- stop condition per un agente.

Il guardrail non elimina il trade-off.

Lo rende governabile.

## Trigger di revisione

Una decisione può essere corretta oggi e sbagliata fra un anno.

Per questo i compromessi importanti devono avere trigger osservabili.

Per esempio:

```text
se il p95 supera X
→ rivalutare il caching

se due team devono rilasciare indipendentemente ogni settimana
→ rivalutare il service boundary

se il carico della console impatta il workload transazionale
→ rivalutare il read model

se compare un requisito RPO più severo
→ rivalutare la strategia di recovery

se un agente ottiene permessi più ampi
→ rivalutare autonomy level e verification
```

L'architettura non è la promessa di non cambiare idea.

È la capacità di sapere **quando** cambiare idea e **perché**.

## Evidence, non teatro decisionale

Nel caso ESI i bisogni aziendali sono simulati.

Le caratteristiche delle tecnologie no.

Se diciamo che una scelta dipende da semantica HTTP, proprietà di PostgreSQL, capability di Kubernetes, modelli di consistency, pattern di resilienza o controlli di security, cercheremo evidenze in:

- RFC e standard;
- documentazione ufficiale;
- Microsoft Learn / Azure Architecture Center;
- AWS Well-Architected e Builders' Library;
- Google Cloud Architecture Framework e Google SRE;
- NIST;
- OWASP;
- CNCF e OpenTelemetry;
- paper;
- engineering blog e postmortem reali.

Inoltre il libro introdurrà **casi reali documentati** separati da ESI.

ESI serve per vedere il processo end-to-end.

I casi reali servono per confrontare quel processo con ciò che organizzazioni reali hanno pubblicamente documentato.

## La struttura che useremo

Quando un compromesso ESI è abbastanza importante, il capitolo deve rendere leggibili almeno questi elementi:

```text
Esigenza
→ perché dobbiamo decidere

Tensione
→ quali obiettivi sono in conflitto

Scelta
→ che cosa facciamo adesso

Costo accettato
→ che cosa non stiamo massimizzando

Quality floor
→ che cosa non possiamo compromettere

Guardrail
→ come limitiamo il rischio

Evidence
→ su cosa basiamo la scelta

Trigger
→ quando la rivaluteremo
```

Questo schema non deve diventare una gabbia grafica ripetuta meccanicamente in ogni capitolo.

Deve però rimanere riconoscibile nel ragionamento.

## Il principio che ci accompagnerà

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

La buona architettura non trova una soluzione senza costi.

Trova costi che siamo disposti a pagare, protegge ciò che non può essere sacrificato e rende evidente quando il conto sta diventando troppo alto.