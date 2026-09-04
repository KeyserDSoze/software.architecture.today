# Campaign Launchpad — dal perimetro al launch

Il primo caso diventa davvero end-to-end soltanto quando la semplicità del design arriva fino a testing, operability e production decision.

Il problema iniziale era ridurre la dipendenza da Engineering per campagne standard. Il non-goal — **non costruire un CMS general purpose** — ha limitato il functional scope a template, draft, preview, approval, publication e rollback.

Questa scelta ha conseguenze lungo tutta la catena.

## Ownership prima della tecnologia

Marketing Technology possiede il workflow del prodotto. Brand/Marketing mantiene authority sul contenuto approvato. ESI Identity possiede workforce identity. Platform e Security forniscono i guardrail enterprise.

Campaign Launchpad possiede Campaign, DraftVersion, ApprovalDecision e PublicationVersion. Non diventa owner di employee identity, CRM profile o enterprise brand source.

Questa mappa riduce due rischi: copiare dati autorevoli per comodità e trasformare il piccolo prodotto in un nuovo integration hub.

## Il trade-off che compra la static-first direction

Separare authoring state e public artifact riduce il coupling fra control plane interno e read path pubblico. Una publication approvata può diventare un artifact versionato e cache-friendly; il public path non deve dipendere da ogni failure dell’authoring API.

Paghiamo però una limitazione: il modello è adatto soprattutto a contenuto versionato e bounded. Real-time personalization, customer-specific state o arbitrary extension potrebbero invalidarlo.

La decisione è quindi versionata:

```text
Benefit
small operational/security surface

Cost
less dynamic/custom flexibility

Quality floor
approved publication + traceability + rollback + authorization

Review trigger
personalization / PII / scripting / 24x7 contractual need / multiple owners
```

## Security proporzionata non significa security debole

Dire “è soltanto Marketing” sarebbe un errore. Un public publishing system può produrre brand damage, malicious content o supply-chain exposure.

Per questo il primo boundary richiede internal authenticated authoring, approval before publish, immutable publication history e niente arbitrary executable content per default.

Non richiede automaticamente la stessa private-network topology di Order Operations. Il rischio è differente e anche il controllo appropriato può esserlo.

## La testing strategy segue la promessa

Nel fast layer possiamo verificare state transition, approval rule, template validation e publication versioning.

La higher-fidelity evidence deve attraversare identity e deployment:

```text
Draft
→ Approval
→ Publish
→ Public artifact visible
→ Rollback
→ Previous approved version restored
```

Questo journey è più significativo di un semplice browser smoke sulla homepage perché esercita proprio la promessa distintiva del prodotto.

## Il launch boundary rimane piccolo

Una prima proposta può includere un approved Marketing cohort, un approved template set e public read-only landing page, lasciando fuori personalization, customer account, CRM data e custom script.

Disabilitare capability non necessarie non è una rinuncia. È un modo per mantenere il launch boundary coerente con l’evidence realmente disponibile.

In futuro un `CONDITIONAL GO` potrebbe avere senso soltanto dopo implementation e runtime evidence su publish/rollback, authorization, deployment e support route.

Oggi il capstone non possiede ancora quella prova. Il suo Production Readiness Direction dichiara esplicitamente che il prodotto non è implementato e non afferma readiness.

Quindi il Decision Trace resta:

```text
Architecture direction  Designed/Codified in docs
Implementation          Pending
Runtime verification    Pending
Production decision     NOT READY
```

## Il One-Man Project ha un costo anche qui

Un accountable lead singolo può ridurre coordination overhead, ma ESI continua a richiedere repository context, secondary-maintainer direction, platform guardrail e specialist gate quando il public/security boundary cambia.

Il lead non diventa proprietario del Brand, dell’Identity Platform o della security policy.

Questo è esattamente il tipo di leverage discusso nel Capitolo 25: concentrare integration e execution senza concentrare tutte le authority.

## Quando riaprire la scelta

Se Campaign Launchpad entra in customer PII, personalized content, regulated consent, real-time CRM integration, arbitrary plugin o 24x7 contractual availability, non concludiamo che la tecnologia corrente “non scala”.

Concludiamo che è cambiato il problema e quindi devono essere riaperti outcome, quality floor, threat model e architecture decision.

> **La lezione non è che poca tecnologia sia sempre migliore. È che ogni componente deve poter indicare il requisito, il rischio o l’evidence che giustifica la sua presenza.**

Nel primo caso la migliore dimostrazione di maturità architetturale è anche la complessità che ESI ha saputo non introdurre prematuramente.