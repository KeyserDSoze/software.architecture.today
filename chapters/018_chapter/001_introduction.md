# Capitolo 18 — Refactoring nell'era dell'AI

Nel Capitolo 17 abbiamo fatto una cosa poco spettacolare e molto importante: non abbiamo riscritto nulla.

Abbiamo studiato **Operations Desk Classic**, isolato una capability, aggiunto characterization test e distinto ciò che avevamo trovato da ciò che avevamo soltanto inferito.

Ora possiamo cambiare il sistema.

Ed è proprio qui che l'AI rende il refactoring più potente e più pericoloso.

Un agente può oggi:

- rinominare migliaia di simboli;
- convertire API obsolete;
- spostare responsabilità fra moduli;
- creare adapter;
- modificare centinaia di call site;
- generare migration;
- aggiungere test;
- aggiornare configurazioni;
- produrre un diff che un team umano avrebbe costruito in settimane.

Il problema è che **la velocità di trasformazione non riduce automaticamente il rischio della trasformazione**.

Può fare il contrario.

> **L'AI può rendere enorme il diff. Il nostro lavoro è rendere piccolo il rischio.**

## Refactoring non significa soltanto codice più bello

Nel senso classico, refactoring indica una modifica della struttura interna che preserva il comportamento osservabile.

Nella pratica di una modernizzazione enterprise, però, ci troviamo spesso davanti a un insieme più ampio di cambiamenti:

```text
refactoring interno
+ cambio di boundary
+ adapter
+ migration dati
+ sostituzione dependency
+ rollout progressivo
+ rimozione legacy
```

Non tutto questo è tecnicamente refactoring puro.

Ma tutto questo richiede la stessa disciplina fondamentale:

> **cambiare il sistema senza perdere il controllo di ciò che deve rimanere vero.**

Per questo in questo capitolo useremo *refactoring* in un senso operativo più ampio, distinguendo sempre quando stiamo:

- preservando comportamento;
- introducendo intenzionalmente un nuovo comportamento;
- migrando stato;
- cambiando un contratto;
- spostando ownership;
- eliminando una compatibilità storica.

## Il rischio non è proporzionale alle righe modificate

Un diff di ventimila righe può essere relativamente sicuro se è una trasformazione meccanica deterministica con ottima verification.

Una modifica di tre righe può essere devastante se cambia:

- precedence di una business rule;
- authorization;
- una query nel critical path;
- semantica di retry;
- serializzazione di un evento;
- ownership di un dato;
- una condizione di fallback.

Quindi non useremo:

```text
lines changed
```

come proxy del rischio.

Useremo piuttosto:

```text
semantic surface
× blast radius
× reversibility
× evidence quality
```

## Il refactoring ha bisogno di una safety envelope

Prima di cambiare Operations Desk Classic dobbiamo sapere:

1. quale capability stiamo modificando;
2. quali comportamenti devono essere preservati;
3. quali comportamenti possono cambiare intenzionalmente;
4. quali consumer possono essere colpiti;
5. quale stato viene letto o scritto;
6. quale rollback è realmente possibile;
7. quali segnali ci dicono che il nuovo percorso sta funzionando;
8. quali condizioni devono interrompere il rollout.

Questo insieme formerà il nuovo artefatto del capitolo:

> **Refactoring Safety Plan**

Non è una checklist burocratica.

È il contratto che ci permette di aumentare la velocità di modifica senza perdere accountability.

## Piccolo cambiamento, piccolo blast radius

Microsoft Azure Well-Architected raccomanda safe deployment practice coerenti e osserva che deploy frequenti e piccoli sono generalmente più semplici da recuperare rispetto a cambiamenti grandi e infrequenti.

Fonte:

- [Microsoft Learn — Architecture strategies for safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)

Questo principio è particolarmente importante con gli agenti.

Se l'AI può modificare cento file in pochi minuti, il nostro istinto non dovrebbe essere:

> “Fantastico, facciamoli tutti insieme.”

Dovrebbe essere:

> **“Fantastico, possiamo permetterci di costruire incrementi ancora più piccoli.”**

La maggiore capacità di execution può essere usata per produrre:

- diff più piccoli;
- adapter temporanei;
- comparison layer;
- migration step;
- test più mirati;
- rollback più precisi;
- documentazione aggiornata a ogni fase.

L'AI non ci obbliga ai big bang.

Può rendere i big bang ancora meno giustificabili.

## Tre tipi di rollback

Nel resto del capitolo distingueremo almeno tre concetti che spesso vengono confusi.

### Deployment rollback

Tornare all'artifact precedente.

### Behavior fallback

Lasciare deployato il nuovo codice ma riportare il traffico o la decisione alla vecchia implementazione.

### Data rollback

Ripristinare lo stato precedente.

Sono tre problemi diversi.

Una feature flag può rendere facile il behavior fallback e non fare nulla per invertire una migration dati distruttiva.

Un rollback applicativo può essere inutile se il nuovo codice ha già scritto dati che il vecchio non comprende.

> **Reversibile nel codice non significa reversibile nel sistema.**

## Il caso ESI

Nel Capitolo 17 abbiamo osservato sei behavior nella priority routing di Operations Desk Classic.

Ma non li abbiamo ancora promossi tutti a requirement.

Adesso ESI riunisce:

- Operations;
- Product;
- Payments & Risk;
- Sales;
- il team Order Operations;
- Platform Engineering.

L'obiettivo è classificare quei behavior e spostare la capability in Order Operations.

Il conflitto è evidente.

### Finance / Platform

Vogliono ridurre il costo del legacy e accelerarne il retirement.

### Operations

Vuole preservare il comportamento che tiene in piedi il lavoro quotidiano.

### Product

Non vuole trasformare workaround storiche in regole del nuovo prodotto.

### Engineering

Vuole un cambiamento piccolo, osservabile e reversibile.

### AI-enabled delivery

Rende tecnicamente possibile riscrivere tutto molto rapidamente.

Ed è proprio per questo che dobbiamo resistere alla tentazione.

## Compromesso ESI del capitolo

**Esigenza:** trasferire la priority routing da Operations Desk Classic a Order Operations per ridurre il legacy footprint.

**Tensione:** retirement speed vs semantic safety vs coexistence cost vs desiderio di semplificare regole storiche.

**Decisione:** classification esplicita dei behavior, seam `PriorityPolicy`, Branch by Abstraction, nuova implementazione in shadow mode, comparison evidence e cutover separato dalla rimozione del legacy.

**Costo accettato:** per un periodo manteniamo due implementazioni, un comparison path e una feature/switch policy temporanea.

**Quality floor:** nessuna regressione silenziosa su behavior confermati; differenze intenzionali documentate; tenant/security invarianti preservati; rollback possibile finché non raggiungiamo il punto di non ritorno dichiarato.

**Guardrail:** characterization suite, Refactoring Safety Plan, behavior classification, small batches, shadow comparison, stop condition e cleanup obbligatorio delle strutture temporanee.

## La domanda del capitolo

Non è:

> Come facciamo a riscrivere velocemente questo codice?

È:

> **Come aumentiamo drasticamente la velocità di trasformazione mantenendo piccolo, osservabile e reversibile il rischio di ogni passo?**
