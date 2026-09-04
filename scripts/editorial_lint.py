from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHAPTERS = ROOT / "chapters"
FRONT = ROOT / "front_matter"
REFERENCE = ROOT / "reference"
FENCE_RE = re.compile(r"```.*?```|~~~.*?~~~", re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
URL_RE = re.compile(r"https?://[^\s)>]+")
WORD_RE = re.compile(r"\b[\wÀ-ÖØ-öø-ÿ’'-]+\b", re.UNICODE)

# Errori linguistici/meccanici ad alta confidenza. Il gate è volutamente
# conservativo: non deve trasformare preferenze stilistiche discutibili in errori.
CLEAR_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"\buna endpoint\b", re.I), "usare 'un endpoint'"),
    (re.compile(r"\bla endpoint\b", re.I), "usare 'l\'endpoint'"),
    (re.compile(r"\balla endpoint\b", re.I), "usare 'all\'endpoint'"),
    (re.compile(r"\bdella endpoint\b", re.I), "usare 'dell\'endpoint'"),
    (re.compile(r"\ble endpoint\b", re.I), "verificare il genere: normalmente 'gli endpoint'"),
    (re.compile(r"\buna API\b", re.I), "usare 'un\'API'"),
    (re.compile(r"\bla API\b", re.I), "usare 'l\'API'"),
    (re.compile(r"\balla API\b", re.I), "usare 'all\'API'"),
    (re.compile(r"\bdella API\b", re.I), "usare 'dell\'API'"),
    (re.compile(r"\buna AI\b", re.I), "usare 'un\'AI'"),
    (re.compile(r"\bla AI\b", re.I), "usare 'l\'AI'"),
    (re.compile(r"\balla AI\b", re.I), "usare 'all\'AI'"),
    (re.compile(r"\bdella AI\b", re.I), "usare 'dell\'AI'"),
    (re.compile(r"\buna (?:applicazione|architettura|attività|analisi|alternativa|assunzione|esigenza|eccezione|entità|esperienza|evoluzione|idea|implementazione|informazione|infrastruttura|integrazione|interfaccia|operazione|opportunità|organizzazione|osservazione|opzione|autonomia)\b", re.I), "elisione dell'articolo femminile davanti a vocale"),
    (re.compile(r"\bqual['’]è\b", re.I), "usare 'qual è'"),
    (re.compile(r"\bun po'(?!\w)|\bun po\b(?![’'])", re.I), "usare 'un po’'"),
    (re.compile(r"\bperchè\b", re.I), "usare 'perché'"),
    (re.compile(r"\bpoichè\b", re.I), "usare 'poiché'"),
    (re.compile(r"\baffinchè\b", re.I), "usare 'affinché'"),
    (re.compile(r"\bpurchè\b", re.I), "usare 'purché'"),
    (re.compile(r"\bsopratutto\b", re.I), "usare 'soprattutto'"),
    (re.compile(r"\bdaccordo\b", re.I), "usare 'd\'accordo'"),
    (re.compile(r"\b(?:l|un|dell|all|nell)['’][ \t]+\w", re.I), "rimuovere lo spazio dopo l'apostrofo"),
    (re.compile(r"[ \t]+[,.;:!?]"), "rimuovere lo spazio prima della punteggiatura"),
    (re.compile(r"[,;:!?]{2,}"), "punteggiatura duplicata"),
    # [ \t]+ è intenzionale: non segnaliamo una parola che chiude un heading e
    # ricompare correttamente all'inizio del paragrafo successivo.
    (re.compile(r"\b([A-Za-zÀ-ÖØ-öø-ÿ]{3,})[ \t]+\1\b", re.I), "parola duplicata consecutivamente"),
    (re.compile(r"\bAcme Orders\b"), "capstone non canonico: usare/integrare Order Operations (ESI)"),
)

