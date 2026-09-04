## Managed services: comprare capacità senza possedere ogni meccanismo

Uno dei vantaggi più forti del cloud è poter delegare una parte del lifecycle operativo al provider. Database, messaging, identity, secret management, object storage e load balancing possono essere consumati come capability gestite invece di diventare sistemi che il workload team deve costruire, patchare e aggiornare direttamente.

Questa delega non è semplice comodità. È una decisione di **ownership operativa**.

## Managed non significa che l’outcome sia delegato

Con PostgreSQL gestito il provider può assumersi host patching, provisioning, una parte della storage durability, primitive di backup e failover infrastructure. Il workload team continua però a possedere schema, query, index, data ownership, capacity, recovery objective, retention, access control, connection management, comportamento applicativo durante failover, restore test e costo.

La stessa distinzione vale per messaging. Azure Service Bus può offrire queue e topic durabili, ma non decide message semantics, idempotency, retry ownership, poison-message handling, ordering requirement o reconciliation.

Fonte:

- [Microsoft Learn — Azure Service Bus queues, topics and subscriptions](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)

> **Managed service significa delegare un meccanismo, non delegare l’outcome.**

Il provider gestisce una parte dell’infrastruttura. Noi continuiamo a gestire il significato e la promessa del workload.

## Cognitive load è una voce di costo reale

Un team che self-hosta database, cluster Kubernetes, broker, secret infrastructure, monitoring backend e certificate lifecycle deve costruire competenze, on-call e automation per ciascun sistema. Può essere la scelta corretta, ma il confronto economico non può fermarsi al prezzo delle VM.

Il TCO comprende engineering time, patching, upgrade, security maintenance, incident response, capacity planning e recovery test. Un servizio gestito può avere una fattura mensile più alta e costare comunque meno al workload quando libera attenzione che il team può investire nel prodotto.

Questa economia architetturale è spesso più importante della differenza nominale fra due SKU.

## Il rischio opposto: service sprawl

Il cloud rende altrettanto facile eccedere nella direzione contraria. Ogni esigenza può diventare un nuovo servizio: cache, search, scheduler, workflow, configuration store, queue, event grid, function. Ciascuno può essere ragionevole isolatamente e trasformare comunque il sistema complessivo in una collezione difficile da operare.

Per questo dobbiamo reintrodurre friction decisionale dove il provisioning l’ha rimossa. Prima di aggiungere una capability gestita chiediamo:

> **Quale proprietà concreta compra questo servizio che non possiamo ottenere in modo sufficientemente buono con ciò che abbiamo già?**

Se non sappiamo rispondere, il catalogo cloud sta guidando l’architettura al posto del workload.

## Lock-in: non esiste un solo tipo di dipendenza

“Vendor lock-in” è troppo generico per essere una conclusione. Il codice può dipendere da API specifiche del provider; i dati possono vivere in un formato difficile da esportare; runbook, dashboard e pipeline possono diventare fortemente provider-specific; il cost model può rendere l’uscita cara; l’architettura può assumere proprietà non facilmente riproducibili altrove; l’organizzazione stessa può costruire processi e competenze attorno a un ecosistema.

Sono lock-in diversi e non hanno tutti lo stesso peso.

Un’applicazione Node.js ospitata su un PaaS, con PostgreSQL standard e contract applicativi indipendenti dal broker, presenta un profilo di uscita molto diverso da un dominio progettato attorno a primitive proprietarie senza equivalenti semplici.

## Portabilità non è gratuita

Possiamo massimizzare la portabilità evitando managed identity, secret store provider, PaaS, messaging gestito e autoscaling specifico. In cambio possiamo perdere security capability, automation, reliability e riduzione del cognitive load.

La portabilità è una quality attribute, non un principio assoluto. Deve avere un valore business abbastanza concreto da giustificare il lavoro aggiuntivo.

Il problema quindi non è eliminare ogni lock-in, cosa spesso impossibile anche organizzativamente. È **pagare lock-in dove il valore ricevuto è superiore al costo di uscita plausibile**.

## Exit strategy proporzionata

Non serve costruire un multi-cloud attivo per preservare optionality. Possiamo invece mantenere alcuni confini ragionevoli: PostgreSQL standard quando non servono feature proprietarie, contract applicativi che non espongono type del provider, message schema indipendenti dal broker, Infrastructure as Code, formati di export documentati e una mappa delle dipendenze cloud che rappresentano vere one-way door.

Questa optionality non rende la migrazione gratuita. Evita però di renderla inutilmente difficile.

Per una tecnologia cloud importante possiamo quindi chiederci quanto codice ne conosca l’API, quanto dato vi sia intrappolato, quanto costerebbe sostituirla, quale valore riceviamo in cambio e se un abstraction layer riduca davvero il coupling oppure aggiunga soltanto wrapper che nessuno userà mai per cambiare provider.

## ESI: managed by default, non managed blindly

Platform Engineering adotta una regola semplice: preferire capability gestite quando soddisfano il requisito e riducono ownership operativa senza introdurre un rischio sproporzionato. Self-hosting non è vietato, ma richiede una motivazione legata al controllo che il workload deve realmente possedere.

Per Order Operations questo rende PostgreSQL gestito e messaging gestito candidati naturali; favorisce managed identity rispetto a secret statici e rende privo di senso costruire un secret store o gestire un cluster Kafka per il singolo flusso di Payment Escalation.

> **Non possedere infrastruttura che non differenzia il prodotto, a meno che il controllo acquistato abbia un valore reale.**

Questa è la forma di lock-in che accettiamo consapevolmente: delegare lavoro non differenziante in cambio di un coupling operativo che il contesto ESI sa sostenere.