# Glossario

Questo glossario raccoglie i **termini tecnici, operativi, architetturali e agentici ricorrenti** usati nel libro. Include acronimi, pattern, proprietà, failure concept e artefatti introdotti lungo i Capitoli 0–30.

Non sostituisce le spiegazioni complete nei capitoli e non prova a trasformare ogni nome di prodotto o tecnologia citata in una voce enciclopedica. Serve invece a permettere al lettore di ritrovare rapidamente **che cosa significa un termine nel contesto del libro, quale distinzione protegge e quale errore evita**.

## A

**Accepted Risk / rischio accettato** — Rischio residuo che una persona o funzione con l'autorità appropriata decide esplicitamente di accettare entro un boundary e un periodo definiti. Non è un blocker semplicemente rinominato per rispettare una data.

**Acceptance criterion / criterio di accettazione** — Proprietà osservabile che deve risultare vera perché un task o una capability possa essere considerata accettata. È distinto dal comando o dal test usato per verificarla.

**Accountability** — Responsabilità ultima per una decisione e per le sue conseguenze. Può essere supportata da automazione, review e delega, ma non trasferita implicitamente alla frase “lo ha fatto l'AI”.

**Active-active** — Configurazione in cui più istanze, zone o regioni servono traffico contemporaneamente. Può aumentare disponibilità o capacità, ma introduce costi di consistency, routing, failure handling e operabilità.

**ADR — Architecture Decision Record** — Record di una decisione architetturalmente significativa: contesto, forze, alternative, scelta, conseguenze, evidence e trigger di revisione. Il documento non rende automaticamente corretta la decisione.

**Agent / agente AI** — Sistema software che usa un modello per perseguire un obiettivo attraverso più passi e, in alcuni casi, tool o azioni. Nel libro `capability`, `permission`, `authorization`, `authority` e `autonomy` restano concetti distinti.

**Agent Delegation Contract** — Artefatto che rende espliciti obiettivo, contesto, scope, out of scope, permessi, stop condition, output ed evidence attesi da un task delegato a un agente.

**Agent run** — Singola esecuzione tracciabile di un workflow agentico, comprensiva di input, context, tool call, decisioni, handoff, approval, evidence e outcome.

**Agent Verification Bundle** — Insieme di evidence prodotto o raccolto per permettere a un reviewer di verificare il lavoro delegato senza rieseguirlo integralmente a mano.

**AI Autonomy Matrix** — Mappa che collega classe di rischio e capability dell'agente a permission, approval, autonomia, verification ed escalation. È un costrutto operativo del libro, non uno standard industriale.

**AI Feature Contract** — Contratto di una capability AI runtime che separa model boundary, authority, grounding, retrieval, tool, structured output, fallback, evaluation, security, observability e costi dal resto dell'applicazione.

**AI-ready repository** — Repository in cui persone e agenti possono ricostruire contesto, source of truth, boundary, comandi, vincoli, verification path e stop condition senza dipendere dalla memoria privata di una sola persona o da una chat precedente.

**Alert** — Notifica operativa generata quando un signal supera una condizione che richiede attenzione o azione. Un alert utile deve avere owner, contesto e una prima azione ragionevole.

**Alert fatigue** — Riduzione dell'attenzione causata da troppi alert rumorosi, poco azionabili o ripetitivi. È un failure mode del sistema di operabilità, non soltanto un problema di UX della dashboard.

**Anti-Corruption Layer — ACL** — Strato di traduzione che protegge un modello o boundary nuovo dalla semantica di un sistema legacy o esterno. Riduce contaminazione concettuale ma introduce una responsabilità di mapping da mantenere.

**API — Application Programming Interface** — Interfaccia attraverso cui un consumer interagisce con una capability. Nel libro l'API non coincide con una lista di endpoint: include semantica, errori, authorization, compatibility e side effect.

**API Contract** — Descrizione del significato di un'interfaccia oltre la sola forma dello schema: input, output, errori, side effect, authorization, compatibility, idempotency e failure behavior.

**Architecture / architettura** — Sistema di decisioni significative che rende espliciti boundary, ownership, trade-off, quality attribute, costi, failure mode, evolution path ed evidence. Non coincide con un diagramma né con uno specifico stile architetturale.

**Architecture Context Map** — Artefatto che rappresenta sistema, actor, journey, dipendenze, boundary, ownership, failure domain e constraint rilevanti prima di scegliere una soluzione dettagliata.

**Architecture drift** — Scostamento progressivo fra l'intento architetturale e il sistema reale. Può derivare da implementation drift o da context drift e non è automaticamente sinonimo di evoluzione intenzionale.

**Architecture exception / waiver** — Deviazione esplicita e temporanea da una regola architetturale, con motivo, rischio, owner, expiry o removal condition. Un'eccezione senza governance tende a diventare nuova normalità implicita.

**Architecture Fitness Checklist** — Portfolio degli elementi che un workload ha deciso di proteggere attraverso property, risk, mechanism, evidence, owner, failure action e review trigger. Non è un catalogo enterprise di tecnologie obbligatorie.

**Architecture test** — Test automatizzato che verifica una proprietà strutturale o architetturale del sistema, per esempio dipendenze proibite o boundary. È una possibile fitness function, non la sola.

**Architecturally Significant Requirement — ASR** — Requisito o vincolo capace di influenzare in modo materiale struttura, tecnologia, distribuzione, dati, operabilità o rischio del sistema.

**Authentication / autenticazione** — Processo che stabilisce chi o che cosa sta presentando un'identità. Non risponde da sola alla domanda se quell'identità possa compiere una specifica azione.

**Authority / autorità** — Diritto riconosciuto a stabilire una verità o prendere una decisione in un certo dominio. Una copia di un dato o un output del modello non trasferiscono automaticamente authority.

**Authorization / autorizzazione** — Decisione che stabilisce se un attore o agente sia autorizzato a compiere una certa azione in uno specifico contesto. È distinta dalla semplice capacità tecnica di eseguirla.

**Autoscaling** — Variazione automatica della capacità in risposta a metriche o condizioni. Può migliorare elasticità, ma non sostituisce capacity planning, backpressure o un corretto failure model.

**Availability / disponibilità** — Proprietà che descrive quando una capability è utilizzabile dal consumer secondo un boundary definito. Non significa “non deve mai andare giù”.

## B

**Backpressure** — Meccanismo con cui un sistema limita o rallenta la produzione di lavoro quando il consumer o una dipendenza non riescono a sostenere il ritmo. Decide dove il sistema rallenta prima di saturare.

