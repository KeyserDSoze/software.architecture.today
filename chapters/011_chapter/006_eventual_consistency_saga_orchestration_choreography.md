## Eventual consistency: descrivere come il sistema converge

Quando un business process attraversa componenti indipendenti, può non esistere una singola transazione ACID che copra tutto. Questo non elimina la consistenza; la rende temporale.

Per alcuni secondi può essere vero che Order Operations abbia accettato una Payment Escalation mentre Payments & Risk non l’abbia ancora ricevuta. La domanda utile non è quindi “siamo consistent o eventually consistent?”, ma quale divergenza temporanea sia ammessa, per quanto tempo, chi possa osservarla, quali azioni debbano essere impedite durante quella finestra e che cosa accada se la convergenza non arriva.

> **Eventual consistency è un contratto temporale di convergenza, non una scusa per rimandare la correctness.**

## Business state e delivery state devono poter divergere senza confondersi

Se l’escalation è stata accettata localmente ma non ancora consegnata, un unico stato `Escalated` nasconde informazione utile. È più preciso distinguere il fatto di dominio dal progresso dell’integrazione:

```text
PaymentEscalation.status = Requested
IntegrationDelivery.state = Pending | Delivered | Delayed | DeadLettered
```

Così l’operatore può vedere che la propria intenzione è stata registrata anche quando la consegna downstream è in ritardo. La UI non deve dichiarare un successo più forte di quello che il sistema conosce, ma nemmeno far fallire retroattivamente un business fact locale perché il broker è degradato.

## Forward recovery prima del rollback immaginario

Nei sistemi distribuiti la prima domanda non dovrebbe essere sempre “come torniamo indietro?”. Spesso è più utile chiedere se possiamo proseguire verso uno stato valido attraverso retry, redelivery e reconciliation.

Microsoft Compensating Transaction pattern sottolinea che la compensation è domain-specific e che, quando possibile, il forward progress può essere preferibile a una compensazione automatica. Per condizioni ambigue o ad alto impatto può essere più corretto fermare il processo e richiedere human review.

Fonte:

- [Microsoft Learn — Compensating Transaction pattern](https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction)

Per una escalation non consegnata, continuare a tentare e riconciliare è normalmente più sensato che annullare il fatto che l’operatore l’abbia richiesta.

## Compensation: produrre un nuovo fatto, non cancellare il passato

In un workflow futuro di refund, alcuni side effect possono diventare irreversibili. Se il provider ha già eseguito il rimborso, un rollback SQL non può far finta che non sia successo. La recovery potrebbe richiedere una nuova operazione economica, un aggiornamento di audit, una notifica o una manual review.

La compensation è quindi una business operation con proprie regole, authorization, idempotency, failure mode e costi.

> **Una compensazione non cancella il passato. Produce un nuovo fatto che rende il sistema nuovamente accettabile.**

## Saga: usarla quando il workflow la merita

Una saga modella un business process distribuito come sequenza di transazioni locali che fanno progredire lo stato e, quando necessario, definiscono recovery o compensazioni. Microsoft distingue i due grandi stili di choreography e orchestration.

Fonte:

