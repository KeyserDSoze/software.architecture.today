from __future__ import annotations

import argparse
import concurrent.futures
import re
import ssl
import sys
import time
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
URL_RE = re.compile(r"https?://[^\s<>)\]]+")
SKIP_HOSTS = {"localhost", "127.0.0.1"}
HARD_HTTP = {404, 410}
USER_AGENT = "SoftwareArchitectureToday-ReferenceAudit/1.0 (+GitHub Actions editorial QA)"


@dataclass(frozen=True)
class Result:
    url: str
    status: int | None
    kind: str
    detail: str = ""


def markdown_files() -> list[Path]:
    files = [
        *sorted((ROOT / "chapters").glob("*_chapter/*.md")),
        *sorted((ROOT / "front_matter").glob("*.md")),
        *sorted((ROOT / "reference").glob("*.md")),
    ]
    for name in ("README.md", "BOOK_ARCHITECTURE.md", "BOOK_MANIFESTO.md", "SOURCE_FACTUAL_AUDIT.md"):
        path = ROOT / name
        if path.exists():
            files.append(path)
    return files


def normalize_url(raw: str) -> str:
    return raw.rstrip(".,;:'\"!?}")


def urls_with_origins() -> dict[str, set[str]]:
    origins: dict[str, set[str]] = {}
    for path in markdown_files():
        text = path.read_text(encoding="utf-8")
        for raw in URL_RE.findall(text):
            url = normalize_url(raw)
            parsed = urlsplit(url)
            host = (parsed.hostname or "").lower()
            if not host or host in SKIP_HOSTS or host.endswith(".example"):
                continue
            origins.setdefault(url, set()).add(str(path.relative_to(ROOT)))
    return origins


def check(url: str, timeout: float) -> Result:
    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",
            "Range": "bytes=0-1023",
        },
        method="GET",
    )
    context = ssl.create_default_context()
    try:
        with urlopen(request, timeout=timeout, context=context) as response:
            response.read(1)
            status = int(getattr(response, "status", 200) or 200)
            return Result(url, status, "ok" if status < 400 else "soft", f"HTTP {status}")
    except HTTPError as exc:
        status = int(exc.code)
        kind = "hard" if status in HARD_HTTP else "soft"
        return Result(url, status, kind, f"HTTP {status}")
    except (URLError, TimeoutError, ssl.SSLError, ConnectionError) as exc:
        return Result(url, None, "soft", f"{type(exc).__name__}: {exc}")
    except Exception as exc:  # network audit must report unexpected transport failures, not hide them
        return Result(url, None, "soft", f"{type(exc).__name__}: {exc}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="fail on confirmed 404/410 or malformed URL")
    parser.add_argument("--workers", type=int, default=16)
    parser.add_argument("--timeout", type=float, default=12.0)
    args = parser.parse_args()

    origins = urls_with_origins()
    malformed: list[str] = []
    for url in origins:
        parsed = urlsplit(url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            malformed.append(url)

    urls = sorted(set(origins) - set(malformed))
    started = time.monotonic()
    results: list[Result] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(check, url, args.timeout): url for url in urls}
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    results.sort(key=lambda item: item.url)
    kinds = Counter(item.kind for item in results)
    domains = Counter((urlsplit(item.url).hostname or "").removeprefix("www.") for item in results)
    elapsed = time.monotonic() - started

    print("Reference reachability audit — Software Architecture Today")
    print(f"- URL esterni distinti controllati: {len(results)}")
    print(f"- domini distinti: {len(domains)}")
    print(f"- OK: {kinds['ok']}")
    print(f"- soft/transient/access-controlled: {kinds['soft']}")
    print(f"- hard 404/410: {kinds['hard']}")
    print(f"- URL malformati: {len(malformed)}")
    print(f"- durata: {elapsed:.1f}s")

    if malformed:
        print("\nURL MALFORMATI:")
        for url in malformed:
            print(f"- {url}")

    hard = [item for item in results if item.kind == "hard"]
    if hard:
        print("\nHARD FAILURES:")
        for item in hard:
            locations = ", ".join(sorted(origins[item.url]))
            print(f"- {item.detail}: {item.url} [{locations}]")

    soft = [item for item in results if item.kind == "soft"]
    if soft:
        print("\nSOFT / DA VERIFICARE MANUALMENTE:")
        for item in soft:
            locations = ", ".join(sorted(origins[item.url]))
            print(f"- {item.detail}: {item.url} [{locations}]")

    if args.strict and (malformed or hard):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