**Backup** — Copia dei dati destinata alla protezione e al recupero. Avere backup configurati non dimostra che restore, RPO o RTO siano realmente soddisfatti.

**Baseline** — Punto di confronto corrente o semplice contro cui valutare una modifica, una performance, un modello o una strategia.

**Behavior fallback** — Ritorno al comportamento precedente o a un percorso alternativo quando una nuova capability non è utilizzabile. È distinto dal rollback del deployment e dal rollback dei dati.

**Big-bang rewrite** — Sostituzione ampia di un sistema con un nuovo sistema costruito separatamente e attivato in un passaggio concentrato. Può accumulare migration risk e inseguire un target che cambia mentre il legacy resta vivo.

**Blast radius** — Perimetro delle conseguenze che un errore o una modifica può produrre. Nel libro è soprattutto semantico e operativo: poche righe possono avere un blast radius enorme.

**Blocker** — Condizione che impedisce di procedere entro il launch boundary o decision boundary corrente finché non viene chiusa con evidence o cambia esplicitamente la decisione.

**Branch by Abstraction** — Tecnica di modernizzazione/refactoring che introduce un'astrazione per consentire a implementazione vecchia e nuova di coesistere durante una migrazione incrementale.

**Brownfield** — Contesto in cui si modifica o modernizza un sistema esistente con behavior, dati, consumer, vincoli e dipendenze già presenti. Si contrappone a greenfield.

**Bulkhead** — Pattern di fault isolation che separa risorse o capacità per evitare che la saturazione o il failure di una parte consumino tutto il sistema.

**Bus factor / continuity risk** — Rischio che conoscenza, authority o capacità operative siano concentrate in troppo poche persone. Nel libro viene trattato come problema di continuity, non come battuta sul singolo esperto.

## C

**Cache** — Copia temporanea o derivata di dati usata per ridurre latency o carico. Introduce scelte su invalidation, freshness, consistency, ownership e failure behavior.

**Canary rollout** — Rilascio progressivo che espone una nuova versione a una quota limitata di traffico o utenti prima di ampliare il rollout sulla base di progression criteria ed evidence.

**Capability** — Ciò che una persona, un sistema o un agente è tecnicamente in grado di fare. `Capability` non implica `permission`, `authorization` o `authority`.

**CAP theorem** — Risultato sui sistemi distribuiti che riguarda il trade-off fra consistency e availability in presenza di network partition. Nel libro viene usato evitando la semplificazione “scegli due su tre” fuori contesto.

**Carrying cost** — Costo che una scelta, un debito o una complessità continua a generare nel tempo: manutenzione, coordinamento, incidenti, rallentamento o rischio.

**Characterization test** — Test che cattura il comportamento osservato di un sistema esistente prima di modificarlo. Protegge il comportamento attuale, ma non dichiara che sia corretto o desiderato nel target.

**Choreography / coreografia** — Coordinamento distribuito in cui componenti reagiscono a eventi senza un orchestratore centrale che governi l'intero workflow. Riduce centralizzazione ma può rendere più difficile ricostruire il processo globale.

**CI/CD — Continuous Integration / Continuous Delivery or Deployment** — Pipeline e pratiche che integrano, verificano e rilasciano cambiamenti in modo ripetibile. Una pipeline verde verifica soltanto i gate che contiene realmente.

**Circuit breaker** — Pattern di resilienza che interrompe temporaneamente chiamate verso una dipendenza che sta fallendo, evitando di continuare a spendere risorse in richieste probabilmente destinate al failure.

**Claim** — Affermazione che vogliamo sostenere su una proprietà, un comportamento o uno stato. Nel libro il claim deve essere proporzionato all'evidence disponibile.

**Claim-first verification** — Approccio in cui si parte da ciò che deve essere dimostrato e si sceglie l'evidence adatta, invece di partire dal fatto che “i test sono verdi”.

**Cloud Deployment Map** — Artefatto che rappresenta compute, data, networking, identity, ingress/egress, region, dependency e responsabilità del deployment cloud di un workload.

**Codemod** — Trasformazione di codice automatizzata e ripetibile, tipicamente basata sulla struttura sintattica. Ha fit elevato per trasformazioni meccaniche e limitato per decisioni semantiche.

**Codified** — Stato in cui una decisione, un controllo o una proprietà è stata tradotta in codice, configurazione, test, policy o documento operativo. `Codified` non significa ancora `Verified`.

**Cohesion / coesione** — Grado con cui responsabilità che cambiano insieme o servono lo stesso scopo sono mantenute vicine. Alta coesione non implica automaticamente un processo o deployment separato.

**Collision domain** — Insieme di file, schema, contract, decisioni, environment o verification oracle condivisi da task che potrebbero interferire se eseguiti in parallelo.

**Compatibility / compatibilità** — Capacità di una modifica di convivere con consumer, dati o versioni esistenti entro un boundary definito. Non coincide con il fatto che il nuovo codice compili.

**Compensation / compensazione** — Azione business o tecnica che corregge o controbilancia un effetto già avvenuto quando un rollback puro non è possibile o non è corretto.

**Component Responsibility Map** — Artefatto che esplicita responsabilità, boundary, dipendenze e ownership dei componenti per evitare che la struttura del codice sostituisca la comprensione del dominio.

**Confirmed** — Per la conoscenza legacy, stato in cui un comportamento osservato è stato accettato come requisito o verità target da una fonte autorizzata. `Observed` non implica `Confirmed`.

**Consistency / consistenza** — Proprietà che descrive quali relazioni tra dati o stati devono risultare coerenti e quando. La forza di consistency necessaria dipende dall'invariant e dal journey.

**Context drift** — Situazione in cui una decisione architetturale resta implementata correttamente ma i requisiti, il traffico, l'organizzazione, il rischio o il contesto che la rendevano valida sono cambiati.

**Context engineering** — Progettazione del contesto operativo che permette a persone e agenti di lavorare correttamente: repository, documenti, contratti, issue, test, tool, permission boundary, source of truth e gerarchia delle fonti. È più ampio del prompt engineering.

**Context fitness** — Verifica di proprietà meccaniche del layer di contesto, per esempio link canonical esistenti, comandi validi o repository map aggiornata. Non certifica automaticamente la correttezza semantica della documentazione.

**Contract test** — Test che verifica una promessa fra producer e consumer o fra boundary, per esempio schema, semantica o compatibility di un'interfaccia.

