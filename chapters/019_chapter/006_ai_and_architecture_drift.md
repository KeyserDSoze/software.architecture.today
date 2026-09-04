# 19.6 — AI, agenti e architecture drift

L'AI cambia il rapporto fra architettura e velocità.

Quando produrre codice era costoso, molte deviazioni architetturali richiedevano comunque tempo umano sufficiente da essere visibili.

Con agenti capaci di modificare decine o centinaia di file in pochi minuti, possiamo produrre drift molto più velocemente.

Il problema non è che l'AI "non capisca l'architettura" in assoluto.

Il problema è più concreto:

> **l'agente vede soprattutto il contesto che gli abbiamo reso disponibile e ottimizza soprattutto il risultato che gli abbiamo chiesto.**

Se il prompt dice:

```text
Add feature X.
```

ma il repository non rende esplicito:

```text
no dependency on layer Y
no direct legacy import
no vendor SDK in domain
Payments owns economic semantics
```

una soluzione localmente corretta può essere globalmente sbagliata.

## Architecture by autocomplete, seconda forma

Nel Capitolo 1 abbiamo parlato di architecture by autocomplete come effetto dell'execution senza foundation.

Qui ne vediamo una versione più sottile.

Il progetto ha già un'architettura.

L'agente la osserva dal codice esistente.

Se esistono già tre violazioni storiche, può inferire che siano pattern accettati.

Poi ne aggiunge una quarta.

A quel punto il repository stesso inizia a insegnare il drift agli agenti futuri.

```text
exception
→ copied pattern
→ repeated exception
→ perceived convention
→ architectural drift
```

Questo rende importante distinguere:

```text
code that exists
≠
code that represents intended architecture
```

## Il repository deve diventare leggibile anche dagli agenti

un'AI-ready architecture non significa aggiungere un file gigantesco con tutte le regole.

Significa distribuire il contesto nei punti adatti:

```text
architecture docs
ADR
contracts
ownership maps
tests
fitness functions
CI gates
issue acceptance criteria
```

Così un agente può trovare sia la regola sia il meccanismo che la verifica.

## Agent Architecture Review

Un agente può essere utile come reviewer architetturale.

Per esempio può:

- confrontare un diff con gli ADR;
- individuare nuove dependency;
- cercare accessi cross-boundary;
- verificare se un nuovo datastore cambia ownership;
- cercare SDK vendor dentro layer vietati;
- confrontare IaC con security/reliability intent;
- identificare feature flag senza cleanup condition;
- suggerire ADR da riaprire.

Ma non deve produrre un verdetto opaco:

```text
Architecture looks good.
```

Meglio un output strutturato:

```text
Changed architectural surface
Relevant decisions
Fitness functions affected
Potential drift
Evidence
Exceptions required
Review triggers hit
Confidence / unknowns
```

## Agent-generated governance

C'è anche il rischio opposto.

L'AI può generare moltissime regole.

Prompt:

```text
Create architecture tests for this repository.
```

Output:

```text
42 dependency rules
17 naming rules
9 file-count thresholds
13 complexity thresholds
```

Il risultato può sembrare maturo.

Ma rischia di automatizzare accidentalmente la forma corrente del repository.

> **Una regola generata senza una proprietà da proteggere è soltanto rigidità generata.**

Ogni fitness function proposta da un agente deve quindi rispondere a:

```text
Which risk?
Which decision?
Which property?
Why automated?
What happens on failure?
When can this rule change?
```

## Exception abuse

Un agente autonomo non dovrebbe poter aggirare liberamente una architecture gate aggiungendo una waiver.

Il permission model deve distinguere:

```text
change implementation
≠
change architecture policy
≠
approve architecture exception
```

Questa separazione tornerà nei capitoli sugli agenti.

Se lo stesso agente può:

1. violare una regola;
2. modificare la regola;
3. approvare l'eccezione;
4. dichiarare il lavoro verificato;

non abbiamo governance.

Abbiamo self-approval automatizzato.

## Fitness function come contesto eseguibile

Per gli agenti una fitness function ha un valore aggiuntivo.

Non deve essere spiegata perfettamente nel prompt ogni volta.

L'agente può tentare una modifica.

Il sistema risponde:

```text
AF-002 failed:
src/application cannot import src/integration
```

Questo crea un feedback loop concreto.

L'agente può correggere la propria strategia.

La regola è quindi contemporaneamente:

- documentazione;
- constraint;
- verifier;
- feedback per l'agente.

## Ma non tutto è automatizzabile

Un architecture test non può decidere se:

- un nuovo bounded context ha senso;
- il business deve accettare eventual consistency;
- un vendor lock-in vale il beneficio;
- un costo Premium è giustificato;
- una regola legacy debba essere eliminata;
- un nuovo SLA richieda multi-region.

Qui resta necessario il judgment.

> **Automatizziamo la protezione delle decisioni che abbiamo già capito. Manteniamo umano il giudizio sulle decisioni che cambiano il significato del sistema.**

## Un nuovo verification bundle

Per un grande change agentico, ESI chiederà in futuro almeno:

```text
functional tests
architecture fitness
security checks
contract impact
cost/topology impact
ADR trigger review
exception list
human approval for one-way doors
```

Questo porta naturalmente verso i capitoli successivi su repository AI-ready e manager di agenti.

La cosa importante è non arrivarci pensando che gli agenti abbiano bisogno soltanto di prompt migliori.

Hanno bisogno di **sistemi di feedback migliori**.

> **Nell'era dell'AI l'architecture governance deve diventare meno dipendente dalla capacità di un reviewer di leggere ogni riga e più capace di trasformare l'intento in evidence.**
