export function TruthTableViz() {
  const rows = [
    { p: "T", q: "T", implication: "T", note: "promise kept" },
    { p: "T", q: "F", implication: "F", note: "only failing case" },
    { p: "F", q: "T", implication: "T", note: "vacuously true" },
    { p: "F", q: "F", implication: "T", note: "vacuously true" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-lens-line text-left text-xs uppercase tracking-wide text-lens-muted">
            <th className="py-2 pr-4">p</th>
            <th className="py-2 pr-4">q</th>
            <th className="py-2 pr-4">p {"->"} q</th>
            <th className="py-2">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.p}-${row.q}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
              <td className="py-3 pr-4 font-mono text-lens-ink">{row.p}</td>
              <td className="py-3 pr-4 font-mono text-lens-ink">{row.q}</td>
              <td className="py-3 pr-4 font-semibold text-lens-primary">{row.implication}</td>
              <td className="py-3 text-lens-muted">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
