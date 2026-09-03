# Research Workflow

Ogni capitolo con claim tecnici, standard, prodotti, protocolli, incidenti, benchmark o raccomandazioni operative deve attraversare un **evidence pass**.

## Prima della scrittura o della revisione finale

1. Identificare i claim che richiedono supporto esterno.
2. Cercare prima fonti primarie o ufficiali.
3. Preferire documentazione aggiornata quando il tema cambia nel tempo.
4. Cercare almeno una fonte alternativa quando un claim importante proviene da un vendor e non è specifico del vendor.
5. Distinguere ciò che la fonte dice da ciò che il libro deduce.
6. Inserire il riferimento vicino al claim.
7. Marcare casi e numeri simulati come tali.

## Fonti candidate ricorrenti

- Microsoft Learn / Azure Architecture Center
- AWS Well-Architected Framework / Builders' Library
- Google Cloud Architecture Framework / Google SRE
- RFC IETF
- NIST
- OWASP
- CNCF / Kubernetes
- OpenTelemetry
- documentazione ufficiale di database, runtime e framework
- engineering blog e postmortem dell'organizzazione coinvolta
- paper accademici
- autori tecnici riconosciuti quando appropriato

## Review pass

Prima di considerare un capitolo editorialmente maturo, una review deve cercare:

```text
claim senza fonte
fonte che non sostiene davvero il claim
fonte obsoleta
numero privo di contesto
caso reale raccontato come folklore
vendor guidance trasformata in legge universale
inferenza presentata come fatto
```

## Regola

> **L'evidenza non serve a rendere autorevole una frase. Serve a rendere verificabile il ragionamento.**

Questo workflow completa `SOURCE_POLICY.md`.