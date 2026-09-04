# Compromessi, non scorciatoie

Nel corso di questo libro Example Software Industries S.p.A. ci metterà spesso davanti a richieste incompatibili fra loro. Product vorrà uscire prima, Security vorrà ridurre il rischio, Operations pretenderà sistemi semplici da diagnosticare e recuperare, Platform Engineering cercherà standardizzazione mentre i team prodotto chiederanno autonomia. Finance guarderà il costo totale, Legal e Compliance introdurranno vincoli non negoziabili, e i clienti enterprise porteranno SLA, data residency, audit e integrazioni che il team non aveva previsto.

Se il libro facesse finta che tutte queste esigenze possano essere massimizzate contemporaneamente, racconterebbe un'architettura che esiste soltanto nei diagrammi. Per questo ogni capitolo deve rendere visibile almeno un compromesso reale per il contesto ESI, non come scenetta artificiale ma come conseguenza naturale del problema affrontato.

## Un compromesso per capitolo

Le tensioni cambiano a seconda del tema. A volte dovremo bilanciare velocità e comprensione, altre volte semplicità e scalabilità indipendente. In un sistema distribuito potremo sacrificare parte della consistenza per aumentare availability; in una piattaforma dovremo scegliere quanta standardizzazione imporre senza annullare l'autonomia dei team. Security può aumentare frizione operativa, reliability può costare di più, backward compatibility può rallentare l'evoluzione e una maggiore autonomia degli agenti può aumentare il blast radius.

La domanda quindi non sarà quasi mai “qual è la soluzione migliore?” in senso assoluto. Sarà piuttosto:

> **Quale soluzione ha il fit migliore con le priorità e i vincoli reali di questo momento?**

## Trade-off non significa abbassare la qualità

La parola *compromesso* può essere fraintesa come un modo elegante per dire che non abbiamo avuto tempo di fare bene il lavoro. Non è ciò che intendiamo.

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Una deadline può spingerci verso una soluzione più semplice, ma non ci autorizza automaticamente a eliminare i test che servono per sapere se quella soluzione funziona. Un budget limitato può rendere sproporzionata un'architettura active-active multi-region senza giustificare l'assenza di backup o recovery coerenti con il rischio. Un piccolo team può scegliere un modular monolith invece di molti servizi, ma non per questo deve accettare un monolite senza confini o ownership. Allo stesso modo, una maggiore autonomia degli agenti può aumentare l'execution senza rendere superflui permission boundary, verification e stop condition.

## Il quality floor

Per ragionare sui compromessi distingueremo tre cose. La prima è ciò che vogliamo **ottimizzare**, per esempio time-to-market, latency, costo, availability, developer experience, deployability o autonomia di team. La seconda è ciò che accettiamo consapevolmente di rendere meno ottimale: scegliere un modular monolith, per esempio, può significare rinunciare a deploy e failure isolation completamente indipendenti per ogni modulo.

La terza categoria è il **quality floor**, cioè l'insieme delle proprietà che, in quel contesto, non possiamo degradare soltanto per rendere più comoda una scelta. Correctness, data integrity, requisiti normativi, isolamento fra tenant, sicurezza minima, recovery, audit, compatibilità contrattuale, verificabilità e accountability possono appartenere a questa categoria. La soglia concreta cambia da prodotto a prodotto, ma una volta dichiarata deve restare visibile durante la decisione.

## Guardrail: come rendiamo governabile il compromesso

Un compromesso serio non finisce con la scelta. Deve anche spiegare come impedire che il costo accettato superi il limite. Test e contract test, permission boundary, static analysis e architecture test possono trasformare un rischio in qualcosa di osservabile. SLO, budget alert, feature flag, canary, rate limit, backup, rollback e observability fanno la stessa cosa a livelli diversi. In altri casi il guardrail può essere un ADR, un manual gate o una stop condition imposta a un agente.

Il guardrail non elimina il trade-off. Lo rende governabile.

## Trigger di revisione

Una decisione corretta oggi può diventare sbagliata fra un anno. Per questo i compromessi importanti devono avere trigger osservabili: un p95 che supera una soglia può riaprire la discussione sul caching; due team che devono rilasciare indipendentemente ogni settimana possono costringerci a rivalutare un service boundary; un nuovo requisito RPO può rendere insufficiente la strategia di recovery. Se il carico di una console inizia a impattare il workload transazionale, o se un agente ottiene permessi più ampi di quelli inizialmente previsti, la decisione va riesaminata.

L'architettura non è la promessa di non cambiare idea. È la capacità di sapere **quando** cambiare idea e **perché**.

## Evidence, non teatro decisionale

Nel caso ESI i bisogni aziendali sono simulati, ma le caratteristiche delle tecnologie no. Se una scelta dipende da semantica HTTP, proprietà di PostgreSQL, capability di Kubernetes, modelli di consistency, pattern di resilienza o controlli di security, cercheremo evidenze in RFC e standard, documentazione ufficiale, Microsoft Learn, AWS Well-Architected e Builders' Library, Google Cloud Architecture Framework e Google SRE, NIST, OWASP, CNCF, OpenTelemetry, paper ed engineering blog o postmortem reali.

Il libro userà inoltre casi reali documentati separati da ESI. ESI serve a seguire il processo end-to-end; i casi reali servono a confrontare quel processo con ciò che organizzazioni reali hanno pubblicamente documentato.

## La struttura che useremo

Quando un compromesso ESI è abbastanza importante, il ragionamento deve rendere riconoscibili alcuni elementi: l'esigenza che ci costringe a decidere, la tensione fra obiettivi legittimi, la scelta fatta adesso e il costo che accettiamo di pagare. Deve inoltre chiarire il quality floor, i guardrail, l'evidence su cui si basa la decisione e il trigger che ci farà rivalutarla.

Questa struttura non deve diventare una gabbia grafica ripetuta meccanicamente in ogni capitolo. Deve però rimanere leggibile nel ragionamento, perché un trade-off nascosto non è davvero governato.

## Il principio che ci accompagnerà

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

La buona architettura non trova una soluzione senza costi. Trova costi che siamo disposti a pagare, protegge ciò che non può essere sacrificato e rende evidente quando il conto sta diventando troppo alto.