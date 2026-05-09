import { Card, CardBody } from "../../components/ui/Card";

export function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-lens-ink">Methodology</h1>
      <p className="mt-4 text-lg leading-8 text-lens-muted">
        FormulaForge uses a local rule-based pipeline in the MVP. The goal is understandable behavior before adding optional AI providers.
      </p>
      <Card className="mt-8">
        <CardBody>
          <ol className="grid gap-4 text-sm leading-7 text-lens-muted">
            <li>
              <strong className="text-lens-ink">1. Normalize LaTeX:</strong> simplify spacing and remove display-only wrappers.
            </li>
            <li>
              <strong className="text-lens-ink">2. Detect type:</strong> score patterns for weighted losses, softmax, sigmoid, and gradient
              descent.
            </li>
            <li>
              <strong className="text-lens-ink">3. Build analysis:</strong> generate variables, structure, explanations, boundary cases, and
              visualization specs.
            </li>
            <li>
              <strong className="text-lens-ink">4. Render interaction:</strong> connect sliders to deterministic chart logic in the browser.
            </li>
          </ol>
        </CardBody>
      </Card>
    </main>
  );
}
