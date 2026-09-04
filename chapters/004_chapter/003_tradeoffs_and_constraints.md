## Trade-off e vincoli

Una decisione architetturale interessante raramente ha un'opzione che vince su tutto. Se una soluzione fosse contemporaneamente più veloce, più economica, più semplice, più sicura, più scalabile e più facile da operare di tutte le alternative, non avremmo un vero trade-off. Avremmo una scelta quasi ovvia.

L'architettura comincia quando dobbiamo riconoscere che **ottenere qualcosa significa spesso pagare qualcos'altro**.

## Il problema della parola “best”

Nel linguaggio tecnico parliamo spesso di best practice. Il termine è utile quando descrive pratiche consolidate dentro un contesto preciso; diventa pericoloso quando sostituisce il reasoning.

“Usiamo microservizi perché è best practice”, “mettiamo Kubernetes perché è lo standard” o “facciamo event-driven perché scala meglio” sono frasi incomplete. In tutte manca la parte che trasforma una preferenza in una decisione:

> **Rispetto a quale problema e pagando quale costo?**

La stessa soluzione può essere ottima in un contesto e disastrosa in un altro. Non perché la tecnologia cambi, ma perché cambiano le forze che deve assorbire.

## Le tensioni non si eliminano, si governano

Molti trade-off ricorrono continuamente. Una cache può ridurre latency e aumentare il rischio di stale data. Separare database o componenti può migliorare isolation e rendere le operazioni più complesse. Evitare funzionalità specifiche di un cloud può aumentare portability e rinunciare a leverage importante. Un'astrazione molto generale preserva possibilità future ma può rallentare il presente. Più autonomia ai team accelera le decisioni locali e può produrre frammentazione. Controlli di security più forti possono introdurre attrito.

Il compito architetturale non è fingere che una di queste tensioni scompaia. È capire quale lato privilegiare **in questo sistema, in questo momento, per questo outcome**.

### Una decisione credibile sa dire che cosa perde

Molti documenti architetturali descrivono soltanto i vantaggi della soluzione scelta. È un segnale debole, perché quasi ogni soluzione plausibile può essere presentata bene se omettiamo il costo.

Una decisione più credibile riesce a dire, per esempio:

```text
Guadagniamo:
- semplicità operativa;
- deployment unico;
- transazioni locali.

Paghiamo:
- minore isolation dei failure;
- deployability meno indipendente;
- coupling di release maggiore.
```

Il bilancio non deve essere simmetrico. Deve essere leggibile e onesto.

> **Una scelta architetturale credibile dichiara anche ciò che perde.**

## I vincoli restringono il design space

Nel Capitolo 2 abbiamo distinto hard e soft constraint. Qui ci interessa il loro effetto sull'architettura.

Immaginiamo un team di quattro persone, nessun on-call 24/7, budget cloud limitato, una piattaforma .NET già supportata e una deadline di otto settimane. Una soluzione basata su venti microservizi, Kubernetes multi-cluster e una piattaforma di streaming operata internamente può essere tecnicamente valida in astratto e completamente inadatta a quell'organizzazione.

La capacità operativa del team non è rumore attorno all'architettura. È uno dei vincoli che ne determina la sostenibilità.

## Il team è parte del sistema tecnico

Un'architettura viene costruita, operata e modificata da persone. Contano quindi competenze disponibili, numero di team, ownership, maturità operativa, capacità di incident response, onboarding e turnover.

Ignorare questi elementi produce spesso architetture eleganti sulla carta e fragili nella pratica. Il sistema reale comprende anche la capacità dell'organizzazione di comprenderlo e mantenerlo.

A volte i vincoli migliorano il design proprio perché restringono lo spazio delle possibilità. Un piccolo team può rendere evidente il fit di un modular monolith. Un requisito di audit può forzare una tracciabilità che altrimenti sarebbe stata lasciata implicita. Una deadline può costringerci a distinguere il necessario dal sofisticato.

I vincoli non sono soltanto limiti. Sono **forze che modellano il design**.

## Rendere confrontabili le alternative

Per decisioni importanti può essere utile una matrice molto semplice:

| Criterio | Opzione A | Opzione B | Opzione C |
| --- | --- | --- | --- |
| Semplicità operativa | alta | media | bassa |
| Freshness | alta | media | configurabile |
| Isolation | bassa | media | alta |
| Costo iniziale | basso | medio | alto |
| Reversibilità | alta | media | bassa |

La tabella non deve diventare un algoritmo che produce automaticamente una scelta. Serve a rendere visibili differenze, assunzioni e criteri. Se assegniamo pesi o punteggi, dobbiamo evitare la falsa precisione: un 8,4 contro 8,1 non rende scientifica una decisione basata su stime incerte.

Il valore della matrice è costringerci a dire **su quale asse** una soluzione sia migliore e quale costo accettiamo sugli altri.

## La decisione comprime il contesto

Una buona decisione architetturale comprime molte informazioni:

```text
requisiti
+ vincoli
+ rischio
+ costi
+ capacità del team
+ alternative
→ decisione
```

Se conserviamo soltanto il risultato finale, perdiamo il ragionamento che rende quella scelta comprensibile. È per questo che introdurremo gli ADR: non per registrare soltanto “che cosa abbiamo scelto”, ma per conservare **perché quella scelta aveva senso in quel momento**.

## AI come motore di alternative, non come giudice

Un modello può costruire una giustificazione convincente per molte architetture plausibili. Con un prompt può sostenere microservizi; con un altro può difendere un monolite con la stessa fluidità. Questo non rende l'AI inutile: la rende particolarmente adatta a esplorare il design space.

Possiamo chiederle di costruire il caso migliore per alternative diverse, di esplicitare le condizioni in cui ciascuna fallirebbe e di individuare quali informazioni mancanti cambierebbero la scelta. In questo modo usiamo la capacità retorica del modello per aumentare il confronto, non per sostituire la decisione.

La responsabilità resta legata al contesto reale.

> **Non scegliamo la soluzione più sofisticata. Scegliamo il trade-off più adatto al problema che abbiamo davvero.**
