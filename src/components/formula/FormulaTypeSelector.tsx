import type { FormulaType } from "../../schemas/formula";
import { formulaTypeLabelsByLanguage, useI18nStore } from "../../i18n";

const options: Array<FormulaType | "auto"> = [
  "auto",
  "weighted_loss",
  "softmax",
  "sigmoid",
  "gradient_descent",
  "scaled_dot_product_attention",
  "layer_norm",
  "adam_optimizer",
  "cross_entropy",
  "bayes_rule",
  "combination",
  "permutation",
  "set_identity",
  "graph_degree",
  "logic_quantifier",
  "recurrence_relation",
  "pigeonhole_principle",
  "de_morgan_law",
  "modular_congruence",
];

interface FormulaTypeSelectorProps {
  value: FormulaType | "auto";
  onChange: (value: FormulaType | "auto") => void;
}

export function FormulaTypeSelector({ value, onChange }: FormulaTypeSelectorProps) {
  const language = useI18nStore((state) => state.language);
  const labels = formulaTypeLabelsByLanguage[language];

  return (
    <div className="formula-scroll grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
      {options.map((option) => (
        <button
          key={option}
          className={`min-h-10 cursor-pointer rounded-lg border px-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-lens-primary focus:ring-offset-2 ${
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
