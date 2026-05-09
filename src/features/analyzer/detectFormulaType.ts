import type { FormulaFeatureSet, FormulaType } from "../../schemas/formula";
import { extractFormulaFeatures } from "./extractFormulaFeatures";
import { normalizeLatex } from "./normalizeLatex";

function addScore(scores: Record<FormulaType, number>, type: FormulaType, amount: number) {
  scores[type] += amount;
}

function has(value: string, pattern: RegExp): boolean {
  pattern.lastIndex = 0;
  return pattern.test(value);
}

export interface FormulaDetectionResult {
  type: FormulaType;
  confidence: number;
  scores: Record<FormulaType, number>;
  features: FormulaFeatureSet;
}

export function detectFormulaTypeWithConfidence(latex: string, context = ""): FormulaDetectionResult {
  const normalized = normalizeLatex(latex);
  const value = `${normalized} ${context}`.toLowerCase();
  const compact = value.replace(/\s+/g, "");
  const features = extractFormulaFeatures(normalized);

  const scores: Record<FormulaType, number> = {
    weighted_loss: 0,
    softmax: 0,
    sigmoid: 0,
    gradient_descent: 0,
    cross_entropy: 0,
    bayes_rule: 0,
    combination: 0,
    permutation: 0,
    set_identity: 0,
    graph_degree: 0,
    logic_quantifier: 0,
    recurrence_relation: 0,
    unknown: 0,
  };

  if (has(value, /\\lambda|\\alpha|\\beta|weighted|multi-objective|regularization|loss/) && has(value, /l_|loss|objective|j\(/)) {
    addScore(scores, "weighted_loss", 5);
  }
  if (features.hasFraction && features.hasExponent && features.hasSummation && has(value, /z_|logit|p_i|softmax/)) {
    addScore(scores, "softmax", 7);
  }
  if (has(value, /softmax/)) addScore(scores, "softmax", 4);
  if (has(value, /\\exp\(z_|\\exp\(/) && features.hasSummation) addScore(scores, "softmax", 4);
  if (has(value, /\\sigma|sigmoid/) && features.hasFraction && has(compact, /1\+e\^\{?-?x/)) {
    addScore(scores, "sigmoid", 8);
  }
  if (has(value, /\\sigma|sigmoid/)) addScore(scores, "sigmoid", 4);
  if (has(value, /\\theta|theta/) && has(value, /\\eta|eta|learning rate/) && has(value, /\\nabla|gradient/)) {
    addScore(scores, "gradient_descent", 7);
  }
  if (features.hasLog && features.hasSummation && has(value, /h\(p,q\)|cross.?entropy|y_i|p_i|q_i|-\s*\\sum/)) {
    addScore(scores, "cross_entropy", 7);
  }
  if (features.hasFraction && has(value, /p\(a\|b\)|p\(b\|a\)|posterior|prior|likelihood|bayes/)) {
    addScore(scores, "bayes_rule", 8);
  }
  if (has(value, /\\binom|\\choose|combination|binomial coefficient/) || (features.hasFactorial && has(compact, /k!\(n-k\)!/))) {
    addScore(scores, "combination", 8);
  }
  if (has(value, /p\(n,k\)|permutation|arrangement/) || (features.hasFactorial && has(compact, /n!\/\(n-k\)!/))) {
    addScore(scores, "permutation", 7);
  }
  if (features.hasSetOperator || has(value, /\\cup|\\cap|inclusion-exclusion|venn|set identity/)) {
    addScore(scores, "set_identity", 7);
  }
  if (features.hasGraphOperator || has(value, /graph|vertex|edge|handshaking|degree|\\deg/)) {
    addScore(scores, "graph_degree", 7);
  }
  if (features.hasQuantifier || has(value, /\\forall|\\exists|∀|∃|truth table|predicate|implication|\\land|\\lor|\\neg/)) {
    addScore(scores, "logic_quantifier", 8);
  }
  if (features.hasRecurrence || has(value, /recurrence|fibonacci|a_\{?n\}?=a_\{?n-1\}?/)) {
    addScore(scores, "recurrence_relation", 7);
  }

  if (features.hasFraction) {
    addScore(scores, "softmax", 0.5);
    addScore(scores, "bayes_rule", 0.5);
    addScore(scores, "sigmoid", 0.5);
  }
  if (features.hasSummation) {
    addScore(scores, "cross_entropy", 0.5);
    addScore(scores, "graph_degree", 0.5);
  }

  const entries = Object.entries(scores).filter(([type]) => type !== "unknown") as [FormulaType, number][];
  const [type, bestScore] = entries.sort((a, b) => b[1] - a[1])[0];
  const secondScore = entries[1]?.[1] ?? 0;
  const detectedType = bestScore >= 3 ? type : "unknown";
  const confidence =
    detectedType === "unknown" ? 0.2 : Math.min(0.98, Number((0.52 + Math.min(0.42, bestScore / 16) + Math.max(0, bestScore - secondScore) / 30).toFixed(2)));

  return {
    type: detectedType,
    confidence,
    scores,
    features,
  };
}

export function detectFormulaType(latex: string, context = ""): FormulaType {
  return detectFormulaTypeWithConfidence(latex, context).type;
}
