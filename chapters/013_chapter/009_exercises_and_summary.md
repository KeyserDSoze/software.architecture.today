## Esercizi, autovalutazione e sintesi

Security by Design non si impara memorizzando una lista di controlli.

Si impara collegando:

```text
asset
→ threat
→ boundary
→ mitigation
→ residual risk
→ verification
```

Questo capitolo ha introdotto un modo di ragionare che useremo in tutti i capitoli successivi.

## Idee chiave

1. Security è un quality attribute architetturalmente significativo.
2. Threat modeling deve precedere i controlli security-sensitive.
3. Un asset può essere un dato, una capability, una identity o un deployment path.
4. Un trust boundary non è soltanto una subnet.
5. STRIDE è una lente utile, non una religione.
6. Authentication e authorization rispondono a domande diverse.
7. Least privilege riduce il blast radius di una compromissione.
8. Runtime identity e deployment identity devono essere distinte.
9. Il secret migliore è spesso quello eliminato tramite workload identity.
10. Key Vault non sostituisce authorization e lifecycle del secret.
11. Private networking riduce reachability ma non crea trust.
12. Ingress ed egress devono essere progettati entrambi.
13. I log sono un data store e possono diventare un canale di leakage.
14. Audit log e application log hanno scopi differenti.
15. Secure SDLC significa integrare sicurezza in requirement, code, dependency, build, deploy e operation.
16. La supply chain include dependency, pipeline identity e artifact provenance.
17. Un Threat Model senza owner non governa il rischio.
18. Una Security Control Matrix collega minaccia, controllo, implementation ed evidence.
19. `Assume breach` significa progettare containment e recovery, non arrendersi all'attacco.
20. Security by Design non significa massimizzare tutti i controlli: significa scegliere i controlli con il fit corretto rispetto al rischio.

## Artefatti operativi

### Threat Model

Serve a conservare:

- scope;
- asset;
- actor;
- trust boundary;
- threat;
- abuse case;
- mitigation;
- residual risk;
- assumption;
- review trigger.

### Security Control Matrix

Serve a collegare:

```text
Threat
→ Control
→ Layer
→ Implementation
→ Verification
→ Owner
→ Status
```

I due artefatti devono poter essere letti insieme.

## Esercizio 1 — Asset inventory

Prendi un'applicazione reale su cui lavori.

Elenca almeno dieci asset.

Non limitarti ai dati.

Includi:

- capability privilegiate;
- identity;
- pipeline;
- configuration;
- audit;
- API key;
- deployment path.

Per ogni asset chiedi:

> Qual è il danno se viene letto, modificato, reso indisponibile o usato da un attore non autorizzato?

## Esercizio 2 — Trust boundary map

Disegna il critical user journey di una funzionalità autenticata.

Segna ogni punto in cui cambia almeno uno fra:

- identity;
- trust;
- network;
- tenant;
- process;
- ownership;
- privilege.

Per ogni boundary completa:

> Se il lato precedente viene compromesso, il lato successivo resta protetto da ________.

## Esercizio 3 — STRIDE su un endpoint

Scegli un endpoint write.

Per ciascuna categoria STRIDE trova almeno una minaccia plausibile.

Non serve che tutte abbiano lo stesso rischio.

Poi classifica:

```text
Impact
Likelihood
Disposition
```

## Esercizio 4 — Cross-tenant abuse case

Assumi che un utente autenticato conosca l'ID di una risorsa appartenente a un altro tenant.

Scrivi:

- request;
- expected response;
- authorization logic;
- audit evidence;
- test negativo.

Se la soluzione è soltanto “l'ID è difficile da indovinare”, il controllo non è sufficiente.

## Esercizio 5 — Compromise della runtime identity

Assumi che la managed identity del workload sia compromessa.

Elenca:

- risorse leggibili;
- risorse modificabili;
- secret accessibili;
- queue utilizzabili;
- control-plane permission;
- dati esfiltrabili.

Riduci il blast radius senza rompere il journey legittimo.

## Esercizio 6 — Elimina un secret

Trova una credenziale applicativa.

Chiedi:

1. serve davvero?
2. esiste workload identity/federation?
3. può essere scoped meglio?
4. come viene ruotata?
5. come viene revocata?
6. chi può leggerla?

L'obiettivo migliore dell'esercizio è cancellare il secret dal design.

## Esercizio 7 — Logging review

Prendi cinque log line reali.

Classifica ogni field:

```text
required
useful
unnecessary
sensitive
secret
```

Ricostruisci la telemetry usando allowlist esplicita dei field.

## Esercizio 8 — Public vs private

Confronta due design per la stessa applicazione interna:

### A

Public endpoint + strong identity + authorization.

### B

Private endpoint + identity + authorization.

Confronta:

- attack surface;
- developer experience;
- DNS/network complexity;
- incident response;
- cost;
- remote access;
- availability dependency.

