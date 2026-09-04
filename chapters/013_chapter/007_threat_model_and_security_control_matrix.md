## Threat Model e Security Control Matrix

In questo libro separiamo due artefatti che spesso vengono confusi. Il **Threat Model** conserva ciò che può andare storto, perché conta e quali assunzioni attraversano il sistema. La **Security Control Matrix** collega invece ogni rischio ai controlli, all’implementation direction, all’owner e soprattutto all’evidence che dimostra che il controllo esista davvero.

```text
Threat Model
→ rischio e reasoning

Security Control Matrix
→ controllo, responsabilità e verifica
```

Il primo evita security control senza minaccia. Il secondo evita threat list che non cambiano il sistema.

## Threat Model — template operativo

```markdown
# Threat Model

## Scope

## Business capabilities

## Assets

## Actors

## Trust boundaries

## Data flows

## Threats

| ID | Scenario | STRIDE | Asset | Impact | Likelihood | Mitigation | Residual risk | Owner |
|---|---|---|---|---|---|---|---|---|

## Abuse cases

## Security assumptions

## Accepted risks

## Open questions

## Review triggers
```

STRIDE non è obbligatorio per ogni threat model. Lo usiamo perché fornisce un vocabolario pratico e Microsoft lo integra nel proprio Threat Modeling Tool.

Fonte:

- [Microsoft Learn — Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)

## Lo scope deve seguire il flow che stiamo proteggendo

Per Order Operations non modelliamo genericamente “Azure”. Lo scope iniziale attraversa workforce ingress, application authorization, PostgreSQL, outbox, Service Bus, Payments & Risk, Key Vault e deployment/control plane. È abbastanza ampio da vedere i boundary rilevanti e abbastanza stretto da evitare minacce generiche prive di owner.

Gli asset ricevono identity stabili (`A-01`, `A-02`...) quando questo migliora traceability. Lo stesso vale per i threat. Un record come:

```text
T-04
Authenticated operator reads a case belonging to another tenant by changing caseId.

Impact: Critical
Mitigation: server-side tenant authorization + negative tests + audit
```

è molto più utile di “Information Disclosure — mitigated”. Conserva scenario, impatto e ciò che deve essere verificato.

## Residual risk: un controllo riduce il rischio, non lo cancella

Dopo server-side authorization resta la possibilità di un bug applicativo. Possiamo ridurla ulteriormente con negative integration test, access telemetry e review. Non esiste il passaggio magico da `risky` a `secure` perché un controllo è stato disegnato.

Il residual risk serve proprio a ricordare quale failure resta plausibile dopo la mitigation e quale detection/recovery lo rende governabile.

## Security Control Matrix — dal diagramma all’evidence

```markdown
# Security Control Matrix

| Control | Threats | Layer | Implementation | Verification | Owner | Status |
|---|---|---|---|---|---|---|
| SC-01 Entra authentication | T-01 | identity | App Service auth | unauthorized request test | workload team | planned |
| SC-02 Tenant authorization | T-04 | application | server-side policy | cross-tenant negative tests | workload team | implemented |
| SC-03 Managed identity | T-07 | identity | system-assigned MI | RBAC inspection | platform/workload | planned |
```

La matrix ci impedisce di trattare `Key Vault`, `private endpoint` o `managed identity` come icone autoesplicative. Per ciascun controllo dobbiamo sapere quale threat affronti, quale non affronti, chi lo configuri e quale evidence ne dimostri il comportamento.

“È configurato” è una claim. Un Bicep deployment, un effective-RBAC check, un negative test, una query di policy compliance o un restore exercise possono diventare evidence.

## Prevent, detect, respond, recover

`Assume breach` richiede più della prevenzione. Authorization e least privilege cercano di impedire l’abuso; audit, anomaly signal e secret scanning aiutano a rilevarlo; identity revocation, endpoint restriction e pipeline suspension sono response; restore di un known-good deployment, outbox reconciliation e permission re-establishment appartengono al recovery.

Un threat model fatto soltanto di controlli preventivi contiene l’assunzione implicita che la prevenzione non fallisca mai. È esattamente l’opposto del modello che vogliamo costruire.

## Le assunzioni devono avere lo stesso livello di visibilità delle minacce

ESI può assumere che il tenant Entra sia governato centralmente, che Payments deduplichi `EscalationId`, che Platform possieda private DNS oppure che la production deployment identity usi federation. Ognuna di queste frasi, se falsa, modifica il risk model.

Scriverle rende il threat model aggiornabile. Nasconderle trasforma dependency organizzative in sorprese operative.

## Risk acceptance non è una checkbox mancante

Nel Capitolo 13 non introduciamo un WAF sul private internal ingress. Questa non è dimenticanza. È un accepted risk motivato dall’assenza di un Internet-facing path e accompagnato da un trigger: se comparirà public/partner/mobile ingress, la decisione verrà riaperta.

La differenza fra omissione e risk acceptance è avere reasoning, owner e review trigger.

## Control ownership attraversa i team

Entra tenant policy appartiene prevalentemente a Security/Platform; application authorization a Order Operations; Service Bus RBAC è condiviso fra workload e platform baseline; downstream idempotency appartiene a Payments & Risk.

Il rischio attraversa ownership diverse. La matrix rende leggibile il contratto fra i team senza fingere che un solo gruppo possa implementare tutta la sicurezza end-to-end.

## Designed, Codified, Verified, Monitored

Un controllo può essere documentato senza esistere in codice; può essere codificato in Bicep senza essere stato deployed; può essere verificato in staging senza avere ancora drift detection continua.

Per questo usiamo la progressione già introdotta nel front matter:

```text
Designed
→ intent architetturale documentato

Codified
→ codice / IaC / policy esiste

Verified
→ evidence dimostra il comportamento

Monitored
→ drift o failure possono essere osservati operativamente
```

Questa distinzione evita di promuovere automaticamente una buona intenzione a controllo funzionante.

OWASP ASVS può contribuire a trasformare authentication, access control, validation e altre aree applicative in verification requirement selezionati per lo scope.

Fonte:

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

## AI-assisted control review

Un agente può confrontare Threat Model, Security Control Matrix, Bicep e application code cercando threat senza controllo, controlli senza threat, privilege mismatch, public exposure inattesa, missing test o documentation drift.

Questo è molto più utile di un prompt come “rendi sicura questa architettura”, perché il sistema di riferimento contiene già rischio, decisione e criterio di verifica.

> **Una minaccia senza owner è una preoccupazione. Un controllo senza verifica è una speranza.**