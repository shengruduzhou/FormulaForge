import type { FormulaType } from "../../schemas/formula";
import { normalizeLatex } from "./normalizeLatex";

function score(patterns: RegExp[], value: string): number {
  return patterns.reduce((total, pattern) => total + (pattern.test(value) ? 1 : 0), 0);
}

export interface FormulaDetectionResult {
  type: FormulaType;
  confidence: number;
  scores: Record<FormulaType, number>;
}

export function detectFormulaTypeWithConfidence(latex: string, context = ""): FormulaDetectionResult {
  const value = `${normalizeLatex(latex)} ${context}`.toLowerCase();

  const scores: Record<FormulaType, number> = {
    weighted_loss: score(
      [/\\lambda|\\alpha|\\beta|\\gamma/, /\+/, /l_\{|loss|objective|j\(/, /=/],
      value,
    ),
    softmax: score([/\\frac/, /e\^|\\exp/, /\\sum/, /z_|logit|p_/], value),
    sigmoid: score([/\\sigma|sigmoid/, /1\s*\+/, /e\^\{-?x|e\^-x|\\exp\(-?x/], value),
    gradient_descent: score([/\\theta_\{t\+1\}/, /\\theta_t/, /\\eta/, /\\nabla|gradient/], value),
    cross_entropy: score([/cross.?entropy|entropy/, /\\log|log/, /y_|p_|\\hat\{?y/, /-\\sum|- ?\\sum/], value),
    bayes_rule: score([/p\s*\(|probability|posterior|prior|likelihood/, /\\frac/, /p\s*\(.+\|.+\)/, /bayes/], value),
    combination: score([/\\binom|c_\{|\\choose/, /n/, /k/, /factorial|!/], value),
    set_identity: score([/\\cup|\\cap|\\setminus|\\in|\\subset|\\overline/, /\|.*\||cardinality|set|union|intersection/, /=|\+|-/, /a|b/], value),
    graph_degree: score([/g\s*=\s*\\?\(?v,?\s*e\\?\)?|graph|vertex|edge/, /deg|degree|\\sum/, /v|e/, /=/], value),
    unknown: 0,
  };

  if (/softmax/.test(value)) scores.softmax += 3;
  if (/sigmoid/.test(value)) scores.sigmoid += 3;
  if (/\\sigma/.test(value)) scores.sigmoid += 2;
  if (/gradient descent|update rule|learning rate/.test(value)) scores.gradient_descent += 2;
  if (/weighted|multi-objective|loss function/.test(value)) scores.weighted_loss += 2;
  if (/cross entropy|negative log likelihood|classification loss/.test(value)) scores.cross_entropy += 3;
  if (/bayes|posterior|prior|likelihood/.test(value)) scores.bayes_rule += 2;
  if (/combination|choose|binomial coefficient|组合/.test(value)) scores.combination += 3;
  if (/set|union|intersection|inclusion|venn|集合|并集|交集/.test(value)) scores.set_identity += 3;
  if (/graph theory|degree|node|edge|图论|节点|边/.test(value)) scores.graph_degree += 3;

  const [type, bestScore] = Object.entries(scores)
    .filter(([typeName]) => typeName !== "unknown")
    .sort((a, b) => b[1] - a[1])[0] as [FormulaType, number];

  const maxUsefulScore = Math.max(4, ...Object.values(scores));
  const detectedType = bestScore >= 2 ? type : "unknown";

  return {
    type: detectedType,
    confidence: detectedType === "unknown" ? 0.2 : Math.min(0.98, Math.max(0.45, bestScore / maxUsefulScore)),
    scores,
  };
}

export function detectFormulaType(latex: string, context = ""): FormulaType {
  return detectFormulaTypeWithConfidence(latex, context).type;
}
