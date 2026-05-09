import type { BoundaryCase } from "../../schemas/formula";

export function BoundaryCases({ cases }: { cases: BoundaryCase[] }) {
  if (!cases.length) {
    return <p className="text-sm text-lens-muted">No boundary cases available yet.</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cases.map((item) => (
        <div key={item.title} className="rounded-lg border border-lens-line bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-lens-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-lens-muted">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
