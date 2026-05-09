import { Eraser, FlaskConical, Play } from "lucide-react";
import { examples } from "../../features/examples/examples";
import { domainLabelsByLanguage, uiText, useI18nStore } from "../../i18n";
import type { Domain, FormulaInput } from "../../schemas/formula";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { FormulaTypeSelector } from "./FormulaTypeSelector";
import { ImageFormulaUploader } from "./ImageFormulaUploader";

interface FormulaInputPanelProps {
  value: FormulaInput;
  onChange: (value: FormulaInput) => void;
  onAnalyze: () => void;
  onLoadExample: (id: string) => void;
  onClear: () => void;
}

const domains: Domain[] = ["ai_ml", "math_stats", "discrete_math", "physics", "engineering", "general"];

export function FormulaInputPanel({ value, onChange, onAnalyze, onLoadExample, onClear }: FormulaInputPanelProps) {
  const language = useI18nStore((state) => state.language);
  const text = uiText[language];
  const domainLabels = domainLabelsByLanguage[language];

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FlaskConical className="text-lens-primary" size={18} />
          <h2 className="text-base font-semibold text-lens-ink">{text.formulaInput}</h2>
        </div>
      </CardHeader>
      <CardBody className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink">{text.formulaType}</label>
          <FormulaTypeSelector value={value.selectedType} onChange={(selectedType) => onChange({ ...value, selectedType })} />
        </div>
        <ImageFormulaUploader onLatex={(latex) => onChange({ ...value, latex })} />
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink" htmlFor="latex">
            {text.latexFormula}
          </label>
          <Textarea
            id="latex"
            value={value.latex}
            onChange={(event) => onChange({ ...value, latex: event.target.value })}
            placeholder="p_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink" htmlFor="context">
            {text.context}
          </label>
          <Textarea
            className="min-h-20 font-sans"
            id="context"
            value={value.context}
            onChange={(event) => onChange({ ...value, context: event.target.value })}
            placeholder="This appears in a paper as a loss function..."
          />
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
          <p className="text-xs text-lens-muted">{text.autoAnalyze}</p>
        </div>
        <div className="grid gap-2">
          <Button onClick={onAnalyze} disabled={!value.latex.trim()}>
            <Play size={16} />
            {text.analyzeFormula}
          </Button>
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
