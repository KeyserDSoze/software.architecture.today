# Capitolo 28 — L'architect del 2030

Per molto tempo abbiamo descritto l'architect attraverso gli artefatti che produce: diagrammi, specifiche, review, ADR, standard, reference architecture. Quegli artefatti continuano a essere utili, ma l'AI cambia il rapporto fra il costo di produrli e il valore professionale che rappresentano.

Un agente può leggere una codebase, proporre alternative, preparare un diagramma, scrivere una prima bozza di ADR, generare test, confrontare tecnologie e implementare una parte consistente della soluzione. Se il valore dell'architect coincide con la velocità con cui produce questi output, il ruolo sembra inevitabilmente comprimersi.

Se invece il valore consiste nel capire quale problema merita di essere risolto, mantenere coerenti business e sistema, riconoscere le decisioni ad alto blast radius, scegliere trade-off sotto vincoli reali e pretendere evidence proporzionata ai claim, allora il quadro cambia.

> **Quando produrre alternative costa meno, scegliere bene fra le alternative vale di più.**

Il riferimento al 2030 è simbolico. Non stiamo prevedendo una job description né sostenendo che esisterà un solo tipo di architect. Stiamo osservando un cambiamento già visibile: quando l'execution diventa più economica, la scarsità si sposta verso **judgment, contesto, authority, verifica e capacità di integrare conseguenze che appartengono a domini diversi**.

## Architecture come responsabilità, non come fabbrica di artefatti

Il libro ha attraversato analisi funzionale, boundary, API, dati, sistemi distribuiti, cloud, security, reliability, observability, testing, legacy, refactoring, costi, agent governance, runtime AI e production readiness. Nessuna di queste aree può essere governata soltanto attraverso diagrammi, e nessuna richiede che una singola persona sia il massimo esperto di tutto.

Il lavoro architetturale consiste sempre più nel sapere quale profondità serve per prendere una decisione credibile, quale evidence può falsificarla e quando la decision authority appartiene a uno specialista o a un domain owner.

Questo non allontana l'architect dal codice. Lo obbliga, al contrario, a restare abbastanza vicino alla realtà da accorgersi quando il modello mentale non coincide più con ciò che il sistema fa.

Un architecture decision acquista significato soltanto quando incontra implementation, runtime behavior, costi reali, incidenti, feedback utente e nuovi constraint. Per questo il ruolo non finisce con il design.

Microsoft Azure Well-Architected descrive il solution architect come una figura coinvolta lungo l'intero lifecycle del workload: raccoglie input dagli stakeholder, comprende il business context, bilancia aspetti tecnici, operativi ed economici e continua a contribuire durante implementazione, review ed evoluzione.

Fonti:

- [Microsoft Learn — Solution Architect's Responsibilities and Guiding Principles](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals)
- [Microsoft Learn — Support the workload in a consultative role](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support)

La fonte non definisce universalmente il mestiere. È però coerente con una proprietà che il percorso del libro ha reso evidente:

> **L'architettura non termina quando il diagramma è approvato. Inizia a essere verificabile quando il sistema comincia a vivere.**

## Il titolo può cambiare. La responsabilità resta

Una piccola organizzazione può non avere nessuno con il titolo formale `Software Architect`. Le responsabilità architetturali possono essere esercitate da un principal engineer, un tech lead, uno staff engineer o da chi possiede tecnicamente un prodotto. In un'impresa più grande possono essere distribuite fra solution, software, platform, data e security architect.

Il titolo non elimina le domande. Qualcuno deve capire il problema oltre il ticket, riconoscere le decisioni difficili da invertire, collegare funzionale e non funzionale, rendere esplicita l'ownership, chiedere evidence adeguata, facilitare trade-off e impedire che execution veloce diventi drift veloce.

Queste responsabilità possono essere distribuite bene oppure concentrate male. Possono esistere senza un architect title oppure mancare anche in presenza di un'intera funzione Architecture.

> **Architecture è una responsabilità prima di essere un ruolo.**

## L'AI amplifica il sistema che trova

DORA, nel report 2025 sul software development assistito da AI, descrive l'AI come un amplificatore: tende a magnificare sia le capacità di sistemi organizzativi solidi sia le debolezze di sistemi fragili.

Fonte:

- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)

Se requirement, ownership, test, repository e permission boundary sono ambigui, aggiungere agenti non crea automaticamente chiarezza. Può produrre più rapidamente codice plausibile, varianti architetturali, infrastruttura e test che incorporano la stessa ambiguità.

Se invece il sistema possiede functional clarity, boundary leggibili, decision record, golden command, fitness function, issue execution-ready, stop condition ed evidence model, l'AI può diventare leverage reale.

Quindi la domanda professionale non è soltanto:

> Come uso meglio l'AI?

È anche:

> **Quale sistema tecnico e organizzativo sto facendo amplificare all'AI?**

## Il compromesso ESI

ESI considera due estremi poco desiderabili. Il primo è un architect generalista che delega agli agenti tutta la profondità tecnica e conserva soltanto la capacità di parlare in astratto. Il secondo è uno specialista che concentra ogni decisione e trasforma Architecture in un gate seriale.

La direzione scelta è diversa: ampiezza sufficiente per comprendere business e sistema, almeno una profondità tecnica credibile, capacità di leggere codice e runtime evidence, specialist gate quando il rischio lo richiede e agent execution che non diventa mai self-certification.

Il costo è reale: studio continuo, lavoro cross-funzionale, maggiore esposizione a domini diversi e meno comfort nel restare per anni dentro una sola specializzazione. Ma il quality floor resta chiaro: architecture non disconnessa dall'implementation, functional semantics non delegate per default, technical judgment non sostituito da output AI e specialist authority rispettata.

La formula del capitolo è:

> **Ampiezza per capire il sistema. Profondità sufficiente per non essere ingannati dalle astrazioni.**

Le prossime sezioni sviluppano questa formula. Partiremo dalla comprensione funzionale, scenderemo nella technical literacy, arriveremo al judgment e all'organizzazione, poi agli agenti e all'apprendimento. Alla fine ricomporremo tutto nella **ESI Architect Capability Map**.

Non sarà una classifica di tecnologie né un punteggio personale. Sarà una risposta operativa alla domanda centrale:

> **Che cosa deve saper fare una persona affinché l'AI aumenti il suo leverage senza ridurre la qualità del suo judgment?**
