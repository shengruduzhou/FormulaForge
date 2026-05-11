import { useMemo, useState } from "react";
import type { VisualizationKind } from "../../schemas/visualization";
import { Slider } from "../ui/Slider";

function positiveModulo(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function barWidth(value: number, max = 1): string {
  return `${Math.max(4, Math.min(100, Math.abs(value / max) * 100))}%`;
}

function MiniBar({ label, value, color = "bg-lens-primary", max = 1 }: { label: string; value: number; color?: string; max?: number }) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-lens-muted">
        <span>{label}</span>
        <span className="font-mono text-lens-ink">{value.toFixed(3)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: barWidth(value, max) }} />
      </div>
    </div>
  );
}

function AttentionMatrixViz() {
  const [gap, setGap] = useState(2);
  const [dimension, setDimension] = useState(64);
  const scale = Math.sqrt(dimension);
  const scores = [gap, 1, 0].map((value) => value / Math.max(1, scale / 4));
  const max = Math.max(...scores);
  const exps = scores.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  const weights = exps.map((value) => value / total);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        <Slider label="query-key score gap" value={gap} min={0} max={6} step={0.1} onChange={setGap} />
        <Slider label="key dimension d_k" value={dimension} min={8} max={256} step={8} onChange={setDimension} />
        <p className="rounded-lg border border-lens-line bg-slate-50 p-3 text-sm leading-6 text-lens-muted dark:bg-slate-900">
          Scaling by sqrt(d_k) keeps the softmax from becoming too sharp when vector dimension grows.
        </p>
      </div>
      <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <p className="text-sm font-semibold text-lens-ink">attention row after scaling</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {weights.map((weight, index) => (
            <div key={index} className="grid aspect-square place-items-center rounded-lg border border-lens-line bg-indigo-50 text-center dark:bg-indigo-500/10">
              <div>
                <p className="text-xs font-semibold text-lens-muted">key {index + 1}</p>
                <p className="mt-1 text-xl font-bold text-lens-primary">{Math.round(weight * 100)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NormalizationVectorViz() {
  const [spread, setSpread] = useState(1.2);
  const [epsilon, setEpsilon] = useState(0.1);
  const raw = useMemo(() => [2 - spread, 2, 2 + spread], [spread]);
  const mean = raw.reduce((sum, value) => sum + value, 0) / raw.length;
  const variance = raw.reduce((sum, value) => sum + (value - mean) ** 2, 0) / raw.length;
  const normalized = raw.map((value) => (value - mean) / Math.sqrt(variance + epsilon));

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        <Slider label="feature spread" value={spread} min={0} max={4} step={0.1} onChange={setSpread} />
        <Slider label="epsilon" value={epsilon} min={0.01} max={1} step={0.01} onChange={setEpsilon} />
      </div>
      <div className="grid gap-4 rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <div>
          <p className="text-sm font-semibold text-lens-ink">raw activations</p>
          <div className="mt-3 grid gap-2">
            {raw.map((value, index) => (
              <MiniBar key={`raw-${index}`} label={`x${index + 1}`} value={value} max={6} color="bg-lens-cyan" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-lens-ink">normalized vector</p>
          <div className="mt-3 grid gap-2">
            {normalized.map((value, index) => (
              <MiniBar key={`norm-${index}`} label={`z${index + 1}`} value={value} max={2} color="bg-lens-primary" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdamMomentsViz() {
  const [learningRate, setLearningRate] = useState(0.01);
  const [gradient, setGradient] = useState(0.8);
  const m = 0.9 * 0.4 + 0.1 * gradient;
  const v = 0.999 * 0.25 + 0.001 * gradient * gradient;
  const mHat = m / (1 - 0.9 ** 5);
  const vHat = v / (1 - 0.999 ** 5);
  const step = learningRate * (mHat / (Math.sqrt(vHat) + 0.000001));

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        <Slider label="learning rate eta" value={learningRate} min={0.001} max={0.05} step={0.001} onChange={setLearningRate} />
        <Slider label="current gradient" value={gradient} min={-2} max={2} step={0.1} onChange={setGradient} />
      </div>
      <div className="grid gap-3 rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <MiniBar label="gradient g_t" value={gradient} max={2} color="bg-lens-warning" />
        <MiniBar label="first moment m_hat" value={mHat} max={2} color="bg-lens-primary" />
        <MiniBar label="second moment v_hat" value={vHat} max={80} color="bg-lens-cyan" />
        <MiniBar label="adaptive step" value={step} max={0.05} color="bg-lens-success" />
      </div>
    </div>
  );
}

function PigeonholeGridViz() {
  const [objects, setObjects] = useState(11);
  const [boxes, setBoxes] = useState(10);
  const safeBoxes = Math.max(1, boxes);
  const guarantee = Math.ceil(objects / safeBoxes);
  const counts = Array.from({ length: safeBoxes }, (_, index) => Math.floor(objects / safeBoxes) + (index < objects % safeBoxes ? 1 : 0));

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-4">
        <Slider label="objects n" value={objects} min={1} max={40} step={1} onChange={setObjects} />
        <Slider label="boxes m" value={safeBoxes} min={1} max={20} step={1} onChange={setBoxes} />
        <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-sm text-lens-muted">guaranteed crowding</p>
          <p className="mt-1 text-3xl font-bold text-lens-ink">{guarantee}</p>
          <code className="text-sm text-lens-primary">ceil({objects}/{safeBoxes})</code>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        {counts.map((count, index) => (
          <div key={index} className={`rounded-lg border p-2 text-center ${count >= guarantee ? "border-lens-primary bg-indigo-50 dark:bg-indigo-500/10" : "border-lens-line bg-slate-50 dark:bg-slate-900"}`}>
            <p className="text-xs font-semibold text-lens-muted">box {index + 1}</p>
            <p className="mt-1 text-lg font-bold text-lens-ink">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeMorganSetsViz() {
  const [mode, setMode] = useState<"union" | "intersection">("union");
  const rows = [
    { label: "in A only", a: true, b: false },
    { label: "in both", a: true, b: true },
    { label: "in B only", a: false, b: true },
    { label: "outside both", a: false, b: false },
  ];

  return (
    <div className="grid gap-4">
      <div className="inline-flex w-fit rounded-lg border border-lens-line bg-white p-1 dark:bg-slate-950">
        {(["union", "intersection"] as const).map((item) => (
          <button
            key={item}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${mode === item ? "bg-lens-primary text-white" : "text-lens-muted hover:bg-slate-50 hover:text-lens-ink dark:hover:bg-slate-900"}`}
            type="button"
            onClick={() => setMode(item)}
          >
            {item === "union" ? "not (A union B)" : "not (A intersect B)"}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        {rows.map((row) => {
          const highlighted = mode === "union" ? !row.a && !row.b : !(row.a && row.b);
          return (
            <div key={row.label} className={`rounded-lg border p-3 ${highlighted ? "border-lens-primary bg-indigo-50 dark:bg-indigo-500/10" : "border-lens-line bg-white dark:bg-slate-950"}`}>
              <p className="text-sm font-semibold text-lens-ink">{row.label}</p>
              <p className="mt-2 text-xs text-lens-muted">A={String(row.a)} / B={String(row.b)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModularClockViz() {
  const [a, setA] = useState(14);
  const [b, setB] = useState(2);
  const [modulus, setModulus] = useState(12);
  const safeModulus = Math.max(2, modulus);
  const ra = positiveModulo(a, safeModulus);
  const rb = positiveModulo(b, safeModulus);
  const congruent = ra === rb;
  const ticks = Array.from({ length: safeModulus }, (_, index) => index);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        <Slider label="a" value={a} min={-50} max={50} step={1} onChange={setA} />
        <Slider label="b" value={b} min={-50} max={50} step={1} onChange={setB} />
        <Slider label="modulus n" value={safeModulus} min={2} max={24} step={1} onChange={setModulus} />
      </div>
      <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <svg viewBox="0 0 240 240" className="mx-auto size-60" role="img" aria-label="Modular clock">
          <circle cx="120" cy="120" r="86" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          {ticks.map((tick) => {
            const angle = (tick / safeModulus) * Math.PI * 2 - Math.PI / 2;
            const x = 120 + Math.cos(angle) * 86;
            const y = 120 + Math.sin(angle) * 86;
            const isA = tick === ra;
            const isB = tick === rb;
            return (
              <g key={tick}>
                <circle cx={x} cy={y} r={isA || isB ? 10 : 4} fill={isA && isB ? "#10B981" : isA ? "#4F46E5" : isB ? "#06B6D4" : "#94A3B8"} />
                <text x={x} y={y + 24} textAnchor="middle" fontSize="9" fill="#64748B">
                  {tick}
                </text>
              </g>
            );
          })}
          <text x="120" y="116" textAnchor="middle" fontSize="13" fill="#0F172A" fontWeight="700">
            {congruent ? "same remainder" : "different"}
          </text>
          <text x="120" y="134" textAnchor="middle" fontSize="11" fill="#64748B">
            {ra} vs {rb}
          </text>
        </svg>
        <p className="text-center text-sm font-semibold text-lens-ink">
          {a} {congruent ? "is congruent to" : "is not congruent to"} {b} mod {safeModulus}
        </p>
      </div>
    </div>
  );
}

export function ConceptViz({ kind }: { kind: VisualizationKind }) {
  if (kind === "attention_matrix") return <AttentionMatrixViz />;
  if (kind === "normalization_vector") return <NormalizationVectorViz />;
  if (kind === "optimizer_moments") return <AdamMomentsViz />;
  if (kind === "pigeonhole_grid") return <PigeonholeGridViz />;
  if (kind === "de_morgan_sets") return <DeMorganSetsViz />;
  if (kind === "modular_clock") return <ModularClockViz />;
  return null;
}
