import { ArrowRight } from "lucide-react";
import { examples, formulaTypeLabels } from "../../features/examples/examples";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";

export function ExamplesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-semibold text-lens-ink">Example Gallery</h1>
          <p className="mt-3 max-w-2xl text-lens-muted">
            Load a formula template and inspect the explanation, structure, and visualization behavior.
          </p>
        </div>
        <a href="/app">
          <Button variant="secondary">Open Workspace</Button>
        </a>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {examples.map((example) => (
          <Card key={example.id}>
            <CardBody>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-lens-primary">{formulaTypeLabels[example.selectedType]}</p>
                  <h2 className="mt-2 text-xl font-semibold text-lens-ink">{example.title}</h2>
                </div>
                <a href={`/app?example=${example.id}`}>
                  <Button>
                    Open
                    <ArrowRight size={16} />
                  </Button>
                </a>
              </div>
              <p className="formula-scroll mt-5 overflow-x-auto rounded-lg bg-slate-50 p-4 font-mono text-sm text-lens-ink">
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
