import { Copy } from "lucide-react";
import katex from "katex";
import { formulaTypeLabels } from "../../features/examples/examples";
import type { FormulaAnalysis } from "../../schemas/analysis";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";

interface FormulaPreviewProps {
  analysis: FormulaAnalysis;
}

export function FormulaPreview({ analysis }: FormulaPreviewProps) {
  let rendered = "";
  let error = "";

  try {
    rendered = katex.renderToString(analysis.renderedLatex || "\\text{No formula yet}", {
      throwOnError: false,
      displayMode: true,
    });
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Unable to render formula.";
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-lens-ink">Formula Preview</h2>
          <p className="mt-1 text-sm text-lens-muted">Rendered with KaTeX and normalized before analysis.</p>
        </div>
        <Badge>{formulaTypeLabels[analysis.detectedType]}</Badge>
      </CardHeader>
      <CardBody className="grid gap-4">
        <div className="formula-scroll overflow-x-auto rounded-lg border border-lens-line bg-slate-50 px-4 py-5 text-center">
          {error ? (
            <p className="text-sm text-lens-danger">{error}</p>
          ) : (
            <div className="min-w-max" dangerouslySetInnerHTML={{ __html: rendered }} />
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-lens-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="formula-scroll overflow-x-auto text-sm text-lens-muted">{analysis.renderedLatex || "No LaTeX input"}</code>
          <Button variant="secondary" onClick={() => navigator.clipboard.writeText(analysis.renderedLatex)}>
            <Copy size={16} />
            Copy
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
