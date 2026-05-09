import { ArrowRight, BarChart3, Brain, FlaskConical, SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { examples } from "../../features/examples/examples";
import { useI18nStore } from "../../i18n";

const features = {
  en: [
    { icon: Brain, title: "Explain", text: "Break down each term and symbol into readable mathematical intuition." },
    { icon: BarChart3, title: "Visualize", text: "Match formulas with focused charts, trajectories, and structure diagrams." },
    { icon: SlidersHorizontal, title: "Experiment", text: "Adjust parameters and watch behavior change without leaving the page." },
  ],
  zh: [
    { icon: Brain, title: "讲清楚", text: "把每个符号、上下标和运算拆成初学者也能读懂的解释。" },
    { icon: BarChart3, title: "画出来", text: "为公式匹配结构图、曲线图、轨迹图和离散数学图解。" },
    { icon: SlidersHorizontal, title: "可实验", text: "拖动参数，直接观察公式行为如何变化。" },
  ],
};

export function LandingPage() {
  const language = useI18nStore((state) => state.language);
  const zh = language === "zh";

  return (
    <main>
      <section className="border-b border-lens-line bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-normal text-lens-ink sm:text-6xl">
              FormulaForge
            </h1>
            <p className="mt-5 max-w-xl text-2xl font-semibold leading-tight text-lens-ink">
              {zh ? "把论文公式变成你真正看得懂的解释、图和例子。" : "Turn formulas into intuition."}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-lens-muted">
              {zh
                ? "粘贴公式或加载示例，系统会识别公式结构，解释符号、给出计算步骤、生成图形，并推荐同领域相关公式。"
                : "Paste a scientific formula and get plain-language explanations, structure diagrams, and interactive visualizations."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/app">
                <Button>
                  {zh ? "开始使用" : "Try FormulaForge"}
                  <ArrowRight size={16} />
                </Button>
              </a>
              <a href="/examples">
                <Button variant="secondary">{zh ? "查看示例" : "View Examples"}</Button>
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-lens-line bg-lens-paper p-4 shadow-soft">
            <div className="grid gap-3">
              <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">LaTeX Formula</p>
                <p className="formula-scroll mt-3 overflow-x-auto font-mono text-sm text-lens-ink">
                  L = \lambda_1 L_rec + \lambda_2 L_adv + \lambda_3 L_perceptual
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-lens-ink">{zh ? "解释" : "Explanation"}</p>
                  <p className="mt-2 text-sm leading-6 text-lens-muted">
                    {zh ? "平衡多个训练目标的加权总损失。" : "A weighted sum that balances multiple training objectives."}
                  </p>
                </div>
                <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-lens-ink">{zh ? "结构树" : "Structure Tree"}</p>
                  <div className="mt-3 grid gap-2 text-xs text-lens-muted">
                    <span>{zh ? "总目标" : "Total Objective"}</span>
                    <span className="ml-4">lambda1 x Lrec</span>
                    <span className="ml-4">lambda2 x Ladv</span>
                  </div>
                </div>
                <div className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-lens-ink">{zh ? "交互图" : "Interactive Plot"}</p>
                  <div className="mt-4 grid gap-2">
                    {[70, 48, 34].map((width, index) => (
                      <div key={width} className="h-4 rounded bg-slate-100 dark:bg-slate-800">
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
          {features[language].map((feature) => (
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

      <section className="border-y border-lens-line bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-lens-ink">{zh ? "从一个已知公式开始" : "Start from a known formula"}</h2>
              <p className="mt-2 text-lens-muted">
                {zh ? "模板覆盖 AI、概率统计和离散数学中的常见公式。" : "Templates focus on formulas common in AI, math, and technical papers."}
              </p>
            </div>
            <a href="/examples">
              <Button variant="secondary">{zh ? "打开示例库" : "Open Gallery"}</Button>
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
                    {zh ? "打开示例" : "Open Example"}
                  </a>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-lg border border-lens-line bg-white p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-cyan-50 text-lens-cyan dark:bg-cyan-500/15">
              <FlaskConical size={22} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-lens-ink">{zh ? "本地优先，后端已就绪" : "Local-first, backend ready"}</h2>
              <p className="mt-1 text-sm text-lens-muted">
                {zh ? "前端使用 React、TypeScript、Tailwind、KaTeX 和 SVG 可视化；后端提供公式解析、文档抽取和 OCR 扩展入口。" : "Built with React, TypeScript, Tailwind, KaTeX, SVG visualizations, and an optional Node API."}
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-lens-muted">
            {zh
              ? "FormulaForge 先用确定性的规则模板建立可靠核心体验；新增后端接口后，可以继续接入 OCR、论文上下文、文件上传和可选 LLM 增强。"
              : "FormulaForge starts with deterministic templates, then adds a backend path for OCR, paper context, file upload, and optional LLM providers."}
          </p>
        </div>
      </section>
    </main>
  );
}
