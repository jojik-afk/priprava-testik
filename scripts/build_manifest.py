#!/usr/bin/env python3
"""
build_manifest.py — Scans artifacts/ for HTML files, extracts metadata
from <title> and <meta> tags, and generates manifest.json.

Each artifact HTML should include these meta tags (Claude Code will add them):

    <title>French Revolution Timeline</title>
    <meta name="subject" content="History">
    <meta name="topic" content="French Revolution">
    <meta name="template" content="timeline">

If meta tags are missing, the script infers what it can from the filename
and uses sensible defaults.

Usage:
    python3 scripts/build_manifest.py          # from project root
    python3 scripts/build_manifest.py --watch  # rebuild on file changes
"""

import json
import os
import re
import sys
import time
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime


# ── Config ──────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = ROOT / "artifacts"
MANIFEST_PATH = ROOT / "manifest.json"


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


def extract_metadata(filepath: Path) -> dict:
    """Extract metadata from an HTML artifact file."""
    text = filepath.read_text(encoding="utf-8", errors="replace")

    parser = MetaExtractor()
    try:
        parser.feed(text)
    except Exception:
        pass

    title = parser.title.strip()
    if not title:
        # Fallback: use filename
        title = filepath.stem.replace("-", " ").replace("_", " ").title()

    subject = parser.meta.get("subject", "General")
    topic = parser.meta.get("topic", "")
    template = parser.meta.get("template", "")

    # Get file date — prefer git commit date, fall back to mtime
    date_str = get_file_date(filepath)

    return {
        "title": title,
        "subject": subject,
        "topic": topic,
        "template": template,
        "date": date_str,
        "file": f"artifacts/{filepath.name}",
    }


def get_file_date(filepath: Path) -> str:
    """Get the file's date as YYYY-MM-DD. Try git first, then mtime."""
    try:
        import subprocess
        result = subprocess.run(
            ["git", "log", "--format=%aI", "--diff-filter=A", "--", str(filepath)],
            capture_output=True, text=True, cwd=ROOT
        )
        if result.returncode == 0 and result.stdout.strip():
            # Use the first (oldest) commit date for this file
            lines = result.stdout.strip().split("\n")
            date_str = lines[-1][:10]  # YYYY-MM-DD
            return date_str
    except (FileNotFoundError, Exception):
        pass

    # Fallback to file modification time
    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")


# ── Build ────────────────────────────────────────────────────────────────────

def build():
    """Scan artifacts/ and write manifest.json."""
    if not ARTIFACTS_DIR.exists():
        ARTIFACTS_DIR.mkdir(parents=True)
        print(f"Created {ARTIFACTS_DIR}/")

    html_files = sorted(ARTIFACTS_DIR.glob("*.html"))

    manifest = []
    for f in html_files:
        meta = extract_metadata(f)
        manifest.append(meta)
        print(f"  ✓ {f.name}  →  {meta['subject']} / {meta['title']}")

    # Sort by date descending
    manifest.sort(key=lambda m: m["date"], reverse=True)

    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )

    print(f"\n  Wrote {MANIFEST_PATH.name} with {len(manifest)} artifact(s).\n")
    return manifest


# ── Watch Mode ───────────────────────────────────────────────────────────────

def watch():
    """Rebuild manifest when files in artifacts/ change."""
    print("Watching artifacts/ for changes... (Ctrl+C to stop)\n")
    last_state = None

    while True:
        try:
            current = {
                f.name: os.path.getmtime(f)
                for f in ARTIFACTS_DIR.glob("*.html")
            } if ARTIFACTS_DIR.exists() else {}

            if current != last_state:
                if last_state is not None:
                    print("  Change detected, rebuilding...\n")
                build()
                last_state = current

            time.sleep(1)
        except KeyboardInterrupt:
            print("\n  Stopped watching.")
            break


# ── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print()
    if "--watch" in sys.argv:
        build()
        watch()
    else:
        build()
