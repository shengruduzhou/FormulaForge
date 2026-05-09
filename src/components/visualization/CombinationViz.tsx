import { useMemo, useState } from "react";
import { Slider } from "../ui/Slider";

function factorial(value: number): number {
  if (value <= 1) return 1;
  return Array.from({ length: value }, (_, index) => index + 1).reduce((total, item) => total * item, 1);
}

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

export function CombinationViz() {
  const [n, setN] = useState(5);
  const [k, setK] = useState(2);
  const safeK = Math.min(k, n);
  const result = choose(n, safeK);
  const dots = useMemo(() => Array.from({ length: n }, (_, index) => index), [n]);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        <Slider label="n total items" value={n} min={1} max={10} step={1} onChange={setN} />
        <Slider label="k chosen items" value={safeK} min={0} max={n} step={1} onChange={setK} />
        <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-sm text-lens-muted">Number of unordered selections</p>
          <p className="mt-1 text-3xl font-bold text-lens-ink">{result}</p>
          <code className="mt-2 block text-sm text-lens-primary">
            C({n},{safeK}) = {n}! / ({safeK}!({n - safeK})!)
          </code>
        </div>
      </div>
      <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <p className="text-sm font-semibold text-lens-ink">Selection intuition</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {dots.map((dot) => (
            <span
              key={dot}
              className={`grid size-11 place-items-center rounded-full border text-sm font-bold ${
                dot < safeK
                  ? "border-lens-primary bg-indigo-50 text-lens-primary dark:bg-indigo-500/15"
                  : "border-lens-line bg-slate-50 text-lens-muted dark:bg-slate-900"
              }`}
            >
              {dot + 1}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-lens-muted">
          Highlighted dots represent one possible group. The formula counts every distinct group of {safeK} dots from {n}, ignoring order.
        </p>
      </div>
    </div>
  );
}
