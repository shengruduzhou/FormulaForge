import { Copy } from "lucide-react";
import katex from "katex";
import { formulaTypeLabelsByLanguage, uiText, useI18nStore } from "../../i18n";
import type { FormulaAnalysis } from "../../schemas/analysis";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";

interface FormulaPreviewProps {
  analysis: FormulaAnalysis;
}

export function FormulaPreview({ analysis }: FormulaPreviewProps) {
  const language = useI18nStore((state) => state.language);
  const text = uiText[language];
  const labels = formulaTypeLabelsByLanguage[language];
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
          <h2 className="text-base font-semibold text-lens-ink">{language === "zh" ? "公式预览" : "Formula Preview"}</h2>
          <p className="mt-1 text-sm text-lens-muted">
            {language === "zh" ? "使用 KaTeX 渲染，并在解析前做规范化处理。" : "Rendered with KaTeX and normalized before analysis."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{labels[analysis.detectedType]}</Badge>
          <Badge>{`${Math.round(analysis.confidence * 100)}% ${text.confidence}`}</Badge>
        </div>
      </CardHeader>
      <CardBody className="grid gap-4">
        <div className="formula-scroll overflow-x-auto rounded-lg border border-lens-line bg-slate-50 px-4 py-5 text-center dark:bg-slate-900">
          {error ? (
            <p className="text-sm text-lens-danger">{error}</p>
          ) : (
            <div className="min-w-max" dangerouslySetInnerHTML={{ __html: rendered }} />
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-lens-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-950">
          <code className="formula-scroll overflow-x-auto text-sm text-lens-muted">
            {analysis.renderedLatex || (language === "zh" ? "暂无 LaTeX 输入" : "No LaTeX input")}
          </code>
          <Button variant="secondary" onClick={() => navigator.clipboard.writeText(analysis.renderedLatex)}>
            <Copy size={16} />
            {language === "zh" ? "复制" : "Copy"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
