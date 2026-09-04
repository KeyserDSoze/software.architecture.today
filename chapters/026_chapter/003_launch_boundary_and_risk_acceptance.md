# Launch boundary, blocker e risk acceptance

Una Production Readiness Review non può rispondere a “siamo pronti?” finché non sappiamo **pronti per che cosa**.

Il launch boundary definisce la promessa concreta: quali utenti, capability, regioni, volumi, integrazioni, support window e operational expectation stiamo per esporre al mondo reale.

Un bounded internal pilot con private workforce access e una sola region è un sistema diverso, dal punto di vista del rischio, da un launch globale 24x7 con public ingress, AI assistant e write action.

> **La readiness si valuta contro la promessa corrente, non contro un prodotto futuro immaginario.**

## Progressive exposure riduce la promessa, non il quality floor

Limitare cohort, traffic, region o feature set può ridurre il blast radius e permettere un launch più piccolo mentre capability più ambiziose restano Pending.

Ma un pilot con dieci operatori continua ad avere bisogno di authentication corretta, tenant isolation quando applicabile, data integrity, owner, incident path e capacità di capire se sta fallendo.

La scala modifica la severità di alcuni gate; non rende negoziabili le proprietà che definiscono il quality floor.

Questo è il motivo per cui restringere il launch boundary può essere una mitigation molto più efficace di aggiungere architettura. Se l’AI eval non è completa, possiamo lanciare il core con l’AI disabled. Se il support 24x7 non esiste, possiamo proporre un pilot business-hours. Se public ingress non è pronto, possiamo mantenere private workforce access.

La mitigation deve però essere reale e verificabile.

## Go/No-Go non è una votazione

Immaginiamo Product, Engineering e Sales favorevoli al launch, mentre Security segnala una boundary non verificata e Operations non ha restore evidence.

Tre voti contro due non producono un `GO`.

Alcuni finding appartengono a authority specifiche. Security deve poter bloccare un critical security gap; Payments & Risk un rischio economico del proprio dominio; Operations deve poter dichiarare che un support/recovery model non è praticabile.

La stessa regola usata contro il consensus theatre nei workflow agentici vale qui:

> **I finding non hanno tutti lo stesso peso e l’authority non nasce dalla maggioranza.**

## Accepted Risk è una decisione, non un colore giallo

Una risk acceptance seria deve rendere leggibili condition, impact, affected boundary, mitigation, detection, fallback, owner, acceptance authority ed expiry/review trigger.

Per esempio, un bounded internal pilot potrebbe accettare l’assenza di active-active multi-region se esiste restore evidence e il business owner accetta un regional downtime envelope.

Molto diverso è non sapere se il committed business state può essere ripristinato affatto.

Nel primo caso abbiamo un rischio compreso e limitato. Nel secondo manca la property necessaria per giudicare il rischio.

## Non tutto è reversibile allo stesso modo

Anche “rollback disponibile” è una frase troppo generica.

Possiamo rollbackare code, configuration, feature exposure o traffic. I dati possono richiedere restore, forward repair o business compensation. Un messaggio già emesso, un pagamento eseguito o una destructive migration non vengono annullati da una feature flag.

Per questo una one-way door deve aumentare la readiness bar. Prima di eliminare una via di fuga dobbiamo sapere quale evidence dimostra che il target è pronto, quale fallback scompare e chi accetta la perdita di reversibilità.

## ESI separa quattro launch boundary

Order Operations ha almeno quattro promesse differenti:

```text
LB-CORE
→ core operational read journey

LB-ESCALATION
→ Payment Escalation + Outbox + messaging boundary

LB-PRIORITY-CANDIDATE
→ target Priority policy authoritative cutover

LB-AI
→ Case Explanation Assistant
```

Questa separazione è più utile di un readiness score unico.

`LB-ESCALATION` può essere bloccato da `OO-001` mentre il core continua a progredire. `LB-AI` può restare disabled finché `OO-002` non produce real model evidence. Priority cutover può restare non autorizzato senza impedire il compatibility path corrente.

La readiness non è quindi una percentuale del repository. È una decisione per promessa.

## La data non cambia la physics del sistema

Se un blocker richiede cinque giorni e il launch è domani, esistono tre opzioni oneste:

```text
close the blocker
reduce the launch boundary
explicitly accept a bounded risk with the right authority
```

Rinominare `blocker` in `follow-up` perché la data si avvicina non crea nuova evidence. È risk laundering.

Una domanda utile durante ogni riclassificazione è:

> **Quale nuova informazione tecnica o di business ci permette di considerare oggi accettabile ciò che ieri non lo era?**

Se la risposta è soltanto “la data è domani”, non è cambiato il rischio.

## Il decision record deve essere leggibile

La PRR deve terminare con una decisione esplicita: `GO`, `CONDITIONAL GO` o `NO-GO`, launch boundary, blocker, accepted risk con authority, capability disabled, evidence package, rollback/fallback, support owner e next review trigger.

`CONDITIONAL GO` deve descrivere condizioni reali, non significare “andiamo e poi sistemiamo”.

Per esempio:

```text
GO only if
→ evidence X closes
→ capability Y remains disabled
→ cohort stays bounded
→ support owner W is active
```

## La regola

> **Non adattare la definizione di ready alla data. Adatta la data, la promessa o il rischio esplicitamente accettato alla evidence che possiedi.**
