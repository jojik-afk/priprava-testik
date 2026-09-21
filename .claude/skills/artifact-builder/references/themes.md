# Themes — one visual identity per subject

Pick the theme matching the subject and build the whole artifact in it. A theme is not a
colour swap: background, surface treatment, typography, corner radius, and motion all change.

**Rules:**
- Use the theme's own fonts, radius and surface style. Never fall back to dark glassmorphism
  because it is familiar — only where the theme itself calls for translucent surfaces.
- Keep body text ≥ 16px and contrast high enough to read on a projector.
- The "signature" line is the detail that makes the theme recognisable — always implement it.
- Subject not listed → pick the closest theme and say which one you used.

---

## Literatura / čeština — "Papír"

- **Background:** `#f7f2e7` warm paper. Optional very faint noise texture via inline SVG.
- **Surfaces:** No cards. Content sits directly on the page, separated by `1px solid #d9cfb8` rules and generous whitespace (max-width ~68ch).
- **Type:** `Lora` (headings, 600) + `Source Serif 4` (body). Quotes in italic, pulled out with a left border.
- **Radius:** 4px. **Accent:** `#8c3b1e` terracotta + `#2e4034` ink green.
- **Motion:** Minimal — 0.4s fade only. No hover lift, no pulsing.
- **Signature:** Drop cap on the first paragraph of each section; margin notes in small caps.

## Dějepis — "Kronika"

**Locked theme.** This is the existing look of `Dějepis - Evropa 1918–1939`
(`src/dejak-1918-39.jsx`) and Jonas wants it kept exactly as it is. Do not redesign it, do not
modernise it, do not swap it for a new idea. Read that file and match it.

- **Background:** `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)` — navy into
  deep blue, fixed, no animation. Body text `#e8e8e8`, muted `#aaa` / `#888`.
- **Surfaces:** Two levels, both translucent over the gradient:
  - *Cards* — `rgba(255,255,255,0.05)`, `1px solid rgba(201,162,39,0.3)`, radius 8px.
  - *Panels* (topic detail, quiz body, tip blocks) — `rgba(0,0,0,0.3)`, `1px solid
    rgba(201,162,39,0.2)`, radius 12px, padding 1.5–2rem.
- **Type:** `Crimson Text` (Google Fonts, 400/600/700 + italic) with `Georgia, serif` fallback —
  one family for the whole UI, headings included. Key-point blocks, date lists and term lists in
  plain `monospace`, 0.9–0.95rem, line-height 1.7–1.8.
- **Radius:** 4px (tabs, small buttons) / 8px (cards) / 12px (panels).
  **Accent:** `#c9a227` brass, used for every heading, border, badge and active state.
  Correct `#4CAF50`, wrong `#ef5350`.
- **Motion:** `all 0.2s ease` — deliberately snappy, the one theme that keeps the short timing.
  Card hover: background to `rgba(201,162,39,0.15)`, border to solid `#c9a227`,
  `translateY(-2px)`. No slide-ins, no staggering.
- **Header:** sticky, `rgba(0,0,0,0.3)` + `backdrop-filter: blur(10px)`, `2px solid #c9a227`
  bottom border. Title in brass, uppercase, `letter-spacing: 0.05em`, with a leading emoji;
  italic grey subtitle listing the topics under it. Tabs sit on the right of the same row —
  radius 4px, active = solid `#c9a227` with `#1a1a2e` text, inactive = `rgba(255,255,255,0.1)`.
- **Signature (implement both):**
  1. **"⚡ RYCHLÉ SHRNUTÍ" box** at the top of every topic detail — brass gradient fill
     (`rgba(201,162,39,0.15)` → `0.05`), `2px solid #c9a227`, radius 12px, and a label notch
     riding *on* the top border: absolutely positioned at `top:-12px; left:20px`, background
     `#16213e`, brass bold 0.85rem text. Contents in monospace, one `🔑 KLÍČOVÉ SLOVO: …` line
     per point.
  2. **Numbered brass circles** — 28–32px, `#c9a227` fill, `#1a1a2e` bold digit, on every topic
     card and every quick-review header.