Non assumere automaticamente che B sia “migliore”.

Decidi in base al threat model.

## Esercizio 9 — Pipeline threat model

Modelizza la CI/CD pipeline come un sistema privilegiato.

Threat candidate:

- stolen CI token;
- malicious dependency;
- poisoned artifact;
- unauthorized deployment;
- branch protection bypass;
- secret leakage;
- mutable artifact.

Definisci almeno un controllo preventivo e uno detective per ciascuna minaccia ad alto impatto.

## Esercizio 10 — Security Control Matrix

Costruisci una matrix con almeno dieci controlli.

Poi fai due query manuali:

### Query A

Quali threat non hanno alcun controllo?

### Query B

Quali controlli non sono collegati a nessun threat?

La seconda lista può contenere security theater.

## Esercizio 11 — Assume breach

Scegli un controllo primario e fallo fallire mentalmente.

Esempio:

```text
operator session compromised
```

Chiedi:

- cosa impedisce cross-tenant access?
- cosa impedisce cloud admin?
- cosa impedisce secret read?
- quale detection scatta?
- come revochiamo?

## Esercizio 12 — Order Operations

Sul capstone ESI, prova a contestare la decisione di private ingress.

Argomenta a favore di:

```text
public App Service + Entra + application authorization
```

Poi confronta con la decisione corrente.

L'obiettivo non è vincere.

È capire quale rischio stiamo pagando con maggiore networking complexity.

## Esercizio 13 — WAF justification test

Un collega propone un WAF.

Rispondi:

```text
Threat addressed:
Attack path:
Why current controls are insufficient:
Operational cost:
Failure mode:
Verification:
Trigger:
```

Se non riesci a completare il primo campo, non hai ancora una decisione.

## Esercizio 14 — AI adversarial review

Dai a un agente:

- Threat Model;
- Security Control Matrix;
- API Contract;
- Cloud Deployment Map;
- Bicep.

Chiedi di trovare:

- privilege mismatch;
- undocumented public exposure;
- missing threat;
- logging leakage;
- threat senza evidence;
- control senza owner.

Poi verifica ogni finding manualmente.

## Self-assessment

Dovresti riuscire a rispondere senza consultare il capitolo:

1. Perché authentication non implica authorization?
2. Perché private networking non elimina il bisogno di identity?
3. Che cosa cambia con `assume breach`?
4. Perché runtime e deployment identity devono essere distinte?
5. Quando Key Vault non è la soluzione migliore per un secret?
6. Perché una DLQ, un audit log e un application log hanno scopi diversi?
7. Che differenza c'è tra threat model e attack surface analysis?
8. A cosa serve STRIDE?
9. Perché un WAF può essere overengineering?
10. Che cos'è il residual risk?
11. Quali security control devono avere evidence?
12. Perché la pipeline fa parte del threat model?
13. Come riduce il rischio la data minimization?
14. Perché il secret scanning non basta dopo un secret commit?
15. Come può l'AI aiutare senza diventare l'autorità security?

Se molte risposte restano vaghe, riparti dal journey e dai trust boundary.

## Cosa cambia con l'AI

L'AI può oggi generare in pochi minuti:

- threat list;
- STRIDE table;
- RBAC proposal;
- Terraform/Bicep hardening;
- SAST rules;
- security test;
- security checklist.

Questo riduce il costo dell'enumerazione.

Ma aumenta un rischio nuovo:

```text
security-looking output
→ false sense of assurance
```

Un controllo generato deve ancora rispondere a:

- quale threat?
- quale scope?
- quale owner?
- quale evidence?
- quale failure mode?

Quindi:

> **Nell'era dell'AI possiamo generare security theater molto più velocemente. Dobbiamo anche imparare a riconoscerlo più velocemente.**

## Il compromesso ESI del capitolo

Order Operations accetta maggiore complessità di private networking e dipendenza dalla landing zone per ridurre reachability e blast radius di un workload interno sensibile.

Non accetta invece:

- authorization implicita;
- runtime identity amministrativa;
- production secret nel repository;
- public data plane per comodità;
- WAF senza threat;
- audit sostituito da normali log.

Questa è la differenza fra compromesso e scorciatoia.

## Ponte al Capitolo 14

Abbiamo progettato i boundary contro comportamento ostile.

Ma un sistema può fallire anche senza attaccante.

Nel prossimo capitolo entreremo in:

- reliability;
- resilience;
- fault tolerance;
- redundancy;
- graceful degradation;
- recovery;
- capacity;
- dependency failure;
- chaos/failure testing.

Il Threat Model e la Failure Mode Map inizieranno a sovrapporsi in modo interessante.

Un controllo security può creare un failure mode operativo.

Un meccanismo di resilienza può allargare la superficie d'attacco.

L'architettura deve governare entrambi.

## Corollario

> **Non chiedere soltanto se un sistema è protetto. Chiedi che cosa succede dopo che una protezione fallisce.**