import type { FormulaType } from "../../schemas/formula";
import { normalizeLatex } from "./normalizeLatex";

function score(patterns: RegExp[], value: string): number {
  return patterns.reduce((total, pattern) => total + (pattern.test(value) ? 1 : 0), 0);
}

export function detectFormulaType(latex: string, context = ""): FormulaType {
  const value = `${normalizeLatex(latex)} ${context}`.toLowerCase();

  const scores: Record<FormulaType, number> = {
    weighted_loss: score(
      [/\\lambda|\\alpha|\\beta|\\gamma/, /\+/, /l_\{|loss|objective|j\(/, /=/],
      value,
    ),
    softmax: score([/\\frac/, /e\^|\\exp/, /\\sum/, /z_|logit|p_/], value),
    sigmoid: score([/\\sigma|sigmoid/, /1\s*\+/, /e\^\{-?x|e\^-x|\\exp\(-?x/], value),
    gradient_descent: score([/\\theta_\{t\+1\}/, /\\theta_t/, /\\eta/, /\\nabla|gradient/], value),
    unknown: 0,
  };

  if (/softmax/.test(value)) scores.softmax += 3;
  if (/sigmoid/.test(value)) scores.sigmoid += 3;
  if (/\\sigma/.test(value)) scores.sigmoid += 2;
  if (/gradient descent|update rule|learning rate/.test(value)) scores.gradient_descent += 2;
  if (/weighted|multi-objective|loss function/.test(value)) scores.weighted_loss += 2;

  const [type, bestScore] = Object.entries(scores)
    .filter(([typeName]) => typeName !== "unknown")
    .sort((a, b) => b[1] - a[1])[0] as [FormulaType, number];

  return bestScore >= 2 ? type : "unknown";
}
