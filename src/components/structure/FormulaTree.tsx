import type { FormulaStructureNode } from "../../schemas/formula";

export function FormulaTree({ node }: { node: FormulaStructureNode }) {
  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
        <div className="text-sm font-semibold text-lens-primary">{node.label}</div>
        {node.role && <div className="mt-1 text-xs font-medium text-indigo-500">{node.role}</div>}
      </div>
      {!!node.children?.length && (
        <div className="grid gap-3 border-l-2 border-slate-200 pl-4">
          {node.children.map((child) => (
            <div key={child.id} className="relative rounded-lg border border-lens-line bg-white p-3">
              <span className="absolute -left-[18px] top-1/2 h-px w-4 bg-slate-200" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-lens-ink">{child.label}</span>
                {child.latex && <code className="font-mono text-xs text-lens-muted">{child.latex}</code>}
              </div>
              {child.role && <p className="mt-1 text-sm text-lens-muted">{child.role}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
