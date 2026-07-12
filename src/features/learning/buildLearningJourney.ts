import type { DeepFormulaAnalysis } from "../../schemas/deepAnalysis";

export interface LearningStage {
  id: "orientation" | "structure" | "symbols" | "trace" | "transfer";
  title: string;
  goal: string;
  items: Array<{ label: string; content: string }>;
  selfExplanationPrompt: string;
}

export interface KnowledgeCheck {
  id: string;
  question: string;
  hint: string;
  answer: string;
}

export interface LearningJourney {
  stages: LearningStage[];
  checks: KnowledgeCheck[];
}

function compact(items: Array<{ label: string; content?: string }>) {
  return items.filter((item): item is { label: string; content: string } => Boolean(item.content?.trim()));
}

export function buildLearningJourney(
  analysis: DeepFormulaAnalysis,
  language: "en" | "zh",
): LearningJourney {
  const zh = language === "zh";
  const firstParameter = analysis.parameters[0];
  const firstApplication = analysis.applications[0];

  const stages: LearningStage[] = [
    {
      id: "orientation",
      title: zh ? "先看全局：它解决什么问题" : "Start globally: what problem does it solve?",
      goal: zh ? "暂时忽略符号，先建立公式存在的理由。" : "Ignore symbols briefly and establish why the formula exists.",
      items: compact([
        { label: zh ? "一句话" : "One sentence", content: analysis.summary },
        { label: zh ? "目的" : "Purpose", content: analysis.purpose },
        { label: zh ? "输出" : "Output", content: analysis.outputInterpretation },
      ]),
      selfExplanationPrompt: zh
        ? "不用看原文，用自己的话说：这个公式接收什么信息，最终想得到什么？"
        : "Without looking back, explain what information enters this formula and what it is trying to produce.",
    },
    {
      id: "structure",
      title: zh ? "看结构：公式由哪些功能块组成" : "See the structure: which functional blocks compose it?",
      goal: zh ? "把长公式切成有名字的子目标，而不是逐字符阅读。" : "Chunk the equation into named subgoals instead of reading character by character.",
      items: analysis.terms.slice(0, 8).map((term) => ({
        label: `${term.latex} · ${term.label}`,
        content: `${term.meaning}${term.interaction ? ` ${zh ? "它与其他项的关系：" : " Interaction: "}${term.interaction}` : ""}`,
      })),
      selfExplanationPrompt: zh
        ? "指出公式中最核心的一项，并解释删掉它后公式会失去什么能力。"
        : "Identify the most essential term and explain what capability would disappear if it were removed.",
    },
    {
      id: "symbols",
      title: zh ? "认符号：每个参数到底是什么" : "Decode symbols: what does each parameter actually mean?",
      goal: zh ? "区分输入、输出、索引、常量、超参数和可学习参数。" : "Separate inputs, outputs, indices, constants, hyperparameters, and learned parameters.",
      items: analysis.parameters.slice(0, 10).map((parameter) => ({
        label: `${parameter.symbol} · ${parameter.name}`,
        content: `${parameter.definition} ${zh ? "作用：" : "Role: "}${parameter.role} ${parameter.shape ? `${zh ? "形状：" : "Shape: "}${parameter.shape}` : ""}`,
      })),
      selfExplanationPrompt: firstParameter
        ? zh
          ? `尝试不看答案解释 ${firstParameter.symbol}：它是谁、从哪里来、为什么公式需要它？`
          : `Explain ${firstParameter.symbol} without looking: what is it, where does it come from, and why is it needed?`
        : zh
          ? "挑选一个符号，说明它的类型、来源和作用。"
          : "Choose one symbol and explain its type, source, and role.",
    },
    {
      id: "trace",
      title: zh ? "走一遍：数据如何穿过公式" : "Trace it: how does data flow through the formula?",
      goal: zh ? "按计算顺序理解，而不是只背最终表达式。" : "Understand the computation order instead of memorizing the final expression.",
      items: analysis.computationProcedure.slice(0, 10).map((step, index) => ({
        label: `${zh ? "步骤" : "Step"} ${index + 1}`,
        content: step,
      })),
      selfExplanationPrompt: zh
        ? "从输入开始，口头复述一次完整计算流程；每一步都说清楚为什么要做。"
        : "Starting from the inputs, narrate the full computation and explain why each step is necessary.",
    },
    {
      id: "transfer",
      title: zh ? "会迁移：什么时候用、什么时候不能用" : "Transfer: when should and should not it be used?",
      goal: zh ? "把公式放回论文任务、假设和限制中。" : "Return the formula to the paper task, assumptions, and limitations.",
      items: compact([
        { label: zh ? "典型场景" : "Typical scenario", content: firstApplication ? `${firstApplication.scenario}: ${firstApplication.whyItFits}` : "" },
        { label: zh ? "核心假设" : "Core assumptions", content: analysis.assumptions.join("；") },
        { label: zh ? "限制" : "Limitations", content: analysis.limitations.join("；") },
        { label: zh ? "数值注意" : "Numerical cautions", content: analysis.numericalStability.join("；") },
      ]),
      selfExplanationPrompt: zh
        ? "给出一个适合使用该公式的场景和一个不适合的场景，并说明判断依据。"
        : "Give one suitable and one unsuitable use case, then justify both decisions.",
    },
  ];

  const checks: KnowledgeCheck[] = [
    {
      id: "purpose",
      question: zh ? "这个公式的核心目标是什么？" : "What is the formula's central objective?",
      hint: zh ? "先回答它解决的问题，而不是复述符号。" : "Describe the problem it solves rather than repeating symbols.",
      answer: analysis.purpose,
    },
    ...(firstParameter
      ? [{
          id: "parameter",
          question: zh ? `${firstParameter.symbol} 在公式中承担什么角色？` : `What role does ${firstParameter.symbol} play?`,
          hint: firstParameter.definition,
          answer: firstParameter.role,
        }]
      : []),
    {
      id: "boundary",
      question: zh ? "使用这个公式前，至少要检查哪一个假设或限制？" : "Which assumption or limitation should be checked before using it?",
      hint: zh ? "从适用条件、数值范围或数据分布考虑。" : "Consider applicability, numerical range, or data distribution.",
      answer: analysis.assumptions[0] || analysis.limitations[0] || (zh ? "当前分析未识别到明确假设。" : "No explicit assumption was identified."),
    },
  ];

  return { stages, checks };
}
