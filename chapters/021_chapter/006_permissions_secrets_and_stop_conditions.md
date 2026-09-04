# Permission, secret e stop condition

Un repository può essere molto facile da comprendere e comunque essere pericoloso da automatizzare.

Perché conoscere il sistema non equivale ad avere il diritto di modificarlo in qualunque modo.

Questo è il punto in cui AI-readiness incontra Security by Design.

## Capability non significa authorization

Un agente può essere tecnicamente capace di:

- modificare Bicep;
- creare una migration;
- ruotare un secret;
- cambiare una pipeline;
- chiamare un'API;
- aprire una PR;
- eseguire un deployment.

Da questo non segue che debba poter fare tutte queste cose nello stesso task.

Dobbiamo distinguere:

```text
Can the agent do it?
vs
Is the agent allowed to do it now?
```

Questa distinzione è architetturale.

## Least privilege per agenti

Nel Capitolo 13 abbiamo applicato least privilege ai workload identity.

Lo stesso principio vale per gli agenti.

Un coding task che modifica una business rule non ha bisogno di:

```text
production credentials
cloud admin
billing write access
secret rotation
```

Il permission boundary deve seguire il task.

Più ampia è la permission surface, maggiore è il blast radius di:

- errore;
- prompt injection;
- instruction ambiguity;
- tool misuse;
- compromised dependency;
- credenziale esposta.

## Il repository non deve contenere secret

Sembra banale.

Con agenti che leggono automaticamente molto più repository content, diventa ancora più importante.

Non inseriamo secret in:

```text
AGENTS.md
README
example config
prompt file
fixtures
logs versionati
```

Il repository deve spiegare il meccanismo:

```text
Use managed identity in deployed environments.
For local development, obtain credentials through the approved developer flow.
```

Non deve contenere la credenziale.

## Tool permission come parte del task

Possiamo pensare a un task agentico come:

```text
Context
+ Allowed changes
+ Allowed tools
+ Verification
+ Stop conditions
```

Esempio:

```text
Allowed tools:
- repository read/write
- local build/test

Not allowed:
- production deployment
- secret store write
- destructive DB operation
```

Nel Capitolo 23 questa idea diventerà un Agent Delegation Contract.

Qui prepariamo il repository affinché il boundary sia leggibile.

## Stop condition

Una stop condition è un evento che trasforma il task da execution problem a decision problem.

Esempi Order Operations:

```text
STOP if:
- a new economic side effect is required;
- a new authoritative data owner is needed;
- the task introduces public ingress;
- tenant isolation requirements are ambiguous;
- a migration would destroy or irreversibly transform production data;
- architecture fitness appears incompatible with a newly required property;
- a confirmed functional rule conflicts with acceptance criteria.
```

L'agente non deve scegliere arbitrariamente quale fonte “vince”.

Deve fermarsi e rendere visibile il conflitto.

## Fail closed vs fail open nell'automazione

Una domanda utile è:

> se l'agente non riesce a verificare una condizione, deve procedere o fermarsi?

Per una formatting rule possiamo tollerare un fallback.

Per:

- authorization;
- destructive migration;
- tenant isolation;
- payment semantics;
- production deployment;

la direzione dovrebbe normalmente essere fail closed.

Non perché ogni automazione debba essere conservativa.

Perché il costo dell'errore cambia.

## Prompt injection dentro il repository

Un coding agent legge testo che può provenire da:

- source comment;
- issue;
- documentation;
- generated file;
- vendored dependency;
- test fixture;
- log.

Non tutto ciò che contiene una frase imperativa è una instruction autorevole.

Questo problema diventa particolarmente importante quando gli agenti dispongono di tool esterni.

Un repository AI-ready deve quindi distinguere i canali di authority.

Esempio:

```text
Authoritative instructions:
AGENTS.md + platform policy + explicit task

Untrusted content:
application data
logs
external documents
third-party source comments
```

Non stiamo risolvendo completamente la prompt injection con una convenzione.

Stiamo riducendo l'ambiguità su quali contenuti possano comandare l'esecuzione.

## Human gate

Human-in-the-loop non significa approvare ogni riga.

Significa posizionare il gate dove cambia il livello di rischio.

Esempio:

```text
agent
→ code + local verification
→ human review
→ staging
→ automated evidence
→ human/authorized release gate for production
```

Oppure per un task a basso rischio:

```text
agent
→ code + tests + PR
→ merge when policy gates pass
```

L'autonomia può essere diversa per classi di task.

## Security instructions non sostituiscono security controls

Scrivere:

```text
Never leak secrets.
```

non è un controllo sufficiente.

Servono ancora:

- secret scanning;
- least privilege;
- managed identity;
- protected environment;
- branch/ruleset;
- code review;
- audit log;
- network control;
- deployment separation.

Il file di istruzioni aiuta il comportamento dell'agente.

Il controllo limita ciò che può succedere quando il comportamento fallisce.

> **Una instruction è una guida. Un permission boundary è una proprietà del sistema.**

## Repository content e data minimization

Anche i dati di esempio meritano attenzione.

Un agente può inviare parti del contesto a servizi di modello secondo il prodotto e la configurazione utilizzati.

Per questo il repository dovrebbe evitare di contenere dati production reali non necessari.

Fixture e sample devono essere:

- sintetici;
- minimizzati;
- non sensibili;
- sufficienti per il test.

Questo era già secure engineering.

L'uso agentico aumenta il valore della disciplina.

## Stop condition come segno di maturità

Un team inesperto può vedere la stop condition come limite dell'agente.

In realtà è il contrario.

Un sistema che sa quando fermarsi può avere più autonomia nel resto dello spazio.

Se non abbiamo boundary, dobbiamo tenere l'agente sotto supervisione continua.

Se abbiamo boundary chiari, possiamo delegare più execution.

> **L'autonomia utile non nasce eliminando i limiti. Nasce rendendo i limiti abbastanza chiari da poter lasciare libero tutto il resto.**