- **Layout:** master–detail, not one long scroll. Tab bar: Studium / Rychlé opakování / Kvíz /
  Tipy. Studium = responsive grid `repeat(auto-fill, minmax(350px, 1fr))` of numbered topic
  cards → click opens the detail view with a "← Zpět na přehled" button.
- **Varying between history artifacts:** the `base.md` "vary two things" rule applies to layout
  and section order only. Colours, fonts and the two signature elements stay fixed.

## Fyzika — "Blueprint"

- **Background:** `#0d1b2a` with a 40px CSS grid (`rgba(120,180,255,0.07)` lines), plus 200px major grid.
- **Surfaces:** Outlined only — `1px solid #2f6f9f`, transparent fill, small corner ticks in the four corners (pseudo-elements).
- **Type:** `IBM Plex Sans` (body) + `IBM Plex Mono` (labels, values, units).
- **Radius:** 0px. **Accent:** `#5ac8fa` cyan + `#ffd166` for results.
- **Motion:** Linear timing, 0.4s. Diagrams draw in with `stroke-dasharray` animation.
- **Signature:** Every quantity is labelled technical-drawing style — symbol, value, unit in mono, with dimension arrows on diagrams.

## Chemie — "Laborka"

- **Background:** `#101318` with a tiled hexagon pattern (inline SVG, `opacity: 0.06`).
- **Surfaces:** Chamfered boxes via `clip-path: polygon(...)` cutting the top-left and bottom-right corners; fill `#171b22`, `1px solid #2a3340`.
- **Type:** `Space Grotesk` (headings) + `Inter` (body) + `JetBrains Mono` (rovnice, vzorce).
- **Radius:** 0 (chamfer instead). **Accent:** `#2ee6a8` emerald + `#b06cf0` violet for reagents/products.
- **Motion:** 0.45s ease-out; reaction arrows animate left→right on reveal.
- **Signature:** Equations on their own full-width dark strip, reactants and products colour-coded, arrow with conditions above/below.

## Biologie — "Herbář"

- **Background:** `#f2f5ee` soft moss-white; large blurred organic blobs in `#c8ddc0` / `#e6dcc3`.
- **Surfaces:** Asymmetric organic cards — `border-radius: 32px 8px 28px 10px`, white fill, soft shadow `0 8px 24px rgba(40,60,40,0.08)`.
- **Type:** `Nunito` (body, 400/700) + `Fraunces` (headings).
- **Radius:** organic, see above. **Accent:** `#3f7d4e` leaf + `#c2703a` terracotta.
- **Motion:** Scale-in from 0.96 with 0.5s ease-out ("growth"). Hover lifts 3px.
- **Signature:** Hand-drawn feel — section headings paired with a small inline SVG leaf/cell glyph; labels on diagrams connected by thin curved leader lines.

## Matematika — "Čtverečkovaný sešit"

- **Background:** `#fbfbfd` with a 24px squared-paper grid in `#dfe6f0`, plus a red margin line at the left.
- **Surfaces:** Flat, borderless; problems separated by a 2px `#1d3fa8` left border, like a notebook entry.
- **Type:** `Inter` (body) + `Libre Baskerville` (headings) + `JetBrains Mono` (výpočty, kroky řešení).
- **Radius:** 0px. **Accent:** `#1d3fa8` pen blue, `#d12b2b` red for corrections/results.
- **Motion:** 0.4s ease; solution steps reveal one by one, 0.12s apart.
- **Signature:** Every result boxed in a hand-drawn-looking double red frame; steps numbered in the margin.

## Zeměpis — "Atlas"

