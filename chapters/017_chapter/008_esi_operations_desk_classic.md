# 17.8 — ESI: capire Operations Desk Classic prima di sostituirlo

ESI ha ora un problema che non abbiamo progettato noi.

La business unit Commerce & Operations usa ancora **Operations Desk Classic**, un'applicazione interna precedente a Order Operations.

Il sistema è fittizio, ma il problema è realistico.

## Perché ESI vuole intervenire

Le pressioni arrivano da più parti.

### Finance / FinOps

Vuole ridurre:

- runtime legacy;
- pipeline separate;
- licenze e manutenzione;
- supporto specialistico.

### Platform Engineering

Vuole ridurre workload fuori standard e deployment non uniformi.

### Security

Vuole eliminare:

- identity tecniche storiche;
- permission ampie;
- secret statici;
- componenti non più allineati alla baseline ESI.

### Commerce & Operations

Vuole evitare che gli operatori debbano usare due console.

### Operations

Pone però il vincolo più importante:

> **non possiamo perdere regole operative soltanto perché nessuno le ha più formalizzate.**

## Scope del Capitolo 17

Non migreremo l'intera applicazione.

Studieremo una sola capability:

> **legacy case priority routing**

Operations Desk Classic calcola una priority interna per alcuni case.

Order Operations oggi non usa quella stessa semantica.

Prima di decidere se incorporarla, sostituirla o eliminarla, dobbiamo capire che cosa fa davvero.

## Il primo inventory

La discovery iniziale trova:

```text
Operations Desk Classic
├── HTTP/UI entry point
├── priority-routing module
├── shared operations database
├── nightly export
└── configuration values
```

Stato iniziale:

```text
priority-routing source exists           = Found
nightly export source exists             = Found
same DB table referenced by both         = Found
priority affects current workflow        = Inferred
enterprise special case is intentional   = Unknown
current business owner                   = Unknown
```

Questa è già informazione utile.

Ma non è ancora sufficiente per scrivere un nuovo requisito.

## Il codice legacy

Nel capstone introduciamo intenzionalmente una piccola slice legacy separata dal nuovo codice.

La funzione di routing contiene comportamento storico simile a questo:

```text
closed case
→ NONE

manual hold
→ MANUAL_REVIEW

payment case with repeated attempts
→ URGENT

enterprise case older than threshold
→ URGENT

otherwise
→ STANDARD
```

Questi comportamenti sono **simulati**.

Non sono best practice e non rappresentano regole industriali.

Servono a mostrare il processo di discovery.

## Perché non ripuliamo subito il codice

La tentazione sarebbe:

- rinominare tutto;
- creare enum;
- separare funzioni;
- introdurre dependency injection;
- trasformare CommonJS in TypeScript;
- eliminare magic number.

Non ancora.

Il Capitolo 17 deve preservare una situazione importante:

> **stiamo ancora scoprendo che cosa significa il comportamento.**

Refactor e modernization arrivano nel Capitolo 18.

Qui aggiungiamo characterization evidence.

## Behavioral observations

La prima characterization produce osservazioni come:

| ID | Input | Output osservato | Stato |
|---|---|---|---|
| LB-01 | case closed | `NONE` | Observed |
| LB-02 | manual hold | `MANUAL_REVIEW` | Observed |
| LB-03 | Payment + 3 failed attempts | `URGENT` | Observed |
| LB-04 | Enterprise tier + age >= threshold | `URGENT` | Observed |
| LB-05 | standard case | `STANDARD` | Observed |

Notiamo la parola:

> **Observed**

Non `Confirmed`.

## La regola enterprise è sospetta

Il branch enterprise contiene un threshold temporale.

Perché?

Possibili spiegazioni:

1. esiste uno SLA contrattuale;
2. era una policy Operations;
3. era una workaround durante un incidente;
4. era una feature temporanea mai rimossa;
5. il codice è dead e nessuno usa più quel path.

Il repository non può rispondere da solo.

La domanda diventa un item della Legacy Understanding Map.

## Nightly export

La discovery trova anche un export notturno che include la priority.

Questo cambia il blast radius.

Il priority router non influenza soltanto la UI.

Potrebbe influenzare:

```text
operator workflow
+ nightly export
+ downstream reporting
```

Il consumer dell'export deve quindi essere identificato prima di qualsiasi modifica.

Il nuovo system boundary non può essere progettato guardando soltanto la chiamata UI.

## Data ownership

La stessa discovery trova una tabella legacy che contiene:

```text
case_id
priority_code
priority_updated_at
manual_hold
```

Domande:

- Operations Desk Classic è l'unico writer?
- Order Operations legge già quella tabella indirettamente?
- il nightly export usa la tabella o ricalcola?
- `manual_hold` è business state o operational workaround?
- chi può modificarlo?
- esiste audit?

Finché queste domande non hanno risposta, non dichiariamo ownership nuova.

## Il compromesso ESI del capitolo

### Esigenza

Ridurre il costo e il rischio di Operations Desk Classic e consolidare progressivamente le capability in Order Operations.

### Tensione

```text
Finance / Platform / Security
→ vogliono accelerare il retirement

Operations / Product
→ non vogliono perdere comportamento necessario

Order Operations team
→ non vuole importare accidenti legacy come nuovo dominio
```

### Decisione

Non facciamo una rewrite né un cutover.

Facciamo:

```text
inventory
→ characterization
→ owner discovery
→ hidden consumer discovery
→ behavior classification
→ seam design
```

### Costo accettato

Operations Desk Classic continuerà a esistere ancora per un periodo.

Paghiamo temporaneamente:

- doppio runtime;
- doppia conoscenza;
- discovery effort;
- characterization suite;
- coexistence futura.

### Quality floor

Non accettiamo:

- silent semantic regression;
- perdita di tenant isolation;
- perdita di audit necessario;
- cambio di priority behavior non dichiarato;
- dual ownership ambiguo;
- cutover senza rollback.

### Guardrail

- Legacy Understanding Map;
- characterization test;
- evidence state `Found/Inferred/Observed/Confirmed`;
- consumer discovery;
- owner confirmation;
- modernization slice con rollback;
- decisione esplicita su ogni behavior legacy significativo.

## Modernization candidate

Dopo la fase di understanding, una direzione probabile è:

```text
Order Operations
→ PriorityRouting port / ACL
→ legacy implementation first
→ new implementation later
```

Questo creerebbe il seam per un **Branch by Abstraction**.

Ma nel Capitolo 17 resta una candidate direction.

Non la implementiamo ancora.

Perché manca una cosa fondamentale:

> sapere quali regole devono davvero sopravvivere.

## Evidence prima del refactor

Il capitolo quindi lascia ESI in uno stato apparentemente meno spettacolare di una nuova architettura.

Abbiamo però guadagnato:

```text
legacy slice visible
characterization executable
unknown behavior explicit
hidden downstream candidate visible
ownership questions visible
migration seam candidate visible
```

Questa è modernization progress.

Non abbiamo ancora rimosso una riga legacy.

Abbiamo ridotto l'incertezza del prossimo cambiamento.

> **Il primo prodotto di una modernizzazione sicura non è il nuovo codice. È una comprensione abbastanza affidabile da sapere quale nuovo codice merita di essere scritto.**