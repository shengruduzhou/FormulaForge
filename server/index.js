import { createServer } from "node:http";
import { analyzeFormulaRequest } from "./services/formulaAnalyzer.js";
import { extractFormulaCandidates } from "./services/documentExtractor.js";
import { recognizeFormulaImage } from "./services/ocrService.js";

const PORT = Number.parseInt(process.env.PORT ?? "8787", 10);
const MAX_BODY_BYTES = Number.parseInt(process.env.MAX_BODY_BYTES ?? "6291456", 10);

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN ?? "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  response.end(JSON.stringify(payload, null, 2));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let data = "";

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        request.destroy();
        return;
      }
      data += chunk;
    });

    request.on("end", () => {
      if (!data.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch {
        reject(Object.assign(new Error("Invalid JSON body."), { status: 400 }));
      }
    });

    request.on("error", reject);
  });
}

async function route(request, response) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      status: "ok",
      service: "FormulaForge API",
      version: "0.1.0",
      capabilities: ["formula-analysis", "document-formula-extraction", "mathpix-ocr", "local-pix2tex-ocr"],
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/formula/analyze") {
    const body = await readBody(request);
    sendJson(response, 200, analyzeFormulaRequest(body));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/document/extract-formulas") {
    const body = await readBody(request);
    const content = typeof body.content === "string" ? body.content : "";
    sendJson(response, 200, {
      candidates: extractFormulaCandidates(content, body.sourceType),
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/ocr/image") {
    const body = await readBody(request);
    const result = await recognizeFormulaImage(body);
    sendJson(response, result.status, result.payload);
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
}

const server = createServer((request, response) => {
  route(request, response).catch((error) => {
    const status = Number.isInteger(error.status) ? error.status : 500;
    sendJson(response, status, {
      error: error.message || "Unexpected server error.",
    });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`FormulaForge API listening on http://127.0.0.1:${PORT}`);
});
