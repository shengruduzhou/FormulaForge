import { Activity, ArrowRight, Network } from "lucide-react";
import type { DeepVisualizationSpec } from "../../schemas/deepAnalysis";

const chartColors = ["#4f46e5", "#0891b2", "#d97706", "#be123c"];

function NumericChart({ spec }: { spec: DeepVisualizationSpec }) {
  const width = 760;
  const height = 320;
  const padding = { left: 56, right: 24, top: 24, bottom: 48 };
  const points = spec.series.flatMap((series) => series.points).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (!points.length) return null;

  let xMin = Math.min(...points.map((point) => point.x));
  let xMax = Math.max(...points.map((point) => point.x));
  let yMin = Math.min(...points.map((point) => point.y));
  let yMax = Math.max(...points.map((point) => point.y));
  if (xMin === xMax) { xMin -= 1; xMax += 1; }
  if (yMin === yMax) { yMin -= 1; yMax += 1; }

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const xToSvg = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const yToSvg = (y: number) => padding.top + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;
  const ticks = Array.from({ length: 5 }, (_, index) => index / 4);

  return (
    <div className="overflow-x-auto rounded-xl border border-lens-line bg-white p-3 dark:bg-slate-950">
      <svg className="min-w-[660px]" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={spec.title}>
        {ticks.map((ratio) => {
          const x = padding.left + ratio * plotWidth;
          const y = padding.top + ratio * plotHeight;
          const xValue = xMin + ratio * (xMax - xMin);
          const yValue = yMax - ratio * (yMax - yMin);
          return (
            <g key={ratio}>
              <line x1={x} x2={x} y1={padding.top} y2={padding.top + plotHeight} stroke="currentColor" opacity="0.08" />
              <line x1={padding.left} x2={padding.left + plotWidth} y1={y} y2={y} stroke="currentColor" opacity="0.08" />
              <text x={x} y={height - 24} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.65">{xValue.toPrecision(3)}</text>
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.65">{yValue.toPrecision(3)}</text>
            </g>
          );
        })}
        <line x1={padding.left} x2={padding.left} y1={padding.top} y2={padding.top + plotHeight} stroke="currentColor" opacity="0.35" />
        <line x1={padding.left} x2={padding.left + plotWidth} y1={padding.top + plotHeight} y2={padding.top + plotHeight} stroke="currentColor" opacity="0.35" />
        {spec.series.slice(0, 4).map((series, seriesIndex) => {
          const ordered = [...series.points].filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)).sort((a, b) => a.x - b.x);
          const color = chartColors[seriesIndex % chartColors.length];
          const path = ordered.map((point, index) => `${index === 0 ? "M" : "L"}${xToSvg(point.x)},${yToSvg(point.y)}`).join(" ");
          return (
            <g key={`${series.name}-${seriesIndex}`}>
              {spec.kind === "line" && <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
              {ordered.map((point, pointIndex) => {
                const x = xToSvg(point.x);
                const y = yToSvg(point.y);
                if (spec.kind === "bar") {
                  const barWidth = Math.max(10, plotWidth / Math.max(ordered.length * spec.series.length * 1.6, 8));
                  const baseY = yToSvg(Math.max(0, yMin));
                  return (
                    <rect key={`${point.x}-${point.y}-${pointIndex}`} x={x - barWidth / 2 + seriesIndex * (barWidth + 2)} y={Math.min(y, baseY)} width={barWidth} height={Math.max(2, Math.abs(baseY - y))} rx="3" fill={color} opacity="0.84">
                      <title>{point.label || `${series.name}: (${point.x}, ${point.y})`}</title>
                    </rect>
                  );
                }
                return <circle key={`${point.x}-${point.y}-${pointIndex}`} cx={x} cy={y} r="4" fill={color}><title>{point.label || `${series.name}: (${point.x}, ${point.y})`}</title></circle>;
              })}
            </g>
          );
        })}
        <text x={padding.left + plotWidth / 2} y={height - 5} textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.75">{spec.xLabel}</text>
        <text x="14" y={padding.top + plotHeight / 2} textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.75" transform={`rotate(-90 14 ${padding.top + plotHeight / 2})`}>{spec.yLabel}</text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-3">
        {spec.series.slice(0, 4).map((series, index) => (
          <span key={`${series.name}-${index}`} className="inline-flex items-center gap-2 text-xs text-lens-muted">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />{series.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function FlowChart({ spec }: { spec: DeepVisualizationSpec }) {
  if (!spec.nodes.length) return null;
  return (
    <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
      {spec.nodes.map((node, index) => {
        const outgoing = spec.edges.filter((edge) => edge.from === node.id);
        return (
          <div key={node.id} className="relative rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
            <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-lens-primary text-xs font-bold text-white">{index + 1}</span><h4 className="text-sm font-semibold text-lens-ink">{node.label}</h4></div>
            <p className="mt-3 text-sm leading-6 text-lens-muted">{node.description}</p>
            {outgoing.map((edge) => <div key={`${edge.from}-${edge.to}-${edge.label}`} className="mt-3 flex items-center gap-2 text-xs font-semibold text-lens-primary"><ArrowRight size={14} />{edge.label || edge.to}</div>)}
          </div>
        );
      })}
    </div>
  );
}

export function DeepVisualization({ spec, language }: { spec: DeepVisualizationSpec; language: "en" | "zh" }) {
  if (spec.kind === "none") return null;
  return (
    <section className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-lens-primary dark:bg-indigo-500/15">{spec.kind === "flow" ? <Network size={18} /> : <Activity size={18} />}</div>
        <div><h3 className="text-base font-semibold text-lens-ink">{spec.title}</h3><p className="mt-1 text-sm leading-6 text-lens-muted">{spec.description}</p></div>
      </div>
      <div className="mt-4">{spec.kind === "flow" ? <FlowChart spec={spec} /> : <NumericChart spec={spec} />}</div>
      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-200">
        {spec.disclaimer || (language === "zh" ? "图表用于辅助理解，不替代论文中的精确实验或推导。" : "The visualization supports interpretation and does not replace the paper's exact derivation or experiments.")}
      </p>
    </section>
  );
}
