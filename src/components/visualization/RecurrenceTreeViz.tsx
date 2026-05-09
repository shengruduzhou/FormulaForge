const nodes = [
  { id: "a4", label: "a4", x: 200, y: 28 },
  { id: "a3", label: "a3", x: 132, y: 92 },
  { id: "a2r", label: "a2", x: 268, y: 92 },
  { id: "a2", label: "a2", x: 88, y: 156 },
  { id: "a1", label: "a1", x: 176, y: 156 },
  { id: "a1r", label: "a1", x: 244, y: 156 },
  { id: "a0", label: "a0", x: 324, y: 156 },
];

const edges = [
  ["a4", "a3"],
  ["a4", "a2r"],
  ["a3", "a2"],
  ["a3", "a1"],
  ["a2r", "a1r"],
  ["a2r", "a0"],
];

export function RecurrenceTreeViz() {
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <svg className="h-56 w-full rounded-lg border border-lens-line bg-slate-50 dark:bg-slate-900" viewBox="0 0 420 210" role="img" aria-label="Recurrence expansion tree">
      {edges.map(([from, to]) => {
        const a = byId.get(from)!;
        const b = byId.get(to)!;
        return <path key={`${from}-${to}`} d={`M${a.x} ${a.y + 18} L${b.x} ${b.y - 18}`} stroke="#94A3B8" strokeWidth="2" />;
      })}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="20" fill="#ECFEFF" stroke="#06B6D4" strokeWidth="2" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="13" fill="#0F172A" fontWeight="700">
            {node.label}
          </text>
        </g>
      ))}
      <text x="210" y="198" textAnchor="middle" fontSize="12" fill="#64748B">
        Example expansion for a_n = a_(n-1) + a_(n-2)
      </text>
    </svg>
  );
}
