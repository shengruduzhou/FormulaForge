import { useEffect } from "react";
import { ExportPanel } from "../../components/export/ExportPanel";
import { ExplanationTabs } from "../../components/explanation/ExplanationTabs";
import { ParserDiagnostics } from "../../components/explanation/ParserDiagnostics";
import { FormulaInputPanel } from "../../components/formula/FormulaInputPanel";
import { FormulaPreview } from "../../components/formula/FormulaPreview";
import { StructureDiagram } from "../../components/structure/StructureDiagram";
import { VisualizationRenderer } from "../../components/visualization/VisualizationRenderer";
import { useWorkspaceStore } from "../../store/workspaceStore";

export function WorkspacePage() {
  const { input, analysis, setInput, analyze, loadExample, clear } = useWorkspaceStore();

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
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <FormulaInputPanel value={input} onChange={setInput} onAnalyze={analyze} onLoadExample={loadExample} onClear={clear} />
      </aside>
      <section className="grid gap-5">
        <FormulaPreview analysis={analysis} />
        <ParserDiagnostics analysis={analysis} />
        <ExplanationTabs analysis={analysis} />
        <StructureDiagram structure={analysis.structure} />
        <VisualizationRenderer spec={analysis.visualization} />
        <ExportPanel analysis={analysis} />
      </section>
    </main>
  );
}
