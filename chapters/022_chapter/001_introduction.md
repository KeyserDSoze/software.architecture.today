# Capitolo 22 — Issue-driven development

Il Capitolo 21 ha reso il repository più capace di spiegare **in quale mondo** si trova un nuovo executor.

Resta una domanda molto più locale:

> **Che cosa deve cambiare adesso?**

Se la risposta vive soltanto in una chat, in una call o nella memoria di chi ha chiesto il lavoro, abbiamo un nuovo punto di tribal knowledge. Il repository può essere perfettamente navigabile e il task restare ambiguo.

In questo capitolo useremo la **issue** come boundary operativo fra decisione ed execution.

Non perché GitHub Issues sia l'unico strumento possibile. Il modello vale per Jira, Azure Boards, Linear o un sistema interno. Qui *issue* significa semplicemente un work item tracciabile che conserva abbastanza intent da permettere a una persona o a un agente di eseguire senza inventare decisioni che non gli appartengono.

> **Il repository dice all'executor quale sistema sta modificando. La issue dice quale parte di quel sistema è autorizzato a cambiare adesso.**

## Una issue non è una ricetta di implementazione

Consideriamo una richiesta apparentemente semplice:

```text
Aggiungere retry al publisher.
```

Possiamo renderla più tecnica:

```text
Aggiungere retry con exponential backoff.
```

Ma il secondo testo non è necessariamente migliore. Potrebbe aver prescritto una soluzione prima di aver chiarito quale failure vogliamo gestire, quali errori siano retriable, quale duplicate behavior sia accettabile, quanto retry budget esista o quale failure mode rischiamo di amplificare.

La issue utile parte invece dalla differenza fra stato corrente e stato desiderato.

```text
current evidence
→ problem / risk
→ desired outcome
```

Il codice arriva dopo, come conseguenza della soluzione scelta dentro il boundary autorizzato.

> **La issue descrive il cambiamento che merita di esistere. Il codice è una delle possibili conseguenze.**

Questo lascia spazio all'executor senza delegargli la semantica che il team non ha ancora deciso.

## Perché l'ambiguità costa di più con gli agenti

Una persona che riceve un ticket incompleto può ricordare una conversazione precedente, riconoscere un requirement obsoleto, chiedere al collega accanto o fermarsi perché conosce il rischio storico.

Un agente può fare molto discovery autonomamente: cercare call site, leggere documenti, confrontare implementazioni, proporre domande. Ma la capacità di execution cambia la forma del rischio.

```text
ambiguous task
+ capable executor
→ plausible interpretation
→ large coherent patch
```

Il codice può essere eccellente e il task comunque sbagliato.

Abbiamo semplicemente accelerato una interpretazione che non avevamo autorizzato.

GitHub raccomanda per i coding agent task chiari e circoscritti, con descrizione del problema, acceptance criteria e contesto utile. OpenAI descrive analogamente l'uso di task strutturati come issue, con path, componenti e riferimenti quando migliorano il lavoro.[^github-agent-task][^openai-codex-issues]

Quando la issue diventa input diretto dell'executor, la qualità del work definition non è più soltanto project management. **Entra nel sistema di controllo dell'engineering.**

## Issue-driven non significa ticket-driven

La reazione sbagliata sarebbe compensare l'ambiguità con ticket enormi.

Una issue di venti pagine può diventare una mini-specifica burocratica, congelare un design troppo presto o prescrivere implementation detail prima che qualcuno abbia esplorato il codice. Se poi l'evidence cambia durante il lavoro e nessuno aggiorna il work item, abbiamo soltanto una specifica più lunga e altrettanto stale.

Issue-driven development non significa:

> scrivere tutto prima e poi eseguire senza pensare.

Significa:

> **rendere esplicito abbastanza intent da permettere molta autonomia locale e rendere esplicito il punto in cui quella autonomia deve fermarsi.**

La quantità di struttura deve crescere con semantic risk, blast radius, irreversibility e cross-team ownership. Un typo non merita lo stesso work item di una migration che cambia un authoritative data owner.

## La issue come delta rispetto al repository

Nel capitolo precedente abbiamo separato persistent context e task context.

Ora possiamo essere più precisi:

```text
repository context
= ciò che resta vero fra molti task

issue
= il delta autorizzato

current evidence
= ciò che sappiamo sullo stato presente
```

Una buona issue non copia Threat Model, Testing Strategy o Data Ownership Map. Li linka quando governano il task e aggiunge soltanto ciò che è specifico del lavoro corrente.

