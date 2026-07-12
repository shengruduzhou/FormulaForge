import { FlaskConical, GitBranch, Loader2, Network, Sigma, Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader } from "../ui/Card";

export function EmptyDeepState({ language }: { language: "en" | "zh" }) {
  const items = [
    { icon: Sigma, title: language === "zh" ? "逐参数定义" : "Parameter-by-parameter definitions", text: language === "zh" ? "解释符号的含义、类型、维度、单位、来源与依赖。" : "Meaning, type, shape, units, provenance, and dependencies for every symbol." },
    { icon: GitBranch, title: language === "zh" ? "推导与计算链" : "Derivation and computation chain", text: language === "zh" ? "给出阅读顺序、推导步骤、假设和数值计算流程。" : "Reading order, derivation steps, assumptions, and numerical procedure." },
    { icon: FlaskConical, title: language === "zh" ? "论文语境解释" : "Paper-context interpretation", text: language === "zh" ? "结合公式前后文区分确定事实与不确定推断。" : "Uses surrounding paper text and separates established facts from inference." },
    { icon: Network, title: language === "zh" ? "图表辅助理解" : "Visual explanation", text: language === "zh" ? "为可计算关系生成曲线，为抽象公式生成流程图。" : "Produces curves for justified numeric relationships and flow diagrams otherwise." },
  ];
  return (
    <Card className="overflow-hidden border-indigo-100 dark:border-indigo-500/30">
      <CardHeader className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 dark:from-indigo-500/10 dark:via-slate-950 dark:to-cyan-500/10">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-lens-primary text-white shadow-sm"><Sparkles size={19} /></span><div><h2 className="academic-title text-xl font-semibold text-lens-ink">{language === "zh" ? "论文公式深度解释" : "Deep paper formula explanation"}</h2><p className="mt-1 text-sm text-lens-muted">{language === "zh" ? "点击左侧“LLM 深度解释”生成完整研究级报告。" : "Select “Deep LLM explanation” to generate a research-grade report."}</p></div></div>
      </CardHeader>
      <CardBody className="grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900"><Icon className="text-lens-primary" size={18} /><h3 className="mt-3 text-sm font-semibold text-lens-ink">{title}</h3><p className="mt-1 text-sm leading-6 text-lens-muted">{text}</p></div>)}
      </CardBody>
    </Card>
  );
}

export function LoadingState({ language }: { language: "en" | "zh" }) {
  return (
    <Card className="overflow-hidden border-indigo-200 dark:border-indigo-500/30">
      <CardBody className="grid min-h-56 place-items-center bg-gradient-to-br from-indigo-50 to-white text-center dark:from-indigo-500/10 dark:to-slate-950">
        <div><Loader2 className="mx-auto animate-spin text-lens-primary" size={32} /><h2 className="mt-4 text-lg font-semibold text-lens-ink">{language === "zh" ? "正在构建深度解释" : "Building the deep explanation"}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-lens-muted">{language === "zh" ? "模型正在识别公式结构、逐项解释参数、核对假设，并选择合适的图表。" : "The model is identifying structure, explaining parameters, checking assumptions, and selecting a suitable visualization."}</p></div>
      </CardBody>
    </Card>
  );
}
