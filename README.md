# FormulaForge

FormulaForge turns scientific formulas into intuitive explanations and interactive visualizations.

Paste a LaTeX formula, choose a formula type, and get:

- plain-language explanation
- beginner-friendly explanation and analogy
- strict mathematical explanation
- step-by-step computation walkthrough
- toy numeric example
- variable breakdown
- formula structure diagram
- interactive visualization
- formula health check
- related formulas and prerequisite concepts
- boundary cases
- common pitfalls
- exportable Markdown / JSON formula card
- optional backend API for server-side analysis, document formula extraction, and future OCR adapters

## Why

Scientific papers often contain formulas that are hard to understand from notation alone. FormulaForge helps readers build intuition by showing how each term works and how parameters affect the formula's behavior.

## Supported Formula Types

- Weighted loss functions
- Softmax and sigmoid
- Gradient descent update rules
- Cross entropy
- Bayes' rule
- Combinations
- Set identities
- Graph degree formulas

More formula families can be added through the analyzer and visualization template modules.

## Product Features

- Debounced automatic analysis after typing pauses
- Chinese / English UI and explanation mode
- Light / dark theme with localStorage persistence
- GitHub link wired to `https://github.com/shengruduzhou/FormulaForge`
- Discrete-math visual templates for Venn-style set diagrams, combination counting, and graph degree intuition
- Rule-based formula health checks for common LaTeX and OCR-like mistakes
- Node backend scaffold with `/api/health`, `/api/formula/analyze`, `/api/document/extract-formulas`, and `/api/ocr/image`

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- KaTeX
- Zustand
- Vitest
- Node.js backend with no required runtime framework

## Frontend First, Backend Ready

The core workspace still runs in the browser, so the app remains easy to deploy as a static site. A lightweight backend is included for features that should not live purely on the client, especially OCR provider keys, file upload processing, and future context-aware formula analysis.

## Development

```bash
npm install
npm run dev
```

Run the API server:

```bash
npm run server
```

The local API defaults to `http://127.0.0.1:8787`. See `server/README.md` for endpoint examples.

## Quality Checks

```bash
npm test
npm run build
```

## Project Structure

```text
src/
  app/routes/             page-level routes
  components/             reusable UI and formula surfaces
  features/analyzer/      formula analysis pipeline
  features/visualization/ visualization math helpers and specs
  schemas/                TypeScript domain models
  store/                  local workspace state
server/
  services/               backend formula and document services
  index.js                Node HTTP API entrypoint
```

## Roadmap

- MathLive input
- local history
- PNG export
- OCR provider adapters
- LLM provider adapters
- PDF formula extraction
- OCR for formula screenshots
- More visualization templates and a deeper formula ontology

## Deployment

The frontend can be deployed to Vercel, Cloudflare Pages, or GitHub Pages after `npm run build`. Deploy `server/` separately when OCR, file upload, or protected API keys are enabled.
