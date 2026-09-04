# 23.2 — Ruoli e confini di delega

Il modo più facile per progettare male un sistema multi-agent è iniziare dai nomi.

`Backend Agent`, `Testing Agent`, `Security Agent`, `Architecture Agent` suonano ordinati. Ma rischiano di creare un organigramma prima che esista una ragione per separare davvero il lavoro.

La domanda corretta viene prima dei nomi:

> **quali responsabilità non dovrebbero appartenere automaticamente allo stesso soggetto quando il risultato autorizza un passo successivo?**

Nel nostro caso le responsabilità fondamentali sono quattro: interpretare il work item, eseguire il cambiamento, verificare i claim e possedere l'approval quando la decisione supera il mandato del task.

Possono convivere quando rischio, reversibilità ed evidence lo consentono. Devono essere separate quando la loro sovrapposizione rende troppo facile auto-certificarsi o attraversare un boundary senza authority.

## Planning: trasformare il mandato in passi, non inventare il mandato

Un planner utile non riscrive la requirement. Traduce un execution contract già abbastanza chiaro in una sequenza di passi verificabili.

Per OO-001, per esempio, il piano può partire dal test environment, poi applicare la migration chain, poi provare il commit positivo e infine iniettare il failure sulla seconda write. Il valore del piano non sta nella sequenza in sé. Sta nel fatto che ogni passaggio dichiara quale evidence deve esistere prima di procedere.

```text
prepare real PostgreSQL boundary
→ migration evidence
→ success transaction evidence
→ rollback evidence
→ closure evidence
```

Se durante il planning emerge che migration `002` dovrebbe cambiare semanticamente, il planner non ha trovato un dettaglio implementativo. Ha trovato una stop condition.

> **Un piano è valido quando organizza l'execution senza estendere silenziosamente l'autorità del task.**

Per OO-001 ESI non crea un Planner Agent separato. Il task è già sufficientemente definito e l'Implementer può produrre un piano breve prima del primo write. La separazione non comprerebbe abbastanza valore da giustificare un altro handoff.

## Implementation: il potere deriva dal mandato

L'Implementer può modificare il sistema soltanto dentro il change surface autorizzato.

La distinzione importante non è fra ciò che tecnicamente sa fare e ciò che non sa fare. È fra ciò che il workflow gli **concede** e ciò che resta fuori dalla sua authority.

Per OO-001 può leggere il repository, modificare test e helper nel perimetro del work item, avviare un PostgreSQL isolato, eseguire i gate e aggiungere una dependency test-only se la giustifica.

Non può trasformare questa capability in diritto a riscrivere migration storiche, accedere a production credential, cambiare Payments ownership o approvare una propria architecture exception.

GitHub documenta per il proprio coding agent un modello con ambiente effimero, repository/branch scope e controlli sui secret, insieme alla necessità di revieware e testare l'output prima del merge.

Fonte:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Il dettaglio del prodotto può cambiare. Il principio resta:

> **concedere all'executor il minimo potere che gli permette di produrre l'evidence richiesta senza trasformare una scorciatoia in permission implicita.**

## Verification: controllare ciò che autorizza il prossimo passo

Il Verifier non esiste per riscrivere il lavoro dell'Implementer.

Esiste per controllare se i claim che autorizzano l'accettazione sono realmente sostenuti da evidence adeguata.

Se l'Implementer dichiara che l'atomicità è verificata, il Verifier deve chiedere almeno se è stato usato PostgreSQL reale, se le migration correnti sono state applicate, dove è stato iniettato il failure, quale stato è rimasto dopo rollback e se il report sta evitando claim su Azure, HA o production che il test non può sostenere.

Queste domande sono più importanti del numero di commenti sul diff.

Il Verifier può usare raw test result, query output, static analysis, contract check, scanner, trace o human review. Non deve necessariamente rifare tutta l'execution a mano.

Ritorna il principio:

> **verification without re-execution.**

Il reviewer umano deve poter campionare evidence primaria senza diventare un secondo implementer.

