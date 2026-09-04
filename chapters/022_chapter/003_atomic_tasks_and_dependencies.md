# 22.3 — Atomic task, dependency e parallelizzazione

Una issue può essere perfettamente chiara e restare comunque troppo grande per essere una buona unità di execution.

Il problema non è il numero di righe che richiederà il diff. È il numero di **claim indipendenti** che stiamo cercando di dimostrare nello stesso momento.

Per questo, in questo libro, *atomic task* non significa “task minuscolo”. Significa:

> **un outcome coerente, un boundary leggibile e una evidence abbastanza autonoma da poter dire che quella parte del lavoro è davvero conclusa.**

Una modifica da cinquecento righe può essere atomica se sostiene una sola proprietà ben definita. Una modifica da cinquanta righe può non esserlo se mescola persistence, security policy, deployment e una nuova semantica di prodotto.

## Spezzare per ciò che dobbiamo imparare

Prendiamo il gap che stiamo usando in Order Operations.

La proprietà finale che ci interessa è l'atomicità reale fra `PaymentEscalation` e `OutboxMessage` su PostgreSQL. Ma per arrivarci possono servire passi diversi:

```text
PostgreSQL harness riproducibile
        ↓
migration chain eseguibile
        ↓
atomic success / rollback evidence
        ↓
CI gate, se utile e sostenibile
```

Questa sequenza ci dà un criterio di decomposizione molto più utile del semplice “dividiamo il lavoro in tre ticket”.

Ogni passo produce evidence che rende decidibile il successivo.

Se il test harness non riesce nemmeno ad applicare le migration reali, non ha senso costruire sopra di lui una suite di atomicity e dichiararla pronta per CI. Se la transaction property è dimostrata localmente ma il runner CI non può eseguire il meccanismo scelto, abbiamo scoperto un problema differente: portability dell'environment, non semantica della transaction.

> **Una buona decomposizione riduce l'incertezza a strati. Non distribuisce soltanto file fra executor diversi.**

## Quando una issue sta nascondendo più lavori

Ci sono alcuni segnali ricorrenti.

Se una parte della issue può essere accettata mentre un'altra resta completamente aperta, probabilmente abbiamo più outcome. Se servono owner differenti per decidere parti diverse del task, il work item attraversa più authority boundary. Se alcune acceptance property possono essere provate con unit test mentre altre richiedono environment cloud, stiamo probabilmente mescolando evidence layer differenti.

Lo stesso vale quando la issue contiene insieme discovery sostanziale e implementation. “Trova i consumer del legacy export e migra tutto sul nuovo contract” sembra una sola frase, ma contiene prima un problema di conoscenza e poi un problema di cambiamento. L'output della prima parte può cambiare completamente la seconda.

Un altro segnale forte è la presenza di più one-way door. Un task che modifica schema irreversibile, contract esterno e production routing contemporaneamente non è più semplicemente grande: concentra troppi punti di non ritorno nello stesso rollback boundary.

La domanda da fare non è quindi “possiamo dividerlo?”. Quasi sempre possiamo. È:

> **quale pezzo può produrre evidence utile senza dover fingere che gli altri siano già risolti?**

## Dependency: rendere visibile ciò che blocca il pensiero

Quando il lavoro passa fra più persone o agenti, le dependency implicite diventano costose.

Git merge ci mostra dependency testuali. Non ci mostra necessariamente quelle semantiche.

Due issue possono toccare file completamente diversi e dipendere dalla stessa decisione non presa. Un endpoint `Refund` e un event `RefundRequested` potrebbero essere implementati in repository separati e mergiare senza conflitti. Se però nessuno ha ancora deciso eligibility, partial refund, duplicate handling, authorization e audit, i due executor stanno costruendo due interpretazioni della stessa ambiguità.

In casi simili la vera dependency è:

```text
product / domain decision
        ↓
contract decision
        ↓
parallel execution possibile
```

Non:

```text
backend branch
+
event branch
→ merge
```

Per questo relazioni come `blocked by`, `blocks`, `requires decision from` o `requires evidence from` non sono metadata amministrativi. Rendono visibile **che cosa deve diventare vero prima che il lavoro successivo sia sensato**.

GitHub supporta issue, sub-issue e workflow di planning che possono rappresentare queste relazioni, e i coding agent possono essere assegnati direttamente a issue.[^github-agents] Il metodo, però, non dipende dal tool.

> **Prima sincronizziamo la decisione. Poi parallelizziamo l'execution.**

## Parallelizzare senza creare architetture concorrenti

Un sistema con molti agenti invita a iniziare tutto ciò che sembra indipendente.

Ma file diversi non equivalgono a boundary indipendenti.

Possiamo parallelizzare bene quando intent condiviso, ownership e constraint sono già stabili e quando ogni task può produrre evidence locale senza reinterpretare gli altri. Un audit della documentazione, la costruzione di un PostgreSQL harness e l'esplorazione di una telemetry gap possono procedere insieme se non dipendono dalla stessa decisione aperta.

Il rischio più interessante è che due branch non abbiano alcun merge conflict e producano comunque due architetture incompatibili. Un executor può introdurre direttamente un Azure SDK in `application/`, mentre un altro costruisce nello stesso periodo un port vendor-neutral coerente con AF-005. Git può accettare entrambi. La fitness function deve rifiutare la contraddizione.

Questo ci ricorda che la parallelizzazione sicura richiede più del source control:

```text
shared intent
+ independent-enough boundaries
+ local verification
+ common architecture policy
+ known integration point
```

## Work in progress: execution abbondante non rende gratuita l'integrazione

Con gli agenti il costo di iniziare un task diminuisce molto più rapidamente del costo di integrarlo, verificarlo e chiuderlo.

Aprire venti branch può richiedere pochi minuti. Capire quali dieci sono ancora coerenti con lo stato corrente del repository, quali tre hanno reinterpretato la stessa requirement e quali cinque attendono una decisione può diventare il vero collo di bottiglia.

Per questo il work in progress resta un limite architetturale e organizzativo. Più task attivi significano più context divergence, più review simultanee, più integration risk e più verification cost.

La domanda non è quanti agenti possiamo mettere al lavoro. È quante unità di cambiamento possiamo **portare fino a evidence e closure senza perdere il controllo del sistema**.

> **L'atomicità del task non serve a rendere il lavoro piccolo. Serve a rendere il progresso conoscibile.**

---

[^github-agents]: GitHub Docs, *Get started with Copilot agents on GitHub*, https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/overview
