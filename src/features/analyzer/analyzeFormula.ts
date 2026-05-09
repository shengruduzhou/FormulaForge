import type { FormulaAnalysis } from "../../schemas/analysis";
import type { FormulaInput } from "../../schemas/formula";
import { createVisualizationSpec } from "../visualization/createVisualizationSpec";
import { buildStructure } from "./buildStructure";
import { checkFormulaSyntax } from "./checkFormulaSyntax";
import { detectFormulaTypeWithConfidence } from "./detectFormulaType";
import { extractVariables } from "./extractVariables";
import { generateExplanation } from "./generateExplanation";
import { normalizeLatex } from "./normalizeLatex";

export function analyzeFormula(input: FormulaInput): FormulaAnalysis {
  const renderedLatex = normalizeLatex(input.latex);
  const detection = detectFormulaTypeWithConfidence(renderedLatex, input.context);
  const detectedType = input.selectedType === "auto" ? detection.type : input.selectedType;
  const explanation = generateExplanation(detectedType);

  return {
    id: input.id,
    input: { ...input, latex: renderedLatex },
    detectedType,
    confidence: input.selectedType === "auto" ? detection.confidence : 0.99,
    renderedLatex,
    syntax: checkFormulaSyntax(renderedLatex),
    variables: extractVariables(detectedType),
    structure: buildStructure(detectedType),
    visualization: createVisualizationSpec(detectedType),
    createdAt: new Date().toISOString(),
    ...explanation,
  };
}
