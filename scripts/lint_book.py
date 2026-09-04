from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

import yaml

ROOT = Path(__file__).resolve().parents[1]
CHAPTERS_DIR = ROOT / "chapters"
FRONT_MATTER_DIR = ROOT / "front_matter"
REFERENCE_DIR = ROOT / "reference"
CONFIG_PATH = ROOT / "book.yml"
PREFIX_RE = re.compile(r"^(\d+)")
SECTION_RE = re.compile(r"^#{1,6}\s+(\d+)\.(\d+)\b")
PLACEHOLDER_RE = re.compile(r"\b(?:TODO|FIXME|TBD)\b", re.IGNORECASE)
WORD_RE = re.compile(r"\b[\wÀ-ÖØ-öø-ÿ’'-]+\b", re.UNICODE)
URL_RE = re.compile(r"https?://[^\s)>]+")
FENCE_RE = re.compile(r"```.*?```|~~~.*?~~~", re.DOTALL)
TABLE_DIVIDER_RE = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$", re.MULTILINE)
ASCII_ACCENT_RE = re.compile(r"(?<!\w)(?:e'|piu'|puo'|cosi'|perche'|gia'|pero'|qualita'|attivita'|realta'|probabilita'|modalita'|unita'|societa')(?!\w)", re.IGNORECASE)
RAW_FOOTNOTE_RE = re.compile(r"\[\^([^\]]+)\]")
FOOTNOTE_DEF_RE = re.compile(r"(?m)^\[\^([^\]]+)\]:")
FINAL_LINE = "**L'AI può scrivere il codice. Il timone resta a noi.**"
EXPECTED_BASENAME = "software-architecture-today"
EXPECTED_CHAPTERS = list(range(31))
OLD_ENDING_RE = re.compile(r"Capitolo\s+29\s*[—:-]\s*I\s+Dieci\s+comandamenti", re.IGNORECASE)
AI_MARKER_RE = re.compile(r"(?:^|\s)(?:AI NOTE|EDITOR NOTE|MODEL NOTE|INSERT HERE|PLACEHOLDER)(?:\s|:)", re.IGNORECASE)
CANONICAL_TERMS = ("Agent Delegation Contract","Agent Verification Bundle","Problem & Outcome Brief","Functional Scope Map","Architecture Context Map","Non-Functional Requirements Card","Architecture Decision Record","Component Responsibility Map","API Contract","Data Ownership Map","Failure Mode Map","Threat Model","Cloud Deployment Map","Observability Contract","Testing Strategy","Refactoring Safety Plan","Architecture Fitness Checklist","Cost Model","Repository Map","Execution Work Item","AI Autonomy Matrix","AI Feature Contract","One-Man Project Operating Model","Production Readiness Review","Architect Capability Map")


def prefix(path: Path) -> int:
    match = PREFIX_RE.match(path.name); return int(match.group(1)) if match else 10**9


def first_nonempty_line(text: str) -> str:
    return next((line.strip() for line in text.splitlines() if line.strip()), "")


def prose_without_fences(text: str) -> str:
    return FENCE_RE.sub("", text)


def check_common(path: Path, text: str, errors: list[str], warnings: list[str]) -> None:
    if not text.strip(): errors.append(f"{path}: file vuoto."); return
    if PLACEHOLDER_RE.search(text): errors.append(f"{path}: contiene TODO/FIXME/TBD residuo.")
    if "utm_" in text or "fbclid=" in text or "gclid=" in text: errors.append(f"{path}: URL con tracking noto; eseguire normalize_sources.py.")
    if ASCII_ACCENT_RE.search(text): errors.append(f"{path}: grafia ASCII italiana da normalizzare.")
    if OLD_ENDING_RE.search(text): errors.append(f"{path}: riferimento alla vecchia struttura: il decalogo è Capitolo 30.")
    if AI_MARKER_RE.search(text): errors.append(f"{path}: possibile marker editoriale/AI accidentale.")
    refs = set(RAW_FOOTNOTE_RE.findall(text)); defs = set(FOOTNOTE_DEF_RE.findall(text)); missing = refs - defs
    if missing: errors.append(f"{path}: footnote senza definizione: {sorted(missing)}")
    prose = prose_without_fences(text)
    for canonical in CANONICAL_TERMS:
        for match in re.finditer(re.escape(canonical), prose, flags=re.IGNORECASE):
            if match.group(0) != canonical: errors.append(f"{path}: nome canonico {match.group(0)!r}; usare {canonical!r}.")
    for url in URL_RE.findall(text):
        parsed = urlsplit(url.rstrip(".,;:"))
        if not parsed.scheme or not parsed.netloc: errors.append(f"{path}: URL malformato: {url}")
        if parsed.scheme == "http" and parsed.hostname not in {"localhost","127.0.0.1"}: warnings.append(f"{path}: URL http:// da verificare: {url}")


