import type {
  BoundaryCase,
  ComputationStep,
  FormulaInput,
  FormulaFeatureSet,
  ReadingOrderItem,
  FormulaStructureNode,
  FormulaSyntaxReport,
  FormulaType,
  PrerequisiteConcept,
  RelatedFormula,
  SymbolExplanation,
  ToyExample,
  VariableExplanation,
} from "./formula";
import type { VisualizationSpec } from "./visualization";

export interface FormulaAnalysis {
  id: string;
  input: FormulaInput;
  detectedType: FormulaType;
  formulaFamily: FormulaType;
  confidence: number;
  renderedLatex: string;
  normalizedLatex: string;
  inferredDomain: FormulaInput["domain"];
  features: FormulaFeatureSet;
  syntax: FormulaSyntaxReport;
  oneLineIntuition: string;
  plainExplanation: string;
  beginnerExplanation: string;
  analogy: string;
  strictExplanation: string;
  whyItMatters: string;
  readingOrder: ReadingOrderItem[];
  computationSteps: ComputationStep[];
  toyExample: ToyExample;
  variables: VariableExplanation[];
  symbols: SymbolExplanation[];
  structure: FormulaStructureNode;
  visualization: VisualizationSpec;
  visualizationSpec: VisualizationSpec;
  relatedFormulas: RelatedFormula[];
  prerequisites: PrerequisiteConcept[];
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
  createdAt: string;
}
