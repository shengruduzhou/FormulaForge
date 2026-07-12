import { describe, expect, it } from "vitest";
import { buildLearningJourney } from "../features/learning/buildLearningJourney";
import { buildFormulaExplainerSkill } from "../features/skills/buildFormulaSkill";
import type { DeepFormulaAnalysis } from "../schemas/deepAnalysis";

const analysis = {
  version: "1",
  source: "llm",
  provider: "test",
  model: "test",
  language: "zh",
  input: { latex: "L=L_t+\\lambda L_r", normalizedLatex: "L=L_t+\\lambda L_r", context: "where lambda controls regularization", imageUsed: false },
  formulaTitle: "Regularized objective",
  formulaCategory: "loss",
  domain: "machine learning",
  summary: "Combines task fit and regularization.",
  purpose: "Balance task performance with a constraint.",
  outputInterpretation: "A scalar objective minimized during training.",
  assumptions: ["Both terms have compatible scales."],
  parameters: [{ symbol: "\\lambda", name: "regularization weight", category: "hyperparameter", definition: "A non-negative coefficient.", role: "Controls the contribution of the regularizer.", dataType: "scalar", shape: "[]", units: "unitless", domainOrRange: "[0, infinity)", learnedOrFixed: "fixed", dependencies: ["L_r"], effectWhenIncreased: "More regularization.", effectWhenDecreased: "More task emphasis.", edgeCases: ["Zero removes regularization."], exampleValue: "0.1", confidence: 0.9 }],
  terms: [{ latex: "L_t", label: "task term", meaning: "Measures task error.", operation: "addition", interaction: "Competes with the regularizer." }],
  readingOrder: [{ order: 1, fragment: "L_t", explanation: "Compute task error." }],
  derivation: [{ order: 1, title: "Combine objectives", expression: "L=L_t+\\lambda L_r", explanation: "Use a weighted sum.", assumptions: [] }],
  computationProcedure: ["Compute task loss.", "Compute regularization.", "Add the weighted terms."],
  applications: [{ scenario: "model training", whyItFits: "It trades fit for simplicity.", example: "weight decay" }],
  limitations: ["The weight requires tuning."],
  numericalStability: [],
  validationChecks: [],
  relatedConcepts: [],
  visualization: { kind: "flow", title: "flow", description: "", xLabel: "", yLabel: "", series: [], nodes: [], edges: [], disclaimer: "" },
  confidence: 0.9,
  uncertaintyNotes: [],
  createdAt: "2026-07-12T00:00:00Z",
} satisfies DeepFormulaAnalysis;

describe("novice learning tools", () => {
  it("builds a five-stage journey with self checks", () => {
    const journey = buildLearningJourney(analysis, "zh");
    expect(journey.stages).toHaveLength(5);
    expect(journey.stages[0].id).toBe("orientation");
    expect(journey.stages[2].items[0].label).toContain("lambda");
    expect(journey.checks.length).toBeGreaterThanOrEqual(3);
  });

  it("generates a reusable skill with truthfulness and teaching constraints", () => {
    const skill = buildFormulaExplainerSkill(analysis, "en");
    expect(skill).toContain("name: formula-understanding-tutor");
    expect(skill).toContain("Never fabricate");
    expect(skill).toContain("functional blocks");
    expect(skill).toContain("L=L_t");
  });
});
