import { Check, Clipboard, Download, FileText, TriangleAlert, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { buildFormulaExplainerSkill, buildFormulaFollowUpPrompt } from "../../features/skills/buildFormulaSkill";
import { useI18nStore } from "../../i18n";
import type { DeepFormulaAnalysis } from "../../schemas/deepAnalysis";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";

interface FormulaSkillPanelProps {
  analysis: DeepFormulaAnalysis | null;
}

type CopyTarget = "skill" | "prompt" | null;

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) throw new Error("Copy is unavailable in this browser.");
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function FormulaSkillPanel({ analysis }: FormulaSkillPanelProps) {
  const language = useI18nStore((state) => state.language);
  const [copied, setCopied] = useState<CopyTarget>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const skill = useMemo(() => (analysis ? buildFormulaExplainerSkill(analysis, language) : ""), [analysis, language]);
  const prompt = useMemo(() => (analysis ? buildFormulaFollowUpPrompt(analysis, language) : ""), [analysis, language]);

  if (!analysis) return null;
  const zh = language === "zh";

  const handleCopy = async (target: Exclude<CopyTarget, null>, value: string) => {
    setCopyError(null);
    try {
      await copyText(value);
      setCopied(target);
      window.setTimeout(() => setCopied(null), 1600);
    } catch (error) {
      setCopyError(error instanceof Error ? error.message : (zh ? "复制失败。" : "Copy failed."));
    }
  };

  return (
    <Card className="overflow-hidden border-cyan-100 dark:border-cyan-500/30">
      <CardHeader className="border-b border-lens-line bg-gradient-to-r from-cyan-50 via-white to-indigo-50 dark:from-cyan-500/10 dark:via-slate-950 dark:to-indigo-500/10">
        <div className="flex items-center gap-2">
          <WandSparkles className="text-cyan-700 dark:text-cyan-300" size={20} />
          <h2 className="academic-title text-xl font-semibold text-lens-ink">{zh ? "把这次解释蒸馏成 Skill" : "Distill this explanation into a skill"}</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-lens-muted">
          {zh
            ? "把当前公式、上下文和教学协议打包成可复用文件，用于其他 LLM、Agent、课程或团队知识库。它保留教学结构，但不会把模型的推测伪装成论文事实。"
            : "Package the current formula, context, and teaching protocol into a reusable file for other LLMs, agents, courses, or team knowledge bases. It preserves the teaching structure without presenting model inferences as paper facts."}
        </p>
      </CardHeader>
      <CardBody className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="text-cyan-700 dark:text-cyan-300" size={18} />
            <h3 className="font-semibold text-lens-ink">{zh ? "公式解释 Skill 文件" : "Formula explainer skill file"}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-lens-muted">
            {zh ? "适合保存为 SKILL.md，包含目标、输入、教学顺序、真实性约束和输出规范。" : "Save as SKILL.md. It contains goals, inputs, teaching order, truthfulness constraints, and response requirements."}
          </p>
          <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg border border-lens-line bg-white p-3 text-xs leading-5 text-lens-muted dark:bg-slate-950">{skill}</pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void handleCopy("skill", skill)}>
              {copied === "skill" ? <Check size={16} /> : <Clipboard size={16} />}
              {copied === "skill" ? (zh ? "已复制" : "Copied") : (zh ? "复制 Skill" : "Copy skill")}
            </Button>
            <Button variant="secondary" onClick={() => downloadMarkdown("formula-understanding-SKILL.md", skill)}>
              <Download size={16} />{zh ? "下载" : "Download"}
            </Button>
          </div>
        </article>

        <article className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Clipboard className="text-indigo-700 dark:text-indigo-300" size={18} />
            <h3 className="font-semibold text-lens-ink">{zh ? "可直接使用的追问 Prompt" : "Ready-to-use follow-up prompt"}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-lens-muted">
            {zh ? "适合粘贴到任意支持长文本的模型中，继续针对当前公式进行教学。" : "Paste into any long-context model to continue teaching this specific formula."}
          </p>
          <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg border border-lens-line bg-white p-3 text-xs leading-5 text-lens-muted dark:bg-slate-950">{prompt}</pre>
          <Button className="mt-3" variant="secondary" onClick={() => void handleCopy("prompt", prompt)}>
            {copied === "prompt" ? <Check size={16} /> : <Clipboard size={16} />}
            {copied === "prompt" ? (zh ? "已复制" : "Copied") : (zh ? "复制 Prompt" : "Copy prompt")}
          </Button>
        </article>
        {copyError && (
          <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 lg:col-span-2">
            <TriangleAlert className="mt-0.5 shrink-0" size={15} />
            {copyError}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
