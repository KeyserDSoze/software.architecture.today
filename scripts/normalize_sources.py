from __future__ import annotations

import argparse
import re
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
CHAPTERS_DIR = ROOT / "chapters"
FRONT_MATTER_DIR = ROOT / "front_matter"
REFERENCE_DIR = ROOT / "reference"
INLINE_CODE_RE = re.compile(r"(`[^`]*`)")
URL_RE = re.compile(r"https?://[^\s)>]+")
TRACKING_KEYS = {"fbclid", "gclid", "mc_cid", "mc_eid"}
ASCII_REPLACEMENTS = {"e'":"è","piu'":"più","puo'":"può","cosi'":"così","perche'":"perché","gia'":"già","pero'":"però","qualita'":"qualità","attivita'":"attività","realta'":"realtà","probabilita'":"probabilità","modalita'":"modalità","unita'":"unità","societa'":"società"}
ASCII_ACCENT_RE = re.compile(r"(?<!\w)(?:" + "|".join(re.escape(k) for k in ASCII_REPLACEMENTS) + r")(?!\w)", re.IGNORECASE)


def preserve_case(original: str, replacement: str) -> str:
    if original.isupper(): return replacement.upper()
    if original[:1].isupper(): return replacement[:1].upper() + replacement[1:]
    return replacement


def canonicalize_url(url: str) -> str:
    suffix = ""
    while url and url[-1] in ".,;:": suffix = url[-1] + suffix; url = url[:-1]
    parts = urlsplit(url)
    query = [(k,v) for k,v in parse_qsl(parts.query, keep_blank_values=True) if not k.lower().startswith("utm_") and k.lower() not in TRACKING_KEYS]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query, doseq=True), parts.fragment)) + suffix


def normalize_prose_segment(segment: str) -> str:
    def accent_repl(match: re.Match[str]) -> str:
        original = match.group(0); return preserve_case(original, ASCII_REPLACEMENTS[original.lower()])
    segment = ASCII_ACCENT_RE.sub(accent_repl, segment)
    return URL_RE.sub(lambda m: canonicalize_url(m.group(0)), segment)


def normalize_line(line: str, in_fence: bool) -> str:
    if in_fence: return line
    parts = INLINE_CODE_RE.split(line)
    for index in range(0, len(parts), 2): parts[index] = normalize_prose_segment(parts[index])
    return "".join(parts)


def normalize_text(text: str) -> str:
    output: list[str] = []; in_fence = False; fence_marker: str | None = None
    for line in text.splitlines(keepends=True):
        stripped = line.lstrip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            marker = stripped[:3]
            if not in_fence: in_fence = True; fence_marker = marker
            elif marker == fence_marker: in_fence = False; fence_marker = None
            output.append(line); continue
        output.append(normalize_line(line, in_fence))
    return "".join(output)


def source_paths() -> list[Path]:
    paths = list(CHAPTERS_DIR.glob("*_chapter/*.md")); paths.extend(FRONT_MATTER_DIR.glob("*.md")); paths.extend(path for path in REFERENCE_DIR.glob("*.md") if re.match(r"^\d", path.name)); return sorted(paths)


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalizza solo trasformazioni editoriali sicure e idempotenti: accenti ASCII noti e tracking URL."); parser.add_argument("--check", action="store_true"); args = parser.parse_args(); changed: list[Path] = []
    for path in source_paths():
        original = path.read_text(encoding="utf-8"); normalized = normalize_text(original)
        if normalized == original: continue
        changed.append(path)
        if not args.check: path.write_text(normalized, encoding="utf-8")
    if changed:
        print(f"{'Da normalizzare' if args.check else 'Normalizzati'}: {len(changed)} file")
        for path in changed: print(f"- {path.relative_to(ROOT)}")
        return 1 if args.check else 0
    print("Sorgenti già normalizzate."); return 0


if __name__ == "__main__": raise SystemExit(main())
