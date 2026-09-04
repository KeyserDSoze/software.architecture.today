# 19.9 — Esercizi, autovalutazione e sintesi

Architecture Evolution non significa costruire un sistema capace di cambiare in qualunque direzione.

Significa rendere esplicito:

```text
che cosa vogliamo proteggere
→ come riceviamo evidence
→ come riconosciamo il drift
→ quando ammettiamo un'eccezione
→ quando riapriamo la decisione stessa
```

Il capitolo ha quindi trasformato la governance da controllo esterno a **feedback loop sul cambiamento**.

Le fitness function proteggono proprietà già comprese. Gli ADR spiegano perché quelle proprietà hanno fit e quando riesaminarle. Le exception rendono visibili deviazioni temporanee. Runtime evidence e assessment periodici ci dicono quando il problema non è più l'implementazione, ma il contesto che ha reso obsoleta una vecchia scelta.

> **L'obiettivo non è avere sempre verde. È sapere che cosa significa quel verde, che cosa significa un rosso e quando è la regola stessa a meritare una nuova decisione.**

## Artefatto operativo — Architecture Fitness Checklist

La checklist collega:

```text
Property
Risk
Mechanism
Evidence
Failure action
Owner
Status
Review trigger
```

Non è una collezione di best practice enterprise.

È il portfolio vivo delle proprietà che il workload ha deciso di proteggere.

Per Order Operations parte da AF-001…AF-005 e dalle altre property già emerse nei capitoli precedenti. Il file vivo continuerà a crescere più avanti; nel Capitolo 19 conserviamo soltanto la baseline raggiunta qui.

## Esercizio 1 — Drift o contesto cambiato?

Prendi tre anomalie architetturali di una codebase reale e classificane ciascuna:

```text
Implementation drift
Context drift
Unknown
```

Per ogni `Unknown`, indica quale evidence ti permetterebbe di scegliere.

Poi scrivi l'azione corretta:

```text
fix implementation
temporary exception
reopen architectural decision
```

## Esercizio 2 — Da principio a proprietà verificabile

Parti da quattro frasi:

```text
The system should be maintainable.
The system should be secure.
The API should be stable.
The platform should be cost effective.
```

Per ognuna identifica almeno due proprietà concrete e un possibile evidence mechanism.

Non cercare una metrica universale: separa ciò che può essere un gate da ciò che richiede trend, runtime evidence o review.

## Esercizio 3 — Fitness o technology lock?

Valuta:

```text
All services must use Kubernetes.
```

Rispondi:

1. quale property potrebbe cercare di proteggere?
2. puoi riscriverla senza nominare Kubernetes?
3. in quale contesto Kubernetes potrebbe comunque risultare il fit migliore?
4. quale review trigger renderebbe legittimo cambiare tecnologia?

L'obiettivo è evitare che una fitness function congeli un prodotto invece di proteggere una caratteristica.

## Esercizio 4 — ADR con scadenza di contesto

Prendi un ADR reale e aggiungi:

```text
Assumptions
Review triggers
Evidence to collect
Conditions that invalidate fit
```

Poi immagina due cambiamenti:

```text
implementation violates ADR
business context invalidates ADR
```

Spiega perché richiedono azioni diverse.

## Esercizio 5 — Technical debt come portfolio di rischio

Prendi cinque debt item e riscrivili con:

```text
Constraint created
Failure / change risk
Carrying cost
Owner
Repayment trigger
```

Ordinali per rischio futuro, non per quanto il codice ti sembra brutto.

Identifica infine almeno un possibile `unknown debt` che nessun backlog sta ancora rappresentando.

## Esercizio 6 — Exception con expiry

Devi violare temporaneamente AF-005 e usare un SDK cloud in un layer vietato.

Scrivi:

```text
reason
alternatives considered
risk accepted
owner
evidence
expiry / review date
removal condition
```

Poi confronta il carrying cost dell'exception con il costo della soluzione strutturalmente corretta.

## Esercizio 7 — Context engineering per un agente

Dai a un agente una feature request senza architecture context e osserva la soluzione.

Poi ripeti includendo:

- ADR rilevanti;
- fitness function;
- forbidden boundary;
- owner/data constraints;
- acceptance evidence.

Confronta:

```text
functional correctness
architectural drift
number of repair iterations
quality of explanation
```

Lo scopo non è dimostrare che l'AI fallisce.

È verificare quanto la qualità del sistema di feedback modifica il risultato globale.

## Esercizio 8 — Portfolio review

