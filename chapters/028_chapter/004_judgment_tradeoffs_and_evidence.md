# 28.4 — Judgment: decidere quando l'execution è abbondante

Se l'AI riduce il costo di produrre alternative, prototipi, documenti e implementazioni, il collo di bottiglia si sposta.

Non scompare.

Si sposta verso:

```text
quale problema vale la pena risolvere?
quale alternativa ha fit migliore?
quale rischio accettiamo?
quale evidence è sufficiente?
quando fermarsi?
quando cambiare direzione?
```

Questo insieme di capacità può essere riassunto con una parola difficile da misurare:

> **judgment**

Non significa intuito infallibile.

Non significa esperienza usata come autorità.

Nel contesto di questo libro significa:

> **capacità di prendere decisioni esplicite sotto vincoli incompleti, sapendo quali assunzioni stiamo facendo e quale evidence potrebbe farci cambiare idea.**

---

## Una decisione non è una preferenza

Confrontiamo:

```text
Preferisco PostgreSQL.
```

con:

```text
Il workload richiede transazioni locali forti,
query relazionali note,
team competence esistente,
managed operation disponibile
ed evoluzione prevedibile.

PostgreSQL ha il fit migliore oggi.

Trigger di review:
access pattern radicalmente diverso,
scala non più sostenibile,
nuovo requirement di isolation,
nuova constraint operativa.
```

La prima è una preferenza.

La seconda è una decisione governabile.

L'architect deve trasformare opinioni in decisioni che espongono:

```text
Context
Forces
Alternatives
Decision
Consequences
Assumptions
Evidence
Review triggers
```

È il motivo per cui abbiamo usato ADR lungo tutto il libro.

---

## Il judgment è soprattutto selezione dei trade-off

Ogni stakeholder può avere una richiesta legittima.

Per esempio:

```text
Product
→ time-to-market

Security
→ stronger isolation

Operations
→ simpler recovery

Finance
→ lower run rate

Platform
→ standardization

Team
→ lower cognitive load
```

Non esiste sempre una soluzione che massimizzi tutto.

L'architect non deve quindi chiedere:

> “Qual è la best practice?”

ma:

> **“Quale compromesso protegge le proprietà non negoziabili e ottimizza ciò che conta di più in questo contesto?”**

Questa è la differenza fra architecture e technology selection.

---

## Reversibility come leva di decisione

Quando l'incertezza è alta, una delle proprietà più utili è la reversibilità.

Ma il libro ha insistito su una distinzione:

```text
reversible in code
≠
reversible in system
```

Un cambio di libreria può essere semplice da revertire.

Una migration che ha trasformato dati, un nuovo public contract o una nuova business semantics possono non esserlo.

L'architect deve riconoscere:

```text
Two-way door
→ possiamo sperimentare con costo controllato

One-way door
→ serve evidence più forte prima del passo
```

E soprattutto deve evitare che l'AI renda invisibile la one-way door semplicemente perché il diff che la implementa è piccolo.

> **La dimensione del diff non misura la reversibilità della decisione.**

---

## Evidence proportional to claim

Il Capitolo 26 ha reso questa disciplina esplicita.

Se il claim è:

```text
TypeScript compila
```

un typecheck può bastare.

Se il claim è:

```text
transaction atomic su PostgreSQL
```

serve PostgreSQL reale.

Se il claim è:

```text
restore rispetta RTO
```

serve un restore drill.

Se il claim è:

```text
AI grounded enough for production
```

serve model execution contro eval appropriata e runtime evidence.

L'architect deve saper scegliere il livello di evidence.

Troppa evidence per ogni decisione rende il delivery inutilmente lento.

Troppo poca rende le decisioni una collezione di speranze.

> **La qualità del judgment si vede anche da quanto costa dimostrare ciò che stiamo affermando.**

---

## Il rischio del decision theatre

Con strumenti AI possiamo produrre rapidamente:

- alternative analysis;
- trade-off table;
- risk register;
- ADR;
- cost comparison;
- threat analysis.

Questo può creare un nuovo anti-pattern:

> **decision theatre**

Molti artefatti danno l'impressione che la decisione sia stata approfondita.

Ma possono essere tutti derivati dalle stesse assunzioni non verificate.

Per esempio:

```text
AI genera 5 alternative
AI valuta le 5 alternative
AI scrive ADR
AI genera test
AI conclude che ADR è corretta
```

Se tutto il ciclo condivide la stessa misconception, abbiamo prodotto una catena coerente ma non necessariamente vera.

Da qui il valore di:

```text
primary source
independent evidence
adversarial review
runtime signal
human/domain authority
```

---

## AI come decision support, non decision owner

Un agente può essere un eccellente strumento per ampliare lo spazio delle alternative.

Per esempio:

```text
Generate three plausible architectures.
For each:
- assumptions
- failure modes
- operating cost
- irreversible decisions
- team implications
- evidence needed
```

Può anche fare red-team della scelta preferita:

```text
Argue why this design is wrong.
Identify the first assumption most likely to fail.
```

Questo è molto utile.

Ma la decision authority resta dove vive la responsabilità.

Se una scelta cambia:

```text
business semantics
risk acceptance
security policy
data authority
production commitment
```

un output AI non sostituisce la persona o il gruppo che possiede quella decisione.

---

## Decision velocity

Quando l'execution è veloce, anche le decisioni devono fluire bene.

Non significa decidere tutto velocemente.

Significa evitare due fallimenti opposti:

```text
Decision paralysis
→ ogni scelta aspetta una review centrale

Decision anarchy
→ ogni executor decide localmente
```

L'architect deve costruire un sistema in cui:

```text
small reversible decision
→ team / local autonomy

architecturally significant decision
→ ADR / focused review

high-impact one-way door
→ explicit authority + stronger evidence
```

Questo rende la governance proporzionale al blast radius.

---

## Microsoft: decision framework e stakeholder context

La guidance Microsoft sul ruolo dell'architect insiste proprio su questo punto: comprendere business outcomes e constraint, identificare le decisioni importanti, valutare trade-off, effort, reversibilità e rischio, usando benchmark o altri strumenti senza confonderli con il judgment.

Fonte:

- Microsoft Learn — *Solution Architect's Responsibilities and Guiding Principles*: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals

Non prendiamo questa fonte come definizione universale del ruolo.

La usiamo come evidenza che anche una guidance enterprise contemporanea considera il lavoro dell'architect molto più ampio della selezione tecnologica.

---

## ESI: Decision Quality Review

Nel modello ESI, una decisione architetturale importante viene valutata attraverso cinque domande:

```text
1. Il problema è abbastanza chiaro?
2. Le alternative sono realmente differenti o variazioni cosmetiche?
3. Quale costo/rischio stiamo spostando?
4. Quale evidence sostiene la scelta?
5. Quale trigger ci farà riaprire la decisione?
```

Non richiediamo un documento lungo.

Richiediamo che una persona possa ricostruire il ragionamento.

La regola è:

> **L'architect non deve essere la persona che ha sempre ragione. Deve costruire decisioni che possono essere corrette quando la realtà dimostra che avevano torto.**
