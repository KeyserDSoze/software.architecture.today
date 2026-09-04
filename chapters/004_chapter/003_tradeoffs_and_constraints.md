## Trade-off e vincoli

Una decisione architetturale interessante raramente ha una soluzione che vince su tutto.

Se esistesse un'opzione più veloce, più economica, più semplice, più sicura, più scalabile e più facile da operare delle alternative, non avremmo un trade-off.

Avremmo soltanto una scelta ovvia.

L'architettura comincia davvero quando dobbiamo accettare che **ottenere qualcosa significa spesso pagare qualcos'altro**.

### Il costo nascosto della parola “best”

Nel linguaggio tecnico parliamo spesso di best practice.

Il termine è utile quando descrive pratiche consolidate in un contesto ben definito.

Diventa pericoloso quando sostituisce il ragionamento.

“Usiamo microservizi perché è best practice.”

“Mettiamo Kubernetes perché è lo standard.”

“Facciamo event-driven perché scala meglio.”

In tutte queste frasi manca la parte essenziale:

> **rispetto a quale problema e pagando quale costo?**

Una pratica può essere ottima per un sistema e pessima per un altro.

### Trade-off concreti

Consideriamo alcune tensioni ricorrenti.

**Consistency vs availability.** In certi scenari possiamo accettare dati leggermente vecchi per mantenere una funzione disponibile.

**Latency vs freshness.** Una cache riduce latency, ma introduce il problema dell'invalidazione e della staleness.

**Isolation vs simplicity.** Separare componenti o database può ridurre blast radius, ma aumentare complessità operativa.

**Portability vs leverage.** Evitare feature specifiche di un cloud riduce lock-in, ma può rinunciare a servizi gestiti molto efficaci.

**Generality vs speed.** Un'astrazione molto generale può accomodare il futuro, ma rallentare il presente e aumentare superficie di errore.

**Autonomy vs consistency.** Dare autonomia ai team accelera decisioni locali, ma può produrre frammentazione tecnologica.

**Security vs convenience.** Controlli più forti possono aumentare attrito operativo.

Il compito dell'architect non è eliminare queste tensioni.

È renderle visibili e scegliere consapevolmente quale lato privilegiare nel contesto attuale.

### Un trade-off non è un difetto

Molti documenti architetturali descrivono soltanto i vantaggi della soluzione scelta.

Questo è un segnale debole.

Una decisione senza conseguenze negative dichiarate spesso significa che il confronto non è stato fatto abbastanza bene.

Una buona decisione dovrebbe poter dire:

```text
Guadagniamo:
- semplicità operativa
- deployment unico
- transazioni locali

Paghiamo:
- minore isolation dei failure
- deployability meno indipendente
- coupling di release maggiore
```

Non serve che il bilancio sia simmetrico.

Serve che sia onesto.

> **Una scelta architetturale credibile sa dichiarare anche ciò che perde.**

### I vincoli restringono il design space

Nel Capitolo 2 abbiamo distinto vincoli hard e soft.

Ora vediamo il loro effetto architetturale.

Supponiamo che un'organizzazione abbia un team di quattro persone, nessun on-call 24/7 e un budget cloud limitato. Immaginiamo inoltre una piattaforma .NET già standardizzata, l'obbligo di deployment in una regione specifica e una deadline di otto settimane.

Un'architettura che richiede venti microservizi, Kubernetes multi-cluster e una piattaforma event streaming operata internamente può essere tecnicamente valida.

Ma non è valida **per quel sistema organizzativo**.

La capacità operativa del team è parte del contesto architetturale.

### Il team è un vincolo tecnico

Questa affermazione merita attenzione.

Un'architettura non viene eseguita da diagrammi.

Viene costruita, operata e modificata da persone.

Quindi contano le competenze disponibili e il numero di team, la maturità operativa e l'ownership, la capacità di incident response e la velocità di onboarding. Anche turnover e autonomia decisionale fanno parte dell'architettura reale, perché determinano quali soluzioni l'organizzazione è in grado di sostenere.

Ignorare questi elementi produce architetture eleganti in teoria e fragili nella pratica.

### Constraint-driven architecture

A volte i vincoli aiutano.

Un budget stretto può impedire overengineering.

Un piccolo team può favorire un modular monolith invece di una distribuzione prematura.

Un requisito di audit può forzare una migliore tracciabilità delle azioni.

Una deadline può obbligare a distinguere ciò che è necessario da ciò che è soltanto interessante.

I vincoli non sono soltanto limiti.

Sono **forze che modellano il design**.

### Trade-off matrix

Per decisioni importanti può essere utile una matrice semplice.

Esempio:

| Criterio | Opzione A | Opzione B | Opzione C |
| --- | --- | --- | --- |
| Semplicità operativa | alta | media | bassa |
| Freshness | alta | media | configurabile |
| Isolation | bassa | media | alta |
| Costo iniziale | basso | medio | alto |
| Reversibilità | alta | media | bassa |

La tabella non deve diventare un algoritmo che produce automaticamente la risposta.

Serve a rendere visibili assunzioni e differenze.

Se assegniamo pesi e punteggi, dobbiamo evitare la falsa precisione.

Un 8,4 contro 8,1 non rende una decisione scientifica.

### Decisione come compressione del contesto

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

Se vediamo soltanto il risultato finale, perdiamo il ragionamento.

Per questo più avanti introdurremo gli ADR.

Il loro valore non è registrare “che cosa abbiamo scelto”.

È conservare **perché quella scelta aveva senso in quel momento**.

### L'AI e il problema dell'alternativa convincente

Un modello può produrre rapidamente una giustificazione eccellente per quasi qualsiasi architettura plausibile.

Può convincerci che microservizi siano la scelta giusta.

Poi, con un prompt diverso, può convincerci altrettanto bene del contrario.

Questo non è necessariamente un difetto.

Può diventare un ottimo strumento di confronto.

La tecnica utile è chiedere:

1. migliore argomento a favore dell'opzione A;
2. migliore argomento a favore dell'opzione B;
3. condizioni in cui ciascuna fallirebbe;
4. quali informazioni mancanti cambierebbero la scelta.

In altre parole, usare l'AI non come giudice, ma come **motore di alternative e critica**.

La decisione resta legata al contesto reale.

> **Non scegliamo la soluzione più sofisticata. Scegliamo il trade-off più adatto al problema che abbiamo davvero.**