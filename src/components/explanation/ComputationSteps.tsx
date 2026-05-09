import type { ComputationStep, ToyExample } from "../../schemas/formula";

export function ComputationSteps({ steps, toyExample }: { steps: ComputationStep[]; toyExample: ToyExample }) {
  return (
    <div className="grid gap-4">
      {steps.length > 0 && (
        <ol className="grid gap-3">
          {steps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-lens-primary dark:bg-indigo-500/15">
                {index + 1}
              </span>
              <div className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
                <p className="text-sm font-semibold text-lens-ink">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-lens-muted">{step.description}</p>
                {step.expression && <code className="mt-2 block text-xs text-lens-primary">{step.expression}</code>}
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <p className="text-sm font-semibold text-lens-ink">{toyExample.title}</p>
        <p className="mt-1 text-sm leading-6 text-lens-muted">{toyExample.description}</p>
        <ul className="mt-3 grid gap-1 text-sm text-lens-muted">
          {toyExample.steps.map((step) => (
            <li key={step}>- {step}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-semibold text-lens-ink">{toyExample.result}</p>
      </div>
    </div>
  );
}