**Control plane** — Parte di un sistema che decide, configura o governa il lavoro eseguito dal data/execution plane. Nel One-Man Project l'attenzione e il judgment del lead funzionano spesso come control plane del lavoro agentico.

**Correlation / correlazione** — Collegamento fra segnali, request, trace o eventi che permette di ricostruire un journey o un incidente attraverso componenti diversi.

**Cost allocation** — Attribuzione dei costi a workload, team, tenant, capability o unità di valore. Diventa architectural concern quando influenza incentivi, ownership e decisioni di design.

**Cost driver** — Variabile che determina materialmente il costo: request, GB, tenant, token, region, retention, throughput, tool call o altra unità di consumo.

**Cost Model** — Artefatto che collega costi diretti e indiretti, driver, unit economics, premium architetturali, assumption, scenario, quality risk e review trigger.

**Cost per useful outcome** — Metrica economica che rapporta il costo del percorso completo a un risultato accettato o verificato, invece di fermarsi a metriche di consumo come costo per token.

**CQRS — Command Query Responsibility Segregation** — Separazione fra modello/percorso di scrittura e modello/percorso di lettura quando forze diverse lo giustificano. Non è una scelta obbligatoria per ogni sistema.

**Critical user journey** — Sequenza di interazioni o capability il cui comportamento conta materialmente per un outcome dell'utente o del business e che quindi merita requirement ed evidence espliciti.

**Cutover** — Momento o processo in cui traffico, ownership o comportamento passano dal percorso precedente a quello nuovo. Deve dichiarare precondition, evidence, fallback e point of no return.

## D

**Data Ownership Map** — Artefatto che esplicita chi possiede semanticamente dati e write authority, quali consumer esistono e dove vivono copie, derivazioni e boundary di accesso.

**Data rollback** — Ripristino o inversione dello stato dati dopo una modifica. Può essere molto più difficile del rollback del codice e in alcuni casi richiede forward repair o compensazione.

**Decision boundary** — Confine entro cui una decisione è già stata presa e l'execution può procedere senza inventare nuova semantica. Quando il task esce da quel boundary deve fermarsi o escalare.

**Decision throughput** — Quantità di decisioni significative che una persona o organizzazione riesce a comprendere, verificare e governare in un periodo. Può diventare il collo di bottiglia quando l'execution agentica cresce.

**Degraded mode** — Stato in cui una capability continua a offrire un sottoinsieme utile e dichiarato del servizio quando alcune dipendenze o proprietà non sono disponibili.

**Deliberate practice** — Pratica intenzionale in cui una competenza viene esercitata con difficoltà e feedback mirati. Nel libro serve a evitare che l'uso continuo dell'AI produca outsourced intuition.

**Dependency inversion** — Principio per cui il dominio o la logica ad alto livello non dipendono direttamente da dettagli infrastrutturali, ma da astrazioni coerenti con il proprio bisogno.

**Designed** — Stato in cui una proprietà, una decisione o un controllo è stato definito intenzionalmente ma non necessariamente implementato o verificato.

**Distributed monolith / monolite distribuito** — Sistema distribuito che conserva forte coupling fra componenti e paga costi di rete, deployment e operazioni senza ottenere vera autonomia o fault isolation.

**DNS — Domain Name System** — Sistema di risoluzione dei nomi usato anche come componente di routing e failover. Cambiarlo può essere una decisione operativa rilevante, non semplice configurazione cosmetica.

**Documentation laundering** — Failure mode in cui un'inferenza o una spiegazione generata viene scritta in documentazione e successivamente riletta come se fosse una fonte autorevole, perdendo provenance e grado di evidence.

**DR — Disaster Recovery** — Insieme di strategie e procedure per recuperare una capability dopo failure severi o perdita di un ambiente. Deve essere collegato a RTO/RPO e a evidence di restore/failover.

**Drift** — Cambiamento progressivo rispetto a un baseline o a un comportamento atteso. Nel libro il termine compare per architecture, model, context e configurazione e richiede sempre di specificare *che cosa* sta cambiando.

**Dual write** — Scrittura della stessa intenzione o informazione su due destinazioni durante una transizione. Può facilitare coexistence, ma senza idempotenza e reconciliation può aumentare il rischio.

**Durability** — Proprietà per cui dati o effetti confermati sopravvivono ai failure previsti dal sistema. Deve essere definita rispetto al boundary e alla classe di failure.

## E

**End-to-end test** — Test che attraversa più componenti o l'intero journey per verificare una proprietà integrata. Offre fidelity maggiore ma può costare di più e localizzare peggio il failure.

**End-to-End Decision Trace** — Vista sintetica che collega problem, outcome, functional scope, owner, quality floor, trade-off, decisione, failure mode, verification e production decision senza duplicare tutti gli artefatti sottostanti.

**Error budget** — Quantità di inaffidabilità compatibile con un SLO in un periodo definito. Serve come strumento decisionale e di governance, non come autorizzazione automatica a consumare tutto il budget.

**Event / evento** — Rappresentazione di un fatto già avvenuto e rilevante per altri componenti. Si distingue da un command, che esprime un'intenzione di eseguire un'azione.

**Eventual consistency** — Modello in cui repliche o viste possono divergere temporaneamente ma convergere secondo regole definite. È utile soltanto se il business può tollerare quella finestra e i relativi failure mode.

**Evidence** — Informazione osservabile e pertinente che sostiene un claim. Deve essere proporzionata alla proprietà promessa: il tipo di prova conta quanto il suo esito.

**Evidence laundering** — Trasformazione di evidence debole, indiretta o scaduta in una conclusione più forte di quanto autorizzi, per esempio trattare “documento esistente” come prova di behavior runtime verificato.

**Execution** — Trasformazione di una decisione o intenzione in artefatti e azioni concrete: codice, test, configurazioni, migration, documenti, deployment o attività operative. Il libro distingue execution da judgment e accountability.

**Execution Work Item** — Istanza concreta di lavoro execution-ready con problem, outcome, scope, acceptance, verification, constraint, stop condition ed evidence attesa.

**Expected Difference Registry** — Registro delle differenze intenzionali e autorizzate fra comportamento legacy e candidate durante shadow comparison o migrazione. Serve a distinguere evoluzione voluta da regressione.

**Exit trigger / exit criterion** — Condizione che indica quando un operating model, una fase, un esperimento o una strategia deve terminare o essere rivalutata.

## F

**Failover** — Passaggio del servizio o del traffico verso una risorsa alternativa dopo failure o degrado. Un failover configurato non dimostra da solo che RTO/RPO siano rispettati.

