# Glossario essenziale

Questo glossario raccoglie termini usati nel libro con un significato operativo preciso. Non sostituisce i capitoli in cui vengono introdotti.

## Accountability

Responsabilità ultima per una decisione e per le sue conseguenze. Può essere supportata da automazione e delega, ma non eliminata dalla frase “lo ha fatto l'AI”.

## Agent

Sistema software capace di eseguire più passi, usare strumenti e modificare artifact in funzione di un obiettivo e di un contesto. Nel libro `capability`, `permission`, `authorization` e `autonomy` restano concetti distinti.

## Architecture

Sistema di decisioni significative che rende espliciti boundary, ownership, trade-off, quality attribute, costi, failure mode, evolution path ed evidence. Non coincide con un diagramma.

## Authority

Diritto riconosciuto a stabilire una verità o prendere una decisione in un certo dominio. Una copia di un dato non trasferisce automaticamente la semantic authority.

## Boundary

Confine entro cui responsabilità, dati, regole o ownership vengono governati in modo coerente. Un boundary concettuale non implica automaticamente un servizio distribuito.

## Evidence

Informazione osservabile e pertinente che sostiene un claim. L'evidence deve essere proporzionata alla proprietà promessa: il tipo di prova conta quanto il suo esito.

## Failure mode

Modo concreto in cui un sistema, un processo o una decisione può fallire rispetto a una proprietà rilevante.

## Fitness function

Controllo automatizzato o ripetibile che protegge una proprietà architetturale durante l'evoluzione. Una fitness function verde verifica soltanto ciò che è realmente capace di osservare.

## Functional analysis

Comprensione strutturata di attori, journey, stati, transizioni, business rule, invariant, exception, ownership e authority. Può avere specialisti; la comprensione del prodotto non può avere un unico proprietario.

## Invariant

Proprietà che deve restare vera attraverso transizioni e casi limite rilevanti. È più forte di una descrizione generica del comportamento desiderato.

## Judgment

Capacità di scegliere e governare trade-off sotto vincoli, rischio e informazione incompleta. Nel libro è il complemento della crescente abbondanza di execution.

## Monitored

Livello di evidence in cui una proprietà rilevante produce signal runtime osservabili e governati. `Verified` non implica `Monitored`.

## Outcome

Cambiamento utile ottenuto nel sistema o nel comportamento degli utenti. Si distingue dagli output prodotti per perseguirlo: codice, documenti, test, ADR e agent run.

## Ownership

Responsabilità operativa o decisionale esplicita su una capability, un dato, un artifact o un rischio. Shared infrastructure non implica shared semantic ownership.

## Production readiness

Stato in cui il rischio residuo di una release è sostenuto da evidence, ownership e procedure adeguate al contesto. Non è una proprietà del solo codice e non deriva dall'esistenza di un documento PRR.

## Quality attribute

Proprietà osservabile o verificabile che descrive *come* il sistema deve comportarsi: reliability, security, performance, operability, evolvability e simili. Aggettivi vaghi non sono requisiti finché non diventano decisionabili e verificabili.

## Quality floor

Limite minimo che un trade-off non può violare senza una decisione esplicita di rischio. Serve a distinguere il compromesso consapevole dalla scorciatoia inconsapevole.

## Semantic authority

Fonte o owner autorizzato a stabilire il significato di un dato o di una regola di business. Possedere una replica tecnica non equivale a possederne la verità semantica.

## Stop condition

Condizione che interrompe execution o autonomia e richiede escalation, revisione o nuova autorizzazione. È parte del design di un workflow agentico, non un'eccezione imbarazzante.

## Trade-off

Accettazione consapevole di un costo per ottenere un beneficio prioritario. Non è un sinonimo elegante di scorciatoia.

## Verification without re-execution

Strategia in cui reviewer e governor usano contract, invariant, test, static analysis, diff, observability, fitness function ed evidence bundle per verificare lavoro delegato senza rifarlo integralmente a mano.

## Workload

Sistema o capability considerati insieme al loro contesto operativo, ai requisiti, ai dati, ai failure mode e alle responsabilità che ne determinano il fit architetturale.