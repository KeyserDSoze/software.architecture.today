# Come leggere un caso end-to-end

Un caso end-to-end non è un catalogo di componenti. Sapere che un sistema usa App Service, PostgreSQL, Service Bus o un LLM dice poco se non sappiamo quale problema quelle scelte stavano risolvendo.

La lettura utile ricostruisce una **catena di decisioni**.

## Dal problema alla promessa

Il punto di partenza deve poter essere espresso senza tecnologia.

Marketing non “deve costruire una piattaforma serverless”: deve pubblicare campagne standard senza aprire continuamente ticket a Engineering. Order Operations non “deve riscrivere il legacy”: deve assumere una business decision senza perdere conoscenza e rollback. L’AI Assistant non “deve usare un LLM”: deve ridurre il costo cognitivo dell’investigazione senza diventare una nuova authority.

Da qui ricaviamo un outcome che sopravvive a un cambio di provider o framework.

Se l’outcome contiene già la soluzione — “usare Static Web Apps”, “adottare RAG”, “passare ai microservizi” — abbiamo saltato il passaggio più importante.

## Dalla promessa al quality floor

Una volta chiaro l’outcome, chiediamo che cosa non può essere sacrificato per ottenerlo.

Campaign Launchpad deve impedire publication non approvate e mantenere rollback. La Priority migration non può introdurre silent semantic regression. Il Case Explanation Assistant non può trasformare model interpretation in business truth o attraversare un tenant boundary.

Il quality floor non è uguale per tutti i sistemi. Un prodotto marketing pubblico e un payment workflow non hanno lo stesso failure cost. Ma entrambi devono rendere esplicite le proprietà che restano non negoziabili.

Questa distinzione ci permette di cercare **robustezza appropriata**, non robustezza massima per principio.

## Ownership prima del diagramma

Prima di disegnare componenti chiediamo chi possiede la business rule, il dato, il rischio e la decisione di cambiamento.

Nel Case Explanation Assistant, per esempio, Orders possiede Order truth, Payments & Risk la truth economica, Order Operations il case context e il modello soltanto l’interpretazione advisory.

Questa mappa di authority determina ciò che il modello, il servizio o la migration non possono decidere autonomamente.

> **Un diagramma mostra dove vive il codice. L’ownership map mostra dove vive il diritto di definire il significato.**

## Il trade-off deve dichiarare ciò che compriamo e ciò che paghiamo

Ogni architecture decision dovrebbe poter essere letta come uno scambio.

Campaign Launchpad compra un operating surface piccolo rinunciando a parte della custom flexibility. La Priority migration compra reversibilità pagando coexistence temporanea. Il Case Explanation Assistant compra un blast radius ridotto mantenendo read-only authority e accettando più `InsufficientEvidence`.

Il trade-off resta leggibile quando possiamo indicare:

```text
benefit purchased
cost accepted
quality floor preserved
review trigger
```

Questo è molto più utile di “dipende”, perché spiega **da che cosa** dipende.

## Il failure model verifica se l’architettura sta proteggendo la cosa giusta

Le architetture diventano comprensibili quando le osserviamo dal failure che devono contenere.

Per Campaign Launchpad il problema è pubblicare la versione sbagliata o perdere la possibilità di tornare indietro. Nel brownfield è scambiare una differenza intenzionale per regressione, oppure scoprire un hidden consumer dopo il cutover. Nell’AI runtime è inventare un claim, perdere una source, subire prompt injection o dipendere troppo dal provider.

Il failure model non è un’appendice. È il controllo che il design stia proteggendo il vero quality floor.

## L’evidence deve avere la stessa granularità del claim

Una business rule può essere sostenuta da domain confirmation e behavioral test. Una publication path richiede deploy/smoke/rollback. Una migration richiede characterization e shadow evidence. AI groundedness richiede real model execution su eval versionati. Continuity richiede un drill reale.

Non usiamo una evidence economica per sostenere un claim più costoso.

Questa regola ci porta naturalmente alla production decision. Un caso non è end-to-end se termina con `implementation complete`. Deve arrivare almeno a `READY`, `CONDITIONAL`, `BLOCKED`, `NOT AUTHORIZED` o dichiarare esplicitamente che la decisione non può ancora essere presa.

Order Operations, per esempio, resta `NO-GO` nonostante molta implementation e documentation già esistano.

## L’End-to-End Decision Trace

La vista sintetica del capitolo è quindi:

```text
Problem
→ Outcome
→ Functional scope
→ Owners
→ Quality floor
→ Key trade-off
→ Architecture decision
→ Failure modes
→ Verification
→ Production decision
→ Open evidence / review trigger
```

Non è un template da riempire meccanicamente. È un test di causalità.

La domanda più severa è:

> **Se una decisione cambiasse, sappiamo indicare quale informazione, quale constraint o quale evidence dovrebbe essere cambiata prima?**

Se sì, stiamo osservando un sistema di decisioni. Se no, probabilmente stiamo descrivendo soltanto una soluzione già costruita.

Il caso GitHub dell’upgrade Rails è utile proprio perché conserva la transizione: dual boot, CI su versioni diverse, rollout progressivo e correzioni durante il percorso, invece di raccontare l’upgrade come un singolo switch.

Fonte:

- [GitHub Engineering — Upgrading GitHub from Rails 3.2 to 5.2](https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/)

> **Un buon case study non rende il passato inevitabile. Rende leggibili le condizioni che hanno reso una scelta ragionevole in quel momento.**
