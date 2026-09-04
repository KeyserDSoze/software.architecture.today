# Evidenze reali e failure mode del leverage individuale

Il One-Man Project è una tesi prospettica. Oggi non esiste una fonte seria che dimostri universalmente che “una persona con agenti equivale a un intero team software”.

Possiamo però osservare alcuni pezzi del modello: l’AI può aumentare l’execution individuale, ampliare la varietà dei task affrontabili e ridurre il costo di delegare lavoro. Possiamo anche osservare che questi benefici dipendono da context, environment, task quality e scrutiny.

La posizione del libro deve quindi restare più precisa del marketing:

> **L’evidence disponibile supporta un aumento del leverage individuale. Non supporta l’idea che collaborazione, ownership e continuity siano diventate obsolete.**

## Più task completati non equivale automaticamente a più valore

Nel 2025 Microsoft Research ha aggregato tre randomized field experiment su 4.867 software developer e ha riportato un aumento medio del 26,08% dei task completati per i developer con accesso a un AI coding assistant.

Fonte:

- [Microsoft Research — The Effects of Generative AI on High-Skilled Work](https://www.microsoft.com/en-us/research/publication/the-effects-of-generative-ai-on-high-skilled-work-evidence-from-three-field-experiments-with-software-developers/)

Questo rende credibile l’aumento di throughput individuale. Non consente però il salto:

```text
more completed tasks
→ more business value
→ fewer people always required
→ one person can own every decision
```

Il framework SPACE ci ricorda la stessa cosa da un’altra direzione: developer productivity è multidimensionale e include performance, communication, satisfaction, activity ed efficiency/flow.

Fonte:

- [Microsoft Research / ACM Queue — The SPACE of Developer Productivity](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/)

Quindi il pilot non può essere valutato dal numero di agent task o PR prodotti.

## Il task multiplier richiede ancora un execution system

OpenAI descrive l’uso interno di Codex per codebase understanding, refactoring, migration, test, incident investigation e task asincroni. È un esempio concreto di execution multiplication.

Fonte:

- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

La parte più utile, per il nostro capitolo, è che questa capacità non viene presentata come autonomia illimitata. Well-scoped task, structured context, environment setup, iteration e review restano parte del sistema.

Il leverage quindi non nasce soltanto dal modello. Nasce dall’engineering environment che rende delegabile il lavoro.

Un’altra ricerca Microsoft del 2025, basata su survey, randomized trial e diary study, ha riportato che l’uso sostenuto aumentava utilità percepita e piacevolezza dello strumento, mentre la percezione della trustworthiness del codice generato restava sostanzialmente invariata. Gli autori raccomandano di bilanciare productivity gain e critical evaluation.

Fonte:

- [Microsoft Research — Dear Diary: A Randomized Controlled Trial of Generative AI Coding Tools in the Workplace](https://www.microsoft.com/en-us/research/publication/dear-diary-a-randomized-controlled-trial-of-generative-ai-coding-tools-in-the-workplace/)

È un risultato particolarmente importante per il One-Man Project:

> **Friction che diminuisce non è evidence che il rischio sia diminuito nella stessa misura.**

## Ownership esplicita resta una proprietà del sistema

GitHub ha descritto `SERVICEOWNERS` come un modo per mantenere esplicito il mapping fra componenti/servizi e maintainer, utile anche durante incidenti e cambi organizzativi.

Fonte:

- [GitHub Engineering — SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

Non è un caso di One-Man Project. È utile proprio perché mostra che, quando i sistemi crescono, ownership e maintainership devono essere rintracciabili indipendentemente da chi ha scritto il codice.

Se il nostro operating model aumenta execution ma rende più difficile capire chi può decidere, chi può operare e chi prende il controllo in assenza del lead, abbiamo guadagnato velocità perdendo organizzazione.

## Prima famiglia — Il control plane collassa sotto il proprio data plane

Il failure più immediato è **review collapse**.

Gli agenti producono più output, il lead accumula review, inizia a campionare superficialmente e i green check sostituiscono progressivamente la comprensione. Lo stesso meccanismo produce attention fragmentation: continue notifiche, repair loop e context switch consumano il tempo che avrebbe dovuto essere liberato dall’automazione.

La radice è comune: execution throughput supera decision e verification throughput.

I guardrail sono WIP limit, batch review, task semanticamente più piccoli, deterministic evidence e una regola semplice: quando il review backlog cresce, si smette di lanciare lavoro.

## Seconda famiglia — Il leverage concentra conoscenza e falsa competenza

Nel **hero loop**, ogni domanda torna al lead. Il lead risolve, il repository impara poco, e il task successivo dipende di nuovo dalla stessa persona. Gli agenti aumentano la velocità con cui il sistema diventa dipendente dall’hero developer.

Una variante è la **synthetic seniority**: l’output specialistico dell’AI rende meno visibile il fatto che il lead non possiede abbastanza competenza per giudicarne le conseguenze.

Entrambi i failure si combattono con knowledge externalization, explicit non-authorities, specialist trigger e continuity drill. Il lead deve anche continuare a studiare: delegation non sostituisce competence development.

## Terza famiglia — Il progetto confonde sviluppo con operabilità

Un progetto può essere sviluppato da una persona e diventare implicitamente un **one-person production pager**. Se ogni incidente richiede quel lead, l’operating model non è sostenibile.

Qui entra l’organizzazione invisibile: platform, identity, security tooling, managed service, CI/CD e incident management sono parte del leverage. Nasconderli nella narrativa “una persona ha costruito tutto” porta a decisioni sbagliate su staffing e support.

Il One-Man Project enterprise deve quindi rendere esplicite le capability condivise su cui si appoggia e definire operating-hours, escalation e secondary maintainer.

## Quarta famiglia — Il modello sopravvive oltre il proprio fit

Il failure più lento può arrivare dal successo.

Il prodotto cresce, arrivano più utenti, contract, incidenti e stakeholder. Il lead continua a difendere la struttura originale perché fino a quel momento ha funzionato.

Anche agent cost e rework possono invertire l’economia: il costo per token sembra basso, ma retry, repair, review e unused output fanno salire il **cost per verified outcome**.

In entrambi i casi la radice è la stessa: l’operating model non viene più trattato come una decisione versionata.

Per questo gli exit trigger sono parte della design, non una nota finale.

> **Il successo che rende necessario un team è comunque successo. Cambiare operating model in quel momento è evoluzione, non sconfitta.**

## Che cosa possiamo concludere

Le fonti reali disponibili consentono di sostenere che l’AI può aumentare capacità e velocità su molte attività software e che l’uso efficace richiede task, context, environment e review progettati.

Non consentono ancora di sostenere che la scala organizzativa corretta del software futuro sia “una persona per prodotto”.

La conclusione del capitolo resta quindi deliberatamente più sobria:

> **Tratta l’aumento di leverage individuale come una nuova capability da governare. Misura outcome, scrutiny, continuity e costo; poi lascia che l’evidence decida quanto piccolo può davvero diventare il control plane umano.**
