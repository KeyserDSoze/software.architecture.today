# Order Operations — Requirements Snapshot

> Stato corrente dei requisiti del capstone simulato/composito di Example Software Industries S.p.A.

Questo documento non sostituisce l'analisi funzionale. Riassume i requisiti che, fino a questo punto del libro, influenzano concretamente design e architettura.

## Problema

Gli operatori impiegano troppo tempo a individuare ordini che richiedono attenzione e a capire quale parte del processo sta causando il problema.

## Outcome iniziale

Ridurre il tempo necessario per:

1. individuare un ordine problematico;
2. comprenderne la causa principale;
3. decidere se intervenire, attendere o escalare.

## Contesto ESI

Order Operations appartiene a Commerce & Operations ma dipende da capability e vincoli che attraversano altri domini aziendali.

In particolare:

- Payments & Risk possiede o governa semantiche economiche rilevanti;
- Platform Engineering fornisce capability condivise senza possedere il dominio;
- Security e Legal/Compliance possono introdurre quality floor non negoziabili;
- Finance/FinOps può influenzare il costo accettabile della soluzione.

## In scope

- vista degli ordini problematici;
- dettaglio operativo dell'ordine;
- distinzione tra stato ordine, pagamento e spedizione;
- visibilità della causa principale nota;
- accesso controllato per operatori interni;
- integrazione con i dati autorevoli necessari al journey.

## Out of scope corrente

- portale self-service per merchant;
- automazione completa delle remediation;
- workflow regolamentato di case management;
- audit immutabile multi-anno;
- active-active multi-region;
- event sourcing;
- microservizi per ogni capability;
- AI decisionale sul trattamento degli ordini.

L'out of scope non è una promessa eterna. È lo stato attuale del contesto.

## Functional requirements

### FR-001 — Lista ordini problematici

Un operatore autorizzato può visualizzare gli ordini che soddisfano almeno una regola funzionale di problematicità.

### FR-002 — Identificazione della causa

Per ogni ordine il sistema mostra informazioni sufficienti a distinguere almeno problemi legati a:

- ordine;
- pagamento;
- spedizione.

### FR-003 — Dettaglio operativo

L'operatore può aprire il dettaglio di un ordine e consultare le informazioni necessarie all'investigazione.

### FR-004 — Source authority

Il sistema deve distinguere i dati autorevoli dai dati derivati o aggregati.

### FR-005 — Access control

Le funzionalità operative sono disponibili soltanto ad attori autorizzati.

### FR-006 — Stato leggibile

Gli stati funzionali devono essere espressi con termini comprensibili nel dominio, evitando di esporre direttamente dettagli tecnici quando non rappresentano il significato business.

## Acceptance evidence iniziale

- test sui criteri di classificazione degli ordini problematici;
- test sui principali state combination;
- test di autorizzazione;
- test di integrazione con le fonti dati necessarie;
- verifica che un ordine mostrato possa essere ricondotto ai dati autorevoli;
- scenario end-to-end del critical user journey.

## Assunzioni correnti

- il prodotto è inizialmente uno strumento interno;
- il volume è compatibile con una soluzione semplice senza infrastruttura di caching dedicata;
- non esiste ancora un requisito che imponga consistenza asincrona o read model separato;
- il team può operare un modular monolith con database relazionale;
- non esiste ancora un requisito organizzativo che richieda deploy indipendenti per Orders, Payments e Shipping.

## Decisioni aperte

- definizione definitiva di “problematic order”;
- semantica delle future azioni correttive;
- necessità di assignment dei casi;
- audit delle azioni;
- priorità/severity;
- eventuale aggiornamento push vs refresh/polling;
- comportamento in presenza di fonti esterne indisponibili;
- eventuali trigger per introdurre un read model;
- confine di responsabilità fra Commerce & Operations e Payments & Risk per refund e retry;
- requisiti futuri introdotti da Security, Compliance o clienti enterprise.

## Traceability

Questo snapshot deriva dal percorso narrativo dei capitoli:

- Capitolo 2 — problem framing, functional analysis e acceptance criteria;
- Capitolo 3 — system context e critical user journey;
- Capitolo 4 — ADR sul lookup live;
- Capitolo 5 — ownership e responsibility boundary;
- Capitolo 6 — NFR;
- Capitolo 7 — pattern selection;
- Capitolo 8 — modular monolith e topology decision;
- Capitolo 9 — API contract.

Quando un capitolo cambia un requisito, questo documento deve essere aggiornato insieme al codice e agli altri artefatti.