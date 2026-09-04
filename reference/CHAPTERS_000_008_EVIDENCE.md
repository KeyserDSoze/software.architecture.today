# Evidence map — Capitoli 0–8

**Review date:** 2026-09-04  
**Scope:** pass retroattivo sui capitoli che in `SOURCE_FACTUAL_AUDIT.md` risultavano storicamente incompleti o parziali.  
**Status:** reviewed; nessun benchmark ESI promosso a dato industriale; nessun caso ESI trattato come caso reale.

Questo file è un audit editoriale interno e non entra nella reading order del libro. Le fonti qui raccolte sostengono claim esterni o delimitano correttamente il livello dei claim. Non trasformano una recommendation vendor, un case study o un'opinione professionale in una best practice universale.

## Capitolo 0 — Al timone

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| I coding agent possono ispezionare repository, eseguire comandi e interagire con tool di sviluppo. | OpenAI, *Running Codex safely at OpenAI*, 2026 — https://openai.com/index/running-codex-safely/ | Supporta la capability concreta; non implica permission o authorization automatiche. |
| Sandboxing, approval policy, network policy e telemetry sono control surface reali per agenti. | OpenAI, *Running Codex safely at OpenAI*, 2026 — https://openai.com/index/running-codex-safely/ | Coerente con `capability ≠ permission ≠ authorization ≠ autonomy` e con stop condition/evidence. |
| Repository instruction e verification path sono parte del contesto operativo di un coding agent. | OpenAI, *Introducing Codex*, 2025/2026 — https://openai.com/index/introducing-codex/ | Supporta il ruolo di repository, test e istruzioni; il modello operativo del libro resta una sintesi dell'autore. |
| L'AI tende ad amplificare il sistema di lavoro esistente più che sostituirlo. | DORA, *State of AI-assisted Software Development 2025* — https://dora.dev/research/2025/dora-report/ | Supporta la tesi di amplificazione; non prova da sola ogni formula editoriale del capitolo. |

## Capitolo 1 — Il software è cambiato. Il problema no.

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| I benefici percepiti dell'AI nello sviluppo variano per complessità del task, modalità d'uso e adozione del team. | Microsoft Research, *The SPACE of AI: Real-World Lessons on AI's Impact on Developers*, 2025 — https://www.microsoft.com/en-us/research/publication/the-space-of-ai-real-world-lessons-on-ais-impact-on-developers/ | Impedisce claim semplicistici del tipo “AI = produttività” in ogni contesto. |
| La produttività percepita è particolarmente evidente su task routinari, mentre l'impatto dipende anche dal contesto organizzativo. | Microsoft Research, stessa fonte; DORA 2025 — https://dora.dev/research/2025/dora-report/ | Supporta il focus del libro sul sistema di lavoro, non sul solo tool. |
| Coding agent moderni possono lavorare su task repository-level e produrre evidence di esecuzione. | OpenAI, *Introducing Codex* — https://openai.com/index/introducing-codex/ | Supporta l'aumento della capacità di execution; non equivale a production readiness. |

## Capitolo 2 — Prima del codice

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| Le decisioni architetturali dovrebbero partire dai bisogni di business e bilanciare requisiti funzionali e non funzionali. | Microsoft Azure Architecture Center, *Design Principles for Azure Applications* — https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/ | Supporta “prima capire, poi costruire” senza trasformare il framework Azure nel metodo del libro. |
| La comprensione del dominio richiede collaborazione fra esperti di dominio, architect, developer e stakeholder. | Microsoft Azure Architecture Center, *Use Domain Analysis to Model Microservices* — https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis | Supporta l'analisi funzionale come competenza condivisa; non elimina ruoli specialistici. |
| Il linguaggio condiviso riduce ambiguità fra conversazioni, documentazione e codice. | Microsoft Azure Architecture Center, stessa fonte. | Supporta il principio di comprensione condivisa; non impone DDD a ogni sistema. |

## Capitolo 3 — Pensare per sistemi

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| Reliability, performance, maintainability ed evoluzione sono proprietà interconnesse e vanno valutate insieme ai bisogni di business. | Microsoft Azure Architecture Center, *Design Principles for Azure Applications* — https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/ | Supporta il systems thinking; gli specifici modelli mentali del capitolo restano sintesi dell'autore. |
| L'analisi dei failure mode va fatta durante architecture/design, non solo dopo l'incidente. | Microsoft Azure Architecture Center, stessa fonte. | Supporta il passaggio da happy path a sistema e conseguenze. |
| Le scelte architetturali richiedono fattori di valutazione espliciti come costo, reliability, security e performance. | AWS Well-Architected, *Evaluate how trade-offs impact customers and architecture efficiency* — https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html | Supporta la lettura multi-dimensionale, non una checklist universale. |

