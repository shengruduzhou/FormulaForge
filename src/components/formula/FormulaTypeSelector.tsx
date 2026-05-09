import type { FormulaType } from "../../schemas/formula";
import { formulaTypeLabelsByLanguage, useI18nStore } from "../../i18n";

const options: Array<FormulaType | "auto"> = [
  "auto",
  "weighted_loss",
  "softmax",
  "sigmoid",
  "gradient_descent",
  "cross_entropy",
  "bayes_rule",
  "combination",
  "permutation",
  "set_identity",
  "graph_degree",
  "logic_quantifier",
  "recurrence_relation",
];

interface FormulaTypeSelectorProps {
  value: FormulaType | "auto";
  onChange: (value: FormulaType | "auto") => void;
}

export function FormulaTypeSelector({ value, onChange }: FormulaTypeSelectorProps) {
  const language = useI18nStore((state) => state.language);
  const labels = formulaTypeLabelsByLanguage[language];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`min-h-10 rounded-lg border px-3 text-left text-sm font-semibold transition ${
            value === option
              ? "border-lens-primary bg-indigo-50 text-lens-primary dark:bg-indigo-500/15"
              : "border-lens-line bg-white text-lens-muted hover:border-slate-300 hover:text-lens-ink dark:bg-slate-950 dark:hover:border-slate-600"
          }`}
          onClick={() => onChange(option)}
          type="button"
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
