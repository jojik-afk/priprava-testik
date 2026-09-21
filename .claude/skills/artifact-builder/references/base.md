# Base — Shared Defaults (load this for every artifact)

---

## Design System

**The visual identity comes from `references/themes.md` — read it and use the theme for the
subject at hand.** Each subject has its own background, surface treatment, typography, corner
radius and motion character. Do not default to dark glassmorphism; it is no longer the house
style, it is just one option among several.

### Invariants (apply in every theme)

- **Fonts** loaded from Google Fonts via CDN `<link>`. Use exactly the pairing the theme names.
- **Readability:** body text ≥ 16px, line-height ≥ 1.6, contrast ratio ≥ 4.5:1.
- **Navigation:** one clear top-level switcher (tabs, segmented control or sidebar — the theme's
  shape language decides which). Never dropdown menus.
- **Status indicators** use colour alone — no legends (exception: annotated diagrams in
  `other-types.md`).
- **Transitions:** use the theme's motion timing. Where a theme does not specify one, use
  0.4–0.5s — never 0.2s or 0.3s. A theme may name a faster timing deliberately (Informatika,
  Drony, Dějepis); that is the theme's call, not a shortcut.
- **Mobile:** single column below 640px, tabs scroll horizontally, tap targets ≥ 44px.

### Base animation timings (override with the theme's own motion character)

| Element | Duration |
|---|---|
| Background ambient cycle | 20–40s |
| Slide-in content | 0.5–0.6s, staggered 0.08s per card |
| Progress bars | 0.8s |
| Flashcard flip | 0.4s |

### Varying within a subject

Two artifacts for the same subject share the theme but must not look identical. Vary at least
two of: section layout (tabs vs. sidebar vs. long scroll), header treatment, accent balance,
which signature element leads. If the user says an artifact looks like the last one, change the
layout first — not the colours.

---

## Quiz Engine

Use the pre-built component in `assets/quiz-engine.jsx`. Read that file, copy the component into your artifact, and pass it a `questions` array. Do **not** rewrite the quiz logic from scratch — the template already implements dot nav, feedback, multi-select, results screen, and all the timing/style rules.

```jsx
<QuizEngine questions={questions} accentColor="#a855f7" />
```

**Props:**
- `questions` — array (format below)
- `accentColor` — hex string; use the primary accent from the subject's theme in `themes.md`.

The quiz engine's own styling must be restyled to match the active theme (surface fill, border,
radius, fonts). Only its logic is fixed, not its look.

**Question object format:**
```js
{
  question:    "Text otázky",
  type:        "single" | "multi",        // single = okamžitá zpětná vazba; multi = checkboxy + tlačítko Potvrdít
  options:     ["Možnost A", "Možnost B", ...],
  correct:     [0, 2],                    // indexy do options[]. Single: jeden prvek. Multi: jeden nebo více.
  explanation: "Vysvětlení — povinné",
  tip:         "Mnemonic tip — volitelné" // vynechej klíč, pokud neexistuje
}
```

---

## Technical Rules

### Framework choice
- **React for interactive apps** (study apps, vocab drills, RPG tools, presentation aids). These have complex state — quiz navigation, score tracking, tab switching, flashcard flips, collapsible sections. Managing all of that imperatively in vanilla HTML is more error-prone than React's declarative state.
- **No external component libraries.** `lucide-react` and similar cause size/crash issues. Use **emoji as icon fallback** for all icons.
- **Vanilla HTML only for simple / static artifacts** — e.g. a grammar exercise sheet that replicates a textbook page layout with minimal interactivity.
- **Note on Simon Willison's "no React" rule:** Valid for small portable utilities that need to be copy-pasted and hosted elsewhere. Does not apply here — these artifacts live inside the viewer and are stateful enough that React pays for itself.

### PDF generation (ReportLab)
- ALWAYS register DejaVu Sans font explicitly before drawing any text. Default Helvetica breaks Czech diacritics.
  ```python
  from reportlab.pdfbase import pdfmetrics
  from reportlab.pdfbase.ttfonts import TTFont
  pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
  ```