## Indipendenza non significa soltanto “un altro agente”

Due agenti identici con lo stesso contesto, le stesse instruction e lo stesso summary possono produrre due opinioni, ma non necessariamente due evidenze indipendenti.

L'indipendenza cresce quando separiamo almeno una dimensione importante: la source di evidence, il permission set, la missione del verifier, il criterio di valutazione o la final authority.

Un caso forte è:

```text
Implementer claim
→ deterministic PostgreSQL result
→ Verifier with read-only evidence access
→ human/repository merge authority
```

Qui la verification non dipende soltanto dalla narrazione del producer e il verifier non deve modificare ciò che sta giudicando.

Un caso molto più debole è:

```text
Implementer summary
→ second model reads summary
→ second model says PASS
```

La separazione dei nomi non ha creato una separazione epistemica.

> **La vera indipendenza sta in ciò da cui il giudizio può dissentire, non nel numero di agenti coinvolti.**

## Specialist review: attivarla dal rischio

Non ogni task richiede Security, Data, Architecture e Domain review.

La governance diventa sostenibile quando i reviewer specialistici vengono attivati da trigger reali.

Un nuovo public ingress riapre Security. Un nuovo authoritative fact coinvolge Data/Domain ownership. Un economic side effect chiama Payments & Risk. Una deroga alla fitness policy richiede Architecture authority.

Questo evita due estremi: nessun reviewer dove servirebbe e review rituale di cinque funzioni per una modifica locale reversibile.

Il reviewer specialistico non è un badge di qualità. È un owner chiamato perché il task ha attraversato il suo boundary.

## Human Decision Owner: l'authority non coincide con il lavoro manuale

Il ruolo umano più importante non è “approvare tutto”. È possedere le decisioni che cambiano significato, rischio o responsabilità del sistema.

Una persona deve intervenire quando emerge una business semantics non definita, una one-way door, un cambio di data ownership, una security boundary importante, una deroga architetturale o un conflitto fra obiettivi che il work item non autorizza a risolvere.

La guida pratica OpenAI alla costruzione di agenti raccomanda di prevedere intervento umano per high-risk actions e quando vengono superate soglie di failure/retry. OpenAI Agents SDK e Microsoft Agent Framework espongono inoltre meccanismi human-in-the-loop che possono sospendere il workflow prima di tool call sensibili.

Fonti:

- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

Il framework può sospendere una run. Non può decidere al posto nostro quale decisione meriti quella sospensione.

## Separation of duties proporzionata al claim

Non serve sempre un agente diverso per ogni responsabilità.

Per una formatting fix può bastare lo stesso executor e un deterministic gate. Per un normale code change possiamo avere agent execution, test/fitness automatici e human review. Per un task che produce evidence su una proprietà critica può essere giustificato un Verifier separato. Per una decisione irreversibile serve inoltre l'owner umano appropriato.

Il criterio è:

> **se il risultato autorizza un passo ad alto impatto, quanto è rischioso che chi lo produce sia anche l'unica fonte che lo certifica?**

Questa domanda porta naturalmente ai tre artifact del capitolo. Il Delegation Contract governa il mandato. Il Verification Bundle governa i claim. L'Autonomy Matrix governa fino a dove una capability può procedere.

## ESI: il ruolo minimo che compra abbastanza separazione

Per OO-001 ESI sceglie una topologia volutamente sobria:

```text
Human Decision Owner
        ↓
Implementer
        ↓
deterministic evidence
        ↓
independent Verifier
        ↓
human/repository merge gate
```

Security o Platform entrano soltanto se il test harness richiede shared permission, network o risorse che il Delegation Contract non autorizza. Architecture entra soltanto se migration semantics o fitness policy devono cambiare. Product/Domain entra se emerge una nuova business decision.

Non abbiamo creato sette agenti. Abbiamo separato soltanto ciò che compra permission isolation, verification independence o final authority.

> **Delegare il lavoro non significa delegare automaticamente il diritto di definire scope, cambiare l'oracle e decidere la soglia di accettazione.**