**Failure domain** — Porzione del sistema che può fallire insieme a causa di una dipendenza, risorsa o modalità di guasto condivisa. Non coincide necessariamente con un servizio o un deployment unit.

**Failure mode** — Modo concreto in cui un sistema, un processo o una decisione può fallire rispetto a una proprietà rilevante.

**Failure Mode Map** — Artefatto che collega failure, impatto, detection, containment, recovery, owner, evidence e decisioni di design per rendere il comportamento distribuito discutibile prima dell'incidente.

**Fallback** — Percorso alternativo usato quando la capability preferita non è disponibile o non produce output accettabile. Deve dichiarare quale qualità degrada e quale resta protetta.

**Fan-out** — Avvio parallelo di più task, request o agenti a partire da un input comune. Parallelizzare prima di aver chiuso le decisioni condivise può moltiplicare lo stesso errore.

**Feature flag** — Meccanismo che abilita, disabilita o instrada comportamento senza necessariamente cambiare il deployment. È utile per rollout e fallback, ma non risolve automaticamente migration o rollback dati.

**Fitness function** — Controllo automatizzato o ripetibile che protegge una proprietà architetturale durante l'evoluzione. Una fitness function verde verifica soltanto ciò che è realmente capace di osservare.

**Found** — Per la conoscenza legacy, stato minimo: un comportamento, una regola o un indizio è stato individuato in codice, configurazione, log, documentazione o pratica operativa, ma il suo significato non è ancora stabilito.

**Forward repair** — Correzione del sistema procedendo in avanti anziché tornare a una versione precedente, spesso necessaria quando stato o dati non sono reversibili in modo sicuro.

**Functional analysis / analisi funzionale** — Comprensione strutturata di attori, journey, stati, transizioni, business rule, invariant, exception, ownership e authority. Può avere specialisti; la comprensione del prodotto non può avere un unico proprietario.

**Functional literacy** — Capacità di leggere, discutere e ricostruire il comportamento del prodotto anche quando il proprio ruolo primario è tecnico. È una competence base per chi prende decisioni sul sistema.

**Functional Scope Map** — Artefatto che rende espliciti actor, journey, state, rule, exception, owner, out-of-scope e open question del comportamento funzionale prima che vengano nascosti nella soluzione tecnica.

## G

**Generated Refactoring Illusion** — Falsa confidence prodotta quando una trasformazione generata è ampia, coerente e apparentemente verde ma l'evidence non copre davvero semantic surface e preserved behavior.

**Golden command** — Comando canonico e ripetibile che builda, testa o verifica il repository. Deve funzionare in un environment noto e rendere distinguibile failure del codice da failure dell'ambiente.

**Golden master** — Snapshot o baseline di output legacy usato per rilevare differenze. È utile quando cattura semantica importante e pericoloso quando congela rumore o implementation detail.

**GraphQL** — Stile/API query language in cui il consumer richiede una forma specifica dei dati. Ha trade-off propri su schema, authorization, caching, complexity e ownership e non è un default universale.

**Green-by-editing-the-oracle** — Failure mode in cui l'executor rende verde il proprio task modificando test, baseline, policy o altri oracle che dovrebbero giudicarlo, invece di soddisfare la proprietà richiesta.

**Greenfield** — Contesto in cui un sistema o capability nasce senza dover preservare direttamente una base legacy esistente. Non elimina requirement, migration da processi precedenti o vincoli organizzativi.

**Grounding** — Collegamento dell'output di un sistema AI a fonti o dati contestuali pertinenti. Grounding non significa automaticamente RAG, vector database, factual correctness o semantic authority.

**Guardrail** — Meccanismo che riduce la probabilità o il blast radius di una decisione indesiderata: policy, test, permission, budget, approval, type system, fitness function, rollout limit, stop condition o altra barriera verificabile.

## H

**Handoff** — Trasferimento di responsabilità o contesto fra persone o agenti. Un handoff robusto conserva scope, constraint, evidence, limitation e stop condition, non soltanto un riassunto narrativo.

**Headroom** — Capacità mantenuta intenzionalmente oltre il carico atteso per assorbire burst, failure o crescita. Non deve essere confusa automaticamente con capacità inutilizzata da eliminare.

**Health model** — Modello che definisce stati come Healthy, Degraded, Unavailable o altri stati operativi e collega ciascuno a comportamento e signal osservabili.

**Human-in-the-loop** — Workflow in cui una persona approva, verifica o decide in un punto specifico. Deve essere applicato in base al rischio; metterlo ovunque può produrre approval fatigue.

## I

**IaC — Infrastructure as Code** — Gestione di infrastruttura e configurazione tramite artefatti versionati e ripetibili. Il fatto che l'infrastruttura sia codificata non implica che sia corretta o verificata runtime.

**Idempotency / idempotenza** — Proprietà per cui ripetere la stessa richiesta o operazione con la stessa identità non produce effetti business aggiuntivi indesiderati. È particolarmente importante con retry e duplicate delivery.

**Identity / identità** — Rappresentazione di un utente, workload, servizio o agente usata per authentication, authorization, audit e policy.

**Implementation drift** — Scostamento fra una decisione ancora valida e il modo in cui il sistema è effettivamente implementato.

**Incident response** — Processo con cui un'organizzazione rileva, contiene, diagnostica, recupera e apprende da un incidente operativo.

**Index / indice database** — Struttura dati che accelera determinati access pattern al costo di storage, write amplification e manutenzione. È una scelta legata al workload, non un'ottimizzazione gratuita.

**Inferred** — Per la conoscenza legacy, stato in cui il significato di un comportamento è stato dedotto da evidence disponibili ma non ancora osservato direttamente o confermato da un'autorità competente.

**Information hiding** — Principio secondo cui un modulo nasconde decisioni interne che possono cambiare e pubblica un contract più stabile. Riduce coupling alle scelte di implementazione.

**Instruction drift** — Scostamento fra istruzioni persistenti per persone/agenti e repository reale: path rimossi, comandi obsoleti, policy superate o documentazione duplicata che diverge.

**Integration test** — Test che verifica l'interazione reale o ad alta fidelity fra più componenti, processi, datastore o dipendenze.

**Invariant / invariante** — Proprietà che deve restare vera attraverso transizioni e casi limite rilevanti. È più forte di una descrizione generica del comportamento desiderato.

**Issue-driven development** — Operating model in cui la issue/work item diventa boundary esplicito fra decisione ed execution, con contesto, acceptance, verification ed evidence ricostruibili.

