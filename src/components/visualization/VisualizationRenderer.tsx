import type { VisualizationSpec } from "../../schemas/visualization";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { GradientDescentViz } from "./GradientDescentViz";
import { SigmoidViz } from "./SigmoidViz";
import { SoftmaxViz } from "./SoftmaxViz";
import { WeightedLossViz } from "./WeightedLossViz";

export function VisualizationRenderer({ spec }: { spec: VisualizationSpec }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">{spec.title}</h2>
        <p className="mt-1 text-sm text-lens-muted">{spec.description}</p>
      </CardHeader>
      <CardBody>
        {spec.kind === "weighted_contribution" && <WeightedLossViz />}
        {spec.kind === "softmax_distribution" && <SoftmaxViz />}
        {spec.kind === "sigmoid_curve" && <SigmoidViz />}
        {spec.kind === "gradient_descent_trajectory" && <GradientDescentViz />}
        {spec.kind === "none" && <p className="text-sm text-lens-muted">No interactive visualization is available yet.</p>}
      </CardBody>
    </Card>
  );
}
