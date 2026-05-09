import { localizeVisualizationSpec, useI18nStore } from "../../i18n";
import type { VisualizationSpec } from "../../schemas/visualization";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { CombinationViz } from "./CombinationViz";
import { GradientDescentViz } from "./GradientDescentViz";
import { GraphDegreeViz } from "./GraphDegreeViz";
import { SigmoidViz } from "./SigmoidViz";
import { SoftmaxViz } from "./SoftmaxViz";
import { VennDiagramViz } from "./VennDiagramViz";
import { WeightedLossViz } from "./WeightedLossViz";

export function VisualizationRenderer({ spec }: { spec: VisualizationSpec }) {
  const language = useI18nStore((state) => state.language);
  const localizedSpec = localizeVisualizationSpec(spec, language);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">{localizedSpec.title}</h2>
        <p className="mt-1 text-sm text-lens-muted">{localizedSpec.description}</p>
      </CardHeader>
      <CardBody>
        {spec.kind === "weighted_contribution" && <WeightedLossViz />}
        {spec.kind === "softmax_distribution" && <SoftmaxViz />}
        {spec.kind === "sigmoid_curve" && <SigmoidViz />}
        {spec.kind === "gradient_descent_trajectory" && <GradientDescentViz />}
        {spec.kind === "venn_diagram" && <VennDiagramViz />}
        {spec.kind === "combination_counter" && <CombinationViz />}
        {spec.kind === "graph_degree_diagram" && <GraphDegreeViz />}
        {spec.kind === "none" && (
          <p className="text-sm text-lens-muted">{language === "zh" ? "当前还没有可用的交互可视化。" : "No interactive visualization is available yet."}</p>
        )}
      </CardBody>
    </Card>
  );
}
