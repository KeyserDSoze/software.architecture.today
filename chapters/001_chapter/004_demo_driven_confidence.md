## Demo-driven confidence

Una demo che funziona è pericolosamente convincente. Clicchiamo un pulsante, la schermata cambia, il record compare nel database, arriva una notifica e il test principale è verde. La tentazione è concludere che la feature funzioni.

Ma una demo dimostra una cosa molto più limitata:

> **Abbiamo osservato almeno un percorso in cui il sistema ha prodotto il risultato atteso.**

È evidenza utile, e non è poco. Non equivale però a readiness. Quando l’AI rende economico costruire prototipi completi e convincenti, questa distinzione diventa ancora più importante.

### Il percorso felice è una piccola parte del sistema

Immaginiamo una demo di checkout. L’utente aggiunge un prodotto al carrello, inserisce i dati, paga e riceve conferma. Tutto funziona.

Quello che non abbiamo ancora dimostrato è molto più ampio del percorso appena visto. Non sappiamo che cosa accada se il provider di pagamento risponde dopo trenta secondi, se il client ritenta la richiesta o se il callback arriva due volte. Non sappiamo come reagisca il sistema se il pagamento riesce ma l’ordine non viene persistito, se il prezzo cambia durante il checkout o se il prodotto non è più disponibile. Restano aperti anche i casi in cui un servizio secondario è indisponibile, il token dell’utente scade a metà flusso o il traffico diventa cento volte maggiore di quello della demo.

La demo non è falsa. È incompleta. Il problema nasce quando l’effetto visivo della completezza ci porta a sovrastimare l’evidence che possediamo.

### Il prototipo che sembra produzione

Prima dell’AI molti prototipi tradivano facilmente il proprio stato: mancavano schermate, il codice era chiaramente temporaneo, le integrazioni erano mock e documentazione o pipeline semplicemente non esistevano. Oggi un agente può produrre in poco tempo qualcosa che sembra molto più maturo: un’interfaccia curata, test, Dockerfile, logging, configurazioni, una pipeline, un README convincente e perfino infrastruttura dichiarativa.

La presenza di questi elementi è positiva, ma può generare una nuova illusione: se assomiglia a un sistema production-ready, allora probabilmente lo è.

Non funziona così. Production readiness non è una proprietà estetica del repository; è una proprietà del sistema rispetto al suo contesto operativo.

### “Ci sono i test”

La stessa illusione compare con il testing. Un agente può generare decine o centinaia di test, la suite diventa verde e la coverage cresce. Tutto questo può aumentare la nostra sensazione di sicurezza senza aumentare nello stesso modo la confidenza reale.

La domanda utile non è quanti test abbiamo, ma **quali failure importanti diventano meno probabili grazie a quei test**. Un test può essere corretto e quasi inutile, verificare una getter, replicare la struttura dell’implementazione o mockare proprio il comportamento che dovrebbe mettere alla prova. Può inoltre ignorare race condition, compatibilità, sicurezza, failure distribuiti o assunzioni di business.

La quantità di test è un output. La confidenza è una proprietà che dobbiamo argomentare.

### Demo e decisioni reversibili

Non tutte le demo richiedono lo stesso rigore. Se stiamo esplorando un’idea, possiamo deliberatamente accettare dati finti, sicurezza minima, un’architettura temporanea, dipendenze scelte per la velocità d’integrazione ed error handling incompleto. Questa può essere una scelta perfettamente ragionevole, purché il carattere temporaneo di quei compromessi resti visibile.

Il problema non è avere un prototipo fragile. È **dimenticare che è fragile**.

Può essere utile distinguere esplicitamente tra proof of concept, prototype, internal tool, beta, production workload e critical workload. Le etichette non sono universali; ciò che conta è che il livello di evidence richiesto cresca insieme al rischio e alla promessa che facciamo agli utenti.

### Il debito di promozione

Un fenomeno ricorrente è la trasformazione silenziosa del prototipo. Qualcuno lo prova, piace, comincia a usarlo, arrivano una nuova feature e nuovi utenti, finché il sistema diventa importante senza che nessuno abbia mai deciso formalmente che da quel momento in poi debba essere trattato come produzione.

Chiamiamo **debito di promozione** la distanza tra ciò per cui il sistema era stato progettato e ciò che ora gli stiamo chiedendo di sostenere. Quella distanza può nascondere autenticazione insufficiente, assenza di backup, uno schema dati improvvisato, nessun rollback, osservabilità minima, ownership incerta, costi non controllati o una gestione degli errori pensata soltanto per far riuscire il percorso felice.

L’AI può accelerare moltissimo la nascita di questo debito perché riduce il tempo necessario a far sembrare maturo un prototipo.

### Una demo dovrebbe produrre domande

Il modo migliore di usare una demo non è considerarla una prova finale, ma usarla per far emergere conoscenza. Una buona demo dovrebbe aiutarci a distinguere le assunzioni che abbiamo davvero validato da quelle ancora intatte, capire meglio utenti e dati, riconoscere i failure non ancora esplorati e separare ciò che appartiene al prodotto da ciò che era soltanto impalcatura temporanea.

Il prototipo è uno strumento di apprendimento. Quando lo trasformiamo inconsapevolmente in fondazione, il suo valore esplorativo può diventare debito architetturale.

### Definition of Done non è “si vede”

Una feature può essere visibile e non essere finita. Può funzionare nel percorso principale e avere ancora buchi importanti nella security review, nell’observability, nella backward compatibility, nel rollback, nella capacity o nei contratti. Non ogni feature richiede tutti questi controlli, ma la Definition of Done deve descrivere ciò che conta per il rischio che stiamo assumendo.

Altrimenti la demo diventa accidentalmente la nostra Definition of Done.

Da qui il bad pattern:

> **Demo-driven confidence: usare la visibilità del happy path come sostituto della prova che il sistema sia sufficientemente affidabile per il contesto in cui verrà usato.**

Il rimedio non è smettere di fare demo. È trattarle per quello che sono: evidence utile, ma parziale.
