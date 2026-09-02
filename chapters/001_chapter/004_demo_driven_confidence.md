## Demo-driven confidence

Una demo che funziona è pericolosamente convincente.

Clicchiamo un pulsante.

La schermata cambia.

Il record compare nel database.

Arriva una notifica.

Il test principale è verde.

La tentazione è concludere:

> “La feature funziona.”

Ma una demo dimostra una cosa molto più limitata:

> **abbiamo osservato almeno un percorso in cui il sistema ha prodotto il risultato atteso.**

È utile.

Non è poco.

Ma non equivale a readiness.

Quando l'AI rende economico costruire prototipi completi e convincenti, questa distinzione diventa ancora più importante.

### Il percorso felice è una piccola parte del sistema

Immaginiamo una demo di checkout.

L'utente:

1. aggiunge un prodotto al carrello;
2. inserisce i dati;
3. paga;
4. riceve conferma.

Tutto funziona.

Che cosa non abbiamo ancora dimostrato?

Per esempio:

- cosa succede se il provider di pagamento risponde dopo trenta secondi;
- cosa succede se il client ritenta la richiesta;
- cosa succede se il callback arriva due volte;
- cosa succede se il pagamento riesce ma il database non registra l'ordine;
- cosa succede se l'utente apre due tab;
- cosa succede se il prezzo cambia durante il checkout;
- cosa succede se il prodotto non è più disponibile;
- cosa succede se il servizio email è down;
- cosa succede se il token dell'utente scade a metà flusso;
- cosa succede se il sistema riceve traffico cento volte maggiore di quello della demo.

La demo non è falsa.

È incompleta.

Il problema nasce quando l'effetto visivo della completezza ci porta a sovrastimare l'evidenza che possediamo.

### Il prototipo che sembra produzione

Prima dell'AI, molti prototipi tradivano il loro stato.

Mancavano schermate.

Il codice era chiaramente temporaneo.

Le integrazioni erano mock.

La documentazione era assente.

Oggi un agente può produrre in poco tempo qualcosa che **sembra** molto più maturo:

- interfaccia curata;
- test;
- Dockerfile;
- pipeline;
- logging;
- configurazioni;
- README;
- infrastruttura dichiarativa.

La presenza di questi elementi è positiva.

Ma può creare una nuova forma di illusione:

> se assomiglia a un sistema production-ready, allora probabilmente lo è.

Non funziona così.

Production readiness non è una proprietà estetica del repository.

È una proprietà del sistema rispetto al suo contesto operativo.

### “Ci sono i test”

La stessa illusione compare con il testing.

Un agente può generare decine o centinaia di test.

La suite è verde.

La coverage cresce.

Possiamo sentirci molto più sicuri.

Ma la domanda utile non è:

> quanti test abbiamo?

È:

> **quali failure importanti diventano meno probabili grazie a questi test?**

Un test può essere perfettamente corretto e quasi inutile.

Può verificare una getter.

Può replicare la struttura dell'implementazione.

Può mockare proprio il comportamento che dovrebbe mettere alla prova.

Può non coprire race condition, compatibilità, sicurezza, failure distribuiti o assunzioni di business.

La quantità di test è un output.

La confidenza è una proprietà che dobbiamo argomentare.

### Demo e decisioni reversibili

Non tutte le demo richiedono lo stesso rigore.

Se stiamo esplorando un'idea, possiamo deliberatamente accettare:

- dati finti;
- sicurezza minima;
- architettura temporanea;
- dipendenze veloci da integrare;
- error handling incompleto.

Questa può essere la scelta giusta.

Il problema non è avere un prototipo fragile.

Il problema è **dimenticare che è fragile**.

Serve quindi una distinzione esplicita tra:

```text
proof of concept
prototype
internal tool
beta
production workload
critical workload
```

Le etichette non sono universali.

Ciò che conta è che il livello di evidenza richiesto aumenti con il rischio.

### Il debito di promozione

Un fenomeno ricorrente è questo:

```text
prototipo
→ piace
→ viene usato
→ riceve una feature
→ riceve utenti
→ diventa importante
```

Nessuno prende mai una decisione formale del tipo:

> “Da oggi questo prototipo è un sistema di produzione.”

La trasformazione avviene per accumulo.

Chiamiamo **debito di promozione** la distanza tra ciò che il sistema era stato progettato per sostenere e ciò che ora gli stiamo chiedendo di sostenere.

Può includere:

- autenticazione insufficiente;
- assenza di backup;
- schema dati improvvisato;
- nessun rollback;
- osservabilità minima;
- assenza di ownership;
- costi non controllati;
- dipendenze non governate;
- gestione errori pensata soltanto per la demo.

L'AI può accelerare moltissimo la nascita di questo debito perché riduce il tempo necessario a far sembrare maturo un prototipo.

### Una demo dovrebbe produrre domande

Il modo migliore di usare una demo non è considerarla una prova finale.

È usarla come strumento per far emergere conoscenza.

Una buona demo dovrebbe farci chiedere:

- quali assunzioni abbiamo appena validato?
- quali non abbiamo validato?
- cosa abbiamo imparato sugli utenti?
- cosa abbiamo imparato sui dati?
- quali failure non abbiamo ancora esplorato?
- quale parte dell'architettura era soltanto temporanea?
- cosa dovrebbe essere buttato via se il progetto continua?

Il prototipo è uno strumento di apprendimento.

Quando lo trasformiamo inconsapevolmente in fondazione, il suo valore esplorativo può diventare debito architetturale.

### Definition of done non è “si vede”

Una feature può essere visibile e non essere finita.

Può essere corretta nel percorso principale e mancare di:

- security review;
- observability;
- backward compatibility;
- gestione degli edge case;
- rollback;
- capacity consideration;
- runbook;
- test significativi;
- aggiornamento dei contratti.

Non ogni feature richiede tutto questo.

Ma la Definition of Done deve descrivere ciò che conta per quel rischio.

Altrimenti la demo diventa accidentalmente la nostra Definition of Done.

Da qui il bad pattern:

> **Demo-driven confidence: usare la visibilità del happy path come sostituto della prova che il sistema sia sufficientemente affidabile per il contesto in cui verrà usato.**

Il rimedio non è smettere di fare demo.

È trattarle per quello che sono: evidenza utile, ma parziale.
