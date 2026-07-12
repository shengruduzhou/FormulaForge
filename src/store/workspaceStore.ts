import { create } from "zustand";
import { analyzeFormula } from "../features/analyzer/analyzeFormula";
import { analyzeFormulaDeep } from "../features/analyzer/analyzeFormulaDeep";
import { examples } from "../features/examples/examples";
import type { FormulaAnalysis } from "../schemas/analysis";
import type { DeepAnalysisImage, DeepAnalysisStatus, DeepFormulaAnalysis } from "../schemas/deepAnalysis";
import type { FormulaInput } from "../schemas/formula";

const defaultInput: FormulaInput = {
  id: "manual-formula",
  latex: examples[0].latex,
  context: examples[0].context,
  domain: "ai_ml",
  selectedType: "auto",
};

const emptyDeepState = {
  deepAnalysis: null,
  deepStatus: "idle",
  deepError: null,
} satisfies Pick<WorkspaceState, "deepAnalysis" | "deepStatus" | "deepError">;

let deepRequestSequence = 0;

function invalidateDeepRequests() {
  deepRequestSequence += 1;
  return emptyDeepState;
}

interface WorkspaceState {
  input: FormulaInput;
  analysis: FormulaAnalysis;
  image: DeepAnalysisImage | null;
  deepAnalysis: DeepFormulaAnalysis | null;
  deepStatus: DeepAnalysisStatus;
  deepError: string | null;
  setInput: (input: FormulaInput) => void;
  setImage: (image: DeepAnalysisImage | null) => void;
  analyze: () => void;
  analyzeDeep: (language: "en" | "zh") => Promise<void>;
  loadExample: (id: string) => void;
  clear: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  input: defaultInput,
  analysis: analyzeFormula(defaultInput),
  image: null,
  ...emptyDeepState,
  setInput: (input) => set({ input, ...invalidateDeepRequests() }),
  setImage: (image) => set({ image, ...invalidateDeepRequests() }),
  analyze: () => set({ analysis: analyzeFormula(get().input) }),
  analyzeDeep: async (language) => {
    const { input, image } = get();
    if (!input.latex.trim() && !image?.dataUrl) {
      set({
        deepStatus: "error",
        deepError: language === "zh" ? "请先输入公式或上传公式图片。" : "Enter a formula or upload a formula image first.",
      });
      return;
    }

    const requestId = ++deepRequestSequence;
    set({ deepStatus: "loading", deepError: null });

    try {
      const deepAnalysis = await analyzeFormulaDeep({
        latex: input.latex,
        context: input.context,
        domain: input.domain,
        selectedType: input.selectedType,
        language,
        depth: "research",
        image: image?.dataUrl,
      });

      if (requestId !== deepRequestSequence) return;
      set({ deepAnalysis, deepStatus: "success", deepError: null });
    } catch (error) {
      if (requestId !== deepRequestSequence) return;
      set({
        deepAnalysis: null,
        deepStatus: "error",
        deepError: error instanceof Error ? error.message : "Deep analysis failed.",
      });
    }
  },
  loadExample: (id) => {
    const example = examples.find((item) => item.id === id) ?? examples[0];
    const input: FormulaInput = {
      id: example.id,
      latex: example.latex,
      context: example.context,
      domain: example.domain,
      selectedType: example.selectedType,
    };
    set({
      input,
      analysis: analyzeFormula(input),
      image: null,
      ...invalidateDeepRequests(),
    });
  },
  clear: () => {
    const input: FormulaInput = {
      id: "manual-formula",
      latex: "",
      context: "",
      domain: "general",
      selectedType: "auto",
    };
    set({
      input,
      analysis: analyzeFormula(input),
      image: null,
      ...invalidateDeepRequests(),
    });
  },
}));
