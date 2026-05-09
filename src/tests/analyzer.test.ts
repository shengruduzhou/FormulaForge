import { describe, expect, it } from "vitest";
import { analyzeFormula } from "../features/analyzer/analyzeFormula";
import { detectFormulaType } from "../features/analyzer/detectFormulaType";

describe("detectFormulaType", () => {
  it("detects weighted loss formulas", () => {
    expect(detectFormulaType("L = \\lambda_1 L_1 + \\lambda_2 L_2")).toBe("weighted_loss");
    expect(detectFormulaType("J(\\theta) = L(\\theta) + \\lambda R(\\theta)")).toBe("weighted_loss");
    expect(detectFormulaType("loss = \\alpha L_{rec} + \\beta L_{kl}")).toBe("weighted_loss");
  });

  it("detects softmax formulas", () => {
    expect(detectFormulaType("p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}")).toBe("softmax");
    expect(detectFormulaType("p_i = \\frac{\\exp(z_i/T)}{\\sum_j \\exp(z_j/T)}")).toBe("softmax");
    expect(detectFormulaType("softmax logits z_i")).toBe("softmax");
  });

  it("detects sigmoid formulas", () => {
    expect(detectFormulaType("\\sigma(x) = \\frac{1}{1 + e^{-x}}")).toBe("sigmoid");
    expect(detectFormulaType("sigmoid(x) = 1/(1+exp(-x))")).toBe("sigmoid");
    expect(detectFormulaType("\\sigma(z)")).toBe("sigmoid");
  });

  it("detects gradient descent formulas", () => {
    expect(detectFormulaType("\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)")).toBe("gradient_descent");
    expect(detectFormulaType("theta update with learning rate eta and gradient")).toBe("gradient_descent");
    expect(detectFormulaType("\\theta_t - \\eta \\nabla L")).toBe("gradient_descent");
  });

  it("detects expanded formula families", () => {
    expect(detectFormulaType("L = -\\sum_i y_i \\log p_i", "cross entropy classification loss")).toBe("cross_entropy");
    expect(detectFormulaType("P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B)}", "Bayes rule")).toBe("bayes_rule");
    expect(detectFormulaType("\\binom{n}{k} = \\frac{n!}{k!(n-k)!}")).toBe("combination");
    expect(detectFormulaType("|A \\cup B| = |A| + |B| - |A \\cap B|")).toBe("set_identity");
    expect(detectFormulaType("\\sum_{v \\in V} \\deg(v) = 2|E|", "graph degree theorem")).toBe("graph_degree");
  });
});

describe("analyzeFormula", () => {
  it("returns a complete analysis", () => {
    const result = analyzeFormula({
      id: "test",
      latex: "p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}",
      domain: "ai_ml",
      selectedType: "auto",
    });

    expect(result.detectedType).toBe("softmax");
    expect(result.variables.length).toBeGreaterThan(0);
    expect(result.structure.children?.length).toBeGreaterThan(0);
    expect(result.visualization.kind).toBe("softmax_distribution");
    expect(result.computationSteps.length).toBeGreaterThan(0);
    expect(result.relatedFormulas.length).toBeGreaterThan(0);
    expect(result.syntax.isValid).toBe(true);
  });
});
