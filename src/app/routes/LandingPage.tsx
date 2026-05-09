import { ArrowRight, BarChart3, Brain, FlaskConical, SlidersHorizontal } from "lucide-react";
import { examples } from "../../features/examples/examples";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";

const features = [
  {
    icon: Brain,
    title: "Explain",
    text: "Break down each term and symbol into readable mathematical intuition.",
  },
  {
    icon: BarChart3,
    title: "Visualize",
    text: "Match formulas with focused charts, trajectories, and structure diagrams.",
  },
  {
    icon: SlidersHorizontal,
    title: "Experiment",
    text: "Adjust parameters and watch behavior change without leaving the page.",
  },
];

export function LandingPage() {
  return (
    <main>
      <section className="border-b border-lens-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-normal text-lens-ink sm:text-6xl">
              FormulaForge
            </h1>
            <p className="mt-5 max-w-xl text-2xl font-semibold leading-tight text-lens-ink">Turn formulas into intuition.</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-lens-muted">
              Paste a scientific formula and get plain-language explanations, structure diagrams, and interactive visualizations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/app">
                <Button>
                  Try FormulaForge
                  <ArrowRight size={16} />
                </Button>
              </a>
              <a href="/examples">
                <Button variant="secondary">View Examples</Button>
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-lens-line bg-lens-paper p-4 shadow-soft">
            <div className="grid gap-3">
              <div className="rounded-lg border border-lens-line bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">LaTeX Formula</p>
                <p className="formula-scroll mt-3 overflow-x-auto font-mono text-sm text-lens-ink">
                  L = \lambda_1 L_rec + \lambda_2 L_adv + \lambda_3 L_perceptual
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-lens-line bg-white p-4">
                  <p className="text-sm font-semibold text-lens-ink">Explanation</p>
                  <p className="mt-2 text-sm leading-6 text-lens-muted">A weighted sum that balances multiple training objectives.</p>
                </div>
                <div className="rounded-lg border border-lens-line bg-white p-4">
                  <p className="text-sm font-semibold text-lens-ink">Structure Tree</p>
                  <div className="mt-3 grid gap-2 text-xs text-lens-muted">
                    <span>Total Objective</span>
                    <span className="ml-4">λ1 × Lrec</span>
                    <span className="ml-4">λ2 × Ladv</span>
                  </div>
                </div>
                <div className="rounded-lg border border-lens-line bg-white p-4">
                  <p className="text-sm font-semibold text-lens-ink">Interactive Plot</p>
                  <div className="mt-4 grid gap-2">
                    {[70, 48, 34].map((width, index) => (
                      <div key={width} className="h-4 rounded bg-slate-100">
                        <div
                          className="h-full rounded"
                          style={{ width: `${width}%`, backgroundColor: ["#4F46E5", "#06B6D4", "#10B981"][index] }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardBody>
                <feature.icon className="text-lens-primary" size={22} />
                <h2 className="mt-4 text-lg font-semibold text-lens-ink">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-lens-muted">{feature.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-lens-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-lens-ink">Start from a known formula</h2>
              <p className="mt-2 text-lens-muted">MVP templates focus on formulas common in AI and technical papers.</p>
            </div>
            <a href="/examples">
              <Button variant="secondary">Open Gallery</Button>
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {examples.slice(0, 3).map((example) => (
              <Card key={example.id}>
                <CardBody>
                  <p className="text-sm font-semibold text-lens-primary">{example.title}</p>
                  <p className="formula-scroll mt-3 overflow-x-auto font-mono text-sm text-lens-ink">{example.latex}</p>
                  <p className="mt-4 text-sm leading-6 text-lens-muted">{example.summary}</p>
                  <a className="mt-5 inline-flex text-sm font-semibold text-lens-primary" href={`/app?example=${example.id}`}>
                    Open Example
                  </a>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-lg border border-lens-line bg-white p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-cyan-50 text-lens-cyan">
              <FlaskConical size={22} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-lens-ink">Local-first, no backend required</h2>
              <p className="mt-1 text-sm text-lens-muted">Built with React, TypeScript, Tailwind, KaTeX, and focused SVG visualizations.</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-lens-muted">
            FormulaForge starts with deterministic templates so the core experience remains understandable, testable, and easy to extend before
            adding optional LLM providers.
          </p>
        </div>
      </section>
    </main>
  );
}
