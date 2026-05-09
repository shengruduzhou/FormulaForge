export function ProbabilityTreeViz() {
  const branches = [
    { label: "A", value: "P(A)", x: 135, y: 44 },
    { label: "not A", value: "P(not A)", x: 135, y: 116 },
    { label: "B | A", value: "P(B|A)", x: 290, y: 28 },
    { label: "B | not A", value: "P(B|not A)", x: 290, y: 132 },
  ];

  return (
    <svg className="h-56 w-full rounded-lg border border-lens-line bg-slate-50 dark:bg-slate-900" viewBox="0 0 420 210" role="img" aria-label="Probability tree">
      <circle cx="45" cy="100" r="16" fill="#4F46E5" />
      <text x="45" y="105" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">
        start
      </text>
      <path d="M62 96 L116 48" stroke="#64748B" strokeWidth="2" />
      <path d="M62 104 L116 118" stroke="#64748B" strokeWidth="2" />
      <path d="M154 44 L268 28" stroke="#64748B" strokeWidth="2" />
      <path d="M154 116 L268 132" stroke="#64748B" strokeWidth="2" />
      {branches.map((branch) => (
        <g key={branch.label}>
          <rect x={branch.x - 46} y={branch.y - 18} width="92" height="36" rx="8" fill="white" stroke="#CBD5E1" />
          <text x={branch.x} y={branch.y - 2} textAnchor="middle" fontSize="12" fill="#0F172A" fontWeight="700">
            {branch.label}
          </text>
          <text x={branch.x} y={branch.y + 12} textAnchor="middle" fontSize="10" fill="#64748B">
            {branch.value}
          </text>
        </g>
      ))}
      <text x="210" y="192" textAnchor="middle" fontSize="12" fill="#475569">
        Posterior = likelihood x prior / evidence
      </text>
    </svg>
  );
}
