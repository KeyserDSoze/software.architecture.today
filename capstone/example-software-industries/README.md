# Example Software Industries S.p.A. — ESI

> **Scenario enterprise fittizio di Software Architecture Today.**

ESI è la società immaginaria dentro cui vivono i capstone e molti degli esempi narrativi del libro.

Non rappresenta una società reale. Nomi, prodotti, persone, clienti, numeri e incidenti interni a ESI sono costruiti a fini didattici.

I casi reali citati nel libro restano separati e vengono identificati esplicitamente con fonti verificabili.

## Perché esiste questo scenario

Una scelta architetturale raramente viene presa nel vuoto.

Un prodotto vive dentro un'azienda con:

- obiettivi commerciali;
- clienti;
- budget;
- team;
- piattaforme comuni;
- vincoli di sicurezza;
- compliance;
- sistemi legacy;
- scadenze;
- skill disponibili;
- standard interni;
- costi operativi.

ESI ci permette di mantenere questi fattori presenti lungo tutto il libro.

> **L'architettura non elimina il compromesso. Impedisce che il compromesso rimanga nascosto.**

## Business unit

ESI opera attraverso più aree di prodotto.

```text
Example Software Industries S.p.A.
├── Engineering Software
├── Commerce & Operations
├── Payments & Risk
├── Marketing Technology
├── Mobile Products
├── Data & AI
├── Platform Engineering & Cloud
└── Corporate Systems
```

Le business unit non sono soltanto decorazione narrativa.

Possono introdurre requisiti, dipendenze e tensioni che cambiano le decisioni del capstone principale.

## Stakeholder ricorrenti

| Stakeholder | Interesse principale |
|---|---|
| Product | valore, adoption, time-to-market |
| Engineering | comprensibilità, qualità, evolvibilità |
| Architecture | trade-off, confini, coerenza sistemica |
| Security | rischio, least privilege, blast radius |
| Operations / SRE | operabilità, recovery, observability |
| Platform Engineering | leverage, standardizzazione, developer experience |
| Finance / FinOps | costo totale e prevedibilità |
| Legal / Compliance | obblighi normativi e contrattuali |
| Sales / Customer Success | commitment e bisogni dei clienti |
| Leadership | priorità e rischio aziendale accettabile |

Una soluzione può essere ottima per uno stakeholder e pessima per il sistema aziendale nel suo complesso.

Per questo nelle decisioni significative cercheremo di esplicitare:

```text
chi guadagna
chi paga
quale rischio diminuisce
quale rischio aumenta
quale costo viene spostato
quale decisione futura diventa più facile o più difficile
```

## Prodotti seguiti nel libro

Il prodotto principale è:

```text
products/order-operations/
```

**Order Operations** nasce nella business unit Commerce & Operations e cresce capitolo dopo capitolo.

Altri prodotti o capability di ESI potranno comparire quando servono per mostrare problemi che Order Operations non rappresenta bene, per esempio mobile offline, sistemi industriali, marketing ad alto volume, platform engineering o AI.

## Regola del mondo fittizio

ESI può essere usata per:

- costruire casi end-to-end;
- mostrare conflitti fra stakeholder;
- far cambiare requisiti nel tempo;
- introdurre incidenti simulati dichiarati come tali;
- confrontare alternative architetturali;
- esercitare analisi funzionale e decision making.

ESI non può essere usata per:

- spacciare numeri inventati per benchmark reali;
- attribuire best practice a organizzazioni reali;
- sostituire fonti tecniche quando facciamo claim fattuali;
- trasformare un caso simulato in prova che una tecnica sia universalmente corretta.

## Evidenze e scenario

Lo scenario racconta **come applichiamo** un principio.

Le fonti spiegano **perché quel principio o quella caratteristica tecnica è supportata**.

Quando il libro afferma qualcosa su HTTP, PostgreSQL, Azure, Kubernetes, consistency, security, SRE o qualsiasi tecnologia reale, continuiamo a usare standard, documentazione ufficiale, paper e casi reali documentati secondo `reference/SOURCE_POLICY.md`.

Quando invece diciamo che ESI ha un certo cliente, budget, workload o problema, stiamo descrivendo una premessa simulata del caso didattico.

## Company-level principle

Ogni volta che una soluzione sembra ovvia, ESI ci obbliga a fare una domanda in più:

> **È la soluzione migliore soltanto per il componente che stiamo guardando, o ha il fit migliore per il sistema aziendale che dovrà conviverci?**