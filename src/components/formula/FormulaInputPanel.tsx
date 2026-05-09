import { Eraser, FlaskConical, Play } from "lucide-react";
import { examples } from "../../features/examples/examples";
import type { Domain, FormulaInput } from "../../schemas/formula";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { FormulaTypeSelector } from "./FormulaTypeSelector";

interface FormulaInputPanelProps {
  value: FormulaInput;
  onChange: (value: FormulaInput) => void;
  onAnalyze: () => void;
  onLoadExample: (id: string) => void;
  onClear: () => void;
}

const domains: Array<{ value: Domain; label: string }> = [
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "math_stats", label: "Math / Statistics" },
  { value: "physics", label: "Physics" },
  { value: "engineering", label: "Engineering" },
  { value: "general", label: "General" },
];

export function FormulaInputPanel({ value, onChange, onAnalyze, onLoadExample, onClear }: FormulaInputPanelProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FlaskConical className="text-lens-primary" size={18} />
          <h2 className="text-base font-semibold text-lens-ink">Formula Input</h2>
        </div>
      </CardHeader>
      <CardBody className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink">Formula Type</label>
          <FormulaTypeSelector value={value.selectedType} onChange={(selectedType) => onChange({ ...value, selectedType })} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-lens-ink" htmlFor="latex">
            LaTeX Formula
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
            Context
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
            Domain
          </label>
          <select
            className="min-h-10 rounded-lg border border-lens-line bg-white px-3 text-sm font-medium text-lens-ink outline-none focus:border-lens-primary focus:ring-2 focus:ring-indigo-100"
            id="domain"
            value={value.domain}
            onChange={(event) => onChange({ ...value, domain: event.target.value as Domain })}
          >
            {domains.map((domain) => (
              <option key={domain.value} value={domain.value}>
                {domain.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Button onClick={onAnalyze} disabled={!value.latex.trim()}>
            <Play size={16} />
            Analyze Formula
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <select
              className="min-h-10 rounded-lg border border-lens-line bg-white px-3 text-sm font-semibold text-lens-muted outline-none focus:border-lens-primary"
              onChange={(event) => event.target.value && onLoadExample(event.target.value)}
              value=""
              aria-label="Load example"
            >
              <option value="">Load Example</option>
              {examples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.title}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={onClear}>
              <Eraser size={16} />
              Clear
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
