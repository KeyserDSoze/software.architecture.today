## Reversibilità e peso della decisione

Non tutte le decisioni meritano lo stesso livello di analisi. Se trattiamo ogni scelta come irreversibile, rallentiamo il progetto e costruiamo burocrazia. Se trattiamo ogni scelta come facilmente correggibile, rischiamo invece di scoprire troppo tardi che alcune conseguenze sono ormai incorporate nei dati, nei contratti, nelle operazioni e nelle abitudini del team.

Serve quindi una disciplina proporzionata al **peso della decisione**.

## One-way door e two-way door

Una distinzione utile è quella tra **two-way door**, relativamente facile da invertire, e **one-way door**, costosa, rischiosa o lenta da cambiare dopo che il sistema ha adottato quella direzione.

Nel software quasi nulla è davvero impossibile da modificare. Con abbastanza tempo e denaro possiamo cambiare framework, database, tenancy model o persino ownership dei dati. La distinzione riguarda quindi il costo reale dell'inversione, non una presunta irreversibilità assoluta.

Sostituire una libreria di logging può essere economico. Modificare un contratto pubblico usato da centinaia di client è molto più difficile. Spostare ownership di dati condivisi tra molti sistemi può richiedere mesi di migration. Ripensare il tenancy model quando autorizzazione e schema sono stati costruiti attorno a esso può diventare un progetto autonomo.

Il punto è riconoscere queste differenze **prima** che il costo sia completamente incorporato nel sistema.

## Che cosa rende pesante una scelta

Il peso emerge da più dimensioni contemporaneamente. Conta il blast radius, perché una decisione che attraversa molti componenti espone più parti del sistema. Conta il costo di inversione, ma anche la persistenza: una scelta incorporata nei dati o nei contratti sopravvive spesso al codice che l'ha introdotta. Conta il rischio se è sbagliata, la presenza di dipendenze esterne e, soprattutto, il livello di incertezza con cui la stiamo prendendo.

Una decisione con grande blast radius, alto costo di inversione e forte incertezza merita esplorazione, confronto e review. Una decisione locale e facilmente reversibile può essere presa velocemente e corretta sulla base del feedback.

Questa proporzionalità evita sia architecture by committee sia architecture by accident.

## Rendere più reversibile una decisione importante

Reversibilità e importanza non sono opposti. Una scelta critica può essere resa più facile da correggere attraverso feature flag, adapter, rollout progressivo, contratti compatibili o migration path.

Questa è una strategia architetturale potente perché cambia la domanda. Invece di cercare di prevedere perfettamente il futuro, possiamo progettare il sistema affinché alcune ipotesi siano meno costose da smentire.

Boundary puliti, dati esportabili, rollback verificato e automazione dei test non implementano tutte le alternative future. Comprano **option value**: preservano la possibilità di cambiare senza pagare subito il costo completo di quella futura soluzione.

> **Una buona architettura non prevede il futuro. Riduce il costo di scoprire che avevamo torto.**

## Una decisione può essere deliberatamente temporanea

A volte scegliamo una soluzione sapendo che non sarà necessariamente quella finale. Non è un problema, se sappiamo perché la scegliamo e che cosa dovrebbe farci cambiare idea.

Per esempio:

> “Per i prossimi sei mesi useremo lookup live sui dati ordini perché il traffico è basso e dobbiamo validare il prodotto. Rivaluteremo se il p95 supera la soglia concordata o se il workload di lettura inizia a interferire con quello transazionale.”

Questa è una decisione temporanea con **trigger di revisione**. È molto diversa da “per ora facciamo così, poi vediamo”, perché rende osservabili le condizioni che potrebbero invalidare il reasoning.

Un trigger può arrivare dal volume dei dati, dalla crescita del traffico, da costi cloud, nuovi requisiti normativi, incidenti ricorrenti, una nuova capability della piattaforma o la fine del supporto di un vendor. Il trigger non ci obbliga automaticamente a cambiare architettura; ci obbliga a **riaprire la decisione**.

Così una scelta sensata oggi non diventa dogma soltanto perché nessuno ricorda più in quali condizioni era stata presa.

## L'irreversibilità può essere accidentale

Molte scelte diventano costose da cambiare non perché il problema lo richiedesse, ma perché sono state incorporate senza boundary. Business logic dipendente direttamente dall'SDK di un vendor, schema pubblico uguale al modello interno, identità utente duplicata in decine di tabelle o query cross-domain diffuse ovunque possono trasformare una scelta inizialmente reversibile in una dipendenza profonda.

La tecnologia scelta conta, ma conta altrettanto **come la scelta entra nel sistema**.

Un adapter può non eliminare il lock-in, ma impedire che il modello del provider si diffonda nel dominio. Un contract versionato non rende gratuita una migration, ma evita di imporre a tutti i client un cambiamento simultaneo. La reversibilità è quindi una proprietà che possiamo progettare, non soltanto sperare di avere.

## AI e la falsa sensazione di reversibilità

Gli agenti rendono molto credibile la frase “possiamo sempre rifattorizzarlo dopo”. Se una modifica a migliaia di file può essere generata in minuti, il costo apparente del cambiamento si abbassa drasticamente.

Ma l'inversione di una decisione architetturale non coincide con la produzione di una patch. Può richiedere migration dei dati, downtime, compatibilità con client esterni, aggiornamento di procedure operative, re-training del team, audit, rollback e gestione di casi che i test non coprono.

L'AI riduce una parte del costo: quello di modificare il codice. Non elimina il costo di modificare **la realtà che si è formata attorno al codice**.

> **Più una decisione sopravvive alla singola codebase, meno il costo di inversione può essere stimato contando le righe da cambiare.**
