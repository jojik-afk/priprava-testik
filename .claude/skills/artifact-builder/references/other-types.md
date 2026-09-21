# Other Artifact Types (C, E, F, G, H)

---

## Type C — Presentation Aid / Flashcard Deck

**Trigger:** Request to prepare an oral presentation, or to turn a text / summary into a navigable slide deck.

**Build:**
- Click-through card deck with prev / next buttons
- Keyboard navigation: left/right arrow keys + spacebar
- Index dots showing current position + total card count
- **Speaker notes panel:** visible alongside the slide on desktop; toggleable on mobile
- Design: use the subject's theme from `themes.md` — slide surfaces, fonts and motion all follow it

**Seen for:** C.S. Lewis "The Great Divorce" presentation, Czech literature oral exam prep.

---

## Type E — Annotated Diagram / SVG

**Trigger:** Request to visualise anatomy, a biological structure, or any labelled system.

**Build:**
- Draw the diagram programmatically in SVG (not a raster image)
- Colour-code regions / parts distinctly
- Label each part with leader lines pointing to it, or use hover-to-reveal tooltips
- Include a **legend at the bottom** — this is the one artifact type where a legend is appropriate (it's a reference diagram, not a quiz UI)
- Design: the subject's theme from `themes.md` (e.g. biology → "Herbář": light moss background, organic shapes, curved leader lines)

**Seen for:** Hlemýžď zahradní (garden snail) — full body diagram with all organs labelled.

---

## Type F — RPG / Game Master Tool

**Trigger:** Request to build a companion app for running a tabletop RPG campaign.

**Build a multi-tab interface with these sections:**

| Tab | Contents |
|---|---|
| Story / Intro | Campaign overview, current plot state |
| Locations | Map-like cards for each location, click to expand details |
| NPCs | Character tracker: name, stats, current status. Secrets hidden behind a collapsible toggle (GM-only info) |
| Combat | Dice roller + combat calculator (see below) |
| Tips / FAQ | Rules reminders, common edge cases |

**Dice roller rules (Dračák D6 system):**
- Roll a D6
- On a **6:** "exploding" mechanic — roll again and add to the total. Keep exploding on further 6s.
- Show the full roll history (e.g. "6 → 6 → 3 = 15")

**Combat calculator:**
- Input: attacker's roll result, defender's OČ (defence value)
- Output: hit / miss, and damage if hit

**Seen for:** Dračák — "Turnaj o Princeznu" campaign.

---

## Type G — PDF Cheat Sheet (Printable)

**Trigger:** Request for a printable cheat sheet, tahák, or compact summary sheet. Output is a **PDF file**, not an interactive artifact.

**Build with Python + ReportLab:**
- Single A4 page, compact multi-column layout
- Colour-coded sections with bold headers
- Tables for quick lookup (formulas, term definitions, constants)
- **CRITICAL font rule:** Register DejaVu Sans explicitly before drawing ANY text:
  ```python
  from reportlab.pdfbase import pdfmetrics
  from reportlab.pdfbase.ttfonts import TTFont
  pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
  ```
  Never use default Helvetica — it will break every Czech character with a diacritical mark.

**Seen for:** Chemistry tahák (reaction kinetics + nomenclature), drone A2 exam prep.

---

## Type H — Grammar Exercise Sheet

**Trigger:** Request to turn a textbook exercise page into an interactive artifact. Usually accompanied by a screenshot or image of the original page.

**Build:**
- Faithfully reproduce the original page layout — match its structure and visual organisation
- Fill-in-the-blank fields or multiple-choice options with inline answer checking (immediate feedback on selection)
- **Design note:** This is the one type that overrides `themes.md` entirely — reproducing the provided source layout takes priority over the subject theme. If the original is a light, textbook-style page, match that look.

**Seen for:** English grammar — future forms (going to / present continuous / will).
