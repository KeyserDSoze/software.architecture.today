## Foundation Before Execution senza trasformarlo in waterfall

A questo punto possiamo precisare il principio centrale del capitolo.

> **Prima capire, poi costruire.**

Preso alla lettera, potrebbe sembrare impossibile.

Non possiamo capire tutto prima di costruire.

Spesso costruiamo proprio per imparare.

Un prototipo può rivelare limiti che nessun documento avrebbe mostrato.

Una spike tecnica può verificare un'assunzione.

Un test con utenti può smentire il nostro problem framing.

Una prima implementazione può mostrare che un requisito era troppo costoso o formulato male.

Quindi il principio non significa:

```text
prima conoscenza completa
poi implementation completa
```

Significa:

```text
prima abbastanza comprensione per il rischio che stiamo per assumere
poi execution controllata
poi nuova evidenza
poi nuova decisione
```

### Build to learn vs build to ship

Una distinzione utile è tra due forme di execution.

**Build to learn**

Costruiamo qualcosa per ridurre incertezza.

Può essere un prototipo o uno spike, un benchmark o una proof of concept, una simulazione, un test di integrazione o un esperimento con utenti. Il suo criterio di successo è l'apprendimento.

**Build to ship**

Costruiamo qualcosa destinato a diventare parte del prodotto o della piattaforma.

Il suo criterio di successo include qualità, operabilità, sicurezza, evolvibilità e ownership.

Confondere le due cose è pericoloso.

Un prototipo che dimostra fattibilità non è automaticamente una base produttiva.

Una spike può essere deliberatamente brutta.

Il problema nasce quando il codice usa-e-getta diventa production perché “ormai funziona”.

### Il livello di foundation dipende dal blast radius

Possiamo immaginare una relazione semplice:

```text
più alto il costo di errore o inversione
→ più foundation prima dell'execution
```

Per esempio:

**Basso rischio**

- copy UI;
- piccola automazione interna;
- prototipo isolato;
- refactoring locale coperto da test.

Qui può bastare una issue chiara.

**Rischio medio**

- nuova feature persistente;
- nuovo contratto API;
- integrazione esterna;
- modifica a un flusso importante.

Qui un Problem & Outcome Brief e acceptance criteria espliciti diventano molto utili.

**Alto rischio**

- schema dati difficile da invertire;
- security boundary;
- pagamento;
- multi-tenant isolation;
- migration di produzione;
- nuovo modello di consistency;
- dipendenza infrastrutturale condivisa;
- cambiamento con forte blast radius.

Qui servono più decisioni esplicite e artefatti specializzati.

Non perché il progetto “è enterprise”.

Perché l'errore costa di più.

### One-way door e two-way door

Approfondiremo più avanti questa distinzione.

Per ora basta un modello mentale.

Una **two-way door** è una scelta relativamente semplice da invertire.

Una **one-way door** è costosa o rischiosa da invertire.

Se stiamo scegliendo il testo di un bottone, possiamo sperimentare rapidamente.

Se stiamo decidendo come partizionare dati destinati a crescere enormemente, serve più analisi.

L'AI riduce il costo di implementare entrambe.

Non riduce necessariamente il costo di invertire entrambe.

Questo è uno dei motivi per cui la capacità di produrre software non elimina l'architettura.

La rende più selettiva.

Dobbiamo capire **quali decisioni meritano davvero tempo**.

### La foundation come checkpoint, non come fase chiusa

Non dobbiamo immaginare:

```text
requirements complete
→ architecture complete
→ development complete
→ test complete
```

Un flusso più realistico è:

```text
problem framing
→ prima decisione
→ execution
→ evidenza
→ aggiornamento del contesto
→ nuova decisione
→ nuova execution
```

Il brief può cambiare.

I requisiti possono essere raffinati.

Lo scope può restringersi.

Un'assunzione può cadere.

Un NFR può diventare significativo soltanto dopo aver misurato il sistema.

