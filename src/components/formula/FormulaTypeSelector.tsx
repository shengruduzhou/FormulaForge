import type { FormulaType } from "../../schemas/formula";
import { formulaTypeLabels } from "../../features/examples/examples";

const options: Array<FormulaType | "auto"> = ["auto", "weighted_loss", "softmax", "sigmoid", "gradient_descent"];

interface FormulaTypeSelectorProps {
  value: FormulaType | "auto";
  onChange: (value: FormulaType | "auto") => void;
}

export function FormulaTypeSelector({ value, onChange }: FormulaTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`min-h-10 rounded-lg border px-3 text-left text-sm font-semibold transition ${
            value === option
              ? "border-lens-primary bg-indigo-50 text-lens-primary"
              : "border-lens-line bg-white text-lens-muted hover:border-slate-300 hover:text-lens-ink"
          }`}
          onClick={() => onChange(option)}
          type="button"
        >
          {formulaTypeLabels[option]}
        </button>
      ))}
    </div>
  );
}
