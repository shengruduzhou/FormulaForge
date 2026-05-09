import { create } from "zustand";
import type { FormulaAnalysis } from "../schemas/analysis";
import type { FormulaInput } from "../schemas/formula";
import { analyzeFormula } from "../features/analyzer/analyzeFormula";
import { examples } from "../features/examples/examples";

const defaultInput: FormulaInput = {
  id: "manual-formula",
  latex: examples[0].latex,
  context: examples[0].context,
  domain: "ai_ml",
  selectedType: "auto",
};

interface WorkspaceState {
  input: FormulaInput;
  analysis: FormulaAnalysis;
  setInput: (input: FormulaInput) => void;
  analyze: () => void;
  loadExample: (id: string) => void;
  clear: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  input: defaultInput,
  analysis: analyzeFormula(defaultInput),
  setInput: (input) => set({ input }),
  analyze: () => set({ analysis: analyzeFormula(get().input) }),
  loadExample: (id) => {
    const example = examples.find((item) => item.id === id) ?? examples[0];
    const input = {
      id: example.id,
      latex: example.latex,
      context: example.context,
      domain: example.domain,
      selectedType: example.selectedType,
    };
    set({ input, analysis: analyzeFormula(input) });
  },
  clear: () => {
    const input: FormulaInput = {
      id: "manual-formula",
      latex: "",
      context: "",
      domain: "general",
      selectedType: "auto",
    };
    set({ input, analysis: analyzeFormula(input) });
  },
}));
