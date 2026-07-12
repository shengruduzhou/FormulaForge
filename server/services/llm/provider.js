import { analysisSchema } from "./schema.js";
import { asArray, asString } from "./config.js";
import { buildSystemPrompt, buildUserPrompt } from "./prompts.js";

function buildResponsesRequest(body, config) {
  const content = [{ type: "input_text", text: buildUserPrompt(body) }];
  const image = asString(body?.image);
  if (image) content.push({ type: "input_image", image_url: image });

  return {
    endpoint: `${config.baseUrl}/responses`,
    payload: {
      model: config.model,
      store: false,
      instructions: buildSystemPrompt(body?.language),
      input: [{ role: "user", content }],
      max_output_tokens: config.maxOutputTokens,
      text: {
        format: config.strictStructuredOutput
          ? { type: "json_schema", name: "formula_forge_deep_analysis", strict: true, schema: analysisSchema }
          : { type: "json_object" },
      },
    },
  };
}

function buildChatCompletionsRequest(body, config) {
  const image = asString(body?.image);
  const userContent = image
    ? [
        { type: "text", text: buildUserPrompt(body) },
        { type: "image_url", image_url: { url: image } },
      ]
    : buildUserPrompt(body);

  return {
    endpoint: `${config.baseUrl}/chat/completions`,
    payload: {
      model: config.model,
      messages: [
        { role: "system", content: buildSystemPrompt(body?.language) },
        { role: "user", content: userContent },
      ],
      max_tokens: config.maxOutputTokens,
      response_format: config.strictStructuredOutput
        ? { type: "json_schema", json_schema: { name: "formula_forge_deep_analysis", strict: true, schema: analysisSchema } }
        : { type: "json_object" },
    },
  };
}

export function buildProviderRequest(body, config) {
  return config.apiStyle === "chat_completions"
    ? buildChatCompletionsRequest(body, config)
    : buildResponsesRequest(body, config);
}

function extractResponsesText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of asArray(payload?.output)) {
    for (const content of asArray(item?.content)) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

function extractChatText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((item) => (typeof item?.text === "string" ? item.text : "")).join("");
  return "";
}

export function extractProviderText(payload, apiStyle) {
  return apiStyle === "chat_completions" ? extractChatText(payload) : extractResponsesText(payload);
}
