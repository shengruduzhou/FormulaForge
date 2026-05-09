import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { examples } from "../../features/examples/examples";
import { formulaTypeLabelsByLanguage, useI18nStore } from "../../i18n";

export function ExamplesPage() {
  const language = useI18nStore((state) => state.language);
  const zh = language === "zh";
  const labels = formulaTypeLabelsByLanguage[language];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-semibold text-lens-ink">{zh ? "示例库" : "Example Gallery"}</h1>
          <p className="mt-3 max-w-2xl text-lens-muted">
            {zh ? "加载公式模板，查看解释、结构拆解和交互图形。" : "Load a formula template and inspect the explanation, structure, and visualization behavior."}
          </p>
        </div>
        <a href="/app">
          <Button variant="secondary">{zh ? "打开工作台" : "Open Workspace"}</Button>
        </a>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {examples.map((example) => (
          <Card key={example.id}>
            <CardBody>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-lens-primary">{labels[example.selectedType]}</p>
                  <h2 className="mt-2 text-xl font-semibold text-lens-ink">{example.title}</h2>
                </div>
                <a href={`/app?example=${example.id}`}>
                  <Button>
                    {zh ? "打开" : "Open"}
                    <ArrowRight size={16} />
                  </Button>
                </a>
              </div>
              <p className="formula-scroll mt-5 overflow-x-auto rounded-lg bg-slate-50 p-4 font-mono text-sm text-lens-ink dark:bg-slate-900">
                {example.latex}
              </p>
              <p className="mt-4 text-sm leading-6 text-lens-muted">{example.summary}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
