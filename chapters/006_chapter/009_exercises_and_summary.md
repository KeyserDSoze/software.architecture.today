## Idee chiave

Questo capitolo introduce una regola che useremo in quasi tutte le decisioni tecnologiche del libro:

> **Prima definiamo la qualità richiesta. Poi scegliamo la tecnologia.**

“Veloce”, “sicuro”, “scalabile”, “resiliente” ed “enterprise-ready” non sono ancora requisiti. Devono diventare target, invarianti, scenari o condizioni osservabili che permettano di distinguere una soluzione accettabile da una che non lo è.

Le quality attribute acquistano significato soltanto dentro un contesto. Il critical journey, il rischio, il profilo di traffico, il costo del downtime, il team, l'operabilità e il budget cambiano radicalmente il livello di qualità che vale la pena comprare. Per questo non possiamo massimizzare tutto contemporaneamente: ogni architettura paga trade-off e deve rendere esplicito ciò che privilegia.

Da qui deriva **fit before fashion**. Una tecnologia nuova non è automaticamente migliore; una tecnologia vecchia non è automaticamente peggiore. Popolarità, prestigio e familiarità sono elementi del contesto, non prove conclusive. La scelta ha valore quando soddisfa le proprietà che contano pagando un costo di ownership compatibile con il sistema e l'organizzazione.

La Non-Functional Requirements Card traduce questo principio in un artefatto operativo. Parte dai critical journey, dichiara target e priorità, rende espliciti non-goal, metodo di verifica e review trigger. Non deve scegliere la tecnologia al posto nostro: deve restringere abbastanza il design space da rendere il confronto meno arbitrario.

Con l'AI la sofisticazione diventa molto più economica da generare. Questo aumenta il rischio di confondere la quantità di infrastruttura con la qualità del design. Il controllo più importante diventa quindi chiedere, per ogni componente aggiunto: **quale requisito sta pagando questa complessità?**

## Artefatto operativo — Non-Functional Requirements Card

La forma sintetica del capitolo rimane:

```text
critical journey
→ target
→ vincoli
→ priorità
→ non-goal
→ verifica
→ trigger di revisione
```

Un piccolo tool interno può aver bisogno di poche righe. Un sistema ad alto rischio può richiedere analisi molto più profonde. Il peso dell'artefatto segue il costo dell'errore, non il desiderio di completezza documentale.

---

# Esercizi

Gli esercizi restano strutturati perché servono come strumenti di pratica e confronto.

## 1. Distruggi gli aggettivi

Ricevi questi requisiti:

```text
Il sistema deve essere:
- veloce;
- altamente scalabile;
- sicuro;
- affidabile;
- economico.
```

Per ciascuno spiega perché la frase non basta, formula almeno due domande di chiarimento, trasformala in una proprietà verificabile e indica quale decisione architetturale potrebbe cambiare in funzione della risposta. Non scegliere ancora tecnologie.

## 2. Percentili contro media

Un endpoint ha:

```text
average latency = 120 ms
p50 = 70 ms
p95 = 280 ms
p99 = 2.8 s
```

Il team conclude: “Siamo sotto 150 ms, quindi la performance è ottima.” Critica l'affermazione, proponi almeno tre ipotesi che potrebbero spiegare la coda del p99 e indica quali dati raccoglieresti prima di intervenire.

## 3. Scrivi una NFR Card

Scegli un e-commerce, un sistema di prenotazioni, un SaaS B2B, un'applicazione bancaria, una piattaforma media o un tool interno.

Compila una Non-Functional Requirements Card con almeno due critical journey, latency, capacity, availability, consistency, recovery, security, cost, tre explicit non-goal, metodo di verifica e review trigger. Per ogni numero non derivato da una misura reale dichiara origine e livello di confidence.

## 4. Availability non uniforme

Una piattaforma contiene checkout, catalogo, raccomandazioni, area amministrativa, reportistica e newsletter. Non puoi permetterti lo stesso livello di availability per tutto.

Ordina i journey per criticità e descrivi comportamenti differenti durante un incidente. Per almeno due capability definisci una graceful degradation semanticamente accettabile.

## 5. RTO e RPO

Un team dichiara:

```text
RTO = 15 minuti
RPO = zero
```

ma il backup viene eseguito ogni sei ore, il restore non è mai stato provato, il failover richiede tre console manuali e una sola persona conosce l'intera procedura.

Spiega le contraddizioni e proponi il minimo necessario per rendere credibili quei target oppure target più realistici coerenti con la capacità operativa esistente.

## 6. Fit before fashion

