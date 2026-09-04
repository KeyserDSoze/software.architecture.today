from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TEXT_FILES = [
    *sorted((ROOT / "chapters").glob("*_chapter/*.md")),
    *sorted((ROOT / "front_matter").glob("*.md")),
    *sorted((ROOT / "reference").glob("*.md")),
]
for name in ("README.md", "BOOK_ARCHITECTURE.md", "BOOK_MANIFESTO.md", "SOURCE_FACTUAL_AUDIT.md"):
    path = ROOT / name
    if path.exists():
        TEXT_FILES.append(path)

FEMININE_VOWEL_WORDS = (
    "applicazione", "architettura", "attività", "analisi", "alternativa", "assunzione",
    "esigenza", "eccezione", "entità", "esperienza", "evoluzione", "idea", "implementazione",
    "informazione", "infrastruttura", "integrazione", "interfaccia", "operazione", "opportunità",
    "organizzazione", "osservazione", "opzione", "autonomia",
)
FEM_RE = re.compile(r"\b([Uu])na (" + "|".join(map(re.escape, FEMININE_VOWEL_WORDS)) + r")\b", re.I)
DUP_WORD_RE = re.compile(r"\b([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{2,})\s+\1\b", re.I)
INLINE_CODE_RE = re.compile(r"(`+)(.*?)(\1)")

REPLACEMENTS = (
    (re.compile(r"\buna endpoint\b", re.I), "un endpoint"),
    (re.compile(r"\bla endpoint\b", re.I), "l'endpoint"),
    (re.compile(r"\balla endpoint\b", re.I), "all'endpoint"),
    (re.compile(r"\bdella endpoint\b", re.I), "dell'endpoint"),
    (re.compile(r"\ble endpoint\b", re.I), "gli endpoint"),
    (re.compile(r"\buna API\b", re.I), "un'API"),
    (re.compile(r"\bla API\b", re.I), "l'API"),
    (re.compile(r"\balla API\b", re.I), "all'API"),
    (re.compile(r"\bdella API\b", re.I), "dell'API"),
    (re.compile(r"\buna AI\b", re.I), "un'AI"),
    (re.compile(r"\bla AI\b", re.I), "l'AI"),
    (re.compile(r"\balla AI\b", re.I), "all'AI"),
    (re.compile(r"\bdella AI\b", re.I), "dell'AI"),
    (re.compile(r"\bqual['’]è\b", re.I), "qual è"),
    (re.compile(r"\bun po'(?!\w)|\bun po\b(?![’'])", re.I), "un po’"),
    (re.compile(r"\bperchè\b", re.I), "perché"),
    (re.compile(r"\bpoichè\b", re.I), "poiché"),
    (re.compile(r"\baffinchè\b", re.I), "affinché"),
    (re.compile(r"\bpurchè\b", re.I), "purché"),
    (re.compile(r"\bsopratutto\b", re.I), "soprattutto"),
    (re.compile(r"\bdaccordo\b", re.I), "d'accordo"),
    (re.compile(r"\bAcme Orders\b"), "Order Operations"),
)


def preserve_case_apostrophe(match: re.Match[str]) -> str:
    first, word = match.group(1), match.group(2)
    prefix = "Un'" if first == "U" else "un'"
    return prefix + word.lower() if word.islower() else prefix + word


def transform_plain(text: str) -> str:
    result = text
    for pattern, replacement in REPLACEMENTS:
        result = pattern.sub(replacement, result)
    result = FEM_RE.sub(preserve_case_apostrophe, result)
    result = re.sub(r"\b([ldnu]|un|dell|all|nell)['’]\s+(?=\w)", lambda m: m.group(0).replace(" ", ""), result, flags=re.I)
    # Remove spaces before punctuation, but preserve a space when a period starts
    # a dot-prefixed technical token such as `.NET`, `.env` or `.gitignore`.
    result = re.sub(r"[ \t]+([,;:!?])", r"\1", result)
    result = re.sub(r"[ \t]+\.(?![A-Za-z0-9])", ".", result)
    # Collapse repeated prose words. This intentionally does not cross punctuation or Markdown markup.
    previous = None
    while previous != result:
        previous = result
        result = DUP_WORD_RE.sub(r"\1", result)
    return result


def transform_line(line: str) -> str:
    # Preserve inline code exactly; editorial normalization applies only to prose segments.
    chunks: list[str] = []
    pos = 0
    for match in INLINE_CODE_RE.finditer(line):
        chunks.append(transform_plain(line[pos:match.start()]))
        chunks.append(match.group(0))
        pos = match.end()
    chunks.append(transform_plain(line[pos:]))
    return "".join(chunks)


def transform(text: str) -> str:
    out: list[str] = []
    in_fence = False
    fence_token = ""
    for line in text.splitlines(keepends=True):
        stripped = line.lstrip()
        if not in_fence and (stripped.startswith("```") or stripped.startswith("~~~")):
            in_fence = True
            fence_token = stripped[:3]
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            if stripped.startswith(fence_token):
                in_fence = False
                fence_token = ""
            continue
        out.append(transform_line(line))
    return "".join(out)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    changed: list[Path] = []
    for path in TEXT_FILES:
        old = path.read_text(encoding="utf-8")
        new = transform(old)
        if new != old:
            changed.append(path)
            if not args.check:
                path.write_text(new, encoding="utf-8")
    if changed:
        verb = "da normalizzare" if args.check else "normalizzati"
        print(f"File editoriali {verb}: {len(changed)}")
        for path in changed:
            print(f"- {path.relative_to(ROOT)}")
        return 1 if args.check else 0
    print("Sorgenti editoriali già normalizzate.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