- **Background:** `#eee6d6` parchment with topographic contour lines (inline SVG paths, `#cbbd9f`, opacity 0.5).
- **Surfaces:** Panels `#fbf7ef` with `1px solid #8a7a5c` and a 4px coloured top strip per region/topic.
- **Type:** `Spectral` (headings) + `Source Sans 3` (body); numbers/coordinates in `IBM Plex Mono`.
- **Radius:** 2px. **Accent:** `#2a6f8e` ocean + `#7a8c3f` terrain + `#b5652b` relief.
- **Motion:** 0.5s ease-in-out, gentle. Map elements fade + slight scale.
- **Signature:** Compass rose in the header, tick marks along panel edges like map graticules, scale-bar style progress bars.

## Psychologie — "Klid"

- **Background:** Soft diagonal gradient `#f6f2fb → #eef4f7`, very slow (40s) hue shift.
- **Surfaces:** Large white cards, `border-radius: 24px`, shadow `0 10px 30px rgba(80,70,110,0.07)`, no borders, lots of padding (32px+).
- **Type:** `Work Sans` (headings) + `Inter` (body). Line-height 1.75.
- **Radius:** 24px. **Accent:** `#7b6cd9` lilac + `#e0a3a3` rose.
- **Motion:** Slow and soft — 0.6s ease-out everywhere.
- **Signature:** Theorists/concepts presented as portrait-style cards with a coloured initial circle; timelines drawn as soft dotted paths.

## Informatika — "IDE"

- **Background:** `#0d1117`.
- **Surfaces:** Editor windows — title bar strip `#161b22` with three dots and a filename, body `#0d1117`, `1px solid #30363d`.
- **Type:** `JetBrains Mono` everywhere, `Inter` only for long prose paragraphs.
- **Radius:** 8px (window), 0 inside. **Accent:** syntax palette — `#79c0ff` keywords, `#7ee787` strings, `#ffa657` numbers, `#d2a8ff` functions.
- **Motion:** Instant/0.15s for UI, blinking cursor 1s step-end.
- **Signature:** Tabs styled as editor file tabs; code and terms coloured with the syntax palette; line numbers in a left gutter.

## Francouzština / jazyky — "Affiche"

- **Background:** `#fbf7f0` ivory, with a 6px tricolour stripe down the left edge.
- **Surfaces:** Cards with a thin double border (`3px double #1b3a8f`), white fill.
- **Type:** `Playfair Display` (headings, 700) + `Montserrat` (body, 400/600).
- **Radius:** 0px. **Accent:** `#1b3a8f` bleu + `#c8102e` rouge.
- **Motion:** 0.45s ease; flashcards flip on the Y axis.
- **Signature:** Genders/conjugation groups colour-coded consistently across the whole artifact (le = bleu, la = rouge, les = noir), legend-free.

## Drony A2 / letectví — "HUD"

- **Background:** `#04070a`, faint radial vignette.
- **Surfaces:** Instrument boxes — `1px solid #2bd67b` at 60% opacity, transparent fill, crosshair ticks at the corners.
- **Type:** `Barlow Condensed` (headings, uppercase, letter-spacing 0.08em) + `Barlow` (body) + `IBM Plex Mono` (values).
- **Radius:** 0px. **Accent:** `#2bd67b` HUD green + `#ffb703` warnings + `#ff4d4d` limits.
- **Motion:** Snappy 0.25s; values count up on reveal.
- **Signature:** Limits and regulation numbers displayed as gauge/readout panels (altitude, distance, mass) with min/max scales.

## RPG / Dračák — "Pergamen"

- **Background:** `#2b211a` dark leather; content area on `#e8d9b5` parchment.
- **Surfaces:** Parchment panels with irregular torn edges (SVG mask) and ornamental corner flourishes.
- **Type:** `Cinzel` (headings) + `EB Garamond` (body) + `IBM Plex Mono` (dice results, stats).
- **Radius:** 0 (ragged edges). **Accent:** `#8c1c13` seal red + `#a67c2e` gold.
- **Motion:** 0.5s ease; dice results pop in with a 1.15 → 1.0 scale bounce.
- **Signature:** GM-only sections hidden behind a wax-seal button; stat blocks framed like a bestiary entry.

## Angličtina — gramatika

No theme. Per `other-types.md` Type H, reproduce the source textbook page layout.
