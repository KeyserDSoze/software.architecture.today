# Capitolo 2 — Prima del codice

Nel capitolo precedente abbiamo visto che l'AI rende l'execution più economica e più veloce.

Questa è una buona notizia.

Ma introduce una conseguenza scomoda: **possiamo iniziare a costruire molto prima di avere capito abbastanza bene che cosa stiamo costruendo.**

Per anni molti progetti software sono stati rallentati da limiti di execution: servivano tempo, persone, ambienti, boilerplate, configurazioni, prototipi, integrazioni.

Oggi una parte di quel costo può essere compressa drasticamente.

Possiamo passare da un'idea a una demo in ore.

Possiamo generare un endpoint, una UI, una migration, un set di test, una pipeline e una prima infrastruttura quasi nello stesso pomeriggio.

Il problema è che la velocità con cui possiamo produrre una soluzione non ci dice nulla sulla qualità del problema che abbiamo formulato.

Un requisito sbagliato implementato perfettamente resta sbagliato.

Una feature inutile generata in cinque minuti è soltanto una feature inutile arrivata prima.

Un'architettura costruita su assunzioni non esplicitate non diventa migliore perché è stata prodotta rapidamente.

Questo capitolo riguarda quindi ciò che viene **prima** dell'architettura tecnica.

Non i diagrammi.

Non il framework.

Non il database.

Non il cloud provider.

Prima ancora dobbiamo sapere:

- quale problema stiamo cercando di risolvere;
- per chi;
- quale outcome ci interessa;
- quale parte del problema è davvero nel nostro scope;
- quali vincoli non possiamo ignorare;
- quali comportamenti devono esistere;
- quali qualità devono essere misurabili;
- che cosa significa, concretamente, poter dire che abbiamo finito.

Questa fase non è un rito preliminare.

È **compressione dell'ambiguità**.

### Il falso dilemma: progettare tutto o partire subito

Quando si parla di lavoro “prima del codice”, emerge spesso una reazione comprensibile.

> “Non voglio passare tre mesi a scrivere documenti prima di scoprire se l'idea funziona.”

Giusto.

Questo libro non difende una progettazione totale e anticipata.

Non propone di congelare requisiti che ancora non conosciamo.

Non propone di prevedere ogni edge case prima di scrivere la prima riga di codice.

Il dilemma tra:

```text
specificare tutto prima
```

e:

```text
iniziare a scrivere subito
```

è falso.

La domanda utile è un'altra:

> **Qual è il minimo livello di comprensione che rende ragionevole iniziare questa execution?**

Per un prototipo usa-e-getta può essere pochissimo.

Per una migration irreversibile può essere molto.

Per una modifica a un sistema di pagamento serve più chiarezza che per cambiare un colore nell'interfaccia.

Per una feature interna a dieci utenti possiamo tollerare assunzioni che non accetteremmo su un sistema sanitario o finanziario.

La quantità di foundation deve essere proporzionata al rischio.

### Foundation Before Execution

Useremo spesso questa espressione:

> **Foundation Before Execution.**

Non significa “documentazione prima del lavoro”.

Significa:

> **ridurre abbastanza l'incertezza sulle decisioni importanti prima di moltiplicare la capacità di esecuzione.**

La foundation minima può includere:

```text
Problema
Utenti
Outcome
Scope
Vincoli
Requisiti funzionali principali
Requisiti non funzionali significativi
Assunzioni
Acceptance criteria
Out of scope
```

La parola importante è **significativi**.

Non dobbiamo specificare ciò che non serve ancora.

Dobbiamo rendere esplicito ciò che, se lasciato implicito, potrebbe portare persone o agenti a costruire sistemi diversi credendo di lavorare allo stesso prodotto.

### Una cattiva foundation viene amplificata

Con un singolo developer, un requisito ambiguo può produrre una interpretazione sbagliata.

Con cinque agenti in parallelo può produrne cinque.

Immaginiamo questa richiesta:

> “Aggiungi la possibilità di annullare un ordine.”

Sembra semplice.

Ma contiene molte decisioni nascoste.

Chi può annullarlo?

Fino a quando?

Che cosa succede se è già stato pagato?

Che cosa succede se è già in spedizione?

Che cosa significa “annullato” per il magazzino?

Il pagamento viene rimborsato?

Il rimborso può fallire?

L'operazione deve essere idempotente?

Gli altri sistemi devono ricevere un evento?

Il cliente può riprovare?

Se non rispondiamo almeno alle domande che cambiano il comportamento del sistema, l'agente deve farlo al posto nostro.

E farà qualcosa di plausibile.

Il problema è proprio questo.

Una decisione plausibile non è necessariamente la nostra decisione.

### Il costo invisibile delle assunzioni

Le assunzioni implicite hanno una caratteristica pericolosa: spesso non compaiono nel diff.

Vediamo il codice introdotto.

Vediamo una tabella nuova.

Vediamo un endpoint.

Ma non vediamo immediatamente la frase non scritta che ha prodotto quella soluzione:

> “Ho assunto che un ordine possa essere annullato fino alla spedizione.”

Oppure:

> “Ho assunto che il rimborso sia sincrono.”

Oppure:

> “Ho assunto che soltanto il proprietario dell'ordine possa eseguire l'operazione.”

L'architettura nasce spesso da queste frasi invisibili.

Per questo, prima del codice, dobbiamo imparare a portarle alla luce.

### Dal prompt al brief

Nel capitolo precedente abbiamo criticato il *prompt-first development*.

La risposta non è scrivere prompt infinitamente più lunghi.

È costruire un piccolo insieme di artefatti che rendano il contesto stabile e verificabile.

Il primo sarà il **Problem & Outcome Brief**.

Non è una specifica completa.

È una pagina — a volte meno — che deve permettere a chiunque, umano o agente, di capire:

- quale situazione vogliamo cambiare;
- per chi;
- quale outcome ci dirà che abbiamo creato valore;
- cosa stiamo facendo adesso;
- cosa non stiamo facendo;
- quali vincoli sono già noti;
- quali assunzioni richiedono verifica.

Il suo scopo non è descrivere la soluzione.

È impedire che la soluzione preceda il problema.

### Il caso Acme Orders

Nel capitolo precedente abbiamo introdotto **Acme Orders**, un caso simulato/composito che accompagnerà il libro.

Abbiamo visto un piccolo prodotto che iniziava a crescere attraverso richieste apparentemente semplici.

Da questo capitolo smettiamo di aggiungere feature per inerzia.

Torniamo all'inizio.

Non per buttare il prototipo.

Per capire che cosa stiamo realmente cercando di costruire.

È un passaggio importante.

Molti progetti reali non iniziano da una pagina bianca.

Iniziano da qualcosa che esiste già e funziona abbastanza da generare nuove domande.

“Prima del codice” non significa quindi sempre cronologicamente prima della prima riga.

Può significare:

> **prima della prossima decisione costosa.**

Ed è lì che iniziamo.