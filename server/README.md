# FormulaForge API

FormulaForge includes a small Node backend so OCR, document parsing, and server-side formula analysis can run without exposing provider keys in the browser.

## Run

```bash
npm run server
```

The server listens on `http://127.0.0.1:8787` by default.

## Endpoints

- `GET /api/health`
- `POST /api/formula/analyze`
- `POST /api/document/extract-formulas`
- `POST /api/ocr/image`

Example:

```bash
curl -X POST http://127.0.0.1:8787/api/formula/analyze \
  -H "Content-Type: application/json" \
  -d "{\"latex\":\"L=\\\\lambda_1 L_{rec}+\\\\lambda_2 L_{adv}\",\"language\":\"zh\"}"
```

## OCR

Configure either Mathpix:

```bash
MATHPIX_APP_ID=...
MATHPIX_APP_KEY=...
```

or a local pix2tex-compatible service:

```bash
OCR_SERVICE_URL=http://127.0.0.1:8501/predict
```

If no OCR provider is configured, `/api/ocr/image` returns a clear `503` JSON error and the frontend still supports manual LaTeX input.
