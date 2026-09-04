# Glossario

Questo glossario raccoglie i termini che nel libro hanno un significato operativo preciso. Non sostituisce i capitoli in cui vengono introdotti: serve a ritrovare rapidamente la distinzione che conta quando una parola viene riutilizzata più avanti.

## Accountability

Responsabilità ultima per una decisione e per le sue conseguenze. Può essere supportata da automazione, review e delega, ma non trasferita implicitamente alla frase “lo ha fatto l'AI”.

## Agent

Sistema software capace di eseguire più passi, usare strumenti e modificare artefatti in funzione di un obiettivo e di un contesto. Nel libro `capability`, `permission`, `authorization` e `autonomy` restano concetti distinti.

## Agent Delegation Contract

Artefatto che rende espliciti obiettivo, contesto, confini, permessi, stop condition, output ed evidence attesi da un task delegato a un agente.

## Agent Verification Bundle

Insieme di evidence prodotto o raccolto per permettere a un reviewer di verificare il lavoro delegato senza rieseguirlo integralmente a mano.

## AI Autonomy Matrix

Mappa che collega classe di rischio, capability dell'agente, permission, approval, autonomia concessa, verification ed escalation. È un costrutto operativo del libro, non uno standard industriale.

## AI Feature Contract

Contratto di una capability AI che separa model boundary, grounding, tool, authority, structured output, fallback, evaluation e runtime observability dal resto dell'applicazione.

## AI-ready repository

Repository in cui persone e agenti possono ricostruire contesto, source of truth, boundary, comandi, vincoli, verification path e stop condition senza dipendere dalla memoria privata di una sola persona o da una chat precedente.

## API Contract

Descrizione del significato di un'interfaccia oltre la sola forma dello schema: semantica, errori, side effect, authorization, compatibility, idempotency e failure behavior.

## Architecture

Sistema di decisioni significative che rende espliciti boundary, ownership, trade-off, quality attribute, costi, failure mode, evolution path ed evidence. Non coincide con un diagramma né con uno specifico stile architetturale.

## Architecture Decision Record — ADR

Record di una decisione architetturalmente significativa: contesto, forze, alternative, scelta, conseguenze, evidence e trigger di revisione. Il documento non rende automaticamente corretta la decisione.

## Authority

Diritto riconosciuto a stabilire una verità o prendere una decisione in un certo dominio. Una copia di un dato non trasferisce automaticamente la semantic authority.

## Authorization

Decisione che stabilisce se un attore o agente sia autorizzato a compiere una certa azione in uno specifico contesto. È distinta dalla semplice capacità tecnica di eseguirla.

## Blast radius

Perimetro delle conseguenze che un errore o una modifica può produrre. Nel libro è principalmente **semantico**: una riga può avere blast radius enorme, mentre una trasformazione meccanica molto ampia può essere relativamente sicura.

## Boundary

Confine entro cui responsabilità, dati, regole o ownership vengono governati in modo coerente. Un boundary concettuale non implica automaticamente un servizio distribuito.

## Capability

Ciò che una persona, un sistema o un agente è tecnicamente in grado di fare. `Capability` non implica `permission`, `authorization` o `authority`.

## Codified

Stato in cui una decisione, un controllo o una proprietà è stata tradotta in codice, configurazione, test, policy o documento eseguibile/operativo. `Codified` non significa ancora `Verified`.

## Confirmed

Per la conoscenza legacy, stato in cui un comportamento osservato è stato accettato come requisito o verità target da una fonte autorizzata. `Observed` non implica `Confirmed`.

## Context engineering

Progettazione del contesto operativo che permette a persone e agenti di lavorare correttamente: repository, documenti, contratti, issue, test, tool, permission boundary, source of truth e gerarchia delle fonti. È più ampio del prompt engineering.

## Designed

Stato in cui una proprietà, una decisione o un controllo è stato definito intenzionalmente ma non necessariamente implementato o verificato.

## Error budget

Quantità di inaffidabilità compatibile con un SLO in un periodo definito. Nel libro serve come strumento decisionale e di governance, non come giustificazione automatica per consumare tutto il budget disponibile.

## Evidence

Informazione osservabile e pertinente che sostiene un claim. Deve essere proporzionata alla proprietà promessa: il tipo di prova conta quanto il suo esito.

## Execution

Trasformazione di una decisione o intenzione in artefatti e azioni concrete: codice, test, configurazioni, migration, documenti, deployment o attività operative. Il libro distingue execution da judgment e accountability.

## Failure domain

Porzione del sistema che può fallire insieme a causa di una dipendenza, risorsa o modalità di guasto condivisa. Non coincide necessariamente con un servizio o un deployment unit.

## Failure mode

Modo concreto in cui un sistema, un processo o una decisione può fallire rispetto a una proprietà rilevante.

## Fitness function

Controllo automatizzato o ripetibile che protegge una proprietà architetturale durante l'evoluzione. Una fitness function verde verifica soltanto ciò che è realmente capace di osservare.

## Found

Per la conoscenza legacy, stato minimo: un comportamento, una regola o un indizio è stato individuato in codice, configurazione, log, documentazione o pratica operativa, ma il suo significato non è ancora stabilito.

## Functional analysis

Comprensione strutturata di attori, journey, stati, transizioni, business rule, invariant, exception, ownership e authority. Può avere specialisti; la comprensione del prodotto non può avere un unico proprietario.

## Grounding

