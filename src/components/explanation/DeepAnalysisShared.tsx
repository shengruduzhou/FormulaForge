import { ArrowDown, ArrowUp } from "lucide-react";
import type { FormulaParameterInsight } from "../../schemas/deepAnalysis";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatConfidence(value: number) {
  return `${Math.round(clamp(value, 0, 1) * 100)}%`;
}

export function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="text-sm text-lens-muted">{empty}</p>;
  return (
    <ul className="grid gap-2">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="grid grid-cols-[1rem_1fr] gap-2 text-sm leading-6 text-lens-muted">
          <span className="mt-2 size-1.5 rounded-full bg-lens-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lens-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-lens-ink">{value || "—"}</p>
    </div>
  );
}

export function ParameterCard({ parameter, language }: { parameter: FormulaParameterInsight; language: "en" | "zh" }) {
  const directionRows = [
    { icon: ArrowUp, label: language === "zh" ? "增大时" : "When increased", text: parameter.effectWhenIncreased },
    { icon: ArrowDown, label: language === "zh" ? "减小时" : "When decreased", text: parameter.effectWhenDecreased },
  ];

  return (
    <article className="overflow-hidden rounded-xl border border-lens-line bg-white shadow-sm dark:bg-slate-950">
      <div className="border-b border-lens-line bg-gradient-to-r from-indigo-50 to-white p-4 dark:from-indigo-500/10 dark:to-slate-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-white px-2 py-1 text-sm font-bold text-lens-primary shadow-sm dark:bg-slate-900">{parameter.symbol}</code>
              <h4 className="text-base font-semibold text-lens-ink">{parameter.name}</h4>
              <span className="rounded-full border border-lens-line bg-white px-2 py-0.5 text-xs text-lens-muted dark:bg-slate-900">{parameter.category}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-lens-muted">{parameter.definition}</p>
          </div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            {formatConfidence(parameter.confidence)}
          </span>
        </div>
      </div>
      <div className="grid gap-4 p-4">
        <p className="rounded-lg border border-lens-line bg-slate-50 p-3 text-sm leading-6 text-lens-muted dark:bg-slate-900">
          <span className="font-semibold text-lens-ink">{language === "zh" ? "公式作用：" : "Role in the formula: "}</span>
          {parameter.role}
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Metric label={language === "zh" ? "数据类型" : "Data type"} value={parameter.dataType} />
          <Metric label={language === "zh" ? "形状 / 维度" : "Shape / dimensions"} value={parameter.shape} />
          <Metric label={language === "zh" ? "单位" : "Units"} value={parameter.units} />
          <Metric label={language === "zh" ? "定义域 / 范围" : "Domain / range"} value={parameter.domainOrRange} />
          <Metric label={language === "zh" ? "来源" : "Learned or fixed"} value={parameter.learnedOrFixed} />
          <Metric label={language === "zh" ? "示例值" : "Example value"} value={parameter.exampleValue} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {directionRows.map(({ icon: Icon, label, text }) => (
            <div key={label} className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-lens-primary"><Icon size={14} />{label}</div>
              <p className="mt-2 text-sm leading-6 text-lens-muted">{text}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-lens-muted">{language === "zh" ? "依赖关系" : "Dependencies"}</h5>
            <BulletList items={parameter.dependencies} empty={language === "zh" ? "未明确依赖。" : "No explicit dependencies were established."} />
          </div>
          <div>
            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-lens-muted">{language === "zh" ? "边界与异常" : "Edge cases"}</h5>
            <BulletList items={parameter.edgeCases} empty={language === "zh" ? "未识别边界情况。" : "No edge cases were identified."} />
          </div>
        </div>
      </div>
    </article>
  );
}
