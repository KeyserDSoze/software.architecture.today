# Giocare fuori ruolo senza fingere competenza

Una delle conseguenze più interessanti dell’AI è che i confini fra ruoli diventano più permeabili.

Un backend engineer può costruire una prima UI. Un architect può esplorare una query complessa. Un product engineer può preparare una candidate IaC change. Un developer può leggere un’analisi funzionale, proporre acceptance criteria e costruire un primo threat flow.

Questa elasticità rende possibile una parte del leverage del One-Man Project: molte attività non richiedono più necessariamente un handoff completo soltanto perché appartengono a una disciplina diversa.

Ma c’è una distinzione che dobbiamo proteggere:

```text
role elasticity
≠
competence transfer
≠
authority transfer
```

> **L’AI può ridurre il costo di entrare in un territorio. Non riduce automaticamente il costo di essere responsabili delle conseguenze in quel territorio.**

## Il rischio della competenza sintetica

Un output generato può avere la forma di un lavoro specialistico: terminologia corretta, struttura plausibile, configurazione sintatticamente valida, riferimenti tecnici convincenti.

Questa qualità superficiale crea un rischio particolare. Possiamo iniziare a confondere “sono riuscito a produrre una candidate solution” con “comprendo abbastanza il dominio da possederne la decisione”.

Un agente può generare una configurazione Kubernetes funzionante e il lead può comunque non sapere riconoscere i failure mode di scheduling, network policy o upgrade. Può produrre un threat model plausibile senza trasformare Engineering nel proprietario della security posture. Può scrivere una formula fiscale senza trasferire Legal o Finance dentro il repository. Può proporre un payment workflow senza spostare la verità economica da Payments & Risk a Commerce & Operations.

Questa è una forma di **competence laundering**: la qualità dello stile dell’output nasconde la distanza fra capacità di generazione e capacità di giudizio.

Il One-Man Project deve essere progettato proprio per evitare che il leverage renda più difficile riconoscere ciò che non sappiamo.

## La breadth che serve davvero

Il lead non deve diventare lo specialista migliore in ogni area. Deve però possedere abbastanza breadth da riconoscere quando un task cambia classe.

Deve accorgersi che una modifica apparentemente locale cambia un contract, sposta data ownership, apre una trust boundary, introduce un economic side effect o crea una one-way door. Deve sapere dove vive la source of truth e quale evidence sarebbe sufficiente a giudicare il risultato.

Questa è la competenza trasversale che rende governabile la delega.

> **Il manager di agenti non deve sapere fare meglio tutto. Deve sapere quando il sistema gli sta chiedendo una decisione che non può prendere da solo.**

Qui torna con forza la functional literacy del Capitolo 2. Se il lead conosce soltanto la tecnologia, gli agenti amplificano subito ogni ambiguità sul comportamento del prodotto. Per governare execution deve saper leggere attori, journey, stati, regole, eccezioni, authorization semantics, acceptance criteria e open question.

Più possiamo delegare l’implementazione, meno possiamo permetterci di non capire la funzione.

Lo stesso vale per architecture e security literacy. Il lead deve riconoscere boundary, coupling, ownership, consistency, reversibilità, blast radius; deve sapere che authentication non equivale ad authorization, credential non equivale a permission e tool availability non equivale ad autorizzazione.

Una ricerca Microsoft del 2025 su 860 developer ha rilevato che l’apertura verso l’uso dell’AI varia in modo significativo per tipo di task e che reliability e security diventano priorità particolarmente importanti quando il lavoro tocca sistemi reali. È un’ulteriore conferma che “quanto AI usare” non è una proprietà uniforme del ruolo, ma dipende dal rischio e dalla conoscenza coinvolti.

Fonte:

- [Microsoft Research — AI Where It Matters](https://www.microsoft.com/en-us/research/publication/ai-where-it-matters-where-why-and-how-developers-want-ai-support-in-daily-work/)

## Specialist gate: l’authority resta dove serve

Per evitare sia l’hero developer sia la burocrazia, ESI usa **specialist gate trigger-based**.

Il lead può esplorare, preparare una proposta e produrre evidence. Ma quando il lavoro attraversa una certa boundary, l’authority della decisione resta presso la funzione appropriata.

Una nuova business semantic richiede Product/Operations. Un nuovo payment side effect o una modifica a ledger truth richiede Payments & Risk. Una nuova trust boundary, public ingress o sensitive-data path richiede Security. Una capability condivisa, una nuova topology o un enterprise identity/network change può richiedere Platform. Retention, regulated data o jurisdictional constraint possono richiedere Legal/Compliance.

Non tutti questi gate devono comparire in ogni task. Il valore del modello sta proprio nel renderli **condizionali**.

```text
boundary non attraversata
→ lead proceeds within existing authority

boundary attraversata
→ specialist gate
```

La distinction è importante: lo specialista non deve produrre necessariamente tutto il lavoro della propria area. Mantiene però authority sulla decisione che appartiene a quella funzione.

## Il test prima di accettare lavoro fuori ruolo

Prima di portare avanti un task fuori dalla propria specializzazione, il lead dovrebbe essere in grado di rispondere a quattro domande: quale failure mode principale sto rischiando? Dove vive la source of truth? Quale evidence mi permetterà di giudicare il risultato? Quale scoperta mi obbliga a fermarmi e coinvolgere un’altra authority?

Se queste risposte sono confuse, il fatto che un agente possa produrre subito una soluzione non risolve il problema. Lo rende soltanto meno visibile.

L’obiettivo non è restare dentro il proprio job title. È attraversare i confini professionali mantenendo chiari i confini di responsabilità.

> **Gioca fuori ruolo. Non giocare fuori competenza, authority e responsabilità.**