**Issue Form** — Modulo strutturato per raccogliere campi utili alla definizione del lavoro. La struttura è utile soltanto quando riduce ambiguità e non diventa ceremony vuota.

## J

**Judgment** — Capacità di scegliere e governare trade-off sotto vincoli, rischio e informazione incompleta. Nel libro è il complemento della crescente abbondanza di execution.

## K

**Kill switch** — Meccanismo che consente di disabilitare rapidamente una capability, un tool o un comportamento quando il rischio supera il boundary accettato.

**Kubernetes** — Piattaforma di orchestrazione container. Nel libro compare come esempio di tecnologia con benefici e costi reali, non come prova di maturità o scelta obbligatoria.

## L

**Latency / latenza** — Tempo necessario perché una richiesta, un evento o un journey raggiunga un punto definito. Deve essere collegata a percentile, boundary e condizione di misura quando diventa requisito.

**Launch boundary** — Perimetro preciso della promessa di lancio: utenti, capability, environment/region, traffico, support e funzionalità esplicitamente escluse. Readiness può essere diversa per boundary diversi.

**Least privilege** — Principio per cui identità, persone e agenti ricevono soltanto i permessi necessari al compito corrente e non un set più ampio “per comodità”.

**Legacy** — Sistema difficile da cambiare con sufficiente comprensione e confidence, indipendentemente dall'età del codice. Il problema centrale è la conoscenza e il rischio del cambiamento.

**Legacy Understanding Map** — Artefatto che raccoglie scope, behavior, state/data ownership, dependency, procedure operative, evidence state, unknown, candidate seam e migration risk per una slice di modernization.

**Load balancing** — Distribuzione del traffico fra istanze o destinazioni. Le strategie di bilanciamento influenzano capacity, failure isolation, affinity e recovery.

**Load test** — Test che esercita il sistema con carico controllato per misurare performance, capacity o failure behavior. Il carico deve rappresentare il launch boundary o lo scenario che vogliamo sostenere.

**Lock-in** — Costo di dipendenza da una tecnologia, provider, API o competenza che rende più costoso cambiare. Non è automaticamente negativo: può essere un costo consapevolmente accettato per ottenere valore.

**Logs** — Registrazioni discrete di eventi o informazioni prodotte dal sistema. Sono un signal di observability ma senza struttura, correlazione, retention e policy possono diventare rumore o rischio.

## M

**Maintainability / manutenibilità** — Capacità di comprendere e modificare il sistema con costo e rischio accettabili. Non è misurata da un singolo pattern o indice statico.

**Managed service** — Capability operata in parte significativa da un provider. Può ridurre lavoro operativo e TCO ma introduce pricing, constraint, dependency e exit cost da valutare.

**Messaging** — Comunicazione asincrona attraverso broker, queue, topic o stream. Introduce delivery semantics, ordering, retry, backpressure e operabilità da progettare.

**Metrics / metriche** — Misure numeriche aggregate usate per osservare comportamento, performance o stato. Devono essere collegate a una domanda e a un boundary per evitare dashboard senza significato.

**Microservices** — Stile che distribuisce capability in servizi deployabili separatamente. Può aumentare autonomy e isolation, ma paga network, consistency, deployment e operational cost.

**Migration** — Transizione controllata da uno stato o sistema esistente a uno nuovo. Include compatibility, coexistence, evidence, cutover, rollback/fallback e cleanup.

**Migration flag** — Feature flag usata per governare un percorso transitorio di migrazione. La rimozione del flag e del vecchio path fa parte della Definition of Done.

**Model boundary** — Confine che stabilisce quale interpretazione è delegata al modello AI e quali fact, rule, authority e authorized action restano deterministici o fuori dal modello.

**Model drift** — Cambiamento nel comportamento utile o nella qualità di una capability AI nel tempo a causa di model version, dati, contesto, provider o distribuzione degli input.

**Model upgrade** — Cambio della versione o famiglia di modello usata da una feature. È un cambiamento di comportamento e richiede regression eval, security case, cost/latency e rollback, non soltanto benchmark del provider.

**Modular monolith / monolite modulare** — Sistema deployato come unità unica ma organizzato in boundary interni forti, con responsabilità e dipendenze governate per preservare evolvibilità senza pagare subito il costo della distribuzione.

**Monitored** — Livello di evidence in cui una proprietà rilevante produce signal runtime osservabili e governati. `Verified` non implica `Monitored`.

**Monolith / monolite** — Sistema deployato principalmente come una singola unità. Non è sinonimo di codice mal progettato e può avere fit eccellente per molti workload.

**Multi-agent** — Workflow che usa più agenti o ruoli agentici. Non è un maturity level: deve comprare una proprietà reale come indipendenza, parallelismo o specialization maggiore del costo di orchestrazione.

**Multi-region** — Deployment distribuito su più regioni geografiche/cloud. Può ridurre alcuni failure risk ma aumenta consistency, networking, data governance, costi e complexity.

**Mutation testing** — Tecnica che modifica intenzionalmente il codice con piccoli mutation per verificare se la test suite rileva il cambiamento. Misura una proprietà diversa dalla semplice code coverage.

**MVP — Minimum Viable Product** — Scope minimo capace di produrre apprendimento o valore coerente con quality floor e constraint. “Minimo” non autorizza a violare proprietà non negoziabili.

## N

**NFR — Non-Functional Requirement** — Requisito su *come* il sistema deve comportarsi, per esempio latency, reliability, security, operability o cost. Gli aggettivi diventano requirement solo quando sono decisionabili e verificabili.

**Non-Functional Requirements Card** — Artefatto che collega journey, property, threshold/boundary, rationale, evidence e trade-off dei quality attribute materialmente importanti.

**NO-GO** — Decisione di non procedere con il launch boundary corrente perché blocker o evidence gap non permettono una promessa accettabile. Può essere il risultato corretto di una review efficace.

## O

**Observability** — Capacità di ricostruire lo stato e il comportamento rilevante di un sistema a partire dai segnali che produce. Non coincide con “avere dashboard” o con la semplice raccolta di log.

**Observability Contract** — Artefatto che collega journey e failure mode a signal, SLI, alert, owner, correlation, retention e azione operativa attesa.

**Observed** — Per la conoscenza legacy, stato in cui un comportamento è stato visto in execution, test, dati o ambiente reale. Essere osservato non lo rende automaticamente requisito target.

**One-Man Project** — Operating model in cui una persona governa una porzione di execution molto ampia grazie ad agenti, automazione e piattaforme, mantenendo specialist gate, secondary maintainer, continuity ed evidence. Non significa “una persona sostituisce un team”.

