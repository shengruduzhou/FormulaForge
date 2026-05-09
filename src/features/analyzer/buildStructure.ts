import type { FormulaStructureNode, FormulaType } from "../../schemas/formula";

export function buildStructure(type: FormulaType): FormulaStructureNode {
  switch (type) {
    case "weighted_loss":
      return {
        id: "total-objective",
        label: "Total Objective",
        role: "Weighted sum",
        children: [
          { id: "term-1", label: "lambda1 x Lrec", latex: "\\lambda_1 L_{rec}", role: "Reconstruction" },
          { id: "term-2", label: "lambda2 x Ladv", latex: "\\lambda_2 L_{adv}", role: "Adversarial" },
          { id: "term-3", label: "lambda3 x Lperceptual", latex: "\\lambda_3 L_{perceptual}", role: "Perceptual" },
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
    case "cross_entropy":
      return {
        id: "cross-entropy",
        label: "Prediction Penalty",
        role: "Classification loss",
        children: [
          { id: "target", label: "Target y_i", latex: "y_i", role: "Correct distribution" },
          { id: "prediction", label: "Prediction p_i", latex: "p_i", role: "Model probability" },
          { id: "log", label: "Log penalty", latex: "\\log p_i", role: "Punish low confidence on truth" },
          { id: "sum", label: "Sum over classes", latex: "-\\sum_i y_i\\log p_i", role: "Final loss" },
        ],
      };
    case "bayes_rule":
      return {
        id: "bayes",
        label: "Belief Update",
        role: "Conditional probability",
        children: [
          { id: "prior", label: "Prior", latex: "P(A)", role: "Before evidence" },
          { id: "likelihood", label: "Likelihood", latex: "P(B|A)", role: "Evidence fit" },
          { id: "evidence", label: "Evidence", latex: "P(B)", role: "Normalizer" },
          { id: "posterior", label: "Posterior", latex: "P(A|B)", role: "After evidence" },
        ],
      };
    case "combination":
      return {
        id: "combination",
        label: "Choose k from n",
        role: "Counting without order",
        children: [
          { id: "n", label: "n items", latex: "n", role: "Total pool" },
          { id: "k", label: "k chosen", latex: "k", role: "Selection size" },
          { id: "ordered", label: "Ordered choices", latex: "\\frac{n!}{(n-k)!}", role: "Order still matters" },
          { id: "dedupe", label: "Divide by k!", latex: "\\frac{n!}{k!(n-k)!}", role: "Remove duplicate orders" },
        ],
      };
    case "set_identity":
      return {
        id: "sets",
        label: "Set Relationship",
        role: "Membership and counting",
        children: [
          { id: "a", label: "Set A", latex: "A", role: "First collection" },
          { id: "b", label: "Set B", latex: "B", role: "Second collection" },
          { id: "union", label: "Union", latex: "A\\cup B", role: "In A or B" },
          { id: "intersection", label: "Intersection", latex: "A\\cap B", role: "In both" },
        ],
      };
    case "graph_degree":
      return {
        id: "graph",
        label: "Graph Degree",
        role: "Node-edge structure",
        children: [
          { id: "vertices", label: "Vertices", latex: "V", role: "Nodes" },
          { id: "edges", label: "Edges", latex: "E", role: "Connections" },
          { id: "degree", label: "Degree", latex: "\\deg(v)", role: "Edges touching v" },
          { id: "handshake", label: "Degree sum", latex: "\\sum_v \\deg(v)=2|E|", role: "Each edge counted twice" },
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
