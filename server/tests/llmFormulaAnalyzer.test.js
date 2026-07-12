import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProviderRequest,
  normalizeDeepAnalysis,
} from "../services/llmFormulaAnalyzer.js";

const config = {
  configured: true,
  apiKey: "test-key",
  apiStyle: "responses",
  baseUrl: "https://api.example.com/v1",
  model: "test-model",
  provider: "test-provider",
  timeoutMs: 1000,
  maxOutputTokens: 1000,
  strictStructuredOutput: true,
};

test("Responses request carries formula text, image input, and strict JSON schema", () => {
  const { endpoint, payload } = buildProviderRequest(
    {
      latex: "y = ax + b",
      context: "A linear calibration model.",
      language: "zh",
      image: "data:image/png;base64,AAA",
    },
    config,
  );

  assert.equal(endpoint, "https://api.example.com/v1/responses");
  assert.equal(payload.model, "test-model");
  assert.equal(payload.text.format.type, "json_schema");
  assert.equal(payload.text.format.strict, true);
  assert.equal(payload.input[0].content[1].type, "input_image");
});

test("Deep analysis normalization supplies safe defaults and metadata", () => {
  const result = normalizeDeepAnalysis(
    {
      formulaTitle: "Linear map",
      confidence: 4,
      parameters: [
        {
          symbol: "a",
          name: "slope",
          definition: "Rate of change.",
          confidence: -1,
        },
      ],
      visualization: { kind: "flow", nodes: [{ id: "x", label: "Input" }] },
    },
    { latex: "y=ax+b", language: "en" },
    config,
  );

  assert.equal(result.provider, "test-provider");
  assert.equal(result.model, "test-model");
  assert.equal(result.confidence, 1);
  assert.equal(result.parameters[0].confidence, 0);
  assert.equal(result.visualization.kind, "flow");
  assert.equal(result.input.normalizedLatex, "y=ax+b");
});

test("Deep analysis service rejects an empty request before calling a provider", async () => {
  const { analyzeFormulaWithLlm } = await import("../services/llmFormulaAnalyzer.js");
  const result = await analyzeFormulaWithLlm({});
  assert.equal(result.status, 400);
  assert.equal(result.payload.analysis, null);
});

test("Deep analysis service sends the provider request and normalizes its result", async () => {
  const { analyzeFormulaWithLlm } = await import("../services/llmFormulaAnalyzer.js");
  const originalFetch = globalThis.fetch;
  const previous = {
    LLM_API_KEY: process.env.LLM_API_KEY,
    LLM_BASE_URL: process.env.LLM_BASE_URL,
    LLM_MODEL: process.env.LLM_MODEL,
    LLM_PROVIDER: process.env.LLM_PROVIDER,
    LLM_API_STYLE: process.env.LLM_API_STYLE,
  };
  let capturedUrl = "";
  let capturedAuthorization = "";

  process.env.LLM_API_KEY = "integration-key";
  process.env.LLM_BASE_URL = "https://provider.test/v1";
  process.env.LLM_MODEL = "integration-model";
  process.env.LLM_PROVIDER = "integration-provider";
  process.env.LLM_API_STYLE = "responses";

  globalThis.fetch = async (url, options) => {
    capturedUrl = String(url);
    capturedAuthorization = String(options?.headers?.Authorization ?? "");
    return new Response(
      JSON.stringify({
        output_text: JSON.stringify({
          formulaTitle: "Quadratic energy",
          summary: "A squared-error energy.",
          confidence: 0.84,
          parameters: [{ symbol: "x", name: "state", definition: "The evaluated state.", confidence: 0.9 }],
          visualization: { kind: "none" },
        }),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };

  try {
    const result = await analyzeFormulaWithLlm({ latex: "E=x^2", language: "en" });
    assert.equal(result.status, 200);
    assert.equal(result.payload.analysis.formulaTitle, "Quadratic energy");
    assert.equal(result.payload.analysis.provider, "integration-provider");
    assert.equal(result.payload.analysis.parameters[0].symbol, "x");
    assert.equal(capturedUrl, "https://provider.test/v1/responses");
    assert.equal(capturedAuthorization, "Bearer integration-key");
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
