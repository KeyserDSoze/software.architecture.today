# 22.6 — Agenti, scope e stop condition

La issue diventa particolarmente importante quando l'executor non è una persona che conosce informalmente il contesto.

Un agente può lavorare molto bene dentro uno scope chiaro.

Può anche amplificare molto rapidamente uno scope ambiguo.

## Capability non è authority

Un coding agent può tecnicamente essere in grado di:

- modificare una migration;
- cambiare un API contract;
- aggiornare una fitness rule;
- aggiungere una dependency cloud;
- eliminare una compatibility path.

Questo non significa che il task corrente lo autorizzi.

La issue deve distinguere:

```text
Allowed change surface
Decision surface
Forbidden / escalation surface
```

Esempio:

```text
Allowed
- tests/integration/**
- test harness configuration
- package scripts required by the harness

Requires stop
- production schema semantic change
- change to PaymentEscalation contract
- weakening tenant isolation
- changing existing migrations
```

## Stop condition come parte della specifica

Una stop condition non è una frase pessimista.

È un confine operativo.

Esempi:

```text
Stop if the required test cannot be written
without modifying an existing production migration.
```

```text
Stop if current PostgreSQL behavior contradicts
Data Ownership Map assumptions.
```

```text
Stop if passing the gate requires weakening
an architecture fitness rule.
```

```text
Stop if the task discovers a new authoritative owner.
```

La stop condition trasforma una ambiguità imprevista in un output valido:

```text
execution stopped
+ evidence collected
+ decision required
```

invece di:

```text
agent guessed
+ patch grew
```

## Task amplification

Nel Capitolo 21 abbiamo introdotto questo failure mode:

```text
small task
→ adjacent cleanup discovered
→ scope expands
→ architecture changes incidentally
```

Una issue robusta permette di classificare il lavoro scoperto:

```text
required for acceptance
→ include

useful but independent
→ follow-up

changes semantics / architecture
→ stop + escalate
```

Questo è più utile di un rigido:

> non toccare mai file fuori lista.

A volte un test richiede una piccola modifica di package script o fixture.

Vogliamo autonomia locale, non obbedienza cieca.

## L'agente non approva il proprio cambio di policy

Un caso particolarmente pericoloso:

```text
architecture test fails
→ agent edits architecture test
→ build green
```

Oppure:

```text
acceptance criterion hard to satisfy
→ agent rewrites fixture
→ test green
```

La issue deve rendere esplicito quando il verification oracle è fuori dallo scope di modifica.

Per esempio:

```text
Existing migration 001/002 are evidence baseline.
Do not rewrite them to make the integration test pass.
```

Questa regola non significa che test e policy siano immutabili.

Significa che **cambiare il criterio di giudizio è una decisione diversa dal soddisfarlo**.

## Permission boundary reale

Una issue può dire:

```text
Do not deploy to production.
```

Ma, come abbiamo visto nel Capitolo 21:

```text
instruction
≠
security control
```

Il sistema di esecuzione deve comunque applicare permission coerenti.

GitHub stessa distingue i meccanismi di approvazione operativa dalle permission effettive: una approval UX non sostituisce un boundary di autorizzazione server-side.[^github-approvals]

Questa distinzione sarà centrale nel Capitolo 23.

## Scope renegotiation

Una buona issue non deve essere immutabile.

Durante execution può emergere evidence nuova.

Il processo sano è:

```text
new evidence
→ pause
→ update issue / decision
→ review changed scope
→ resume
```

Non:

```text
new evidence
→ silent interpretation
→ larger patch
```

La issue è un contratto operativo, non una tavola di pietra.

Può cambiare.

Ma deve cambiare **visibilmente**.

> **L'agente autonomo migliore non è quello che non si ferma mai. È quello che sa distinguere un ostacolo esecutivo da una nuova decisione.**

---

[^github-approvals]: GitHub Docs, *About rationale, confidence, and approvals for issues*, https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automation-rationale-and-approvals
