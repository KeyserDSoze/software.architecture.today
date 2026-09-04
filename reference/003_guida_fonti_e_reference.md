# Come leggere fonti e reference

Le fonti di *Software Architecture Today* hanno due funzioni diverse:

- **sostenere claim verificabili** su standard, protocolli, prodotti, studi e casi reali;
- **rendere trasparente il confine** tra ciò che una fonte dimostra e ciò che il libro deduce o propone come metodo.

Per questo non esiste una bibliografia che sostituisce le citazioni vicine ai claim. Le fonti principali restano nel punto del testo in cui servono; il build genera inoltre un **Indice delle fonti** che consolida tutti gli URL esterni distinti del corpo del libro e li collega al capitolo in cui compaiono.

## Gerarchia preferita

Quando è disponibile una fonte adeguata, l'ordine di preferenza è:

1. standard, specifiche normative e RFC;
2. documentazione ufficiale di protocolli, progetti e piattaforme;
3. paper e pubblicazioni tecniche originali;
4. postmortem, engineering blog e case study dell'organizzazione direttamente coinvolta;
5. guidance architetturale autorevole;
6. autori tecnici riconosciuti e fonti secondarie, chiaramente trattati come interpretazione o posizione professionale.

Una fonte vendor è valida per descrivere il proprio prodotto e può essere utile come guidance. Non diventa per questo una legge universale.

## Quattro etichette mentali

### Standard o specifica

Serve quando il claim riguarda comportamento normativo o contrattuale di un protocollo, formato o standard.

### Documentazione ufficiale

Serve per capability, limiti, configurazioni e semantics documentate di un prodotto o progetto.

### Caso reale documentato

Serve per raccontare ciò che un'organizzazione dichiara di aver costruito, osservato o imparato. Un case study non è automaticamente un benchmark universale né prova causalità.

### Evidence di ricerca

Serve per risultati empirici e quantitativi. Popolazione, metodo, data e contesto restano parte del claim: un numero non viene trasferito automaticamente a ESI o a ogni team software.

## Cosa non è una fonte esterna

**Example Software Industries S.p.A. (ESI)**, Order Operations, Operations Desk Classic, Campaign Launchpad e Case Explanation Assistant sono scenari fittizi/compositi del libro.

I loro requisiti, SLO, RTO/RPO, WIP limit, blocker, capability level e decisioni non sono dati industriali. Servono a rendere concreti i trade-off.

La regola è:

```text
scenario ESI
+ proprietà tecniche supportate
+ decisione contestuale
≠ caso reale
```

## Evidence vocabulary

Quando il libro descrive lo stato di un artefatto o di una capability usa questa progressione:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Per la conoscenza legacy usa invece:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Le progressioni non sono scale di maturità industriali. Servono a impedire salti logici come:

```text
codice scritto
≠ comportamento verificato

IaC presente
≠ deployment verificato

backup configurato
≠ restore verificato

output strutturato valido
≠ risposta semanticamente corretta

seconda review AI
≠ evidence indipendente automaticamente
```

## Audit interni

Il repository contiene anche file di governance editoriale non destinati alla reading order, tra cui:

- `SOURCE_FACTUAL_AUDIT.md`;
- `reference/SOURCE_POLICY.md`;
- `reference/RESEARCH_WORKFLOW.md`;
- evidence audit dedicati per gruppi o capitoli ad alta densità di claim.

Questi documenti spiegano come sono stati controllati i claim, ma **non sono fonti per il lettore** e non vengono usati per sostenere tecnicamente le affermazioni del libro.

## Principio finale

> **Una citazione non rende vera una frase. Una buona fonte rende verificabile il ragionamento e ne mostra i limiti.**