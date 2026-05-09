import { Download, FileJson, FileText } from "lucide-react";
import { exportMarkdown } from "../../features/export/exportMarkdown";
import { downloadAnalysisJson } from "../../features/export/exportJson";
import type { FormulaAnalysis } from "../../schemas/analysis";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";

export function ExportPanel({ analysis }: { analysis: FormulaAnalysis }) {
  async function copyMarkdown() {
    await navigator.clipboard.writeText(exportMarkdown(analysis));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="text-lens-primary" size={18} />
          <h2 className="text-base font-semibold text-lens-ink">Export</h2>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={copyMarkdown}>
          <FileText size={16} />
          Copy Markdown
        </Button>
        <Button variant="secondary" onClick={() => downloadAnalysisJson(analysis)}>
          <FileJson size={16} />
          Download JSON
        </Button>
      </CardBody>
    </Card>
  );
}
