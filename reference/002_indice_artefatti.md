# Indice degli artefatti operativi

Il libro introduce artefatti per rendere **decisioni, confini, delega ed evidence verificabili**. Non sono moduli burocratici da compilare tutti: ciascuno ha valore soltanto quando riduce un rischio o un'ambiguità reale.

Questa pagina serve come mappa di consultazione. Il capitolo indicato è il punto principale in cui l'artefatto viene costruito o reso operativo; nei capitoli successivi può essere esteso.

| Artefatto | Capitolo principale | A che cosa serve |
| --- | ---: | --- |
| **Problem & Outcome Brief** | 2 | Separare problema, utenti, outcome, scope, vincoli, assunzioni e decisioni ancora aperte dalla soluzione tecnica. |
| **Functional Scope Map** | 2 | Rendere visibili attori, journey, comportamenti, stati, eccezioni e confini funzionali condivisi. |
| **Architecture Context Map** | 3 | Mostrare system of interest, dipendenze, boundary, feedback loop e failure domain rilevanti. |
| **Architecture Decision Record (ADR)** | 4 | Registrare una decisione architetturalmente significativa, le alternative, le forze, il costo accettato e i trigger di revisione. |
| **Component Responsibility Map** | 5 | Esplicitare responsabilità, information hiding, ownership e confini di collaborazione. |
| **Non-Functional Requirements Card** | 6 | Trasformare aggettivi come “veloce”, “sicuro” o “resiliente” in proprietà decisionabili e verificabili. |
| **Pattern Justification** | 7 | Collegare un pattern alle forze che lo rendono utile, alle conseguenze e alle condizioni che ne invaliderebbero il fit. |
| **API Contract** | 9 | Governare semantica, error model, side effect, compatibility, authorization, idempotency e failure behavior di un'interfaccia. |
| **Data Ownership Map** | 10 | Distinguere ownership tecnica, source of truth, semantic authority, replica e lifecycle dei dati. |
| **Failure Mode Map** | 11 | Collegare failure, impatto, detection, containment, recovery, owner ed evidence. |
| **Cloud Deployment Map** | 12 | Rendere espliciti runtime, topology, identity, networking, data service, dependency e deployment boundary. |
| **Threat Model** | 13 | Collegare asset, trust boundary, attacker path, threat, controllo ed evidence di sicurezza. |
| **Observability Contract** | 15 | Collegare journey, SLI/SLO, failure mode, signal, alert, owner, retention e verification. |
| **Testing Strategy** | 16 | Collegare rischi e proprietà ai layer di test, ai gate, agli ambienti, alla test-data policy e alla manutenzione della suite. |
| **Legacy Understanding Map** | 17 | Separare ciò che è Found, Inferred, Observed e Confirmed prima di trasformare comportamento legacy in requisito. |
| **Refactoring Safety Plan** | 18 | Definire seam, invarianti, characterization, rollout, rollback, comparison ed exit criteria per cambiamenti ad alto blast radius. |
| **Architecture Fitness Checklist** | 19 | Proteggere proprietà architetturali durante l'evoluzione con controlli ripetibili e trigger di revisione. |
| **Cost Model** | 20 | Collegare cost driver, unit economics, TCO, sensitività, ownership e decisioni tecniche. |
| **Repository Map** | 21 | Rendere il repository navigabile da persone e agenti: source of truth, boundary, comandi, documenti e verification path. |
| **Execution Work Item** | 22 | Trasformare issue e task in contratti di execution con outcome, scope, acceptance, evidence e stop condition. |
| **Agent Delegation Contract** | 23 | Definire obiettivo, contesto, permessi, confini, stop condition e output attesi per lavoro delegato a un agente. |
| **Agent Verification Bundle** | 23 | Raccogliere evidence sufficiente a verificare il lavoro delegato senza rifarlo integralmente. |
| **AI Autonomy Matrix** | 23 | Collegare classe di rischio, permission, approval, autonomia, verification ed escalation. |
| **AI Feature Contract** | 24 | Separare model boundary, grounding, tool, authority, structured output, fallback, eval e runtime observability di una capability AI. |
| **One-Man Project Operating Model** | 25 | Governare leverage individuale, WIP, specialist gate, continuità, secondary maintainer ed evidence. |
| **Production Readiness Review (PRR)** | 26 | Rendere espliciti launch boundary, blocker, rischio accettato, evidenza mancante, owner e decisione GO/NO-GO. |
| **End-to-End Decision Trace** | 27 | Ricostruire come problema, trade-off, artifact, implementazione ed evidence hanno portato allo stato corrente. |
| **Architect Capability Map** | 28 | Discutere functional literacy, profondità tecnica, systems thinking, governance, economics, AI/agent capability e specialist trigger senza ridurre la crescita a una certificazione. |

## Come usarli

Tre regole evitano che gli artefatti diventino burocrazia:

1. **L'artefatto segue il rischio.** Se non protegge una decisione, un confine o una proprietà importante, probabilmente non serve.
2. **Il documento non è evidence dell'outcome.** Un PRR scritto non rende il sistema production-ready; un Threat Model non dimostra che i controlli funzionino; una Testing Strategy non equivale a una suite efficace.
3. **Gli artefatti devono poter morire o cambiare.** Quando il contesto cambia, vanno revisionati, sostituiti o rimossi invece di diventare autorità storica per inerzia.

Nel capstone ESI molti di questi artefatti hanno una controparte concreta sotto `capstone/example-software-industries/`.