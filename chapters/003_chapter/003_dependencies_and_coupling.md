## Dipendenze e coupling: ciò che cambia insieme

Ogni sistema contiene dipendenze. Un frontend dipende da un contratto, un servizio da uno storage, un processo di business da dati e side effect. Non possiamo eliminarle tutte, né avrebbe senso provarci. La domanda utile è **quanto costano quando il sistema cambia o fallisce**.

## Una dipendenza non è soltanto una chiamata

Quando disegniamo `A → B` stiamo mostrando una relazione evidente: A chiama B. Il coupling reale può però esistere anche in assenza di quella freccia. Due componenti possono dipendere dallo stesso schema, dalla stessa tabella o da una semantica non documentata. Possono richiedere una sequenza operativa comune, condividere una configurazione, una coda, una policy di retry, un’assunzione sull’ordering o perfino un calendario di release.

Questo coupling invisibile è particolarmente insidioso perché il diagramma può suggerire indipendenza proprio dove il cambiamento reale richiede coordinamento.

### Temporal coupling: togliere una dipendenza ne crea altre

Consideriamo due operazioni: creare un ordine e processarne il pagamento. Se devono avvenire nello stesso processo e con disponibilità simultanea dei sistemi coinvolti, abbiamo un forte **temporal coupling**. Potrebbe essere la scelta giusta. Se decidiamo invece di creare l’ordine e processare il pagamento in un secondo momento tramite evento, riduciamo quel vincolo temporale ma introduciamo eventual consistency, retry, idempotency, stati intermedi, osservabilità del workflow e recovery.

Non abbiamo eliminato la complessità. L’abbiamo spostata.

> **Ogni decoupling modifica la forma della complessità. Non la fa sparire.**

Questa frase è più utile del dogma “meno coupling è sempre meglio”, perché ci obbliga a chiedere quale coupling stiamo rimuovendo e quale stiamo accettando in cambio.

### Data coupling

Un database condiviso può rendere molto semplici query, transazioni e reporting. Se però diversi componenti dipendono direttamente dallo stesso schema, il costo di far evolvere quel modello può crescere rapidamente. Il problema non è che un database condiviso sia automaticamente sbagliato; è capire **chi dipende da quale parte del modello e con quale diritto di modificarla**.

Un modular monolith può avere un database unico e confini forti. Un sistema a microservizi può avere storage separati ed essere comunque rigidamente accoppiato da eventi fragili, semantiche condivise male e release coordinate. La topologia di deployment non determina da sola il coupling.

### Semantic coupling

Il coupling più difficile da vedere spesso è semantico. Due componenti possono scambiarsi un campo chiamato `status` e rispettare perfettamente lo stesso schema, pur attribuendogli significati incompatibili. Per uno `completed` può voler dire “pagato”; per un altro “consegnato”. Il contratto sintattico è valido, ma il sistema non condivide la stessa realtà.

Con gli agenti questo rischio aumenta perché i modelli inferiscono significati plausibili da nomi, esempi e precedenti. Se il repository è ambiguo, l’AI può propagare l’ambiguità con grande coerenza. Per questo un contratto importante deve descrivere non soltanto il tipo dei dati, ma anche ciò che quei dati **significano**.

### Change coupling: la storia racconta l’architettura reale

Un modo pratico per trovare coupling nascosto è osservare ciò che cambia insieme. Se ogni modifica a Orders richiede interventi in Payments, se una schema migration costringe più consumer ad aggiornarsi nello stesso rilascio o se un test end-to-end crolla ogni volta che tocchiamo una parte apparentemente locale, stiamo osservando una relazione che il diagramma forse non mostra.

Possiamo chiamare **change coupling** questa tendenza a richiedere modifiche coordinate. Non dimostra automaticamente che il design sia sbagliato: alcune responsabilità sono realmente legate. Ci dice però che l’indipendenza dichiarata deve essere confrontata con il comportamento del repository, dei team e delle release.

La cronologia dei cambiamenti può raccontare l’architettura reale meglio di una fotografia statica.

## La direzione della dipendenza

Una dipendenza non pesa soltanto per il fatto di esistere. Conta anche chi conosce chi e chi definisce il contratto.

Se il dominio ordini incorpora direttamente il modello di un payment provider, un cambio del provider può propagarsi nella business logic. Se invece il dominio dipende da una capability interna e un adapter traduce il provider verso quel contratto, il provider continua a esistere ma non possiede automaticamente il nostro modello.

```text
Order domain → Payment capability
                    ↑
             Provider adapter
```

Non abbiamo reso il sistema indipendente dal pagamento. Abbiamo deciso **dove deve terminare l’influenza del dettaglio esterno**. Questa idea tornerà quando parleremo di dependency inversion, modularità e anti-corruption layer.

## Fan-in, fan-out e concentrazione del rischio

Due domande aiutano a capire dove il sistema concentra dipendenze. Il **fan-out** ci chiede da quante cose dipenda un componente per completare il proprio lavoro; il **fan-in** quante parti del sistema dipendano da lui.

Valori elevati non sono automaticamente errori. Un identity provider può avere naturalmente un fan-in enorme; un orchestratore può avere un fan-out significativo. Sono segnali che indicano dove il failure o il cambiamento possono propagarsi più facilmente e dove servono contratti, osservabilità e recovery proporzionati.

## Coupling e autonomia degli agenti

La rete di dipendenze attraversata da un task dovrebbe influenzare il livello di autonomia che concediamo all’agente. Una modifica interna, confinata e reversibile può essere delegata con guardrail relativamente leggeri. Una feature che attraversa schema condiviso, API pubblica, pagamenti, eventi e autorizzazione non è “un task grande” soltanto per il numero di file: attraversa più ownership e più failure domain.

In quel caso servono più context engineering, acceptance criteria e review indipendente; può diventare necessario un ADR o uno specialist gate. Il principio non è impedire agli agenti di fare cambiamenti ampi. È un altro:

> **Più estesa è la rete di dipendenze coinvolta, più esplicito deve diventare il reasoning che governa il cambiamento.**

## Il coupling che vogliamo

Non tutto il coupling è accidentale. Concetti che appartengono alla stessa responsabilità devono condividere invarianti; una transazione deve legare elementi che devono cambiare insieme. Il problema nasce quando il coupling è invisibile, non proporzionato al beneficio o contrario ai confini che crediamo di avere.

L’obiettivo non è costruire un sistema in cui nulla dipende da nulla. È scegliere dipendenze che possiamo spiegare, osservare e far evolvere.

> **L’architettura non elimina le dipendenze. Decide quali dipendenze siamo disposti a pagare.**
