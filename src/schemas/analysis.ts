import type {
  BoundaryCase,
  ComputationStep,
  FormulaInput,
  FormulaStructureNode,
  FormulaSyntaxReport,
  FormulaType,
  PrerequisiteConcept,
  RelatedFormula,
  ToyExample,
  VariableExplanation,
} from "./formula";
import type { VisualizationSpec } from "./visualization";

export interface FormulaAnalysis {
  id: string;
  input: FormulaInput;
  detectedType: FormulaType;
  confidence: number;
  renderedLatex: string;
  syntax: FormulaSyntaxReport;
  plainExplanation: string;
  beginnerExplanation: string;
  analogy: string;
  strictExplanation: string;
  whyItMatters: string;
  computationSteps: ComputationStep[];
  toyExample: ToyExample;
  variables: VariableExplanation[];
  structure: FormulaStructureNode;
  visualization: VisualizationSpec;
  relatedFormulas: RelatedFormula[];
  prerequisites: PrerequisiteConcept[];
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
  createdAt: string;
}
