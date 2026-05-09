import { useState } from "react";
import type { FormulaAnalysis } from "../../schemas/analysis";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Tabs } from "../ui/Tabs";
import { BoundaryCases } from "./BoundaryCases";
import { PitfallsCard } from "./PitfallsCard";
import { VariableTable } from "./VariableTable";

export function ExplanationTabs({ analysis }: { analysis: FormulaAnalysis }) {
  const [activeTab, setActiveTab] = useState("intuition");

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">Explanation</h2>
      </CardHeader>
      <CardBody>
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              id: "intuition",
              label: "Intuition",
              content: <p className="text-sm leading-7 text-lens-muted">{analysis.plainExplanation}</p>,
            },
            {
              id: "strict",
              label: "Strict",
              content: <p className="text-sm leading-7 text-lens-muted">{analysis.strictExplanation}</p>,
            },
            {
              id: "variables",
              label: "Variables",
              content: <VariableTable variables={analysis.variables} />,
            },
            {
              id: "why",
              label: "Why",
              content: <p className="text-sm leading-7 text-lens-muted">{analysis.whyItMatters}</p>,
            },
            {
              id: "pitfalls",
              label: "Pitfalls",
              content: <PitfallsCard pitfalls={analysis.pitfalls} />,
            },
          ]}
        />
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-lens-ink">Boundary Cases</h3>
          <BoundaryCases cases={analysis.boundaryCases} />
        </div>
      </CardBody>
    </Card>
  );
}
