# 21.3 — Setup deterministico e verification path

Un agente può comprendere perfettamente l'architettura e restare poco utile se non riesce a costruire il progetto. Può anche riuscire a costruirlo e diventare pericoloso se non sa quale verifica renda accettabile la modifica.

Per questo l'AI-readiness non finisce nella documentazione. Deve esistere un percorso corto, esplicito e ripetibile da:

```text
change
→ build
→ verification
→ evidence
```

Più questo percorso dipende da gesti manuali, credenziali personali e conoscenza orale, più la delegabilità apparente del repository supera quella reale.

## Il vero onboarding è eseguibile

Scrivere “installa le dipendenze e lancia i test” serve poco se, nella pratica, il contributor deve conoscere una versione implicita del runtime, generare un file a mano, impostare una variabile non documentata, avviare un servizio in un ordine particolare o applicare un workaround che vive soltanto nella memoria del team.

GitHub raccomanda di rendere espliciti bootstrap, build, test e validation nelle repository instructions. OpenAI, descrivendo l'ambiente in cui lavorano coding agent come Codex, sottolinea analogamente il valore di setup prevedibile e test affidabili.

Fonti:

- [GitHub Docs — Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/)

La lezione non è specifica del tool. Un repository diventa più self-service quando il percorso operativo smette di dipendere dal senior che “sa come farlo partire”.

## I golden command sono una piccola API del repository

Un progetto dovrebbe offrire pochi comandi canonici con un significato stabile.

Per Order Operations oggi sono:

```bash
npm run typecheck
npm test
```

Il dettaglio della sintassi conta meno del contratto. Se `npm test` è il golden command, persone, agenti e CI devono poter capire che cosa esegue, che cosa dimostra e che cosa **non** dimostra.

Possiamo pensare a questi comandi come a una API interna:

```text
typecheck()
test()
```

Una API può evolvere. Ma non dovrebbe cambiare in modo accidentale né avere un significato diverso per ogni contributor.

Un alias chiamato `test` che salta silenziosamente metà della suite o richiede un setup non dichiarato non è un golden command. È un'interfaccia ambigua.

## Una verifica non vale per ogni claim

Il Capitolo 16 ha già separato i livelli di evidence. Il repository deve rendere questa distinzione operativa.

Il gate locale può dimostrare TypeScript correctness, behavior deterministico, characterization e architecture fitness. Non può dimostrare automaticamente PostgreSQL reale, Azure identity, private networking, recovery o comportamento production.

Quindi il problema non è eseguire “tutti i test sempre”. È scegliere il verification tier coerente con la claim.

Una forma utile è:

| Claim | Evidence minima plausibile | Cosa non possiamo inferire |
|---|---|---|
| business rule locale | typecheck + deterministic tests | comportamento di un provider esterno |
| architecture boundary | architecture fitness | runtime security |
| PostgreSQL semantics | integration su PostgreSQL reale | Azure deployment |
| cloud identity/network | environment Azure appropriato | production readiness complessiva |
| recovery target | recovery drill | SLO production continuativo |

Il task dovrebbe dichiarare il tier necessario invece di lasciare all'agente la scelta casuale fra test economici e test realmente probanti.

## Definition of Done: proprietà prima dei comandi

Una Definition of Done utile non è “make sure everything works”. Deve dire che cosa deve risultare vero e quale evidence deve sostenerlo.

Per un normale change applicativo ESI può richiedere:

```text
scoped behavior implemented
canonical docs synchronized when semantics changed
typecheck PASS
relevant tests PASS
architecture fitness PASS
verification gaps reported
```

Per un change che tocca persistence il livello aumenta e può richiedere una vera integration suite. Se quella suite non esiste ancora, il risultato non va promosso artificialmente da `Codified` a `Verified`.

Il comando è il meccanismo. La Definition of Done resta il contratto sul risultato.

## Code failure e environment failure devono essere distinguibili

Un workflow automatico può reagire male a un failure ambiguo.