**One-way door** — Decisione difficile o costosa da invertire senza perdita, downtime, migration o conseguenze rilevanti. Richiede evidence e authority proporzionate.

**OpenTelemetry** — Standard e progetto per telemetry interoperabile, in particolare trace, metrics e log. Nel libro è una possibile base tecnica per observability, non un sostituto del design dei signal.

**Operability / operabilità** — Capacità di gestire, diagnosticare, recuperare e cambiare il sistema in produzione con procedure, ownership e segnali adeguati.

**Orchestration / orchestrazione** — Coordinamento esplicito di più step da parte di un componente o workflow centrale che decide l'ordine e gestisce avanzamento/failure.

**Outcome** — Cambiamento utile ottenuto nel sistema o nel comportamento degli utenti. Si distingue dagli output prodotti per perseguirlo: codice, documenti, test, ADR e agent run.

**Outbox pattern** — Pattern che registra nello stesso boundary transazionale il cambiamento business e il messaggio da pubblicare, riducendo la finestra in cui uno dei due avviene senza l'altro.

**Ownership** — Responsabilità operativa o decisionale esplicita su una capability, un dato, un artefatto o un rischio. Shared infrastructure non implica shared semantic ownership.

## P

**PaaS — Platform as a Service** — Modello cloud in cui il provider gestisce parte significativa del runtime e dell'infrastruttura. Riduce alcuni oneri operativi ma introduce constraint, costi e dependency da valutare.

**Partial failure** — Condizione tipica dei sistemi distribuiti in cui alcune parti funzionano e altre no, rendendo impossibile trattare il sistema come semplicemente “up” o “down”.

**Partitioning** — Suddivisione di dati o workload in parti per scale, locality o isolation. La chiave di partizione influenza query, hotspot, consistency e operazioni.

**Paved road** — Percorso standard supportato da Platform/enterprise che rende semplice ottenere proprietà comuni come deployment, identity, observability o security senza imporre necessariamente uniformità assoluta.

**Permission / permesso** — Facoltà tecnica concessa a un attore o agente di usare una risorsa o compiere un'azione. Una permission disponibile non implica che l'azione sia autorizzata nel contesto corrente.

**Persistent context** — Informazione che resta valida tra task diversi e appartiene al repository o a una source of truth stabile: architecture, command, owner, boundary e policy.

**Platform Engineering** — Disciplina che costruisce capability e paved road condivise per ridurre cognitive/operational load dei team mantenendo standard e self-service coerenti.

**Point of no return** — Punto di una migrazione oltre il quale tornare indietro richiede perdita, trasformazioni costose, compensazioni o non è più possibile con il semplice rollback.

**Postmortem** — Analisi strutturata dopo un incidente per ricostruire fatti, contributori, response e azioni di miglioramento. Non dovrebbe essere uno strumento di ricerca del colpevole.

**PRR — Production Readiness Review** — Review che rende espliciti launch boundary, blocker, rischio accettato, evidence mancante, ownership e decisione GO/NO-GO. Un PRR è utile soltanto quanto le evidence che valuta.

**Problem & Outcome Brief** — Artefatto iniziale che chiarisce problema, utenti/actor, outcome desiderato, constraint, non-goal, metriche o evidence attese prima di trasformare una richiesta in soluzione tecnica.

**Progression criteria** — Condizioni misurabili che devono essere soddisfatte prima di ampliare un rollout, un'autonomia o un launch boundary.

**Progressive rollout** — Rilascio che aumenta gradualmente exposure o traffico sulla base di progression criteria, stop condition e monitoring.

**Prompt injection** — Attacco/failure mode in cui contenuto non fidato tenta di influenzare il modello affinché ignori istruzioni o usi dati/tool in modo non autorizzato. Il rischio cresce con la potenza dei sink disponibili.

**Prompt-first development** — Anti-pattern in cui si passa troppo rapidamente da un desiderio espresso in prompt all'execution, saltando problem framing, requirement, authority e verification.

**Property-based testing** — Tecnica che genera molti input per verificare proprietà/invariant generali invece di enumerare soltanto esempi specifici.

**Provenance** — Informazione su origine e percorso di un claim, dato, documento o output: da quale fonte deriva, come è stato trasformato e quale livello di authority/evidence possiede.

**Pub/sub — Publish/Subscribe** — Modello di messaging in cui producer pubblicano eventi a topic e più consumer possono riceverli indipendentemente. Introduce delivery, ordering e lifecycle dei subscriber da progettare.

## Q

**Quality attribute** — Proprietà osservabile o verificabile che descrive *come* il sistema deve comportarsi: reliability, security, performance, operability, evolvability e simili.

**Quality floor** — Limite minimo che un trade-off non può violare senza una decisione esplicita di rischio. Serve a distinguere il compromesso consapevole dalla scorciatoia inconsapevole.

**Queue** — Struttura di messaging in cui lavoro/messaggi vengono accodati per essere consumati. Può assorbire burst trasformandoli in backlog, ma non crea capacità di processing.

## R

**RAG — Retrieval-Augmented Generation** — Pattern in cui il modello riceve contenuto recuperato da una knowledge source per generare una risposta. È una possibile strategia di grounding, non un sinonimo di grounding.

**Rate limiting** — Limitazione del numero o ritmo di richieste/azioni ammesse per identità, consumer o finestra temporale, usata per capacity, fairness, abuso o protezione da failure amplification.

**Rate optimization** — Riduzione del prezzo pagato per una unità di consumo, distinta dalla usage optimization che riduce quante unità vengono consumate.

**Read model** — Rappresentazione di dati ottimizzata per un bisogno di lettura specifico e potenzialmente derivata da source autorevoli. Una copia tecnica non trasferisce semantic authority.

**Reconciliation** — Confronto fra stati, sistemi o output indipendenti per verificare che una migrazione, dual write o processo distribuito non abbia prodotto divergenze indesiderate.

**Recovery** — Ripristino della capability dopo un failure. Include dati, dependency, configurazione, procedure e verifica dell'esito, non soltanto il restart di un processo.

**Refactoring** — Modifica della struttura interna con l'intenzione di preservare il comportamento scelto come invariato. Nell'era AI richiede particolare disciplina su semantic surface, evidence e blast radius.

**Refactoring Safety Plan** — Artefatto che rende espliciti goal, scope, behavior classification, invariant, phase, evidence, stop condition, fallback/rollback, point of no return, owner e cleanup di una trasformazione significativa.

