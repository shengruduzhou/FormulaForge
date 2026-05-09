import type { VariableExplanation } from "../../schemas/formula";

export function VariableTable({ variables }: { variables: VariableExplanation[] }) {
  if (!variables.length) {
    return <p className="text-sm text-lens-muted">No variables extracted for this formula type yet.</p>;
  }

  return (
    <div className="formula-scroll overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-lens-line text-xs uppercase tracking-wide text-lens-muted">
            <th className="py-3 pr-4 font-semibold">Symbol</th>
            <th className="py-3 pr-4 font-semibold">Role</th>
            <th className="py-3 pr-4 font-semibold">Meaning</th>
            <th className="py-3 font-semibold">Adjustable</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable) => (
            <tr key={`${variable.symbol}-${variable.role}`} className="border-b border-slate-100 last:border-0">
              <td className="py-3 pr-4 font-mono text-lens-ink">{variable.symbol}</td>
              <td className="py-3 pr-4 font-medium text-lens-ink">{variable.role}</td>
              <td className="py-3 pr-4 text-lens-muted">{variable.meaning}</td>
              <td className="py-3 text-lens-muted">{variable.adjustable ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
