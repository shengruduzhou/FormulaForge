import { localizeVisualizationSpec, useI18nStore } from "../../i18n";
import type { VisualizationSpec } from "../../schemas/visualization";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { CombinationViz } from "./CombinationViz";
import { GradientDescentViz } from "./GradientDescentViz";
import { GraphDegreeViz } from "./GraphDegreeViz";
import { ProbabilityTreeViz } from "./ProbabilityTreeViz";
import { RecurrenceTreeViz } from "./RecurrenceTreeViz";
import { SigmoidViz } from "./SigmoidViz";
import { SoftmaxViz } from "./SoftmaxViz";
import { TruthTableViz } from "./TruthTableViz";
import { VennDiagramViz } from "./VennDiagramViz";
import { WeightedLossViz } from "./WeightedLossViz";

export function VisualizationRenderer({ spec }: { spec: VisualizationSpec }) {
  const language = useI18nStore((state) => state.language);
  const localizedSpec = localizeVisualizationSpec(spec, language);
  const isSoftmaxTree = spec.kind === "probability_tree" && spec.title.toLowerCase().includes("softmax");

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">{localizedSpec.title}</h2>
        <p className="mt-1 text-sm text-lens-muted">{localizedSpec.description}</p>
      </CardHeader>
      <CardBody>
        {spec.kind === "weighted_contribution" && <WeightedLossViz />}
        {(spec.kind === "softmax_distribution" || isSoftmaxTree) && <SoftmaxViz />}
        {(spec.kind === "sigmoid_curve" || spec.kind === "curve") && <SigmoidViz />}
        {spec.kind === "gradient_descent_trajectory" && <GradientDescentViz />}
        {(spec.kind === "venn_diagram" || spec.kind === "venn") && <VennDiagramViz />}
        {(spec.kind === "combination_counter" || spec.kind === "counting_grid") && <CombinationViz />}
        {(spec.kind === "graph_degree_diagram" || spec.kind === "graph") && <GraphDegreeViz />}
        {spec.kind === "truth_table" && <TruthTableViz />}
        {spec.kind === "probability_tree" && !isSoftmaxTree && <ProbabilityTreeViz />}
        {spec.kind === "recurrence_tree" && <RecurrenceTreeViz />}
        {spec.kind === "none" && (
          <p className="text-sm text-lens-muted">{language === "zh" ? "当前还没有可用的交互可视化。" : "No interactive visualization is available yet."}</p>
        )}
      </CardBody>
    </Card>
  );
}