Un'asserzione che fallisce suggerisce un problema di behavior. Un registry irraggiungibile indica probabilmente un problema di environment. Una credential mancante è un problema di setup o permission. Un PostgreSQL non disponibile non dovrebbe spingere l'agente a cambiare una query corretta soltanto per far passare il task.

Questa distinzione deve emergere da messaggi, script e documentazione. Altrimenti l'agente può iniziare a **riparare il codice per compensare un'infrastruttura rotta**.

Un buon verification path non produce soltanto verde o rosso. Produce un failure abbastanza leggibile da guidare la prossima decisione.

## Proteggere l'oracle

Quando lo stesso esecutore può modificare implementazione, test, fixture ed expected output, una failure introduce una tentazione strutturale: rendere più facile il criterio invece di correggere il comportamento.

Questo rischio non riguarda soltanto gli agenti. L'automazione lo amplifica perché rende molto economico cambiare contemporaneamente entrambe le parti.

Per questo il task deve distinguere gli artifact che possono cambiare dagli **oracle protetti**.

Nel caso della priority policy, per esempio, la characterization legacy non va riscritta per assomigliare al target e una architecture fitness rule non va indebolita soltanto perché il nuovo diff la viola. Se la semantica confermata o la policy devono cambiare, serve una decisione esplicita che preceda il cambiamento dell'oracle.

> **Se l'esecutore può modificare liberamente sia il comportamento sia il criterio che lo giudica, un build verde perde molto del proprio valore.**

## Reproducibility riduce il costo della verifica

Lockfile, runtime version esplicita, script idempotenti, fixture versionate e test deterministici non sono ornamenti per agenti. Riducono le variabili che separano una failure reale da una failure accidentale.

Questo non implica adottare Docker o devcontainer in ogni repository. Un piccolo progetto TypeScript con dipendenze bloccate e due comandi affidabili può essere più agent-ready di un environment containerizzato enorme che richiede dieci minuti di bootstrap e nasconde molti servizi impliciti.

Vale ancora la nostra stella polare:

> **fit before fashion.**

La riproducibilità è la proprietà. Il tool è il meccanismo.

## Il failure output è anche context engineering

Un test architetturale che restituisce soltanto `FAIL` spreca una parte del proprio valore.

Un output come:

```text
AF-005 Vendor SDK boundary violated
src/application/foo.ts -> @azure/service-bus
Move infrastructure behavior behind src/integration
or reopen the architectural decision.
```

fa tre lavori insieme: verifica, documenta il boundary e suggerisce quale tipo di decisione è necessario se il boundary non ha più fit.

L'agente non riceve un elenco di regole da ricordare. Riceve feedback eseguibile quando attraversa quella rilevante.

## Verification Bundle senza rifare il lavoro

Torna qui una delle tesi del libro: il supervisore umano non può ripetere manualmente tutta l'execution dell'agente.

Deve poter ricevere evidence compatta:

```text
files changed
commands executed
results
architecture checks
known gaps
unexpected warnings
```

Nel Capitolo 23 formalizzeremo questo concetto. Qui ci basta renderlo possibile: i golden command devono produrre risultati leggibili e il task deve distinguere chiaramente ciò che è stato eseguito da ciò che resta Pending.

## La baseline ESI

Nel Capitolo 21 Order Operations possiede già in `package.json`:

```text
npm run typecheck
npm test
```

Il secondo costruisce il progetto, esegue la suite del prodotto e include anche la characterization legacy configurata nel package script.

Questa è evidence locale reale.

Non dichiariamo invece:

```text
PostgreSQL Verified
Azure Verified
Recovery Verified
Production Monitored
```

perché il repository non possiede ancora quei gate eseguiti.

Questa precisione è parte dell'AI-readiness: un agente deve sapere non soltanto come ottenere un verde, ma **quale claim quel verde autorizza davvero**.

> **Un repository è più delegabile quando il percorso da modifica a evidence è corto, deterministico e difficile da reinterpretare.**