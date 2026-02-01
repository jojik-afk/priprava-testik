#!/usr/bin/env python3
"""
build.py — Builds artifacts from src/ to artifacts/.

Processes:
- .html files: Copied directly to artifacts/
- .jsx files: Bundled with Bun and wrapped in template.html

JSX files should include @meta comments at the top:
    // @title Linear Equations Practice
    // @subject Math
    // @topic Algebra
    // @template practice

Usage:
    python3 scripts/build.py          # from project root
    python3 scripts/build.py --watch  # rebuild on file changes
"""

import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime


# ── Config ──────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "src"
ARTIFACTS_DIR = ROOT / "artifacts"
MANIFEST_PATH = ROOT / "manifest.json"
TEMPLATE_PATH = ROOT / "scripts" / "template.html"


# ── HTML Metadata Extractor ─────────────────────────────────────────────────

class MetaExtractor(HTMLParser):
    """Extracts <title> and <meta name=... content=...> from an HTML file."""

    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta = {}
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            d = dict(attrs)
            name = d.get("name", "").lower()
            content = d.get("content", "")
            if name and content:
                self.meta[name] = content

    def handle_data(self, data):
        if self._in_title:
            self.title += data

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False


def extract_html_metadata(filepath: Path) -> dict:
    """Extract metadata from an HTML artifact file."""
    text = filepath.read_text(encoding="utf-8", errors="replace")

    parser = MetaExtractor()
    try:
        parser.feed(text)
    except Exception:
        pass

    title = parser.title.strip()
    if not title:
        title = filepath.stem.replace("-", " ").replace("_", " ").title()

    return {
        "title": title,
        "subject": parser.meta.get("subject", "General"),
        "topic": parser.meta.get("topic", ""),
        "template": parser.meta.get("template", ""),
    }


def extract_jsx_metadata(filepath: Path) -> dict:
    """Extract @meta comments from a JSX file."""
    text = filepath.read_text(encoding="utf-8", errors="replace")

    meta = {}
    for match in re.finditer(r'^//\s*@(\w+)\s+(.+)$', text, re.MULTILINE):
        key = match.group(1).lower()
        value = match.group(2).strip()
        meta[key] = value

    title = meta.get("title", filepath.stem.replace("-", " ").replace("_", " ").title())

    return {
        "title": title,
        "subject": meta.get("subject", "General"),
        "topic": meta.get("topic", ""),
        "template": meta.get("template", ""),
    }


def get_file_date(filepath: Path) -> str:
    """Get the file's date as YYYY-MM-DD. Try git first, then mtime."""
    try:
        result = subprocess.run(
            ["git", "log", "--format=%aI", "--diff-filter=A", "--", str(filepath)],
            capture_output=True, text=True, cwd=ROOT
        )
        if result.returncode == 0 and result.stdout.strip():
            lines = result.stdout.strip().split("\n")
            date_str = lines[-1][:10]
            return date_str
    except (FileNotFoundError, Exception):
        pass

    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")


# ── JSX Build ───────────────────────────────────────────────────────────────

def build_jsx(src_path: Path, out_path: Path):
    """Bundle a JSX file with Bun and wrap it in the template."""
    meta = extract_jsx_metadata(src_path)

    # Run Bun to bundle the JSX
    try:
        result = subprocess.run(
            [
                "bun", "build",
                str(src_path),
                "--format=esm",
                "--external=react",
                "--external=react-dom",
                "--external=react/jsx-runtime",
            ],
            capture_output=True,
            text=True,
            cwd=ROOT,
        )
    except FileNotFoundError:
        print(f"  ✗ {src_path.name}: bun not found (install from bun.sh)")
        return None

    if result.returncode != 0:
        print(f"  ✗ {src_path.name}: bun build failed")
        print(result.stderr)
        return None

    bundle = result.stdout

    # Load and fill template
    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    # Build meta tags
    meta_tags = []
    if meta["subject"]:
        meta_tags.append(f'    <meta name="subject" content="{meta["subject"]}">')
    if meta["topic"]:
        meta_tags.append(f'    <meta name="topic" content="{meta["topic"]}">')
    if meta["template"]:
        meta_tags.append(f'    <meta name="template" content="{meta["template"]}">')

    html = template.replace("{{TITLE}}", meta["title"])
    html = html.replace("{{META_TAGS}}", "\n".join(meta_tags))
    html = html.replace("{{BUNDLE}}", bundle)

    out_path.write_text(html, encoding="utf-8")
    return meta


# ── Build ───────────────────────────────────────────────────────────────────

def build():
    """Process src/ files and generate artifacts/ and manifest.json."""

    # Ensure directories exist
    if not SRC_DIR.exists():
        SRC_DIR.mkdir(parents=True)
        print(f"Created {SRC_DIR}/")

    # Clear artifacts directory
    if ARTIFACTS_DIR.exists():
        for f in ARTIFACTS_DIR.iterdir():
            if f.is_file():
                f.unlink()
    else:
        ARTIFACTS_DIR.mkdir(parents=True)

    print("Building artifacts from src/...\n")

    manifest = []

    # Process all source files
    for src_file in sorted(SRC_DIR.iterdir()):
        if not src_file.is_file():
            continue

        out_name = src_file.stem + ".html"
        out_path = ARTIFACTS_DIR / out_name

        if src_file.suffix == ".html":
            # Copy HTML files directly
            shutil.copy2(src_file, out_path)
            meta = extract_html_metadata(out_path)
            print(f"  ✓ {src_file.name} → {out_name}  (copied)")

        elif src_file.suffix == ".jsx":
            # Build JSX files
            meta = build_jsx(src_file, out_path)
            if meta is None:
                continue
            print(f"  ✓ {src_file.name} → {out_name}  (bundled)")

        else:
            # Skip unknown file types
            continue

        # Get date from source file
        date_str = get_file_date(src_file)

        manifest.append({
            "title": meta["title"],
            "subject": meta["subject"],
            "topic": meta["topic"],
            "template": meta["template"],
            "date": date_str,
            "file": f"artifacts/{out_name}",
        })

    # Sort by date descending
    manifest.sort(key=lambda m: m["date"], reverse=True)

    # Write manifest
    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )

    print(f"\n  Wrote {MANIFEST_PATH.name} with {len(manifest)} artifact(s).\n")
    return manifest


# ── Watch Mode ──────────────────────────────────────────────────────────────

def watch():
    """Rebuild when files in src/ change."""
    print("Watching src/ for changes... (Ctrl+C to stop)\n")
    last_state = None

    while True:
        try:
            current = {}
            if SRC_DIR.exists():
                for f in SRC_DIR.iterdir():
                    if f.is_file() and f.suffix in (".html", ".jsx"):
                        current[f.name] = os.path.getmtime(f)

            if current != last_state:
                if last_state is not None:
                    print("  Change detected, rebuilding...\n")
                build()
                last_state = current

            time.sleep(1)
        except KeyboardInterrupt:
            print("\n  Stopped watching.")
            break


# ── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print()
    if "--watch" in sys.argv:
        build()
        watch()
    else:
        build()
