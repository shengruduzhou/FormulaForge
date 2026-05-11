import type { Domain, FormulaFeatureSet, FormulaType } from "../../schemas/formula";

export function inferDomain(type: FormulaType, requestedDomain: Domain, features: FormulaFeatureSet): Domain {
  if (requestedDomain !== "general") return requestedDomain;

  if (["softmax", "sigmoid", "gradient_descent", "weighted_loss", "scaled_dot_product_attention", "layer_norm", "adam_optimizer"].includes(type)) return "ai_ml";
  if (
    [
      "combination",
      "permutation",
      "set_identity",
      "graph_degree",
      "logic_quantifier",
      "recurrence_relation",
      "pigeonhole_principle",
      "de_morgan_law",
      "modular_congruence",
    ].includes(type)
  ) {
    return "discrete_math";
  }
  if (["cross_entropy", "bayes_rule"].includes(type)) return "math_stats";

  if (features.hasMatrix || features.hasNorm) return "ai_ml";
  if (features.hasSetOperator || features.hasGraphOperator || features.hasQuantifier || features.hasFactorial || features.hasModularArithmetic) return "discrete_math";
  if (features.hasLog || features.hasSummation) return "math_stats";

  return "general";
}
