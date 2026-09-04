## AI e decisioni architetturali

L'AI può essere molto utile nel lavoro architetturale.

Può anche renderlo più superficiale.

La differenza dipende da **quale parte del processo le deleghiamo**.

Se chiediamo:

> “Qual è l'architettura migliore per questo sistema?”

stiamo comprimendo troppo il problema.

La risposta potrebbe essere tecnicamente plausibile, ma non sappiamo quali assunzioni abbia fatto o quali requisiti stia privilegiando, quali vincoli non abbia visto, quali alternative abbia escluso e quale costo stia sottovalutando.

L'uso più interessante dell'AI non è ottenere una soluzione finale.

È aumentare la qualità del **processo decisionale**.

### AI come generatore di alternative

Una delle attività che beneficia di più dell'AI è l'esplorazione del design space.

Possiamo chiedere:

```text
Proponi tre architetture plausibili per questo problema.
Per ciascuna indica:
- requisiti che favorisce;
- costi operativi;
- failure mode;
- punti di coupling;
- condizioni in cui sarebbe una scelta sbagliata.
```

Questo riduce il rischio di innamorarsi della prima soluzione.

L'obiettivo non è avere più opzioni per forza.

È evitare che l'architettura nasca per inerzia.

### AI come adversarial reviewer

Possiamo poi invertire il ruolo.

Invece di chiedere all'AI di sostenere una soluzione, chiediamo di attaccarla.

Per esempio:

> “Assumi che questa architettura fallirà in produzione. Quali sono le cinque cause più credibili?”

Oppure:

> “Quali requisiti non sono sufficientemente coperti da questa decisione?”

Oppure:

> “Quale conseguenza negativa stiamo probabilmente minimizzando?”

Questo tipo di review è particolarmente utile perché chi ha appena progettato una soluzione tende naturalmente a difenderla.

Un secondo punto di vista abbassa il costo della critica.

### AI come detective del contesto mancante

Un altro uso utile è chiedere non una risposta, ma **domande**.

Per esempio:

```text
Prima di proporre un'architettura, elenca le informazioni mancanti che potrebbero cambiare materialmente la scelta.
```

Un buon output potrebbe chiedere quale traffico prevediamo e quanto sia critico il journey, quali RTO/RPO servano e quale modello di tenancy abbiamo. Potrebbe chiedere dimensione e competenze operative del team, presenza di dati regolamentati, pattern di lettura e scrittura, integrazioni esterne e budget. Questa è spesso una funzione più preziosa della generazione diretta di diagrammi.

### AI come reviewer degli ADR

Un ADR può essere sottoposto a review automatica.

Un agente può cercare alternative troppo deboli e conseguenze negative mancanti, trigger di revisione assenti e contraddizioni con ADR esistenti. Può evidenziare claim non supportati dal contesto, termini vaghi e costi che il ragionamento iniziale non aveva considerato.

Possiamo perfino definire un reviewer specializzato:

```text
Role: Skeptical Architecture Reviewer

Obiettivo:
non migliorare la prosa dell'ADR.
Cercare motivi per cui la decisione potrebbe essere fragile, prematura o basata su assunzioni non dichiarate.
```

L'effetto interessante è che l'AI diventa un **amplificatore del dissenso tecnico**, non soltanto della produzione.

### Il rischio della confident architecture

I modelli generativi sono bravi a produrre risposte coerenti.

La coerenza retorica può essere scambiata per correttezza.

Un diagramma ben formato, una tabella ordinata e una spiegazione fluida possono farci percepire una soluzione come più solida di quanto sia.

Questo fenomeno è particolarmente pericoloso nell'architettura perché molte decisioni non possono essere verificate immediatamente.

un'API sbagliata può fallire nei test.

Una strategia di partizionamento sbagliata può mostrare il problema mesi o anni dopo.

Una topologia di failure sbagliata può sembrare perfetta fino all'incidente giusto.

Quindi:

> **Più una decisione è costosa da verificare empiricamente, meno dobbiamo confondere la qualità della spiegazione con la qualità della scelta.**

### Architecture synthesis vs architecture judgment

L'AI può sintetizzare molto bene documentazione e requisiti, diagrammi e dipendenze, opzioni e pattern. Il judgment richiede invece priorità reali.

Per esempio:

> “È più importante ridurre il time to market o ottenere isolamento operativo?”

Non esiste una risposta universale.

Dipende dal business, dal rischio, dal team e dal momento.

Un modello può spiegare il trade-off.

Non può sostituire la responsabilità di chi decide quale lato privilegiare.

### Multi-agent architecture review

Per decisioni ad alto impatto possiamo usare più prospettive.

Per esempio:

```text
Architecture Author
      ↓
Distributed Systems Reviewer
      ↓
Security Reviewer
      ↓
Operations Reviewer
      ↓
Cost Reviewer
      ↓
Skeptical Reviewer
      ↓
Human decision
```

Non serve farlo per ogni scelta.

Sarebbe costoso e rumoroso.

Ma su una one-way door o una decisione ad alto blast radius, la capacità di generare rapidamente review indipendenti è molto interessante.

### Non trasformare il consenso tra agenti in evidenza

Cinque agenti che concordano non rendono una decisione corretta.

Potrebbero condividere lo stesso contesto incompleto o la stessa fonte non aggiornata, gli stessi bias di training o la stessa assunzione sbagliata. La diversità di ruolo aiuta, ma non crea automaticamente indipendenza epistemica.

Serve sempre chiedere:

> “Quale informazione esterna o misura reale potrebbe falsificare questa decisione?”

### Il nuovo vantaggio competitivo

Quando tutti possono generare rapidamente diagrammi, ADR e alternative, il valore non sta nel produrne di più.

Sta nel riconoscere quale decisione conta davvero e quale informazione manca, quale trade-off è reale e quale scelta è prematura. Sta nel vedere il rischio sottovalutato, sapere quando fermarsi e capire quando il contesto è cambiato abbastanza da riaprire una decisione che ieri era ragionevole.

In altre parole:

> **L'AI può aumentare enormemente la capacità di analisi architetturale. Ma il valore rimane nel judgment che ordina quell'analisi.**