Per ogni fitness function chiedi:

```text
What risk does it protect?
Has it caught useful drift?
Is it noisy?
Can it be bypassed anonymously?
Is the underlying decision still valid?
Should it remain automatic?
Can it be removed?
```

Elimina almeno una regola che non giustifica più il proprio costo.

La governance deve poter perdere complessità, non soltanto accumularla.

## Esercizio 9 — ESI: nuovo public ingress

Nuovo requirement simulato:

> Un cliente enterprise richiede accesso partner via Internet alla operational view.

Non implementare.

Elenca quali decisioni devono essere riaperte.

Una risposta forte include almeno:

```text
Functional Analysis
API Contract
NFR
Threat Model
Security Control Matrix
Cloud Deployment Map
Observability Contract
Testing Strategy
relevant ADR
cost impact
```

La differenza da capire è fra:

```text
aggiungere un endpoint
```

e:

```text
cambiare il contesto architetturale del workload
```

## Esercizio 10 — Governance proporzionale

Classifica questi change come:

```text
Automatic gate
Warning / trend
Team review
Enterprise review
Remove / no governance needed
```

Change:

- forbidden module dependency;
- cloud cost +5%;
- new region deployment;
- new npm package;
- public ingress;
- CSS change;
- new derived data copy;
- internal rename;
- RTO miss during recovery drill.

Non esiste una risposta universale.

Per ciascuna scelta indica il blast radius che giustifica il livello di governance.

## Autovalutazione

Dovresti riuscire a spiegare senza consultare il capitolo la differenza fra architecture evolution e drift; implementation drift e context drift; che cosa sia una fitness function; perché una fitness non debba proteggere necessariamente una tecnologia; quando un architecture test sia il meccanismo giusto; quando serva runtime evidence; perché un ADR abbia bisogno di review trigger; come si governa un'architecture exception; perché una waiver senza expiry sia pericolosa; come trattare technical debt come portfolio; perché la governance debba essere proporzionale al blast radius; come l'AI possa amplificare pattern di drift già presenti; perché un agente non debba approvare il proprio bypass; e come fitness, ADR ed evidence si colleghino nello stesso feedback loop.

Se una risposta resta vaga, riducila a:

```text
intent
→ property
→ evidence
→ action when evidence changes
```

## Cosa cambia con l'AI

Con agenti capaci di modificare rapidamente il repository, scala peggio affidare l'architectural consistency soltanto alla memoria e alla lettura manuale del diff.

Aumenta quindi il valore di:

```text
machine-readable intent
executable boundaries
automated feedback
explicit exceptions
human approval for semantic / one-way changes
```

Questo non riduce il ruolo dell'architect.

Lo sposta dal controllo riga per riga verso la progettazione e manutenzione del sistema di decisioni e feedback.

La domanda diventa:

> **Quale parte del nostro judgment è già abbastanza compresa da essere trasformata in un guardrail, e quale deve restare una decisione umana perché il contesto può ancora cambiarne il significato?**

## Stato ESI dopo il Capitolo 19

Order Operations possiede ora:

```text
AF-001…AF-005 executable architecture rules
Architecture Fitness Checklist
architecture exception direction
ADR review-trigger model
technical-debt risk framing
```

Le regole locali possono essere `Codified + locally Verified` quando il test architetturale passa.

Questo non promuove automaticamente security, cloud, recovery o runtime property a `Verified`: ognuna mantiene il proprio evidence boundary.

## Ponte al Capitolo 20 — Il costo come proprietà architetturale

Il feedback loop architetturale ora sa proteggere dependency, ownership, security, reliability e migration discipline.

Ma ogni proprietà che compriamo ha anche un costo.

Zone redundancy, premium broker tier, observability retention, headroom, recovery environment e managed capability non esistono gratuitamente.

Il Capitolo 20 porterà quindi il costo dentro lo stesso modello:

```text
architecture decision
→ cost driver
→ unit economics
→ quality value
→ review trigger
```

Non chiederemo soltanto:

> Quanto costa Azure?

Chiederemo:

> **Quale proprietà stiamo comprando con questo costo, quale outcome la giustifica e quale decisione riapriremmo se la curva cambiasse?**

## Corollario

> **Un'architettura evolutiva non protegge ogni decisione per sempre. Protegge le proprietà che hanno ancora fit, rende visibile quando l'implementazione devia e conserva abbastanza contesto da sapere quando una vecchia decisione merita di essere presa di nuovo.**