# Segnali da ispezionare, non automaticamente errori grammaticali.
STYLE_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"\breal time\b", re.I), "valutare uniformità con 'real-time'"),
    (re.compile(r"\buse case\b", re.I), "verificare uniformità terminologica"),
    (re.compile(r"\bbest practice\b", re.I), "verificare che non sia usata come legge universale"),
    (re.compile(r"\bsempre\b", re.I), "assoluto: verificare se il claim richiede contesto"),
    (re.compile(r"\bmai\b", re.I), "assoluto: verificare se il claim richiede contesto"),
)


def published_files() -> list[Path]:
    files = sorted(CHAPTERS.glob("*_chapter/*.md"))
    files += sorted(FRONT.glob("*.md"))
    files += sorted(p for p in REFERENCE.glob("*.md") if re.match(r"^\d", p.name))
    return files


def governance_files() -> list[Path]:
    result = []
    for name in ("README.md", "BOOK_ARCHITECTURE.md", "BOOK_MANIFESTO.md", "SOURCE_FACTUAL_AUDIT.md"):
        path = ROOT / name
        if path.exists():
            result.append(path)
    result += sorted(p for p in REFERENCE.glob("*.md") if not re.match(r"^\d", p.name))
    return result


def prose(text: str) -> str:
    # Conserviamo un token al posto di code/URL invece di cancellarli: cancellarli
    # produce falsi positivi come "`symbol`." -> " .".
    text = FENCE_RE.sub(lambda m: "\n" * m.group(0).count("\n"), text)
    text = INLINE_CODE_RE.sub("INLINECODE", text)
    text = URL_RE.sub("URL", text)
    return text


def line_number(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def adjacent_duplicate_paragraphs(text: str) -> list[str]:
    clean = FENCE_RE.sub("\n", text)
    paragraphs = [re.sub(r"\s+", " ", p.strip()) for p in re.split(r"\n\s*\n", clean)]
    duplicates: list[str] = []
    previous = ""
    for paragraph in paragraphs:
        if len(paragraph) >= 80 and paragraph.casefold() == previous.casefold():
            duplicates.append(paragraph[:120])
        previous = paragraph
    return duplicates


def inspect(path: Path, errors: list[str], warnings: list[str], include_style: bool) -> None:
    text = path.read_text(encoding="utf-8")
    clean = prose(text)
    rel = path.relative_to(ROOT)
    for pattern, message in CLEAR_PATTERNS:
        for match in pattern.finditer(clean):
            excerpt = re.sub(r"\s+", " ", match.group(0)).strip()
            errors.append(f"{rel}:{line_number(clean, match.start())}: {excerpt!r} — {message}")
    for excerpt in adjacent_duplicate_paragraphs(text):
        errors.append(f"{rel}: paragrafo adiacente duplicato: {excerpt!r}")
    if include_style:
        for pattern, message in STYLE_PATTERNS:
            matches = list(pattern.finditer(clean))
            if matches:
                warnings.append(f"{rel}: {len(matches)} occorrenze — {message}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="include anche i segnali stilistici nel report")
    args = parser.parse_args()
    errors: list[str] = []
    warnings: list[str] = []
    pub = published_files()
    gov = governance_files()
    for path in pub:
        inspect(path, errors, warnings, args.strict)
    # La governance non entra nel libro, ma deve essere libera dagli stessi errori certi.
    for path in gov:
        inspect(path, errors, warnings, False)
    words = sum(len(WORD_RE.findall(prose(p.read_text(encoding="utf-8")))) for p in pub)
    print("Editorial lint — Software Architecture Today")
    print(f"- file pubblicabili: {len(pub)}")
    print(f"- file governance/reference interni: {len(gov)}")
    print(f"- parole prose stimate: {words:,}")
    if warnings:
        print(f"\nSEGNALI STILISTICI ({len(warnings)}):")
        for item in warnings:
            print(f"- {item}")
    if errors:
        print(f"\nERRORI EDITORIALI ({len(errors)}):")
        for item in errors:
            print(f"- {item}")
        return 1
    print("\nNessun errore editoriale meccanico ad alta confidenza rilevato.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
