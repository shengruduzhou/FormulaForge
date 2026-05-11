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
    expect(detectFormulaType("\\forall x\\in A,\\exists y\\in B: R(x,y)")).toBe("logic_quantifier");
    expect(detectFormulaType("a_n = a_{n-1}+a_{n-2}", "recurrence")).toBe("recurrence_relation");
  });

  it("detects deep-learning and additional discrete math formulas", () => {
    expect(detectFormulaType("\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V")).toBe(
      "scaled_dot_product_attention",
    );
    expect(detectFormulaType("\\mathrm{LN}(x)=\\gamma\\frac{x-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta", "layer norm")).toBe("layer_norm");
    expect(detectFormulaType("\\theta_t=\\theta_{t-1}-\\eta\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}", "Adam optimizer")).toBe("adam_optimizer");
    expect(detectFormulaType("\\max_i |B_i| \\ge \\left\\lceil \\frac{n}{m} \\right\\rceil", "pigeonhole boxes")).toBe("pigeonhole_principle");
    expect(detectFormulaType("\\overline{A\\cup B}=\\bar A\\cap\\bar B", "De Morgan set identity")).toBe("de_morgan_law");
    expect(detectFormulaType("a\\equiv b\\pmod n \\iff n\\mid(a-b)", "modular congruence")).toBe("modular_congruence");
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
    expect(result.visualization.kind).toBe("probability_tree");
    expect(result.oneLineIntuition).toContain("Softmax");
    expect(result.symbols.length).toBeGreaterThan(0);
    expect(result.readingOrder.length).toBeGreaterThan(0);
    expect(result.computationSteps.length).toBeGreaterThan(0);
    expect(result.relatedFormulas.length).toBeGreaterThan(0);
    expect(result.syntax.isValid).toBe(true);
  });

  it("produces clearly different explanations for acceptance formulas", () => {
    const formulas = [
      "\\sigma(x)=\\frac{1}{1+e^{-x}}",
      "p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}",
      "H(p,q)=-\\sum_i p_i\\log q_i",
      "\\binom{n}{k}=\\frac{n!}{k!(n-k)!}",
      "|A\\cup B|=|A|+|B|-|A\\cap B|",
      "\\sum_{v\\in V}\\deg(v)=2|E|",
      "P(A|B)=\\frac{P(B|A)P(A)}{P(B)}",
      "\\forall x\\in A,\\exists y\\in B: R(x,y)",
      "\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
      "\\mathrm{LN}(x)=\\gamma\\frac{x-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta",
      "a\\equiv b\\pmod n \\iff n\\mid(a-b)",
    ];

    const results = formulas.map((latex) =>
      analyzeFormula({
        id: latex,
        latex,
        domain: "general",
        selectedType: "auto",
      }),
    );

    expect(results.map((result) => result.detectedType)).toEqual([
      "sigmoid",
      "softmax",
      "cross_entropy",
      "combination",
      "set_identity",
      "graph_degree",
      "bayes_rule",
      "logic_quantifier",
      "scaled_dot_product_attention",
      "layer_norm",
      "modular_congruence",
    ]);
    expect(new Set(results.map((result) => result.oneLineIntuition)).size).toBe(formulas.length);
  });
});