def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--strict", action="store_true"); args = parser.parse_args(); errors: list[str] = []; warnings: list[str] = []
    total_words = total_chars = total_files = code_blocks = table_count = real_case_headings = 0; external_urls: set[str] = set()
    config = yaml.safe_load(CONFIG_PATH.read_text(encoding="utf-8")) or {}
    if config.get("output_basename") != EXPECTED_BASENAME: errors.append(f"book.yml: output_basename deve essere {EXPECTED_BASENAME!r}.")
    for key in ("title","subtitle","author","language"):
        if not str(config.get(key, "")).strip(): errors.append(f"book.yml: metadata {key!r} mancante.")
    dirs = sorted([p for p in CHAPTERS_DIR.glob("*_chapter") if p.is_dir()], key=prefix); numbers = [prefix(p) for p in dirs]
    if numbers != EXPECTED_CHAPTERS: errors.append(f"Capitoli: trovati {numbers}; attesi esattamente {EXPECTED_CHAPTERS}.")
    for directory in dirs:
        chapter_num = prefix(directory); files = sorted(directory.glob("*.md"), key=lambda p: (prefix(p), p.name.casefold()))
        if not files: errors.append(f"{directory}: nessun file Markdown."); continue
        prefixes = [prefix(path) for path in files]; duplicates = [n for n,c in Counter(prefixes).items() if c > 1]
        if duplicates: errors.append(f"{directory}: prefissi duplicati {sorted(duplicates)}.")
        if prefixes != list(range(1, len(files)+1)): errors.append(f"{directory}: sequenza file {prefixes}; attesa 1..{len(files)}.")
        intro = files[0].read_text(encoding="utf-8"); first = first_nonempty_line(intro)
        if not first.startswith("# "): errors.append(f"{files[0]}: introduzione deve iniziare con H1.")
        if f"Capitolo {chapter_num}" not in first: errors.append(f"{files[0]}: titolo H1 non contiene 'Capitolo {chapter_num}'.")
        for index,path in enumerate(files):
            text = path.read_text(encoding="utf-8"); total_files += 1; total_chars += len(text); total_words += len(WORD_RE.findall(text)); code_blocks += len(FENCE_RE.findall(text)); table_count += len(TABLE_DIVIDER_RE.findall(text)); external_urls.update(url.rstrip(".,;:") for url in URL_RE.findall(text)); real_case_headings += len(re.findall(r"(?im)^#{1,6}\s+.*\bcaso reale\b", text)); check_common(path,text,errors,warnings)
            if index > 0:
                first_line = first_nonempty_line(text); section_match = SECTION_RE.match(first_line)
                if section_match:
                    if int(section_match.group(1)) != chapter_num: errors.append(f"{path}: heading numerato appartiene al capitolo {section_match.group(1)}, non {chapter_num}.")
                    if first_line.startswith("# "): errors.append(f"{path}: sezione numerata in H1; eseguire normalize_sources.py.")
                elif first_line.startswith("# "): warnings.append(f"{path}: H1 interno non numerato; verificare gerarchia: {first_line!r}")
    final_file = CHAPTERS_DIR / "030_chapter" / "001_i_dieci_comandamenti.md"
    if not final_file.exists(): errors.append(f"File finale mancante: {final_file.relative_to(ROOT)}")
    else:
        last_nonempty = next((line for line in reversed(final_file.read_text(encoding="utf-8").splitlines()) if line.strip()), "")
        if last_nonempty != FINAL_LINE: errors.append(f"Capitolo 30: ultima riga visibile non canonica: {last_nonempty!r}")
    supporting = []
    for path in sorted(FRONT_MATTER_DIR.glob("*.md")):
        supporting.append(path); check_common(path,path.read_text(encoding="utf-8"),errors,warnings)
    for path in sorted(REFERENCE_DIR.glob("*.md")):
        if re.match(r"^\d", path.name): supporting.append(path); check_common(path,path.read_text(encoding="utf-8"),errors,warnings)
    print("Book lint — Software Architecture Today")
    print(f"- capitoli: {len(dirs)}\n- file Markdown corpo: {total_files}\n- file front/reference pubblicabili: {len(supporting)}\n- parole stimate corpo: {total_words:,}\n- caratteri corpo: {total_chars:,}\n- tabelle Markdown stimate: {table_count}\n- code block: {code_blocks}\n- URL esterni distinti corpo: {len(external_urls)}\n- heading di casi reali: {real_case_headings}")
    if warnings:
        print(f"\nWARNING ({len(warnings)}):"); [print(f"- {item}") for item in warnings]
    if errors:
        print(f"\nERRORI ({len(errors)}):"); [print(f"- {item}") for item in errors]
    if errors or (args.strict and any("http://" in w for w in warnings)): return 1
    print("\nGate strutturali/editoriali validi."); return 0


if __name__ == "__main__": sys.exit(main())
