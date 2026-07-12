import { Eraser, FlaskConical, Loader2, Play, Sparkles } from "lucide-react";
import { examples } from "../../features/examples/examples";
import { domainLabelsByLanguage, uiText, useI18nStore } from "../../i18n";
import type { DeepAnalysisStatus } from "../../schemas/deepAnalysis";
import type { Domain, FormulaInput } from "../../schemas/formula";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { FormulaTypeSelector } from "./FormulaTypeSelector";
import { ImageFormulaUploader } from "./ImageFormulaUploader";

interface FormulaInputPanelProps {
  value: FormulaInput;
  imagePreview?: string;
  deepStatus: DeepAnalysisStatus;
  deepError: string | null;
  onChange: (value: FormulaInput) => void;
  onAnalyze: () => void;
  onDeepAnalyze: () => void;
  onImage: (image: string, fileName: string) => void;
  onClearImage: () => void;
  onLoadExample: (id: string) => void;
  onClear: () => void;
}

const domains: Domain[] = ["ai_ml", "math_stats", "discrete_math", "physics", "engineering", "general"];

export function FormulaInputPanel({
  value,
  imagePreview,
  deepStatus,
  deepError,
  onChange,
  onAnalyze,
  onDeepAnalyze,
  onImage,
  onClearImage,
  onLoadExample,
  onClear,
}: FormulaInputPanelProps) {
  const language = useI18nStore((state) => state.language);
  const text = uiText[language];
  const domainLabels = domainLabelsByLanguage[language];
  const canAnalyze = Boolean(value.latex.trim() || imagePreview);
  const isDeepLoading = deepStatus === "loading";

  return (
    <Card className="h-fit overflow-hidden">
      <CardHeader className="border-b border-lens-line bg-gradient-to-br from-white to-indigo-50/70 dark:from-slate-950 dark:to-indigo-500/10">
        <div className="flex items-center gap-2">
          <FlaskConical className="text-lens-primary" size={18} />
          <h2 className="academic-title text-lg font-semibold text-lens-ink">{text.formulaInput}</h2>
        </div>
        <p className="mt-2 text-xs leading-5 text-lens-muted">
          {language === "zh"
            ? "本地解析用于快速预览；LLM 深度解释用于论文级参数、推导、假设和图表分析。"
            : "Local parsing provides instant preview; LLM analysis adds paper-level parameter, derivation, assumption, and chart explanations."}
        </p>
      </CardHeader>
      <CardBody className="grid gap-5">
        <ImageFormulaUploader
          imagePreview={imagePreview}
          onImage={onImage}
          onClearImage={onClearImage}
          onLatex={(latex) => onChange({ ...value, latex })}
        />

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink" htmlFor="latex">
            {text.latexFormula}
          </label>
          <Textarea
            id="latex"
            value={value.latex}
            onChange={(event) => onChange({ ...value, latex: event.target.value })}
            placeholder="p_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}"
          />
          <p className="text-xs leading-5 text-lens-muted">
            {language === "zh" ? "可直接粘贴 LaTeX、普通文本公式，或保留 OCR 结果后继续修正。" : "Paste LaTeX, a plain-text equation, or edit the OCR result before analysis."}
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink" htmlFor="context">
            {text.context}
          </label>
          <Textarea
            className="min-h-28 font-sans"
            id="context"
            value={value.context}
            onChange={(event) => onChange({ ...value, context: event.target.value })}
            placeholder={
              language === "zh"
                ? "粘贴公式前后的论文段落、符号定义、图注或任务背景。上下文越完整，参数解释越可靠。"
                : "Paste the surrounding paper paragraph, symbol definitions, caption, or task background. More context improves parameter interpretation."
            }
          />
        </div>

        <details className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
          <summary className="cursor-pointer text-sm font-semibold text-lens-ink">
            {language === "zh" ? "高级解析提示" : "Advanced parser hints"}
          </summary>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-lens-ink">{text.formulaType}</label>
              <FormulaTypeSelector value={value.selectedType} onChange={(selectedType) => onChange({ ...value, selectedType })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-lens-ink" htmlFor="domain">
                {text.domain}
              </label>
              <select
                className="min-h-10 rounded-lg border border-lens-line bg-white px-3 text-sm font-medium text-lens-ink outline-none focus:border-lens-primary focus:ring-2 focus:ring-indigo-100 dark:bg-slate-950"
                id="domain"
                value={value.domain}
                onChange={(event) => onChange({ ...value, domain: event.target.value as Domain })}
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domainLabels[domain]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>

        <div className="grid gap-2">
          <Button onClick={onDeepAnalyze} disabled={!canAnalyze || isDeepLoading}>
            {isDeepLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isDeepLoading
              ? language === "zh"
                ? "正在深度解释..."
                : "Building deep explanation..."
              : language === "zh"
                ? "LLM 深度解释"
                : "Deep LLM explanation"}
          </Button>
          <Button variant="secondary" onClick={onAnalyze} disabled={!value.latex.trim()}>
            <Play size={16} />
            {language === "zh" ? "仅运行本地解析" : "Run local parser only"}
          </Button>
          {deepError && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {deepError}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <select
              className="min-h-10 rounded-lg border border-lens-line bg-white px-3 text-sm font-semibold text-lens-muted outline-none focus:border-lens-primary dark:bg-slate-950"
              onChange={(event) => event.target.value && onLoadExample(event.target.value)}
              value=""
              aria-label="Load example"
            >
              <option value="">{text.loadExample}</option>
              {examples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.title}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={onClear}>
              <Eraser size={16} />
              {text.clear}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
