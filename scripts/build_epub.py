from __future__ import annotations

import re
from pathlib import Path
from xml.sax.saxutils import escape

import yaml
from ebooklib import epub
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
BUILD_DIR = ROOT / "build"
CONFIG_PATH = ROOT / "book.yml"
SECTION_HEADING_RE = re.compile(r"^\d+\.\d+(?:\s|\b)")
FINAL_TITLE_PREFIX = "Capitolo 30 —"
FINAL_TEXT = "L'AI può scrivere il codice. Il timone resta a noi."
EPUB_CSS = """
body { font-family: Georgia, "Times New Roman", serif; line-height: 1.58; margin: 6%; color: #172326; }
h1 { font-size: 2.1em; line-height: 1.13; color: #176b68; margin-top: 1.3em; margin-bottom: 0.8em; padding-bottom: 0.3em; border-bottom: 0.1em solid #176b68; break-before: page; page-break-before: always; }
h2 { font-size: 1.42em; line-height: 1.22; color: #176b68; margin-top: 1.45em; margin-bottom: 0.55em; }
h3 { font-size: 1.16em; line-height: 1.25; color: #253437; margin-top: 1.2em; }
p { margin-top: 0; margin-bottom: 0.84em; }
pre, code { font-family: ui-monospace, "SFMono-Regular", Consolas, monospace; }
code { overflow-wrap: anywhere; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; padding: 0.8em; background: #eef4f3; border-left: 0.22em solid #176b68; font-size: 0.9em; }
table { border-collapse: collapse; width: 100%; max-width: 100%; font-size: 0.88em; margin: 1em 0 1.2em; }
th, td { border: 1px solid #a8b7b5; padding: 0.4em; vertical-align: top; overflow-wrap: anywhere; }
th { background: #eef4f3; }
blockquote { margin-left: 0.3em; margin-right: 0; padding: 0.25em 0 0.25em 0.9em; border-left: 0.22em solid #176b68; }
a { color: #176b68; overflow-wrap: anywhere; }
""".strip()


def load_config() -> dict:
    with CONFIG_PATH.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def markdown_parser() -> MarkdownIt:
    return MarkdownIt("commonmark").enable("table")


def inline_plain(token) -> str:
    if not getattr(token, "children", None):
        return token.content
    parts: list[str] = []
    for child in token.children:
        if child.type in {"text", "code_inline", "html_inline"}: parts.append(child.content)
        elif child.type in {"softbreak", "hardbreak"}: parts.append("\n")
        elif child.type == "image": parts.append(child.content or child.attrGet("alt") or "")
    return "".join(parts)


def split_sections(markdown: str) -> list[tuple[str, str]]:
    lines = markdown.splitlines(); tokens = markdown_parser().parse(markdown); headings: list[tuple[int, str]] = []
    for index, token in enumerate(tokens):
        if token.type != "heading_open" or token.tag != "h1" or not token.map: continue
        title = inline_plain(tokens[index + 1]).strip()
        if SECTION_HEADING_RE.match(title) is None: headings.append((token.map[0], title))
    if not headings: raise ValueError("EPUB: nessun H1 top-level trovato.")
    sections: list[tuple[str, str]] = []
    for index, (start_line, title) in enumerate(headings):
        end_line = headings[index + 1][0] if index + 1 < len(headings) else len(lines)
        sections.append((title, "\n".join(lines[start_line + 1:end_line]).strip()))
    return sections


def build_epub(markdown: str, output: Path, config: dict) -> int:
    parser = markdown_parser(); sections = split_sections(markdown)
    if not sections[-1][0].startswith(FINAL_TITLE_PREFIX): raise ValueError(f"EPUB: ultimo documento non è il Capitolo 30: {sections[-1][0]!r}")
    if FINAL_TEXT not in sections[-1][1]: raise ValueError("EPUB: frase finale canonica assente dall'ultimo documento.")
    book = epub.EpubBook(); book.set_identifier(config["output_basename"]); book.set_title(config["title"]); book.set_language(config.get("language", "it-IT")); book.add_author(config["author"])
    stylesheet = epub.EpubItem(uid="book-style", file_name="styles/book.css", media_type="text/css", content=EPUB_CSS); book.add_item(stylesheet)
    documents: list[epub.EpubHtml] = []
    for index, (title, body) in enumerate(sections, start=1):
        document = epub.EpubHtml(title=title, file_name=f"section-{index:03d}.xhtml", lang=config.get("language", "it-IT"))
        document.content = f"<h1>{escape(title)}</h1>\n{parser.render(body) if body else ''}"; document.add_item(stylesheet); book.add_item(document); documents.append(document)
    book.toc = tuple(documents); book.spine = ["nav", *documents]; book.add_item(epub.EpubNcx()); book.add_item(epub.EpubNav()); epub.write_epub(str(output), book)
    return len(documents)


def main() -> None:
    config = load_config(); basename = config["output_basename"]; markdown_path = BUILD_DIR / f"{basename}.md"; output_path = BUILD_DIR / f"{basename}.epub"
    if not markdown_path.exists(): raise SystemExit(f"Markdown assemblato non trovato: {markdown_path.relative_to(ROOT)}")
    count = build_epub(markdown_path.read_text(encoding="utf-8"), output_path, config)
    print(f"EPUB completato con {count} documenti: {output_path.relative_to(ROOT)}")


if __name__ == "__main__": main()
