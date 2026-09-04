# Come usare questo libro

*Software Architecture Today* non è un catalogo di tecnologie e non è un manuale da leggere cercando la stack “giusta”. Parte da una tesi semplice:

> **Il software non è diventato facile. È diventato più facile produrre software.**

Quando l'execution diventa più abbondante, il valore si sposta ancora di più verso comprensione, judgment, trade-off, verification e accountability. Per questo il percorso del libro non segue una successione di prodotti o framework. Parte dalla responsabilità e dal problema, passa attraverso sistema, decisioni, design, contratti, dati, distribuzione e operabilità, poi affronta evoluzione, agenti, produzione e infine il ruolo professionale di chi continua a stare al timone.

## Due modi di leggerlo

La prima lettura funziona meglio dall'inizio alla fine, perché metodo e casi ricorrenti crescono insieme e molte distinzioni introdotte nei primi capitoli vengono riutilizzate più avanti. Il libro può però essere usato anche come riferimento: si può entrare da API, dati, reliability, legacy, agenti o production readiness, purché si conservino le distinzioni di fondo tra problema e soluzione, output e outcome, requisito e aggettivo, decisione ed evidence.

## I casi del libro

Nel testo convivono due categorie che non vanno confuse. Un **caso reale documentato** riguarda un'organizzazione, una tecnologia, un incidente, una pratica o un risultato sostenuti da una fonte pubblica attribuita. Resta sempre il caso di quell'organizzazione: non diventa automaticamente una best practice universale.

Uno **scenario simulato o composito**, invece, è materiale didattico costruito per rendere concrete le decisioni. Il mondo principale è **Example Software Industries S.p.A. — ESI**, azienda fittizia, e il capstone principale è **Order Operations**. Numeri, SLO, RTO, RPO, costi, incidenti e risultati ESI sono simulati salvo indicazione esplicita del contrario. Anche quando Order Operations compare in forma compatta nei capitoli iniziali resta un caso didattico e non rappresenta un benchmark industriale né un'azienda reale.

## Come leggere le fonti

Le fonti servono a sostenere claim esterni, non a prestare autorità alle opinioni dell'autore. Quando la distinzione conta, il libro rende esplicito se una fonte è uno standard o una specifica, documentazione ufficiale, una recommendation o un framework, un paper, un case study attribuito oppure una scelta simulata di ESI. Le sintesi e le posizioni editoriali restano tali anche quando sono costruite a partire da fonti autorevoli.

Una recommendation Microsoft, AWS, Google, OpenAI o di qualunque altro vendor non diventa quindi una regola universale per il solo fatto di essere documentata. Il suo valore dipende dal claim che sostiene e dal contesto in cui quel claim viene applicato.

## Gli artifact non sono il risultato finale

ADR, mappe, contract, test, diagrammi, PRR e agent run sono output. Il loro valore dipende dalla decisione che rendono più chiara, dalla proprietà che aiutano a verificare e dall'outcome che permettono di ottenere. Un artifact può essere impeccabile e continuare a non rispondere alla domanda importante.

Per questo nel libro ritorna sempre una domanda:

> **Quale evidence possediamo rispetto alla promessa che stiamo facendo?**

La sezione successiva rende esplicito il vocabolario con cui useremo la parola *evidence* e i diversi livelli di confidenza che attribuiremo alle affermazioni.