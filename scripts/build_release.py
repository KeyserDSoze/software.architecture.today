from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import build


def libreoffice_smoke(docx_path: Path) -> None:
    executable = shutil.which("libreoffice") or shutil.which("soffice")
    if not executable:
        print("LibreOffice non disponibile: smoke test DOCX secondario saltato.")
        return
    smoke_dir = build.BUILD_DIR / "_libreoffice-smoke"
    smoke_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [executable, "--headless", "--convert-to", "pdf", "--outdir", str(smoke_dir), str(docx_path)],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        timeout=120,
    )
    rendered = smoke_dir / f"{docx_path.stem}.pdf"
    if not rendered.exists() or rendered.stat().st_size == 0:
        raise SystemExit("LibreOffice smoke: conversione DOCX->PDF non prodotta.")
    print(f"LibreOffice smoke: OK ({rendered.stat().st_size:,} byte).")


def main() -> None:
    build.main()
    config = build.load_config()
    libreoffice_smoke(build.BUILD_DIR / f"{config['output_basename']}.docx")


if __name__ == "__main__":
    main()
