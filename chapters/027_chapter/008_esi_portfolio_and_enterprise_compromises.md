# ESI come portfolio — local fit e coerenza enterprise

Finché osserviamo un solo prodotto possiamo chiedere quale decisione abbia il fit migliore per quel workload. Appena guardiamo ESI come azienda, compare un’altra domanda:

> **Quale varietà è utile al business e quale varietà stiamo pagando soltanto perché ogni team ha ottimizzato localmente?**

Campaign Launchpad vuole un operating surface piccolo e public delivery semplice. Order Operations vuole private workforce access, reliability, Payments integration e strong operational evidence. Il Case Explanation Assistant aggiunge model evaluation, provider governance e AI observability.

Non devono avere la stessa topology.

Ma neppure ha senso che ogni prodotto reinventi identity, secrets, CI/CD, cost allocation, telemetry convention e incident ownership.

## Standardizzare dove la differenza non compra business value

La paved road enterprise ha più valore quando il costo della varietà è alto e il vantaggio di differenziarsi è basso.

Enterprise identity, secret management, baseline CI/CD, security scanning, cost-allocation metadata, telemetry convention, ownership interface e landing-zone guardrail sono buoni candidati proprio perché la maggior parte dei workload non trae un vantaggio competitivo dal reinventarli.

La standardizzazione compra onboarding più rapido, controlli riusabili, operation condivisa e evidence più comparabile.

Ma il principio non si estende automaticamente a database, compute model, messaging, topology, testing shape o AI architecture. Campaign Launchpad e Order Operations hanno failure model troppo diversi perché l’uniformità sia un valore di per sé.

> **Standardizza ciò che non differenzia il business. Mantieni workload-specific ciò che cambia davvero con il problema.**

## Anche lo standard deve giustificare il proprio costo

Immaginiamo che Platform supporti soltanto App Service mentre Marketing propone una static-first solution.

Forzare lo standard riduce platform variety ma può introdurre runtime e cost non necessari. Creare una nuova paved road aumenta invece support surface, documentazione e operational burden enterprise.

La decisione deve confrontare entrambe le economie:

```text
cost of variety
vs
cost of forcing the existing standard
```

Lo stesso vale per le eccezioni. Un team non dovrebbe ottenere una nuova technology soltanto perché la preferisce; deve mostrare quale property lo standard corrente non riesce a comprare a un costo ragionevole.

In questo modo standard ed eccezioni restano decisioni verificabili, non politica organizzativa.

## Security e Product devono discutere di capability, non di slogan

Product può voler rendere il Case Explanation Assistant write-capable. Security può voler mantenere read-only.

La discussione utile non è `innovation vs bureaucracy`. È quale business outcome richiede il nuovo sink, quale tool, permission, confirmation, idempotency, audit, compensation e failure model servono.

Forse la decisione finale sarà concedere più potere al modello. Ma il sistema deve sapere che cosa cambia prima di trasformare il desiderio di automation in authority.

Questa è enterprise architecture: rendere traducibili prospettive legittime che altrimenti resterebbero slogan incompatibili.

## Finance e Reliability parlano della stessa decisione da due lati

Premium tier, multiple instances, staging environment, extra telemetry e coexistence cost possono apparire come spreco dal punto di vista della fattura.

Reliability e Security li leggono invece come blast-radius reduction, recovery, isolation o operational evidence.

Il Cost Model permette di tradurre:

```text
spesa
→ proprietà comprata
→ rischio / valore protetto
```

Finance può contestare il prezzo senza negare la property. Engineering può difendere la property senza trattare ogni costo come intoccabile.

La discussione diventa quindi un trade-off e non un conflitto fra “chi vuole risparmiare” e “chi vuole fare bene il software”.

## Una richiesta commerciale può cambiare l’architettura prima ancora di diventare ticket

Se Sales promette a un cliente una variante personalizzata di Campaign Launchpad, quella promessa può introdurre multi-tenancy, availability, new integration o regulated data.

Questo è architecture input, non soltanto backlog.

È un altro motivo per cui functional understanding non può restare confinato a Product. Developer e architect devono vedere la semantica abbastanza presto da riconoscere quando una richiesta modifica le forze del sistema.

## Shared capability deve emergere da problemi ripetuti

Dopo alcuni prodotti ESI potrebbe osservare pattern realmente comuni: private workforce baseline, static-publishing baseline, agent governance, AI eval harness, production-readiness evidence format.

A quel punto una platform capability può avere fit.

La sequenza sana è:

```text
repeated problem
→ repeated local evidence
→ stable shared need
→ paved-road capability
```

non:

```text
platform team can build it
→ every workload must use it
```

Questo evita premature platforming. La piattaforma nasce perché assorbe una varietà già osservata, non perché anticipa ogni possibile esigenza.

## L’AI rende portfolio governance più importante

Quando creare software diventa più economico, ESI può produrre più repository, internal tool, small service, agent workflow e AI integration.

Il costo marginale di iniziare un sistema diminuisce. Il costo cumulativo di possederlo, aggiornarlo, proteggerlo e dismetterlo non scompare.

Quindi una nuova domanda acquista peso:

> **Questo sistema merita di esistere come prodotto separato?**

L’AI può aumentare software supply più rapidamente della capacità organizzativa di mantenere tutto ciò che viene creato.

Portfolio governance, ownership e retirement diventano quindi ancora più importanti.

## Il compromesso ESI

La direzione del portfolio è:

```text
shared enterprise guardrails
+
workload-specific architecture
+
explicit exception/review trigger
```

ESI accetta un certo platform investment, alcuni constraint comuni e alcune eccezioni motivate. Il quality floor enterprise resta identity, security ownership, evidence provenance, operability, cost attribution e functional authority.

La diversità non deve essere eliminata. Deve essere **intenzionale e governabile**.

> **Una grande software house non dimostra maturità costruendo tutto nello stesso modo. La dimostra sapendo quali differenze comprano valore e quali stanno soltanto moltiplicando il costo di possedere software.**
