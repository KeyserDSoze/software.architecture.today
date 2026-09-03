# Operations Desk Classic

> **Sistema legacy simulato di Example Software Industries S.p.A.**

Operations Desk Classic è introdotto nel **Capitolo 17 — Legacy e comprensione** come sistema brownfield che precede Order Operations.

Non rappresenta un prodotto reale e le regole contenute nel codice sono deliberatamente simulate.

## Perché esiste nel capstone

Il libro ha costruito Order Operations conoscendo progressivamente le proprie decisioni.

Questo sistema serve a introdurre la situazione opposta:

```text
behavior exists
+ code exists
+ integrations exist
+ documentation incomplete
+ intent partially lost
```

L'obiettivo del Capitolo 17 non è ripulire questo codice.

È ricostruire abbastanza conoscenza per rendere sicuro il prossimo cambiamento.

## Capability in scope

Solo una slice è in scope:

> **legacy case priority routing**

File:

```text
src/priority-routing.cjs
```

La funzione produce i valori legacy:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

Questi valori e le relative condizioni sono **behavior simulati**.

Non sono ancora requirements di Order Operations.

## Evidence states

Usiamo:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

I characterization test possono portare un behavior a `Observed`.

Soltanto domain/owner evidence può renderlo `Confirmed` come comportamento intenzionale da preservare.

## Characterization suite

```text
tests/priority-routing.characterization.test.mjs
```

La suite protegge il comportamento corrente della slice.

Non dichiara che il comportamento sia corretto.

## Non fare ancora

Nel Capitolo 17 non dobbiamo:

- convertire il modulo in TypeScript;
- rinominare tutti i campi;
- eliminare magic value;
- estrarre classi;
- introdurre un nuovo servizio;
- copiare le regole in Order Operations;
- trasformare ogni comportamento osservato in requirement.

Questi sarebbero cambiamenti di struttura o semantica prima di avere completato l'understanding.

## Collegamento a Order Operations

La discovery è governata da:

```text
products/order-operations/docs/legacy-understanding-map.md
```

La candidate modernization direction verrà affrontata nel Capitolo 18.

> **Il codice legacy è deliberatamente lasciato nel suo stato corrente finché non sappiamo quali comportamenti meritano di sopravvivere.**