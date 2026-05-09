export function PitfallsCard({ pitfalls }: { pitfalls: string[] }) {
  if (!pitfalls.length) {
    return <p className="text-sm text-lens-muted">No pitfalls available yet.</p>;
  }

  return (
    <ul className="grid gap-3">
      {pitfalls.map((pitfall) => (
        <li key={pitfall} className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lens-warning" />
          <span>{pitfall}</span>
        </li>
      ))}
    </ul>
  );
}
