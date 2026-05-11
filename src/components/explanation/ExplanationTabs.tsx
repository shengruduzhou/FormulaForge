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
        <h2 className="academic-title text-xl font-semibold text-lens-ink">{text.explanation}</h2>
      </CardHeader>
      <CardBody>
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              id: "beginner",
              label: text.beginner,
              content: (
                <div className="grid gap-3">
                  <p className="rounded-lg border border-lens-line bg-slate-50 p-3 text-sm font-semibold leading-6 text-lens-ink dark:bg-slate-900">
                    {localizedAnalysis.oneLineIntuition}
                  </p>
                  <p className="text-sm leading-7 text-lens-muted">{localizedAnalysis.beginnerExplanation}</p>
                </div>
              ),
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
              content: (
                <div className="grid gap-5">
                  <VariableTable variables={analysis.variables} />
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-lens-ink">{language === "zh" ? "符号拆解" : "Symbol Breakdown"}</h3>
                    <div className="grid gap-2">
                      {analysis.symbols.map((symbol) => (
                        <div key={`${symbol.symbol}-${symbol.name}`} className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
                          <div className="flex flex-wrap items-center gap-2">
                            <code className="text-xs font-semibold text-lens-primary">{symbol.symbol}</code>
                            <span className="text-sm font-semibold text-lens-ink">{symbol.name}</span>
                            <span className="rounded-full bg-white px-2 py-0.5 text-xs text-lens-muted dark:bg-slate-950">{symbol.category}</span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-lens-muted">{symbol.meaning}</p>
                          <p className="mt-1 text-xs text-lens-muted">{language === "zh" ? "读作：" : "Read as:"} {symbol.readAs}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-lens-ink">{language === "zh" ? "阅读顺序" : "Reading Order"}</h3>
                    <ol className="grid gap-2">
                      {analysis.readingOrder.map((item) => (
                        <li key={`${item.order}-${item.fragment}`} className="grid grid-cols-[2rem_1fr] gap-3">
                          <span className="grid size-7 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-lens-primary dark:bg-indigo-500/15">{item.order}</span>
                          <div>
                            <code className="text-xs text-lens-primary">{item.fragment}</code>
                            <p className="mt-1 text-sm text-lens-muted">{item.explanation}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ),
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
