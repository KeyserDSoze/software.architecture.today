## AI e decisioni architetturali

L'AI può migliorare molto il lavoro architetturale e, nello stesso tempo, renderlo più superficiale. La differenza dipende da **quale parte del processo le deleghiamo**.

Chiedere “qual è l'architettura migliore per questo sistema?” comprime troppe decisioni in una sola risposta. Anche se il risultato è tecnicamente plausibile, non sappiamo quali requisiti stia privilegiando, quali vincoli non abbia visto, quali assunzioni abbia fatto o quali costi stia minimizzando.

L'uso più interessante dell'AI non è quindi ottenere una soluzione finale. È aumentare la qualità del **processo decisionale**.

## Esplorare il design space

Uno dei compiti in cui un modello può dare molto leverage è generare alternative credibili. Possiamo chiedergli di proporre più architetture per lo stesso problema e, per ciascuna, descrivere quali requisiti favorisca, quali failure mode introduca, quale costo operativo comporti e in quali condizioni diventerebbe una scelta sbagliata.

Il valore non sta nel produrre molte opzioni per forza. Sta nel rompere l'inerzia della prima soluzione plausibile.

Un team che ha già in mente un read model può chiedere all'AI di costruire il caso migliore per un lookup live. Un team convinto dei microservizi può farle difendere un modular monolith. L'obiettivo non è ottenere una risposta neutrale, ma rendere più difficile confondere preferenza e necessità.

## Usare l'AI per attaccare la decisione

Una volta formulata una scelta, possiamo invertire il ruolo del modello. Invece di chiedergli di rafforzare la motivazione, gli chiediamo di cercare il punto in cui potrebbe fallire.

Domande come “assumi che questa architettura provocherà un incidente serio: quali cause sono più credibili?”, “quale ASR stiamo coprendo male?” o “quale conseguenza negativa stiamo probabilmente minimizzando?” trasformano l'AI in un adversarial reviewer.

Questo è particolarmente utile perché chi ha appena progettato una soluzione tende naturalmente a difenderla. Un secondo punto di vista riduce il costo del dissenso tecnico e può rendere visibili assunzioni che il gruppo ha smesso di notare.

## Chiedere prima quali informazioni mancano

Un uso ancora più importante consiste nel chiedere **domande** invece che soluzioni.

Prima di proporre un'architettura, un agente può evidenziare le informazioni che cambierebbero materialmente il design: volume e profilo del traffico, criticità del journey, RTO e RPO, tenancy model, dati regolamentati, capacità operativa del team, pattern di lettura e scrittura, dipendenze esterne o budget.

Questa funzione è spesso più preziosa della generazione diretta di diagrammi perché protegge dal confident guessing. Il modello non deve riempire ogni vuoto; può aiutarci a riconoscere **quali vuoti non siamo autorizzati a ignorare**.

## Review degli ADR

Un ADR è un candidato naturale per una review automatizzata. Un agente può cercare alternative-fantoccio, conseguenze negative mancanti, trigger troppo vaghi, contraddizioni con decisioni precedenti o claim non supportati dal contesto.

Possiamo anche definire un ruolo persistente:

```text
Role: Skeptical Architecture Reviewer

Obiettivo:
non migliorare la prosa dell'ADR.
Cercare motivi per cui la decisione potrebbe essere fragile,
prematura o basata su assunzioni non dichiarate.
```

Qui l'AI diventa un **amplificatore del dissenso tecnico**, non soltanto della produzione di documenti.

## Il rischio della confident architecture

I modelli generativi sono molto bravi a produrre risposte coerenti. Proprio questa capacità può diventare pericolosa: una spiegazione fluida, una tabella ordinata e un diagramma ben formato possono far sembrare più solida una decisione di quanto l'evidenza giustifichi.

In architettura questo rischio è particolarmente forte perché molte scelte non falliscono subito. Un endpoint sbagliato può rompersi nei test; una strategia di partizionamento mediocre può diventare problematica soltanto dopo mesi di crescita; una failure topology fragile può restare invisibile fino all'incidente giusto.

> **Più una decisione è costosa da verificare empiricamente, meno dobbiamo confondere la qualità della spiegazione con la qualità della scelta.**

La retorica può rendere leggibile il reasoning. Non lo trasforma automaticamente in evidenza.

## Synthesis e judgment non sono la stessa cosa

L'AI può sintetizzare molto bene requisiti, dipendenze, pattern, alternative e documentazione. Il judgment richiede invece priorità reali.

“È più importante ridurre il time-to-market o ottenere isolamento operativo?” non ha una risposta universale. Dipende dal business, dal rischio, dalle persone e dal momento in cui stiamo decidendo.

Un modello può spiegare il trade-off e mostrare le conseguenze dei due lati. La responsabilità di stabilire quale lato privilegiare appartiene a chi possiede il contesto e accetta il rischio della decisione.

## Più agenti non producono automaticamente evidenza

Per una one-way door possiamo usare più reviewer: distributed systems, security, operations, cost e skeptical review. Questa diversità può aumentare la probabilità di trovare failure mode differenti.

Ma cinque agenti che concordano non rendono una scelta corretta. Potrebbero condividere lo stesso contesto incompleto, la stessa documentazione obsoleta o la stessa assunzione iniziale.

La diversità di ruolo è utile soltanto se compriamo **indipendenza di prospettiva**, non cinque formulazioni della stessa premessa.

La domanda finale rimane:

> **Quale informazione esterna, misura runtime o nuova evidenza potrebbe falsificare questa decisione?**

## Dove si sposta il valore

Quando diagrammi, matrici e bozze di ADR diventano economici da generare, il vantaggio non sta nel produrne di più. Sta nel riconoscere quale decisione merita davvero attenzione, quale informazione manca, quale trade-off è reale e quale scelta è prematura.

Sta anche nel sapere quando fermare l'execution, quando una decisione locale sta diventando trasversale e quando il contesto è cambiato abbastanza da riaprire una scelta che ieri era ragionevole.

> **L'AI può aumentare enormemente la capacità di analisi architetturale. Il valore rimane nel judgment che ordina quell'analisi e decide quale evidenza è sufficiente per agire.**
