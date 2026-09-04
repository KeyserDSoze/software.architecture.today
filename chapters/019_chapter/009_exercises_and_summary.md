# 19.9 — Esercizi e sintesi

Architecture Evolution non significa progettare un sistema capace di cambiare in qualunque direzione.

Significa sapere **quali proprietà vogliamo proteggere mentre il sistema cambia**, quali decisioni devono poter essere riaperte e quale evidence ci dice che stiamo ancora andando nella direzione scelta.

## Idee chiave

1. L'architecture drift può avvenire una piccola decisione alla volta.
2. Implementation drift e context drift sono problemi diversi.
3. Una decisione può essere ancora ben implementata ma aver perso fit.
4. Gli ADR hanno più valore quando dichiarano review trigger.
5. Le fitness function trasformano alcune proprietà architetturali in feedback ripetibile.
6. Non tutte le fitness function sono test statici: possono usare runtime metric, policy, cost data o drill.
7. Una fitness function deve proteggere una proprietà, non fossilizzare una tecnologia.
8. Le eccezioni devono essere visibili, possedute e temporanee.
9. Technical debt è più utile se espresso come rischio, carrying cost e trigger.
10. La governance deve essere proporzionale al blast radius.
11. L'AI aumenta il valore di constraint ed evidence eseguibili.
12. Un guardrail deve bloccare il drift, non impedire l'evoluzione intenzionale.

## Esercizio 1 — Trova il drift

Prendi una codebase reale o un progetto personale.

Trova tre casi in cui l'implementazione sembra non rispettare più l'intento dichiarato.

Per ciascuno classifica:

```text
Implementation drift
Context drift
Unknown
```

Poi indica quale evidence servirebbe per uscire da `Unknown`.

## Esercizio 2 — Da principio a fitness function

Trasforma questi principi vaghi in possibili fitness function:

```text
The system should be maintainable.
The system should be secure.
The API should be stable.
The platform should be cost effective.
```

Non serve trovare una singola misura.

L'obiettivo è capire quali proprietà concrete stanno sotto ogni frase.

## Esercizio 3 — Test sbagliato

Valuta questa regola:

```text
All services must use Kubernetes.
```

Chiediti:

1. quale proprietà sta cercando di proteggere?
2. possiamo riscriverla in modo technology-independent?
3. quando Kubernetes potrebbe comunque essere la risposta con fit migliore?
4. quando la regola diventerebbe fashion-driven governance?

## Esercizio 4 — ADR expiry

Scegli un ADR del tuo sistema.

Aggiungi:

```text
Assumptions
Review triggers
Evidence to collect
Conditions that invalidate the decision
```

Se non trovi nessun trigger, chiediti se la decisione è davvero irreversibile o se abbiamo semplicemente smesso di pensarci.

## Esercizio 5 — Debt portfolio

Prendi cinque technical-debt item.

Riscrivili con:

```text
Constraint created
Failure/change risk
Carrying cost
Owner
Repayment trigger
```

Ordina poi il portfolio non per quanto il codice è brutto, ma per rischio e costo futuro.

## Esercizio 6 — Architecture exception

Immagina di dover violare temporaneamente AF-005 e usare un SDK cloud in un layer vietato.

Scrivi:

```text
reason
risk
owner
expiry
removal condition
alternative rejected
```

Poi chiediti se l'eccezione è davvero meno costosa della soluzione corretta.

## Esercizio 7 — Agent red team

Dai a un agente una feature request locale senza mostrargli le architecture rule.

Osserva la soluzione.

Poi ripeti fornendo:

- ADR rilevanti;
- fitness function;
- forbidden boundary;
- acceptance evidence.

Confronta:

```text
functional correctness
architectural drift
number of revisions
explanation quality
```

Lo scopo non è dimostrare che l'AI "sbaglia".

È misurare quanto il sistema di context engineering influenza la qualità globale della modifica.

## Esercizio 8 — Fitness portfolio review

