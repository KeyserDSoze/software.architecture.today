# AI come leverage, non come authority

Nel libro l'AI ha ricoperto due ruoli diversi. Prima ha lavorato **sul software**, accelerando discovery, coding, refactoring, testing, review e documentazione. Poi è entrata **dentro il software** come runtime dependency del Case Explanation Assistant.

I failure mode cambiano, ma una regola sopravvive a entrambi i casi:

> **Capability non significa authority.**

Un coding agent può essere capace di modificare uno schema senza essere autorizzato a cambiare data ownership. Un modello può spiegare in modo convincente un pagamento senza possedere la verità sul `PaymentStatus`. Un executor può modificare il test che fallisce senza avere il diritto di ridefinire l'oracolo.

## Delegare execution senza nascondere nuove decisioni

Il principio iniziale era:

> **Delegare execution, non responsabilità.**

Delegare bene significa rendere comprensibili goal, scope, out-of-scope, context, azioni consentite, verification, stop condition ed escalation path. Non serve una procedura pesante per ogni task, ma chi esegue deve sapere dove termina l'execution autorizzata e dove comincia una decisione nuova.

Questo è il vero failure da evitare: non che l'agente faccia "troppo lavoro", ma che incorpori una decisione di dominio, security o ownership senza rendere visibile che quella decisione esisteva.

Una issue `add refund endpoint` può essere implementata tecnicamente in pochi minuti e contenere ancora domande su chi può fare refund, quale importo, quali stati, quale idempotency, quale audit e chi possiede l'effetto economico.

A quel punto l'agente non sta più eseguendo. Sta inventando semantica.

> **L'agente autonomo migliore non è quello che non si ferma mai. È quello che sa distinguere un ostacolo esecutivo da una nuova decisione.**

## Più agenti non significano automaticamente più capacità

Planner, Implementer, Verifier, Specialist Reviewer e Human Decision Owner sono responsabilità utili, non una prescrizione di cinque processi distinti.

Separare ruoli ha senso quando compra context separation, permission separation, independent evidence, specialist depth o riduzione del collision domain. Se non compra nulla, aggiunge orchestration cost.

La stessa regola vale per l'architect: il suo lavoro non è moltiplicare agenti, ma progettare un workflow in cui l'execution può aumentare senza moltiplicare decisioni incoerenti.

Da qui la frase:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

Cinque agenti che implementano API, schema, event contract, consumer e observability mentre data ownership è ancora aperta non sono cinque task indipendenti. Sono cinque modi di cristallizzare la stessa ambiguità.

## L'AI dentro il prodotto resta una dependency con confini

Nel Case Explanation Assistant abbiamo separato `confirmedFacts`, `hypotheses`, `missingEvidence` e `sourceReferences`. Il modello aiuta l'operatore a interpretare un case; non possiede PaymentStatus, Priority, refund authority o tenant authorization.

Questa limitazione non nasce da una sfiducia astratta verso l'AI. Nasce dalla stessa regola usata altrove: una componente non riceve authority su un fatto soltanto perché riesce a descriverlo bene.

Grounding migliora il contesto, ma non trasferisce automaticamente l'autorità della fonte al modello. Un modello può ricevere dati corretti e interpretarli male, seguire una instruction malevola contenuta nei dati o produrre un output strutturalmente valido e semanticamente falso.

Per questo authorization prima del retrieval, source boundary, deterministic validation, least privilege, eval, fallback e runtime observability restano architecture.

> **Grounding è un requisito. RAG è una possibile soluzione. Grounding non è authority.**

## Context engineering è una proprietà del sistema

`AGENTS.md`, Repository Map, ADR, contract e fitness function non esistono per riempire un context window. Esistono per rendere knowledge discoverable, policy visibile, unknown espliciti e verification eseguibile.

Il contesto migliore non è il più grande. È quello che porta alla fonte canonical senza confondere copie stale, istruzioni e authority.

> **Un buon file di istruzioni non prova a contenere il repository. Insegna all'agente come attraversarlo.**

Questo spiega anche il rischio di documentation laundering. Se un repository contiene drift, l'agente può copiarlo; la copia diventa precedente; più copie sembrano una convention; una documentazione generata può infine descrivere il drift come design intenzionale.

L'AI amplifica il sistema di context ed evidence che trova.

## Autonomy è una decisione di rischio

I livelli A0–A4 usati da ESI non misurano intelligenza. Misurano autonomia governabile.

Maggiore autonomy ha senso quando scope e permission sono chiari, il failure è bounded, il rollback o containment sono praticabili, l'evidence è disponibile e l'escalation path esiste.

Non quando il modello "sembra bravo".

I modelli cambieranno e le capability cresceranno. La domanda organizzativa resterà:

> **Quanto potere siamo disposti a concedere, su quale boundary e con quale evidence?**

## Il leverage che vogliamo

La promessa più interessante dell'AI non è produrre il massimo volume possibile. È liberare tempo dall'execution ripetitiva per problem framing, functional understanding, system discovery, trade-off, verification e learning.

Se il tempo liberato viene usato soltanto per lanciare altra execution, il sistema può produrre più software di quanto riesca a comprendere.

Il leverage sano è diverso:

> **Più execution delegata, con responsabilità ancora leggibile.**
