# FormulaForge API

FormulaForge now includes a small Node backend so OCR, document parsing, and server-side formula analysis can be added without exposing provider keys in the browser.

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

`/api/ocr/image` currently returns `501` until a Mathpix or equivalent OCR adapter is configured.