Per ogni fitness function di un sistema chiedi:

```text
What risk does it protect?
Has it caught anything useful?
Is it noisy?
Can it be bypassed?
Is the protected decision still valid?
Should it be automatic or review-based?
```

Elimina almeno una regola che non giustifica più il proprio costo.

## Esercizio 9 — ESI

Partendo da Order Operations, immagina questo nuovo requisito:

> Un cliente enterprise richiede accesso partner via Internet alla operational view.

Non implementare.

Elenca soltanto quali artefatti e decisioni devono essere riaperti.

Una buona risposta dovrebbe includere almeno:

- Functional Analysis;
- API Contract;
- NFR;
- Threat Model;
- Security Control Matrix;
- Cloud Deployment Map;
- Observability Contract;
- Testing Strategy;
- ADR relativi a ingress e topology;
- cost impact.

L'esercizio mostra la differenza fra "una nuova endpoint" e "un cambio di contesto architetturale".

## Esercizio 10 — Guardrail o burocrazia?

Per ciascun controllo classificare:

```text
Automatic gate
Warning / trend
Team review
Enterprise review
Remove
```

Controlli:

- forbidden module dependency;
- aumento del 5% del cloud cost;
- nuovo region deployment;
- nuovo package npm;
- public ingress;
- modifica CSS;
- nuova data copy;
- rename interno;
- RTO non rispettato durante un drill.

La risposta dipende dal contesto.

## Self-assessment

Dopo questo capitolo dovremmo saper rispondere:

1. Che differenza c'è fra architecture drift ed evolution?
2. Che differenza c'è fra implementation drift e context drift?
3. Che cos'è una fitness function?
4. Perché una fitness function non deve proteggere necessariamente una tecnologia?
5. Quando un architecture test è il meccanismo giusto?
6. Quando serve runtime evidence?
7. Perché un ADR dovrebbe avere review trigger?
8. Come trattiamo un'architecture exception?
9. Perché un waiver senza expiry è pericoloso?
10. Come possiamo trattare technical debt come portfolio di rischio?
11. Perché la governance deve essere proporzionale al blast radius?
12. In che modo l'AI può accelerare architecture drift?
13. Perché un agente non dovrebbe poter modificare autonomamente anche le policy che lo verificano?
14. Che differenza c'è fra bloccare drift e bloccare evoluzione?
15. Come colleghiamo fitness function, ADR ed evidence?

## Artefatto operativo

Il nuovo artefatto principale è:

> **Architecture Fitness Checklist**

Deve contenere almeno:

```text
Property
Risk
Mechanism
Evidence
Owner
Failure action
Status
Review trigger
```

Non è un catalogo enterprise di best practice.

È la rappresentazione viva delle caratteristiche che un workload ha deciso di proteggere.

## Cosa cambia con l'AI

Prima potevamo affidare una quota maggiore di architectural consistency alla memoria del team e alla code review.

Con agenti che possono modificare il repository a velocità molto maggiore, questa strategia scala peggio.

Quindi aumenta il valore di:

```text
machine-readable intent
executable boundaries
automated feedback
explicit exceptions
human approval for semantic/one-way decisions
```

Non perché l'AI elimini gli architect.

Perché rende troppo costoso usare l'architect come parser umano di ogni singolo diff.

## Corollario

> **Un'architettura evolutiva non è un'architettura che accetta qualsiasi cambiamento. È un'architettura che rende chiaro quali cambiamenti può assorbire, quali proprietà deve proteggere e quando le sue vecchie decisioni meritano di essere riaperte.**

Nel prossimo capitolo entreremo in un'altra dimensione del cambiamento: **il costo**.

Order Operations ha ormai abbastanza infrastruttura, reliability, security, observability e governance da rendere possibile una domanda molto più seria di "quanto costa Azure?":

> **Quale costo stiamo comprando con ogni proprietà architetturale e quale valore sta pagando quel costo?**
