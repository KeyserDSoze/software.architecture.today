# Capitolo 3 — Pensare per sistemi

Una feature non vive mai da sola.

Può sembrare indipendente mentre la stiamo discutendo in una issue. Può sembrare circoscritta mentre la implementiamo in una cartella. Può persino sembrare locale quando il diff modifica soltanto tre file.

Ma appena entra in produzione diventa parte di qualcosa di più grande.

Usa dati creati altrove. Dipende da identità, rete, configurazione e storage. Introduce nuovi stati. Cambia il carico su altri componenti. Produce eventi osservabili. Può fallire in modi che coinvolgono sistemi che il developer della feature non ha mai aperto nel proprio editor.

È qui che comincia il pensiero sistemico.

Non quando disegniamo un diagramma grande.

Quando smettiamo di chiedere soltanto:

> “Come implementiamo questa feature?”

E iniziamo a chiedere:

> **“Che cosa cambia nel comportamento del sistema quando questa feature esiste?”**

## Dal rettangolo al comportamento

Nei progetti software è facile ragionare per rettangoli.

Frontend.

Backend.

Database.

Queue.

Identity provider.

Cloud.

Ogni rettangolo sembra avere una responsabilità relativamente chiara.

Il problema è che gli utenti non attraversano rettangoli.

Attraversano **journey**.

Quando un cliente annulla un ordine, il comportamento reale potrebbe coinvolgere:

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

La feature è “annulla ordine”.

Il sistema è la catena di responsabilità necessaria affinché quell'azione sia corretta.

Se osserviamo soltanto il controller HTTP, possiamo dichiarare completato un lavoro che in realtà ha lasciato metà del comportamento indefinito.

### Il sistema è più della somma dei componenti

Due componenti possono essere corretti individualmente e produrre insieme un comportamento sbagliato.

Un servizio di pagamento può rimborsare correttamente.

Un servizio ordini può marcare correttamente un ordine come annullato.

Ma se il rimborso fallisce dopo che lo stato dell'ordine è già cambiato, quale verità mostriamo all'utente?

Oppure il contrario.

Se il rimborso riesce ma il salvataggio dell'ordine fallisce, possiamo ripetere l'operazione senza rischiare un secondo rimborso?

Il problema non è contenuto interamente in nessuno dei due servizi.

Emergerebbe soltanto osservando l'interazione.

Questa è una caratteristica fondamentale dei sistemi: alcune proprietà esistono **nelle relazioni**, non nei singoli elementi.

## Il rischio del pensiero locale

Il pensiero locale è molto utile.

Dobbiamo poter isolare una funzione, un modulo o un servizio e ragionare su di esso.

Diventa pericoloso quando lo confondiamo con il comportamento complessivo.

Un cambiamento locale può produrre effetti sistemici attraverso:

- carico;
- latenza;
- locking;
- schema dati;
- retry;
- cache;
- autorizzazione;
- ordering;
- side effect;
- failure propagation;
- costi;
- observability.

Un indice aggiunto per accelerare una query modifica il costo delle write.

Un retry aggiunto per aumentare affidabilità può moltiplicare il carico durante un outage.

Una cache aggiunta per ridurre latency può introdurre stale data su una decisione critica.

Un timeout aumentato per “evitare errori” può occupare risorse più a lungo e peggiorare una cascata di failure.

La maggior parte di queste conseguenze non è visibile guardando soltanto la riga modificata.

## L'AI rende ancora più importante vedere il sistema

Gli agenti sono molto bravi a lavorare su perimetri locali.

Possiamo indicare una directory, una issue, una funzione o un test fallito e ottenere rapidamente una modifica plausibile.

Ma la velocità locale può nascondere una domanda più importante:

> il task che abbiamo delegato rappresenta davvero il problema sistemico?

Un agente può ottimizzare una query senza sapere che quella tabella viene usata da una pipeline batch notturna.

Può introdurre un retry senza conoscere il rate limit del servizio a valle.

Può estrarre un modulo senza capire che il confine nuovo attraversa una transazione che prima era locale.

Può aggiungere una cache senza conoscere il requisito di freshness.

Non è necessariamente un limite del modello.

Spesso è un limite del contesto che gli abbiamo fornito.

> **Un agente vede il sistema nella misura in cui il sistema è stato reso visibile.**

Per questo nei capitoli precedenti abbiamo insistito sulla foundation e sul context engineering.

Qui facciamo un passo ulteriore.

Dobbiamo imparare a rappresentare il contesto non come una lista di file, ma come una rete di responsabilità, dipendenze, flussi e failure domain.

## Pensare per sistemi non significa progettare tutto

C'è un equivoco da evitare subito.

System thinking non significa cercare di modellare ogni relazione dell'organizzazione prima di scrivere una riga di codice.

Non significa produrre diagrammi enormi.

Non significa anticipare tutti i failure mode possibili.

Significa sapere **quanto allargare lo sguardo per la decisione che stiamo prendendo**.

Se stiamo correggendo il testo di un'etichetta, il contesto necessario è minimo.

Se stiamo modificando il processo di pagamento, lo sguardo deve essere molto più ampio.

La profondità dell'analisi deve seguire il rischio.

Possiamo usare una domanda semplice:

> **Se questa modifica fosse sbagliata, fin dove potrebbe propagarsi?**

La risposta ci suggerisce quanto grande deve essere il sistema che consideriamo.

## Le domande del capitolo

In questo capitolo useremo alcune domande ricorrenti:

1. Dove inizia e dove finisce il sistema che stiamo considerando?
2. Quali attori esterni lo influenzano?
3. Quali dipendenze sono sincrone e quali asincrone?
4. Qual è il critical user journey?
5. Dove sono le fonti di verità?
6. Quali feedback loop esistono?
7. Quali componenti condividono lo stesso failure domain?
8. Dove esiste coupling che il diagramma non mostra?
9. Quali cambiamenti locali possono avere conseguenze non locali?
10. Quale parte di questo contesto deve essere resa esplicita agli agenti?

Il nostro obiettivo non è creare una mappa perfetta.

È costruire una mappa abbastanza buona da prendere decisioni migliori.

Il principio di partenza è:

> **Una feature è locale soltanto finché non interagisce con il resto del sistema. In produzione, quasi nulla rimane davvero locale.**
