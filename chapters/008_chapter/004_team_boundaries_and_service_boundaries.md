## Team boundaries e service boundaries

L'architettura non vive soltanto nel codice.

Vive anche nella struttura organizzativa che deve costruirla, cambiarla e operarla.

Per questo team boundary e service boundary sono spesso collegati.

Ma non sono la stessa cosa.

### Il rischio del service-per-team

Una scorciatoia frequente è:

```text
un team
→ un servizio
```

Può funzionare quando il team possiede davvero una capacità di business coerente e può operarla con autonomia.

Ma può anche trasformare l'organigramma in architettura.

Se dividiamo il sistema soltanto perché esistono tre team, potremmo ottenere servizi che non corrispondono a confini di responsabilità reali.

Il risultato è un'architettura che riflette una struttura organizzativa temporanea.

Gli organigrammi cambiano.

Le dipendenze restano.

### Il rischio opposto

Possiamo anche avere un singolo servizio enorme posseduto formalmente da molti team.

In quel caso nessuno possiede davvero l'intero comportamento.

Ogni modifica attraversa ownership diverse.

Il codice diventa un territorio condiviso in cui tutti hanno accesso ma nessuno ha responsabilità completa.

Quindi il problema non è scegliere tra:

```text
team-centric
vs
architecture-centric
```

Dobbiamo cercare un allineamento ragionevole tra:

- responsabilità di dominio;
- ownership del codice;
- ownership dei dati;
- responsabilità operativa;
- capacità di delivery.

### Autonomia reale

Un team è realmente autonomo quando può portare una modifica significativa in produzione senza coordinamento eccessivo con altri team.

Questo non significa lavorare in isolamento.

Significa che i contratti e i boundary riducono il bisogno di sincronizzazione continua.

Se un team possiede `Payments`, per esempio, dovrebbe idealmente poter:

- modificare la logica di pagamento;
- evolvere il proprio modello interno;
- gestire incidenti;
- cambiare implementazione;
- rilasciare;

senza richiedere modifiche simultanee in `Orders`, purché il contratto resti rispettato.

Questa è autonomia architetturale utile.

### Ownership end-to-end

Una separazione organizzativa sana tende ad avvicinare:

```text
build
+ run
+ change
+ learn
```

Lo stesso team che modifica una capacità dovrebbe avere sufficiente visibilità sulle sue conseguenze operative.

Altrimenti rischiamo un modello in cui qualcuno produce cambiamenti e qualcun altro assorbe sistematicamente gli incidenti.

L'AI può amplificare questo problema.

Se un team può produrre più cambiamenti ma non osserva gli effetti in produzione, aumenta la velocità senza aumentare il feedback.

### Quando un boundary di team suggerisce un service boundary

La separazione fisica diventa più interessante quando esistono contemporaneamente più segnali:

- ownership stabile e distinta;
- ciclo di rilascio realmente diverso;
- roadmap indipendente;
- profilo di carico differente;
- failure isolation utile;
- security boundary specifico;
- dati posseduti chiaramente;
- necessità di autonomia operativa.

Uno solo di questi segnali può non bastare.

Molti insieme costruiscono un caso più forte.

### Team piccoli, sistemi grandi

Nei team piccoli la distribuzione prematura può diventare particolarmente costosa.

Tre persone che possiedono dieci servizi non ottengono automaticamente più autonomia.

Potrebbero semplicemente dover operare dieci deployable, dieci pipeline, dieci set di alert e dieci failure mode distribuiti.

Questo ci riporta a **fit before fashion**.

Un'architettura progettata per cento engineer può essere completamente sbagliata per cinque.

E copiare la topologia di un'azienda molto più grande non copia automaticamente le condizioni che la rendevano sensata.

### L'organizzazione è un requisito

Nel Capitolo 6 abbiamo detto che il team è parte del sistema.

Qui la conseguenza diventa concreta:

> **la topologia deve essere sostenibile dall'organizzazione che la possiede oggi, non da quella immaginaria che forse avremo domani.**

Possiamo preservare opzioni future.

Non dobbiamo pagarle tutte in anticipo.