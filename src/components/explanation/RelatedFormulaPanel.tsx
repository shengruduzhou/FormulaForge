import type { PrerequisiteConcept, RelatedFormula } from "../../schemas/formula";

export function RelatedFormulaPanel({
  relatedFormulas,
  prerequisites,
}: {
  relatedFormulas: RelatedFormula[];
  prerequisites: PrerequisiteConcept[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-lens-ink">Learning path</h3>
        <div className="mt-3 grid gap-2">
          {prerequisites.length === 0 && <p className="text-sm text-lens-muted">No prerequisite graph is available yet.</p>}
          {prerequisites.map((item) => (
            <div key={item.title} className="rounded-md bg-white p-3 dark:bg-slate-950">
              <p className="text-sm font-semibold text-lens-ink">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-lens-primary">{item.level.replace("_", " ")}</p>
              <p className="mt-1 text-sm text-lens-muted">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-lens-ink">Related formulas</h3>
        <div className="mt-3 grid gap-2">
          {relatedFormulas.length === 0 && <p className="text-sm text-lens-muted">No related formulas are available yet.</p>}
          {relatedFormulas.map((formula) => (
            <div key={formula.id} className="rounded-md bg-white p-3 dark:bg-slate-950">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-lens-ink">{formula.title}</p>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-lens-primary dark:bg-indigo-500/15">
                  {formula.relation.replace("_", " ")}
                </span>
              </div>
              <code className="mt-2 block text-xs text-lens-primary">{formula.latex}</code>
              <p className="mt-2 text-sm text-lens-muted">{formula.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
