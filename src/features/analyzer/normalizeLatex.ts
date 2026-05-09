export function normalizeLatex(latex: string): string {
  return latex
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "");
}
