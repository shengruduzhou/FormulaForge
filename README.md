# FormulaForge

FormulaForge is a formula-analysis workspace for academic papers. It accepts LaTeX, plain-text formulas, surrounding paper context, and formula screenshots, then produces two complementary outputs:

1. **Local parser analysis** for fast, deterministic previews, formula-family detection, syntax signals, and existing interactive visualizations.
2. **LLM deep analysis** for arbitrary paper formulas, detailed parameter definitions, term interactions, derivation logic, assumptions, applications, numerical stability, validation checks, and context-aware visual explanations.

The local parser remains available when no LLM is configured, so the application degrades safely instead of becoming unusable.

## What the deep analyzer explains

The LLM report is structured rather than returned as an unformatted chat message. It covers:

- formula name, category, domain, purpose, and output interpretation;
- every parameter or symbol:
  - rigorous definition;
  - role in the formula;
  - scalar/vector/matrix/tensor type;
  - expected shape or dimensionality;
  - physical units or dimensionless status;
  - valid domain/range;
  - observed, fixed, hyperparameter, or learned status;
  - dependencies and interactions;
  - effect when increased or decreased, with assumptions stated;
  - edge cases and an example value;
  - confidence when the paper context is incomplete;
- decomposition of important formula terms;
- reading order and practical computation procedure;
- derivation steps and assumptions used by each step;
- typical applications and related concepts;
- limitations, numerical stability, and consistency checks;
- uncertainty notes that distinguish evidence from inference;
- a chart or flow diagram selected according to what can be justified from the formula.

## Input modes

- Paste LaTeX.
- Paste a plain-text equation.
- Paste surrounding paper paragraphs or symbol definitions.
- Upload, drag, or paste a PNG/JPEG/WebP screenshot.
- Use OCR to recover editable LaTeX.
- Send the original screenshot directly to a multimodal LLM even when OCR is not configured.

## Architecture

```text
formula/image/context
        |
        +--> local parser --------------------> instant deterministic preview
        |
        +--> OCR adapter ---------------------> editable LaTeX (optional)
        |
        +--> LLM adapter
               |-- OpenAI Responses API
               |-- OpenAI-compatible Chat Completions
               |-- strict JSON Schema output
               |-- output normalization and validation
                        |
                        +--> deep research report + generic chart/flow renderer
```

API keys stay on the backend. The browser calls FormulaForge's own `/api/formula/explain` route and never receives the provider key.

## Existing local capabilities

- LaTeX normalization and syntax checks
- formula-family detection and confidence scores
- domain inference
- symbol and variable extraction
- reading order and structured explanations
- toy numerical examples
- boundary cases, pitfalls, and prerequisites
- formula structure diagrams
- existing interactive visualizations for common formula families
- Mathpix OCR and optional local pix2tex-compatible OCR

## Local development

Install dependencies:

```bash
npm install
```

Copy the backend environment template:

```bash
cp server/.env.example server/.env
```

Start the backend:

```bash
npm run server
```

Start the frontend in another terminal:

```bash
npm run dev
```

The frontend runs on `http://127.0.0.1:5173` and proxies `/api` to `http://127.0.0.1:8787`.

Quality checks:

```bash
npm run test:server
npm test
npm run build
npm run lint
```

## LLM configuration

### OpenAI Responses API

Set either `LLM_API_KEY` or `OPENAI_API_KEY`:

```bash
LLM_API_KEY=your_api_key
LLM_PROVIDER=openai
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-5.6-luna
LLM_API_STYLE=responses
```

`responses` is the default API style. It supports text, image input, and strict structured output.

### OpenAI-compatible provider

For a provider exposing a compatible Responses endpoint:

```bash
LLM_API_KEY=your_provider_key
LLM_PROVIDER=my-provider
LLM_BASE_URL=https://provider.example/v1
LLM_MODEL=provider-model-name
LLM_API_STYLE=responses
```

For a provider that only supports Chat Completions:

```bash
LLM_API_KEY=your_provider_key
LLM_PROVIDER=my-provider
LLM_BASE_URL=https://provider.example/v1
LLM_MODEL=provider-model-name
LLM_API_STYLE=chat_completions
```

Some providers do not support strict JSON Schema. Disable strict mode only when required:

