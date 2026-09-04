# Setup deterministico e verification path

Un agente che conosce perfettamente l'architettura ma non riesce a costruire il progetto è poco utile.

Un agente che riesce a costruirlo ma non sa quali test dimostrano il risultato è pericoloso.

Per questo un repository AI-ready deve avere un **verification path corto, esplicito e ripetibile**.

## Il vero onboarding è eseguibile

La documentazione può dire:

```text
install dependencies
run tests
```

Ma se per farlo servono:

- una versione specifica del runtime;
- un file generato manualmente;
- una variabile d'ambiente non documentata;
- un servizio locale;
- un ordine preciso fra script;
- una credenziale personale;
- un workaround noto soltanto al team;

il repository non è realmente self-service.

GitHub, nella propria guidance per le custom instructions, raccomanda di documentare bootstrap, build, test e validazione e di verificare che i comandi dichiarati funzionino. OpenAI sottolinea a sua volta che agenti come Codex lavorano meglio con ambienti configurati e test affidabili.

Fonti:

- [GitHub Docs — Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/)

Il punto non è ottimizzare un prodotto specifico.

È eliminare tribal knowledge dal percorso di execution.

## Golden commands

Un progetto dovrebbe avere pochi comandi canonici.

Per esempio:

```text
npm ci
npm run typecheck
npm test
npm run lint
```

oppure:

```text
make bootstrap
make verify
```

La sintassi conta poco.

Conta che:

1. i comandi siano stabili;
2. il repository sappia quali sono;
3. persone e CI usino gli stessi meccanismi quando possibile;
4. il successo abbia un significato definito.

Un `npm test` che salta silenziosamente metà della suite non è un golden command.

È un alias ambiguo.

## Verification tiers

Non tutti i task devono eseguire tutto.

Nel Capitolo 16 abbiamo già separato i layer di evidence.

Un repository agent-ready deve rendere questa separazione utilizzabile.

Esempio:

```text
Fast local
- typecheck
- unit/component
- architecture fitness
- cost metadata fitness

Boundary verification
- PostgreSQL integration
- API integration
- contract tests

Cloud verification
- Bicep build/lint
- Azure Policy
- connectivity/RBAC

Readiness
- performance
- recovery
- security drill
```

L'agente non deve scegliere casualmente quali test eseguire.

Il task e le istruzioni devono indicare il livello minimo necessario.

## Definition of done eseguibile

Un task ben definito dovrebbe avere qualcosa di simile:

```text
Definition of done:
- functional behavior implemented
- relevant docs updated
- typecheck PASS
- local tests PASS
- architecture fitness PASS
- no unexpected contract change
```

Per una modifica più rischiosa:

```text
Definition of done:
- all above
- PostgreSQL integration PASS
- migration tested forward/backward as applicable
- security review complete
```

Questo è molto diverso da:

```text
Make sure everything works.
```

## Fallimento del test vs fallimento dell'ambiente

Un agente deve poter distinguere:

```text
code failure
```

da:

```text
environment failure
```

Esempi:

```text
assertion failed
→ probabilmente code/behavior issue

package registry unreachable
→ environment/network issue

secret missing
→ setup/permission issue

PostgreSQL unavailable
→ dependency/environment issue
```

Se questa distinzione non è leggibile, l'agente può iniziare a modificare codice corretto per compensare un ambiente rotto.

Questo è un failure mode reale dei workflow automatici.

## Non “fixare” il test per farlo diventare verde

Un altro rischio aumenta quando l'agente controlla contemporaneamente:

- implementazione;
- test;
- istruzioni;
- expected output.

Se il test fallisce, può essere tentato di cambiare il test.

Per questo il repository dovrebbe esplicitare quali artifact sono **oracle** e quali sono parte del diff consentito.

Esempio:

```text
Allowed:
- src/priority/*
- tests/priority-policy.test.mjs only when acceptance criteria change

Do not change without explicit approval:
- characterization tests
- confirmed requirement semantics
- architecture fitness rules
```

La stessa idea vale per snapshot, fixture e golden file.

> **Un agente che può modificare contemporaneamente il comportamento e il criterio che lo giudica ha bisogno di un gate più forte.**

## Reproducibility

La reproducibility riduce il costo della verifica.

Aiuta:

- lockfile;
- runtime version esplicita;
- container/devcontainer quando giustificato;
- script idempotenti;
- fixture versionate;
- test deterministici;
- dipendenze esterne isolate o dichiarate.

Non significa che ogni repository debba avere Docker.

Ancora una volta:

> **fit before fashion.**

Un piccolo package TypeScript che usa soltanto `node:test` può essere più agent-ready di un ambiente containerizzato enorme se il primo si prepara e verifica con due comandi affidabili.

## Output leggibile

I comandi dovrebbero fallire in modo utile.

Un architecture test che restituisce:

```text
FAIL
```

è meno utile di:

```text
AF-005 Vendor SDK boundary violated
src/application/foo.ts -> @azure/service-bus
Move Azure-specific behavior behind src/integration or reopen the ADR.
```

Questo tipo di output è contemporaneamente:

- verification;
- documentation;
- context engineering.

L'agente non riceve solo un no.

Riceve un'indicazione del confine violato.

## Verification without re-execution

Torna qui una delle tesi iniziali del libro.

Il supervisore umano non può rifare ogni modifica generata.

Deve poter leggere evidence compatta:

```text
Files changed
Tests executed
Tests passed
Architecture rules checked
Known verification gaps
Unexpected warnings
```

Il repository deve rendere economico produrre questo bundle.

Nel Capitolo 23 lo formalizzeremo ulteriormente con gli agenti.

Qui ci basta una regola:

> **Se la verifica richiede conoscenza orale o gesti manuali non documentati, la delegabilità del task è più bassa di quanto sembri.**

## Verification commands come API del repository

Possiamo pensare ai comandi canonici come una piccola API offerta dal repository ai suoi contributor.

```text
bootstrap()
build()
test()
verifyArchitecture()
```

Una API interna può cambiare.

Ma deve farlo intenzionalmente.

Se ogni contributor inventa una combinazione diversa di comandi, perdiamo comparabilità dell'evidence.

Per questo un repository AI-ready dovrebbe dichiarare:

- command;
- scope;
- expected evidence;
- known gaps;
- escalation path in caso di failure infrastrutturale.

## La regola ESI

Per Order Operations adotteremo una sequenza corta:

```text
npm install / npm ci when lockfile exists
npm run typecheck
npm test
```

I task più sensibili aggiungeranno gate specifici quando saranno realmente disponibili.

Non dichiareremo:

```text
Azure verified
```

finché non esiste un comando/deployment path che produce quell'evidence.

> **Un repository è più agent-ready quando il percorso da modifica a evidence è corto, deterministico e difficile da reinterpretare.**