Collegamento dell'output di un sistema AI a fonti o dati contestuali pertinenti. Grounding non significa automaticamente RAG, vector database, factual correctness o semantic authority.

## Guardrail

Meccanismo che riduce la probabilità o il blast radius di una decisione indesiderata: policy, test, permission, budget, approval, type system, fitness function, rollout limit, stop condition o altra barriera verificabile.

## Idempotency

Proprietà per cui ripetere la stessa richiesta o operazione con la stessa identità non produce effetti business aggiuntivi indesiderati. È particolarmente importante quando retry e duplicate delivery sono possibili.

## Inferred

Per la conoscenza legacy, stato in cui il significato di un comportamento è stato dedotto da evidence disponibili ma non ancora osservato direttamente o confermato da un'autorità competente.

## Invariant

Proprietà che deve restare vera attraverso transizioni e casi limite rilevanti. È più forte di una descrizione generica del comportamento desiderato.

## Judgment

Capacità di scegliere e governare trade-off sotto vincoli, rischio e informazione incompleta. Nel libro è il complemento della crescente abbondanza di execution.

## Monitored

Livello di evidence in cui una proprietà rilevante produce signal runtime osservabili e governati. `Verified` non implica `Monitored`.

## Observability

Capacità di ricostruire lo stato e il comportamento rilevante di un sistema a partire dai segnali che produce. Non coincide con “avere dashboard” o con la semplice raccolta di log.

## Observed

Per la conoscenza legacy, stato in cui un comportamento è stato visto in execution, test, dati o ambiente reale. Essere osservato non lo rende automaticamente requisito target.

## One-Man Project

Operating model del libro in cui una persona può governare una porzione di execution molto ampia grazie ad agenti e automazione, mantenendo specialist gate, secondary maintainer, continuità ed evidence. Non significa “una persona sostituisce un team” né costituisce una raccomandazione universale di staffing.

## Outcome

Cambiamento utile ottenuto nel sistema o nel comportamento degli utenti. Si distingue dagli output prodotti per perseguirlo: codice, documenti, test, ADR e agent run.

## Ownership

Responsabilità operativa o decisionale esplicita su una capability, un dato, un artefatto o un rischio. Shared infrastructure non implica shared semantic ownership.

## Permission

Facoltà tecnica concessa a un attore o agente di usare una risorsa o compiere un'azione. Una permission disponibile non implica che l'azione sia autorizzata nel contesto corrente.

## Production readiness

Stato in cui il rischio residuo di una release è sostenuto da evidence, ownership e procedure adeguate al contesto. Non è una proprietà del solo codice e non deriva dall'esistenza di un documento PRR.

## Production Readiness Review — PRR

Review che rende espliciti launch boundary, blocker, rischio accettato, evidence mancante, ownership e decisione GO/NO-GO. Un PRR verde è utile soltanto quanto le evidence che valuta.

## Quality attribute

Proprietà osservabile o verificabile che descrive *come* il sistema deve comportarsi: reliability, security, performance, operability, evolvability e simili. Aggettivi vaghi non sono requisiti finché non diventano decisionabili e verificabili.

## Quality floor

Limite minimo che un trade-off non può violare senza una decisione esplicita di rischio. Serve a distinguere il compromesso consapevole dalla scorciatoia inconsapevole.

## RPO — Recovery Point Objective

Perdita massima di dati accettabile espressa come punto temporale o intervallo. Un backup configurato non dimostra il rispetto dell'RPO: serve evidence sul comportamento reale di protezione e ripristino.

## RTO — Recovery Time Objective

Tempo massimo accettabile per ripristinare una capability dopo un failure definito. Un meccanismo di failover o un runbook non dimostrano da soli il rispetto dell'RTO: serve un drill o altra evidence adeguata.

## Semantic authority

Fonte o owner autorizzato a stabilire il significato di un dato o di una regola di business. Possedere una replica tecnica non equivale a possederne la verità semantica.

## SLI — Service Level Indicator

Misura osservabile di una proprietà di servizio rilevante per l'utente o l'operazione, per esempio successful request ratio o latency di un journey definito.

## SLO — Service Level Objective

Target associato a uno SLI in una finestra temporale definita. Nel libro gli SLO dello scenario ESI sono requisiti simulati, non benchmark industriali.

## Specialist gate

Condizione che richiede il coinvolgimento o l'autorità di uno specialista prima di proseguire, per esempio su security, privacy, pagamenti, dati, legal/compliance o un'altra area ad alto rischio. L'AI può supportare la preparazione; non annulla il bisogno di authority competente.

## Stop condition

Condizione che interrompe execution o autonomia e richiede escalation, revisione o nuova autorizzazione. È parte del design di un workflow agentico, non un'eccezione imbarazzante.

## Trade-off

Accettazione consapevole di un costo per ottenere un beneficio prioritario. Non è un sinonimo elegante di scorciatoia.

## Verified

Stato in cui una proprietà o un claim è sostenuto da evidence adeguata al livello dichiarato. È sempre necessario specificare **che cosa** è stato verificato: compilation, contract, behavior, environment, recovery, model quality e produzione richiedono evidence differenti.

## Verification without re-execution

Strategia in cui reviewer e governor usano contract, invariant, test, static analysis, diff, observability, fitness function ed evidence bundle per verificare lavoro delegato senza rifarlo integralmente a mano.

## Workload

Sistema o capability considerati insieme al loro contesto operativo, ai requisiti, ai dati, ai failure mode e alle responsabilità che ne determinano il fit architetturale.