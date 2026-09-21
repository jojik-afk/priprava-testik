---
name: artifact-builder
description: >
  Build interactive study artifacts for Jonas — study apps, quizzes, flashcards, vocabulary drills, presentation aids, printable cheat sheets, RPG tools, annotated diagrams, and grammar exercises. Triggers on any request to create an interactive study application or exam-prep artifact, on uploaded PDF/worksheet/presentation with a request to turn it into something interactive, or on any request matching patterns like "vytvoř artifact", "příprava na test", "interaktivní aplikace", "procvičení slovíčků". Covers all subjects: French, Czech literature, history, physics, chemistry, biology, math, geography, psychology, CS, drone A2, English grammar, RPG tools.
---

# Artifact Builder

## Step 1 — Classify the request

| Request matches… | Type file to load |
|---|---|
| "test z", "příprava na test", "kompletně připraví", "naučí na test", study app for any subject, worked math/physics problems | `references/study-app.md` |
| "slovíčka", "vocabulary", "slovní zásoba", "procvičení", French word practice | `references/vocab-drill.md` |
| Anything else: presentation deck, printable PDF/tahák, RPG tool, annotated diagram, grammar exercise sheet | `references/other-types.md` |

## Step 2 — Load and build

1. **Always** read `references/base.md` first — shared invariants, quiz engine spec, technical rules.
2. **Always** read `references/themes.md` and use the theme for the subject at hand. Each subject
   has its own visual identity; there is no single default look.
3. **Then** read the type file identified in Step 1.
4. Build the artifact strictly per the loaded specs. Do not skip sections or simplify defaults.

## Global rules (no exceptions)

- **Language:** All UI text and content in Czech. Single exception: English grammar exercises stay in English.
- **Source material:** If the user uploads a PDF, image, or presentation, ground all content in it. Do not generate generic filler content.
- **Interactivity:** Static text is never acceptable. Minimum: collapsible sections + quiz or exercise.
- **Completeness:** The artifact must cover the entire topic end-to-end. The user should not need any other material.
- **Formula / summary section:** Always include a dedicated panel with key formulas, constants, or rules to memorise.
- **Worked solutions:** Always hidden by default. Reveal on click. Never show inline.
