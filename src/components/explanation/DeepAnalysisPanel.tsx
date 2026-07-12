import {
  Activity,
  AlertTriangle,
  Binary,
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  CircleHelp,
  FlaskConical,
  GitBranch,
  Lightbulb,
  Sigma,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useI18nStore } from "../../i18n";
import type { DeepAnalysisStatus, DeepFormulaAnalysis } from "../../schemas/deepAnalysis";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { BulletList, formatConfidence, Metric, ParameterCard } from "./DeepAnalysisShared";
import { EmptyDeepState, LoadingState } from "./DeepAnalysisStates";
import { DeepVisualization } from "./DeepAnalysisVisualization";

interface DeepAnalysisPanelProps {
  analysis: DeepFormulaAnalysis | null;
  status: DeepAnalysisStatus;
  error: string | null;
}

export function DeepAnalysisPanel({ analysis, status, error }: DeepAnalysisPanelProps) {
  const language = useI18nStore((state) => state.language);

  if (status === "loading") return <LoadingState language={language} />;
  if (!analysis) {
    if (status === "error" && error) {
      return (
        <Card className="border-red-200 dark:border-red-900/60">
          <CardBody className="flex items-start gap-3 bg-red-50/70 dark:bg-red-950/20">
            <TriangleAlert className="mt-0.5 shrink-0 text-lens-danger" size={20} />
            <div>
              <h2 className="font-semibold text-lens-ink">{language === "zh" ? "深度解释失败" : "Deep analysis failed"}</h2>
              <p className="mt-1 text-sm leading-6 text-lens-muted">{error}</p>
            </div>
          </CardBody>
        </Card>
      );
    }
    return <EmptyDeepState language={language} />;
  }

  return (
    <Card className="overflow-hidden border-indigo-100 dark:border-indigo-500/30">
      <CardHeader className="border-b border-lens-line bg-gradient-to-r from-indigo-50 via-white to-cyan-50 dark:from-indigo-500/10 dark:via-slate-950 dark:to-cyan-500/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lens-primary px-3 py-1 text-xs font-bold text-white"><Sparkles size={13} />LLM</span>
              <span className="rounded-full border border-lens-line bg-white px-3 py-1 text-xs font-semibold text-lens-muted dark:bg-slate-950">{analysis.provider}</span>
              <span className="rounded-full border border-lens-line bg-white px-3 py-1 text-xs font-semibold text-lens-muted dark:bg-slate-950">{analysis.model}</span>
              {analysis.input.imageUsed && <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">{language === "zh" ? "使用图片" : "Image used"}</span>}
            </div>
            <h2 className="academic-title mt-4 text-2xl font-semibold text-lens-ink">{analysis.formulaTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-lens-muted">{analysis.summary}</p>
          </div>
          <div className="min-w-36 rounded-xl border border-indigo-100 bg-white p-4 text-center shadow-sm dark:border-indigo-500/30 dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase tracking-wide text-lens-muted">{language === "zh" ? "解释置信度" : "Explanation confidence"}</p>
            <p className="mt-2 text-3xl font-bold text-lens-primary">{formatConfidence(analysis.confidence)}</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="grid gap-8">
        <section className="grid gap-3 md:grid-cols-3">
          <Metric label={language === "zh" ? "公式类别" : "Formula category"} value={analysis.formulaCategory} />
          <Metric label={language === "zh" ? "领域" : "Domain"} value={analysis.domain} />
          <Metric label={language === "zh" ? "参数数量" : "Parameters"} value={String(analysis.parameters.length)} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold text-lens-ink"><Lightbulb className="text-lens-primary" size={17} />{language === "zh" ? "为什么需要这个公式" : "Why this formula exists"}</div>
            <p className="mt-3 text-sm leading-7 text-lens-muted">{analysis.purpose}</p>
          </div>
          <div className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold text-lens-ink"><Binary className="text-lens-primary" size={17} />{language === "zh" ? "输出代表什么" : "What the output means"}</div>
            <p className="mt-3 text-sm leading-7 text-lens-muted">{analysis.outputInterpretation}</p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2"><Boxes className="text-lens-primary" size={19} /><h3 className="academic-title text-xl font-semibold text-lens-ink">{language === "zh" ? "参数与符号详解" : "Detailed parameters and symbols"}</h3></div>
          {analysis.parameters.length ? (
            <div className="grid gap-4">{analysis.parameters.map((parameter, index) => <ParameterCard key={`${parameter.symbol}-${parameter.name}-${index}`} parameter={parameter} language={language} />)}</div>
          ) : <p className="text-sm text-lens-muted">{language === "zh" ? "模型没有识别到可独立解释的参数。" : "No independently explainable parameters were identified."}</p>}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2"><Sigma className="text-lens-primary" size={19} /><h3 className="academic-title text-xl font-semibold text-lens-ink">{language === "zh" ? "公式项拆解" : "Term decomposition"}</h3></div>
          <div className="grid gap-3 md:grid-cols-2">
            {analysis.terms.map((term, index) => (
              <article key={`${term.latex}-${index}`} className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-2"><code className="rounded-md bg-white px-2 py-1 text-sm font-bold text-lens-primary dark:bg-slate-950">{term.latex}</code><h4 className="text-sm font-semibold text-lens-ink">{term.label}</h4></div>
                <p className="mt-3 text-sm leading-6 text-lens-muted">{term.meaning}</p>
                <p className="mt-2 text-xs leading-5 text-lens-muted"><span className="font-semibold text-lens-ink">{language === "zh" ? "运算：" : "Operation: "}</span>{term.operation}</p>
                <p className="mt-1 text-xs leading-5 text-lens-muted"><span className="font-semibold text-lens-ink">{language === "zh" ? "交互：" : "Interaction: "}</span>{term.interaction}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2"><BookOpenCheck className="text-lens-primary" size={19} /><h3 className="academic-title text-xl font-semibold text-lens-ink">{language === "zh" ? "阅读与计算顺序" : "Reading and computation order"}</h3></div>
            <ol className="grid gap-3">{analysis.readingOrder.map((item) => <li key={`${item.order}-${item.fragment}`} className="grid grid-cols-[2rem_1fr] gap-3 rounded-xl border border-lens-line bg-slate-50 p-3 dark:bg-slate-900"><span className="grid size-7 place-items-center rounded-full bg-lens-primary text-xs font-bold text-white">{item.order}</span><div><code className="text-xs font-semibold text-lens-primary">{item.fragment}</code><p className="mt-1 text-sm leading-6 text-lens-muted">{item.explanation}</p></div></li>)}</ol>
            <div className="mt-4 rounded-xl border border-lens-line bg-white p-4 dark:bg-slate-950">
              <h4 className="text-sm font-semibold text-lens-ink">{language === "zh" ? "实际计算流程" : "Practical computation procedure"}</h4>
              <ol className="mt-3 grid gap-2">{analysis.computationProcedure.map((item, index) => <li key={`${index}-${item}`} className="grid grid-cols-[1.5rem_1fr] gap-2 text-sm leading-6 text-lens-muted"><span className="font-mono text-xs font-bold text-lens-primary">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></li>)}</ol>
            </div>
          </div>
          <div>
            <div className="mb-4 flex items-center gap-2"><GitBranch className="text-lens-primary" size={19} /><h3 className="academic-title text-xl font-semibold text-lens-ink">{language === "zh" ? "推导逻辑" : "Derivation logic"}</h3></div>
            <ol className="grid gap-3">{analysis.derivation.map((step) => <li key={`${step.order}-${step.title}`} className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full border border-indigo-200 bg-white text-xs font-bold text-lens-primary dark:border-indigo-500/30 dark:bg-slate-950">{step.order}</span><h4 className="text-sm font-semibold text-lens-ink">{step.title}</h4></div>{step.expression && <code className="mt-3 block overflow-x-auto rounded-lg bg-white p-3 text-sm text-lens-primary dark:bg-slate-950">{step.expression}</code>}<p className="mt-3 text-sm leading-6 text-lens-muted">{step.explanation}</p>{step.assumptions.length > 0 && <p className="mt-2 text-xs leading-5 text-lens-muted"><span className="font-semibold text-lens-ink">{language === "zh" ? "本步假设：" : "Step assumptions: "}</span>{step.assumptions.join("; ")}</p>}</li>)}</ol>
          </div>
        </section>

        <DeepVisualization spec={analysis.visualization} language={language} />

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><div className="flex items-center gap-2 text-sm font-semibold text-lens-ink"><CircleHelp className="text-lens-primary" size={17} />{language === "zh" ? "核心假设" : "Core assumptions"}</div><div className="mt-3"><BulletList items={analysis.assumptions} empty={language === "zh" ? "未明确识别。" : "None explicitly identified."} /></div></div>
          <div className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><div className="flex items-center gap-2 text-sm font-semibold text-lens-ink"><AlertTriangle className="text-amber-600" size={17} />{language === "zh" ? "限制" : "Limitations"}</div><div className="mt-3"><BulletList items={analysis.limitations} empty={language === "zh" ? "未列出限制。" : "No limitations listed."} /></div></div>
          <div className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><div className="flex items-center gap-2 text-sm font-semibold text-lens-ink"><Activity className="text-cyan-600" size={17} />{language === "zh" ? "数值稳定性" : "Numerical stability"}</div><div className="mt-3"><BulletList items={analysis.numericalStability} empty={language === "zh" ? "未发现特定数值问题。" : "No specific numerical issues identified."} /></div></div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2"><FlaskConical className="text-lens-primary" size={18} /><h3 className="text-base font-semibold text-lens-ink">{language === "zh" ? "典型应用" : "Typical applications"}</h3></div>
            <div className="grid gap-3">{analysis.applications.map((application, index) => <article key={`${application.scenario}-${index}`} className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><h4 className="text-sm font-semibold text-lens-ink">{application.scenario}</h4><p className="mt-2 text-sm leading-6 text-lens-muted">{application.whyItFits}</p><p className="mt-2 text-xs leading-5 text-lens-muted"><span className="font-semibold text-lens-ink">{language === "zh" ? "例子：" : "Example: "}</span>{application.example}</p></article>)}</div>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2"><CheckCircle2 className="text-lens-primary" size={18} /><h3 className="text-base font-semibold text-lens-ink">{language === "zh" ? "一致性检查" : "Consistency checks"}</h3></div>
            <div className="grid gap-3">{analysis.validationChecks.map((check, index) => { const Icon = check.status === "pass" ? CheckCircle2 : check.status === "warning" ? TriangleAlert : CircleHelp; const iconClass = check.status === "pass" ? "text-emerald-600" : check.status === "warning" ? "text-amber-600" : "text-slate-500"; return <article key={`${check.check}-${index}`} className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><div className="flex items-center gap-2"><Icon className={iconClass} size={17} /><h4 className="text-sm font-semibold text-lens-ink">{check.check}</h4></div><p className="mt-2 text-sm leading-6 text-lens-muted">{check.explanation}</p></article>; })}</div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div><h3 className="mb-3 text-base font-semibold text-lens-ink">{language === "zh" ? "相关概念" : "Related concepts"}</h3><div className="grid gap-3">{analysis.relatedConcepts.map((concept, index) => <article key={`${concept.name}-${index}`} className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-semibold text-lens-ink">{concept.name}</h4><span className="rounded-full border border-lens-line bg-white px-2 py-0.5 text-xs text-lens-muted dark:bg-slate-950">{concept.relation}</span></div><p className="mt-2 text-sm leading-6 text-lens-muted">{concept.explanation}</p></article>)}</div></div>
          <div><h3 className="mb-3 text-base font-semibold text-lens-ink">{language === "zh" ? "不确定性说明" : "Uncertainty notes"}</h3><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-500/10"><BulletList items={analysis.uncertaintyNotes} empty={language === "zh" ? "模型未标记额外不确定性。" : "The model did not flag additional uncertainty."} /></div></div>
        </section>
      </CardBody>
    </Card>
  );
}
