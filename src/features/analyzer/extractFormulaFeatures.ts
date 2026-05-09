import type { FormulaFeatureSet } from "../../schemas/formula";
import { normalizeLatex } from "./normalizeLatex";

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function extractFormulaFeatures(latex: string): FormulaFeatureSet {
  const normalized = normalizeLatex(latex);
  const compact = normalized.replace(/\s+/g, "");
  const lower = normalized.toLowerCase();

  const operators = unique([
    normalized.includes("\\frac") ? "\\frac" : "",
    normalized.includes("\\sum") ? "\\sum" : "",
    normalized.includes("\\prod") ? "\\prod" : "",
    normalized.includes("\\cup") ? "\\cup" : "",
    normalized.includes("\\cap") ? "\\cap" : "",
    normalized.includes("\\forall") ? "\\forall" : "",
    normalized.includes("\\exists") ? "\\exists" : "",
    normalized.includes("\\in") ? "\\in" : "",
    normalized.includes("\\nabla") ? "\\nabla" : "",
    normalized.includes("\\deg") ? "\\deg" : "",
    normalized.includes("!") ? "!" : "",
  ]);

  const functions = unique([
    /\\sigma|sigmoid/i.test(normalized) ? "sigmoid" : "",
    /softmax/i.test(normalized) ? "softmax" : "",
    /\\log|log/i.test(normalized) ? "log" : "",
    /\\exp|e\^/i.test(normalized) ? "exp" : "",
    /\\deg|deg/i.test(normalized) ? "deg" : "",
  ]);

  const identifiers = unique(
    Array.from(normalized.matchAll(/\\?[a-zA-Z](?:_\{?[a-zA-Z0-9]+\}?|\^\{?[a-zA-Z0-9+-]+\}?)?/g)).map((match) =>
      match[0].replace(/^\\(frac|sum|log|exp|cup|cap|in|forall|exists|deg|theta|lambda|sigma|nabla)$/g, ""),
    ),
  ).slice(0, 16);

  return {
    hasFraction: normalized.includes("\\frac") || /\/.+/.test(normalized),
    hasSummation: normalized.includes("\\sum"),
    hasExponent: /\^|\\exp|e\^/.test(normalized),
    hasLog: /\\log|log/i.test(normalized),
    hasFactorial: normalized.includes("!"),
    hasSetOperator: /\\cup|\\cap|\\setminus|\\subset/.test(normalized),
    hasGraphOperator: /\\deg|deg|G=\(V,E\)|2\|E\|/i.test(normalized),
    hasQuantifier: /\\forall|\\exists|∀|∃/.test(normalized),
    hasRecurrence: /_\{?n\+1\}?|_\{?n-1\}?|a_n|a_\{n\}/.test(compact) || lower.includes("recurrence"),
    operators,
    functions,
    identifiers,
  };
}
