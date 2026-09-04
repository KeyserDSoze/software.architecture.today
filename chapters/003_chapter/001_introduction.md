# Capitolo 3 — Pensare per sistemi

Una feature può sembrare locale per quasi tutto il tempo in cui la discutiamo e la implementiamo. Vive in una issue, in una cartella, magari in tre file soltanto. Appena entra in produzione, però, smette di essere locale: usa dati creati altrove, attraversa identità, rete, configurazione e storage, introduce nuovi stati, modifica carico e dipendenze e può fallire in modi che coinvolgono componenti che il developer della feature non ha mai aperto nel proprio editor.

È qui che comincia il pensiero sistemico. Non quando disegniamo un diagramma più grande, ma quando smettiamo di domandarci soltanto come implementare una feature e iniziamo a chiederci:

> **Che cosa cambia nel comportamento del sistema quando questa feature esiste?**

## Dal rettangolo al comportamento

Nel software è naturale ragionare per componenti: frontend, backend, database, queue, identity provider, cloud. È utile, perché abbiamo bisogno di confini per poter lavorare. Gli utenti, però, non consumano rettangoli. Attraversano **journey**.

Quando un cliente annulla un ordine, il comportamento end-to-end può attraversare interfaccia, API, autorizzazione, dominio ordini, persistenza, pagamento, logistica, notifiche e analytics. La feature si chiama “annulla ordine”; il sistema è la rete di responsabilità necessaria affinché quell’azione sia corretta anche quando una parte rallenta, fallisce o risponde in un ordine diverso da quello che avevamo immaginato.

```text
utente
→ frontend
→ API
→ autorizzazione
→ dominio ordini
→ database
→ pagamento
→ logistica
→ notifica
→ analytics
```

Guardare soltanto il controller HTTP può quindi portarci a dichiarare completato un lavoro che ha lasciato indefinito il comportamento più importante.

### Le proprietà emergono nelle relazioni

Due componenti possono essere corretti individualmente e produrre insieme un risultato sbagliato. Il servizio di pagamento può rimborsare correttamente e quello ordini può annullare correttamente un ordine; il problema emerge se il rimborso riesce e il salvataggio dell’ordine fallisce, oppure se lo stato cambia prima che la logistica possa essere fermata.

A quel punto dobbiamo capire quale verità mostrare all’utente, se l’operazione possa essere ripetuta senza un secondo rimborso, come rappresentare uno stato intermedio e chi debba recuperare il workflow. Nessuna di queste proprietà appartiene interamente a un singolo servizio. Esiste **nell’interazione**.

Questa è una caratteristica fondamentale dei sistemi: alcune proprietà diventano visibili soltanto quando osserviamo le relazioni tra le parti.

## Il rischio del pensiero locale

Il pensiero locale non è un errore. È necessario per poter ragionare su una funzione, un modulo o un servizio senza tenere l’intero mondo in testa. Diventa pericoloso quando scambiamo la correttezza locale per correttezza end-to-end.

Un indice aggiunto per accelerare una query può aumentare il costo delle write. Un retry introdotto per migliorare l’affidabilità può moltiplicare il carico durante un outage. Una cache può ridurre latency e contemporaneamente introdurre dati stantii nel punto in cui una decisione richiede freshness. Un timeout più lungo può nascondere errori a breve termine e consumare risorse fino a peggiorare una cascata di failure. Lo stesso vale per locking, ordering, autorizzazioni, side effect, osservabilità e costi operativi: una modifica apparentemente locale può cambiare il comportamento di una rete molto più ampia.

La riga modificata raramente contiene da sola tutte le sue conseguenze.

## L’AI amplifica il bisogno di vedere il sistema

Gli agenti sono particolarmente efficaci quando il task ha un perimetro locale chiaro. Possiamo indicare una directory, una issue, un test fallito o una funzione e ottenere rapidamente una modifica plausibile. La domanda architetturale viene prima: **quel perimetro rappresenta davvero il problema?**

Un agente può ottimizzare una query senza sapere che la tabella alimenta una pipeline batch notturna, aggiungere un retry senza conoscere il rate limit a valle o estrarre un modulo senza rendersi conto che il nuovo confine attraversa una transazione che prima era locale. Può introdurre una cache senza conoscere il requisito di freshness. In molti casi non è un limite della capacità di generazione, ma del contesto che abbiamo reso disponibile.

> **Un agente vede il sistema nella misura in cui il sistema è stato reso visibile.**

Nei capitoli precedenti abbiamo costruito una foundation e discusso di context engineering. Ora allarghiamo quel contesto: non più soltanto file, requisiti e documenti, ma responsabilità, dipendenze, flussi, ownership, trust boundary e failure domain.

## Quanto deve essere grande il sistema che osserviamo?

Pensare per sistemi non significa modellare tutta l’azienda prima di cambiare una riga di codice. Il sistema rilevante dipende dalla decisione. Per correggere il testo di un’etichetta basta un perimetro minimo; per cambiare il processo di pagamento bisogna seguire una catena molto più ampia di dati, attori, dipendenze e conseguenze.

Una domanda ci aiuta a scegliere il livello di zoom:

> **Se questa modifica fosse sbagliata, fin dove potrebbe propagarsi?**

Più ampia è la risposta, più ampio deve diventare il contesto che prendiamo in considerazione. Non cerchiamo completezza assoluta; cerchiamo **sufficiente ampiezza rispetto al rischio**.

## Ciò che cercheremo nel capitolo

Nei prossimi passaggi impareremo a scegliere il system of interest e a distinguere ciò che controlliamo dal suo ambiente. Vedremo come rendere visibili dependency e coupling che un diagramma di chiamate può non mostrare, come seguire un critical user journey dal punto di vista dell’utente e come riconoscere feedback loop e failure domain che cambiano il comportamento complessivo.

L’obiettivo sarà condensare queste informazioni in una **Architecture Context Map**: non una fotografia totale del sistema, ma una vista costruita per sostenere una decisione. Nel caso Order Operations useremo la mappa per far emergere ownership, freshness, dipendenze e failure topology prima di scegliere una tecnologia. Infine vedremo come l’AI possa accelerare questa discovery senza trasformare una mappa generata in una verità non verificata.

Il principio di partenza è semplice:

> **Una feature può essere locale nel diff. In produzione, le sue conseguenze raramente lo sono.**
