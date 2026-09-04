# L'azienda è parte del sistema

Per buona parte della storia del software abbiamo rappresentato il sistema come qualcosa che iniziava dall'utente e finiva nel database.

Poi abbiamo imparato ad aggiungere rete, dipendenze, cloud, queue, identity e osservabilità.

Ma un'altra parte continua spesso a restare fuori dal diagramma:

**l'organizzazione che deve costruire, finanziare, operare e cambiare quel sistema.**

ESI è nata proprio per rendere impossibile ignorarla.

---

## Una scelta tecnica ha sempre più di un cliente

Prendiamo una decisione apparentemente semplice:

> usare private endpoint per Service Bus.

Dal punto di vista Security compra una proprietà chiara:

```text
reduced public reachability
```

Ma nel caso ESI quella decisione ha incontrato immediatamente Finance, perché Private Link su Service Bus ha cambiato il tier richiesto e quindi il costo.

Platform deve sostenere networking e DNS.

Operations deve diagnosticare un failure path più complesso.

Engineering deve sviluppare e testare dentro quel boundary.

La domanda non è quindi:

> private endpoint è una best practice?

La domanda è:

> **la proprietà che compra giustifica il costo complessivo per questo workload?**

Questa è architecture.

---

## Non esiste il punto di vista neutrale

Product guarda:

```text
value
time-to-market
adoption
```

Security guarda:

```text
threat
privilege
blast radius
```

Operations guarda:

```text
detection
recovery
supportability
```

Finance guarda:

```text
run rate
TCO
predictability
```

Platform guarda:

```text
standardization
leverage
cognitive load
```

Engineering guarda:

```text
changeability
testability
complexity
```

Nessuno di questi punti di vista è “il business” da solo.

L'architecture work spesso consiste nel costruire una decisione che renda leggibili gli effetti fra questi interessi.

Non per fare felici tutti.

Ma per sapere **chi guadagna, chi paga e quale rischio resta**.

---

## Best practice senza contesto

Una best practice è utile quando comprime esperienza reale.

Diventa pericolosa quando viene usata per interrompere il ragionamento.

Nel corso del libro abbiamo incontrato molte raccomandazioni ragionevoli:

```text
use managed identity
prefer automation
make systems observable
practice recovery
use least privilege
version contracts
keep changes small
```

Ma anche una pratica generalmente buona deve essere tradotta nel workload.

Per esempio:

“alta disponibilità” non dice ancora:

```text
quale failure
per quale journey
con quale RTO
con quale RPO
con quale costo
```

“osservabile” non dice:

```text
quale domanda operativa
quale SLI
quale cardinality
quale retention
```

“secure” non dice:

```text
quale asset
quale threat
quale residual risk
```

Per questo il libro ha cercato di trasformare gli aggettivi in proprietà discutibili.

> **Gli aggettivi non sono requisiti.**

---

## Standardizzazione come prodotto

Una grande azienda deve standardizzare qualcosa.

Senza standardizzazione, ogni team ripaga:

```text
identity
secret management
CI/CD
security scanning
landing zone
telemetry conventions
cost allocation
incident integration
```

Ma standardizzare tutto produce un altro tipo di costo.

Un piccolo prodotto Marketing può finire costretto nella stessa topology di un sistema Payments altamente regolato.

Una capability mobile offline può ricevere gli stessi pattern di un portale interno.

Un team può dover adottare Kubernetes perché l'azienda “ha scelto Kubernetes”, anche quando non compra nessuna proprietà utile per il workload.

Nel Capitolo 27 abbiamo quindi formulato una regola enterprise:

> **Standardizza ciò che non differenzia il business. Lascia spazio di decisione dove il contesto del workload cambia davvero.**

La piattaforma migliore non elimina le decisioni dei team.

Elimina le decisioni ripetitive che non meritano di essere riprese da ogni team.

---

## Campaign Launchpad e Order Operations