Il CTO vuole introdurre Kubernetes perché “è lo standard del settore e dobbiamo essere cloud-native”. Il sistema ha tre developer, una singola applicazione, due deploy al mese, traffico prevedibile, nessun requisito di deploy indipendente e può tollerare pochi minuti di downtime durante maintenance pianificata.

Costruisci il caso più forte contro Kubernetes e il caso più forte a favore. Poi identifica quali nuovi requirement potrebbero cambiare la decisione. Non fermarti alla frase “è troppo complesso”: confronta proprietà, costi e trigger.

## 7. La tecnologia noiosa

Confronta PostgreSQL già presente nel sistema con un nuovo database specializzato che offre query più naturali per un particolare tipo di dato.

Costruisci una Technology Fit Matrix usando capability, latency, scale, team skill, operability, backup, observability, cost, lock-in, migration e failure mode. La scelta può essere la tecnologia nuova, ma deve essere giustificata dal fit, non dall'interesse tecnico.

## 8. Copy-paste architecture

Scegli una architecture story pubblica di una grande organizzazione. Ricostruisci problema originale, scala, vincoli, team, failure precedenti e trade-off accettati. Poi immagina una startup di sei persone e separa ciò che è trasferibile da ciò che sarebbe probabilmente cargo cult.

L'esercizio è riuscito se riesci a spiegare **quale parte del contesto rendeva razionale la soluzione originale**.

## 9. Adversarial technology review con AI

Scegli una tecnologia che ti piace molto. Fornisci a un agente un contesto realistico e chiedigli di assumere che introdurla sia una cattiva idea e di costruire il caso tecnico più forte contro la scelta. Poi chiedi il contrario.

Confronta le due risposte cercando assunzioni non supportate, requirement mancanti, trade-off dimenticati e argomenti di moda. Non chiedere all'agente di votare il vincitore.

## 10. Order Operations cresce

Modifica il caso Order Operations:

```text
3.000 req/s sostenute
p95 < 150 ms
SLA enterprise più severo
utenti in tre continenti
RTO < 10 minuti
RPO prossimo a zero
```

Rivedi prima la Non-Functional Requirements Card. Poi identifica quali decisioni dei capitoli precedenti devono essere riaperte. Non saltare direttamente a Redis, Kafka, multi-region o un read model: elenca prima quali assunzioni non sono più valide.

## 11. Quality conflict

Hai contemporaneamente questi obiettivi:

```text
consistency forte
availability elevata durante partition
latency globale molto bassa
costo minimo
zero complessità operativa
```

Spiega perché l'insieme è sospetto. Costruisci una priorità esplicita e descrivi quali proprietà accetteresti di degradare e sotto quali condizioni.

## 12. La soluzione che l'AI ha reso troppo facile

Un agente ha generato in poche ore broker, cache distribuita, workflow engine, service mesh, tre database e deployment multi-region. Tutto funziona nella demo.

Prepara una **complexity audit**. Per ogni componente chiedi quale requisito risolva, quale alternativa più semplice esista, quale failure mode introduca, chi debba operarlo, come venga aggiornato e rimosso e che cosa accadrebbe se non lo introducessimo.

---

# Domande di autovalutazione

1. So trasformare un aggettivo di qualità in un requisito osservabile?
2. So distinguere latency media da tail latency?
3. So distinguere throughput e capacity?
4. So spiegare la differenza tra availability, reliability e durability?
5. So usare RTO e RPO come input di design e non soltanto come sigle?
6. So progettare una graceful degradation senza inventarla durante l'incidente?
7. So dichiarare quali qualità non sto ottimizzando?
8. So riconoscere una scelta guidata dalla moda e anche il dogma opposto del “usiamo sempre ciò che conosciamo”?
9. So collegare una tecnologia a un requisito concreto e a un failure mode nuovo?
10. So considerare operability e costo di ownership nel technology fit?
11. So distinguere costo di costruzione da costo di convivenza con la tecnologia?
12. So usare l'AI per confrontare alternative senza delegarle la priorità tra le qualità?

## Cosa cambia con l'AI

Un agente può generare rapidamente infrastruttura, configurazione, benchmark e proof of concept. La velocità di costruzione rende ancora più facile introdurre componenti prima di aver dimostrato che servano.

Per questo il nuovo controllo di qualità è quasi economico nella sua semplicità:

> **Quale requisito sta pagando questa complessità?**

Se la risposta non esiste, la velocità dell'AI non è un vantaggio: sta soltanto rendendo più economico creare debito.

## Corollario

> **Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.**

E prima ancora:

> **Gli aggettivi non sono requisiti.**
