import type {
  BoundaryCase,
  FormulaInput,
  FormulaStructureNode,
  FormulaType,
  VariableExplanation,
} from "./formula";
import type { VisualizationSpec } from "./visualization";

export interface FormulaAnalysis {
  id: string;
  input: FormulaInput;
  detectedType: FormulaType;
  renderedLatex: string;
  plainExplanation: string;
  strictExplanation: string;
  whyItMatters: string;
  variables: VariableExplanation[];
  structure: FormulaStructureNode;
  visualization: VisualizationSpec;
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
  createdAt: string;
}
