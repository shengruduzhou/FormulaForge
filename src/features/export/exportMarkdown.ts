import type { FormulaAnalysis } from "../../schemas/analysis";

export function exportMarkdown(analysis: FormulaAnalysis): string {
  const variables = analysis.variables
    .map((variable) => `| ${variable.symbol} | ${variable.role} | ${variable.meaning} | ${variable.adjustable ? "yes" : "no"} |`)
    .join("\n");
  const boundaries = analysis.boundaryCases.map((item) => `- **${item.title}:** ${item.description}`).join("\n");
  const pitfalls = analysis.pitfalls.map((item) => `- ${item}`).join("\n");
  const steps = analysis.computationSteps.map((step, index) => `${index + 1}. **${step.title}:** ${step.description}`).join("\n");
  const related = analysis.relatedFormulas.map((item) => `- **${item.title}** (${item.relation}): ${item.latex}`).join("\n");
  const prerequisites = analysis.prerequisites.map((item) => `- **${item.title}** (${item.level}): ${item.reason}`).join("\n");
  const scores = analysis.detectionScores.map((item) => `- ${item.type}: ${item.score.toFixed(2)}`).join("\n");

  return `# FormulaForge Card

## Formula

$$
${analysis.renderedLatex}
$$

## Detected Type

${analysis.detectedType}

## Parser Evidence

Confidence: ${Math.round(analysis.confidence * 100)}%

${scores || "- No strong competing scores"}

## Intuition

${analysis.plainExplanation}

## Beginner Explanation

${analysis.beginnerExplanation}

## Analogy

${analysis.analogy}

## Computation Steps

${steps}

## Toy Example

${analysis.toyExample.description}

${analysis.toyExample.steps.map((step) => `- ${step}`).join("\n")}

**Result:** ${analysis.toyExample.result}

## Strict Explanation

${analysis.strictExplanation}

## Variables

| Symbol | Role | Meaning | Adjustable |
| --- | --- | --- | --- |
${variables}

## Boundary Cases

${boundaries}

## Pitfalls

${pitfalls}

## Learning Path

${prerequisites}

## Related Formulas

${related}
`;
}
