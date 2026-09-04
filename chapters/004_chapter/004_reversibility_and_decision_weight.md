## Reversibilità e peso della decisione

Non tutte le decisioni meritano lo stesso livello di analisi.

Se trattiamo ogni scelta come se fosse irreversibile, rallentiamo il progetto e costruiamo burocrazia.

Se trattiamo ogni scelta come facilmente correggibile, possiamo scoprire troppo tardi che alcune conseguenze sono ormai incorporate nei dati, nei contratti, nelle operazioni e nelle abitudini del team.

Serve quindi una disciplina proporzionata.

### One-way door e two-way door

Una distinzione utile è quella tra:

**Two-way door.** Decisione relativamente facile da invertire.

**One-way door.** Decisione costosa, rischiosa o lenta da cambiare dopo che il sistema ha adottato quella direzione.

Naturalmente non esistono porte completamente a senso unico nel software.

Quasi tutto può essere cambiato con abbastanza tempo e denaro.

La distinzione riguarda il **costo reale dell'inversione**.

Per esempio:

- cambiare una libreria di logging può essere una two-way door;
- cambiare framework dopo anni può essere più costoso ma ancora gestibile;
- cambiare il formato pubblico di un'API usata da centinaia di client può essere molto difficile;
- cambiare ownership di dati condivisi tra decine di sistemi può richiedere una migrazione lunga;
- cambiare modello di tenancy dopo che dati e autorizzazioni sono costruiti attorno a esso può essere quasi un progetto autonomo.

### Il peso della decisione

Possiamo valutare una decisione lungo alcune dimensioni.

**Blast radius.** Quante parti del sistema influenza?

**Costo di inversione.** Quanto costa cambiare idea?

**Persistenza.** Quanto a lungo la scelta resterà incorporata?

**Rischio.** Che cosa succede se è sbagliata?

**Dipendenze esterne.** Coinvolge client, partner, normative o dati difficili da migrare?

**Incertezza.** Quanto poco sappiamo oggi?

Una decisione con grande blast radius, alto costo di inversione e forte incertezza merita più esplorazione.

Una decisione locale, reversibile e a basso rischio può essere presa rapidamente.

### Non confondere reversibilità con importanza

Una decisione reversibile può comunque essere importante.

Possiamo introdurre una feature flag e rendere reversibile un cambiamento critico.

Possiamo creare un adapter per poter sostituire un provider.

Possiamo usare un canary per limitare il blast radius.

Queste tecniche **aumentano la reversibilità** di decisioni che restano importanti.

È una strategia architetturale molto potente.

Invece di cercare di prevedere tutto, possiamo progettare il sistema affinché alcune scelte siano più facili da correggere.

### Comprare option value

Preservare possibilità future ha un valore.

Ma, come visto nel Capitolo 2, non significa implementare tutto in anticipo.

Possiamo comprare option value con interventi relativamente piccoli: confini puliti e contratti espliciti, migration path, feature flag e adapter. Dati esportabili, API compatibili, automazione dei test e rollback verificato aumentano la possibilità di cambiare senza obbligarci a implementare oggi ogni alternativa futura.

Questi elementi non implementano necessariamente la futura alternativa.

Rendono meno costoso adottarla.

> **Una buona architettura non prevede il futuro. Riduce il costo di scoprire che avevamo torto.**

### Decisioni temporanee

A volte scegliamo intenzionalmente una soluzione che sappiamo non essere finale.

Può essere corretto.

Per esempio:

> “Per i prossimi sei mesi useremo query live sul database ordini perché il traffico è basso e il team deve validare il prodotto. Rivaluteremo quando il p95 supera 300 ms o quando il carico supera una soglia definita.”

Questa non è una decisione pigra.

È una decisione **temporanea con trigger di revisione**.

Molto diversa da:

> “Per ora facciamo così, poi vediamo.”

La differenza è che nel primo caso sappiamo cosa dovrebbe farci cambiare idea.

### Trigger di revisione

Ogni decisione importante dovrebbe poter avere uno o più trigger.

Un trigger può essere il volume dati che supera una soglia, un aumento significativo del traffico o la crescita del numero di team. Può arrivare da un nuovo requisito normativo, da latency o costi cloud oltre budget, da incidenti ricorrenti o da un nuovo pattern di accesso. Anche la perdita di supporto di un vendor o, al contrario, una nuova capability di piattaforma possono riaprire la decisione.

Il trigger non obbliga a cambiare decisione.

Obbliga a **rivalutarla**.

Questo evita che una scelta sensata nel 2026 venga trattata come dogma nel 2030.

### Il rischio dell'irreversibilità accidentale

Molte decisioni diventano difficili da cambiare non perché lo richiedesse il problema, ma perché sono state implementate senza separazione.

Un esempio classico:

- business logic dipendente direttamente dal client SDK del vendor;
- schema dati pubblico uguale allo schema interno;
- identità utente codificata in decine di tabelle senza boundary;
- contratti senza versioning;
- query cross-domain diffuse nel codice.

La scelta iniziale poteva essere reversibile.

Il coupling l'ha resa costosa.

Quindi la reversibilità non dipende soltanto dalla tecnologia scelta.

Dipende da **come la scelta viene incorporata nel sistema**.

### AI e cambiamenti apparentemente facili

Gli agenti possono far sembrare reversibili decisioni che non lo sono.

“Possiamo sempre rifattorizzarlo dopo” è più convincente quando l'AI può modificare migliaia di file.

Ma il costo di inversione non è soltanto il numero di righe.

Può includere migrazione dati e downtime, compatibilità con client esterni e procedure operative, re-training del team, audit e rollback. Può soprattutto includere rischi che i test non coprono. La facilità di generare una patch non equivale alla facilità di cambiare un sistema in produzione.

> **L'AI riduce il costo di modificare il codice. Non elimina il costo di modificare la realtà attorno al codice.**