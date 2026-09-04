from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def apply_patch(path: Path) -> tuple[int, list[str], int]:
    data = json.loads(path.read_text(encoding="utf-8"))
    chapter = int(data["chapter"])
    replacements = data.get("replacements", [])
    chapter_dir = ROOT / "chapters" / f"{chapter:03d}_chapter"
    if not chapter_dir.is_dir():
        raise SystemExit(f"Chapter directory not found: {chapter_dir}")

    changed_files: set[Path] = set()
    applied = 0
    skipped = 0
    for index, item in enumerate(replacements, start=1):
        old = item["old"]
        new = item["new"]
        matches: list[tuple[Path, int]] = []
        for source in sorted(chapter_dir.glob("*.md")):
            text = source.read_text(encoding="utf-8")
            count = text.count(old)
            if count:
                matches.append((source, count))
        total = sum(count for _, count in matches)
        if total == 0:
            # Safe failure mode: source context drifted or the candidate spans
            # material intentionally kept between two blocks. Never guess.
            print(f"SKIP {path.name} replacement {index}: exact context not found")
            skipped += 1
            continue
        if total > 1:
            where = ", ".join(f"{p.name}:{count}" for p, count in matches)
            raise SystemExit(
                f"{path.name} replacement {index}: ambiguous context, found {total} matches ({where})"
            )
        source = matches[0][0]
        text = source.read_text(encoding="utf-8")
        source.write_text(text.replace(old, new, 1), encoding="utf-8")
        changed_files.add(source)
        applied += 1

    return applied, [str(p.relative_to(ROOT)) for p in sorted(changed_files)], skipped


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: apply_editorial_patches.py <patch.json> [...]")
    total = 0
    total_skipped = 0
    files: set[str] = set()
    for arg in sys.argv[1:]:
        count, changed, skipped = apply_patch(ROOT / arg)
        total += count
        total_skipped += skipped
        files.update(changed)
        print(f"Applied {count} replacements from {arg}; skipped {skipped} exact-context misses")
    print(
        f"Editorial prose revision: {total} replacements across {len(files)} files; "
        f"safe skips={total_skipped}"
    )
    for path in sorted(files):
        print(f"- {path}")


if __name__ == "__main__":
    main()
