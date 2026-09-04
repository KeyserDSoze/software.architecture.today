# 18.2 — Small batch, reversibilità e feature flag

Una modernization diventa pericolosa quando il cambiamento viene trattato come un'unica unità indivisibile.

```text
old system
→ giant rewrite
→ production switch
```

Questa forma nasconde ciò che ci serve per governare il rischio: quali proprietà cambiano, quale evidence abbiamo dopo ogni passo e dove possiamo ancora tornare indietro.

Un percorso più utile è:

```text
understand
→ introduce seam
→ preserve legacy behavior
→ add candidate inactive
→ compare
→ route a small cohort
→ expand
→ remove old path
```

Ogni freccia è una decisione distinta.

## Small batch significa unità di rischio comprensibile

“Fare cambiamenti piccoli” non significa produrre micro-commit privi di significato.

Un batch è abbastanza piccolo quando:

- ha uno scopo autonomo;
- lascia il sistema in uno stato valido;
- modifica una semantic surface comprensibile;
- ha evidence proporzionata;
- permette di definire rollback o fallback;
- rende attribuibile una regressione.

Per la priority routing ESI potremmo avere:

```text
PR 1
introduce PriorityPolicy seam
no behavior change

PR 2
route legacy behavior through adapter
characterization still green

PR 3
add target policy inactive

PR 4
add shadow comparison

PR 5
controlled candidate routing

PR 6
remove legacy path
```

Il valore non è il numero di PR.

È il fatto che dopo ciascun passo possiamo rispondere:

> Che cosa è diventato vero adesso, e quale nuova evidence possediamo?

## Safe deployment non significa zero rischio

Microsoft Azure Well-Architected raccomanda processi di deployment standardizzati, automatizzati e incrementali e sottolinea che cambiamenti piccoli e frequenti sono generalmente più semplici da diagnosticare e recuperare.

Fonte:

- [Microsoft Learn — Architecture strategies for safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)

L'obiettivo non è un deploy senza rischio.

È un rischio:

```text
bounded
detectable
attributable
reversible when promised
```

Una piccola release senza observability o fallback può essere più pericolosa di una trasformazione ampia ma meccanica e fortemente verificata.

## Feature flag: controllo di routing, non strategia completa

Una feature flag può scegliere a runtime fra vecchio e nuovo comportamento.

È molto utile perché separa:

```text
deployment
```

da:

```text
activation
```

Ma non decide da sola:

- chi entra nel candidate path;
- quali metriche guardiamo;
- quale mismatch è accettabile;
- chi può fermare il rollout;
- quale stato è già stato scritto;
- quando il vecchio path può essere rimosso.

Quindi:

> **Una feature flag è un meccanismo di controllo. Il rollout è una decisione architetturale sopra quel meccanismo.**

GitHub ha descritto l'uso delle feature flag per rollout progressivi, segmentazione e disabilitazione rapida, ma anche il costo del loro cleanup una volta terminata la migrazione.

Fonte:

- [GitHub Engineering — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

Ogni migration flag dovrebbe quindi avere già al momento dell'introduzione:

```text
owner
purpose
default
rollout plan
fallback semantics
removal condition
```

Una flag temporanea senza exit condition è un candidate branch legacy.

## Branch by Abstraction e feature flag fanno lavori diversi

**Branch by Abstraction** crea il seam dietro cui possono convivere vecchia e nuova implementazione.

La feature flag può governare quale implementazione venga usata.

AWS distingue esplicitamente i due concetti.

Fonte:

- [AWS Prescriptive Guidance — Branch by abstraction pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

Per ESI:

```text
caller
→ PriorityPolicy
   ├── LegacyPriorityAdapter
   └── ConfirmedPriorityPolicy
```

è il boundary.

La scelta:

```text
legacy
shadow
candidate
```

è la policy di routing.

Confondere i due livelli porta spesso a pensare che una flag messa intorno a codice fortemente accoppiato abbia già creato una modernization architecture.

## Shadow mode compra evidence prima dell'authority

Lo shadow mode esegue la candidate policy senza lasciarle ancora decidere il risultato esterno.

```text
input
→ legacy result = authoritative
→ candidate result = observed only
→ comparison
```

È potente quando il candidate è deterministicamente confrontabile e non produce side effect.

È pericoloso quando il “path ombra” scrive, invia messaggi, acquisisce lock o chiama un provider con effetti reali.

> **Shadow traffic è sicuro soltanto quando il candidate è davvero privo di authority sul mondo esterno.**

## Una differenza non è automaticamente un bug

Nel caso ESI sappiamo già che una regola legacy verrà rimossa intenzionalmente.

Quindi:

```text
legacy = Urgent
candidate = Standard
```

può rappresentare una regressione oppure una differenza approvata.

Lo shadow comparison deve poter distinguere almeno:

```text
Match
ExpectedDifference
UnexpectedDifference
```

Senza questa semantica, il sistema di comparison produce soltanto rumore.

E il rumore porta rapidamente a ignorare i mismatch.

## Rollback deve dire esattamente che cosa torna indietro

Durante il rollout possiamo avere:

### Deployment rollback

```text
new artifact
→ previous artifact
```

### Behavior fallback

```text
candidate
→ legacy
```

senza cambiare artifact.

### Configuration rollback

Ripristino della configurazione precedente.

### Data rollback

Ripristino o compensazione dello stato.

### Contract rollback

Ritorno a un contratto compatibile precedente, quando ancora possibile.

Queste capability hanno costi e vincoli diversi.

Dire “abbiamo rollback” senza specificare quale significa nascondere la parte più importante della recovery story.

## Il point of no return divide due fasi della migrazione

Nelle prime fasi possiamo avere:

```text
candidate inactive
shadow
small cohort
```

con fallback immediato.

La reversibilità diminuisce quando il candidate inizia a scrivere stato authoritative, quando un consumer legacy viene dismesso o quando lo schema vecchio viene eliminato.

Il Safety Plan deve quindi identificare:

```text
last fully reversible checkpoint
```

prima di ogni one-way door.

## Casi reali: rollout come parte del design

GitHub ha raccontato la riscrittura dei server-side hook con una nuova implementazione posta dietro feature flag e inizialmente abilitata su repository interni, prima di ampliare progressivamente il rollout.

Fonte:

- [GitHub Engineering — Improving Git push times through faster server side hooks](https://github.blog/engineering/architecture-optimization/improving-git-push-times-through-faster-server-side-hooks/)

In un availability report GitHub ha anche descritto la disabilitazione tramite feature flag di una query problematica durante un rollout, seguita dal refactoring del path.

Fonte:

- [GitHub Availability Report — April 2023](https://github.blog/news-insights/company-news/github-availability-report-april-2023/)

Il principio che ci interessa non è “usare feature flag”.

È:

> **progettare deployment, attivazione, osservazione e fallback come parti della stessa decisione di change.**

## L'AI rende economicamente conveniente essere più prudenti

Un agente può generare adapter, comparison event, routing switch, test e cleanup PR in poco tempo.

Questo rende più economico costruire un percorso incrementale.

Usare la stessa capacità per comprimere tutto in una mega-trasformazione spreca proprio il vantaggio più interessante.

> **Quando l'execution diventa veloce, possiamo permetterci batch più piccoli e checkpoint più frequenti. La velocità non è una scusa per saltarli.**