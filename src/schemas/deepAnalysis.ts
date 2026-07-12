import type { Domain, FormulaType } from "./formula";

export type DeepAnalysisStatus = "idle" | "loading" | "success" | "error";
export type DeepVisualizationKind = "line" | "bar" | "flow" | "none";
export type ValidationStatus = "pass" | "warning" | "unknown";

export interface DeepAnalysisImage {
  dataUrl: string;
  fileName: string;
}

export interface DeepAnalysisRequest {
  latex: string;
  context?: string;
  domain: Domain;
  selectedType: FormulaType | "auto";
  language: "en" | "zh";
  depth?: "standard" | "research";
  image?: string;
}

export interface FormulaParameterInsight {
  symbol: string;
  name: string;
  category: string;
  definition: string;
  role: string;
  dataType: string;
  shape: string;
  units: string;
  domainOrRange: string;
  learnedOrFixed: string;
  dependencies: string[];
  effectWhenIncreased: string;
  effectWhenDecreased: string;
  edgeCases: string[];
  exampleValue: string;
  confidence: number;
}

export interface FormulaTermInsight {
  latex: string;
  label: string;
  meaning: string;
  operation: string;
  interaction: string;
}

export interface DeepReadingOrderItem {
  order: number;
  fragment: string;
  explanation: string;
}

export interface DerivationStep {
  order: number;
  title: string;
  expression: string;
  explanation: string;
  assumptions: string[];
}

export interface FormulaApplication {
  scenario: string;
  whyItFits: string;
  example: string;
}

export interface FormulaValidationCheck {
  check: string;
  status: ValidationStatus;
  explanation: string;
}

export interface RelatedConceptInsight {
  name: string;
  relation: string;
  explanation: string;
}

export interface DeepChartPoint {
  x: number;
  y: number;
  label: string;
}

export interface DeepChartSeries {
  name: string;
  points: DeepChartPoint[];
}

export interface DeepFlowNode {
  id: string;
  label: string;
  description: string;
}

export interface DeepFlowEdge {
  from: string;
  to: string;
  label: string;
}

export interface DeepVisualizationSpec {
  kind: DeepVisualizationKind;
  title: string;
  description: string;
  xLabel: string;
  yLabel: string;
  series: DeepChartSeries[];
  nodes: DeepFlowNode[];
  edges: DeepFlowEdge[];
  disclaimer: string;
}

export interface DeepFormulaAnalysis {
  version: string;
  source: "llm";
  provider: string;
  model: string;
  language: "en" | "zh";
  input: {
    latex: string;
    normalizedLatex: string;
    context: string;
    imageUsed: boolean;
  };
  formulaTitle: string;
  formulaCategory: string;
  domain: string;
  summary: string;
  purpose: string;
  outputInterpretation: string;
  assumptions: string[];
  parameters: FormulaParameterInsight[];
  terms: FormulaTermInsight[];
  readingOrder: DeepReadingOrderItem[];
  derivation: DerivationStep[];
  computationProcedure: string[];
  applications: FormulaApplication[];
  limitations: string[];
  numericalStability: string[];
  validationChecks: FormulaValidationCheck[];
  relatedConcepts: RelatedConceptInsight[];
  visualization: DeepVisualizationSpec;
  confidence: number;
  uncertaintyNotes: string[];
  createdAt: string;
}
