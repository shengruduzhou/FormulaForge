import { useState } from "react";
import { localizeFormulaAnalysis, uiText, useI18nStore } from "../../i18n";
import type { FormulaAnalysis } from "../../schemas/analysis";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Tabs } from "../ui/Tabs";
import { BoundaryCases } from "./BoundaryCases";
import { ComputationSteps } from "./ComputationSteps";
import { FormulaHealthCheck } from "./FormulaHealthCheck";
import { PitfallsCard } from "./PitfallsCard";
import { RelatedFormulaPanel } from "./RelatedFormulaPanel";
import { VariableTable } from "./VariableTable";

export function ExplanationTabs({ analysis }: { analysis: FormulaAnalysis }) {
  const [activeTab, setActiveTab] = useState("beginner");
  const language = useI18nStore((state) => state.language);
  const text = uiText[language];
  const localizedAnalysis = localizeFormulaAnalysis(analysis, language);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">{text.explanation}</h2>
      </CardHeader>
      <CardBody>
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              id: "beginner",
              label: text.beginner,
              content: <p className="text-sm leading-7 text-lens-muted">{localizedAnalysis.beginnerExplanation}</p>,
            },
            {
              id: "intuition",
              label: text.intuition,
              content: (
                <div className="grid gap-3">
                  <p className="text-sm leading-7 text-lens-muted">{localizedAnalysis.plainExplanation}</p>
                  <div className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-lens-primary">{text.analogy}</p>
                    <p className="mt-1 text-sm leading-7 text-lens-muted">{localizedAnalysis.analogy}</p>
                  </div>
                </div>
              ),
            },
            {
              id: "steps",
              label: text.steps,
              content: <ComputationSteps steps={localizedAnalysis.computationSteps} toyExample={localizedAnalysis.toyExample} />,
            },
            {
              id: "strict",
              label: text.strict,
              content: <p className="text-sm leading-7 text-lens-muted">{localizedAnalysis.strictExplanation}</p>,
            },
            {
              id: "variables",
              label: text.variables,
              content: <VariableTable variables={analysis.variables} />,
            },
            {
              id: "why",
              label: text.why,
              content: <p className="text-sm leading-7 text-lens-muted">{localizedAnalysis.whyItMatters}</p>,
            },
            {
              id: "pitfalls",
              label: text.pitfalls,
              content: <PitfallsCard pitfalls={localizedAnalysis.pitfalls} />,
            },
            {
              id: "related",
              label: text.related,
              content: <RelatedFormulaPanel relatedFormulas={analysis.relatedFormulas} prerequisites={analysis.prerequisites} />,
            },
            {
              id: "health",
              label: text.health,
              content: <FormulaHealthCheck report={analysis.syntax} />,
            },
          ]}
        />
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-lens-ink">{text.boundaryCases}</h3>
          <BoundaryCases cases={localizedAnalysis.boundaryCases} />
        </div>
      </CardBody>
    </Card>
  );
}