**Reliability / affidabilità** — Capacità del sistema di svolgere la funzione promessa nel tempo e sotto failure previsti. Comprende availability, recovery, degradation, capacity e operabilità secondo il contesto.

**Replication** — Mantenimento di più copie di dati o stato per availability, scale o locality. Introduce lag, consistency e failover semantics da comprendere.

**Repository Map** — Mappa concisa della struttura del repository, componenti principali, source of truth e percorsi di navigazione usata da persone e agenti per ridurre discovery ripetuta.

**Resilience / resilienza** — Capacità di continuare, degradare o recuperare in modo controllato quando avvengono failure. Non è una singola tecnologia o pattern.

**REST — Representational State Transfer** — Stile architetturale per sistemi distribuiti basato su resource, uniform interface e altri constraint. Nel libro HTTP/JSON non viene automaticamente chiamato REST se quei principi non sono la decisione rilevante.

**Retention** — Periodo e regole con cui dati, log, trace, audit o altri artefatti vengono conservati. Influenza costo, privacy, compliance e capacità di investigazione.

**Retry** — Nuovo tentativo di un'operazione fallita o incerta. È sicuro soltanto quando timeout, backoff, idempotenza e capacity/failure amplification sono progettati insieme.

**Retry budget** — Limite al numero o costo dei tentativi di riparazione, request o agent loop prima di fermarsi o escalare.

**Retry storm** — Amplificazione di un incidente quando molti client o componenti ritentano contemporaneamente contro una dipendenza già in difficoltà.

**Reversibility / reversibilità** — Facilità con cui una decisione o modifica può essere annullata senza conseguenze significative. È una dimensione importante del rischio e del peso decisionale.

**Review trigger** — Condizione che riapre intenzionalmente una decisione, un ADR, una policy, un modello o un operating model quando cambia il contesto o l'evidence.

**RPO — Recovery Point Objective** — Perdita massima di dati accettabile espressa come punto temporale o intervallo. Un backup configurato non dimostra il rispetto dell'RPO.

**RTO — Recovery Time Objective** — Tempo massimo accettabile per ripristinare una capability dopo un failure definito. Un runbook o failover configurato non dimostrano da soli il rispetto dell'RTO.

**Rollback** — Ripristino verso una versione o configurazione precedente. Nel libro viene distinto in code, configuration, feature, traffic e data rollback, perché non sono equivalenti.

**RPC / gRPC** — Stile di interazione orientato a chiamate di procedure/operazioni remote; gRPC è una tecnologia basata su contract e HTTP/2. Ha fit e trade-off diversi da REST, messaging o GraphQL.

**Runbook** — Procedura operativa eseguibile che guida detection, diagnosis, recovery o attività ricorrenti. Esistere su disco non significa essere aggiornato o realmente esercitabile.

## S

**Saga** — Strategia per coordinare una transazione business distribuita attraverso più operazioni locali e compensation, invece di usare una singola transazione ACID globale.

**Sampling** — Selezione di una parte dei signal o dati da conservare/elaborare per controllare costo e volume. Deve proteggere i casi ad alto valore o rischio e rendere esplicito ciò che non viene osservato.

**SBOM — Software Bill of Materials** — Inventario dei componenti software e dipendenze usato per supply-chain visibility, vulnerability management e governance.

**Schema evolution** — Modifica nel tempo della struttura o contract dei dati mantenendo compatibility e migration path per producer, consumer e stato esistente.

**Seam** — Punto di sostituzione o intercettazione che permette a comportamenti vecchi e nuovi di coesistere o essere testati indipendentemente durante una trasformazione.

**Secrets** — Credenziali, chiavi o token che consentono accesso a sistemi o dati. Devono essere gestiti fuori dal codice e con identity, rotation, scope e audit appropriati.

**Secure SDLC — Secure Software Development Lifecycle** — Integrazione sistematica di security requirement, threat modeling, secure coding, supply-chain control, verification e response nel ciclo di sviluppo.

**Semantic authority** — Fonte o owner autorizzato a stabilire il significato di un dato o di una regola di business. Possedere una replica tecnica non equivale a possederne la verità semantica.

**Semantic diff** — Valutazione di ciò che cambia nel comportamento o nel significato, non soltanto delle linee modificate. È particolarmente importante nei refactoring generati su larga scala.

**Semantic surface** — Porzione di comportamento, contract, dati e side effect che una modifica può alterare materialmente, anche quando il diff testuale appare piccolo.

**Serverless** — Modello cloud in cui provisioning e scaling dell'infrastruttura sono fortemente gestiti dal provider e il consumer paga/gestisce unità più vicine all'esecuzione. Ha constraint propri su runtime, networking, state e costi.

**Shadow comparison / shadow mode** — Esecuzione della nuova implementazione in parallelo al percorso autorevole per confrontare output senza lasciare che il candidate produca side effect incontrollati.

**Side effect** — Effetto osservabile oltre al valore restituito da una funzione o request: write, evento, pagamento, email, modifica di stato o chiamata esterna.

**SLI — Service Level Indicator** — Misura osservabile di una proprietà di servizio rilevante per l'utente o l'operazione, per esempio success ratio o latency di un journey definito.

**SLO — Service Level Objective** — Target associato a uno SLI in una finestra temporale definita. Nel libro gli SLO ESI sono requisiti simulati, non benchmark industriali.

**Small batch** — Incremento di cambiamento abbastanza piccolo da essere compreso, verificato e recuperato in modo autonomo. Non significa spezzare il lavoro in commit minuscoli privi di outcome.

**Smoke test** — Verifica rapida delle capability essenziali dopo build, deployment o cambiamento per rilevare failure grossolani prima di test più profondi.

**Source of truth** — Fonte considerata canonica per un tipo di informazione. Deve essere distinta da copie, cache, documenti derivati e output AI.

**Specialist gate** — Condizione che richiede il coinvolgimento o l'autorità di uno specialista prima di proseguire, per esempio su security, privacy, pagamenti, dati o legal/compliance.

**Stop condition** — Condizione osservabile che interrompe execution o autonomia e richiede escalation, revisione o nuova autorizzazione. È parte del design, non un'eccezione imbarazzante.

**Strangler Fig pattern** — Strategia di modernizzazione che sostituisce incrementalmente capability del sistema esistente, facendo coesistere vecchio e nuovo fino al cutover e alla rimozione del legacy.

**Streaming** — Elaborazione continua o quasi continua di eventi/dati man mano che arrivano. Introduce semantics di ordering, window, replay, state e backpressure.

