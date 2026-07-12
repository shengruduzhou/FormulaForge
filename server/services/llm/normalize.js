import { asArray, asString, clamp, normalizeLanguage, readPositiveInt, safeNumber } from "./config.js";

function stripCodeFence(value) {
  const text = asString(value);
  if (!text.startsWith("```")) return text;
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

export function parseJsonOutput(value) {
  const text = stripCodeFence(value);
  if (!text) throw new Error("The LLM returned an empty response.");
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("The LLM response was not valid JSON.");
  }
}

function normalizeStringArray(value) {
  return asArray(value).map((item) => asString(item)).filter(Boolean);
}

function normalizeParameters(value) {
  return asArray(value).map((item) => ({
    symbol: asString(item?.symbol, "?"),
    name: asString(item?.name, "Unknown parameter"),
    category: asString(item?.category, "unknown"),
    definition: asString(item?.definition, "Definition not established from the supplied context."),
    role: asString(item?.role, "Role is context-dependent."),
    dataType: asString(item?.dataType, "unknown"),
    shape: asString(item?.shape, "unknown"),
    units: asString(item?.units, "dimensionless or unspecified"),
    domainOrRange: asString(item?.domainOrRange, "unspecified"),
    learnedOrFixed: asString(item?.learnedOrFixed, "unknown"),
    dependencies: normalizeStringArray(item?.dependencies),
    effectWhenIncreased: asString(item?.effectWhenIncreased, "Not safely inferable without holding other terms fixed."),
    effectWhenDecreased: asString(item?.effectWhenDecreased, "Not safely inferable without holding other terms fixed."),
    edgeCases: normalizeStringArray(item?.edgeCases),
    exampleValue: asString(item?.exampleValue, "Not provided"),
    confidence: clamp(safeNumber(item?.confidence, 0.5), 0, 1),
  }));
}

function normalizeVisualization(value) {
  const allowedKinds = new Set(["line", "bar", "flow", "none"]);
  const kind = allowedKinds.has(value?.kind) ? value.kind : "none";
  return {
    kind,
    title: asString(value?.title, "Formula relationship"),
    description: asString(value?.description),
    xLabel: asString(value?.xLabel),
    yLabel: asString(value?.yLabel),
    series: asArray(value?.series).map((item) => ({
      name: asString(item?.name, "series"),
      points: asArray(item?.points).map((point) => ({
        x: safeNumber(point?.x),
        y: safeNumber(point?.y),
        label: asString(point?.label),
      })).slice(0, 64),
    })),
    nodes: asArray(value?.nodes).map((node, index) => ({
      id: asString(node?.id, `node-${index + 1}`),
      label: asString(node?.label, `Step ${index + 1}`),
      description: asString(node?.description),
    })),
    edges: asArray(value?.edges).map((edge) => ({
      from: asString(edge?.from),
      to: asString(edge?.to),
      label: asString(edge?.label),
    })),
    disclaimer: asString(
      value?.disclaimer,
      kind === "line" || kind === "bar"
        ? "Illustrative visualization; verify numerical values against the original formula and paper context."
        : "Conceptual visualization derived from the supplied formula and context.",
    ),
  };
}

export function normalizeDeepAnalysis(raw, body = {}, config = {}) {
  const language = normalizeLanguage(body?.language);
  const latex = asString(body?.latex);
  return {
    version: "1.0",
    source: "llm",
    provider: asString(config.provider, "openai-compatible"),
    model: asString(config.model, "unknown"),
    language,
    input: {
      latex,
      normalizedLatex: asString(raw?.normalizedLatex, latex),
      context: asString(body?.context),
      imageUsed: Boolean(asString(body?.image)),
    },
    formulaTitle: asString(raw?.formulaTitle, "Untitled formula"),
    formulaCategory: asString(raw?.formulaCategory, "unknown"),
    domain: asString(raw?.domain, asString(body?.domain, "general")),
    summary: asString(raw?.summary, "No summary was returned."),
    purpose: asString(raw?.purpose, "Purpose could not be established from the supplied context."),
    outputInterpretation: asString(raw?.outputInterpretation, "Output interpretation is context-dependent."),
    assumptions: normalizeStringArray(raw?.assumptions),
    parameters: normalizeParameters(raw?.parameters),
    terms: asArray(raw?.terms).map((item) => ({
      latex: asString(item?.latex), label: asString(item?.label, "Term"), meaning: asString(item?.meaning),
      operation: asString(item?.operation), interaction: asString(item?.interaction),
    })),
    readingOrder: asArray(raw?.readingOrder).map((item, index) => ({
      order: readPositiveInt(item?.order, index + 1), fragment: asString(item?.fragment), explanation: asString(item?.explanation),
    })),
    derivation: asArray(raw?.derivation).map((item, index) => ({
      order: readPositiveInt(item?.order, index + 1), title: asString(item?.title, `Step ${index + 1}`),
      expression: asString(item?.expression), explanation: asString(item?.explanation), assumptions: normalizeStringArray(item?.assumptions),
    })),
    computationProcedure: normalizeStringArray(raw?.computationProcedure),
    applications: asArray(raw?.applications).map((item) => ({
      scenario: asString(item?.scenario), whyItFits: asString(item?.whyItFits), example: asString(item?.example),
    })),
    limitations: normalizeStringArray(raw?.limitations),
    numericalStability: normalizeStringArray(raw?.numericalStability),
    validationChecks: asArray(raw?.validationChecks).map((item) => ({
      check: asString(item?.check),
      status: ["pass", "warning", "unknown"].includes(item?.status) ? item.status : "unknown",
      explanation: asString(item?.explanation),
    })),
    relatedConcepts: asArray(raw?.relatedConcepts).map((item) => ({
      name: asString(item?.name), relation: asString(item?.relation), explanation: asString(item?.explanation),
    })),
    visualization: normalizeVisualization(raw?.visualization),
    confidence: clamp(safeNumber(raw?.confidence, 0.5), 0, 1),
    uncertaintyNotes: normalizeStringArray(raw?.uncertaintyNotes),
    createdAt: new Date().toISOString(),
  };
}

export function providerErrorMessage(payload, status) {
  return asString(payload?.error?.message) || asString(payload?.error) || asString(payload?.message) ||
    `LLM provider request failed with status ${status}.`;
}
