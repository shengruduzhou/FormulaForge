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
