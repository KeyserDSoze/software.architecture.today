## Sintesi: Security by Design significa rendere leggibile il rischio

Questo capitolo non chiede di memorizzare controlli. Chiede di imparare a collegare **asset → abuso plausibile → trust boundary → blast radius → mitigation → residual risk → evidence**.

Da questa catena discendono le decisioni concrete. Authentication non sostituisce authorization. Private networking riduce reachability ma non crea trust. Least privilege limita il danno dopo una compromissione. Runtime identity e deployment identity devono avere poteri differenti. Il secret migliore è spesso quello eliminato tramite workload identity; quando un secret resta, Key Vault non sostituisce permission model, rotation e revocation. I log sono un datastore e possono diventare un canale di leakage. Secure SDLC e supply-chain security servono a fare in modo che il threat model sopravviva alla prossima commit.

Threat Model e Security Control Matrix completano il ragionamento: il primo conserva scenari, asset, boundary, residual risk e assumption; la seconda collega ogni controllo a implementation, owner e verification. `Assume breach` aggiunge infine detection, response e recovery alla semplice prevenzione.

Security by Design non significa quindi massimizzare private endpoint, WAF, scanner o gate manuali. Significa sapere quale minaccia rende necessario ogni controllo e quale failure resta possibile dopo averlo introdotto.

## Artefatti operativi

Il **Threat Model** conserva scope, capability, asset, actor, trust boundary, threat, abuse case, mitigation, residual risk, assumption, accepted risk e review trigger.

La **Security Control Matrix** collega invece:

```text
Threat
→ Control
→ Layer
→ Implementation
→ Verification
→ Owner
→ Status
```

I due artefatti devono poter essere letti insieme. Una minaccia priva di controllo può essere un gap; un controllo che non si collega a nessuna minaccia può essere security theater.

## Esercizio 1 — Asset inventory

Prendi un’applicazione reale e identifica almeno dieci asset. Non limitarti ai dati: includi capability privilegiate, identity, pipeline, configuration, audit, API key e deployment path.

Per ciascuno chiedi quale danno deriverebbe da lettura, modifica, indisponibilità o uso da parte di un attore non autorizzato. Ordina poi gli asset per impatto, non per facilità tecnica di protezione.

## Esercizio 2 — Trust boundary map

Disegna un critical user journey autenticato e segna ogni punto in cui cambia almeno una fra identity, trust, network, tenant, processo, ownership o privilege.

Per ogni boundary completa:

> Se il lato precedente viene compromesso, il lato successivo resta protetto da ________.

Se non riesci a completare la frase senza dire “è nella rete interna”, approfondisci il boundary.

## Esercizio 3 — STRIDE su un endpoint

Scegli un endpoint write e usa STRIDE per generare threat candidate. Non forzare la stessa severità per tutte le categorie: classifica Impact, Likelihood e Disposition e conserva soltanto gli scenari che hanno un meccanismo di abuso plausibile.

L’obiettivo è usare STRIDE come lente, non produrre sei righe per obbligo.

## Esercizio 4 — Cross-tenant abuse case

Assumi che un utente autenticato conosca l’ID di una risorsa di un altro tenant. Definisci request, expected response, authorization logic, audit evidence e negative test.

Se la protezione dipende dalla difficoltà di indovinare l’ID, il tenant boundary non è stato progettato.

## Esercizio 5 — Compromise della runtime identity

Assumi che la managed identity del workload sia compromessa. Mappa risorse leggibili e modificabili, secret accessibili, messaging capability, control-plane permission e possibili dati esfiltrabili.

Riduci il blast radius mantenendo il journey legittimo. Il risultato dell’esercizio dovrebbe essere una permission map più stretta, non soltanto un alert aggiuntivo.

## Esercizio 6 — Elimina un secret

Prendi una credenziale applicativa e chiedi se possa essere sostituita con workload identity o federation. Se non può, documenta scope, owner, rotation, revocation, reader e failure behavior.

L’esito migliore è rimuovere il secret dal design; il secondo migliore è renderne il lifecycle indipendente dal codice.

## Esercizio 7 — Logging review

Prendi cinque log line reali e classifica ogni field come `required`, `useful`, `unnecessary`, `sensitive` o `secret`. Ricostruisci poi la telemetry usando una allowlist esplicita.

Se un field è utile soltanto “nel dubbio”, chiediti se il suo breach impact giustifichi davvero la raccolta.

## Esercizio 8 — Public vs private

Confronta per la stessa applicazione interna:

```text
A. public endpoint + strong identity + application authorization
B. private endpoint + identity + application authorization
```

