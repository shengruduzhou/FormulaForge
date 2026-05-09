import { Card, CardBody } from "../../components/ui/Card";
import { useI18nStore } from "../../i18n";

export function DocsPage() {
  const language = useI18nStore((state) => state.language);
  const zh = language === "zh";

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-lens-ink">{zh ? "方法说明" : "Methodology"}</h1>
      <p className="mt-4 text-lg leading-8 text-lens-muted">
        {zh
          ? "FormulaForge 在 MVP 中使用本地规则解析管线。目标是在加入 OCR、论文上下文和可选 AI 之前，先让核心行为可理解、可测试、可扩展。"
          : "FormulaForge uses a local rule-based pipeline in the MVP. The goal is understandable behavior before adding optional AI providers."}
      </p>
      <Card className="mt-8">
        <CardBody>
          <ol className="grid gap-4 text-sm leading-7 text-lens-muted">
            <li>
              <strong className="text-lens-ink">{zh ? "1. 规范化 LaTeX：" : "1. Normalize LaTeX:"}</strong>{" "}
              {zh ? "简化空格并移除仅用于展示的包装。" : "simplify spacing and remove display-only wrappers."}
            </li>
            <li>
              <strong className="text-lens-ink">{zh ? "2. 识别类型：" : "2. Detect type:"}</strong>{" "}
              {zh
                ? "为加权损失、softmax、sigmoid、梯度下降、交叉熵、贝叶斯、组合数、集合和图论公式打分。"
                : "score patterns for weighted losses, softmax, sigmoid, gradient descent, cross entropy, Bayes, combinations, sets, and graph formulas."}
            </li>
            <li>
              <strong className="text-lens-ink">{zh ? "3. 构建解析：" : "3. Build analysis:"}</strong>{" "}
              {zh
                ? "生成符号表、结构树、初学者解释、步骤、小例子、边界情况和可视化规格。"
                : "generate variables, structure, beginner explanations, steps, examples, boundary cases, and visualization specs."}
            </li>
            <li>
              <strong className="text-lens-ink">{zh ? "4. 渲染交互：" : "4. Render interaction:"}</strong>{" "}
              {zh ? "在浏览器中连接滑块和确定性的图形逻辑。" : "connect sliders to deterministic chart logic in the browser."}
            </li>
          </ol>
        </CardBody>
      </Card>
    </main>
  );
}
