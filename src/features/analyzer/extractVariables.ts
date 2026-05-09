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
    case "cross_entropy":
      return [
        { symbol: "y_i", role: "target", meaning: "True label distribution or one-hot target for class i.", adjustable: false },
        { symbol: "p_i", role: "prediction", meaning: "Predicted probability assigned to class i.", adjustable: true, defaultValue: 0.8, min: 0.01, max: 1, step: 0.01 },
        { symbol: "\\log", role: "penalty", meaning: "Turns low true-class probability into a large loss.", adjustable: false },
      ];
    case "bayes_rule":
      return [
        { symbol: "P(A|B)", role: "posterior", meaning: "Updated belief in A after seeing evidence B.", adjustable: false },
        { symbol: "P(A)", role: "prior", meaning: "Belief in A before seeing evidence B.", adjustable: true, defaultValue: 0.2, min: 0.01, max: 0.99, step: 0.01 },
        { symbol: "P(B|A)", role: "likelihood", meaning: "How likely evidence B is if A is true.", adjustable: true, defaultValue: 0.9, min: 0.01, max: 0.99, step: 0.01 },
        { symbol: "P(B)", role: "evidence", meaning: "Normalizing probability of observing B.", adjustable: true, defaultValue: 0.3, min: 0.01, max: 0.99, step: 0.01 },
      ];
    case "combination":
      return [
        { symbol: "n", role: "total items", meaning: "Number of available items.", adjustable: true, defaultValue: 5, min: 1, max: 12, step: 1 },
        { symbol: "k", role: "chosen items", meaning: "Number of items selected without order.", adjustable: true, defaultValue: 2, min: 0, max: 12, step: 1 },
        { symbol: "!", role: "factorial", meaning: "Product of positive integers down to 1.", adjustable: false },
      ];
    case "set_identity":
      return [
        { symbol: "A", role: "set", meaning: "A collection of distinct objects.", adjustable: false },
        { symbol: "B", role: "set", meaning: "Another collection that may overlap A.", adjustable: false },
        { symbol: "\\cup", role: "union", meaning: "Objects in A or B.", adjustable: false },
        { symbol: "\\cap", role: "intersection", meaning: "Objects in both A and B.", adjustable: false },
      ];
    case "graph_degree":
      return [
        { symbol: "G=(V,E)", role: "graph", meaning: "A graph made of vertices V and edges E.", adjustable: false },
        { symbol: "v", role: "vertex", meaning: "One node in the graph.", adjustable: false },
        { symbol: "\\deg(v)", role: "degree", meaning: "Number of edges touching vertex v.", adjustable: false },
        { symbol: "|E|", role: "edge count", meaning: "Total number of graph edges.", adjustable: false },
      ];
    default:
      return [];
  }
}
