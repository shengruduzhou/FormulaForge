export function VennDiagramViz() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <svg viewBox="0 0 420 240" className="min-h-64 w-full rounded-lg border border-lens-line bg-slate-50 dark:bg-slate-900">
        <circle cx="175" cy="120" r="78" fill="#4F46E5" fillOpacity="0.24" stroke="#4F46E5" strokeWidth="3" />
        <circle cx="245" cy="120" r="78" fill="#06B6D4" fillOpacity="0.24" stroke="#06B6D4" strokeWidth="3" />
        <text x="132" y="118" className="fill-slate-800 text-lg font-bold dark:fill-slate-100">
          A
        </text>
        <text x="278" y="118" className="fill-slate-800 text-lg font-bold dark:fill-slate-100">
          B
        </text>
        <text x="198" y="126" className="fill-slate-800 text-sm font-semibold dark:fill-slate-100">
          A ∩ B
        </text>
        <text x="156" y="214" className="fill-slate-500 text-sm dark:fill-slate-300">
          |A ∪ B| = |A| + |B| - |A ∩ B|
        </text>
      </svg>
      <div className="grid content-center gap-3 rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <p className="text-sm font-semibold text-lens-ink">Why subtract the overlap?</p>
        <p className="text-sm leading-6 text-lens-muted">
          Adding |A| and |B| counts the middle region twice. Subtracting |A intersection B| once leaves every object counted exactly once.
        </p>
        <div className="grid gap-2 text-sm text-lens-muted">
          <span>A = left circle</span>
          <span>B = right circle</span>
          <span>A intersection B = shared middle</span>
        </div>
      </div>
    </div>
  );
}
