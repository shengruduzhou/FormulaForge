const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-5.6-luna";
const DEFAULT_TIMEOUT_MS = 90_000;
const DEFAULT_MAX_OUTPUT_TOKENS = 8_000;

export function readPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function asString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeLanguage(value) {
  return value === "zh" ? "zh" : "en";
}

function normalizeBaseUrl(value) {
  return asString(value, DEFAULT_BASE_URL).replace(/\/+$/, "");
}

export function getLlmConfig() {
  const apiKey = asString(process.env.LLM_API_KEY || process.env.OPENAI_API_KEY);
  const apiStyle = process.env.LLM_API_STYLE === "chat_completions" ? "chat_completions" : "responses";

  return {
    configured: Boolean(apiKey),
    apiKey,
    apiStyle,
    baseUrl: normalizeBaseUrl(process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL),
    model: asString(process.env.LLM_MODEL || process.env.OPENAI_MODEL, DEFAULT_MODEL),
    provider: asString(process.env.LLM_PROVIDER, "openai-compatible"),
    timeoutMs: readPositiveInt(process.env.LLM_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    maxOutputTokens: readPositiveInt(process.env.LLM_MAX_OUTPUT_TOKENS, DEFAULT_MAX_OUTPUT_TOKENS),
    strictStructuredOutput: process.env.LLM_STRICT_JSON !== "false",
  };
}

export function getLlmStatus() {
  const config = getLlmConfig();
  return {
    configured: config.configured,
    provider: config.provider,
    model: config.model,
    apiStyle: config.apiStyle,
    baseUrl: config.baseUrl,
    supportsImageInput: true,
  };
}
