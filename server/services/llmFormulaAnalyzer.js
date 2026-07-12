import { asString, getLlmConfig, getLlmStatus } from "./llm/config.js";
import { normalizeDeepAnalysis, parseJsonOutput, providerErrorMessage } from "./llm/normalize.js";
import { buildProviderRequest, extractProviderText } from "./llm/provider.js";

export { getLlmConfig, getLlmStatus } from "./llm/config.js";
export { normalizeDeepAnalysis } from "./llm/normalize.js";
export { buildProviderRequest } from "./llm/provider.js";

export async function analyzeFormulaWithLlm(body) {
  const latex = asString(body?.latex);
  const image = asString(body?.image);

  if (!latex && !image) {
    return { status: 400, payload: { error: "Either latex or image is required.", analysis: null } };
  }

  const config = getLlmConfig();
  if (!config.configured) {
    return {
      status: 503,
      payload: {
        error: "LLM analysis is not configured. Set LLM_API_KEY or OPENAI_API_KEY on the backend.",
        analysis: null,
        configuration: getLlmStatus(),
      },
    };
  }

  const { endpoint, payload } = buildProviderRequest(body, config);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const providerPayload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        status: response.status >= 400 && response.status < 600 ? response.status : 502,
        payload: {
          error: providerErrorMessage(providerPayload, response.status),
          analysis: null,
          provider: config.provider,
          model: config.model,
        },
      };
    }

    const outputText = extractProviderText(providerPayload, config.apiStyle);
    const analysis = normalizeDeepAnalysis(parseJsonOutput(outputText), body, config);
    return { status: 200, payload: { analysis, provider: config.provider, model: config.model } };
  } catch (error) {
    const isAbort = error?.name === "AbortError";
    return {
      status: isAbort ? 504 : 502,
      payload: {
        error: isAbort ? "LLM analysis timed out." : error?.message || "LLM analysis failed.",
        analysis: null,
        provider: config.provider,
        model: config.model,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
