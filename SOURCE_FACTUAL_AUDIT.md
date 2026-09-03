# Source & Factual Audit

Questo file traccia due revisioni distinte del manoscritto:

1. **Evidence pass** — i claim fattuali e le raccomandazioni che richiedono supporto vengono confrontati con fonti appropriate secondo `reference/SOURCE_POLICY.md` e `reference/RESEARCH_WORKFLOW.md`.
2. **ESI compromise pass** — il capitolo rende visibile almeno un compromesso significativo con esigenza, tensione, costo accettato, quality floor, guardrail e trigger quando pertinenti.

`Drafted` significa che il capitolo esiste.

## Convenzione narrativa corrente

Lo scenario enterprise fittizio ufficiale del libro è:

> **Example Software Industries S.p.A. — ESI**

Il capstone principale è:

> **Order Operations** — business unit Commerce & Operations.

I casi reali restano separati dallo scenario ESI e richiedono fonti verificabili.

## Stato corrente

| Capitolo | Draft | Evidence pass | ESI compromise pass | Note |
|---|---:|---:|---:|---|
| 0 — Al timone | sì | da fare | sì — draft pass | autonomia agenti vs accountability e blast radius |
| 1 — Il software è cambiato. Il problema no. | sì | da fare | sì — draft pass | Order Operations introdotto dentro ESI; velocità vs comprensione |
| 2 — Prima del codice | sì | parziale | sì — draft pass | functional analysis collegata a Microsoft Learn, Scrum Guide e Fowler; completezza vs learning speed |
| 3 — Pensare per sistemi | sì | da fare | sì — draft pass | freshness/completezza vs availability/semplicità |
| 4 — Che cos'è davvero Software Architecture | sì | da fare | sì — draft pass | lookup live vs read model asincrono |
| 5 — Dalle feature ai confini | sì | da fare | sì — draft pass | infrastruttura condivisa vs ownership forte |
| 6 — Qualità prima della tecnologia | sì | parziale | sì — draft pass | NFR, fit before fashion, quality floor esplicito |
| 7 — Pattern senza religione | sì | da fare | sì — draft pass | robustezza vs complexity debt |
| 8 — Il monolite non è il nemico | sì | da fare | sì — draft pass | autonomia/isolation vs costo distribuito |
| 9 — API e contratti | sì | sì — draft pass | sì — draft pass | source-first; action API rinviate finché semantica e ownership non sono definite |
| 10 — I dati sono architettura | sì | sì — draft pass | sì — draft pass | Microsoft Learn, PostgreSQL, Redis, Stripe Engineering e GitHub Blog; vista unificata vs ownership/synchronization/operational cost |
| 11+ | non ancora | source-first | required | ricerca, compromesso ESI e aggiornamento capstone entrano nel workflow prima della chiusura del draft |

## Workflow editoriale da Capitolo 10

Per i nuovi capitoli:

```text
outline
→ ESI tension / compromise framing
→ source discovery
→ draft
→ capstone update
→ claim audit
→ compromise audit
→ adversarial review
→ final editorial pass
```

## Evidence pass

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

## ESI compromise pass

Un capitolo supera il compromise pass quando il trade-off principale non è soltanto nominato ma governato.

Domande minime:

1. Quale esigenza aziendale o tecnica obbliga a decidere?
2. Quali obiettivi legittimi sono in tensione?
3. Che cosa scegliamo adesso?
4. Quale costo accettiamo consapevolmente?
5. Qual è il quality floor?
6. Quali guardrail impediscono che il compromesso diventi degrado incontrollato?
7. Quali evidenze tecniche sostengono la decisione?
8. Quali trigger ci faranno rivalutare la scelta?

Regola:

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

E corollario editoriale:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

## Prossima milestone editoriale

Prima di una release candidata:

- nessun capitolo può rimanere `da fare` per l'evidence pass;
- nessun capitolo può mancare del compromise pass quando lo scenario ESI è applicabile;
- i casi reali devono essere chiaramente separati dai casi ESI;
- i numeri simulati ESI non devono essere presentati come benchmark reali.