# Editorial Audit — Software Architecture Today

**Review date:** 2026-09-04  
**Repository:** `KeyserDSoze/software.architecture.today`  
**Scope:** manuscript, reader-facing front/reference matter, source governance, continuity of the ESI capstone, release build and external references.

This document records the final editorial review performed before release-candidate preparation. It deliberately distinguishes **corpus-wide automated review** from **targeted semantic/manual review**: a green lint is evidence of the checks it performs, not proof that every sentence has been manually reread word by word.

---

## 1. Review model

The review uses five independent layers:

```text
structural/factual lint
+ editorial/mechanical lint
+ source/reference audit
+ targeted semantic/continuity review
+ built-artifact inspection
```

No layer is allowed to certify another layer merely because the build completed.

### Structural/factual gate

`scripts/lint_book.py --strict`

Checks, among other things:

- exactly Chapters 0–30;
- canonical chapter numbering and file sequences;
- unresolved placeholders/footnotes;
- malformed/tracked URLs;
- canonical final chapter and exact final visible line;
- accidental old Chapter-29/decalogue structure;
- selected source/factual invariants.

### Editorial/mechanical gate

`scripts/editorial_lint.py --strict`

Scans the complete publishable corpus plus governance/reference files for high-confidence mechanical problems such as:

- wrong article/elision around `endpoint`, `API`, `AI` and common Italian vowel-starting nouns;
- `qual'è`, wrong grave/acute accents and `un po'` variants;
- spaces before punctuation or after apostrophes;
- duplicated punctuation;
- consecutive duplicated prose words;
- residual `Acme Orders` references after the capstone was standardized on ESI / Order Operations;
- duplicated adjacent paragraphs.

It also reports, without automatically failing, semantic/style signals such as `sempre`, `mai`, `best practice`, `use case` and `real time` for contextual review.

### Editorial normalization guardrail

`scripts/fix_editorial.py --check`

The one-time deterministic normalization used during the review is retained only as an idempotence guardrail. CI no longer rewrites the manuscript automatically.

### External reference gate

`scripts/check_references.py --strict`

Scans external references across manuscript and governance files, distinguishes confirmed dead links (`404`/`410`) from access-controlled/transient responses, and fails on malformed URLs or confirmed dead references.

### Artifact gate

`scripts/inspect_build.py`

Independently inspects Markdown, DOCX, PDF and EPUB after generation, including metadata, Chapter 30, the canonical final sentence, table headers, bookmarks/spine and unresolved footnotes.

---

## 2. Corpus covered

At the green full-review run preceding the final wording cleanup, the gates scanned:

- **31 chapters** (`0` through `30`);
- **271 chapter Markdown files**;
- **278 publishable Markdown files** when reader-facing front/reference matter was included;
- **14 internal governance/reference files**;
- approximately **264k body words** including code/technical material;
- approximately **224k prose words** in the editorial scan, with fenced code and URLs excluded from linguistic checks;
- **40 Markdown tables**;
- **3,175 fenced code blocks**;
- **29 headings explicitly identifying real cases**.

The exact counts can move slightly with subsequent editorial-only commits; the release build remains the source of truth for final metrics.

---

## 3. Concrete editorial defects found and fixed

The review was not a rubber-stamp. It found and corrected real defects.

### Articles, elisions and punctuation

Examples included recurring forms such as:

```text
una endpoint
la endpoint
alla endpoint
una API
la API
una applicazione
una architettura
```

These were normalized to coherent Italian forms such as:

```text
un endpoint
l'endpoint
all'endpoint
un'API
l'API
un'applicazione
un'architettura
```

The pass also removed spaces before punctuation, normalized apostrophes/accents and repaired duplicated words.

### Consecutive duplicated words

The corpus contained genuine mechanical duplicates in prose, including names/technical terms repeated twice in succession. These were removed by an idempotent, code-block-aware normalization and then rechecked from a clean checkout.

### Acme Orders versus Order Operations

A major continuity defect existed in the early manuscript: some chapters still referred to **Acme Orders**, while the front matter and later manuscript had made **Example Software Industries S.p.A. (ESI) / Order Operations** the canonical capstone.

This was not treated as a blind rename. Chapter 2 already contained the dedicated Order Operations brief and the front matter explicitly defined Order Operations as the primary capstone. Residual Acme references were therefore normalized to the canonical case so the book now follows one continuous product narrative.

### Duplicate Chapter 17 opening

The bridge at the end of Chapter 16 contained the next chapter title as an H1. The assembled manuscript therefore exposed an apparent second Chapter 17 opening. The source heading was corrected and the build inspector was made Markdown-aware so the same class of defect is detected rather than hidden.

### Chapter 29 / Chapter 30 closure

The old “final chapter” wording around Chapter 29 was corrected to the canonical structure:

```text
Capitolo 29 — Il timone resta a noi
→
Capitolo 30 — I Dieci comandamenti della Software Architecture nell'era dell'AI
```

The release assembler keeps all reader reference material before Chapters 29–30 and enforces the exact final visible sentence:

> **L'AI può scrivere il codice. Il timone resta a noi.**

### Source wording

One sentence described GitHub documentation as “la best practice ufficiale”. It was changed to **“la guidance ufficiale”**, because vendor documentation can be authoritative about the vendor's workflow without becoming a universal best practice.

### Example URLs in the source index

RFC 9457 examples used `.example` HTTP URIs for Problem Details types. They were valid placeholders but were visually indistinguishable from real source links in the generated source index. Reader-facing examples now use an ESI URN (`urn:esi:problem:...`) so the bibliography contains sources rather than fictional endpoints.

---

## 4. Semantic/style signal review

The editorial lint intentionally reports potentially dangerous words without assuming they are wrong.

### `sempre` / `mai`

