# 21.7 — Come fallisce un repository “AI-ready”

È facile aggiungere `AGENTS.md`, qualche prompt e un test e dichiarare il repository pronto per gli agenti.

È più utile chiedere **come può ingannarci questa sensazione di readiness**.

I failure mode sono molti, ma quasi tutti appartengono a quattro famiglie: il contesto può diventare troppo grande o sbagliato; la verification può diventare soltanto apparentemente forte; la documentazione può descrivere un'architettura che il codice non possiede; l'authority può restare ambigua nonostante tutte le istruzioni.

Questa classificazione è più utile di un catalogo perché ci permette di capire quale proprietà del sistema dobbiamo correggere.

## Prima famiglia — Il contesto cresce più rapidamente della sua affidabilità

Il primo rischio è credere che più context significhi più comprensione.

Un instruction file può accumulare regole globali, note locali, workaround, business detail e storia del progetto finché l'informazione rilevante viene sommersa. Questo è **instruction overload**: paghiamo più token e più manutenzione senza ottenere necessariamente un modello migliore.

Il rischio opposto arriva quando quelle istruzioni restano ferme mentre il sistema cambia. Un `AGENTS.md` che descrive Order Operations senza priority capability dopo che `src/priority/` esiste già è peggiore di nessuna istruzione: offre una risposta sbagliata con un tono autorevole. Questo è **instruction drift**.

La duplicazione amplifica entrambi. Se la stessa regola vive in README, tool-specific instruction, wiki e prompt template, ogni copia diventa un punto di divergenza. Il repository può così essere molto documentato e contemporaneamente avere più source of truth incompatibili.

Esiste poi una forma ancora più sottile: **documentation laundering**.

```text
agent inference
→ copied into operating instructions
→ future agent reads it as policy
→ inference becomes “truth”
```

Abbiamo già incontrato il problema nel legacy: `Observed` non significa `Confirmed`. La stessa disciplina epistemica deve valere per il context layer. Una inferenza utile in una sessione non deve diventare persistent instruction senza evidence e authority.

La mitigazione comune a questa famiglia è semplice da esprimere, anche se richiede disciplina:

```text
small global context
+ canonical source
+ scoped routing
+ owner / review trigger
```

Il context layer deve ridurre rediscovery, non trasformare ogni scoperta in policy permanente.

## Seconda famiglia — Il verde smette di significare evidence

Un repository può avere golden command e continuare a non essere realmente verificabile.

Se `npm test` richiede setup non documentato, salta test importanti o fallisce in modo flaky, possediamo soltanto una **golden-command illusion**. Il nome del comando è stabile; il significato no.

Ancora più pericoloso è il **green-by-editing-the-oracle**. L'agente modifica implementation, test, fixture o architecture rule finché il build torna verde, ma il requirement originario non è più quello che viene verificato.

Il pattern è:

```text
failure
→ change behavior
→ change oracle
→ green
```

Il colore della pipeline non ci dice quale delle due parti abbia ceduto.

Questo è il motivo per cui characterization test, confirmed semantics, expected-difference registry e fitness rule devono avere governance distinta dall'implementazione che giudicano.

Esistono anche due scorciatoie simmetriche. “I test sono la documentazione” elimina decision context: i test possono mostrare che un behavior esiste senza dirci se è ancora desiderato o chi lo possiede. “La documentazione dice che il boundary è vietato” elimina invece verification: una regola meccanica importante resta affidata alla memoria dell'esecutore anche se potrebbe essere automatizzata.

La soluzione non è scegliere fra docs e test. È mantenere il loro rapporto:

```text
decision context
→ why this property matters

executable verification
→ whether the property still holds
```

> **Un repository AI-ready non ha bisogno soltanto di più gate. Ha bisogno che il significato del gate resti protetto.**

## Terza famiglia — Il context layer descrive la fantasia invece della realtà

Una Repository Map può raccontare application, contracts e integration con confini perfetti mentre il codice reale contiene import circolari, shared database e accessi trasversali.

La mappa può comunque essere utile, ma deve distinguere `Current`, `Target` ed eventuali `Exception`. Altrimenti l'agente assume che il boundary target sia già una proprietà verificata e produce un change su una realtà immaginaria.

