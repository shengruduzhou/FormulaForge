import { useMemo, useState } from "react";
import { softmax } from "../../features/visualization/math";
import { Slider } from "../ui/Slider";

const colors = ["#4F46E5", "#06B6D4", "#10B981"];

export function SoftmaxViz() {
  const [logits, setLogits] = useState([2, 0.6, -1]);
  const [temperature, setTemperature] = useState(1);
  const probabilities = useMemo(() => softmax(logits, temperature), [logits, temperature]);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        {logits.map((logit, index) => (
          <Slider
            key={`logit-${index}`}
            label={`z${index + 1} logit`}
            value={logit}
            min={-5}
            max={5}
            step={0.1}
            onChange={(value) => setLogits((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)))}
          />
        ))}
        <Slider label="Temperature T" value={temperature} min={0.1} max={5} step={0.1} onChange={setTemperature} />
      </div>
      <div className="rounded-lg border border-lens-line bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-lens-ink">Probability Distribution</h3>
            <p className="mt-1 text-sm text-lens-muted">
              Sum: {probabilities.reduce((sum, value) => sum + value, 0).toFixed(4)}
            </p>
          </div>
          <p className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-lens-muted">
            {temperature < 0.7 ? "sharp" : temperature > 2.5 ? "smooth" : "balanced"}
          </p>
        </div>
        <div className="mt-6 grid h-64 grid-cols-3 items-end gap-4 border-b border-lens-line px-2">
          {probabilities.map((probability, index) => (
            <div key={`prob-${index}`} className="flex h-full flex-col items-center justify-end gap-2">
              <span className="font-mono text-xs font-semibold text-lens-ink">{(probability * 100).toFixed(1)}%</span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{ height: `${Math.max(4, probability * 100)}%`, backgroundColor: colors[index] }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4 px-2 text-center text-sm font-semibold text-lens-muted">
          {logits.map((logit, index) => (
            <span key={`label-${index}`}>z{index + 1}={logit.toFixed(1)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
