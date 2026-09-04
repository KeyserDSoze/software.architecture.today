# 21.4 — Istruzioni persistenti senza context pollution

Aggiungere istruzioni al repository è facile. Mantenerle piccole, autorevoli e utili è molto più difficile.

Un file operativo nasce spesso con poche righe su build e test. Poi assorbe convenzioni di stile, architecture rule, business glossary, workaround di incidenti, deployment manual e note temporanee. Dopo qualche mese nessuno sa più quali parti siano ancora valide e nessuno osa rimuoverle perché “forse servono all'agente”.

Abbiamo così ricreato una wiki monolitica dentro il context window.

Il problema non è soltanto estetico. Più informazioni carichiamo sempre, più aumentano costo, rumore, conflitto e probabilità che una regola importante venga nascosta da altre venti irrilevanti.

> **Always-on context deve meritare di essere always-on.**

## Che cosa merita il livello globale

Una informazione globale ha senso quando si applica a molte classi di task, una sua violazione ha costo elevato, non è ovvia dal codice e resta abbastanza stabile da giustificare manutenzione continua.

Per Order Operations appartengono a questo livello il purpose del prodotto, il fatto che Payments & Risk possieda gli effetti economici, i golden command, il divieto di inventare una seconda authority per dati esterni, il routing verso la Repository Map e poche stop condition ad alto impatto.

Non appartengono normalmente al livello globale lo schema completo del database, ogni endpoint, l'intera Functional Analysis, la storia degli incidenti o tutti gli esempi di codice. Queste informazioni devono essere scopribili quando il task le tocca, non pagate da ogni task.

Il criterio non è “potrebbe essere utile?”. Quasi tutto potrebbe esserlo. La domanda è:

> **quanto spesso questa informazione cambia una decisione e quanto costa averla sempre nel contesto?**

## Scope: specifico non significa più autorevole

Le instruction moderne possono avere scope repository-wide o locale a path e sottoprogetti. GitHub documenta istruzioni globali e specifiche per percorso; `AGENTS.md` può essere annidato in directory diverse in vari workflow agentici.

Fonti:

