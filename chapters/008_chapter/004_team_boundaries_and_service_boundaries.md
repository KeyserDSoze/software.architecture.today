## Team boundaries e service boundaries

L'architettura non vive soltanto nel codice.

Vive nell'organizzazione che deve costruirla, modificarla, rilasciarla e operarla.

Per questo team boundary e service boundary sono spesso collegati.

Ma confonderli produce un altro tipo di architecture by default.

## L'organigramma non è automaticamente il dominio

Una scorciatoia frequente è:

```text
un team
→ un servizio
```

Può funzionare quando il team possiede davvero una capability coerente, ha una roadmap relativamente indipendente e può portare cambiamenti in produzione senza coordinamento continuo.

Ma può anche cristallizzare nel codice una struttura organizzativa temporanea.

Gli organigrammi cambiano. I manager cambiano. I team vengono fusi, divisi o rinominati.

Le dipendenze tecniche create per riflettere quella fotografia possono restare per anni.

Separare servizi soltanto perché esistono team diversi significa quindi rischiare di trasformare una scelta organizzativa contingente in un costo architetturale persistente.

## Nemmeno il grande servizio condiviso risolve il problema

L'errore opposto è avere un unico componente enorme posseduto formalmente da molti team.

In questo caso tutti possono modificarlo, ma nessuno possiede davvero il comportamento end-to-end. Ogni feature attraversa ownership differenti, ogni incident coinvolge più gruppi e il codice diventa un territorio comune in cui le responsabilità sono condivise ma non realmente governate.

Quindi non dobbiamo scegliere tra un'architettura “guidata dai team” e una “guidata dal dominio”.

Dobbiamo cercare un allineamento sufficiente fra quattro cose:

```text
responsabilità di dominio
ownership di codice e dati
responsabilità operativa
capacità di delivery
```

Quando queste dimensioni puntano in direzioni molto diverse, il confine tende a diventare un punto di coordinamento permanente.

## Autonomia significa ridurre il coordinamento necessario

Un team è realmente autonomo quando può portare una modifica significativa in produzione senza dover sincronizzare continuamente il proprio lavoro con altri team.

Autonomia non significa isolamento.

Significa che i contratti permettono collaborazione senza obbligare alla co-evoluzione continua.

Se un team possiede Payments, dovrebbe poter cambiare il proprio modello interno, evolvere la logica di pagamento, correggere incidenti e rilasciare senza richiedere una modifica simultanea in Orders ogni volta che il contratto pubblico resta compatibile.

Questa è la proprietà che un service boundary può rafforzare.

Se invece il team deve concordare ogni schema, ogni release e ogni dettaglio implementativo con altri gruppi, il servizio separato non ha ancora comprato molta autonomia.

## Build, run, change, learn

L'ownership diventa più forte quando chi cambia una capability riceve anche feedback dalle sue conseguenze operative.

Possiamo pensare a un ciclo:

```text
build
→ run
→ observe
→ learn
→ change
```

Se un team produce cambiamenti ma un altro assorbe sistematicamente alert, incidenti e recovery, la velocità di delivery è separata dal costo operativo. Il feedback si indebolisce.

Con l'AI questo rischio cresce: possiamo produrre più cambiamenti nello stesso tempo senza aumentare automaticamente la comprensione del loro comportamento in produzione.

La topologia dovrebbe quindi favorire ownership end-to-end dove l'organizzazione è in grado di sostenerla.

## Quando il team boundary rafforza il caso per un servizio

Un boundary operativo diventa più interessante quando più segnali convergono.

Una capability ha ownership stabile e distinta. Il team ha una roadmap e una release cadence realmente indipendenti. Il modulo ha dati propri, un profilo di carico specifico o un security boundary che merita isolamento più forte. Gli incidenti e l'on-call possono essere posseduti senza dipendere continuamente dal resto dell'organizzazione.

Questi segnali raccontano una storia coerente: esiste già una forma di autonomia logica e organizzativa che la separazione fisica può rendere più forte.

Un solo segnale, invece, raramente basta.

Avere un team dedicato non obbliga a creare un servizio. Avere un servizio non crea automaticamente un team autonomo.

## Team piccoli, costo distribuito grande

La dimensione dell'organizzazione cambia completamente il fit.

Tre persone che possiedono dieci servizi non hanno necessariamente dieci unità autonome.

Hanno dieci deployable da aggiornare, dieci failure surface, più pipeline, più dashboard, più contract e più possibilità che una modifica attraversi la rete.

Per un team piccolo un modular monolith può offrire ownership molto chiara con un costo operativo molto più basso.

Per un'organizzazione con molti team indipendenti, la stessa topologia potrebbe diventare un collo di bottiglia di rilascio e coordinamento.

Non c'è contraddizione.

È il contesto organizzativo che cambia il valore della separazione.

## Evidenza metodologica

La documentazione Microsoft sui microservizi collega esplicitamente questo stile a servizi autonomi gestibili da team piccoli e alla possibilità di sviluppare e rilasciare indipendentemente le capability: [Microsoft Learn — Microservices architecture style](https://learn.microsoft.com/azure/architecture/microservices/).

Questa indicazione non significa “un team, un servizio”.

Significa che l'autonomia del team è una delle proprietà che può rendere utile il boundary operativo, insieme a dominio, dati, deployment e failure isolation.

> **La topologia deve essere sostenibile dall'organizzazione che possiede il sistema oggi, non da quella immaginaria che forse avremo domani.**