Per esempio, una issue di recovery potrebbe dire che il requirement è già `RR-007`, che l'outcome è produrre restore evidence in non-production, che RTO/RPO restano fuori scope e che l'esecuzione deve fermarsi se il restore richiede un'azione distruttiva fuori dall'environment isolato.

La issue resta corta perché il repository possiede già la parte stabile del sapere.

## Acceptance e verification devono nascere separate

Un work item è debole quando dice soltanto quale comando deve diventare verde.

`npm test must pass` descrive un meccanismo. Non dice quale proprietà vogliamo dimostrare.

Il modello del capitolo sarà:

```text
Acceptance
→ observable property

Verification
→ evidence-producing mechanism
```

Questa distinzione protegge sia dalla over-specification sia dal `green-by-editing-the-oracle`. Se il requirement dice che `PaymentEscalation` e `OutboxMessage` devono essere atomici, possiamo scegliere come costruire il test environment. Non possiamo cambiare la proprietà soltanto perché il test è difficile.

## Discovery ed execution non sono la stessa classe di lavoro

Non ogni issue dovrebbe produrre production code.

Se non sappiamo chi consuma un export legacy, l'outcome giusto può essere un consumer inventory con evidence e owner. Se il consumer è già confermato e il nuovo contract approvato, possiamo aprire una execution issue per migrarlo.

Questo evita un pattern molto costoso:

```text
unknown problem
→ implementation used as discovery
→ hidden dependency discovered late
→ patch expands
```

La discovery consegna conoscenza. L'execution usa conoscenza abbastanza matura per modificare il sistema.

Entrambe sono delivery; producono artifact diversi.

## La issue come unità di orchestrazione

Quando il work item è leggibile, può diventare un boundary condiviso fra persone, agenti, reviewer e pipeline.

```text
Issue
→ intent
→ scope
→ canonical context
→ acceptance
→ verification
→ stop conditions
→ closure evidence
```

Da questo contratto possono nascere plan, diff, test, review e follow-up senza che ogni passaggio ricostruisca il problema da zero.

La issue smette così di essere soltanto una riga del backlog. Diventa un **handoff boundary fra decisione ed execution**.

## Il problema ESI

Commerce & Operations vuole usare coding agent per aumentare throughput su Order Operations. Il backlog contiene attività molto diverse: documentazione, integration test, adapter, telemetry gap e piccoli refactoring, ma anche richieste che toccano Payments semantics, security e ownership.

Product, Security e Payments & Risk fanno quindi una distinzione necessaria: **non tutte le issue hanno lo stesso grado di decidibilità**.

Una richiesta come:

```text
verify PostgreSQL atomicity for PaymentEscalation + Outbox
```

può essere execution-ready perché business semantics, owner e transaction boundary sono già decisi; manca evidence ad alta fidelity.

Una richiesta come:

```text
automate refund when payment fails
```

non è execution-ready soltanto perché la frase è breve. Introduce nuova semantica economica, permission, audit e failure mode.

## Il compromesso del Capitolo 22

ESI accetta di investire più energia nella preparazione dei work item che hanno semantic risk elevato, senza imporre lo stesso ceremony a ogni fix.

Nel capstone introdurremo:

```text
work-items/TEMPLATE.md
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
```

OO-001 nasce da un gap già esistente nella Testing Strategy. Non inventiamo un esercizio artificiale per dimostrare il metodo.

Il task chiederà un PostgreSQL reale e riproducibile, ma non prescriverà Testcontainers o un particolare harness se non sono necessari per proteggere la proprietà. Existing migration, ownership e architecture fitness resteranno oracle e boundary da non riscrivere per ottenere verde.

Un piccolo `issue-readiness-fitness` controllerà inoltre alcune proprietà meccaniche del work-item layer. Come sempre, quel PASS non significherà che la issue è semanticamente perfetta o che OO-001 sia stata eseguita.

## La domanda del capitolo

Non è:

> Come scriviamo ticket più dettagliati?

È:

> **Come trasformiamo un'intenzione di lavoro in una unità abbastanza bounded da poter essere eseguita autonomamente, verificata senza cambiare il proprio oracle e chiusa senza gonfiare l'evidence?**

Questa domanda ci porterà direttamente al Capitolo 23, dove una singola issue potrà essere affidata a più ruoli agentici con mandate e verification separati.

> **Una buona issue non dice all'executor come pensare. Gli dà abbastanza contesto da sapere quali decisioni può prendere da solo e quali deve riportare a noi.**

---

[^github-agent-task]: GitHub Docs, *Best practices for using GitHub Copilot to work on tasks*, https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks
[^openai-codex-issues]: OpenAI, *How OpenAI uses Codex*, https://openai.com/business/guides-and-resources/how-openai-uses-codex/