# La professione che scegliamo di mantenere

Una parte del dibattito sull'AI nel software engineering è formulata come una domanda binaria:

> l'AI sostituirà developer e architect?

È una domanda comprensibile.

Ma è anche troppo povera per essere davvero utile.

Le professioni cambiano spesso prima di sparire.

Cambiano ciò che considerano lavoro prezioso.

Cambiano il rapporto fra competenze.

Cambiano il confine fra ciò che viene prodotto direttamente e ciò che viene governato.

Per questo la domanda più utile è:

> **quali capacità vogliamo continuare a possedere quando una parte crescente dell'execution può essere delegata?**

---

## Non difendere l'atto di digitare

La professione non deve essere difesa perché una persona sa digitare codice più lentamente di un modello.

Se una parte dell'execution può essere automatizzata bene, automatizzarla è spesso un vantaggio.

Non abbiamo nostalgia per:

```text
boilerplate
rename meccanici
mapping ripetitivi
configurazione duplicata
ricerca manuale di riferimenti
```

Il valore professionale non sta nel proteggere attività che una macchina può svolgere in modo economico e verificabile.

Sta nel mantenere competenze che ci permettono di **governare ciò che viene prodotto**.

---

## Non diventare manager di qualcosa che non capiamo

Esiste però il rischio opposto.

Possiamo immaginare un futuro in cui il professionista si limita a:

```text
scrivere prompt
leggere summary
approvare PR
```

senza essere più capace di scendere nel dettaglio tecnico.

Questo sarebbe fragile.

Un manager di agenti che non sa più leggere:

```text
code path
query plan
migration
trace
IAM policy
failure mode
test oracle
```

può diventare dipendente dalla stessa execution che dovrebbe governare.

Per questo nel Capitolo 28 abbiamo insistito su una forma di profondità tecnica credibile.

> **La profondità serve a falsificare le astrazioni.**

Non dobbiamo implementare personalmente tutto.

Dobbiamo poter riconoscere quando una spiegazione elegante non coincide con il sistema reale.

---

## Studiare cambia

L'AI è anche un acceleratore straordinario di apprendimento.

Può:

- spiegare una tecnologia da più prospettive;
- costruire esempi;
- confrontare alternative;
- fare domande;
- criticare un ragionamento;
- trasformare una documentazione lunga in una mappa iniziale;
- aiutare a esplorare un linguaggio nuovo.

Ma esiste una differenza fra:

```text
aver ottenuto una spiegazione
```

e:

```text
aver costruito un modello mentale
```

Per questo abbiamo proposto:

```text
Predict
→ Ask
→ Verify
→ Reconstruct
→ Apply
→ Adversarial check
```

Il passaggio `Predict` è importante.

Provare a rispondere prima di chiedere all'AI espone ciò che sappiamo davvero.

Il passaggio `Reconstruct` è altrettanto importante.

Se dopo una spiegazione non sappiamo ricostruire il principio senza copiarla, probabilmente possediamo ancora poco della conoscenza.

---

## Deliberate manual mode

Ci sono competenze per cui ogni tanto vale la pena rimuovere intenzionalmente l'assistenza iniziale.

Non per romanticismo.

Per testare la dependency.

Per esempio:

```text
spiegare un isolation level
leggere un execution plan
ragionare su un race condition
costruire un threat model iniziale
leggere un trace distribuito
scrivere un ADR
ricostruire un failure path
```

Se possiamo svolgere queste attività soltanto quando l'AI ci guida passo dopo passo, dobbiamo sapere di avere quella dependency.

> **Una skill che esiste soltanto quando l'assistente è disponibile è una dependency. Va trattata come tale.**

Non tutte le skill devono essere mantenute allo stesso livello.

Ma le dependency cognitive devono essere scelte, non scoperte accidentalmente.

---

## Giocare fuori ruolo senza fingere competenza

L'AI rende più economico attraversare i confini professionali.

Questo è positivo.

Un architect può esplorare una proof of concept frontend.

Un backend engineer può preparare una prima Bicep baseline.

Un developer può produrre una prima analisi di cost driver.

Un Product Manager può interrogare un repository con più profondità.

Questa maggiore mobilità riduce alcuni silos.