Valuta attack surface, DNS/network complexity, developer experience, cost, incident response, remote access e nuove dependency di availability. Non assumere che B vinca automaticamente: scegli rispetto a un threat model esplicito.

## Esercizio 9 — Pipeline threat model

Modella la CI/CD pipeline come identity privilegiata. Considera stolen CI token, malicious dependency, poisoned artifact, unauthorized deployment, branch protection bypass, secret leakage e mutable artifact.

Per ogni scenario ad alto impatto definisci almeno una misura preventiva, una detective e un percorso di response/recovery.

## Esercizio 10 — Security Control Matrix

Costruisci una matrix con almeno dieci controlli e poi esegui due query: quali threat non hanno controllo e quali controlli non hanno threat.

La prima lista può mostrare risk gap. La seconda può mostrare controlli ereditati, ridondanti o security theater che meritano una review.

## Esercizio 11 — Assume breach

Scegli un controllo primario e fallo fallire mentalmente. Per esempio, considera compromessa la sessione di un operator.

Chiedi che cosa impedisca cross-tenant access, cloud administration e secret read; quale detection dovrebbe comparire; come revochiamo l’accesso e quale business activity può continuare durante la response.

## Esercizio 12 — Order Operations: contesta il private ingress

Sul capstone ESI costruisci il caso più forte a favore di:

```text
public App Service
+ Entra authentication
+ server-side authorization
```

Confrontalo con la decisione corrente di private ingress. Rendi visibili il rischio ridotto, la networking complexity acquistata e le condizioni che farebbero cambiare scelta.

## Esercizio 13 — WAF Justification Test

Un collega propone un WAF. Compila:

```text
Threat addressed:
Attack path:
Why current controls are insufficient:
Operational cost:
Failure mode:
Verification:
Review trigger:
```

Se il threat path non esiste nello scope corrente, non hai ancora una motivazione per introdurre il controllo.

## Esercizio 14 — AI adversarial review

Fornisci a un agente Threat Model, Security Control Matrix, API Contract, Cloud Deployment Map e IaC. Chiedigli di cercare privilege mismatch, undocumented public exposure, missing threat, logging leakage, threat senza evidence e controllo senza owner.

Verifica ogni finding manualmente e classificalo come proven, plausible, false positive oppure needs more context. L’AI accelera l’enumerazione; il team continua a possedere il risk decision.

## Autovalutazione

Dovresti saper spiegare senza consultare il testo perché authentication non implichi authorization; perché private networking non elimini identity; che cosa cambi con `assume breach`; perché runtime e deployment identity vadano separate; quando un secret possa essere eliminato; perché audit log e application log abbiano promesse differenti; che differenza esista fra threat model e attack surface analysis; come usare STRIDE senza trasformarlo in rituale; che cosa sia residual risk; e perché pipeline e artifact provenance appartengano alla security architecture.

Dovresti inoltre saper dire quale evidence dimostrerebbe che un controllo sia `Verified` invece di soltanto `Designed` o `Codified`.

## Cosa cambia con l’AI

L’AI può generare in pochi minuti threat list, STRIDE table, RBAC proposal, IaC hardening, SAST rule e negative security test. Questo riduce il costo dell’enumerazione e rende però molto più economico anche produrre **security-looking output** senza un modello del rischio abbastanza preciso.

Ogni controllo generato deve quindi continuare a rispondere a cinque domande: quale threat, quale scope, quale owner, quale evidence e quale failure mode.

> **Nell’era dell’AI possiamo generare security theater molto più velocemente. Dobbiamo imparare a riconoscerlo altrettanto velocemente.**

## Il compromesso ESI

Order Operations accetta maggiore complessità di private networking e una dipendenza più forte dalla landing zone per ridurre reachability e blast radius di un workload interno sensibile. Non accetta authorization implicita, runtime identity amministrativa, production secret nel repository, public data plane per comodità, WAF senza threat o audit sostituito dai normali log.

L’ADR `0003` conserva questa decisione; Threat Model e Security Control Matrix mantengono il collegamento fra rischio, controllo ed evidence.

## Ponte al Capitolo 14

Nel Capitolo 13 abbiamo modellato comportamento ostile. Un sistema può però fallire anche senza attaccante. Reliability e Security iniziano quindi a sovrapporsi: private DNS può diventare un failure domain; revocare una identity può interrompere un critical flow; una replica può aumentare disponibilità e superficie d’attacco; un controllo security può rendere più complessa la recovery.

Nel Capitolo 14 useremo Cloud Deployment Map, Failure Mode Map e Threat Model insieme per ragionare su resilience, graceful degradation, recovery e capacity.

## Corollario

> **Non chiedere soltanto se un sistema è protetto. Chiedi che cosa succede dopo che una protezione fallisce.**