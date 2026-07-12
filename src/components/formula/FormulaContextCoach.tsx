import { CheckCircle2, Circle, ClipboardPlus, Info } from "lucide-react";
import { Button } from "../ui/Button";

interface FormulaContextCoachProps {
  context: string;
  language: "en" | "zh";
  onApplyTemplate: (template: string) => void;
}

interface ContextCheck {
  id: string;
  label: string;
  passed: boolean;
}

function hasAny(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

export function FormulaContextCoach({ context, language, onApplyTemplate }: FormulaContextCoachProps) {
  const normalized = context.trim();
  const zh = language === "zh";
  const checks: ContextCheck[] = [
    {
      id: "surrounding",
      label: zh ? "公式前后至少一段论文原文" : "At least one surrounding paper paragraph",
      passed: normalized.length >= 120,
    },
    {
      id: "symbols",
      label: zh ? "符号或变量定义" : "Symbol or variable definitions",
      passed: hasAny(normalized, [/where\b/i, /denote/i, /represent/i, /定义/, /表示/, /其中/]),
    },
    {
      id: "task",
      label: zh ? "公式所在任务或模块" : "Task or module containing the formula",
      passed: hasAny(normalized, [/loss/i, /objective/i, /module/i, /layer/i, /task/i, /损失/, /目标/, /模块/, /任务/]),
    },
    {
      id: "reference",
      label: zh ? "公式编号、图注或章节线索" : "Equation number, caption, or section clue",
      passed: hasAny(normalized, [/equation\s*\(?\d+/i, /eq\.\s*\(?\d+/i, /figure\s*\d+/i, /section\s*[\d.]+/i, /公式\s*\(?\d+/, /图\s*\d+/, /第.+节/]),
    },
  ];
  const passed = checks.filter((check) => check.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const template = zh
    ? "论文任务/章节：\n公式编号：\n公式前后的原文：\n作者对符号的定义：\n我最不理解的地方：\n"
    : "Paper task/section:\nEquation number:\nSurrounding text:\nAuthor-provided symbol definitions:\nWhat I understand least:\n";

  return (
    <div className="rounded-lg border border-lens-line bg-slate-50 p-3 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-lens-ink">
            <Info className="text-lens-primary" size={16} />
            {zh ? "上下文质量" : "Context quality"}
          </div>
          <p className="mt-1 text-xs leading-5 text-lens-muted">
            {zh ? "公式本身通常不能唯一决定符号含义。补充论文上下文能显著减少错误推断。" : "A formula rarely determines symbol meanings by itself. Paper context reduces unsupported inference."}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${score >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : score >= 50 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
          {score}%
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        {checks.map((check) => {
          const Icon = check.passed ? CheckCircle2 : Circle;
          return (
            <div key={check.id} className="flex items-center gap-2 text-xs text-lens-muted">
              <Icon className={check.passed ? "text-emerald-600" : "text-slate-400"} size={14} />
              <span>{check.label}</span>
            </div>
          );
        })}
      </div>
      <Button className="mt-3 w-full justify-center" variant="secondary" onClick={() => onApplyTemplate(template)}>
        <ClipboardPlus size={15} />
        {zh ? "插入上下文模板" : "Insert context template"}
      </Button>
    </div>
  );
}
