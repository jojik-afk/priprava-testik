# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Learning Hub is a personal website for hosting interactive learning artifacts (quizzes, flashcards, practice tools, timelines). Each artifact is a standalone, self-contained HTML file with zero external dependencies. The catalogue interface serves these artifacts through a searchable grid.

## Common Commands

```bash
# Build artifacts from src/ to artifacts/ (requires Bun for JSX)
python3 scripts/build.py

# Watch mode - auto-rebuild on file changes
python3 scripts/build.py --watch

# Local development server
python3 -m http.server 8000
```

Deployment is automatic via GitHub Actions on push to main.

## Architecture

**Catalogue (`index.html`)**: Single HTML file that loads `manifest.json` and displays a searchable, filterable card grid. Artifacts open in a sandboxed iframe viewer.

**Source (`src/`)**: Source files for artifacts. Can be vanilla HTML or React JSX.

**Build Script (`scripts/build.py`)**: Processes `src/` files, bundling JSX with esbuild, copies HTML, and generates `manifest.json`. Uses git commit dates for artifact dating.

**Artifacts (`artifacts/`)**: Build output directory. Each file is a complete, self-contained HTML file. Do not edit directly.

**Examples (`examples/`, `new_examples/`)**: Reference implementations, not included in the catalogue.

## Creating New Artifacts

### Vanilla HTML

1. Create HTML file in `src/` with required metadata tags:
```html
<title>Your Title Here</title>
<meta name="subject" content="Math">
<meta name="topic" content="Quadratic Equations">
<meta name="template" content="quiz">
```

### React JSX

1. Create JSX file in `src/` with `@meta` comments:
```jsx
// @title Your Title Here
// @subject Math
// @topic Quadratic Equations
// @template practice

import { useState } from 'react';

export default function App() {
  return <div>Your component here</div>;
}
```

### Build and deploy

1. Run `python3 scripts/build.py`
2. Commit and push

**Artifact Requirements:**
- Must be fully self-contained (all CSS and JavaScript inline for HTML; inline styles for JSX)
- No external dependencies (React is loaded from CDN for JSX)
- Must include viewport meta tag for mobile responsiveness (added automatically for JSX)
- Valid subjects: Math, Science, History, Languages, Geography, Literature (or custom)
- Valid templates: quiz, flashcards, practice, timeline, mixed

## Skills

**`/artifact-builder`**: Builds interactive study artifacts (study apps, quizzes, flashcards, vocabulary drills). Triggers on Czech learning requests like "vytvoř artifact", "příprava na test", "procvičení slovíčků".
