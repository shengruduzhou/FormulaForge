# FormulaForge

FormulaForge turns scientific formulas into intuitive explanations and interactive visualizations.

Paste a LaTeX formula, choose a formula type, and get:

- plain-language explanation
- strict mathematical explanation
- variable breakdown
- formula structure diagram
- interactive visualization
- boundary cases
- common pitfalls
- exportable Markdown / JSON formula card

## Why

Scientific papers often contain formulas that are hard to understand from notation alone. FormulaForge helps readers build intuition by showing how each term works and how parameters affect the formula's behavior.

## Supported Formula Types

- Weighted loss functions
- Softmax and sigmoid
- Gradient descent update rules

More formula families can be added through the analyzer and visualization template modules.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- KaTeX
- Zustand
- Vitest

## No Backend Required

FormulaForge runs entirely in the browser. No account, server, or database is required.

## Development

```bash
npm install
npm run dev
```

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
```

## Roadmap

- MathLive input
- local history
- PNG export
- LLM provider adapters
- PDF formula extraction
- OCR for formula screenshots
- More visualization templates

## Deployment

The app is static and can be deployed to Vercel, Cloudflare Pages, or GitHub Pages after `npm run build`.
