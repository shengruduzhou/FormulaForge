export type FormulaType =
  | "weighted_loss"
  | "softmax"
  | "sigmoid"
  | "gradient_descent"
  | "unknown";

export type Domain = "ai_ml" | "math_stats" | "physics" | "engineering" | "general";

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
