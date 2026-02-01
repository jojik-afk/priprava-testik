# 🎓 Learning Hub

A dead-simple personal website for collecting interactive learning artifacts — quizzes, flashcards, practice tools — each built as a standalone HTML file.

**The idea:** You feed learning materials to Claude Code, it produces a self-contained HTML artifact, you drop it into `artifacts/`, rebuild, push, and it's live on your website.

## Quick Start

```bash
# Clone and open
git clone <your-repo-url>
cd learning-hub

# Build artifacts from src/ (requires Bun for JSX)
python3 scripts/build.py

# Preview locally
python3 -m http.server 8000
# Open http://localhost:8000
```

## Creating a New Artifact

### Option A: Vanilla HTML

Give Claude Code your learning materials and a prompt. Save the resulting HTML file to `src/` with these meta tags in the `<head>`:

```html
<title>Your Title Here</title>
<meta name="subject" content="Math">
<meta name="topic" content="Quadratic Equations">
<meta name="template" content="quiz">
```

### Option B: React JSX

Create a `.jsx` file in `src/` with `@meta` comments at the top:

```jsx
// @title Linear Equations Practice
// @subject Math
// @topic Algebra
// @template practice

import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>My Learning Tool</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}
```

The build script bundles JSX files with Bun and wraps them in a template that loads React from CDN.

### Build & Publish

```bash
# Build artifacts from src/
python3 scripts/build.py

# Check locally
python3 -m http.server 8000

# Push to publish
git add .
git commit -m "Add quadratic equations quiz"
git push
```

Your site updates automatically via GitHub Pages.

## Project Structure

```
learning-hub/
├── index.html              ← The catalogue shell (don't edit)
├── manifest.json           ← Auto-generated, don't edit by hand
├── src/                    ← Source files (.html or .jsx)
│   ├── solar-system-quiz.html
│   ├── linear-equations.jsx
│   └── ...
├── artifacts/              ← Build output (generated, don't edit)
│   ├── solar-system-quiz.html
│   ├── linear-equations.html
│   └── ...
├── scripts/
│   ├── build.py            ← Builds src/ → artifacts/ + manifest.json
│   └── template.html       ← HTML wrapper for React artifacts
└── README.md
```

## How It Works

- Source files live in `src/` — either vanilla HTML or React JSX
- The build script (`scripts/build.py`) processes them:
  - **HTML files**: Copied directly to `artifacts/`
  - **JSX files**: Bundled with esbuild and wrapped in a React template
- Each artifact is a **fully self-contained HTML file** — its own CSS, JS, everything
- The catalogue (`index.html`) loads them in an **iframe**, so nothing can conflict
- On mobile, artifacts open full-screen with a floating back button

## Metadata Tags

The build script extracts these from each artifact's `<head>`:

| Tag | Required? | Purpose |
|-----|-----------|---------|
| `<title>` | Yes | Displayed as the card title |
| `<meta name="subject">` | Recommended | Used for filtering (e.g. "Math", "Science") |
| `<meta name="topic">` | Optional | More specific label (e.g. "Quadratic Equations") |
| `<meta name="template">` | Optional | Type of tool (e.g. "quiz", "flashcards") |

If tags are missing, the script falls back to the filename for the title and "General" for the subject.

## GitHub Pages Setup

1. Go to your repo → Settings → Pages
2. Source: **GitHub Actions**
3. The included workflow (`.github/workflows/deploy.yml`) handles the rest

Or simply use "Deploy from branch" with the `main` branch and `/` (root) as the folder — since this is all static files, it just works.

## Tips

- **Watch mode:** Run `python3 scripts/build.py --watch` while working — it auto-rebuilds when you add/change files in `src/`.
- **Testing artifacts:** You can open any built `.html` file in `artifacts/` directly in your browser. They're fully standalone.
- **Subject colors:** The catalogue auto-assigns colors per subject. Currently styled: Math (blue), Science (green), History (amber), Languages (pink), Geography (teal), Literature (purple).
- **JSX metadata:** Use `// @key value` comments at the top of JSX files (title, subject, topic, template).
