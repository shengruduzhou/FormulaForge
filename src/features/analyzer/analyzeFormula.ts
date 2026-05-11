import type { FormulaAnalysis } from "../../schemas/analysis";
import type { FormulaInput } from "../../schemas/formula";
import { createVisualizationSpec } from "../visualization/createVisualizationSpec";
import { buildStructure } from "./buildStructure";
import { checkFormulaSyntax } from "./checkFormulaSyntax";
import { detectFormulaTypeWithConfidence } from "./detectFormulaType";
import { getFormulaBlueprint } from "./formulaBlueprints";
import { inferDomain } from "./inferDomain";
import { normalizeLatex } from "./normalizeLatex";

export function analyzeFormula(input: FormulaInput): FormulaAnalysis {
  const normalizedLatex = normalizeLatex(input.latex);
  const detection = detectFormulaTypeWithConfidence(normalizedLatex, input.context);
  const detectedType = input.selectedType === "auto" ? detection.type : input.selectedType;
  const blueprint = getFormulaBlueprint(detectedType);
  const inferredDomain = inferDomain(detectedType, input.domain, detection.features);
  const visualizationSpec = createVisualizationSpec(detectedType);
  const detectionScores = Object.entries(detection.scores)
    .filter(([type, score]) => type !== "unknown" && score > 0)
    .map(([type, score]) => ({ type: type as FormulaAnalysis["detectedType"], score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    id: input.id,
    input: { ...input, latex: normalizedLatex },
    detectedType,
    formulaFamily: detectedType,
    confidence: input.selectedType === "auto" ? detection.confidence : 0.99,
    detectionScores,
    renderedLatex: normalizedLatex,
    normalizedLatex,
    inferredDomain,
    features: detection.features,
    syntax: checkFormulaSyntax(normalizedLatex),
    oneLineIntuition: blueprint.oneLineIntuition,
    plainExplanation: blueprint.plainExplanation,
    beginnerExplanation: blueprint.beginnerExplanation,
    analogy: blueprint.analogy,
    strictExplanation: blueprint.strictExplanation,
    whyItMatters: blueprint.whyItMatters,
    readingOrder: blueprint.readingOrder,
    computationSteps: blueprint.computationSteps,
    toyExample: blueprint.toyExample,
    variables: blueprint.variables,
    symbols: blueprint.symbols,
    structure: buildStructure(detectedType),
    visualization: visualizationSpec,
    visualizationSpec,
    relatedFormulas: blueprint.relatedFormulas,
    prerequisites: blueprint.prerequisites,
    boundaryCases: blueprint.boundaryCases,
    pitfalls: blueprint.pitfalls,
    createdAt: new Date().toISOString(),
  };
}
