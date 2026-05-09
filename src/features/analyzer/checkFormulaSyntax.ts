import type { FormulaSyntaxIssue, FormulaSyntaxReport } from "../../schemas/formula";

function countMatches(value: string, pattern: RegExp): number {
  return value.match(pattern)?.length ?? 0;
}

export function checkFormulaSyntax(latex: string): FormulaSyntaxReport {
  const issues: FormulaSyntaxIssue[] = [];
  const trimmed = latex.trim();

  if (!trimmed) {
    return {
      isValid: false,
      issues: [
        {
          severity: "info",
          message: "No formula has been entered yet.",
          suggestion: "Paste LaTeX, load an example, or upload an image in a later OCR-enabled version.",
        },
      ],
    };
  }

  const openBraces = countMatches(trimmed, /\{/g);
  const closeBraces = countMatches(trimmed, /\}/g);
  if (openBraces !== closeBraces) {
    issues.push({
      severity: "error",
      message: "Curly braces are not balanced.",
      suggestion: "Check commands such as \\frac{...}{...}, subscripts, and superscripts.",
    });
  }

  const openParens = countMatches(trimmed, /\(/g);
  const closeParens = countMatches(trimmed, /\)/g);
  if (openParens !== closeParens) {
    issues.push({
      severity: "warning",
      message: "Parentheses are not balanced.",
      suggestion: "Make sure every opening parenthesis has a matching closing parenthesis.",
    });
  }

  if (/\\frac(?!\s*\{)/.test(trimmed)) {
    issues.push({
      severity: "warning",
      message: "\\frac appears without a braced numerator.",
      suggestion: "Use \\frac{numerator}{denominator}.",
    });
  }

  if (/\\lamda|\\lamba/.test(trimmed)) {
    issues.push({
      severity: "warning",
      message: "Possible OCR typo for \\lambda.",
      suggestion: "Replace \\lamda or \\lamba with \\lambda.",
    });
  }

  if (/\\sum(?!_|\^|\s)/.test(trimmed)) {
    issues.push({
      severity: "info",
      message: "\\sum has no visible index bounds.",
      suggestion: "Bounds are optional, but \\sum_i or \\sum_{i=1}^n can make the formula easier to explain.",
    });
  }

  return {
    isValid: !issues.some((issue) => issue.severity === "error"),
    issues:
      issues.length > 0
        ? issues
        : [
            {
              severity: "info",
              message: "No obvious LaTeX syntax issues found.",
            },
          ],
  };
}