Ma non cancella la differenza fra:

```text
esplorare
applicare
governare
assumersi authority
```

Giocare fuori ruolo significa allargare il proprio modello del sistema.

Non significa fingere che la specializzazione non esista.

---

## Accountability

Il principio più semplice del libro è anche quello che resta più difficile da aggirare.

Se una decisione entra in produzione sotto la nostra responsabilità, non possiamo difenderla dicendo:

> lo ha scritto l'AI.

Questa frase può spiegare la provenance di un artefatto.

Non risolve l'accountability.

Per questo abbiamo usato un test molto semplice:

> **Se, davanti a un errore, la nostra giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato troppo.**

Non significa che dobbiamo prevedere ogni bug.

Non significa che l'errore sia sempre individuale.

I sistemi complessi falliscono anche quando persone competenti lavorano seriamente.

Significa che dobbiamo essere capaci di spiegare:

```text
quale decisione era stata presa
quale evidence avevamo
quale limite era noto
quale guardrail è fallito
che cosa cambieremo
```

Accountability non è colpa.

È capacità di mantenere un legame fra decisione e conseguenza.

---

## Il seniority problem

L'AI può produrre artefatti che sembrano senior.

Può scrivere un ADR elegante.

Può generare codice con pattern sofisticati.

Può usare un linguaggio architetturale convincente.

Questo rende ancora più importante distinguere:

```text
senior-looking output
```

da:

```text
senior judgment
```

Il judgment emerge quando dobbiamo decidere:

- quale complessità non introdurre;
- quale requisito è ancora ambiguo;
- quale failure conta;
- quale standard non si applica bene al contesto;
- quando fermare un rollout;
- quando chiamare uno specialista;
- quale rischio possiamo accettare;
- quale evidence è ancora insufficiente.

Queste decisioni non producono sempre artefatti impressionanti.

A volte la decisione più matura è:

```text
non aggiungere una tecnologia
non estrarre un servizio
non introdurre RAG
non lanciare ancora
```

---

## Produttività

Quando l'execution aumenta, le metriche diventano pericolose.

Possiamo facilmente aumentare:

```text
linee modificate
PR
commit
issue chiuse
test generati
```

senza aumentare in modo proporzionale:

```text
outcome
reliability
maintainability
understanding
```

Nel One-Man Project abbiamo visto un problema simile.

Gli agenti possono trasformare rapidamente task in output.

Ma il lead deve ancora trasformare output in decisione, evidence e ownership.

> **Execution throughput può superare decision throughput.**

A quel punto aggiungere altri agenti peggiora il sistema.

La produttività utile non è il massimo output possibile.

È il rapporto sostenibile fra outcome, qualità, costo e capacità di continuare a cambiare.

---

## Rendere gli altri più autonomi

Nel Capitolo 28 la Capability Map ESI arrivava a un livello chiamato:

```text
L4 — Grow the system
```

La parte più interessante non era essere più competente individualmente.

Era:

```text
insegnare
costruire guardrail
creare paved road
rendere conoscenza persistente
ridurre dipendenza dall'esperto
```

Questa è forse una delle migliori definizioni di leadership tecnica.

L'architect che deve approvare tutto non ha necessariamente costruito una organizzazione ben governata.

Può avere costruito un collo di bottiglia.

> **L'architect più scalabile non prende più decisioni degli altri. Rende più decisioni sicure senza di lui.**

---

## La professione che vale la pena mantenere

Se il lavoro dell'architect fosse soltanto produrre diagrammi e boilerplate decisionale, una parte crescente potrebbe essere automatizzata.

Se il lavoro del developer fosse soltanto trasformare una specifica perfetta in sintassi, lo stesso varrebbe per una parte enorme dell'implementazione.

Ma il software engineering reale contiene:

```text
ambiguità
trade-off
ownership
failure
organizzazione
rischio
costo
apprendimento
responsabilità
```

La professione che vale la pena mantenere è quella che sa governare queste dimensioni.

Non perché l'AI non sappia aiutarci.

Proprio perché può aiutarci moltissimo.

Il valore si sposta.

Dal produrre ogni artefatto personalmente al progettare e governare sistemi capaci di produrre artefatti **senza perdere il significato che li rende corretti**.