export function normalizeLatex(latex: string): string {
  return latex
    .replace(/^\s*\$\$?/, "")
    .replace(/\$\$?\s*$/, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\s+/g, " ")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\mathrm\{d\}/g, "d")
    .trim();
}
