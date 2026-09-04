# Software Architecture Today — v1.0.0-rc4

Questa release candidate è una **preview editoriale focalizzata sul solo Capitolo 0 — Al timone**.

## Perché esiste RC4

RC3 aveva introdotto un primo pass *prose-first* sui Capitoli 0–9, ma il feedback di lettura ha mostrato che il problema “lista della spesa” non dipendeva soltanto dai bullet espliciti. Anche sequenze di paragrafi molto brevi, domande isolate e micro-enumerazioni producevano un ritmo simile a documentazione o slide espanse, con molto spazio bianco e poco senso di continuità narrativa.

RC4 serve quindi a stabilizzare **un solo capitolo** prima di applicare ulteriori revisioni al resto del libro.

## Che cosa cambia nel Capitolo 0

Il Capitolo 0 è stato riletto integralmente con una regola più severa:

> **la prosa narrativa è il default; la struttura a lista deve avere una funzione editoriale precisa.**

Sono stati quindi trasformati in paragrafi continui:

- cataloghi di capacità o rischi che non richiedevano scansione puntuale;
- sequenze di domande usate come semplice sviluppo del ragionamento;
- serie di paragrafi da una sola frase che producevano un effetto visivo simile a una lista;
- esempi e conseguenze che funzionano meglio come nesso causale;
- parti di recap che erano diventate un inventario di keyword.

Sono rimasti intenzionalmente strutturati soltanto gli elementi in cui la forma aiuta davvero il lettore: scale di autonomia, workflow ordinati, policy di stop, Agent Delegation Contract, Agent Verification Bundle, checklist realmente riutilizzabili, esercizi e domande di autovalutazione.

## Obiettivo di lettura

Il Capitolo 0 dovrebbe ora apparire e leggersi più come un capitolo di un libro tecnico e meno come una sequenza di note operative. L'obiettivo non è eliminare la struttura, ma far sì che il ragionamento abbia continuità: problema, esempio, conseguenza, trade-off e principio devono essere percepiti come parti della stessa argomentazione.

Il feedback più importante da raccogliere su RC4 riguarda:

- densità visiva delle pagine;
- fluidità dei paragrafi;
- eventuali punti diventati troppo compatti;
- liste che dovrebbero essere recuperate perché utili alla consultazione;
- parti che risultano ancora troppo frammentate;
- equilibrio tra tono narrativo e utilità pratica.

## Scope

RC4 **non rappresenta una nuova revisione globale del libro**. Il solo capitolo sottoposto al nuovo criterio completo è il Capitolo 0. I Capitoli 1–9 mantengono il trattamento della RC3 e i Capitoli 10–30 non sono ancora stati sottoposti allo stesso pass editoriale.

Questa asimmetria è intenzionale: vogliamo prima arrivare a una forma stabile e condivisa su un singolo capitolo, poi usare quella forma come standard editoriale per il resto del manoscritto.

## QA

La candidate viene costruita e ispezionata dalla pipeline completa del libro: normalizzazione, lint strutturale/fattuale, lint editoriale, reference check, build Markdown/DOCX/PDF, EPUB e artifact inspection. Gli asset della release vengono pubblicati soltanto dal commit che modifica il manifest di release e passa gli stessi gate.

## Stato del capstone

La revisione editoriale non cambia lo stato operativo di Example Software Industries / Order Operations. La Production Readiness Review resta `NO-GO — evidence closure required` finché le evidenze richieste non vengono chiuse.

## Relazione con RC3

`v1.0.0-rc4` è la candidate consigliata per **valutare e approvare lo stile del Capitolo 0**. RC3 resta lo snapshot del primo pass prose-first 0–9.