Contextual sampling across early, architecture, distributed-systems, testing, AI/agent and closing chapters showed the dominant uses fall into three legitimate categories:

1. **negating dogma**, e.g. “non è sempre”, “non introduciamo mai broker” as an example of a bad blanket rule;
2. **explicit invariants**, e.g. tenant isolation or properties that intentionally must never be violated;
3. **epistemic rules**, e.g. an exactly-once claim must state the boundary of its guarantee.

No reviewed sample justified a global technology prescription such as “technology X is always correct”. The book's recurring editorial rule remains **fit before fashion**.

### `best practice`

Occurrences were reviewed as a class. Most are either:

- quotations/examples of vague reasoning to reject;
- titles of external documents;
- explicit statements that a recommendation is **not** universal.

The one misleading attribution (“best practice ufficiale”) was corrected to “guidance ufficiale”.

### `real time`

Occurrences are principally examples of an underspecified requirement (“real time”) that the manuscript then asks the reader to turn into a measurable latency/freshness requirement. They are not treated as a formal technical mode unless a concrete contract is supplied.

### `use case`

The term is retained as established technical English in places where the manuscript is already using an English architectural register or code-like diagrams. It is not used to create a separate methodology claim.

---

## 5. Reference and factual review

Evidence governance now covers the complete chapter range:

```text
reference/CHAPTERS_000_008_EVIDENCE.md
reference/CHAPTERS_009_024_EVIDENCE.md
reference/CHAPTER_025_EVIDENCE.md
reference/CHAPTER_026_EVIDENCE.md
reference/CHAPTER_027_EVIDENCE.md
reference/CHAPTER_028_EVIDENCE.md
reference/CHAPTER_029_EVIDENCE.md
reference/CHAPTER_030_EVIDENCE.md
```

The consolidated 9–24 audit closes the former central gap and records, chapter by chapter:

- source families used;
- what the source supports;
- what it does **not** support;
- the separation between standards, product documentation, vendor guidance, case studies and research;
- ESI limitations and non-transferability of real-company quantitative results.

### Reachability result

A full reference run checked **248 distinct external URLs across 38 domains**:

```text
240 reachable normally
8 access-controlled/transient (HTTP 403 from OpenAI pages to the automated checker)
0 confirmed 404/410
0 malformed URLs
```

The eight OpenAI pages are therefore recorded as **soft/manual-verification items**, not silently classified as dead and not counted as verified solely because the checker could not fetch them.

The source policy remains:

```text
vendor recommendation ≠ universal best practice
case study ≠ benchmark
documentation capability ≠ authorization to recommend it everywhere
citation ≠ proof beyond the claim the source actually supports
```

---

## 6. Final reader reference layer

The published reference layer now contains:

- `reference/001_glossario.md` — final glossary of recurring architectural, evidence, AI/agent, reliability and governance terms;
- `reference/002_indice_artefatti.md` — chapter/purpose map of the book's operational artifacts;
- `reference/003_guida_fonti_e_reference.md` — how to interpret standards, official documentation, research, case studies, ESI and internal audits;
- generated **Indice dei casi reali**;
- generated **Indice delle fonti** consolidating real external URLs from the manuscript.

These references are assembled **before** Chapters 29–30. Nothing reader-facing is appended after the final decalogue.

---

## 7. ESI / Order Operations truth preservation

Editorial closure did **not** invent narrative success for the capstone.

Canonical production-readiness state remains:

```text
PRR-OO-001
NO-GO — evidence closure required
```

The manuscript may describe artifacts as Designed or Codified where appropriate, but it must not silently promote them to Verified or Monitored.

Likewise:

```text
Observed legacy behavior ≠ Confirmed target requirement
AI model output ≠ authoritative business fact
agent capability ≠ permission/authorization/authority
PRR document exists ≠ production readiness proved
```

---

## 8. Built-artifact evidence

A green full-review build produced and independently inspected all required formats. One recorded inspection reported:

- Markdown: **31 chapters**;
- DOCX: **35 tables, 35/35 repeating header rows**;
- PDF: **1,577 pages, 325 bookmarks**;
- EPUB: **262 XHTML documents** detected by the inspector;
- Chapter 30 present in all formats;
- canonical final sentence present at the end;
- artifact inspection: **PASS**.

Subsequent editorial-only commits must still pass the same CI before release-candidate promotion.

---

## 9. Residual warnings and what they mean

A green editorial run still emitted style signals. They are **review prompts**, not hidden failures. Their existence is intentional: words like `sempre` or `mai` can be exactly right in an invariant and exactly wrong in a technology recommendation.

The project therefore does not convert every style signal into an automatic rewrite.

The remaining structural H1 warnings for selected internal chapter files are likewise known source-layout conventions: the renderer demotes those internal H1s to section level. They do not create duplicate chapter openings in the assembled manuscript; the artifact inspector verifies the actual chapter sequence.

---

## 10. Editorial conclusion

Status at this audit:

```text
structure                         REVIEWED / GATED
mechanical language               REVIEWED / GATED
chapter continuity                REVIEWED
ESI capstone continuity           REVIEWED
source-policy consistency         REVIEWED
chapters 0–30 evidence coverage   REVIEWED
external-link hard failures       NONE FOUND
reader glossary                   FINALIZED
artifact index                    FINALIZED
source/reference guide            FINALIZED
built-format inspection           GATED
```

This audit supports calling the manuscript **editorially reviewed for release-candidate preparation**, with one important precision:

> it is a corpus-wide automated editorial/factual review plus targeted semantic/manual review of identified risk areas and chapter evidence — **not a claim that a human editor manually reread every one of ~264,000 words line by line in this session**.

That distinction is deliberate and follows the book's own rule: **evidence before confidence**.
