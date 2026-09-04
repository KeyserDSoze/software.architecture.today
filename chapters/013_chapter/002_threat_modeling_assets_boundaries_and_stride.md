## Threat modeling: partire da ciò che può essere abusato

La security architecture inizia quando alla domanda “il sistema funziona?” aggiungiamo: **come può essere abusato, da chi e con quale impatto?** Il threat modeling rende questa domanda ripetibile e la collega al design prima che i controlli vengano scelti per abitudine.

Microsoft descrive il threat modeling come un processo per identificare minacce potenziali e verificare che esistano mitigazioni appropriate. Lo distingue inoltre dall’attack surface analysis, che si concentra maggiormente sulle aree esposte all’attacco.

Fonte:

- [Microsoft Learn — Design secure applications on Azure](https://learn.microsoft.com/azure/security/develop/secure-design)

## Prima gli asset, poi i controlli

Un threat model che parte da Key Vault, firewall o WAF tende a produrre una lista di configurazioni. Per Order Operations partiamo invece da ciò che avrebbe valore per un attaccante o potrebbe produrre danno: `OperationalCase`, tenant isolation, Payment Escalation, operator identity, runtime identity, deployment capability, outbox, audit trail, provider credential e infrastruttura.

Un asset non è necessariamente un dato. Anche la capability “creare una Payment Escalation” è un asset, perché usarla senza authorization produce un effetto business pur senza leggere alcun secret.

Questa prospettiva rende il rischio più vicino al prodotto.

## Gli attori includono anche identità legittime compromesse

La minaccia non arriva sempre da un utente anonimo su Internet. Possiamo avere operatori e supervisor legittimi, workload e deployment identity, amministratori Platform, consumer Payments & Risk e provider esterni. Accanto a loro dobbiamo modellare account interni compromessi, pipeline manipolate, dependency malevole o runtime identity rubate.

Un account interno con privilegi troppo ampi può avere un blast radius maggiore di un attaccante anonimo che non supera l’ingress. Per questo il threat model non coincide con il firewall diagram.

## Trust boundary: dove cambiano le assunzioni

Un trust boundary è un punto in cui non possiamo semplicemente ereditare la fiducia dal componente precedente.

```text
Corporate user device
        ↓
Identity provider
        ↓
Application ingress
        ↓
Order Operations runtime
        ↓
PostgreSQL / Service Bus / Key Vault
        ↓
Payments & Risk
```

Ogni passaggio modifica almeno una dimensione: identity, ownership, privilege, tenant context, processo, rete o data classification. La domanda utile è quale identità attraversi il boundary, quale authorization venga applicata, quali dati transitino, quale canale li protegga e soprattutto che cosa succeda se il lato a monte viene compromesso.

Esistono quindi boundary di rete, ma anche di tenant, deployment, dati, privilegi, organizzazione e supply chain.

## STRIDE come vocabolario, non come risultato

Microsoft Threat Modeling Tool usa STRIDE come metodologia guidata:

```text
S — Spoofing
T — Tampering
R — Repudiation
I — Information Disclosure
D — Denial of Service
E — Elevation of Privilege
```

Fonte:

- [Microsoft Learn — Threat Modeling Tool threats / STRIDE](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-threats)

Il valore di STRIDE è aiutarci a guardare lo stesso flow da angoli diversi. Per una Payment Escalation, Spoofing ci fa chiedere se una sessione rubata possa impersonare un operatore; Tampering se `caseId`, tenant o reason possano essere manipolati; Repudiation quale evidence dimostri chi abbia richiesto l’azione; Information Disclosure se un case possa attraversare il tenant boundary; Denial of Service se escalation o query costose possano saturare il workload; Elevation of Privilege se un Operator possa ottenere capability da Supervisor o privilegi cloud.

La categoria non è la minaccia. È una lente per trovare uno scenario concreto.

## Abuse case: il modo più utile per conservare il perché

Una checklist con `[ ] authorization` dice poco. Un abuse case come:

> Un operatore compromesso tenta di creare una Payment Escalation per un `OperationalCase` appartenente a un altro tenant.

ci permette invece di derivare una mitigation coerente:

```text
server-side tenant resolution
+ authorization sulla risorsa
+ audit
+ cross-tenant negative tests
```

Il controllo conserva così il proprio motivo. Se in futuro il journey cambia, possiamo capire se la mitigation sia ancora pertinente invece di mantenere una checkbox per inerzia.

## Priorità senza falsa precisione

Possiamo usare una classificazione pragmatica del rischio:

```text
Impact: Low / Medium / High / Critical
Likelihood: Unlikely / Plausible / Likely
Disposition: Mitigate / Accept / Avoid / Transfer / Investigate
```

Non serve fingere una precisione numerica che non possediamo. Serve rendere visibile perché un rischio cross-tenant o economico riceva più attenzione di un finding tecnicamente interessante ma con impatto modesto.

Una minaccia può essere eliminata cambiando il design, ridotta con un controllo preventivo, resa osservabile, contenuta con least privilege, recuperata operativamente oppure accettata consapevolmente. A volte la soluzione più forte è eliminare la credenziale invece di proteggerla meglio, per esempio sostituendo una password applicativa con workload identity quando possibile.

## Il threat model è vivo perché il sistema cambia

Nuovo endpoint, provider, identity, datastore, data classification, deployment path o business capability possono modificare il rischio. Per questo il threat model non è un PDF del go-live ma una rappresentazione dell’architettura di rischio corrente.

L’AI può accelerarne l’enumerazione: applicare STRIDE a un diagramma, suggerire abuse case, cercare trust boundary dimenticati o confrontare IaC e permission. Se il contesto è incompleto, però, produrrà facilmente una lista plausibile e generica.

> **L’AI può accelerare l’enumerazione delle minacce. Il team deve ancora decidere quali conseguenze sono realmente intollerabili.**

Un test pratico riassume bene il capitolo: per ogni trust boundary dovremmo riuscire a completare la frase **“se il lato sinistro viene compromesso, il lato destro resta protetto da…”**. Se la risposta è soltanto “perché è nella nostra rete”, il boundary non è ancora stato progettato abbastanza.