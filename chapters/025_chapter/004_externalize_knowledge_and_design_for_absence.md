# Esternalizzare conoscenza e progettare per l’assenza

Il rischio più serio di un One-Man Project non è che una persona produca molto lavoro. È che quella persona diventi il luogo in cui vivono rationale, workaround, priorità, eccezioni, conoscenza dei consumer, procedure operative e interpretazione dei requisiti.

Finché il lead è presente il sistema può sembrare estremamente efficiente. Poi arrivano ferie, malattia, cambio di ruolo o un incidente nel momento sbagliato e scopriamo che avevamo ridondanza sui dati ma non sulla conoscenza necessaria a governare il prodotto.

> **Execution concentration e knowledge concentration sono due proprietà diverse.**

Possiamo accettare la prima senza accettare la seconda.

## Il repository come memoria esterna

Durante il libro abbiamo costruito Functional Analysis, Requirements, ADR, Data Ownership Map, API Contract, Failure Mode Map, Threat Model, Reliability Contract, Observability Contract, Testing Strategy, Cost Model, Repository Map, work item, agent governance e AI Feature Contract.

Questi artifact non servono a far sembrare il repository più “enterprise”. Servono a ridurre una proprietà concreta: la quantità di contesto che deve esistere soltanto nella testa di una persona.

La documentazione diventa quindi parte della **continuity architecture** quando rende recuperabili decisioni e stato corrente.

Non ci interessa conservare la cronaca di ogni conversazione. Ci interessa che una persona competente possa capire che cosa è vero, chi lo possiede, perché abbiamo scelto una certa soluzione, quale evidence esiste, che cosa è ancora Pending, quali boundary non possono cambiare silenziosamente e quale evento deve riaprire una decisione.

> **Knowledge redundancy non significa copiare tutto. Significa rendere recuperabile ciò che serve per riprendere il controllo senza reinventare il sistema.**

## Maintainer non significa proprietario assoluto

GitHub ha raccontato l’introduzione di `SERVICEOWNERS` per associare componenti e servizi ai maintainer, creando una terminologia condivisa e un mapping più stabile fra software e persone utile anche durante incidenti e cambi organizzativi.

Fonte:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

La parola *maintainer* è utile anche qui. Il lead mantiene il progetto; non possiede personalmente la truth del business, la security policy o la piattaforma. Il repository deve mostrare dove terminano le sue decision rights e dove iniziano quelle di altri owner.

Questo evita che la continuity sia interpretata come “trovare un sostituto che sappia tutto ciò che sapeva l’hero developer”. Il sistema deve invece rendere visibile abbastanza contesto da permettere al prossimo maintainer di capire dove guardare e quando escalare.

## Il Continuity Test

ESI introduce un test operativo semplice:

> **Se il lead diventasse indisponibile per due settimane domani mattina, una persona competente riuscirebbe a capire lo stato del progetto, evitare danni e portare avanti almeno il lavoro necessario?**

Non chiediamo al Secondary Maintainer di essere produttivo al 100% in pochi minuti. Chiediamo di poter ricostruire purpose, architecture, current work, evidence state, golden command, operational route, decision rights e failure state.

Se per capire una decisione Pending o una stop condition serve una telefonata al lead, abbiamo trovato knowledge debt.

Il test deve essere operativo. Controllare che `AGENTS.md`, ADR e runbook esistano non dimostra continuity. La persona deve usarli per fare qualcosa: eseguire i golden command, individuare un task safe, spiegare cosa è `Designed` e cosa è `Verified`, ricostruire un escalation path, oppure affrontare un piccolo incident drill.

Questa differenza è fondamentale:

```text
file exists
≠
knowledge is transferable
```

## Il vacation drill di ESI

Nel pilot ESI il Continuity Test diventa un **vacation drill** simulato. Il lead viene considerato indisponibile e il Secondary Maintainer riceve repository e soli enterprise system autorizzati.

Deve riuscire a entrare da `AGENTS.md`, usare la Repository Map, trovare AI Feature Contract e work item correnti, eseguire `npm run typecheck` e `npm test`, distinguere evidence già codificata da verification ancora Pending e identificare le non-authorities del lead.

Infine deve eseguire una bounded safe verification o una piccola modifica reversibile.

Il risultato del drill non è un voto alla persona. Se qualcosa è oscuro, la prima domanda è:

> **Quale informazione importante era ancora tribale, stale o difficile da trovare?**

Il drill trasforma quindi l’assenza simulata in evidence sulla qualità del repository come memoria operativa.

## Handoff e lavoro interrotto

La continuity conta anche su scale più piccole delle ferie.

Quando il lead interrompe un task, una branch con codice incompleto non è un handoff sufficiente. Devono essere recuperabili almeno current goal, hypothesis, change effettuati, evidence raccolta, failure osservati, decisioni ancora aperte, prossimo passo safe e stop condition.

Gli agenti possono produrre un primo handoff packet, ma il lead deve verificarne la correttezza. Un summary eloquente che omette il decision boundary peggiora la continuity invece di migliorarla.

## La conoscenza esternalizzata può diventare stale

Portare knowledge nel repository crea un nuovo rischio: documentazione presente ma obsoleta.

Una source of truth stale può essere peggiore di una source mancante perché produce falsa confidence. Per questo la continuity resta collegata a review trigger e fitness function.

Il test più forte non chiede “questo documento è aggiornato?”. Chiede “un’altra persona riesce a usarlo oggi per prendere una decisione corretta?”.

Il pilot ESI è ancora in uno stato onesto:

```text
Continuity model   Designed
Secondary role     Designed
Continuity drill   Pending
```

Finché il drill non viene eseguito, non dichiariamo la continuità `Verified`.

> **La documentazione diventa continuity evidence soltanto quando un’altra persona riesce davvero a usarla per riprendere il control plane senza inventare il sistema da capo.**
