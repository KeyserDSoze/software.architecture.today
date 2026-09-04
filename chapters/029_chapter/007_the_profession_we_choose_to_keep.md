# La professione che scegliamo di mantenere

Una parte del dibattito sull'AI nel software engineering viene compressa in una domanda binaria: l'AI sostituirà developer e architect?

È comprensibile, ma poco utile. Le professioni cambiano spesso prima di sparire. Cambiano ciò che considerano lavoro prezioso, il rapporto fra competenze e il confine fra ciò che viene prodotto direttamente e ciò che viene governato.

La domanda migliore è:

> **Quali capacità vogliamo continuare a possedere quando una parte crescente dell'execution può essere delegata?**

## Non difendere l'atto di digitare

Non abbiamo bisogno di proteggere boilerplate, rename meccanici, mapping ripetitivi o ricerca manuale di riferimenti come se fossero l'essenza della professione.

Se un'attività può essere automatizzata in modo economico e verificabile, automatizzarla è spesso progresso.

Il valore professionale non sta nel fare manualmente ciò che una macchina può fare bene. Sta nel mantenere le capacità che ci permettono di capire, verificare e governare ciò che viene prodotto.

## Non diventare manager di qualcosa che non comprendiamo

L'estremo opposto sarebbe altrettanto fragile: professionisti ridotti a scrivere prompt, leggere summary e approvare PR senza saper più attraversare code path, migration, trace, IAM policy, query plan, failure mode o test oracle.

Un manager di agenti che non può falsificare le astrazioni diventa dipendente dalla stessa execution che dovrebbe governare.

Per questo la profondità tecnica resta importante.

> **La profondità serve a falsificare le astrazioni.**

Non serve implementare personalmente ogni feature. Serve riconoscere quando una spiegazione elegante non coincide con il sistema reale.

## L'apprendimento deve produrre modelli mentali

L'AI accelera l'apprendimento: può spiegare una tecnologia, costruire esempi, confrontare alternative e criticare un ragionamento. Ma ottenere una spiegazione non equivale ad avere costruito un modello mentale.

Da qui il ciclo `Predict → Ask → Verify → Reconstruct → Apply → Adversarial check` del Capitolo 28.

Provare a prevedere prima di chiedere espone ciò che sappiamo davvero. Ricostruire dopo la spiegazione mostra se la conoscenza è diventata nostra oppure è rimasta dipendente dalla risposta.

Il deliberate manual mode non è nostalgia. È un test della dependency cognitiva.

> **Una skill che esiste soltanto quando l'assistente è disponibile è una dependency. Va trattata come tale.**

Non tutte le competenze devono essere mantenute allo stesso livello. Ma dobbiamo sapere quali stiamo scegliendo di esternalizzare.

## Attraversare i ruoli senza fingere che siano scomparsi

L'AI rende più economico per un architect esplorare frontend, per un backend engineer preparare IaC o per un developer costruire una prima analisi di cost driver. Questa mobilità è positiva perché riduce alcuni silos.

Non cancella però la differenza fra esplorare, applicare, governare e possedere authority.

Giocare fuori ruolo serve ad allargare il modello del sistema. Non a fingere che specialisti, ownership e responsabilità siano diventati inutili.

## Accountability non può essere scaricata sulla provenance

Se una decisione entra in produzione sotto la nostra responsabilità, "lo ha scritto l'AI" può spiegare da dove arriva un artefatto. Non spiega perché abbiamo ritenuto sufficiente l'evidence per accettarlo.

> **Se, davanti a un errore, la nostra giustificazione è "lo ha scritto l'AI", abbiamo probabilmente delegato troppo.**

Accountability non significa colpa individuale. I sistemi complessi falliscono anche quando persone competenti lavorano bene.

Significa mantenere il legame fra decisione e conseguenza: quale scelta avevamo fatto, quale evidence avevamo, quale limitation era nota, quale guardrail è fallito e che cosa deve cambiare.

## Senior-looking output non è senior judgment

L'AI può produrre un ADR elegante, codice sofisticato e una review che suona senior. Questo rende più importante distinguere la qualità retorica dell'output dalla qualità del judgment.

Il judgment appare spesso in decisioni meno spettacolari: non estrarre un servizio, non introdurre RAG, non aggiungere una nuova piattaforma, non fare cutover ancora, chiamare uno specialista, mantenere un fallback più a lungo.

La seniority non si vede soltanto da ciò che una persona sa aggiungere. Si vede anche da ciò che sa non aggiungere e dal motivo per cui sa fermarsi.

## Produttività oltre il volume

Con l'AI possiamo aumentare linee modificate, PR, issue chiuse e test generati senza aumentare nella stessa misura outcome, reliability, maintainability o understanding.

Nel One-Man Project abbiamo visto la tensione più chiaramente:

> **Execution throughput può superare decision throughput.**

Quando accade, aggiungere altri agenti può aumentare backlog di review, rework e ambiguity invece del valore consegnato.

La produttività utile è il rapporto sostenibile fra outcome, qualità, costo e capacità di continuare a cambiare.

## Leadership tecnica come riduzione della dipendenza

La Capability Map ESI termina con `L4 — Grow the system`: insegnare, costruire guardrail, creare paved road, rendere la conoscenza persistente e ridurre la dipendenza dall'esperto.

È una definizione importante di leadership tecnica.

Un architect che deve approvare tutto può sembrare centrale e avere costruito un sistema fragile.

> **L'architect più scalabile non prende più decisioni degli altri. Rende più decisioni sicure senza di lui.**

## La professione che vale la pena mantenere

Se il lavoro dell'architect fosse soltanto produrre diagrammi e boilerplate decisionale, una parte crescente sarebbe automatizzabile. Se il lavoro del developer fosse soltanto trasformare specifiche perfette in sintassi, lo stesso varrebbe per gran parte dell'implementation.

Il software engineering reale, però, contiene ambiguità, trade-off, ownership, failure, rischio, costo, organizzazione, apprendimento e responsabilità.

La professione che vale la pena mantenere è quella che sa governare queste dimensioni anche mentre l'AI ne accelera l'execution.

Il valore si sposta dal produrre ogni artefatto personalmente al progettare e governare sistemi capaci di produrre artefatti **senza perdere il significato che li rende corretti**.
