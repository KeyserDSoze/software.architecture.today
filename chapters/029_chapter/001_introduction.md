# Capitolo 29 — Il timone resta a noi

All'inizio del libro un agente aveva prodotto molto software in poco tempo. La feature sembrava funzionare e il repository si era riempito rapidamente di codice nuovo.

Poi erano arrivate le domande che contano davvero: perché questa soluzione, quali assunzioni la sostengono, come può fallire, come sappiamo che è corretta e chi risponde delle conseguenze.

Il problema non era l'AI.

Era la **responsabilità**.

L'AI aveva soltanto compresso il tempo fra una decisione implicita e la quantità di software costruita sopra quella decisione.

Dopo ventotto capitoli possiamo tornare a quella scena con un vocabolario molto più preciso. Abbiamo imparato a distinguere problem e solution, Observed e Confirmed, Designed e Verified, capability e authority, execution e decisione, confidence ed evidence.

La domanda però è rimasta la stessa:

> **Chi governa le conseguenze?**

Questo capitolo non aggiunge una nuova tecnologia e non prova a prevedere quale modello dominerà il mercato. Chiude il percorso chiedendo che cosa resta quando una parte crescente dell'execution può essere delegata.

## Il software non è diventato facile

La tesi iniziale del libro era:

> **Il software non è diventato facile. È diventato più facile produrre software.**

Ora possiamo renderla più concreta. È diventato più economico produrre codice, configurazioni, migration, test, documentazione, prototipi e alternative architetturali. È diventato più economico esplorare.

Non è diventato automaticamente più facile decidere quale problema merita di essere risolto, quale comportamento è corretto, chi possiede un fatto, quale failure possiamo accettare, quale costo compra una property utile, quale evidence è sufficiente o quando una migration deve fermarsi.

L'execution può diventare abbondante. Il judgment deve ancora essere coltivato.

## Il codice costa meno. Le conseguenze no

La riduzione del costo di implementation è un vantaggio enorme. Possiamo provare più opzioni, costruire spike, generare test e chiedere a un agente di assorbire lavoro meccanico che prima occupava ore.

Ma le conseguenze importanti vivono spesso fuori dal diff. Vivono nei clienti che dipendono da un contract, nei pagamenti che non possiamo duplicare, negli account che non devono essere compromessi, nei backup che devono realmente ripristinare, nei team che devono sostenere l'on-call, nel budget che paga la topology e nelle business rule che cambiano la realtà dell'azienda.

Da qui un'altra tesi del libro:

> **Nell'era dell'AI il codice costa meno, ma le decisioni sbagliate costano di più.**

Non perché ogni singolo bug sia improvvisamente più grave. Perché possiamo materializzare molto più velocemente una cattiva assunzione e distribuirla in più punti del sistema.

La velocità aumenta anche il blast radius del pensiero debole.

## La risposta non è rallentare

Non abbiamo costruito ventotto capitoli per tornare a produrre software lentamente. Non vogliamo ricontrollare manualmente ogni riga generata, né creare un comitato per ogni scelta.

Il problema è l'opposto: **come aumentare la velocità senza perdere il controllo del significato?**

La risposta emersa è un sistema di lavoro in cui il problema è comprensibile, i boundary sono espliciti, le decisioni importanti hanno un perché, l'execution delegabile viene delegata, la verifica è proporzionata al rischio e l'evidence può modificare la decisione successiva.

Persone e agenti possono condividere l'execution. La responsabilità deve comunque restare leggibile.

Il punto non è chi ha digitato il codice. È se sappiamo spiegare **perché quel codice merita di governare una parte della realtà**.

## Essere il pilota non significa toccare ogni comando

Nel Capitolo 0 abbiamo detto:

> **Sii il pilota, non il copilota.**

Dopo il percorso fatto possiamo evitare un equivoco. Un pilota moderno usa automazione. Non dimostra controllo muovendo personalmente ogni comando; lo dimostra mantenendo comprensione sufficiente di destinazione, stato, automazione attiva, limiti e condizioni di intervento.

Nel software vale lo stesso. Possiamo delegare discovery, implementation, refactoring, test, review preliminare e parti dell'orchestrazione. Non dobbiamo trasformare il professionista in un executor manuale per proteggerne il ruolo.

Dobbiamo però sapere chi sceglie la direzione, chi può concedere authority, chi accetta il rischio e chi può fermare il sistema quando l'evidence non sostiene più la rotta.

## Il ciclo che resta

L'intero libro può essere ricondotto a quattro parole:

```text
execution
→ decisione
→ verifica
→ responsabilità
```

Il ciclo non termina. La verifica produce nuova informazione; l'informazione può riaprire una decisione; la decisione produce nuova execution; la responsabilità stabilisce quando quell'execution può diventare parte del sistema reale.

Questa non è soltanto una sequenza di sviluppo. È un modello di governo del software.

Le prossime sezioni non aggiungeranno un nuovo catalogo. Condenseranno ciò che il percorso ha reso difendibile.

Gli slogan arriveranno soltanto nel Capitolo 30.

Prima dobbiamo meritarseli.
