# FormulaForge

FormulaForge is a formula parser and beginner-friendly formula explanation workspace. It turns LaTeX formulas, paper snippets, and optional OCR image input into structured explanations, symbol breakdowns, reading order, toy examples, related formulas, and interactive visualizations.

## Features

- Modular formula analyzer:
  - LaTeX normalization
  - feature extraction
  - formula family detection
  - domain inference
  - variable extraction
  - symbol breakdown
  - reading order
  - structured explanation generation
- Beginner-friendly explanation layers:
  - one-line intuition
  - elementary-math explanation
  - analogy
  - formal explanation
  - variable and symbol breakdown
  - step-by-step logic
  - toy numerical example
  - boundary cases and pitfalls
  - prerequisite concepts
  - same-domain related formulas
- Discrete math visual support:
  - Venn diagrams
  - counting grids
  - graph SVG diagrams
  - truth tables
  - recurrence trees
- OCR image input:
  - upload
  - paste
  - drag and drop
  - backend Mathpix adapter
  - optional local pix2tex-compatible adapter
  - safe fallback when OCR is not configured

## Supported Formula Families

- Weighted loss
- Sigmoid
- Softmax
- Cross entropy
- Bayes' rule
- Combinations and permutations
- Set identities and inclusion-exclusion
- Graph degree / handshaking lemma
- Logic quantifiers
- Recurrence relations

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Run the backend API:

```bash
npm run server
```

The frontend runs on `http://127.0.0.1:5173` and proxies `/api` to `http://127.0.0.1:8787`.

Quality checks:

```bash
npm test
npm run build
```

## Backend API

Compatible endpoints:

- `GET /api/health`
- `POST /api/formula/analyze`
- `POST /api/document/extract-formulas`
- `POST /api/ocr/image`

Formula analysis example:

```bash
curl -X POST http://127.0.0.1:8787/api/formula/analyze \
  -H "Content-Type: application/json" \
  -d "{\"latex\":\"p_i=\\\\frac{e^{z_i}}{\\\\sum_j e^{z_j}}\"}"
```

OCR example:

```bash
curl -X POST http://127.0.0.1:8787/api/ocr/image \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"data:image/png;base64,...\"}"
```

When OCR is not configured, the route returns a useful `503` JSON response and manual formula input continues to work.

## OCR Setup

Copy the backend env example:

```bash
cp server/.env.example server/.env
```

Mathpix:

```bash
MATHPIX_APP_ID=your_app_id
MATHPIX_APP_KEY=your_app_key
```

Optional local pix2tex-compatible service:

```bash
OCR_SERVICE_URL=http://127.0.0.1:8501/predict
```

If `OCR_SERVICE_URL` is set, FormulaForge tries the local service first. Otherwise it uses Mathpix when both Mathpix variables are present.

## Deployment

### Vercel Frontend

1. Import the repository into Vercel.
2. Use the Vite defaults:
   - build command: `npm run build`
   - output directory: `dist`
3. Set a rewrite or environment-specific API base if your backend is hosted separately.

For a separate backend host, point `/api/*` to that backend through Vercel rewrites or configure your deployment proxy.

### Render / Railway Backend

Deploy the repository as a Node service:

```bash
npm install
npm run server
```

Recommended service settings:

- start command: `npm run server`
- port: `8787` or platform-provided `PORT`
- environment variables:
  - `MATHPIX_APP_ID`
  - `MATHPIX_APP_KEY`
  - `OCR_SERVICE_URL` if using local OCR
  - `CORS_ORIGIN` set to your frontend origin

### VPS + Nginx + PM2

Install and build:

```bash
git clone https://github.com/shengruduzhou/FormulaForge.git
cd FormulaForge
npm install
npm run build
npm install -g pm2
pm2 start server/index.js --name formulaforge-api
pm2 save
```

Example Nginx server:

```nginx
server {
  server_name formulaforge.example.com;

  root /var/www/FormulaForge/dist;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:8787/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then configure TLS with Certbot or your preferred certificate manager.

## Project Structure

```text
src/
  app/routes/                 page routes
  components/formula/          input, OCR, formula preview
  components/explanation/      explanation tabs and cards
  components/visualization/    SVG and interactive renderers
  features/analyzer/           modular formula analyzer
  features/visualization/      visualization spec builders
  schemas/                     TypeScript domain models
  store/                       workspace state
server/
  services/                    API formula, document, and OCR services
  index.js                     Node HTTP API entrypoint
```
