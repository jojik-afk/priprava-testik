# 🎓 Learning Hub

A dead-simple personal website for collecting interactive learning artifacts — quizzes, flashcards, practice tools — each built as a standalone HTML file.

**The idea:** You feed learning materials to Claude Code, it produces a self-contained HTML artifact, you drop it into `artifacts/`, rebuild, push, and it's live on your website.

## Quick Start

```bash
# Clone and open
git clone <your-repo-url>
cd learning-hub

# Preview locally
python3 -m http.server 8000
# Open http://localhost:8000
```

## Creating a New Artifact

### 1. Ask Claude Code to build it

Give Claude Code your learning materials (photos of notes, a PDF, teacher's slides) and a prompt like:

> Here are my notes on [topic]. Create a single self-contained HTML file that helps me learn this material. Include interactive quizzes, flashcards, or practice exercises. Make it mobile-friendly with a nice design.
>
> Include these meta tags in the `<head>`:
> ```html
> <title>Your Title Here</title>
> <meta name="subject" content="Math">
> <meta name="topic" content="Quadratic Equations">
> <meta name="template" content="quiz">
> ```
>
> The subject should be one of: Math, Science, History, Languages, Geography, Literature (or any other subject name).
> The template describes what kind of tool it is: quiz, flashcards, practice, timeline, mixed, etc.

### 2. Save & build

```bash
# Save the HTML file Claude made into artifacts/
mv ~/Downloads/quadratic-equations.html artifacts/

# Rebuild the manifest
python3 scripts/build_manifest.py

# Check it locally
python3 -m http.server 8000
```

### 3. Push to publish

```bash
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
├── artifacts/              ← Your learning tools go here
│   ├── solar-system-quiz.html
│   ├── french-basics-flashcards.html
│   └── ...
├── scripts/
│   └── build_manifest.py   ← Scans artifacts/ → manifest.json
└── README.md
```

## How It Works

- Each artifact is a **fully self-contained HTML file** — its own CSS, JS, everything. No dependencies, no build step.
- The catalogue (`index.html`) loads them in an **iframe**, so nothing can conflict.
- The build script reads `<title>` and `<meta>` tags from each HTML file to populate the catalogue.
- On mobile, artifacts open full-screen with a floating back button.

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

- **Watch mode:** Run `python3 scripts/build_manifest.py --watch` while working — it auto-rebuilds when you add/change files in `artifacts/`.
- **Testing artifacts:** You can open any `.html` file directly in your browser. They're fully standalone.
- **Subject colors:** The catalogue auto-assigns colors per subject. Currently styled: Math (blue), Science (green), History (amber), Languages (pink), Geography (teal), Literature (purple).
