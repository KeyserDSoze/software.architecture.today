# Esercizi, autovalutazione e sintesi

## Idee chiave

1. **Un repository AI-ready non è un repository pieno di prompt.** È un repository nel quale struttura, decisioni, ownership e verification path sono abbastanza espliciti da ridurre l'inferenza necessaria.
2. **Persistent context e task context sono diversi.** Il repository contiene ciò che resta vero fra i task; la issue descrive ciò che deve cambiare adesso.
3. **`AGENTS.md` è un entry point, non una enciclopedia.** Deve aiutare a navigare verso documenti canonical e comandi verificabili.
4. **Always-on context ha un costo.** Più istruzioni non significano automaticamente più comprensione.
5. **Le regole meccaniche importanti dovrebbero diventare eseguibili.** Non chiedere all'agente di ricordare ciò che un test può verificare.
6. **Gli oracle devono avere governance.** Un agente non dovrebbe poter far diventare verde un task modificando liberamente comportamento, test e policy che lo giudicano.
7. **Capability non significa authorization.** Tool e permission devono seguire il rischio del task.
8. **Stop condition aumenta l'autonomia utile.** Un agente che sa quando fermarsi può ricevere più spazio di execution nel resto del dominio.
9. **Documentazione stale è un rischio operativo.** Il contesto persistente deve avere owner, review trigger e source of truth.
10. **AI-ready dovrebbe migliorare anche il lavoro umano.** Se una convention serve soltanto a un particolare modello e peggiora la manutenzione del progetto, il fit è sospetto.

## Esercizio 1 — Repository cold start

Scegli un repository che conosci bene.

Immagina di non averci mai lavorato.

Senza chiedere a nessuno, prova a rispondere in quindici minuti:

```text
What does this system do?
How do I build it?
How do I test it?
Where are the important boundaries?
Which documents are authoritative?
Who owns the component I am changing?
What must I not change implicitly?
```

Segna ogni punto in cui devi usare tribal knowledge.

Quello è un candidato per repository context, automation o ownership metadata.

## Esercizio 2 — Scrivi un AGENTS.md corto

Crea una bozza con massimo circa una pagina.

Deve contenere soltanto:

- purpose;
- repository map;
- canonical context routing;
- build/test commands;
- critical constraints;
- stop conditions;
- definition of done.

Poi prova ad aggiungere tutto ciò che “potrebbe essere utile”.

Fermati.

Per ogni nuova informazione chiedi:

> deve essere always-on o può vivere in un documento canonical scoperto quando serve?

## Esercizio 3 — Riduci instruction duplication

Cerca nel tuo progetto informazioni duplicate fra:

```text
README
CONTRIBUTING
wiki
Copilot instructions
AGENTS.md
prompt template
runbook
```

Per una regola duplicata identifica:

```text
canonical source
routing copies da eliminare
consumer che devono essere aggiornati
```

## Esercizio 4 — Golden command test

Prendi il comando che il team considera canonico per i test.

Eseguilo da un ambiente il più possibile pulito.

Verifica:

- dipendenze richieste;
- ordine dei passi;
- variabili necessarie;
- servizi esterni;
- tempo;
- output;
- failure mode.

Poi chiedi:

> un nuovo contributor saprebbe distinguere un bug del codice da un problema di environment?

## Esercizio 5 — Oracle attack

Prendi una modifica con test failing.

Immagina che un agente possa modificare:

- implementazione;
- test;
- fixture;
- architecture rule.

Elenca almeno tre modi in cui potrebbe ottenere un green build senza soddisfare il requisito.

Per ognuno definisci il gate che riduce il rischio.

## Esercizio 6 — Stop condition

Per un task reale, scrivi cinque condizioni che obbligano l'agente a fermarsi.

Non usare condizioni vaghe come:

```text
if something looks risky
```

Usa boundary osservabili:

```text
new public ingress
new authoritative data owner
destructive migration
contract breaking change
security control weakening
```

## Esercizio 7 — Scope vs file list

Trasforma questa issue:

```text
Refactor payment handling.
```

in una issue task-ready con:

```text
Problem
Outcome
Semantic scope
Out of scope
Acceptance criteria
Relevant context
Verification
Stop conditions
```

Non limitarti a elencare file.

## Esercizio 8 — Context fitness

Costruisci un piccolo test che verifichi almeno una proprietà meccanica del tuo context layer.

Esempi:

- i link canonical esistono;
- i comandi dichiarati esistono;
- un instruction file non punta a directory rimosse;
- una repository map contiene tutti i package principali.

Poi scrivi esplicitamente che cosa **non** dimostra quel test.

## Esercizio 9 — Tool-neutral design