- [Microsoft Learn — Saga distributed transactions pattern](https://learn.microsoft.com/azure/architecture/patterns/saga)

Non useremo però *saga* come sinonimo di “qualunque cosa abbia una queue”. Il primo flusso `OperationalCasePaymentEscalated` contiene un fatto locale, publication affidabile e un consumer downstream: non ha ancora abbastanza step, pivot e compensazioni da giustificare un modello di saga.

## Choreography: reazioni distribuite

In choreography i componenti reagiscono agli eventi senza un coordinatore centrale del workflow. Questo può aumentare autonomia e consentire l’aggiunta di subscriber indipendenti. Il costo emerge quando il business process diventa difficile da vedere: regole e recovery si distribuiscono tra consumer, il debugging end-to-end peggiora e possono comparire event chain o loop che nessuno possiede interamente.

Microsoft Choreography pattern evidenzia proprio rischi di schema evolution, ordering, idempotency e catene emergenti.

Fonte:

- [Microsoft Learn — Choreography pattern](https://learn.microsoft.com/azure/architecture/patterns/choreography)

Choreography ha un buon fit quando le reaction sono realmente indipendenti e non esiste un workflow centrale che il business debba poter leggere passo per passo.

## Orchestration: progressione esplicita

In orchestration un componente conosce la progressione del processo. Questo rende più visibili stato, timeout, retry, compensazioni e manual intervention. In cambio l’orchestrator diventa un componente importante e può accumulare troppo dominio se confondiamo “coordinare” con “possedere tutte le business rule”.

L’orchestrator dovrebbe possedere la progressione del processo; ogni partecipante continua a possedere i propri invarianti.

Questo stile tende ad avere fit quando la sequenza è business-significant, esistono più compensation o pivot, serve audit end-to-end oppure una persona può dover intervenire in alcuni stati.

## Pivot e irreversibilità cambiano il tipo di recovery

Nei workflow economici non tutti gli step hanno lo stesso peso. Una validation può essere annullata semplicemente fermandosi. Una reservation interna può essere compensabile. L’invio del refund al provider può diventare un pivot dopo il quale “tornare indietro” non è più una rappresentazione sensata del problema.

Da quel momento il sistema deve proseguire verso un nuovo stato coerente oppure escalare. È per questo che saga e compensation sono prima di tutto **domain modeling del failure**.

## Human-in-the-loop come stato progettato

Quando l’automazione non dispone di abbastanza contesto oppure una decisione è economicamente o contrattualmente significativa, uno stato come `ManualReviewRequired` può essere più corretto di una compensazione aggressiva.

Questo principio si collega direttamente al resto del libro: l’autonomia deve essere proporzionata a reversibilità e blast radius. Una persona nel loop non è una sconfitta dell’architettura se quel passaggio è il modo più sicuro di gestire l’incertezza residua.

## Reconciliation: verificare che la convergenza sia davvero avvenuta

Retry e acknowledgement non bastano a dimostrare che due sistemi correlati siano convergenti. Una reconciliation può confrontare le escalation accettate da Order Operations con quelle osservate da Payments & Risk usando identity stabili.

Un elemento mancante downstream può essere repubblicato o investigato; un duplicato dovrebbe essere neutralizzato dall’idempotency ma può indicare un’anomalia da misurare; un record downstream senza origine nota può segnalare un bug di producer o ownership.

La reconciliation è particolarmente importante quando side effect, acknowledgement e stato attraversano sistemi differenti.

## Eventual consistency e UX devono raccontare la stessa realtà

Una UI che mostra semplicemente `Success!` quando conosce soltanto il local commit sta promettendo più del sistema. È più corretto distinguere `Escalation accepted` da `Delivery pending` e, quando esiste evidence, da `Delivered to Payments`.

La semantica dell’interfaccia deve seguire il modello reale invece di nasconderlo per sembrare più semplice.

## Il nostro scenario ESI

Per il primo flusso non introduciamo saga né orchestrator general-purpose. Usiamo outbox per la publication reliability, consumer idempotente, delivery state osservabile e reconciliation come guardrail. Se una escalation supera il business timeout o termina in DLQ, il sistema deve renderlo visibile e prevedere un recovery controllato o human escalation.

Quando arriverà un vero refund multi-domain, rivaluteremo saga/orchestration in base al comportamento funzionale, non perché il sistema ha ormai “abbastanza eventi”.

Per ogni workflow distribuito significativo dovremo essere in grado di spiegare stati intermedi, retry, idempotency, progress tracking, business timeout, compensation, pivot, reconciliation e manual intervention. Se il diagramma mostra soltanto il happy path, il workflow non è ancora progettato.