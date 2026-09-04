# Caso 2 — Operations Desk Classic → Order Operations

Il secondo caso parte dalla condizione opposta a Campaign Launchpad. Non dobbiamo decidere quanto poco costruire; dobbiamo decidere **quanto del sistema esistente merita di sopravvivere**.

Operations Desk Classic funziona abbastanza da essere pericoloso ignorarlo, ma non è conosciuto abbastanza da poter essere copiato alla cieca.

ESI vuole portare la decisione di Priority dentro Order Operations. La tentazione del rewrite diretto sarebbe semplice:

```text
read legacy code
→ rewrite priority logic
→ compare
→ switch
```

Il problema è che il codice storico contiene insieme requirement, workaround, bug sopravvissuti e decisioni che nessuno ricorda più.

## Characterization descrive il passato; non lo autorizza

Nel legacy osserviamo una regola:

```text
Enterprise + age >= 30m
→ URGENT
```

I characterization test dimostrano che quel comportamento esiste. Non dimostrano che il prodotto lo voglia ancora.

Lo stato epistemico corretto è:

```text
implementation  Found
behavior        Observed
business intent Unknown
```

Questa distinzione impedisce il primo failure del brownfield: trasformare automaticamente ogni behavior storico in requisito target.

> **La modernizzazione non deve preservare il passato. Deve preservare ciò che del passato è ancora parte del prodotto.**

## L’analisi funzionale cambia il significato della verification

Product, Operations ed Engineering ricostruiscono la policy target e confermano una semantica diversa:

```text
Closed
→ NotActionable

manualHold
→ ManualReview

Payment + failedAttempts >= 3
→ Urgent

otherwise
→ Standard
```

La vecchia regola Enterprise viene ritirata intenzionalmente. Il mismatch corrispondente diventa `ED-001 — ExpectedDifference`.

Questo cambia il criterio di successo della migration. Zero mismatch non è più l’obiettivo; sarebbe anzi la prova che il candidate sta conservando una regola che abbiamo deciso di eliminare.

La shadow comparison deve quindi distinguere:

```text
Match
ExpectedDifference
UnexpectedDifference
```

> **La verification corretta deriva dalla semantica target, non dalla somiglianza massima con il legacy.**

## Il seam separa authority e coexistence mechanism

Order Operations introduce `PriorityPolicy` come seam. Dietro il contract convivono `LegacyPriorityAdapter` e `ConfirmedPriorityPolicy`.

L’Anti-Corruption Layer traduce `status_code`, `manual_hold` e `failed_attempts` verso il modello target, impedendo al linguaggio legacy di continuare a definire il nuovo dominio.

Il caller dipende dall’astrazione, così possiamo attraversare tre stati:

```text
legacy
→ shadow
→ candidate
```

In shadow il legacy rimane authoritative e il candidate produce soltanto comparison evidence. È una distinzione cruciale: il nuovo codice può esistere senza aver ancora ricevuto l’autorità di definire il comportamento production.

## Il costo della reversibilità è coexistence

ESI compra un cutover più sicuro pagando due implementation path, test aggiuntivi, adapter, telemetry di comparison e cleanup futuro.

Finance e Platform potrebbero preferire una retirement più rapida. Operations vuole evitare regressioni. Product vuole invece eliminare behavior storici non più validi.

Il trade-off è quindi esplicito:

```text
Benefit
semantic evidence + reversibility

Cost
temporary duplicated path + migration telemetry + cleanup

Quality floor
no silent semantic regression
no legacy rule promoted without confirmation
no cutover without fallback evidence
```

Questa è migration architecture: complessità temporanea che deve avere una exit condition.

## Il codice locale non completa il cutover

La migration ha già accumulated evidence: characterization test, target/refactoring test e architecture fitness. Ma non possiede ancora production shadow telemetry, consumer evidence, retirement evidence e fallback exercise sufficienti.

Per questo la PRR corrente mantiene:

```text
LB-PRIORITY-CANDIDATE
= NOT AUTHORIZED
```

La migration non è bloccata perché manca il candidate code. È bloccata perché **l’authority non è ancora stata trasferita con evidence sufficiente**.

Questa distinzione è uno dei punti più importanti dell’intero caso.

## Il caso GitHub mostra la stessa logica di transizione

GitHub ha raccontato l’upgrade del proprio monolite da Rails 3.2 a 5.2 attraverso dual boot, CI su più versioni e rollout progressivo, continuando contemporaneamente lo sviluppo del prodotto.

Fonte:

- [GitHub Engineering — Upgrading GitHub from Rails 3.2 to 5.2](https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/)

Non è la stessa migration e non dimostra che Branch by Abstraction sia sempre la soluzione. Mostra una property più generale: **vecchio e nuovo possono convivere abbastanza a lungo da produrre evidence comparabile e ridurre il rischio di un big-bang**.

## La migration finisce quando il ponte può sparire

Il vero end state non è “candidate implementation in production”.

La modernizzazione termina quando possiamo rimuovere legacy adapter, shadow machinery, legacy-only configuration, characterization-only scaffolding e la dependency da Operations Desk Classic senza perdere una capacità necessaria.

Finché il ponte serve, la migration è ancora parte dell’architettura.

> **La parte finale di una modernizzazione è eliminare la modernizzazione dal sistema — ma soltanto dopo che l’evidence ci autorizza a perdere la via di ritorno.**
