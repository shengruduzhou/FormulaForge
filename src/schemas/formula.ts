export type FormulaType =
  | "weighted_loss"
  | "softmax"
  | "sigmoid"
  | "gradient_descent"
  | "cross_entropy"
  | "bayes_rule"
  | "combination"
  | "permutation"
  | "set_identity"
  | "graph_degree"
  | "logic_quantifier"
  | "recurrence_relation"
  | "unknown";

export type Domain = "ai_ml" | "math_stats" | "discrete_math" | "physics" | "engineering" | "general";

export interface FormulaInput {
  id: string;
  latex: string;
  context?: string;
  domain: Domain;
  selectedType: FormulaType | "auto";
}

export interface VariableExplanation {
  symbol: string;
  role: string;
  meaning: string;
  adjustable: boolean;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface SymbolExplanation {
  symbol: string;
  name: string;
  category: "variable" | "operator" | "function" | "relation" | "quantifier" | "constant" | "index";
  meaning: string;
  readAs: string;
}

export interface ReadingOrderItem {
  order: number;
  fragment: string;
  explanation: string;
}

export interface FormulaFeatureSet {
  hasFraction: boolean;
  hasSummation: boolean;
  hasExponent: boolean;
  hasLog: boolean;
  hasFactorial: boolean;
  hasSetOperator: boolean;
  hasGraphOperator: boolean;
  hasQuantifier: boolean;
  hasRecurrence: boolean;
  operators: string[];
  functions: string[];
  identifiers: string[];
}

export interface FormulaStructureNode {
  id: string;
  label: string;
  latex?: string;
  role?: string;
  children?: FormulaStructureNode[];
}

export interface BoundaryCase {
  title: string;
  description: string;
}

export interface FormulaSyntaxIssue {
  severity: "info" | "warning" | "error";
  message: string;
  suggestion?: string;
}

export interface FormulaSyntaxReport {
  isValid: boolean;
  issues: FormulaSyntaxIssue[];
}

export interface ComputationStep {
  title: string;
  description: string;
  expression?: string;
}

export interface ToyExample {
  title: string;
  description: string;
  steps: string[];
  result: string;
}

export interface RelatedFormula {
  id: string;
  latex: string;
  title: string;
  domain: Domain;
  relation: "prerequisite" | "generalization" | "special_case" | "used_together" | "contrast" | "application";
  explanation: string;
}

export interface PrerequisiteConcept {
  title: string;
  level: "elementary" | "high_school" | "college_basic" | "specialized" | "paper";
  reason: string;
}
