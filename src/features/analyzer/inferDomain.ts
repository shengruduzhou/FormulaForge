import type { Domain, FormulaFeatureSet, FormulaType } from "../../schemas/formula";

export function inferDomain(type: FormulaType, requestedDomain: Domain, features: FormulaFeatureSet): Domain {
  if (requestedDomain !== "general") return requestedDomain;

  if (["softmax", "sigmoid", "gradient_descent", "weighted_loss"].includes(type)) return "ai_ml";
  if (["combination", "permutation", "set_identity", "graph_degree", "logic_quantifier", "recurrence_relation"].includes(type)) {
    return "discrete_math";
  }
  if (["cross_entropy", "bayes_rule"].includes(type)) return "math_stats";

  if (features.hasSetOperator || features.hasGraphOperator || features.hasQuantifier || features.hasFactorial) return "discrete_math";
  if (features.hasLog || features.hasSummation) return "math_stats";

  return "general";
}