I due prodotti ESI rendono visibile questo principio.

Campaign Launchpad ha bisogno di:

```text
internal authoring
template approval
versioned publish
rollback
public static delivery
```

Order Operations ha bisogno di:

```text
domain ownership
operational cases
Payments integration
outbox
private enterprise boundary
legacy migration
runtime AI
```

Se imponessimo la stessa architettura ai due prodotti, uno dei due pagherebbe complessità senza valore.

Ciò che può essere condiviso è diverso:

```text
identity baseline
security scanning
ownership metadata
cost attribution
CI/CD conventions
observability vocabulary
```

Questa è una forma di architettura enterprise molto diversa dal distribuire un template universale.

---

## Il team è un vincolo architetturale

La tecnologia viene posseduta da persone.

Questo significa che:

```text
skill
on-call capacity
team size
ownership stability
coordination cost
```

sono input architetturali.

Non significa scegliere sempre ciò che il team conosce già.

Quella sarebbe un'altra forma di dogma.

Significa includere il costo di apprendimento e operazione nel technology fit.

Tre persone che possiedono dieci microservizi non hanno automaticamente dieci unità di autonomia.

Possono avere dieci deployment surface, dieci failure surface e un solo collo di bottiglia umano.

Per questo la topology deve essere sostenibile dall'organizzazione **che esiste oggi**, non soltanto da quella che immaginiamo di avere in futuro.

---

## One-Man Project dentro una grande azienda

Il One-Man Project ha reso esplicito un paradosso.

Una persona può governare un piccolo prodotto con grande autonomia proprio perché non deve costruire tutto da sola.

Sotto di lei possono esistere:

```text
enterprise identity
managed cloud services
platform automation
security baseline
CI/CD
central observability
shared incident process
```

Quindi:

> **L'autonomia locale è spesso costruita sopra una grande quantità di collaborazione resa invisibile dalla piattaforma.**

Questo è un buon antidoto alla narrativa del developer completamente autosufficiente.

L'AI può ampliare il perimetro governabile da una persona.

Non elimina la società, la piattaforma, gli specialisti o le autorità di dominio che rendono possibile quell'autonomia.

---

## Specialist gate

Giocare fuori ruolo è utile.

L'architect può costruire una query.

Il backend engineer può esplorare una UI.

Un developer può preparare un threat model.

Un agente può accelerare l'ingresso in un'area nuova.

Ma:

> **essere capaci di esplorare non significa essere autorizzati a chiudere ogni decisione.**

In ESI abbiamo introdotto Specialist Gate per aree come:

```text
Payments semantics
Security risk acceptance
Legal / Compliance
platform policy
business commitment
```

Questo non deve diventare un approval maze.

Deve essere attivato dove il costo di una decisione sbagliata supera la profondità disponibile localmente.

---

## Architecture come linguaggio comune

Una delle funzioni più utili dell'architect è rendere comparabili esigenze che parlano linguaggi diversi.

Finance dice:

```text
costo
```

Security dice:

```text
risk
```

Operations dice:

```text
recoverability
```

Product dice:

```text
outcome
```

Engineering dice:

```text
complexity
```

Architecture può trasformare questi input in una decisione come:

```text
Option A
property bought
cost
risk
failure mode
reversibility
review trigger
```

Non perché l'architect possieda tutti quei domini.

Perché deve saper costruire abbastanza **visione sistemica** da farli incontrare.

---

## Il sistema continua oltre il deploy

Un sistema software non finisce quando viene rilasciato.

Continua attraverso:

```text
support
incident
billing
compliance
migration
training
customer expectation
future change
```

È per questo che Production Readiness non può essere soltanto una build pipeline verde.

Ed è per questo che architecture non può essere soltanto design-time.

Il sistema reale include anche l'organizzazione che dovrà conviverci.

> **La topology del software e la topology della responsabilità non devono essere identiche. Ma ignorarsi a vicenda è costoso.**