## Capitolo 4 — Che cos'è davvero Software Architecture

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| Un ADR registra decisioni significative, alternative escluse, contesto, motivazioni e implicazioni. | Microsoft Azure Well-Architected Framework, *Manage an architecture decision record* — https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record | Supporta l'ADR come record di decisioni architetturali significative. |
| Non ogni scelta merita un ADR: il focus è su struttura, quality attribute e scelte difficili da invertire. | Microsoft Azure Well-Architected Framework, stessa fonte. | Coerente con il principio del libro “architecture come sistema di decisioni”, non come collezione di documenti. |
| L'evoluzione richiede boundary, API e decisioni capaci di cambiare nel tempo. | Microsoft Azure Architecture Center, *Design Principles for Azure Applications* — https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/ | Supporta reversibility/evolution; non promuove un unico stile. |

## Capitolo 5 — Dalle feature ai confini

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| I boundary dei servizi non si ricavano con un processo meccanico: richiedono dominio, requisiti, architecture characteristics e obiettivi. | Microsoft Azure Architecture Center, *Use Domain Analysis to Model Microservices* — https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis | Supporto diretto alla tesi “feature ≠ boundary”. |
| Bounded context e ubiquitous language servono a rendere espliciti modelli e significati locali. | Microsoft Azure Architecture Center, stessa fonte. | Usati come strumenti concettuali, non come religione DDD. |
| I confini vanno riesaminati durante l'evoluzione del workload. | Microsoft Azure Architecture Center, stessa fonte. | Supporta boundary come decisioni evolutive, non verità scoperte una volta sola. |

## Capitolo 6 — Qualità prima della tecnologia

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| Requisiti e obiettivi devono precedere la selezione di servizi e architetture. | Microsoft Azure Architecture Center, *Design Principles for Azure Applications* — https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/ | Supporta “quality before technology”. |
| I trade-off vanno valutati rispetto a workload requirements, customer impact, cost, reliability, security e performance. | AWS Well-Architected, *Evaluate how trade-offs impact customers and architecture efficiency* — https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html | Supporta “trade-off ≠ scorciatoia” e la necessità di criteri espliciti. |
| La soluzione ottimale varia per workload e può combinare approcci differenti. | AWS Well-Architected, *Architecture selection* — https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/architecture-selection.html | Supporto diretto a “fit before fashion”; nessun tool è dichiarato migliore in assoluto. |

## Capitolo 7 — Pattern senza religione

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| La selezione architetturale dipende dal workload e richiede valutazione data-driven dei trade-off. | AWS Well-Architected, *Architecture selection* — https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/architecture-selection.html | Supporta pattern come opzioni, non come requisiti. |
| I microservizi introducono benefici e nuove complessità operative/distributive. | Microsoft Azure Architecture Center, *Microservices architecture style* — https://learn.microsoft.com/en-us/azure/architecture/microservices/ | Supporta la necessità di fit e prerequisiti; non implica che i microservizi siano il default corretto. |
| La progettazione dei servizi parte da capacità di business e bounded context, non dal desiderio di applicare un pattern. | Microsoft Azure Architecture Center, *Use Domain Analysis to Model Microservices* — https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis | Coerente con “problem/purpose before pattern”. |

## Capitolo 8 — Il monolite non è il nemico

| Claim / area | Evidence | Decisione editoriale |
| --- | --- | --- |
| Un monolite può restare una scelta valida in alcuni casi; prima di decomporre va compreso business use case, tecnologia e dipendenze. | AWS Prescriptive Guidance, *Decomposing monoliths into microservices* — https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/ | Supporta la distinzione “monolith ≠ bad architecture”. La stessa guida resta generalmente favorevole alla decomposizione per molte applicazioni moderne. |
| Spezzare in servizi più piccoli può aumentare latenza, difficoltà di debugging e burden operativo; la segmentazione va bilanciata con la complessità introdotta. | AWS Well-Architected, *Choose how to segment your workload* — https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_service_architecture_monolith_soa_microservice.html | Supporta una decisione basata su trade-off, non un dogma monolith-first o microservices-first. |
| “Monolith First” è una posizione professionale argomentata, fondata soprattutto su esperienza/aneddoti e non su benchmark universali. | Martin Fowler, *Monolith First*, 2015 — https://martinfowler.com/bliki/MonolithFirst.html | Fonte secondaria/opinion esplicitamente classificata come tale. Utile come contro-narrativa, non come standard. |

## Esito del pass

- Capitoli 0–8: evidence pass retroattivo completato a livello di claim esterni principali.
- I principi normativi del libro sono mantenuti come tesi dell'autore, non camuffati da risultati sperimentali.
- Le capability degli agenti sono documentate con fonti correnti OpenAI quando il testo parla di comportamento concreto dei coding agent.
- I claim architetturali sono supportati principalmente da Microsoft Learn/Azure Architecture Center e AWS Well-Architected/Prescriptive Guidance, mantenendo esplicito il loro status di guidance.
- Fowler è usato soltanto dove il valore è storico/argomentativo e viene classificato come fonte secondaria/opinion.
- Nessun numero ESI è stato usato come benchmark industriale.
- Nessuna evidence ESI è stata promossa oltre lo stato dichiarato nel capstone.
