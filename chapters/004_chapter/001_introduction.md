# Capitolo 4 — Che cos'è davvero Software Architecture

Se chiediamo a dieci persone che cosa sia la Software Architecture, otterremo probabilmente risposte che parlano di diagrammi, componenti, servizi, tecnologie, database, cloud, pattern o infrastruttura. Tutte queste cose possono farne parte, ma nessuna di esse, presa da sola, ci dice ancora se stiamo osservando l'architettura.

Un diagramma può rappresentare perfettamente dove si trovano i componenti e non spiegare nessuna decisione importante. Una lista di tecnologie può essere molto dettagliata e non raccontare quali alternative siano state scartate o quali qualità abbiano guidato la scelta. Un sistema distribuito può sembrare sofisticato e avere confini sbagliati; una soluzione molto semplice può invece incorporare ottime decisioni architetturali.

Per questo adotteremo una definizione operativa diversa:

> **La Software Architecture è il sistema attraverso il quale rendiamo esplicite le decisioni che hanno conseguenze importanti, durature o costose da cambiare.**

La definizione sposta immediatamente l'attenzione dalla forma al reasoning. Non ci basta più sapere quali componenti esistano. Vogliamo capire quali decisioni stanno modellando il sistema, quali requisiti e vincoli le abbiano prodotte, quali qualità stiano proteggendo, quali alternative siano state escluse e quale costo stiamo accettando in cambio del beneficio.

L'architettura diventa così meno simile a una fotografia e più simile a una **storia di decisioni**.

## Il diagramma viene dopo

Consideriamo due sistemi con la stessa forma:

```text
Client
  ↓
API
  ↓
Service
  ↓
Database
```

Nel primo il database è il system of record di un'applicazione interna usata da poche decine di persone e un'interruzione di alcune ore è tollerabile. Nel secondo la stessa forma logica sostiene pagamenti ad alto volume, con requisiti di audit, recovery, consistenza e compliance molto più stringenti.

Il diagramma può essere identico. L'architettura no, perché sono diversi il significato dei dati, il costo del failure, le qualità richieste, i controlli necessari e il costo di cambiare direzione in futuro.

Per questo useremo molti diagrammi nel libro, ma li tratteremo sempre come una vista del sistema, non come la sostanza del sistema.

> **Il diagramma mostra dove sono le cose. L'architettura spiega perché sono così e quali conseguenze produce quella scelta.**

## Non ogni decisione tecnica è architettura

Serve una distinzione pratica. Rinominare un metodo o scegliere una utility di formattazione sono decisioni tecniche, ma normalmente hanno un impatto locale. Decidere che ogni dominio possieda i propri dati, che una parte critica del workflow diventi asincrona o che il sistema debba sopravvivere alla perdita di un'intera availability zone cambia invece molti aspetti del comportamento futuro.

Non esiste una formula matematica che separi perfettamente design e architecture. Possiamo però osservare il peso della decisione chiedendoci quanto influenzi comportamento, rischio, costo, operazioni ed evoluzione del sistema.

Più una scelta attraversa questi assi, più entra nel territorio architetturale.

### Il costo di inversione rende visibile il peso

Una decisione diventa particolarmente interessante quando scopriamo che cambiarla dopo sarebbe costoso. Una utility può essere sostituita con poco impatto; un framework richiede più lavoro; il modello di ownership dei dati, dopo anni di integrazioni, può richiedere una migration complessa; una strategia di partizionamento ormai incorporata in miliardi di record può diventare un progetto autonomo.

Lo stesso vale per una trust boundary sbagliata: il costo della correzione non si misura soltanto nelle righe di codice, ma può includere incident response, compliance, operazioni e reputazione.

Questo non significa che tutte le decisioni importanti debbano essere perfette prima di iniziare. Significa che meritano **più intenzionalità** proprio perché il sistema potrebbe renderle costose da invertire.

## L'architettura non è una fase

È facile immaginare un progetto come una sequenza lineare: prima “facciamo l'architettura”, poi implementiamo, infine il diagramma resta fermo mentre il sistema reale continua a cambiare. Quel modello confonde l'architettura con un momento del progetto.

Il sistema, però, cambia insieme ai requisiti, al carico, ai team, alle normative, ai costi e alla conoscenza del dominio. Emergono failure mode che non avevamo previsto, cambiano le piattaforme, alcuni vincoli scompaiono e altri diventano improvvisamente decisivi.

Una buona architettura deve quindi conservare non soltanto le decisioni iniziali, ma anche la capacità di **rivederle quando cambia il contesto**.

Più avanti parleremo di evolutionary architecture e fitness functions. Per ora fissiamo il principio che ci serve:

> **L'architettura non è il momento in cui decidiamo tutto. È il modo in cui decidiamo le cose che contano.**

## Nell'era dell'AI

Gli agenti rendono questa distinzione ancora più importante. Un coding agent può scegliere una libreria, introdurre una cache, creare una queue, separare un modulo, aggiungere retry o persino un nuovo database in tempi molto brevi. Ciascuna modifica può essere ragionevole se guardata localmente.

Il problema emerge nella somma. Se nessuno governa le decisioni trasversali, il sistema evolve per accumulo di scelte locali plausibili. È l'**architecture by autocomplete** del Capitolo 1, ma osservata su scala sistemica.

La risposta non è documentare tutto. È rendere esplicite le scelte che, se dimenticate, renderebbero difficile capire perché il sistema abbia quella forma o quale costo comporti cambiarla.

## La domanda del capitolo

Nel Capitolo 2 abbiamo chiarito il problema e nel Capitolo 3 abbiamo allargato lo sguardo al sistema e alle sue dipendenze. Ora possiamo porre la domanda che guiderà il resto del libro:

> **Quali decisioni meritano attenzione architetturale, come confrontiamo le alternative e come conserviamo il ragionamento che rende una scelta sensata?**

Per rispondere passeremo dagli Architecturally Significant Requirements ai trade-off, dai vincoli alla reversibilità e dalle one-way door agli Architecture Decision Record. Poi torneremo a Order Operations per prendere la prima decisione architetturale esplicita del capstone.

Il punto non è imparare a “fare l'architetto” come ruolo separato. È imparare a **riconoscere le decisioni che possono cambiare il destino del sistema e a governarle prima che diventino accidentali**.