Lo stesso rischio appare quando adottiamo strutture perché “sono da agenti”:

```text
/prompts
/skills
/agents
/context
/memory
```

senza un failure concreto da ridurre. È **agent cargo cult**, la stessa fashion-driven architecture che abbiamo criticato per le tecnologie.

Un'altra variante è l'overfitting a un particolare tool o modello. Ottimizziamo instruction, naming e flow per una feature preview; il tool cambia e metà del context layer perde valore.

Le proprietà più durevoli sono meno glamour: build ripetibile, test, ownership, contract, canonical docs, boundary e task chiari.

> **AI-ready non deve significare model-shaped repository. Deve significare repository con decisioni e feedback abbastanza leggibili da sopravvivere al cambio di esecutore.**

## Quarta famiglia — Il repository è chiaro, ma nessuno sa chi può decidere

L'ultima famiglia non può essere risolta da `AGENTS.md`.

Una instruction come:

```text
You may modify anything required to complete the task.
```

sembra pragmatica, ma elimina scope e authority boundary. Un task locale può diventare migration, infrastructure change o policy rewrite soltanto perché l'agente li ritiene utili.

La Repository Map può dire chi possiede Payments, Security e Platform. Ma se l'organizzazione non sa davvero chi approva una breaking decision, chi accetta un production risk o chi può autorizzare una one-way door, il repository finirà comunque contro un vuoto di governance.

Questo è il caso del **repository AI-ready dentro un'organizzazione AI-unready**.

Il problema emerge anche quando il sistema non distingue instruction autorevole da testo incontrato durante l'esecuzione. Log, fixture, source comment ed external document possono contenere frasi imperative; con tool potenti, questa ambiguità diventa un problema di authority e prompt injection.

La mitigazione comune è rendere espliciti mandate, permission e stop condition e collegarli a owner reali. L'agente può proporre una decisione. Non deve ottenere authority soltanto perché è il soggetto che ha scoperto la necessità di prenderla.

## Una diagnostica più utile di quattordici checkbox

Possiamo condensare i failure mode in una piccola matrice.

| Famiglia | Segnale | Domanda diagnostica | Correzione tipica |
|---|---|---|---|
| Context integrity | istruzioni lunghe, duplicate o stale | quale source è autorevole e chi la aggiorna? | canonical source + routing + scope |
| Verification integrity | verde facile da ottenere cambiando oracle | quale claim dimostra davvero il gate? | protected oracle + deterministic commands |
| Architecture representation | map e codice raccontano sistemi diversi | stiamo descrivendo Current, Target o Exception? | evidence + architecture fitness |
| Authority integrity | task che espandono permission e decisioni | chi è autorizzato quando scatta la stop condition? | mandate + least privilege + human/owner gate |

La tabella non sostituisce i singoli failure mode. Li rende più azionabili.

## Persistent context non sostituisce lo stato corrente

Anche un context layer perfetto descrive ciò che dovrebbe essere stabile. Un task può comunque richiedere diff recente, test correnti, log, configuration o runtime metrics.

Una migration può aver cambiato ieri la struttura. Un incident può aver introdotto una temporary exception. Una nuova issue può aver riaperto una decisione.

Da qui una regola fondamentale:

> **Persistent context riduce rediscovery. Non elimina la necessità di osservare il presente.**

L'agente deve combinare repository context e current evidence, non scegliere uno dei due.

## Come misurare readiness senza contare file

Non useremo il numero di instruction file, prompt template o agent skill come misura di maturità.

Domande più interessanti sono:

> **Quanto rapidamente un nuovo contributor può passare da task a modifica verificata senza dipendere da tribal knowledge?**

E:

> **Quante volte un esecutore deve riscoprire un'informazione stabile che il repository avrebbe potuto rendere persistente?**

A queste possiamo aggiungere una terza:

> **Quando il sistema non sa abbastanza, quanto chiaramente riesce a dichiararlo invece di trasformare l'incertezza in una regola?**

Questa è la readiness che vogliamo costruire in ESI.

> **Un repository AI-ready non parla di più agli agenti. Riduce meglio l'ambiguità, protegge il significato dell'evidence e rende visibile il punto in cui il repository non possiede l'autorità per decidere.**