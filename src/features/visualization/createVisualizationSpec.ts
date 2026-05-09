import type { FormulaType } from "../../schemas/formula";
import type { VisualizationSpec } from "../../schemas/visualization";

export function createVisualizationSpec(type: FormulaType): VisualizationSpec {
  switch (type) {
    case "weighted_loss":
      return {
        kind: "weighted_contribution",
        title: "Weighted Contribution Explorer",
        description: "Adjust lambda and loss values to see how each term changes the total objective.",
        parameters: [
          { name: "lambda 1", symbol: "\\lambda_1", value: 1, min: 0, max: 3, step: 0.1 },
          { name: "lambda 2", symbol: "\\lambda_2", value: 0.8, min: 0, max: 3, step: 0.1 },
          { name: "lambda 3", symbol: "\\lambda_3", value: 0.5, min: 0, max: 3, step: 0.1 },
        ],
      };
    case "softmax":
      return {
        kind: "softmax_distribution",
        title: "Softmax Temperature Explorer",
        description: "Move logits and temperature to watch probability mass shift between classes.",
        parameters: [
          { name: "z1", symbol: "z_1", value: 2, min: -5, max: 5, step: 0.1 },
          { name: "z2", symbol: "z_2", value: 0.6, min: -5, max: 5, step: 0.1 },
          { name: "z3", symbol: "z_3", value: -1, min: -5, max: 5, step: 0.1 },
          { name: "temperature", symbol: "T", value: 1, min: 0.1, max: 5, step: 0.1 },
        ],
      };
    case "sigmoid":
      return {
        kind: "sigmoid_curve",
        title: "Sigmoid Curve Explorer",
        description: "Move x along the logistic curve and watch the output saturate.",
        parameters: [{ name: "x", symbol: "x", value: 0, min: -8, max: 8, step: 0.1 }],
      };
    case "gradient_descent":
      return {
        kind: "gradient_descent_trajectory",
        title: "Gradient Descent Trajectory",
        description: "Step across a convex loss surface and see how learning rate changes the path.",
        parameters: [
          { name: "learning rate", symbol: "\\eta", value: 0.15, min: 0.01, max: 0.8, step: 0.01 },
          { name: "initial x", symbol: "x_0", value: 2.8, min: -4, max: 4, step: 0.1 },
          { name: "initial y", symbol: "y_0", value: 2.2, min: -4, max: 4, step: 0.1 },
        ],
      };
    case "set_identity":
      return {
        kind: "venn_diagram",
        title: "Set Relationship Diagram",
        description: "Use a Venn-style view to see union, intersection, and double-counted overlap.",
        parameters: [],
      };
    case "combination":
      return {
        kind: "combination_counter",
        title: "Combination Counter",
        description: "Change n and k to see how many unordered selections are possible.",
        parameters: [
          { name: "n", symbol: "n", value: 5, min: 1, max: 10, step: 1 },
          { name: "k", symbol: "k", value: 2, min: 0, max: 10, step: 1 },
        ],
      };
    case "graph_degree":
      return {
        kind: "graph_degree_diagram",
        title: "Graph Degree Diagram",
        description: "Inspect a small graph and see how degrees count incident edges.",
        parameters: [],
      };
    default:
      return {
        kind: "none",
        title: "No visualization available",
        description: "Choose a supported formula type to load an interactive template.",
        parameters: [],
      };
  }
}
