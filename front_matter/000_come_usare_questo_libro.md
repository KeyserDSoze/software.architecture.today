# Come usare questo libro

*Software Architecture Today* non è un catalogo di tecnologie e non è un manuale da leggere cercando la stack “giusta”.

Il percorso parte da una tesi semplice:

> **Il software non è diventato facile. È diventato più facile produrre software.**

Quando l'execution diventa più abbondante, il valore si sposta ancora di più verso comprensione, judgment, trade-off, verification e accountability.

Per questo i capitoli seguono una progressione intenzionale:

```text
responsabilità
→ problema
→ sistema
→ decisioni
→ design
→ contratti
→ dati
→ distribuzione
→ operabilità
→ evoluzione
→ agenti
→ produzione
→ professione
→ sintesi
```

## Due modi di leggerlo

Se lo leggi dall'inizio alla fine, vedrai crescere insieme il metodo e i casi ricorrenti. È il percorso consigliato alla prima lettura.

Se lo usi come riferimento, puoi entrare da un tema specifico — API, dati, reliability, legacy, agenti o production readiness — ma conviene conservare le distinzioni introdotte prima: problema e soluzione, output e outcome, requisito e aggettivo, decisione ed evidence.

## I casi del libro

Il libro usa due categorie che non vanno confuse.

**Caso reale documentato** indica un'organizzazione, una tecnologia, un incidente, una pratica o un risultato sostenuti da una fonte pubblica attribuita. Un caso reale resta il caso di quell'organizzazione: non diventa automaticamente una best practice universale.

**Scenario simulato/composito** indica materiale didattico inventato per rendere concrete le decisioni. Il mondo principale è **Example Software Industries S.p.A. — ESI**, azienda fittizia. Il capstone principale è **Order Operations**. Numeri, SLO, RTO, RPO, costi, incidenti e risultati ESI sono simulati salvo indicazione esplicita del contrario.

Alcuni capitoli iniziali usano anche **Order Operations** come caso didattico compatto. È anch'esso simulato/composito e non rappresenta un'azienda reale né un benchmark industriale.

## Come leggere le fonti

Le fonti servono a sostenere claim esterni, non a prestare autorità alle opinioni dell'autore.

Nel libro distinguiamo, quando conta, fra:

- standard o specifica;
- documentazione ufficiale;
- recommendation o framework;
- paper o ricerca;
- case study attribuito;
- scelta ESI simulata;
- sintesi o posizione editoriale dell'autore.

Una recommendation Microsoft, AWS, Google, OpenAI o di qualunque altro vendor non diventa una regola universale per il solo fatto di essere documentata.

## Gli artifact non sono il risultato finale

ADR, mappe, contract, test, diagrammi, PRR e agent run sono output.

Il loro valore dipende dalla decisione che rendono più chiara, dalla proprietà che aiutano a verificare e dall'outcome che permettono di ottenere.

Per questo nel libro ritorna una domanda:

> **Quale evidence possediamo rispetto alla promessa che stiamo facendo?**

La legenda nella sezione successiva rende esplicito il vocabolario usato per rispondere.