import type { DeepFormulaAnalysis } from "../../schemas/deepAnalysis";

function section(title: string, body: string) {
  return `## ${title}\n\n${body.trim()}\n`;
}

export function buildFormulaExplainerSkill(
  analysis: DeepFormulaAnalysis,
  language: "en" | "zh",
) {
  const zh = language === "zh";
  const formula = analysis.input.normalizedLatex || analysis.input.latex;
  const parameterMap = analysis.parameters
    .map((parameter) => `- ${parameter.symbol}: ${parameter.definition} (${parameter.role})`)
    .join("\n");

  const outputLanguage = zh ? "Simplified Chinese" : "English";
  return [
    "---",
    "name: formula-understanding-tutor",
    "description: Explain a research-paper formula to a reader who lacks the mathematical background to understand it.",
    "---\n",
    "# Formula Understanding Tutor\n",
    section("Goal", "Turn an unfamiliar paper formula into a mental model the learner can restate, calculate, critique, and apply. Do not merely paraphrase the equation or describe parameter sensitivity."),
    section("Current formula", `\`\`\`latex\n${formula}\n\`\`\``),
    section("Paper context", analysis.input.context || "No surrounding context was supplied. State uncertainty explicitly and avoid inventing symbol definitions."),
    section("Known symbol map", parameterMap || "No reliable symbol definitions are available yet."),
    section("Teaching protocol", [
      "1. Start with the problem the formula solves and the meaning of its output.",
      "2. Divide the expression into functional blocks and assign each block a subgoal label.",
      "3. Explain every symbol: definition, source, type/shape, units, role, dependencies, and whether it is learned, fixed, observed, or indexed.",
      "4. Trace the actual computation in execution order with a small worked example.",
      "5. Explain the derivation only after the learner understands the forward computation.",
      "6. State assumptions, valid ranges, edge cases, numerical risks, and cases where the formula should not be used.",
      "7. End with self-explanation questions that require the learner to restate purpose, one key parameter, and one limitation.",
    ].join("\n")),
    section("Pedagogical constraints", [
      "- Use progressive disclosure: global purpose before local symbols; symbols before derivation.",
      "- Keep explanations close to the relevant formula fragment to avoid split attention.",
      "- Distinguish facts supported by context from inferences. Attach confidence to inferred meanings.",
      "- Never fabricate paper-specific definitions, dimensions, units, experimental values, or citations.",
      "- Prefer one concrete worked example over several abstract analogies.",
      "- Adapt vocabulary to the learner; define unavoidable jargon immediately.",
      "- Do not expose private chain-of-thought. Provide concise, verifiable derivation steps instead.",
    ].join("\n")),
    section("Required response", [
      `Write in ${outputLanguage}.`,
      "Return these sections in order: purpose, formula map, symbol dictionary, computation trace, worked example, derivation, assumptions and limitations, implementation notes, self-check.",
      "Use LaTeX for formulas and tables only where comparison benefits from rows and columns.",
    ].join("\n")),
  ].join("\n");
}

export function buildFormulaFollowUpPrompt(
  analysis: DeepFormulaAnalysis,
  language: "en" | "zh",
) {
  const zh = language === "zh";
  const formula = analysis.input.normalizedLatex || analysis.input.latex;
  return zh
    ? `请作为论文公式导师，继续解释下面的公式。不要只说参数增减会怎样。请先指出我最可能缺失的前置知识，再用“目标→结构块→符号→计算流程→具体算例→假设与限制→自测”的顺序教学。对无法从上下文确认的定义明确标记为推测。\n\n公式：\n${formula}\n\n论文上下文：\n${analysis.input.context || "未提供"}`
    : `Act as a research-formula tutor. Do not stop at parameter sensitivity. First identify the prerequisite knowledge I am most likely missing, then teach in this order: objective → functional blocks → symbols → computation trace → worked example → assumptions and limitations → self-check. Mark any definition that cannot be verified from context as an inference.\n\nFormula:\n${formula}\n\nPaper context:\n${analysis.input.context || "Not provided"}`;
}
