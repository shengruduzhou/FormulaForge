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
];

export const formulaTypeLabels: Record<FormulaType | "auto", string> = {
  auto: "Auto Detect",
  weighted_loss: "Weighted Loss",
  softmax: "Softmax",
  sigmoid: "Sigmoid",
  gradient_descent: "Gradient Descent",
  unknown: "Unknown",
};

export function getExample(id: string | null): FormulaExample | undefined {
  return examples.find((example) => example.id === id);
}
