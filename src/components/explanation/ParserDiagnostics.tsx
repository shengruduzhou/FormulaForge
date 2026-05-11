import { Activity, Braces, Route } from "lucide-react";
import { useState } from "react";
import { formulaTypeLabelsByLanguage, useI18nStore } from "../../i18n";
import type { FormulaAnalysis } from "../../schemas/analysis";
import type { FormulaFeatureSet } from "../../schemas/formula";
import { Card, CardBody, CardHeader } from "../ui/Card";

type Panel = "scores" | "signals" | "path";

const featureLabels: Array<[keyof FormulaFeatureSet, string]> = [
  ["hasFraction", "fraction"],
  ["hasSummation", "summation"],
  ["hasExponent", "exponent"],
  ["hasLog", "log"],
  ["hasFactorial", "factorial"],
  ["hasMatrix", "matrix / tensor"],
  ["hasNorm", "normalization"],
  ["hasProduct", "product"],
  ["hasModularArithmetic", "modular arithmetic"],
  ["hasSetOperator", "set operator"],
  ["hasGraphOperator", "graph operator"],
  ["hasQuantifier", "quantifier"],
  ["hasRecurrence", "recurrence"],
];

const panelMeta = {
  scores: { icon: Activity, en: "Classifier Scores", zh: "识别得分" },
  signals: { icon: Braces, en: "Syntax Signals", zh: "结构信号" },
  path: { icon: Route, en: "Reading Path", zh: "阅读路径" },
} satisfies Record<Panel, { icon: typeof Activity; en: string; zh: string }>;

export function ParserDiagnostics({ analysis }: { analysis: FormulaAnalysis }) {
  const [panel, setPanel] = useState<Panel>("scores");
  const language = useI18nStore((state) => state.language);
  const labels = formulaTypeLabelsByLanguage[language];
  const activeFeatures = featureLabels.filter(([key]) => analysis.features[key]);
  const maxScore = Math.max(...analysis.detectionScores.map((item) => item.score), 1);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="academic-title text-xl font-semibold text-lens-ink">{language === "zh" ? "解析诊断" : "Parser Diagnostics"}</h2>
          <p className="mt-1 text-sm text-lens-muted">
            {language === "zh" ? "查看识别器的证据、竞争类型和阅读路径。" : "Inspect evidence, competing formula families, and the formula reading path."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-lens-line bg-white p-1 dark:bg-slate-950">
          {(Object.keys(panelMeta) as Panel[]).map((item) => {
            const meta = panelMeta[item];
            const Icon = meta.icon;
            const active = panel === item;
            return (
              <button
                key={item}
                aria-pressed={active}
                className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                  active ? "bg-lens-primary text-white" : "text-lens-muted hover:bg-slate-50 hover:text-lens-ink dark:hover:bg-slate-900"
                }`}
                onClick={() => setPanel(item)}
                type="button"
              >
                <Icon size={15} />
                {language === "zh" ? meta.zh : meta.en}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardBody>
        {panel === "scores" && (
          <div className="grid gap-3">
            {analysis.detectionScores.length === 0 ? (
              <p className="text-sm text-lens-muted">{language === "zh" ? "没有足够强的候选类型。" : "No strong candidate scores yet."}</p>
            ) : (
              analysis.detectionScores.map((item) => (
                <div key={item.type} className="grid gap-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-lens-ink">{labels[item.type]}</span>
                    <span className="font-mono text-xs text-lens-muted">{item.score.toFixed(2)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-lens-primary" style={{ width: `${Math.max(6, (item.score / maxScore) * 100)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {panel === "signals" && (
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {activeFeatures.map(([key, label]) => (
                <span key={key} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-lens-primary dark:border-indigo-500/30 dark:bg-indigo-500/10">
                  {label}
                </span>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">operators</p>
                <p className="mt-2 break-words font-mono text-sm text-lens-ink">{analysis.features.operators.join(", ") || "none"}</p>
              </div>
              <div className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">functions</p>
                <p className="mt-2 break-words font-mono text-sm text-lens-ink">{analysis.features.functions.join(", ") || "none"}</p>
              </div>
            </div>
          </div>
        )}
        {panel === "path" && (
          <ol className="grid gap-3">
            {analysis.readingOrder.map((item) => (
              <li key={`${item.order}-${item.fragment}`} className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
                <span className="grid size-7 place-items-center rounded-full bg-white text-xs font-bold text-lens-primary dark:bg-slate-950">{item.order}</span>
                <div>
                  <code className="text-xs font-semibold text-lens-primary">{item.fragment}</code>
                  <p className="mt-1 text-sm leading-6 text-lens-muted">{item.explanation}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardBody>
    </Card>
  );
}
