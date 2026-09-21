# Study App (Type A + Problem Viewer variant)

The most common artifact type. A full-featured single-page application covering one exam topic end-to-end. Also covers the **problem-heavy variant** (formerly Type D): when the request centres on worked math/physics problems rather than theory, shift emphasis toward §2 below but keep all other sections.

---

## Sections to Build (include ALL of these)

### 1. Theory / Content
- Tab-navigated or collapsible topic summaries
- Explanations at gymnasium level (second-year, four-year pedagogical gymnasium)
- Concise — the user will also have §5 (formula sheet) for quick reference

### 2. Worked Examples / Solved Problems
- **Solutions hidden by default.** Click / toggle to reveal. Never show inline.
- Solution format for each problem:
  1. **Given** — restate what is known
  2. **Formula** — identify which formula / theorem applies
  3. **Step-by-step** — show every calculation step
  4. **Result** — final answer, clearly marked
- Difficulty badges on each problem: **Easy ✨ / Medium ⚡ / Hard 🔥**
- Optional "Check your answer" mode: user types a numeric result → immediate correct/incorrect feedback

### 3. Interactive Quiz
- Build using the **Quiz Engine Spec in `base.md`** — read it and implement every requirement
- Must support both single-select AND multi-select question types (biology tests commonly have multiple correct answers; physics tests use single-select)

### 4. Flashcards
- Flip-card interaction: click front face → reveal back face
- Navigate with prev / next buttons and index dots
- Smooth flip animation (0.4s, per `base.md` timings)

### 5. Formula / Cheat-Sheet Section
- Dedicated tab or section — not buried inside theory
- All key formulas, constants, rules the user must memorise
- Set formulas in the theme's mono font from `themes.md`; if the theme names none, use **JetBrains Mono**
- Group by sub-topic if there are many

---

## Problem-Heavy Variant

Use this variant when the request focuses on worked problems rather than broad theory (math problem sets, physics exercises, "pololetní písemka" prep):

- Make §2 (Worked Examples) the **primary and largest section**
- Shorten §1 (Theory) to a brief overview
- Keep §3 (Quiz) but focus questions on problem-solving steps, not definitions
- XP / gamification layer: add if the user requests a design upgrade — reward solving problems with points

---

## Subjects this type covers
Czech literature analysis, history (colonialism, WWI, Weimar, Nazi Germany), physics (ideal gas law, thermodynamics, stavová rovnice, Archimedes), chemistry (equilibrium, Le Chatelier, kinetics, nomenclature), biology (gastropods, tissues, reproduction, embryonic development), mathematics (trigonometry, right triangles, geometric constructions), geography (hydrosphere), psychology (Freud, Piaget, Erikson), computer science (information processes, data vs information), drone A2 certification (meteorology, UAS technical, human performance, EU/Czech regulations), French verb conjugation practice.
