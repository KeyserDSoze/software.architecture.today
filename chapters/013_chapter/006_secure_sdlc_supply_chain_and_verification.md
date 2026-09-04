## Secure SDLC: la security deve sopravvivere alla prossima modifica

Un threat model accurato serve poco se il normale processo di sviluppo può introdurre vulnerabilità senza accorgersene. Security by Design deve quindi attraversare requirements, design, code, dependency, build, test, artifact, deployment e operation.

NIST SSDF nasce proprio per integrare pratiche di secure software development nei diversi SDLC con l’obiettivo di ridurre vulnerabilità, limitarne l’impatto e affrontarne le cause ricorrenti.

Fonte primaria:

- [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

La domanda del Secure SDLC non è “quanti scanner abbiamo?”. È **come trasformiamo le decisioni del threat model in proprietà che continuano a essere verificate mentre il repository cambia?**

## Requisiti security che possono fallire in modo osservabile

“L’app deve essere sicura” non è un requirement verificabile. È molto più utile scrivere che un Operations Operator non può leggere un case di un tenant non autorizzato, che la runtime identity non può cambiare RBAC Azure, che un production secret non può entrare nel repository o che una vulnerability critica non accettata blocca la promotion.

OWASP ASVS offre un riferimento strutturato per requisiti e verifiche di application security.

Fonte:

- [OWASP — Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

Non lo trasformiamo in una checklist totale. Lo usiamo per non affidare alla memoria del team le verifiche pertinenti al nostro scope.

## Review e scanning risolvono problemi diversi

Una code review security-aware cerca authorization bypass, injection, unsafe deserialization, mass assignment, secret leakage, logging eccessivo, SSRF, path traversal, crypto impropria e permission amplification. Un agente AI può essere molto efficace nel primo pass, ma un finding non è automaticamente una vulnerabilità e l’assenza di finding non dimostra sicurezza.

SAST può trovare pattern rischiosi nel codice; non conosce però da solo la regola secondo cui un Operator può creare una Payment Escalation, un Supervisor può avere override specifici e Payments rimane owner del refund. Lo static analysis e il domain understanding coprono failure differenti.

Lo stesso vale per Software Composition Analysis. Sapere che una dependency ha una CVE è importante, ma supply-chain risk comprende anche provenienza, maintainer, transitive dependency, codice eseguito in build/install, registry, determinismo delle versioni e capacità di aggiornare rapidamente.

## Determinismo rende verificabile ciò che distribuiamo

Lockfile, build riproducibili e artifact provenance non rendono automaticamente sicure le dependency. Rendono però più deterministico **che cosa** stiamo verificando e distribuendo.

Una SBOM può rispondere a domande operative come “questa vulnerability riguarda davvero un componente presente nell’artifact in produzione?”. È uno strumento di conoscenza e response, non una certificazione di supply-chain security.

Dovremmo inoltre poter ricondurre un artifact al commit e alla pipeline che l’ha prodotto, sapere quali dependency vi siano entrate e promuovere lo stesso artifact fra ambienti invece di ricostruirlo silenziosamente in ogni stage.

## Un secret committed va considerato compromesso

Secret scanning locale, in CI o tramite repository protection riduce la probabilità che una credenziale entri nella history. Se succede, cancellare la riga non basta: la credenziale può essere già stata copiata e deve essere ruotata o revocata.

Questo è un buon esempio di `assume breach`: il controllo preventivo può fallire, quindi serve anche una response strategy.

## La pipeline è una identity privilegiata

CI/CD può produrre artifact, cambiare infrastruttura, distribuire codice e modificare configuration. Un token pipeline con privilegi di subscription owner e lunga durata può quindi avere un blast radius superiore al runtime applicativo.

La direzione preferibile è federation/workload identity con deployment role scoped, audit e, dove il rischio lo giustifica, environment protection o approval mirate. Il dettaglio della pipeline arriverà più avanti, ma il threat model deve includerla già ora.

Runtime identity e deployment identity rimangono separate proprio perché una compromissione nei due percorsi non deve aprire gli stessi poteri.

## Environment separation deve essere reale

Dev, staging e production devono separare dati, permission, identity, secret e target di deployment. Una credential development capace di modificare production annulla gran parte del valore degli ambienti separati.

Non è necessario che ogni ambiente abbia identica capacity, ma i boundary di privilegio e il deployment mechanism devono essere abbastanza simili da rendere attendibile ciò che testiamo.

## Platform Engineering rende la strada sicura la strada facile

Microsoft Well-Architected raccomanda security baseline, configurazioni documentate, automation dei controlli e integrazione di threat modeling, scanning e testing nel processo di sviluppo.

Fonte:

- [Microsoft Learn — Establish a security baseline](https://learn.microsoft.com/azure/well-architected/security/establish-baseline)

In ESI questo significa approved IaC modules, policy baseline, managed identity, central logging, private networking capability e security scanning default. Platform non decide l’authorization applicativa, ma evita che ogni workload debba reinventare TLS, identity foundation e log collection.

La distinzione fra guardrail e gate rimane importante. HTTPS-only, minimum TLS, secret scan o alcune public-access restriction sono buoni candidati all’enforcement automatico. Nuovo public ingress, nuovo privileged role, acceptance temporanea di una critical vulnerability o una nuova regulated data class possono invece meritare una decisione esplicita.

Mettere tutto dietro approvazione manuale non è maturity. Spesso è soltanto automazione insufficiente.

## AI: difesa e velocità di errore crescono insieme

L’AI può generare security test, policy review, dependency analysis e patch. Può anche produrre authorization incompleta, crypto improvvisata, configurazioni permissive o security theater estremamente plausibile.

> **La generazione rende economico aggiungere controlli. Non rende economico capire se controllano la minaccia giusta.**

Per questo una feature che attraversa un trust boundary dovrebbe portarsi dietro una piccola Definition of Done security-aware: threat model aggiornato quando necessario, authorization esplicita, negative test, data classification dei log, impact su secret/dependency/IaC e detection operativa.

Non trasformiamo ogni pull request in un audit. Rendiamo riconoscibili le modifiche che cambiano il rischio.

> **La security che esiste solo nel documento di design scompare alla prima modifica non governata.**