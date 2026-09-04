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

Possono introdurre requisiti, dipendenze e tensioni che cambiano le decisioni dei prodotti.

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

### Order Operations

```text
products/order-operations/
```

Business unit:

```text
Commerce & Operations
```

È il capstone principale e cresce capitolo dopo capitolo.

Copre progressivamente:

```text
functional analysis
architecture/data/API
cloud/security/reliability
legacy/refactoring
AI-native engineering
runtime AI
production readiness
```

Sistema legacy collegato:

```text
legacy/operations-desk-classic/
```

### Campaign Launchpad

```text
products/campaign-launchpad/
```

Business unit:

```text
Marketing Technology
```

Introdotto nel Capitolo 27 come secondo prodotto persistente ESI.

Serve a mostrare un percorso end-to-end piccolo e adatto a un One-Man Project operating model:

```text
approved campaign templates
internal authoring
approval
versioned publication
public static delivery
rollback
```

Il prodotto è intenzionalmente più semplice di Order Operations.

Non eredita la sua topology soltanto perché appartiene alla stessa azienda.

Current state:

```text
problem/scope/architecture/readiness = documented
authored implementation            = not started
runtime evidence                    = not started
```

## Tre casi end-to-end del Capitolo 27

```text
1. Campaign Launchpad
   → small / One-Man Project

2. Operations Desk Classic → Order Operations Priority
   → enterprise brownfield

3. Case Explanation Assistant
   → AI-native runtime capability
```

I tre casi usano lo stesso metodo ma producono architetture differenti.

> **La maturità non sta nel far assomigliare i prodotti. Sta nel sapere quali proprietà devono essere condivise e quali decisioni devono restare specifiche del workload.**

## Architect Capability Map — Capitolo 28

Il Capitolo 28 introduce un artefatto company-level:

```text
ARCHITECT_CAPABILITY_MAP.md
```

La map non è una matrice di certificazioni né un ranking delle persone.

Descrive undici aree di capacità:

```text
Product & Functional Analysis
System Boundaries & Domain Design
Technical & Code Literacy
Data & Distributed Systems
Security, Reliability & Operability
Economics & Cost
Evolution, Legacy & Reversibility
AI Runtime Architecture
Agentic Engineering Governance
Enterprise Systems & Communication
Evidence, Learning & Teaching
```

Uso ESI:

```text
learning plan
staffing
specialist trigger
continuity
mentoring
portfolio risk
```

Principio:

> **Ampiezza per capire il sistema. Profondità sufficiente per non essere ingannati dalle astrazioni.**

L'artefatto è company-level perché la responsabilità architetturale attraversa Order Operations, Campaign Launchpad e i futuri prodotti ESI senza dipendere da un singolo stack.

## Company-level paved roads

ESI può offrire capability comuni quando riducono costo e rischio senza cancellare il fit locale.

Candidate shared guardrails:

```text
enterprise identity
secret management
baseline CI/CD
security scanning
cost-allocation metadata
observability conventions
repository ownership
landing-zone guardrails
incident escalation interfaces
```

Non diventano automaticamente obblighi su:

```text
compute
database
messaging
topology
AI retrieval architecture
```

La standardizzazione deve comprare una proprietà, esattamente come qualsiasi altra decisione architetturale.

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
