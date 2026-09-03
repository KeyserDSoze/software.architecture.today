# Source & Factual Audit

Questo file traccia lo stato dell'evidence pass del manoscritto.

`Drafted` significa che il capitolo esiste.

`Evidence pass` significa che i claim fattuali e le raccomandazioni che richiedono supporto sono stati confrontati con fonti appropriate secondo `reference/SOURCE_POLICY.md` e `reference/RESEARCH_WORKFLOW.md`.

## Stato corrente

| Capitolo | Draft | Evidence pass | Note |
|---|---:|---:|---|
| 0 — Al timone | sì | da fare | prevalentemente concettuale; verificare claim su AI workflow e agenti |
| 1 — Il software è cambiato. Il problema no. | sì | da fare | evidence pass importante su AI-assisted development e workflow |
| 2 — Prima del codice | sì | parziale | nuova sezione functional analysis già collegata a Microsoft Learn, Scrum Guide e Fowler |
| 3 — Pensare per sistemi | sì | da fare | cercare fonti su system thinking, failure domains e architecture context |
| 4 — Che cos'è davvero Software Architecture | sì | da fare | ADR, ASR, trade-off e reversibilità da ancorare a fonti riconosciute |
| 5 — Dalle feature ai confini | sì | da fare | DDD, information hiding, cohesion/coupling, dependency direction |
| 6 — Qualità prima della tecnologia | sì | parziale | capstone NFR già collega Azure Architecture Center e AWS Well-Architected; audit del capitolo da completare |
| 7 — Pattern senza religione | sì | da fare | pattern, resilience e integration guidance da verificare su fonti primarie |
| 8 — Il monolite non è il nemico | sì | da fare | modular monolith/microservices/team topology claims da documentare |
| 9+ | non ancora | source-first | ricerca e fonti entrano nel workflow prima della chiusura del draft |

## Regola editoriale da Capitolo 9

Per i nuovi capitoli:

```text
outline
→ source discovery
→ draft
→ claim audit
→ adversarial review
→ final editorial pass
```

Non ogni frase richiede una citazione.

La richiedono soprattutto:

- claim su tecnologie e protocolli;
- best practice presentate come tali;
- limiti e caratteristiche di prodotti;
- incidenti e casi aziendali;
- numeri e benchmark;
- standard e definizioni;
- affermazioni storiche;
- raccomandazioni che dipendono da evidenze esterne.

Le tesi editoriali del libro devono invece essere argomentate chiaramente e, quando possibile, confrontate con fonti che mostrino convergenza o tensione.

## Prossima milestone editoriale

Prima di una release candidata del libro, nessun capitolo può rimanere nello stato `da fare` per l'evidence pass.