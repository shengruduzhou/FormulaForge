import type { FormulaAnalysis } from "../../schemas/analysis";
import type { FormulaInput } from "../../schemas/formula";
import { createVisualizationSpec } from "../visualization/createVisualizationSpec";
import { buildStructure } from "./buildStructure";
import { detectFormulaType } from "./detectFormulaType";
import { extractVariables } from "./extractVariables";
import { generateExplanation } from "./generateExplanation";
import { normalizeLatex } from "./normalizeLatex";

export function analyzeFormula(input: FormulaInput): FormulaAnalysis {
  const renderedLatex = normalizeLatex(input.latex);
  const detectedType =
    input.selectedType === "auto" ? detectFormulaType(renderedLatex, input.context) : input.selectedType;
  const explanation = generateExplanation(detectedType);

  return {
    id: input.id,
    input: { ...input, latex: renderedLatex },
    detectedType,
    renderedLatex,
    variables: extractVariables(detectedType),
    structure: buildStructure(detectedType),
    visualization: createVisualizationSpec(detectedType),
    createdAt: new Date().toISOString(),
    ...explanation,
  };
}
