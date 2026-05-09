import { useMemo, useState } from "react";
import { demoLoss, gradientDescentPath } from "../../features/visualization/math";
import { Slider } from "../ui/Slider";

function toSvgX(x: number) {
  return 170 + x * 34;
}

function toSvgY(y: number) {
  return 170 - y * 34;
}

export function GradientDescentViz() {
  const [learningRate, setLearningRate] = useState(0.15);
  const [initialX, setInitialX] = useState(2.8);
  const [initialY, setInitialY] = useState(2.2);
  const path = useMemo(
    () => gradientDescentPath({ x: initialX, y: initialY }, learningRate, 14),
    [initialX, initialY, learningRate],
  );
  const finalLoss = demoLoss(path[path.length - 1]);
  const diverging = path.some((point) => Math.abs(point.x) > 8 || Math.abs(point.y) > 8);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid content-start gap-4">
        <Slider label="Learning rate eta" value={learningRate} min={0.01} max={0.8} step={0.01} onChange={setLearningRate} />
        <Slider label="Initial x" value={initialX} min={-4} max={4} step={0.1} onChange={setInitialX} />
        <Slider label="Initial y" value={initialY} min={-4} max={4} step={0.1} onChange={setInitialY} />
        <div
          className={`rounded-lg border p-4 ${
            diverging
              ? "border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
              : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
          }`}
        >
          <p className="text-sm font-semibold">{diverging ? "Overshoot warning" : "Trajectory status"}</p>
          <p className="mt-1 text-sm leading-6">
            {diverging
              ? "This learning rate is large enough to make the demo path unstable."
              : `Final demo loss after 14 steps: ${finalLoss.toFixed(4)}`}
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
        <svg className="h-80 w-full" viewBox="0 0 340 340" role="img" aria-label="Gradient descent contour trajectory">
          {[130, 100, 70, 40].map((radius, index) => (
            <ellipse
              key={radius}
              cx="170"
              cy="170"
              rx={radius}
              ry={radius / 1.45}
              fill="none"
              stroke={index === 0 ? "#CBD5E1" : "#E2E8F0"}
              strokeWidth="1.5"
            />
          ))}
          <path d="M20 170 H320 M170 20 V320" stroke="#CBD5E1" strokeDasharray="4 7" />
          <polyline
            fill="none"
            points={path.map((point) => `${toSvgX(point.x)},${toSvgY(point.y)}`).join(" ")}
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {path.map((point, index) => (
            <circle
              key={`${point.x}-${point.y}-${index}`}
              cx={toSvgX(point.x)}
              cy={toSvgY(point.y)}
              r={index === 0 ? 6 : 4}
              fill={index === 0 ? "#06B6D4" : "#4F46E5"}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          <circle cx="170" cy="170" r="5" fill="#10B981" />
        </svg>
      </div>
    </div>
  );
}
