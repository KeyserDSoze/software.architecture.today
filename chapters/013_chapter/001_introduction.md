# Capitolo 13 — Security by Design

Nel capitolo precedente abbiamo finalmente dato a Order Operations una topologia cloud concreta: App Service, WebJob, PostgreSQL gestito, Service Bus, managed identity, Key Vault e una prima strategia single-region. Poi ci siamo fermati prima di decidere ingress, privilegi, private connectivity, logging sensibile e accesso al control plane.

Non era incompletezza. Era sequenza corretta del reasoning. Un template IaC può essere generato in pochi secondi; decidere **che cosa stiamo proteggendo, da chi, attraverso quali boundary e con quale impatto sul business** richiede prima una comprensione del rischio.

Questo è il punto di partenza della Security by Design.

## Security è architettura quando modifica i confini

Trattare la sicurezza come una fase finale produce un workflow pericoloso:

```text
costruiamo
→ integriamo
→ deployiamo
→ facciamo security review
→ scopriamo che identity, authorization o topology sono sbagliate
```

A quel punto correggere può significare cambiare API contract, data ownership, permission model, network topology, pipeline e perfino il deployment boundary. Non è quindi soltanto una review arrivata tardi: alcune decisioni di sicurezza **sono decisioni architetturali**.

Microsoft integra il threat modeling nel proprio Security Development Lifecycle proprio per identificare e mitigare problemi quando sono ancora relativamente economici da correggere.

Fonte:

- [Microsoft Learn — Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)

NIST SSDF esprime lo stesso principio dal punto di vista del software lifecycle: le pratiche di secure development devono entrare nel processo di sviluppo, non essere aggiunte come attività isolata alla fine.

Fonte primaria:

- [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## Secure by design non significa massimizzare i controlli

Una security architecture matura non è quella con il maggior numero di firewall, WAF, private endpoint, scanner e approvazioni manuali. È quella in cui asset, trust boundary, privilegi, minacce e mitigazioni sono abbastanza espliciti da poter spiegare **quale rischio riduce ogni controllo e quale rischio residuo resta**.

A volte il controllo corretto sarà un private endpoint. A volte una managed identity. A volte server-side authorization. A volte la scelta più sicura sarà non raccogliere affatto un dato. In altri casi un endpoint pubblico, autenticato e strettamente governato può essere più appropriato di una rete privata e piatta in cui qualunque workload può muoversi lateralmente.

Il controllo viene dopo il rischio, esattamente come la tecnologia viene dopo il requisito.

## Assume breach cambia la domanda

Microsoft Azure Well-Architected usa i principi Zero Trust `verify explicitly`, `use least privilege access` e `assume breach`.

Fonte:

- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)

Il terzo principio cambia davvero il modo di pensare. Se una sessione, un token, una workstation o una runtime identity possono essere compromessi, la domanda non è più soltanto “come impediamo il primo accesso?”. Diventa:

> **Quanto può fare un attaccante dopo che un primo controllo ha fallito?**

È qui che least privilege, tenant isolation, separation of duties, private reachability, audit e revocation diventano parti dello stesso problema: **contenere il blast radius**.

## Il caso Cloudflare / Okta del 2023

Cloudflare ha descritto pubblicamente un incidente del 2023 in cui una sessione amministrativa Okta compromessa permise accesso alla propria istanza identity. Nel postmortem l’azienda dichiarò che customer system e production network non furono impattati e collegò il contenimento alla detection rapida, alla risposta e alla propria architettura Zero Trust.

Fonte primaria:

- [Cloudflare — How Cloudflare mitigated yet another Okta compromise](https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/)

Non ci interessa copiare i prodotti o l’architettura Cloudflare. Ci interessa una proprietà generale: **una identity compromessa non dovrebbe trasformarsi automaticamente nel controllo dell’intero sistema**. Il danno possibile dipende dai boundary progettati prima dell’incidente.

## ESI: sicurezza contro friction, non sicurezza contro delivery

Security identifica per Order Operations rischi concreti: accesso cross-tenant, abuso della Payment Escalation, credential theft, lateral movement, runtime identity troppo privilegiata, deployment malevoli, leakage nei log e accesso amministrativo eccessivo.

Platform Engineering vuole trasformare i controlli ripetibili in capability e policy condivise. Commerce & Operations vuole continuare a fare delivery e troubleshooting senza trasformare ogni modifica in un progetto security separato.

Queste esigenze non sono opposte. Il compromesso del capitolo è ridurre reachability e privilegio **senza sostituire automazione e ownership con una coda permanente di approvazioni**.

Il quality floor è chiaro: autenticazione forte, authorization esplicita, tenant isolation, least privilege, nessun production secret nel repository, separazione runtime/deployment identity, audit delle operazioni sensibili, revocation path, logging utile all’incident response senza leakage intenzionale e deployment security-sensitive verificabile.

## Security è una capacità condivisa

Possiamo avere specialisti Security, ma la conoscenza del rischio non può essere esternalizzata interamente a un team. Developer, architect, Platform, Security e Operations devono condividere asset, trust boundary, identity flow, privilege model, dati sensibili, operazioni pericolose e recovery.

Se soltanto Security sa perché un controllo esiste, il controllo tenderà a degradare con il tempo. Se soltanto il workload team conosce il journey, il threat model perderà proprio la semantica necessaria a distinguere un rischio reale da una checklist generica.

## Il percorso del capitolo

Procediamo con una sequenza causale:

```text
asset e abuse case
→ trust boundary
→ identity e privilege
→ dati / secrets / logging
→ network reachability
→ secure development e supply chain
→ Threat Model
→ Security Control Matrix
→ baseline ESI
```

Order Operations produrrà Threat Model, Security Control Matrix, ADR della security topology e una prima baseline IaC coerente con il rischio che abbiamo modellato.

Non proveremo a dichiarare il sistema “sicuro”. Una definizione molto più utile è: **security modeled, controls traceable, privilege boundaries explicit, evidence producibile e residual risk visibile**.

> **Security by Design non significa aggiungere più controlli. Significa fare in modo che il sistema conosca i propri confini prima che li scopra un attaccante.**