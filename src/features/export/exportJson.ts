import type { FormulaAnalysis } from "../../schemas/analysis";

export function downloadAnalysisJson(analysis: FormulaAnalysis): void {
  const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${analysis.id || "formula-analysis"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
