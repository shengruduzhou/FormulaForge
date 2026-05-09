export type VisualizationKind =
  | "venn"
  | "graph"
  | "counting_grid"
  | "truth_table"
  | "curve"
  | "probability_tree"
  | "recurrence_tree"
  | "weighted_contribution"
  | "softmax_distribution"
  | "sigmoid_curve"
  | "gradient_descent_trajectory"
  | "venn_diagram"
  | "combination_counter"
  | "graph_degree_diagram"
  | "none";

export interface VisualizationParameter {
  name: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface VisualizationSpec {
  kind: VisualizationKind;
  title: string;
  description: string;
  parameters: VisualizationParameter[];
}
