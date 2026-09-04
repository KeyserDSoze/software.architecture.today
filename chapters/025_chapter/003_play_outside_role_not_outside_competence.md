# Giocare fuori ruolo senza fingere competenza

Una delle conseguenze più interessanti dell'AI è che il confine fra ruoli diventa più permeabile.

Un backend engineer può produrre una prima bozza di UI.

Un architect può esplorare una query SQL complessa.

Un product engineer può costruire un prototipo infrastrutturale.

Un security specialist può generare test applicativi.

Un developer può leggere un'analisi funzionale, proporre acceptance criteria e preparare un ADR.

Questo è uno dei motivi per cui il One-Man Project diventa possibile.

Ma dobbiamo distinguere:

```text
role elasticity
≠
competence illusion
```

## Giocare fuori ruolo

Nel modello del libro, **giocare fuori ruolo** significa poter attraversare temporaneamente un boundary professionale abbastanza da:

- formulare una prima ipotesi;
- costruire una prima versione;
- parlare il linguaggio dello specialista;
- riconoscere i punti di rischio;
- produrre evidence utile;
- sapere quando serve escalation.

Non significa diventare automaticamente esperti di tutto.

> **L'AI può ridurre il costo di entrare in un territorio. Non riduce automaticamente il costo di essere responsabili delle conseguenze in quel territorio.**

## Il rischio della competenza sintetica

Un agente può generare una configurazione Kubernetes corretta sintatticamente.

Questo non rende il lead un Kubernetes platform engineer.

Può scrivere un threat model plausibile.

Questo non rende inutile Security.

Può costruire una formula fiscale.

Questo non autorizza Engineering a sostituire Legal o Finance.

Può suggerire un workflow payment.

Questo non trasferisce la semantica economica da Payments & Risk a Commerce & Operations.

Il problema è che la qualità superficiale dell'output può farci sembrare più competenti di quanto siamo davvero.

Questa è una forma di **competence laundering**:

```text
specialist output style
+
credible terminology
+
AI confidence
→ perceived expertise
```

Il One-Man Project deve difendersi da questa illusione.

## Breadth prima di delegation

Una persona che governa agenti deve avere una competenza a T.

Non deve essere lo specialista migliore in ogni area.

Deve però possedere abbastanza breadth da riconoscere almeno:

```text
this is a normal implementation choice
this changes a contract
this changes security posture
this changes data ownership
this changes money semantics
this creates a one-way door
this requires a specialist
```

In altre parole:

> **Il manager di agenti non deve sapere fare tutto. Deve sapere quando il sistema sta chiedendo una decisione che non può prendere da solo.**

## Functional literacy

Qui ritorna una posizione importante del Capitolo 2.

Un One-Man Project non può funzionare se il lead conosce soltanto la tecnologia.

Deve essere in grado di leggere e produrre almeno una prima analisi funzionale:

- attori;
- journey;
- stati;
- transizioni;
- regole;
- eccezioni;
- authorization semantics;
- acceptance criteria;
- open question.

Perché gli agenti amplificano immediatamente qualunque ambiguità funzionale.

Se il lead non comprende il prodotto, non sta governando agenti.

Sta distribuendo supposizioni.

> **Più puoi delegare l'implementazione, meno puoi permetterti di ignorare la funzione.**

## Architecture literacy

Lo stesso vale per l'architettura.

Il lead deve riuscire almeno a riconoscere:

- boundary;
- coupling;
- ownership;
- consistency;
- failure domain;
- reversibilità;
- quality attribute;
- cost premium;
- blast radius.

Non perché debba produrre personalmente tutti gli artefatti.

Ma perché deve poter valutare se una proposta dell'agente cambia il sistema oltre lo scope autorizzato.

## Security literacy

Un One-Man Project senza security literacy è particolarmente pericoloso.

La persona deve almeno riconoscere:

```text
authentication != authorization
credential != permission
private network != trusted system
input != instruction
AI tool availability != authorization
```

E sapere quando fermarsi.

La ricerca Microsoft pubblicata nel 2025 su 860 developer ha trovato che l'apertura all'uso dell'AI varia significativamente per tipo di task e che reliability/security diventano priorità particolarmente importanti nei task che toccano sistemi reali; mentoring e attività più centrate sulle relazioni umane mostrano limiti diversi all'automazione.

Fonte:

- [Microsoft Research — AI Where It Matters](https://www.microsoft.com/en-us/research/publication/ai-where-it-matters-where-why-and-how-developers-want-ai-support-in-daily-work/)

La lezione non è creare una matrice universale di “AI sì / AI no”.

È:

> **la quantità di AI appropriata dipende dal tipo di rischio e di conoscenza coinvolti nel task.**

## Specialist gate

Per questo introduciamo il concetto di **specialist gate**.

Il lead può fare discovery e preparare una proposta, ma alcuni trigger richiedono la review di una funzione specifica.

Esempi ESI:

### Product / Domain

Trigger:

```text
new business semantics
customer-visible behavior
priority/remediation rule
new actor or workflow
```

### Payments & Risk

Trigger:

```text
economic side effect
refund
payment retry semantics
ledger/payment truth
financial idempotency
```

### Security

Trigger:

```text
new trust boundary
public ingress
new sensitive data
new AI tool permission
weaker isolation
```

### Platform

Trigger:

```text
new shared platform capability
new region/topology
cluster/runtime ownership
enterprise identity/network policy
```

### Legal / Compliance

Trigger:

```text
new regulated data
retention/legal hold
customer communication constraint
new jurisdictional obligation
```

Il lead mantiene ownership dell'integrazione del lavoro.

Lo specialista mantiene authority sulla decisione che appartiene alla sua area.

## Non trasformare i gate in burocrazia

Il contrario sarebbe sbagliare nella direzione opposta.

Se ogni modifica deve attraversare tutti gli specialisti, il One-Man Project perde qualunque leverage.

Per questo i gate devono essere **trigger-based**.

```text
no trigger
→ lead proceeds within documented boundary

trigger crossed
→ specialist review required
```

Le fitness function e il repository context aiutano proprio a rendere questi trigger visibili.

## Un nuovo test mentale

Prima di accettare un task fuori dal proprio ruolo, chiedere:

1. posso riconoscere i principali failure mode?
2. conosco la source of truth della decisione?
3. so quale evidence dimostra che il risultato è buono?
4. so quando devo fermarmi?
5. qualcuno con authority specialistica deve approvare una parte della scelta?

Se la risposta alle ultime quattro domande è confusa, l'AI non ha eliminato il bisogno di competenza.

Lo ha soltanto reso più facile da nascondere.

> **Gioca fuori ruolo. Non giocare fuori responsabilità.**
