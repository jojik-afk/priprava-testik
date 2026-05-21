#!/usr/bin/env python3
"""Vytáhne jednotlivé obrázky z PDF a uloží je do adresáře.

Používá `pdfimages` (poppler-utils) — extrahuje obrázky v jejich původním
formátu a rozlišení přímo z PDF, bez ztráty kvality.

Použití:
    python3 scripts/extract_pdf_images.py vstup.pdf
    python3 scripts/extract_pdf_images.py vstup.pdf -o muj_adresar
    python3 scripts/extract_pdf_images.py vstup.pdf --render                  # celé stránky jako PNG
    python3 scripts/extract_pdf_images.py vstup.pdf --render --split halves    # + nakrájet na půlky
    python3 scripts/extract_pdf_images.py vstup.pdf --render --split quadrants # + na kvadranty

Volby:
    -o, --output   Výstupní adresář (výchozí: <jméno_pdf>_images)
    --render       Místo vložených obrázků vyrenderuje každou stránku jako PNG
                   (nutné pro vektorová PDF — např. ručně psané zápisky z Kami,
                   kde žádné vložené rastry nejsou)
    --dpi          Rozlišení pro --render (výchozí: 200)
    --split        Nakrájet každou vyrenderovanou stránku na menší kusy kvůli
                   čitelnosti hustého rukopisu: 'halves' (půlky) nebo
                   'quadrants' (kvadranty). Implikuje --render.
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

# Malý překryv mezi kusy, aby řádek/vzorec na švu nezmizel.
SPLIT_OVERLAP = 0.04


def require(tool: str) -> None:
    if shutil.which(tool) is None:
        sys.exit(f"Chybí nástroj '{tool}'. Nainstalujte balíček poppler-utils "
                 f"(např. `sudo apt install poppler-utils`).")


def extract_embedded(pdf: Path, outdir: Path) -> None:
    """Vytáhne vložené rastrové obrázky v jejich původním formátu."""
    require("pdfimages")
    prefix = str(outdir / "img")
    # -all zachová původní formát (jpg/png/...), -p přidá číslo stránky
    subprocess.run(["pdfimages", "-all", "-p", str(pdf), prefix], check=True)


def render_pages(pdf: Path, outdir: Path, dpi: int) -> None:
    """Vyrenderuje každou stránku PDF jako samostatný PNG."""
    require("pdftoppm")
    prefix = str(outdir / "page")
    subprocess.run(
        ["pdftoppm", "-png", "-r", str(dpi), str(pdf), prefix], check=True
    )


def split_page(path: Path, mode: str) -> int:
    """Nakrájí jeden PNG na půlky/kvadranty s malým překryvem.

    Originál stránky smaže, vrátí počet vytvořených kusů. Krájení necháváme
    na PNG úrovni, protože smysl dává jen pro vyrenderované stránky.
    """
    from PIL import Image

    im = Image.open(path)
    w, h = im.size
    ovx, ovy = int(w * SPLIT_OVERLAP), int(h * SPLIT_OVERLAP)
    midx, midy = w // 2, h // 2

    if mode == "halves":
        boxes = [(0, 0, w, midy + ovy), (0, midy - ovy, w, h)]
    elif mode == "quadrants":
        boxes = [
            (0, 0, midx + ovx, midy + ovy),
            (midx - ovx, 0, w, midy + ovy),
            (0, midy - ovy, midx + ovx, h),
            (midx - ovx, midy - ovy, w, h),
        ]
    else:
        return 0

    for idx, (l, t, r, b) in enumerate(boxes, 1):
        box = (max(0, l), max(0, t), min(w, r), min(h, b))
        out = path.with_name(f"{path.stem}-{idx}{path.suffix}")
        im.crop(box).save(out)
    im.close()
    path.unlink()  # plnou stránku už nepotřebujeme
    return len(boxes)


def main() -> None:
    p = argparse.ArgumentParser(description="Vytáhne obrázky z PDF do adresáře.")
    p.add_argument("pdf", type=Path, help="cesta ke vstupnímu PDF")
    p.add_argument("-o", "--output", type=Path, help="výstupní adresář")
    p.add_argument("--render", action="store_true",
                   help="vyrenderovat celé stránky jako PNG místo vložených obrázků")
    p.add_argument("--dpi", type=int, default=200, help="DPI pro --render (výchozí 200)")
    p.add_argument("--split", choices=["halves", "quadrants"],
                   help="nakrájet vyrenderované stránky na menší kusy (implikuje --render)")
    args = p.parse_args()

    if not args.pdf.is_file():
        sys.exit(f"Soubor nenalezen: {args.pdf}")

    render = args.render or args.split is not None
    outdir = args.output or args.pdf.with_name(f"{args.pdf.stem}_images")
    outdir.mkdir(parents=True, exist_ok=True)

    if render:
        render_pages(args.pdf, outdir, args.dpi)
        if args.split:
            for page in sorted(outdir.glob("page*.png")):
                split_page(page, args.split)
    else:
        extract_embedded(args.pdf, outdir)

    files = sorted(f for f in outdir.iterdir() if f.is_file())
    print(f"Hotovo: {len(files)} souborů uloženo do {outdir}/")


if __name__ == "__main__":
    main()
