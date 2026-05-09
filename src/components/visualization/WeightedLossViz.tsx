import { useMemo, useState } from "react";
import { useI18nStore, weightedLossVizText } from "../../i18n";
import { Slider } from "../ui/Slider";

const labels = ["Lrec", "Ladv", "Lperceptual"];
const zhLabels = ["重建损失 Lrec", "对抗损失 Ladv", "感知损失 Lperceptual"];
const colors = ["#4F46E5", "#06B6D4", "#10B981"];

export function WeightedLossViz() {
  const language = useI18nStore((state) => state.language);
  const text = weightedLossVizText[language];
  const displayLabels = language === "zh" ? zhLabels : labels;
  const [lambdas, setLambdas] = useState([1, 0.8, 0.5]);
  const [losses, setLosses] = useState([1.6, 1.1, 0.9]);
  const contributions = useMemo(() => lambdas.map((lambda, index) => lambda * losses[index]), [lambdas, losses]);
  const total = contributions.reduce((sum, value) => sum + value, 0);
  const maxContribution = Math.max(...contributions, 1);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        {lambdas.map((lambda, index) => (
          <Slider
            key={`lambda-${labels[index]}`}
            label={text.lambdaLabel(index, displayLabels[index])}
            value={lambda}
            min={0}
            max={3}
            step={0.1}
            onChange={(value) => setLambdas((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)))}
          />
        ))}
        <div className="grid gap-3 border-t border-lens-line pt-4">
          {losses.map((loss, index) => (
            <Slider
              key={`loss-${labels[index]}`}
              label={text.lossLabel(displayLabels[index])}
              value={loss}
              min={0}
              max={5}
              step={0.1}
              onChange={(value) => setLosses((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)))}
            />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-lens-ink">{text.contributionBar}</h3>
            <p className="mt-1 text-sm text-lens-muted">{text.contributionHint}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">{text.totalLoss}</p>
            <p className="font-mono text-2xl font-semibold text-lens-ink">{total.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {contributions.map((value, index) => (
            <div key={labels[index]} className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-lens-ink">{displayLabels[index]}</span>
                <span className="font-mono text-lens-muted">{value.toFixed(2)}</span>
              </div>
              <div className="h-9 overflow-hidden rounded-lg bg-white dark:bg-slate-950">
                <div
                  className="flex h-full items-center justify-end px-2 text-xs font-semibold text-white transition-all"
                  style={{ width: `${Math.max(4, (value / maxContribution) * 100)}%`, backgroundColor: colors[index] }}
                >
                  lambda{index + 1}L{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
        <svg className="mt-6 h-28 w-full" viewBox="0 0 360 120" role="img" aria-label={text.ariaLabel}>
          <path d="M20 95 H340" stroke="#CBD5E1" />
          <path d="M20 15 V95" stroke="#CBD5E1" />
          <polyline
            fill="none"
            points={Array.from({ length: 18 }, (_, i) => {
              const lambda = (i / 17) * 3;
              const simulatedTotal = lambda * losses[0] + contributions[1] + contributions[2];
              const x = 20 + i * 18.8;
              const y = 95 - Math.min(80, simulatedTotal * 12);
              return `${x},${y}`;
            }).join(" ")}
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
