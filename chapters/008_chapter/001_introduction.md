# Capitolo 8 — Il monolite non è il nemico

La parola *monolite* viene spesso usata come diagnosi.

Non come descrizione di una topologia, ma come spiegazione automatica di tutto ciò che non funziona: deploy rischiosi, modifiche che attraversano troppe aree, database senza ownership, test lenti, team che devono coordinarsi per ogni cambiamento.

A quel punto la conclusione arriva quasi da sola:

> “Il problema è che è un monolite.”

A volte il singolo deployable è davvero parte del problema.

Molto spesso è soltanto il luogo in cui altri problemi sono diventati visibili.

Il coupling può essere incontrollato. I confini possono essere deboli. Le responsabilità possono essere distribuite senza una fonte autorevole. Il database può essere diventato l'API implicita dell'intero sistema. Il rilascio può essere fragile perché non esistono test e automazione sufficienti.

Tutte queste cose possono accadere dentro un monolite.

Possono accadere anche dentro trenta microservizi.

Un sistema non diventa modulare soltanto perché le sue parti comunicano via rete.

## Due decisioni che spesso confondiamo

Il punto di partenza del capitolo è distinguere due assi:

```text
modularità logica
≠
distribuzione fisica
```

La modularità logica riguarda responsabilità, ownership, contratti, dependency direction e capacità di contenere il cambiamento.

La distribuzione fisica riguarda processi, deployable, storage, runtime, rete, scaling e failure domain.

Possiamo avere confini logici forti dentro un singolo processo.

Possiamo avere confini logici debolissimi fra servizi formalmente indipendenti.

Questa distinzione cambia la domanda architetturale.

Non dobbiamo più chiederci se “passare ai microservizi”.

Dobbiamo capire **quale proprietà non riusciamo più a ottenere bene con la topologia attuale e quale costo siamo disposti a pagare per ottenerla**.

## Il monolite non è una categoria unica

Un singolo deployable può contenere sistemi radicalmente differenti.

Possiamo avere un'applicazione in cui ogni area modifica qualsiasi tabella, importa qualsiasi package e replica regole in punti diversi. Questo sistema è difficile da cambiare, ma non perché il processo sia uno. È difficile perché il confine interno è quasi inesistente.

Oppure possiamo avere:

```text
Application
├── Orders
├── Payments
├── Shipping
└── Identity
```

con ownership chiara, API interne intenzionali e regole che impediscono a un modulo di attraversare liberamente gli internals degli altri.

Questo è un **modular monolith**.

La separazione operativa è piccola.

La separazione semantica può essere molto forte.

Non è un microservizio “non ancora finito”. È una topologia completa che può avere un ottimo fit per anni, oppure per sempre, se le proprietà richieste restano compatibili con un deployable condiviso.

## Perché allora distribuire?

Perché a volte un boundary logico deve comprare anche autonomia operativa.

Un servizio separato può essere rilasciato con una cadence indipendente, scalare con un profilo diverso, usare un security boundary più forte o contenere meglio alcuni failure. Può permettere a un team di possedere una capability end-to-end e modificare la propria implementazione senza coordinare continuamente il resto dell'organizzazione.

Queste sono proprietà reali.

Ma non emergono automaticamente dal fatto che abbiamo creato un container.

Se due servizi devono essere sempre rilasciati insieme, la deployability indipendente è nominale. Se leggono e scrivono le stesse tabelle, la data ownership è ancora condivisa. Se una request non può completarsi senza cinque chiamate sincrone, il failure domain percepito dall'utente può rimanere quasi unico. Se ogni feature attraversa molti team, l'autonomia organizzativa non esiste davvero.

In quel caso abbiamo pagato rete, timeout, tracing distribuito, versioning, pipeline e incident coordination senza comprare abbastanza indipendenza.

È così che nasce il **distributed monolith**.

## La complessità non scompare: cambia posizione

Un monolite concentra gran parte della complessità nel codice e nel deployable.

Distribuire sposta una parte di quella complessità verso networking, service discovery e autenticazione tra servizi. La sposta verso data consistency e contract evolution, observability distribuita, retry e timeout, deployment e recovery. La sposta anche verso platform engineering, on-call e capacità organizzativa di possedere più unità operative.

La distribuzione può essere una scelta eccellente.

Ma deve comprare abbastanza valore da pagare questo spostamento.

È lo stesso principio che abbiamo usato per le tecnologie e per i pattern:

> **fit before fashion.**

## Il boundary viene prima della rete

Nei capitoli precedenti abbiamo identificato in Order Operations responsabilità distinte come Orders, Payments e Shipping.

Questo è già un risultato architetturale.

Non implica ancora:

```text
Orders Service
Payments Service
Shipping Service
```

Un confine logico ben costruito ci permette di osservare il sistema prima di distribuire. Possiamo vedere quali moduli cambiano con cadence diverse, quali hanno profili di carico differenti, quali failure meritano isolamento più forte, quali security boundary sono davvero distinti e dove emerge ownership organizzativa stabile.

Poi possiamo scegliere se aggiungere un boundary operativo.

Questa sequenza preserva reversibilità.

Un buon modulo può diventare un servizio in futuro.

Un confine sbagliato trasformato subito in rete diventa invece più costoso da correggere.

## La domanda del capitolo

Non cercheremo una risposta universale alla domanda “monolite o microservizi?”.

La domanda utile è:

> **Quale topologia permette ai nostri confini di produrre le proprietà che servono davvero, pagando un costo operativo e cognitivo che l'organizzazione può sostenere?**

Per rispondere osserveremo deployability, failure isolation, scaling, data ownership e team autonomy. Vedremo come nasce un distributed monolith, quali segnali rendono credibile l'estrazione di un servizio e come Order Operations possa rimanere un modular monolith senza rinunciare all'evoluzione futura.

Con l'AI l'estrazione tecnica costa meno.

La decisione architetturale non diventa per questo meno importante.

> **Prima costruisci confini che meritano di esistere. Poi chiediti se meritano anche una rete in mezzo.**