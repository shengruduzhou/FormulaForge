import { useEffect } from "react";
import { ExportPanel } from "../../components/export/ExportPanel";
import { DeepAnalysisPanel } from "../../components/explanation/DeepAnalysisPanel";
import { ExplanationTabs } from "../../components/explanation/ExplanationTabs";
import { ParserDiagnostics } from "../../components/explanation/ParserDiagnostics";
import { FormulaInputPanel } from "../../components/formula/FormulaInputPanel";
import { FormulaPreview } from "../../components/formula/FormulaPreview";
import { StructureDiagram } from "../../components/structure/StructureDiagram";
import { VisualizationRenderer } from "../../components/visualization/VisualizationRenderer";
import { useI18nStore } from "../../i18n";
import { useWorkspaceStore } from "../../store/workspaceStore";

export function WorkspacePage() {
  const language = useI18nStore((state) => state.language);
  const {
    input,
    analysis,
    image,
    deepAnalysis,
    deepStatus,
    deepError,
    setInput,
    setImage,
    analyze,
    analyzeDeep,
    loadExample,
    clear,
  } = useWorkspaceStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const example = params.get("example");
    if (example) {
      loadExample(example);
    }
  }, [loadExample]);

  useEffect(() => {
    if (!input.latex.trim()) return;

    const timer = window.setTimeout(() => {
      analyze();
    }, 650);

    return () => window.clearTimeout(timer);
  }, [input, analyze]);

  return (
    <main className="mx-auto grid max-w-[1480px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:px-8">
      <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
        <FormulaInputPanel
          value={input}
          imagePreview={image?.dataUrl}
          deepStatus={deepStatus}
          deepError={deepError}
          onChange={setInput}
          onAnalyze={analyze}
          onDeepAnalyze={() => void analyzeDeep(language)}
          onImage={(dataUrl, fileName) => setImage({ dataUrl, fileName })}
          onClearImage={() => setImage(null)}
          onLoadExample={loadExample}
          onClear={clear}
        />
      </aside>
      <section className="grid min-w-0 gap-5">
        <FormulaPreview analysis={analysis} />
        <DeepAnalysisPanel analysis={deepAnalysis} status={deepStatus} error={deepError} />
        <ParserDiagnostics analysis={analysis} />
        <ExplanationTabs analysis={analysis} />
        <StructureDiagram structure={analysis.structure} />
        <VisualizationRenderer spec={analysis.visualization} />
        <ExportPanel analysis={analysis} />
      </section>
    </main>
  );
}
