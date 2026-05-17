# Base — Shared Defaults (load this for every artifact)

---

## Design System

### Theme & Background
- Base background colour: `#0a0a1a` (deep navy/black)
- Animated background — choose by subject:
  - **Math / Physics / Chemistry:** Synthwave — grid floor, neon sun, floating particles
  - **All other subjects:** Floating translucent gradient circles (purple / blue / amber) with `blur` and `pulse` animations

### Cards — Glassmorphism (use everywhere)
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
transition: all 0.4s ease;   /* NEVER 0.2s or 0.3s — Jonas explicitly flagged this */
```

### Navigation
- Horizontal tab bar, pill-shaped or rounded buttons
- Active tab: subject accent colour
- No dropdown menus
- Status indicators use colour alone — **no legends** (exception: annotated diagrams in `other-types.md`)

### Accent Colours by Subject
| Subject area | Palette |
|---|---|
| Literature / humanities | Amber / orange |
| Sciences (physics, chemistry) | Cyan / indigo / purple |
| Biology | Emerald / teal |
| Languages (French) | Cyan / blue |
| Math | Neon pink + cyan |

### Typography — Google Fonts via CDN `<link>`
| Context | Font combo |
|---|---|
| Synthwave / math apps | Exo 2 (body) + Audiowide (headers) |
| General apps | Segoe UI or Inter (body) |
| Formulas / code blocks | JetBrains Mono |

### Animation Timings
| Element | Duration |
|---|---|
| Background gradient cycle | 20–40s |
| Floating background elements | 12–20s |
| Card hover / transitions | 0.4–0.5s |
| Slide-in content | 0.5–0.6s, staggered 0.08s per card |
| Progress bars | 0.8s |
| Flashcard flip | 0.4s |

---

## Quiz Engine

Use the pre-built component in `assets/quiz-engine.jsx`. Read that file, copy the component into your artifact, and pass it a `questions` array. Do **not** rewrite the quiz logic from scratch — the template already implements dot nav, feedback, multi-select, results screen, and all the timing/style rules.

```jsx
<QuizEngine questions={questions} accentColor="#a855f7" />
```

**Props:**
- `questions` — array (format below)
- `accentColor` — hex string; pick the subject accent colour from the table above. Default is purple.

**Built-in features:**
- **Answer randomization** — options are shuffled on load so correct answer isn't always "A"
- **Re-shuffle on restart** — when user clicks "Začít znovu", options are reshuffled for reusability
- Single-select and multi-select question types
- Dot navigation, feedback panel, results screen

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
