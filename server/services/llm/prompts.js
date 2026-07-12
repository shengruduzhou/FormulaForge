import { asString, normalizeLanguage } from "./config.js";

function languageInstruction(language) {
  return language === "zh"
    ? "Use precise Simplified Chinese. Keep mathematical symbols and standard technical terms unchanged when appropriate."
    : "Use precise academic English suitable for a graduate student.";
}

export function buildSystemPrompt(languageValue) {
  const language = normalizeLanguage(languageValue);
  return [
    "You are FormulaForge's senior mathematical research assistant.",
    "Explain arbitrary formulas from academic papers, not only textbook formulas.",
    "Help the reader understand every symbol, where it comes from, its mathematical type and shape, how terms interact, the assumptions behind the formula, and how it is computed or derived.",
    "Do not reduce parameter explanations to only sensitivity. First define each parameter rigorously, then explain its role, dependencies, units or shape, whether it is observed, learned, or fixed, and its edge cases.",
    "Separate facts supported by the supplied formula or context from reasonable inference. Record ambiguity in uncertaintyNotes and lower confidence when context is insufficient.",
    "Never invent a paper-specific definition when the context does not support it.",
    "Prefer a flow visualization when exact numerical plotting is not justified. Use line or bar data only when the relationship can be responsibly illustrated, and mark illustrative values in the disclaimer.",
    languageInstruction(language),
  ].join("\n");
}

export function buildUserPrompt(body) {
  const language = normalizeLanguage(body?.language);
  const latex = asString(body?.latex);
  const context = asString(body?.context);
  const domain = asString(body?.domain, "general");
  const selectedType = asString(body?.selectedType, "auto");
  const depth = asString(body?.depth, "research");

  return [
    "Analyze the following academic formula.",
    `Requested explanation depth: ${depth}`,
    `Preferred domain hint: ${domain}`,
    `User-selected formula family: ${selectedType}`,
    latex ? `LaTeX:\n${latex}` : "No trusted LaTeX was supplied. Recover the formula from the attached image before explaining it.",
    context ? `Paper context:\n${context}` : "No paper context was supplied. Explicitly mark context-dependent interpretations as uncertain.",
    language === "zh"
      ? "重点：逐项解释每个参数和符号的定义、来源、维度或形状、可学习性、依赖关系、公式作用、边界情况和实际例子；随后解释整式的计算流程、推导逻辑、假设、应用、限制和数值稳定性。"
      : "Focus on rigorous per-parameter definitions, provenance, dimensions or shapes, learnability, dependencies, role in the equation, edge cases, and examples; then explain the full computation, derivation, assumptions, applications, limitations, and numerical stability.",
  ].join("\n\n");
}
