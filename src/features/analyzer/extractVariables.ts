import type { FormulaType, VariableExplanation } from "../../schemas/formula";

export function extractVariables(type: FormulaType): VariableExplanation[] {
  switch (type) {
    case "weighted_loss":
      return [
        {
          symbol: "\\lambda_1",
          role: "weight",
          meaning: "Controls the contribution of the reconstruction objective.",
          adjustable: true,
          defaultValue: 1,
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          symbol: "\\lambda_2",
          role: "weight",
          meaning: "Controls the adversarial or secondary objective.",
          adjustable: true,
          defaultValue: 0.8,
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          symbol: "\\lambda_3",
          role: "weight",
          meaning: "Controls the perceptual or regularization objective.",
          adjustable: true,
          defaultValue: 0.5,
          min: 0,
          max: 3,
          step: 0.1,
        },
        {
          symbol: "L_i",
          role: "loss term",
          meaning: "A measurable objective component being optimized.",
          adjustable: true,
          defaultValue: 1,
          min: 0,
          max: 5,
          step: 0.1,
        },
      ];
    case "softmax":
      return [
        {
          symbol: "z_i",
          role: "logit",
          meaning: "Raw score for class i before normalization.",
          adjustable: true,
          defaultValue: 1,
          min: -5,
          max: 5,
          step: 0.1,
        },
        {
          symbol: "T",
          role: "temperature",
          meaning: "Controls how sharp or uniform the probability distribution becomes.",
          adjustable: true,
          defaultValue: 1,
          min: 0.1,
          max: 5,
          step: 0.1,
        },
        {
          symbol: "p_i",
          role: "probability",
          meaning: "Normalized output probability for class i.",
          adjustable: false,
        },
      ];
    case "sigmoid":
      return [
        {
          symbol: "x",
          role: "input",
          meaning: "A real-valued score mapped into the 0 to 1 interval.",
          adjustable: true,
          defaultValue: 0,
          min: -8,
          max: 8,
          step: 0.1,
        },
        {
          symbol: "\\sigma(x)",
          role: "output",
          meaning: "A smooth probability-like value between 0 and 1.",
          adjustable: false,
        },
      ];
    case "gradient_descent":
      return [
        {
          symbol: "\\theta_t",
          role: "parameter",
          meaning: "The current model parameter at optimization step t.",
          adjustable: false,
        },
        {
          symbol: "\\eta",
          role: "learning rate",
          meaning: "Scales how far the update moves along the negative gradient.",
          adjustable: true,
          defaultValue: 0.15,
          min: 0.01,
          max: 0.8,
          step: 0.01,
        },
        {
          symbol: "\\nabla_\\theta L",
          role: "gradient",
          meaning: "Direction of steepest local increase in the loss.",
          adjustable: false,
        },
      ];
    default:
      return [];
  }
}
