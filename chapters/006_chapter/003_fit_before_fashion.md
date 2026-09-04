## Fit before fashion

Una tecnologia non è una medaglia.

Non dimostra che il team è moderno.

Non rende automaticamente il sistema migliore.

Non sostituisce un requisito.

E soprattutto non diventa giusta soltanto perché è nuova, sofisticata o molto utilizzata.

Questa sembra un'ovvietà.

Nella pratica non lo è affatto.

### Il fascino della tecnologia come punto di partenza

Molte conversazioni architetturali iniziano in modo apparentemente innocuo:

> “Perché non usiamo Kubernetes?”

> “Perché non facciamo event-driven?”

> “Perché non mettiamo tutto su serverless?”

> “Perché non usiamo un database vettoriale?”

> “Perché non dividiamo il sistema in microservizi?”

Sono domande legittime.

Diventano pericolose quando la tecnologia smette di essere un'alternativa e diventa l'obiettivo.

A quel punto il ragionamento si inverte:

```text
tecnologia desiderata
→ architettura compatibile
→ requisito che la giustifica
```

Questo è il contrario del metodo che stiamo costruendo.

Il percorso sano è:

```text
problema
→ qualità necessarie
→ vincoli
→ alternative
→ trade-off
→ fit
```

### “Lo usano tutti” non è un requisito

La popolarità ha valore.

Una tecnologia diffusa può offrire:

- community ampia;
- ecosistema maturo;
- più documentazione;
- maggiore disponibilità di competenze;
- più librerie;
- più esperienza operativa accumulata;
- minore rischio di abbandono.

Sono fattori reali.

Ma non sono una prova automatica di fit.

Un prodotto può essere eccellente per un'organizzazione con migliaia di engineer e pessimo per un team di quattro persone.

Un'architettura può essere giustificata da milioni di richieste al secondo e assurda per poche migliaia al giorno.

Una piattaforma può risolvere un problema di multi-tenancy globale che noi non abbiamo.

Copiare una scelta senza copiare il contesto significa copiare soltanto il costo.

### “Lo usa una big tech” non è un ADR

Le grandi aziende sono ottime fonti di casi reali.

Possono mostrarci problemi che non avevamo considerato, failure mode, pattern e strategie operative.

Ma c'è una differenza enorme tra:

> “Questa organizzazione ha risolto il proprio problema in questo modo.”

ed:

> “Quindi dobbiamo farlo anche noi.”

Quando leggiamo una storia tecnica dobbiamo ricostruire almeno:

- scala;
- team;
- organizzazione;
- sistema preesistente;
- constraint;
- obiettivi;
- costo del problema precedente;
- capacità operativa;
- momento storico.

Senza questi elementi stiamo facendo **copy-paste architecture**.

### Anche “usiamo quello che conosciamo” può diventare dogma

La reazione opposta alla fashion-driven architecture può essere altrettanto sbagliata.

> “Abbiamo sempre usato SQL Server.”

> “Noi facciamo tutto in.NET.”

> “Non introduciamo mai broker.”

> “Kubernetes è sempre inutile.”

La familiarità è un vincolo e un vantaggio operativo reale.

Ma non è una religione.

Se una tecnologia conosciuta non soddisfa bene un requisito significativo, la competenza esistente non basta a renderla corretta.

Il fit considera anche il team.

Non è subordinato al team.

A volte la scelta migliore è usare ciò che conosciamo.

A volte è investire nell'apprendimento.

A volte è comprare un servizio gestito.

A volte è coinvolgere uno specialista.

La decisione deve emergere dal costo totale, non dall'identità tecnica del gruppo.

### Una tecnologia vecchia può essere la scelta più moderna

“Moderno” dovrebbe descrivere il modo in cui prendiamo decisioni, non la data di nascita dello strumento.

Una tecnologia stabile, conosciuta e noiosa può offrire un fit eccellente.

Può avere failure mode conosciuti.

Può essere facile da operare.

Può avere un ecosistema enorme.

Può ridurre il numero di componenti.

Può rendere il sistema più comprensibile.

Non c'è nulla di antiquato nel ridurre complessità inutile.

Allo stesso modo, una tecnologia nuova può essere esattamente ciò che serve quando introduce una capability che cambia materialmente il problema.

Il criterio non è l'età.

È il rapporto tra valore e costo.

### Technology fit matrix

Quando una scelta è significativa, possiamo confrontare alternative rispetto alle proprietà che contano davvero.

Per esempio:

| Criterio | Soluzione A | Soluzione B | Soluzione C |
| --- | --- | --- | --- |
| latency target | soddisfa | soddisfa | soddisfa |
| consistency richiesta | forte | eventuale | forte |
| capacità attesa | sufficiente | molto elevata | sufficiente |
| operabilità team | alta | bassa | media |
| costo | basso | alto | medio |
| lock-in | basso | medio | alto |
| migration effort | basso | alto | medio |
| reversibilità | alta | bassa | media |

Questa tabella non deve produrre automaticamente un vincitore.

Non siamo a un concorso a punti.

Serve a rendere visibile il ragionamento.

Alcuni criteri pesano molto più di altri.

Un requisito di compliance può eliminare un'alternativa anche se è migliore in otto categorie su dieci.

Un vincolo di budget può fare lo stesso.

### Il costo della sofisticazione

Ogni tecnologia sofisticata deve pagare l'affitto.

Se introduciamo:

- broker;
- cluster;
- service mesh;
- database aggiuntivo;
- orchestratore;
- cache distribuita;
- piattaforma di workflow;

la domanda è:

> **Quale problema significativo rende questo costo ragionevole?**

Se non sappiamo rispondere, probabilmente abbiamo aggiunto tecnologia prima di aver aggiunto valore.

Questo non significa che ogni componente debba avere un ROI finanziario calcolato al centesimo.

Significa che la complessità deve avere una ragione.

### Il test del fit

Quando una tecnologia viene proposta, possiamo usare alcune domande:

1. quale requisito significativo soddisfa?
2. quale alternativa più semplice abbiamo escluso e perché?
3. quale costo operativo introduce?
4. quale nuova failure mode introduce?
5. il team sa operarla o il piano include come costruire quella competenza?
6. quale lock-in crea?
7. come cambia il costo di delivery?
8. come cambia il costo di recovery?
9. quanto è reversibile la scelta?
10. che cosa succede se la crescita prevista non arriva mai?

La decima domanda è importante.

Molte architetture vengono progettate per un futuro che non si manifesta.

Nel frattempo pagano ogni giorno il costo della complessità anticipata.

### La stella polare

La stella polare non è la tecnologia.

È il problema risolto bene.

Il mezzo può cambiare.

Il contesto può cambiare.

La scelta migliore oggi può smettere di esserlo domani.

Per questo il fit è più utile dell'idea di “best technology”.

> **Non scegliere la tecnologia che impressiona di più. Scegli quella che risolve meglio il problema che hai davvero.**
