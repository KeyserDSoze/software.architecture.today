# 21.6 — Permission, secret e stop condition

Un repository può essere facile da comprendere, facile da costruire e comunque pericoloso da automatizzare.

Il motivo è semplice: **conoscere il sistema non equivale ad avere il diritto di modificarlo in qualunque modo**.

Questa è la zona in cui AI-readiness incontra Security by Design. Un agente può essere tecnicamente capace di modificare Bicep, creare una migration, chiamare un'API, ruotare un secret, aprire una PR o avviare un deployment. Da questa capacità non segue automaticamente l'autorizzazione a usare tutte quelle azioni nello stesso task.

> **Capability e authorization sono due proprietà diverse.**

## Least privilege deve seguire il task

Nel Capitolo 13 abbiamo applicato least privilege alle workload identity. Lo stesso principio vale per l'execution agentica.

Un task che modifica una business rule non ha bisogno di production credential, cloud admin, billing write access o secret rotation. Se queste permission sono comunque disponibili, il blast radius del task cresce senza che l'outcome lo richieda.

La permission surface deve quindi seguire la semantic surface del lavoro.

Più un agente può fare, più aumentano le conseguenze potenziali di errore, instruction ambiguity, prompt injection, tool misuse o credential exposure. La soluzione non è togliere ogni tool; è evitare di concedere capability che il task non può giustificare.

Possiamo pensare al mandato operativo come a:

```text
context
+ allowed semantic change
+ allowed tools
+ verification
+ stop conditions
```

Nel Capitolo 23 questo diventerà un contratto più formale. Qui ci interessa costruire il repository in modo che questi boundary possano essere dichiarati e rispettati.

## Il repository spiega il credential flow, non contiene la credenziale

Secret, API key, password, private token e production credential non appartengono a `AGENTS.md`, README, sample config, prompt, fixture o log versionati.

Il repository può dire:

```text
Use managed identity in deployed environments.
For local development use the approved developer credential flow.
```

Non deve includere il valore che rende possibile l'accesso.

Questa distinzione sembra ovvia finché non consideriamo che un coding agent può leggere automaticamente molte più superfici di un repository di quante ne aprirebbe un developer durante un task locale.

Per questo la data minimization diventa ancora più importante: sample e fixture devono essere sintetici, minimizzati e sufficienti alla verifica senza trascinare customer data reale nel context layer.

> **Context non è credential. Example data non è una scusa per versionare production data.**

## La stop condition separa execution e decisione

Una stop condition non è una frase prudenziale come “chiedi aiuto se qualcosa sembra rischioso”. Deve essere collegata a un boundary osservabile.

Per Order Operations il task deve fermarsi quando richiede, senza una decisione già autorizzata, una nuova semantica economica, una nuova authoritative data ownership, public Internet ingress, una migration distruttiva, un indebolimento della tenant isolation, un breaking contract o un cambiamento delle regole funzionali confermate.

Questi eventi hanno una caratteristica comune: **il problema ha smesso di essere soltanto execution**.

L'agente può ancora raccogliere evidence, descrivere alternative o proporre un follow-up. Non dovrebbe però scegliere arbitrariamente quale owner perde authority, quale rischio diventa accettabile o quale requirement va ignorato per completare il task.

```text
execution problem
→ agent can proceed inside mandate

decision boundary reached
→ stop + surface evidence + request authority
```

La stop condition rende esplicito il punto di transizione.

## Fail closed dove l'incertezza cambia il rischio

Non ogni failure richiede lo stesso comportamento.

Se un formatter non parte possiamo avere un fallback ragionevole. Se non riusciamo a verificare authorization, tenant isolation, destructive migration, Payment semantics o production deployment, la direzione più sicura è normalmente fermarsi.

Il principio è:

> **quando l'assenza di evidence può trasformare un task locale in un incidente ad alto impatto, l'automazione deve preferire il fail closed.**

Questo non significa rendere conservativo ogni workflow. Significa calibrare il comportamento sul costo dell'errore, esattamente come abbiamo fatto con reliability e security in tutto il libro.

## Non tutto il testo che l'agente legge è instruction

Un coding agent può incontrare frasi imperative in source comment, issue, documenti, file generati, log, fixture, vendored dependency o dati recuperati dall'esterno.

Non tutto quel testo possiede authority.

Questa distinzione diventa fondamentale quando l'agente ha accesso a tool che possono produrre effetti reali. Un log può contenere “delete this file”, ma resta data. Un documento esterno può contenere una prompt injection, ma non diventa una repository policy.

Una forma concettuale utile è:

```text
authoritative instruction channels
→ repository operating instructions
→ platform/security policy
→ explicit task mandate

untrusted or lower-authority content
→ application data
→ logs
→ external documents
→ third-party comments
```

La convenzione non risolve da sola la prompt injection. Fa però una cosa importante: riduce l'ambiguità su quali contenuti possono governare l'esecuzione.

## Human-in-the-loop non significa approvare ogni riga

Un human gate è utile quando cambia il livello di rischio, non quando duplica tutta l'execution.

Un normale task può produrre codice, typecheck, test e PR prima dell'intervento umano. Una modifica che introduce una one-way door, cambia security boundary o abilita production può richiedere un gate separato prima di attraversare quella soglia.

Il flusso può quindi essere:

```text
agent execution
→ local evidence
→ review / policy gate
→ higher-risk environment or action
```

La posizione del gate dipende dal task. Il principio resta la **separation of duties**: chi è capace di eseguire non deve ottenere automaticamente anche l'autorità necessaria ad approvare la propria escalation.

## Instruction e security control fanno lavori diversi

Scrivere “Never leak secrets” può essere utile come guida. Non sostituisce secret scanning, least privilege, managed identity, protected environment, branch/ruleset, audit log, code review o network control.

La instruction cerca di orientare il comportamento. Il permission boundary limita ciò che può accadere quando il comportamento è sbagliato.

> **Una instruction è una guida. Un security control è una proprietà del sistema.**

Confondere i due produce falsa sicurezza: un repository può avere istruzioni perfette e permission eccessive; oppure controlli forti ma un context layer che induce continuamente l'agente a tentare azioni non appropriate.

## Stop condition come moltiplicatore di autonomia

A prima vista una stop condition sembra ridurre l'autonomia. In realtà può permettere il contrario.

Se il sistema non sa distinguere task ordinario e decisione ad alto impatto, dobbiamo mantenere supervisione continua. Se i boundary sono chiari, possiamo lasciare molta più libertà dentro lo spazio sicuro e intervenire soltanto quando la semantic surface cambia categoria.

Questo è lo stesso modello che useremo più avanti per l'autonomia degli agenti:

```text
clear mandate
+ narrow permission
+ strong verification
+ explicit stop
= more useful autonomy
```

Non stiamo ancora definendo livelli formali di autonomia. Stiamo preparando il repository affinché possa sostenerli senza confondere capability con authority.

> **L'autonomia utile non nasce eliminando i limiti. Nasce rendendo i limiti abbastanza chiari da poter lasciare libero tutto il resto.**