- [GitHub Docs — Add custom instructions for Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions)
- [GitHub Docs — Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [AGENTS.md](https://agents.md/)

Questa capability permette di mantenere vicino alla capability ciò che la riguarda. Ma introduce una distinzione importante: **specificity e authority non sono la stessa cosa**.

Una issue molto specifica può dire come cambiare una feature. Non può rendere lecito violare tenant isolation soltanto perché è più vicina al task. Una instruction dentro `infra/` può aggiungere dettagli di deployment, ma non può annullare una security policy enterprise.

Possiamo pensare alla gerarchia in due dimensioni:

```text
more specific context
→ better local guidance

higher authority
→ stronger decision boundary
```

Confondere le due crea il rischio che il testo più vicino al file diventi accidentalmente più potente della governance che dovrebbe rispettare.

## Tool-neutral first

ESI non vuole riscrivere la propria architettura per ogni vendor di coding agent.

Il contesto stabile deve quindi vivere prima di tutto in artifact tool-neutral: documenti canonical, `AGENTS.md`, Repository Map e verification script. Un file specifico per un prodotto può esistere quando il tool richiede davvero una convenzione particolare, ma dovrebbe comportarsi come un adapter verso la stessa source of truth.

Questo evita una frammentazione del tipo:

```text
copilot instructions
CLAUDE.md
GEMINI.md
AGENTS.md
custom prompt
```

ognuno con una versione leggermente diversa delle stesse regole.

Il design non è “supportare meno tool”. È rendere il costo di cambiare tool indipendente dal costo di riscrivere il sapere del prodotto.

## Le negative instruction definiscono il blast radius

Dire che cosa fare non basta sempre. In un repository maturo esistono scorciatoie tecnicamente plausibili che sono state scartate intenzionalmente.

Per questo alcune negative instruction hanno alto valore. ESI può rendere esplicito che un task non deve introdurre write dirette nello stato Payments, riscrivere characterization test per farli coincidere con la target policy, aprire Internet ingress senza decisione o indebolire una fitness rule soltanto per ottenere verde.

Queste frasi non sono un catalogo di divieti arbitrari. Rendono visibili boundary che il codice da solo potrebbe far sembrare facili da attraversare.

La negative instruction migliore, però, collega il divieto alla route corretta:

```text
Do not weaken AF-005 to make the task pass.
If AF-005 no longer fits, reopen the architecture decision.
```

In questo modo il file operativo non fossilizza l'architettura. Distingue drift da evoluzione intenzionale.

## Stop condition: quando l'execution deve diventare decisione

Un instruction file realmente utile non dice soltanto come procedere. Dice anche quando **non** procedere.

Per Order Operations una stop condition scatta se il task richiede una nuova semantica economica, una nuova authoritative data ownership, public ingress, una migration irreversibile, un indebolimento della tenant isolation o un conflitto fra acceptance criteria e Functional Analysis confermata.

In questi casi non manca codice. Manca una decisione.

L'agente non dovrebbe scegliere silenziosamente quale fonte “vince” o trasformare un'incertezza di prodotto in una soluzione tecnica.

> **Una stop condition è il punto in cui il repository dichiara che execution e authority non coincidono più.**

Questa distinzione prepara i capitoli successivi sull'autonomia, ma nel Capitolo 21 ci serve già per rendere il contesto onesto.

## Context non significa credential

Un instruction file può spiegare come ottenere una credenziale tramite il flow approvato. Non deve contenerla.

Secret, password, private token, production credential e customer data reale non appartengono a `AGENTS.md`, README, prompt, fixture o example config versionati.

```text
context
≠
credential
```

Questa regola era già secure engineering. Con agenti che possono leggere porzioni più ampie del repository e usare tool esterni, il valore della data minimization cresce.

## Instruction debt è technical debt del context layer

Le istruzioni invecchiano.

Un path viene rinominato. Un workaround non serve più. Una decisione viene riaperta. Un comando cambia. Una regola che proteggeva un vecchio boundary resta nel file per inerzia.

Il risultato è **instruction drift**: il testo continua a sembrare autorevole mentre descrive un sistema che non esiste più.

Per questo il context layer deve avere la stessa disciplina del codice operativo: owner, review trigger, aggiornamento insieme al sistema e rimozione delle parti obsolete.

Il segnale più pericoloso non è la lunghezza in sé. È quando nessuno sa più dire quale sezione sia source of truth e quale sia soltanto una copia.

## Non duplicare in prose ciò che il repository sa già verificare

Se AF-005 impedisce gli Azure SDK nel core semantic layer, `AGENTS.md` non deve copiare tutta la regola con ogni eccezione. Può dire che l'architecture policy è eseguibile nel relativo fitness test e che non va indebolita per far passare il task.

Questo sposta la parte meccanica verso feedback deterministico e lascia alle istruzioni ciò che fanno meglio: routing, authority e stop condition.

Vale anche il contrario. Non dobbiamo inventare un linter per decidere se una nuova capability appartenga davvero a Order Operations o se un SLO valga ancora il proprio costo. Quelle sono decisioni semantiche e di trade-off; richiedono context e judgment.

La maturità non sta nell'automatizzare tutto. Sta nel distinguere **quale tipo di conoscenza stiamo governando**.

## La forma ESI

Il file operativo che vogliamo ha quindi una funzione molto precisa:

```text
entry point
→ route to canonical knowledge
→ expose golden verification
→ name critical boundaries
→ define stop conditions
```

Non prova a contenere il prodotto.

Il documento canonical spiega. Il test verifica. L'instruction indirizza e delimita l'autorità.

> **Un buon file di istruzioni non insegna all'agente tutto il repository. Gli insegna come attraversarlo senza confondere ciò che può eseguire con ciò che può decidere.**