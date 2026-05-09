const nodes = [
  { id: "A", x: 70, y: 80, degree: 2 },
  { id: "B", x: 190, y: 52, degree: 3 },
  { id: "C", x: 315, y: 92, degree: 2 },
  { id: "D", x: 136, y: 178, degree: 2 },
  { id: "E", x: 272, y: 185, degree: 1 },
];

const edges = [
  ["A", "B"],
  ["A", "D"],
  ["B", "C"],
  ["B", "D"],
  ["C", "E"],
];

function findNode(id: string) {
  const node = nodes.find((item) => item.id === id);
  if (!node) throw new Error(`Missing node ${id}`);
  return node;
}

export function GraphDegreeViz() {
  const degreeSum = nodes.reduce((total, node) => total + node.degree, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <svg viewBox="0 0 390 250" className="min-h-64 w-full rounded-lg border border-lens-line bg-slate-50 dark:bg-slate-900">
        {edges.map(([from, to]) => {
          const start = findNode(from);
          const end = findNode(to);
          return <line key={`${from}-${to}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#94A3B8" strokeWidth="3" />;
        })}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="24" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" className="dark:fill-slate-950" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-slate-900 text-sm font-bold dark:fill-slate-100">
              {node.id}
            </text>
            <text x={node.x} y={node.y + 41} textAnchor="middle" className="fill-slate-500 text-xs dark:fill-slate-300">
              deg={node.degree}
            </text>
          </g>
        ))}
      </svg>
      <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
        <p className="text-sm font-semibold text-lens-ink">Handshaking lemma</p>
        <p className="mt-2 text-sm leading-6 text-lens-muted">
          Each edge touches two endpoints, so it contributes two counts to the sum of degrees.
        </p>
        <div className="mt-4 grid gap-2 text-sm text-lens-muted">
          <span>Edges: |E| = {edges.length}</span>
          <span>Degree sum: {degreeSum}</span>
          <span>2|E| = {2 * edges.length}</span>
        </div>
      </div>
    </div>
  );
}
