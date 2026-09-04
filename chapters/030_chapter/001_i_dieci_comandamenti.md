# Capitolo 30 — I Dieci comandamenti della Software Architecture nell'era dell'AI

Siamo arrivati alla fine.

Non abbiamo usato questi comandamenti per costruire il libro.

Li abbiamo lasciati qui, dopo problemi, requisiti, sistemi distribuiti, dati, cloud, security, reliability, legacy, costi, agenti, AI e produzione, perché prima sarebbero stati soltanto slogan.

Adesso ogni frase ha dietro decisioni, failure mode, compromessi ed evidence.

Il tono può concedersi un sorriso.

La sostanza no.

## I — Non avrai altra architettura all'infuori del problema

Prima viene il problema reale.

Tecnologia, pattern, cloud e AI vengono dopo.

Se partiamo dalla soluzione che vogliamo usare, troveremo quasi sempre un modo per raccontarci che il problema la richiedeva.

L'architettura comincia invece quando riusciamo a dire:

```text
questo è l'outcome
questi sono i vincoli
queste sono le proprietà necessarie
questa è l'evidence che ci farà sapere se abbiamo avuto ragione
```

Il resto è conseguenza.

## II — Non nominerai “requisito” invano

“Scalabile”.

“Sicuro”.

“Resiliente”.

“Performante”.

“Cloud-native”.

“AI-powered”.

Non sono requisiti finché non sappiamo che cosa devono significare nel nostro sistema e come potremo verificarli.

Gli aggettivi sono economici.

Le proprietà hanno un costo.

E se non sappiamo quale proprietà stiamo comprando, probabilmente non sappiamo nemmeno quanto siamo disposti a pagarla.

## III — Ricordati di santificare l'evidence

Non confondere ciò che hai progettato con ciò che hai dimostrato.

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Un diagramma non dimostra un runtime.

Un test non dimostra ciò che non osserva.

Un documento di readiness non rende pronto un sistema.

Una spiegazione convincente non sostituisce una prova proporzionata al claim.

La confidence è utile.

L'evidence è migliore.

## IV — Onora il dominio e chi ne possiede la verità

Comprendi il business prima di ridurlo a tabelle, endpoint ed eventi.

Rispetta la data ownership.

Rispetta la decision authority.

Aggregare un dato non significa diventarne proprietari.

Copiarlo non trasferisce il diritto di definirne il significato.

E implementare una business rule non autorizza il team tecnico a inventarla.

L'analisi funzionale può avere specialisti.

La comprensione del prodotto no.

## V — Non uccidere la semplicità

Ogni servizio, database, queue, cache, layer, pattern, framework e agente deve guadagnarsi il diritto di esistere.

La semplicità non significa assenza di architettura.

Significa che la complessità presente nel sistema ha un lavoro riconoscibile.

Quando una soluzione semplice soddisfa davvero requisiti, failure model e vincoli, renderla più sofisticata non è maturità.

È debito con una bella presentazione.

## VI — Non commettere complessità senza necessità

Microservizi, Kubernetes, event-driven architecture, CQRS, RAG, vector database, multi-agent orchestration e l'ultima tecnologia che compare nella timeline non rendono moderna una decisione.

Una tecnologia vecchia può essere la scelta più moderna.

Una tecnologia nuova può essere perfettamente inadatta.

Il criterio rimane:

```text
problema
+ requisiti funzionali
+ quality attribute
+ vincoli
+ team
+ costo
+ operabilità
+ rischio
+ evoluzione attesa
```

**Il fit prima della moda.**

## VII — Non rubare la responsabilità al suo proprietario

Puoi delegare l'execution.

Puoi delegare discovery, implementazione, test, analisi, review e persino parti della verifica.

Non puoi trasferire automaticamente insieme a esse judgment, decision authority e accountability.

Un agente capace di eseguire un'azione non è per questo autorizzato a deciderla.

E davanti a un errore:

> “Lo ha scritto l'AI.”

non è una strategia di accountability.

Se portiamo una decisione in produzione, dobbiamo essere in grado di spiegare perché meritava di arrivarci.

## VIII — Non dare falsa testimonianza sulla qualità del tuo sistema

Un build verde non dimostra ciò che non è stato verificato.

Un backup configurato non è un restore verificato.

IaC codificata non è un deployment verificato.

Un dashboard non è observability.

Un runbook non è una procedura esercitata.

Un eval dataset non è qualità AI verificata.

Una seconda review AI non è automaticamente evidence indipendente.

E un sistema che ha superato molti gate non è production-ready se il gate che protegge il rischio critico manca ancora.

Pretendi evidence proporzionata alla promessa.

## IX — Non desiderare l'architettura d'altri

Netflix, Uber, GitHub, Amazon, Google, Microsoft, una startup di dieci persone o il team seduto al piano di sopra possono aver preso decisioni eccellenti.

Per il proprio problema.

Con il proprio traffico.

Con i propri team.

Con i propri failure mode.

Con il proprio budget.

Con la propria storia.

Studiare le architetture degli altri è utile.

Desiderarle senza desiderare anche il loro problema è cargo cult.

Non chiedere:

> “Che cosa usano loro?”

prima di aver chiesto:

> “Quale forza li ha portati a quella scelta, e quella forza esiste anche qui?”

## X — Non desiderare più autonomia di quanta tu possa governare

Vale per il software.

Vale per i team.

Vale soprattutto per gli agenti.

Capability, permission, authorization e autonomy sono cose diverse.

Più execution non richiede automaticamente più autonomia.

Richiede context migliore, boundary più chiari, verification più forte e stop condition comprensibili.

Prima sincronizza il pensiero.

Poi parallelizza l'esecuzione.

Concedi potere in proporzione alla capacità di governarne il failure.

E quando l'execution diventa abbondante, ricorda chi deve ancora scegliere la direzione.

**L'AI può scrivere il codice. Il timone resta a noi.**