```bash
LLM_STRICT_JSON=false
```

Additional controls:

```bash
LLM_TIMEOUT_MS=90000
LLM_MAX_OUTPUT_TOKENS=8000
```

## OCR configuration

Mathpix:

```bash
MATHPIX_APP_ID=your_app_id
MATHPIX_APP_KEY=your_app_key
```

Optional local pix2tex-compatible service:

```bash
OCR_SERVICE_URL=http://127.0.0.1:8501/predict
```

If OCR is unavailable, the uploaded image remains available to the multimodal LLM route.

## Backend API

### Health and LLM status

- `GET /api/health`
- `GET /api/llm/status`

```bash
curl http://127.0.0.1:8787/api/llm/status
```

The status response reports whether the backend is configured, plus provider, model, API style, and image-input support. It never returns the API key.

### Local deterministic analysis

- `POST /api/formula/analyze`

```bash
curl -X POST http://127.0.0.1:8787/api/formula/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "latex": "p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}",
    "context": "Class probability normalization"
  }'
```

### LLM deep formula analysis

- `POST /api/formula/explain`

Text/LaTeX example:

```bash
curl -X POST http://127.0.0.1:8787/api/formula/explain \
  -H "Content-Type: application/json" \
  -d '{
    "latex": "L = L_{task} + \\lambda L_{reg}",
    "context": "The paper uses L_reg to constrain the learned representation.",
    "domain": "ai_ml",
    "selectedType": "auto",
    "language": "zh",
    "depth": "research"
  }'
```

Multimodal example:

```bash
curl -X POST http://127.0.0.1:8787/api/formula/explain \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,...",
    "context": "Equation 4 from the method section.",
    "domain": "ai_ml",
    "language": "en",
    "depth": "research"
  }'
```

The response shape is:

```json
{
  "analysis": {
    "source": "llm",
    "provider": "openai",
    "model": "...",
    "formulaTitle": "...",
    "parameters": [],
    "derivation": [],
    "visualization": {}
  }
}
```

### Document and OCR endpoints

- `POST /api/document/extract-formulas`
- `POST /api/ocr/image`

## Reliability and safety behavior

- Request body size is limited by `MAX_BODY_BYTES`.
- LLM calls use an abort timeout.
- Provider errors are converted into stable JSON errors.
- Strict JSON Schema is requested where supported.
- Returned JSON is normalized before reaching the UI.
- Confidence and uncertainty are explicit fields.
- The prompt prohibits inventing paper-specific definitions when context is absent.
- Quantitative charts must carry a disclaimer when values are illustrative.
- Existing local analysis remains available during LLM or OCR outages.

## Deployment

### Vercel frontend

1. Import the repository.
2. Build with `npm run build`.
3. Use `dist` as the output directory.
4. Route `/api/*` to the deployed Node backend.

Do not place LLM or OCR secrets in Vite client-side environment variables.

### Render / Railway backend

Recommended settings:

- start command: `npm run server`
- port: `8787` or the platform-provided `PORT`
- environment variables:
  - `LLM_API_KEY` or `OPENAI_API_KEY`
  - `LLM_PROVIDER`
  - `LLM_BASE_URL`
  - `LLM_MODEL`
  - `LLM_API_STYLE`
  - optional OCR variables
  - `CORS_ORIGIN` set to the frontend origin

### VPS + Nginx + PM2

```bash
git clone https://github.com/shengruduzhou/FormulaForge.git
cd FormulaForge
npm install
npm run build
npm install -g pm2
pm2 start server/index.js --name formulaforge-api
pm2 save
```

Example Nginx API proxy:

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:8787/api/;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Project structure

```text
src/
  app/routes/                       page routes
  components/formula/               text/image input and OCR
  components/explanation/           local and LLM explanation views
  components/visualization/         existing interactive renderers
  features/analyzer/                local parser and deep-analysis client
  schemas/                          TypeScript domain models
  store/                            workspace and async LLM state
server/
  services/formulaAnalyzer.js       local deterministic API analyzer
  services/llmFormulaAnalyzer.js    provider adapter and structured output
  services/ocrService.js            OCR adapters
  tests/                            backend unit tests
  index.js                          Node HTTP API entrypoint
```
