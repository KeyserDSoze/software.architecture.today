# Capitolo 4 — Che cos'è davvero Software Architecture

Se chiediamo a dieci persone che cosa sia la Software Architecture, otterremo spesso risposte che parlano di diagrammi, componenti, servizi, tecnologie, cloud, database, pattern o infrastruttura.

Tutte queste cose possono farne parte.

Nessuna, da sola, è l'architettura.

Un diagramma può rappresentare il sistema e non spiegare nessuna decisione importante.

Una lista di tecnologie può essere dettagliata e non dirci nulla sui trade-off che hanno portato a sceglierle.

Un insieme di microservizi può sembrare sofisticato e nascondere confini sbagliati.

Una soluzione molto semplice può invece contenere ottime decisioni architetturali.

Il punto di partenza di questo capitolo è quindi diverso:

> **La Software Architecture è il sistema attraverso il quale rendiamo esplicite le decisioni che hanno conseguenze importanti, durature o costose da cambiare.**

Questa definizione sposta subito l'attenzione.

Non chiediamo più soltanto:

> “Quali componenti ci sono?”

Chiediamo quali decisioni stiano modellando il sistema e quali vincoli le influenzino, quali qualità vogliamo proteggere e quali alternative abbiamo escluso. Poi chiediamo che cosa stiamo pagando per la scelta, quanto sarebbe costoso cambiare direzione e quali cambiamenti futuri potrebbero invalidare il ragionamento di oggi.

L'architettura diventa così meno simile a una fotografia e più simile a una **storia di decisioni**.

## Il diagramma viene dopo

Consideriamo due sistemi con lo stesso diagramma:

```text
Client
  ↓
API
  ↓
Service
  ↓
Database
```

Graficamente sono identici.

Ma nel primo sistema il database è il system of record di un'applicazione interna con cinquanta utenti e un downtime tollerabile di alcune ore.

Nel secondo gestisce pagamenti per migliaia di transazioni al minuto, con requisiti normativi, audit, recovery e consistenza molto più stringenti.

La forma può essere simile.

L'architettura no.

Perché cambiano il significato dei dati e il rischio, le qualità richieste e i failure mode accettabili. Cambiano inoltre le scelte di deployment e i controlli necessari, fino al costo con cui potremo modificare il sistema in futuro.

Per questo in questo libro useremo i diagrammi, ma non li confonderemo mai con la sostanza.

> **Il diagramma mostra dove sono le cose. L'architettura spiega perché sono così e quali conseguenze produce quella scelta.**

## Architecture decision, design decision, technology choice

Serve una distinzione pratica.

Non ogni decisione tecnica è architetturale.

Scegliere il nome di un metodo è una design decision locale.

Scegliere una libreria per formattare date può essere una technology choice a basso impatto.

Decidere che ogni servizio possiede il proprio database, che la comunicazione tra domini sarà asincrona o che il sistema deve sopravvivere alla perdita di una region sono decisioni con un impatto molto più ampio.

Non esiste un confine matematico perfetto.

Possiamo però usare una domanda:

> **Quanto questa decisione influenza il comportamento, il costo, il rischio o l'evoluzione futura del sistema?**

Più la risposta è “molto”, più siamo vicini al territorio architetturale.

### Un criterio utile: il costo di inversione

Una decisione diventa interessante quando cambiarla dopo può essere costoso.

Per esempio:

- cambiare una funzione utility può essere economico;
- cambiare framework può essere moderatamente costoso;
- cambiare il modello di ownership dei dati dopo anni può essere molto costoso;
- cambiare una strategia di partizionamento su miliardi di record può essere estremamente costoso;
- correggere una trust boundary sbagliata dopo un incidente può avere un costo tecnico, operativo e reputazionale enorme.

Non significa che tutte le decisioni costose vadano prese perfettamente prima di iniziare.

Significa che meritano **più intenzionalità**.

## L'architettura non è una fase

Un altro errore comune è pensare all'architettura come a un'attività che accade all'inizio.

Prima si “fa l'architettura”.

Poi si implementa.

Poi l'architettura resta nel diagramma mentre il sistema reale cambia.

In questo libro useremo un modello diverso.

L'architettura è continua perché continuano a cambiare requisiti e carico, team e vincoli, normative e costi. Cambiano le piattaforme, emergono failure mode che prima non avevamo osservato e cresce — o viene corretta — la nostra conoscenza del dominio.

Quindi una buona architettura non è soltanto una serie di decisioni iniziali.

È anche un sistema per **rivederle quando il contesto cambia**.

Questo sarà importante più avanti quando parleremo di evolutionary architecture e fitness functions.

Per ora ci basta fissare un principio:

> **L'architettura non è il momento in cui decidiamo tutto. È il modo in cui decidiamo le cose che contano.**

## Nell'era dell'AI

L'AI rende ancora più importante questa distinzione.

Un agente può produrre rapidamente molte decisioni locali plausibili.

Può scegliere una libreria, aggiungere una cache, introdurre una queue, separare un modulo, creare una nuova API, inserire retry, aggiungere un database.

Ognuna di queste modifiche può sembrare ragionevole presa isolatamente.

Il problema è la somma.

Se nessuno governa le decisioni trasversali, il sistema può evolvere per **accumulo di scelte locali**.

È l'architecture by autocomplete vista nel Capitolo 1, ma su scala sistemica.

Per evitarla serve rendere esplicito almeno ciò che ha un impatto significativo.

Non documentare tutto.

Documentare ciò che, se dimenticato, renderà una scelta difficile da comprendere o cambiare.

## La domanda del capitolo

Nel Capitolo 2 abbiamo chiarito il problema.

Nel Capitolo 3 abbiamo osservato il sistema e le sue dipendenze.

Ora possiamo finalmente chiederci:

> **Quali decisioni meritano attenzione architetturale, come le confrontiamo e come ne conserviamo il ragionamento?**

Le sezioni che seguono costruiranno una risposta passando dagli Architecturally Significant Requirements ai vincoli e ai trade-off, poi alla reversibilità, alle one-way e two-way door e agli Architecture Decision Record. Chiuderemo con i trigger di revisione e con l'applicazione concreta a Order Operations.

Il punto non sarà imparare a “fare l'architetto”.

Sarà imparare a **riconoscere le decisioni che cambiano il destino del sistema**.