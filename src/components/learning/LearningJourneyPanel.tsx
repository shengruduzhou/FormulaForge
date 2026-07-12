import { Check, ChevronDown, CircleHelp, GraduationCap, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { buildLearningJourney } from "../../features/learning/buildLearningJourney";
import { useI18nStore } from "../../i18n";
import type { DeepFormulaAnalysis } from "../../schemas/deepAnalysis";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";

interface LearningJourneyPanelProps {
  analysis: DeepFormulaAnalysis | null;
}

export function LearningJourneyPanel({ analysis }: LearningJourneyPanelProps) {
  const language = useI18nStore((state) => state.language);
  const journey = useMemo(() => (analysis ? buildLearningJourney(analysis, language) : null), [analysis, language]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [openStage, setOpenStage] = useState<string>("orientation");
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());

  if (!analysis || !journey) return null;

  const progress = Math.round((completed.size / journey.stages.length) * 100);
  const zh = language === "zh";

  const toggleComplete = (id: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card className="overflow-hidden border-violet-100 dark:border-violet-500/30">
      <CardHeader className="border-b border-lens-line bg-gradient-to-r from-violet-50 via-white to-amber-50 dark:from-violet-500/10 dark:via-slate-950 dark:to-amber-500/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="text-violet-600" size={20} />
              <h2 className="academic-title text-xl font-semibold text-lens-ink">{zh ? "公式理解路径" : "Formula understanding path"}</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-lens-muted">
              {zh
                ? "不是从第一行解释读到最后一行，而是按认知顺序逐层建立理解。完成一层后再进入下一层。"
                : "Do not read one long explanation from top to bottom. Build understanding in cognitive layers and complete one layer before moving on."}
            </p>
          </div>
          <div className="min-w-44 rounded-xl border border-violet-100 bg-white p-3 dark:border-violet-500/30 dark:bg-slate-950">
            <div className="flex items-center justify-between text-xs font-semibold text-lens-muted">
              <span>{zh ? "学习进度" : "Learning progress"}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="grid gap-6">
        <section className="grid gap-3">
          {journey.stages.map((stage, index) => {
            const isOpen = openStage === stage.id;
            const isComplete = completed.has(stage.id);
            return (
              <article key={stage.id} className={`overflow-hidden rounded-xl border ${isComplete ? "border-emerald-200 dark:border-emerald-500/30" : "border-lens-line"}`}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 bg-white p-4 text-left hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
                  onClick={() => setOpenStage(isOpen ? "" : stage.id)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${isComplete ? "bg-emerald-600 text-white" : "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"}`}>
                      {isComplete ? <Check size={16} /> : index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lens-ink">{stage.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-lens-muted">{stage.goal}</p>
                    </div>
                  </div>
                  <ChevronDown className={`mt-1 shrink-0 text-lens-muted transition-transform ${isOpen ? "rotate-180" : ""}`} size={18} />
                </button>

                {isOpen && (
                  <div className="grid gap-4 border-t border-lens-line bg-slate-50/70 p-4 dark:bg-slate-900/60">
                    <div className="grid gap-3 md:grid-cols-2">
                      {stage.items.length > 0 ? stage.items.map((item, itemIndex) => (
                        <div key={`${item.label}-${itemIndex}`} className="rounded-lg border border-lens-line bg-white p-3 dark:bg-slate-950">
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">{item.label}</p>
                          <p className="mt-2 text-sm leading-6 text-lens-muted">{item.content}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-lens-muted">{zh ? "当前分析没有足够信息生成这一层。" : "The current analysis does not contain enough information for this layer."}</p>
                      )}
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                        <Lightbulb size={16} />{zh ? "自我解释" : "Self-explanation"}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/80">{stage.selfExplanationPrompt}</p>
                    </div>
                    <Button variant={isComplete ? "secondary" : "primary"} onClick={() => toggleComplete(stage.id)}>
                      {isComplete ? <RotateCcw size={16} /> : <Check size={16} />}
                      {isComplete ? (zh ? "重新学习这一层" : "Reopen this layer") : (zh ? "我能用自己的话解释" : "I can explain this in my own words")}
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section className="rounded-xl border border-lens-line bg-slate-50 p-4 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <CircleHelp className="text-violet-600" size={19} />
            <h3 className="academic-title text-lg font-semibold text-lens-ink">{zh ? "确认自己是否真的理解" : "Check whether you really understand"}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-lens-muted">
            {zh ? "先在脑中或纸上回答，再展开参考答案。" : "Answer mentally or on paper before revealing the reference answer."}
          </p>
          <div className="mt-4 grid gap-3">
            {journey.checks.map((check, index) => {
              const revealed = revealedAnswers.has(check.id);
              return (
                <article key={check.id} className="rounded-lg border border-lens-line bg-white p-4 dark:bg-slate-950">
                  <div className="flex gap-3">
                    <span className="font-mono text-xs font-bold text-violet-600">Q{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-lens-ink">{check.question}</h4>
                      <p className="mt-2 text-xs leading-5 text-lens-muted">{zh ? "提示：" : "Hint: "}{check.hint}</p>
                      <button type="button" onClick={() => toggleAnswer(check.id)} className="mt-3 text-sm font-semibold text-violet-600 hover:underline">
                        {revealed ? (zh ? "隐藏参考答案" : "Hide reference answer") : (zh ? "查看参考答案" : "Reveal reference answer")}
                      </button>
                      {revealed && <p className="mt-3 rounded-lg bg-violet-50 p-3 text-sm leading-6 text-violet-950 dark:bg-violet-500/10 dark:text-violet-100">{check.answer}</p>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </CardBody>
    </Card>
  );
}
