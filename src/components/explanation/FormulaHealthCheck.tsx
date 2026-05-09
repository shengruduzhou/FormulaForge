import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { FormulaSyntaxReport } from "../../schemas/formula";

export function FormulaHealthCheck({ report }: { report: FormulaSyntaxReport }) {
  return (
    <div className="grid gap-2">
      {report.issues.map((issue, index) => {
        const Icon = issue.severity === "error" ? AlertCircle : issue.severity === "warning" ? Info : CheckCircle2;
        const color =
          issue.severity === "error"
            ? "text-lens-danger"
            : issue.severity === "warning"
              ? "text-lens-warning"
              : "text-lens-success";

        return (
          <div key={`${issue.message}-${index}`} className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
            <div className="flex items-start gap-2">
              <Icon className={color} size={17} />
              <div>
                <p className="text-sm font-semibold text-lens-ink">{issue.message}</p>
                {issue.suggestion && <p className="mt-1 text-sm text-lens-muted">{issue.suggestion}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
