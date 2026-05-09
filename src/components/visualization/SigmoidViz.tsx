import { useMemo, useState } from "react";
import { sigmoid } from "../../features/visualization/math";
import { Slider } from "../ui/Slider";

function mapX(x: number) {
  return 24 + ((x + 8) / 16) * 312;
}

function mapY(y: number) {
  return 180 - y * 150;
}

export function SigmoidViz() {
  const [x, setX] = useState(0);
  const y = sigmoid(x);
  const curve = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => {
        const value = -8 + (index / 89) * 16;
        return `${mapX(value)},${mapY(sigmoid(value))}`;
      }).join(" "),
    [],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="grid content-start gap-4">
        <Slider label="Input x" value={x} min={-8} max={8} step={0.1} onChange={setX} />
        <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">sigma(x)</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-lens-ink">{y.toFixed(4)}</p>
          <p className="mt-2 text-sm leading-6 text-lens-muted">
            {Math.abs(x) < 1 ? "The curve is highly sensitive near zero." : "The curve is starting to saturate."}
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
        <svg className="h-64 w-full" viewBox="0 0 360 220" role="img" aria-label="Sigmoid curve">
          <path d="M24 180 H336 M24 30 V180" stroke="#CBD5E1" />
          <path d="M24 105 H336" stroke="#E2E8F0" strokeDasharray="4 6" />
          <polyline fill="none" points={curve} stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={mapX(x)} cy={mapY(y)} r="7" fill="#06B6D4" stroke="white" strokeWidth="3" />
          <text x={mapX(x)} y={mapY(y) - 14} textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold dark:fill-slate-100">
            {y.toFixed(2)}
          </text>
        </svg>
      </div>
    </div>
  );
}
