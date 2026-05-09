import type { FormulaAnalysis } from "../../schemas/analysis";

export function exportMarkdown(analysis: FormulaAnalysis): string {
  const variables = analysis.variables
    .map((variable) => `| ${variable.symbol} | ${variable.role} | ${variable.meaning} | ${variable.adjustable ? "yes" : "no"} |`)
    .join("\n");
  const boundaries = analysis.boundaryCases.map((item) => `- **${item.title}:** ${item.description}`).join("\n");
  const pitfalls = analysis.pitfalls.map((item) => `- ${item}`).join("\n");

  return `# FormulaForge Card

## Formula

$$
${analysis.renderedLatex}
$$

## Detected Type

${analysis.detectedType}

## Intuition

${analysis.plainExplanation}

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
`;
}