Quello che non vogliamo è un flusso in cui il codice diventa l'unico luogo in cui queste scoperte vengono registrate.

### Quando fermare il framing

Esiste anche l'overanalysis.

Possiamo continuare a fare domande indefinitamente.

Per evitarlo, possiamo usare un **decision readiness check**.

Prima di iniziare execution significativa, chiediamo:

1. Sappiamo quale problema stiamo cercando di migliorare?
2. Sappiamo per chi?
3. Sappiamo quale outcome ci interessa?
4. Lo scope corrente è abbastanza chiaro?
5. I vincoli che possono cambiare la soluzione sono visibili?
6. I comportamenti essenziali sono comprensibili?
7. I failure o edge case ad alto impatto sono espliciti?
8. Sappiamo che evidenza useremo per verificare il risultato?
9. Le assunzioni più rischiose sono dichiarate?
10. Sappiamo quali decisioni sono ancora aperte?
11. Sappiamo quando l'agente o il team deve fermarsi ed escalare?

Non serve avere una risposta perfetta a tutto.

Serve sapere dove l'incertezza rimane e se siamo disposti ad assumerla.

### Foundation e velocità

La foundation viene spesso percepita come un costo aggiuntivo.

In realtà può aumentare la velocità complessiva.

Senza foundation, il lavoro tende a produrre cicli come:

```text
implementa
→ scopri ambiguità
→ interpreta
→ implementa
→ scopri conflitto
→ refactor
→ scopri vincolo
→ cambia design
→ aggiorna test
→ rispiega tutto
```

Con una foundation sufficiente, alcuni problemi vengono spostati prima:

```text
rendi esplicita l'ambiguità
→ decidi
→ delega
→ verifica
```

Non eliminiamo il cambiamento.

Riduciamo il **rework evitabile**.

### Il vero obiettivo: decision velocity

Il tempo di sviluppo non è l'unico tempo che conta.

Esiste anche il tempo necessario a prendere decisioni affidabili.

Un team può scrivere codice molto velocemente e rimanere lento perché:

- le decisioni vengono continuamente riaperte;
- nessuno sa quale documento sia autorevole;
- i requisiti cambiano senza essere resi espliciti;
- le assunzioni vengono scoperte soltanto in review;
- ogni agente deve ricostruire il contesto;
- le PR diventano il luogo in cui discutere product, architecture e implementation contemporaneamente.

Una buona foundation aumenta la **decision velocity**.

Le persone sanno quali questioni sono già decise, quali sono aperte e quali richiedono escalation.

Gli agenti possono lavorare con più autonomia perché il campo di gioco è più definito.

### Il test dell'utilità

Ogni artefatto introdotto in questo libro dovrà superare una domanda:

> **Questo documento modifica o migliora una decisione?**

Se la risposta è no, probabilmente è documentation theater.

Il Problem & Outcome Brief deve aiutarci a:

- non costruire la cosa sbagliata;
- evitare scope accidentale;
- distinguere vincoli da preferenze;
- produrre acceptance criteria;
- rendere visibili assunzioni;
- delegare senza trasferire decisioni implicite.

Se non fa almeno una di queste cose, possiamo farne a meno.

### Cosa viene dopo

Ora abbiamo una foundation.

Ma non abbiamo ancora un sistema.

Nel prossimo capitolo faremo un salto di prospettiva.

Smetteremo di guardare la feature come una lista di requisiti locali e inizieremo a chiederci:

- quali attori partecipano al comportamento?
- quali confini esistono?
- quali dipendenze stiamo introducendo?
- dove si propaga un fallimento?
- quali feedback loop si creano?
- quale parte del sistema possiede davvero una responsabilità?

In altre parole, passeremo da:

> **capire il problema**

alla capacità di:

> **pensare per sistemi.**

La foundation non ci dà la soluzione.

Ci dà qualcosa di più utile in questa fase:

> **un problema che vale la pena progettare.**