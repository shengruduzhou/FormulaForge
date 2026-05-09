import type { FormulaStructureNode, FormulaType } from "../../schemas/formula";

export function buildStructure(type: FormulaType): FormulaStructureNode {
  switch (type) {
    case "weighted_loss":
      return {
        id: "total-objective",
        label: "Total Objective",
        role: "Weighted sum",
        children: [
          { id: "term-1", label: "λ1 × Lrec", latex: "\\lambda_1 L_{rec}", role: "Reconstruction" },
          { id: "term-2", label: "λ2 × Ladv", latex: "\\lambda_2 L_{adv}", role: "Adversarial" },
          {
            id: "term-3",
            label: "λ3 × Lperceptual",
            latex: "\\lambda_3 L_{perceptual}",
            role: "Perceptual",
          },
        ],
      };
    case "softmax":
      return {
        id: "softmax",
        label: "Probability Normalization",
        role: "Pipeline",
        children: [
          { id: "logits", label: "Logits", latex: "z_i", role: "Raw scores" },
          { id: "exp", label: "Exponentiation", latex: "e^{z_i / T}", role: "Make scores positive" },
          { id: "sum", label: "Sum normalization", latex: "\\sum_j e^{z_j/T}", role: "Shared denominator" },
          { id: "prob", label: "Distribution", latex: "p_i", role: "Competing probabilities" },
        ],
      };
    case "sigmoid":
      return {
        id: "sigmoid",
        label: "Logistic Squash",
        role: "Mapping",
        children: [
          { id: "input", label: "Input score", latex: "x", role: "Any real value" },
          { id: "denominator", label: "Logistic denominator", latex: "1 + e^{-x}", role: "Smooth saturation" },
          { id: "output", label: "Output", latex: "\\sigma(x)", role: "0 to 1 value" },
        ],
      };
    case "gradient_descent":
      return {
        id: "gd",
        label: "Parameter Update",
        role: "Optimization step",
        children: [
          { id: "current", label: "Current parameter", latex: "\\theta_t", role: "Where you are now" },
          { id: "gradient", label: "Compute gradient", latex: "\\nabla_\\theta L(\\theta_t)", role: "Uphill direction" },
          { id: "scale", label: "Scale step", latex: "\\eta \\nabla_\\theta L", role: "Learning rate" },
          { id: "update", label: "Move downhill", latex: "\\theta_t - \\eta\\nabla L", role: "Next parameter" },
        ],
      };
    default:
      return {
        id: "unknown",
        label: "Unknown Formula",
        role: "No template matched",
        children: [],
      };
  }
}
