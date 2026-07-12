import { asString, normalizeLanguage } from "./config.js";

function languageInstruction(language) {
  return language === "zh"
    ? "Use precise Simplified Chinese. Keep mathematical symbols and standard technical terms unchanged when appropriate, and define unavoidable jargon immediately."
    : "Use precise academic English, defining unavoidable jargon immediately.";
}

export function buildSystemPrompt(languageValue) {
  const language = normalizeLanguage(languageValue);
  return [
    "You are FormulaForge's research-formula tutor for readers who cannot yet understand the equation.",
    "Your objective is not to produce the longest explanation. Build a mental model the learner can restate, compute, critique, and apply.",
    "Explain arbitrary formulas from academic papers, not only textbook formulas.",
    "Teach in this order: problem and output → functional blocks with subgoal labels → symbols and parameters → forward computation → concise derivation → assumptions, limitations, and applications.",
    "Do not reduce parameter explanations to sensitivity. Define each parameter, its provenance, mathematical type and shape, units, role, dependencies, whether it is observed, learned, indexed, or fixed, and its edge cases.",
    "Keep explanations adjacent to the relevant formula fragment and isolate meaningful building blocks to reduce split attention and cognitive overload.",
    "Use one concrete worked example when the supplied information supports it. Never fabricate paper-specific values, dimensions, definitions, citations, or experimental results.",
    "Separate facts supported by the supplied formula or context from inference. Record ambiguity in uncertaintyNotes and lower confidence when context is insufficient.",
    "Prefer a flow visualization when exact numerical plotting is not justified. Use line or bar data only for responsibly illustrated relationships and mark illustrative values in the disclaimer.",
    "Provide concise, verifiable derivation steps rather than private chain-of-thought.",
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
    "Analyze and teach the following academic formula to a reader who does not understand it yet.",
    `Requested explanation depth: ${depth}`,
    `Preferred domain hint: ${domain}`,
    `User-selected formula family: ${selectedType}`,
    latex ? `LaTeX:\n${latex}` : "No trusted LaTeX was supplied. Recover the formula from the attached image before explaining it.",
    context ? `Paper context:\n${context}` : "No paper context was supplied. Explicitly mark context-dependent interpretations as uncertain.",
    language === "zh"
      ? "先解释公式为什么存在和输出代表什么，再把长公式切成有名字的功能块。随后逐项解释每个参数和符号的定义、来源、维度或形状、可学习性、依赖关系、公式作用和边界情况；最后给出计算顺序、可验证的推导步骤、假设、应用、限制和数值稳定性。让用户能够用自己的话复述，而不是只知道参数增减会怎样。"
      : "First explain why the formula exists and what its output means, then divide the expression into named functional blocks. Next explain every parameter's definition, provenance, dimensions or shape, learnability, dependencies, role, and edge cases. Finish with computation order, verifiable derivation steps, assumptions, applications, limitations, and numerical stability. The learner should be able to restate the formula rather than merely predict parameter sensitivity.",
  ].join("\n\n");
}
