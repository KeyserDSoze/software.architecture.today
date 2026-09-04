# 23.5 — Verifica indipendente ed evidence

Quando un agente produce più codice, la reazione intuitiva è aggiungere più review.

Non basta.

La quantità di review non compensa automaticamente una evidence debole. Cinque persone possono leggere un diff e nessuna può dimostrare che una transaction PostgreSQL rollbacki davvero nel failure scenario che ci interessa.

La domanda corretta è:

> **quale proprietà importante stiamo accettando, con quale evidence e quanto quella evidence dipende dalla stessa interpretazione che ha prodotto l'implementazione?**

## Review e verification rispondono a domande diverse

Una code review può trovare coupling, naming problematico, edge case dimenticati, security smell o test troppo deboli. È una source preziosa di signal.

Ma alcune claim richiedono di attraversare il boundary reale.

Una review testuale non dimostra PostgreSQL commit/rollback, non prova una private route Azure, non misura un restore rispetto a RTO/RPO e non dimostra che un consumer reale tolleri un contract change.

Ritorna quindi una regola del Capitolo 16:

> **Use the real technology when testing the boundary itself.**

Il Verifier deve sapere quando leggere è sufficiente e quando serve evidence prodotta dal sistema reale o da un environment ad alta fedeltà.

## Indipendenza: separare la fonte del giudizio

L'indipendenza non è binaria e non nasce semplicemente cambiando agente.

Possiamo separare identity, instruction, permission, evidence source e final authority.

Un secondo modello che legge lo stesso summary dell'Implementer aggiunge una prospettiva. Un Verifier che interroga direttamente il PostgreSQL test environment aggiunge una source di evidence diversa. Un Verifier read-only riduce il rischio di green-by-editing-the-oracle. Una final authority esterna al producer impedisce che il risultato si auto-promuova.

Le combinazioni hanno forza diversa.

```text
same summary
+ second opinion
→ weak independence

primary evidence
+ adversarial verifier
+ read-only verification role
+ separate merge authority
→ much stronger independence
```

> **L'indipendenza che conta è quella che rende possibile dissentire sulla base di evidence che il producer non controlla interamente.**

## Claim-first verification

Un bundle di verification non dovrebbe iniziare con “all tests passed”. Dovrebbe iniziare da ciò che stiamo cercando di sostenere.

Per OO-001 i claim principali sono già derivati dall'acceptance:

```text
C-01 migration 001 → 002 executes on real PostgreSQL
C-02 success commits escalation + outbox together
C-03 second-write failure rolls back both
C-04 fast suite remains independent
C-05 closure preserves evidence limitations
```

Per ognuno chiediamo:

```text
claim
→ evidence mechanism
→ primary result
→ verifier finding
→ limitation
```

Questa forma è molto più resistente all'overclaim. Un `PASS` resta legato a una property precisa invece di espandersi a “database layer verified” o “production ready”.

## Il Verifier non dovrebbe dipendere soltanto dal summary

Un failure mode molto realistico è:

```text
Implementer runs many checks
→ summarizes "all good"
→ Verifier reads only summary
→ PASS
```

Formalmente abbiamo due ruoli. Epistemicamente ne abbiamo ancora uno solo.

Per i claim importanti il Verifier deve poter accedere a evidence primaria: raw test output, query result, migration log, diff, schema output, scan result, trace o policy decision.

Non deve necessariamente rieseguire tutto. Deve poter campionare e controllare la provenance.

> **La provenance dell'evidence vale più dell'eloquenza del summary.**

Questa è la base del nostro Agent Verification Bundle.

## Contradiction search: il verifier cerca dove la prova potrebbe mentire

Una verification forte non domanda soltanto “il test passa?”.

Per C-03 può chiedere se il failure viene davvero iniettato sulla seconda write prima del commit; se entrambe le tabelle vengono interrogate dopo il rollback; se un cleanup potrebbe nascondere partial state; se l'adapter è davvero PostgreSQL e non un fake; se la migration è stata modificata per rendere il test più facile.

Per C-04 può chiedere se `npm test` ha acquisito indirettamente una dipendenza da Docker o PostgreSQL.

Questa ricerca di contradiction riduce confirmation bias e rende il Verifier una responsibility diversa dall'Implementer.

## LLM-as-judge è un evaluator, non una proof primitive universale

Un modello può classificare output, applicare una rubrica, cercare missing case o fare adversarial review. È utile soprattutto per proprietà qualitative o per ampliare la superficie della review.

Ma `LLM says PASS` non sostituisce evidence deterministica quando la property è deterministica.

Un evaluator può condividere bias, incomprensioni o context gap del producer. Per questo, quando possiamo formulare un check meccanico, preferiamo quello. Quando il giudizio resta qualitativo, usiamo rubriche, esempi, più source di signal e human sampling proporzionato al rischio.

GitHub documenta esplicitamente che Copilot code review può sbagliare e raccomanda di validarne il feedback e affiancarlo alla review umana.

Fonti:

- [GitHub Docs — About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)
- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Il messaggio non è che l'AI review sia debole per definizione. È che **una review è una source di signal; il gate deve essere proporzionato al claim**.

## Tracing: provenance del workflow, non log indiscriminato

OpenAI Agents SDK include tracing per run, generation, tool call, handoff e guardrail.

Fonte:

- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)

In un workflow complesso questo aiuta a ricostruire quale agente abbia prodotto un output e quale tool sia stato usato. Ma il tracing non deve diventare un dump indiscriminato di prompt, customer data o secret.

Valgono le stesse regole del Capitolo 15: data minimization, retention, access control e cost.

La trace è utile quando migliora la possibilità di ricostruire la catena di evidence senza creare una nuova data-risk surface sproporzionata.

## Verification without re-execution

Il manager umano non può rifare ogni task delegato. Se deve leggere ogni file, rieseguire ogni test e ricostruire ogni decisione, l'automazione non scala.

Per questo il Verification Bundle deve comprimere senza cancellare provenance.

Una forma utile per C-03 può essere:

```text
Claim
second-write failure rolls back both facts

Evidence
real PostgreSQL integration scenario
migration 001 → 002
forced outbox insert failure
post-failure query on both tables

Result
PASS

Primary evidence
raw test log + query output

Limitation
no Azure HA/failover claim
```

Il reviewer può campionare l'evidence primaria e approfondire soltanto dove il rischio o un finding lo richiedono.

Questa è **verification without re-execution**: non fidarsi del summary, ma neppure duplicare tutta l'execution.

## Evidence debt: claim senza gate

Un workflow accumula evidence debt quando produce continuamente parole come `secure`, `reliable`, `backward compatible` o `production ready` senza un mechanism capace di sostenerle.

Questo non è soltanto un problema di wording. Significa che il sistema di quality non sa ancora trasformare una claim importante in evidence verificabile.

Il manager di agenti deve rendere visibile questo debito. L'agente può produrre il claim. Non deve poter colmare il gap con confidence language.

## ESI: il Verification Bundle viene progettato prima dell'execution

Per OO-001 ESI definisce il bundle **prima** che l'Implementer inizi.

Il verifier sa già che dovrà controllare C-01…C-05, usare evidence primaria, cercare contradiction e mantenere esplicito `Not verified`.

Questo evita di inventare il criterio di review dopo aver visto il diff, quando siamo già esposti a confirmation bias e sunk cost.

La baseline resta:

```text
OO-001 execution
→ Pending

Primary evidence
→ Pending

Independent verifier result
→ Pending
```

Il documento esiste. La prova ancora no.

> **La verification migliore comincia prima dell'implementation, quando decidiamo quale evidence ci servirà per credere al risultato.**