**Structured output** — Output del modello vincolato a schema o struttura machine-readable. Riduce errori di formato ma non garantisce factual o semantic correctness.

**Supply chain / software supply chain** — Insieme di dipendenze, build tool, artifact, registry e processi attraverso cui il software viene prodotto. È una superficie di sicurezza distinta dal solo source code.

**Synthetic monitoring** — Esecuzione periodica di journey o request artificiali per verificare dall'esterno che una capability importante continui a funzionare.

**System thinking / pensiero sistemico** — Ragionamento che considera interazioni, feedback, dependency, boundary e conseguenze oltre la feature locale, includendo organizzazione e operazioni quando influenzano il comportamento.

## T

**Task amplification** — Espansione non autorizzata del lavoro quando un executor include cleanup, refactoring o decisioni incontrate durante il task ma fuori dallo scope concordato.

**Task context** — Informazione specifica del cambiamento corrente: problem, outcome, scope, acceptance, constraint, evidence e stop condition. Si distingue dal persistent context del repository.

**TCO — Total Cost of Ownership** — Costo complessivo di possedere e operare una soluzione includendo infrastructure, engineering, operations, security, training, recovery, migration ed exit cost, non soltanto la fattura del servizio.

**Technical debt** — Costo futuro e rischio creati da una scelta corrente che rende cambiamento, operazioni o comprensione più difficili. Nel libro è più utile quando ha owner, carrying cost e repayment trigger.

**Telemetry / telemetria** — Insieme di signal prodotti dal sistema per misurarne comportamento e stato, tipicamente metrics, logs e traces insieme a metadati di correlazione.

**Tenant isolation** — Proprietà per cui dati e azioni di un tenant non diventano accessibili o modificabili da un altro tenant oltre le policy previste. È spesso un quality/security floor non negoziabile.

**Threat Model** — Artefatto che identifica asset, actor, trust boundary, threat, control, residual risk e review trigger per ragionare sistematicamente sui failure di security.

**Threat modeling** — Processo con cui si identificano minacce, trust boundary, asset e controlli prima o durante il design, aggiornandoli quando cambia la superficie del sistema.

**Throughput** — Quantità di lavoro completato per unità di tempo entro un boundary definito. Aumentarlo può spostare il collo di bottiglia verso dependency, review, data o decision throughput.

**Timeout** — Limite temporale oltre il quale un'operazione viene considerata non completata entro il budget disponibile. Deve essere coordinato con retry, downstream budget e behavior del consumer.

**Tool boundary** — Insieme di tool e azioni accessibili a un modello/agente insieme ai relativi permission, approval e sink. Ridurre il toolset può ridurre il blast radius anche senza migliorare il modello.

**Topology / topologia** — Distribuzione di componenti, processi, datastore, region e collegamenti runtime. È una conseguenza delle decisioni, non l'intera architettura.

**Trace** — Rappresentazione del percorso di una request o operazione attraverso span correlati fra componenti. Aiuta a ricostruire latency e dependency lungo un journey distribuito.

**Trade-off** — Accettazione consapevole di un costo per ottenere un beneficio prioritario. Non è un sinonimo elegante di scorciatoia.

**Transaction / transazione** — Boundary entro cui più operazioni devono rispettare proprietà atomiche o di consistency definite. Il boundary tecnico deve essere coerente con l'invariant business che protegge.

**Tribal knowledge** — Conoscenza operativa o progettuale che vive principalmente nella memoria di poche persone e non è ricostruibile da source of truth, artifact o automation adeguati.

**Two-way door** — Decisione relativamente reversibile e poco costosa da cambiare. Può essere presa con un livello di governance più leggero rispetto a una one-way door.

## U

**Unit economics** — Relazione fra costo e una unità decisionale utile: transaction, tenant, case resolved, successful journey, verified change o altro outcome coerente con il business.

**Unit test** — Test focalizzato su una unità logica relativamente isolata. Offre feedback veloce ma non dimostra automaticamente integration, environment o behavior end-to-end.

**Usage optimization** — Riduzione della quantità di risorse o unità consumate, distinta dalla rate optimization che riduce il prezzo unitario.

## V

**Value premium** — Costo aggiuntivo accettato per comprare una proprietà utile come reliability, security, isolation, optionality o operability. Deve essere collegato al valore che protegge.

**Verification / verifica** — Processo con cui si raccoglie evidence adeguata per sostenere un claim. La verifica non è sinonimo di “eseguire test” e dipende dalla proprietà promessa.

**Verified** — Stato in cui una proprietà o un claim è sostenuto da evidence adeguata al livello dichiarato. Occorre specificare *che cosa* è stato verificato: compilation, contract, behavior, environment, recovery, model quality e produzione richiedono evidence differenti.

**Verification oracle** — Fonte o meccanismo che decide se una proprietà è soddisfatta: test, baseline, policy, benchmark, security control o altro. Deve avere governance quando l'executor può modificarlo.

**Verification without re-execution** — Strategia in cui reviewer e governor usano contract, invariant, test, static analysis, diff, observability, fitness function ed evidence bundle per verificare lavoro delegato senza rifarlo integralmente a mano.

**Versioning** — Gestione esplicita dell'evoluzione di API, schema, artifact, model, prompt o contract quando consumer e sistemi non possono cambiare tutti nello stesso istante.

## W

**Webhook** — Callback HTTP inviata da un sistema a un consumer quando avviene un evento. Richiede authentication, retry/idempotency, delivery semantics e gestione del consumer failure.

**WebSocket** — Protocollo che mantiene una connessione bidirezionale persistente tra client e server. Ha fit quando serve comunicazione frequente e a bassa latenza, ma introduce operabilità e scaling specifici.

**WIP — Work in Progress** — Lavoro iniziato ma non ancora concluso/accettato. Nel lavoro agentico troppo WIP può saturare review, attention e decision throughput anche se l'execution è abbondante.

**Workload** — Sistema o capability considerati insieme al contesto operativo, requisiti, dati, failure mode e responsabilità che ne determinano il fit architetturale.

## Z

**Zero Trust** — Approccio di sicurezza che non considera implicitamente affidabile un actor per posizione di rete e richiede identity, policy e verifica esplicite per l'accesso. Non significa “non fidarsi di nessuno” in senso informale.

---

> **Un termine tecnico è utile quando riduce l'ambiguità. Se la parola diventa più precisa della decisione che dovrebbe descrivere, abbiamo soltanto spostato il problema nel vocabolario.**
