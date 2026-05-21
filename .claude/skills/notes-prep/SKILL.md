---
name: notes-prep
description: >
  Prepare a batch of teacher's handwritten lesson-note PDFs (typically exported from Kami and posted to Google Classroom) into a clean, user-verified content digest that the artifact-builder skill can turn into a study artifact. Triggers when the user uploads or points to several (e.g. 5–10) lesson-note PDFs before a test, on requests like "nahraju ti zápisky z hodin", "zápisky od učitele", "příprava na test z matiky ze zápisků", "zpracuj zápisky", or any multi-PDF handwritten-notes-to-study-material workflow. This skill prepares the source material only — it does NOT build the artifact itself; it hands off to artifact-builder once the digest is confirmed.
---

# Notes Prep — Teacher's Lesson Notes → Verified Digest for Artifact Builder

## What this skill does

The user gets handwritten lesson notes from a teacher who writes each lesson in **Kami** and posts the result to Google Classroom as a PDF. Before a test the user uploads a batch (≈5–10 PDFs). This skill turns that batch into **one structured, verified Markdown digest** that `artifact-builder` consumes as grounded source material.

This skill stops at the verified digest. It then **invokes `artifact-builder`** — it does not build the artifact itself.

## Why notes must be rendered, not extracted

Kami exports are **vector** PDFs: the handwriting is stored as vector ink strokes, not embedded raster images. `pdfimages` therefore returns **zero** images. The only way to read them is to **render each page to PNG**. Because handwritten **math** is easy to misread (signs, indices, fractions, vector arrows) and a full A4 render gets downscaled below comfortable legibility, render dense pages **split into pieces**.

## Step 1 — Collect the PDFs

Confirm where the PDFs are (e.g. `~/Downloads/*.pdf`) or have the user drop them in. Note all paths.

## Step 2 — Render every PDF to images

Use the repo script for each PDF, all into one working dir. Prefer `--split quadrants` for dense math pages, `--split halves` for lighter ones:

```bash
mkdir -p _notes_work
for f in ~/Downloads/zapisky/*.pdf; do
  python3 scripts/extract_pdf_images.py "$f" --render --split quadrants \
    -o "_notes_work/$(basename "$f" .pdf)"
done
```

The script lives at `scripts/extract_pdf_images.py`. The `xref ... not found` warning from poppler is harmless — pages still render.

## Step 3 — Read and transcribe into a digest

Read **every** page-piece image. Build a single `_notes_work/digest.md` that covers the whole material, organized by topic (merge across pages, dedupe). For each topic capture:

- **Definitions & key terms**
- **Formulas / rules** — in clear notation (LaTeX-style where helpful)
- **Worked examples** — problem, the teacher's steps, and the result
- **Emphasis** — anything the teacher boxed, underlined, or colored (these are exam hints)

Mark anything you could not read with confidence as `⚠️ NEČITELNÉ` so it surfaces in the next step.

## Step 4 — Verify with the user (mandatory)

Handwritten math read by a model is error-prone, and every error would propagate into the artifact. Before handing off:

1. Show the digest, foregrounding **formulas, signs, indices, and numbers**.
2. List every `⚠️ NEČITELNÉ` item and ask the user to fill it in.
3. Ask the user to confirm or correct, then update `digest.md`.

Do not proceed to Step 5 until the user confirms.

## Step 5 — Hand off to artifact-builder

Invoke the **`artifact-builder`** skill with the confirmed `_notes_work/digest.md` as the grounded source material. The digest satisfies artifact-builder's rule that all content be grounded in source material — point it explicitly at `digest.md`.

## Housekeeping

- Keep `_notes_work/digest.md` (cheap, reusable, editable source of truth).
- The rendered page images in `_notes_work/` can be deleted once the artifact is built.
- `_notes_work/` is a scratch dir — don't commit it.