Supponi che il tuo team usi tre coding agent differenti.

Disegna una struttura che minimizzi la duplicazione:

```text
canonical context
shared instructions
vendor-specific adapter only if required
```

Identifica quali informazioni non devono mai essere replicate tre volte.

## Esercizio 10 — ESI adversarial task

Un agente riceve:

```text
Make Payment Escalation more reliable.
```

Propone:

1. aggiungere retry infinito;
2. salvare `PaymentStatus` localmente per evitare la dipendenza;
3. aumentare il tier Service Bus;
4. modificare il test che limita i retry;
5. aprire un endpoint pubblico per un monitor esterno.

Per ogni proposta indica:

- quale artifact ESI deve leggere;
- quale fitness rule o quality floor è coinvolto;
- se può procedere autonomamente;
- quale stop condition scatterebbe.

## Autovalutazione

Dopo il capitolo dovresti saper rispondere a queste domande.

1. Perché un file di istruzioni non rende da solo un repository AI-ready?
2. Qual è la differenza fra navigation, decision ed execution context?
3. Qual è la differenza fra persistent context e task context?
4. Quando una informazione merita always-on context?
5. Perché duplicare la documentazione nei file specifici di ogni tool è rischioso?
6. Perché un architecture test può essere una forma di context engineering?
7. Che cosa rende un golden command davvero affidabile?
8. Perché un agente non dovrebbe poter cambiare liberamente l'oracle che giudica il proprio lavoro?
9. Che cosa significa task amplification?
10. Perché lo scope semantico è più importante della sola file list?
11. Che cosa differenzia capability e authorization?
12. Perché le stop condition possono aumentare l'autonomia invece di ridurla?
13. Come può un repository instruction diventare technical/context debt?
14. Che cos'è instruction drift?
15. Come distingui una instruction da un security control?
16. Perché `Observed` non deve diventare `Confirmed` solo perché compare in `AGENTS.md`?
17. Quali proprietà di un context layer possono essere verificate automaticamente?
18. Quali richiedono ancora judgment?
19. Come misureresti in modo utile l'AI-readiness di un repository?
20. Quale informazione stabile il tuo team continua a far riscoprire a ogni nuovo contributor?

## Artefatto operativo

Il capitolo non introduce un nuovo documento universale da aggiungere a ogni progetto.

Per ESI gli artefatti operativi sono due:

```text
AGENTS.md
Repository Map
```

con un principio importante:

> **L'entry point deve restare piccolo. Il sapere dettagliato deve avere source of truth canonical.**

Il repository aggiunge inoltre un **context fitness test** per le proprietà meccaniche del layer di contesto.

## Cosa cambia con l'AI

Prima degli agenti, una codebase con onboarding difficile poteva sopravvivere affidandosi a persone esperte e review manuale.

Con agenti capaci di produrre diff in parallelo, quel modello ha tre problemi:

1. ogni task ripaga il costo di discovery;
2. una inferenza errata può produrre molto più codice prima di essere intercettata;
3. le convenzioni implicite non scalano con il numero di esecutori.

L'AI quindi aumenta il valore di:

```text
clear boundaries
canonical documentation
repeatable setup
executable verification
ownership
stop conditions
```

Ma aumenta anche il costo di un contesto stale o contraddittorio.

> **L'AI amplifica sia il valore della documentazione buona sia il danno della documentazione sbagliata.**

## Il compromesso ESI

Commerce & Operations vuole ridurre rediscovery e aumentare agent throughput.

Platform vuole standardizzazione.

Security vuole permission boundary e stop condition.

Engineering vuole evitare una nuova enciclopedia da mantenere.

Finance vuole che context/token/tool execution non vengano spesi ogni volta per ricostruire informazioni stabili.

La scelta è:

```text
small AGENTS.md
+ Repository Map
+ canonical docs
+ existing executable fitness
+ context fitness
```

Non:

```text
copy the entire architecture into every agent configuration
```

## Ponte al Capitolo 22

Ora il repository sa spiegare:

- che cosa è;
- dove trovare il contesto;
- quali regole proteggere;
- quali comandi eseguire;
- quando fermarsi.

Manca ancora una cosa:

> **come trasformiamo il lavoro in unità abbastanza chiare da poter essere affidate, verificate e composte?**

È il tema del prossimo capitolo:

# Issue-driven development

Lì il task smetterà di essere una frase in chat e diventerà una vera unità di orchestrazione fra persone, agenti, artifact ed evidence.

## Corollario

> **Un repository AI-ready non rende l'agente onnisciente. Rende più economico scoprire il contesto giusto, più difficile violare accidentalmente quello importante e più evidente ciò che resta ancora da decidere.**