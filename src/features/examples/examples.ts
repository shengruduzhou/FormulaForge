import type { FormulaInput, FormulaType } from "../../schemas/formula";

export interface FormulaExample extends FormulaInput {
  title: string;
  summary: string;
}

export const examples: FormulaExample[] = [
  {
    id: "weighted-loss",
    title: "Weighted Multi-Objective Loss",
    summary: "Blend reconstruction, adversarial, and perceptual goals into one training target.",
    latex: "L = \\lambda_1 L_{rec} + \\lambda_2 L_{adv} + \\lambda_3 L_{perceptual}",
    context: "A common loss function in image generation papers.",
    domain: "ai_ml",
    selectedType: "weighted_loss",
  },
  {
    id: "softmax",
    title: "Softmax with Temperature",
    summary: "Convert logits into competing probabilities and explore temperature effects.",
    latex: "p_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}",
    context: "Used to convert logits into probabilities.",
    domain: "ai_ml",
    selectedType: "softmax",
  },
  {
    id: "sigmoid",
    title: "Sigmoid Mapping",
    summary: "Map any real-valued score into a smooth 0 to 1 value.",
    latex: "\\sigma(x) = \\frac{1}{1 + e^{-x}}",
    context: "Used as a binary probability or gate.",
    domain: "math_stats",
    selectedType: "sigmoid",
  },
  {
    id: "gradient-descent",
    title: "Gradient Descent Update Rule",
    summary: "Step opposite the loss gradient and inspect learning-rate behavior.",
    latex: "\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)",
    context: "Basic optimization update used in machine learning.",
    domain: "ai_ml",
    selectedType: "gradient_descent",
  },
  {
    id: "cross-entropy",
    title: "Cross Entropy Loss",
    summary: "Penalize predicted probabilities that disagree with the true label.",
    latex: "L = -\\sum_i y_i \\log p_i",
    context: "Classification loss paired with softmax probabilities.",
    domain: "ai_ml",
    selectedType: "cross_entropy",
  },
  {
    id: "bayes-rule",
    title: "Bayes' Rule",
    summary: "Update a prior belief after observing evidence.",
    latex: "P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B)}",
    context: "A probability identity for posterior inference.",
    domain: "math_stats",
    selectedType: "bayes_rule",
  },
  {
    id: "combination",
    title: "Combination Count",
    summary: "Count unordered ways to choose k items from n.",
    latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
    context: "A basic formula in combinatorics and discrete math.",
    domain: "discrete_math",
    selectedType: "combination",
  },
  {
    id: "set-union",
    title: "Inclusion-Exclusion for Two Sets",
    summary: "Count a union without double-counting the overlap.",
    latex: "|A \\cup B| = |A| + |B| - |A \\cap B|",
    context: "A set identity from discrete mathematics.",
    domain: "discrete_math",
    selectedType: "set_identity",
  },
  {
    id: "graph-degree",
    title: "Graph Degree Sum",
    summary: "Every undirected edge contributes two degree counts.",
    latex: "\\sum_{v \\in V} \\deg(v) = 2|E|",
    context: "The handshaking lemma in graph theory.",
    domain: "discrete_math",
    selectedType: "graph_degree",
  },
];

export const formulaTypeLabels: Record<FormulaType | "auto", string> = {
  auto: "Auto Detect",
  weighted_loss: "Weighted Loss",
  softmax: "Softmax",
  sigmoid: "Sigmoid",
  gradient_descent: "Gradient Descent",
  cross_entropy: "Cross Entropy",
  bayes_rule: "Bayes' Rule",
  combination: "Combination",
  set_identity: "Set Identity",
  graph_degree: "Graph Degree",
  unknown: "Unknown",
};

export function getExample(id: string | null): FormulaExample | undefined {
  return examples.find((example) => example.id === id);
}
