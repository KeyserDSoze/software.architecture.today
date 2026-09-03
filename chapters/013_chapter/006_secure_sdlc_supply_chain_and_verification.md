## Secure SDLC: la security deve sopravvivere alla prossima commit

Un threat model perfetto non serve molto se il processo di sviluppo può introdurre vulnerabilità senza alcun controllo.

Security by Design deve quindi attraversare anche:

```text
requirements
→ design
→ code
→ dependencies
→ build
→ test
→ artifact
→ deployment
→ operation
```

NIST SSDF nasce proprio per integrare pratiche di secure software development nei diversi SDLC, con l'obiettivo di ridurre vulnerabilità, ridurne l'impatto quando restano e affrontarne le cause ricorrenti.

Fonte primaria:

- [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## Security requirement verificabili

“L'app deve essere sicura” non è un requisito.

Come nel Capitolo 6 con i quality attribute, anche qui gli aggettivi non bastano.

Meglio:

```text
una Operations Operator non può leggere OperationalCase di un tenant non autorizzato

una runtime identity non può modificare RBAC Azure

un secret non può essere committed nel repository

un package con vulnerability critica non accettata non può essere promosso in produzione
```

OWASP ASVS è utile perché fornisce un riferimento strutturato per requisiti e verifiche di application security, utilizzabile come metrica e come guidance.

Fonte:

- [OWASP — Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

Non adotteremo ASVS come checklist totale in ogni capitolo.

Lo useremo come una delle fonti per verificare che i controlli applicativi importanti non dipendano soltanto dalla memoria del team.

## Code review

Una code review security-aware cerca anche:

- authorization bypass;
- injection;
- unsafe deserialization;
- mass assignment;
- secret leakage;
- logging eccessivo;
- path traversal;
- SSRF;
- weak crypto usage;
- dependency non necessarie;
- permission amplification.

L'AI può fare un primo pass molto efficace.

Ma un finding generato non equivale a una vulnerabilità reale e l'assenza di finding non equivale a sicurezza.

Serve correlare il codice con il threat model.

## Static analysis

SAST può trovare classi di problema nel codice prima dell'esecuzione.

Ma non può sapere da solo che:

```text
Operator può creare PaymentEscalation
Supervisor può approvare override
Payments possiede il refund
```

Quindi static analysis e domain understanding risolvono problemi diversi.

## Software Composition Analysis

Una parte crescente del software arriva da dependency.

Il rischio non è soltanto:

```text
questa library ha una CVE?
```

Ma anche:

- chi la mantiene?
- è ancora necessaria?
- quale codice esegue durante build/install?
- quale transitive dependency introduce?
- da quale registry arriva?
- la versione è deterministica?
- possiamo aggiornare rapidamente?

Supply chain security inizia anche dalla capacità di sapere cosa stiamo eseguendo.

## Lockfile e build riproducibile

Nel capstone TypeScript usiamo un lockfile quando installeremo le dependency reali.

L'obiettivo è ridurre la variabilità fra build.

Non significa che un lockfile renda sicure le dependency.

Significa che rende più deterministico ciò che stiamo verificando.

## SBOM

Una Software Bill of Materials può aiutare a conoscere i componenti inclusi in un artifact.

Ma anche qui:

```text
SBOM presente
≠ supply chain secure
```

Serve per rispondere meglio a domande come:

> Questa vulnerability riguarda un componente che abbiamo distribuito?

Il valore è operativo e investigativo.

## Secret scanning

Il repository deve impedire il più possibile che secret reali entrino nella history.

Controlli possibili:

- pre-commit/local scanning;
- CI scanning;
- repository secret scanning;
- push protection;
- policy sui file di configurazione.

Ma se un secret viene committed, la correzione non è soltanto cancellare la riga.

Serve assumere compromissione e ruotare/revocare la credenziale.

## Pipeline identity

La CI/CD pipeline è una identity privilegiata.

Può potenzialmente:

- produrre artifact;
- modificare infrastruttura;
- distribuire codice;
- cambiare config.

Quindi deve ricevere least privilege quanto il runtime.

Pattern pericoloso:

```text
CI secret = subscription owner credential senza scadenza
```

Direzione migliore:

```text
federated identity / workload identity
+ scoped deployment role
+ environment approval dove giustificato
+ audit
```

Il dettaglio della pipeline arriverà più avanti, ma il threat model deve includerla già adesso.

## Artifact integrity

Dobbiamo poter rispondere:

- quale commit ha prodotto questo artifact?
- quale pipeline?
- con quali dependency?
- è lo stesso artifact promosso fra ambienti?
- è stato modificato dopo la build?

La sicurezza della supply chain non è soltanto “scannerizzare il codice”.

È preservare la provenienza dell'eseguibile.

## Environment separation

Dev, staging e production non devono differire soltanto per nome.

Serve separare:

- data;
- access;
- identity;
- secret;
- permission;
- deployment target.

Una credenziale dev che può modificare production annulla gran parte della separazione ambientale.

## Security baseline automatizzata

Microsoft Well-Architected raccomanda di definire baseline di sicurezza, documentare configurazioni, automatizzare i controlli quando possibile e includere threat modeling, scanning e testing nel processo di sviluppo.

Fonte:

- [Microsoft Learn — Establish a security baseline](https://learn.microsoft.com/azure/well-architected/security/establish-baseline)

Per ESI, Platform Engineering deve quindi rendere facile la strada sicura:

```text
approved IaC modules
policy baseline
managed identity
central logging
private DNS/network capability
security scanning defaults
```

La platform non deve chiedere a ogni team di reinventare TLS, identity e log collection.

## Guardrail vs gate

Un guardrail impedisce o segnala automaticamente classi di configurazione pericolose.

Un gate richiede una decisione esplicita prima di procedere.

Servono entrambi.

Esempio:

### Guardrail

```text
HTTP disabled
minimum TLS enforced
public network disabled on protected resources
secret scan in CI
```

### Gate

```text
new public ingress
new privileged role
critical vulnerability accepted temporarily
new regulated data class
```

Mettere tutto dietro approvazione manuale non è maturity.

È spesso soltanto bassa automazione.

## AI e secure development

L'AI aumenta sia la capacità difensiva sia la velocità con cui possiamo introdurre errori.

Può generare:

- security test;
- IaC policy review;
- secret scan rule;
- threat candidate;
- dependency analysis;
- patch.

Ma può anche generare:

- authorization incompleta;
- crypto improvvisata;
- validation superficiale;
- configurazioni cloud permissive;
- dependency non necessarie;
- security theater molto convincente.

Quindi:

> **La generazione rende economico aggiungere controlli. Non rende economico capire se controllano la minaccia giusta.**

## Definition of Done security-aware

Una feature che attraversa un trust boundary dovrebbe chiedere almeno:

```text
[ ] threat model aggiornato se necessario
[ ] authorization decision esplicita
[ ] negative test definiti
[ ] log data classification verificata
[ ] secret/credential impact verificato
[ ] dependency impact verificato
[ ] IaC/network impact verificato
[ ] operational detection considerata
```

Non serve trasformare ogni pull request in un audit completo.

Serve impedire che le modifiche ad alto impatto sembrino normali modifiche locali.

## La frase da ricordare

> **La security che esiste solo nel documento di design scompare alla prima modifica non governata.**