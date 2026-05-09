const formulaPatterns = [
  /\$\$([\s\S]+?)\$\$/g,
  /\$([^$\n]+?)\$/g,
  /\\\[([\s\S]+?)\\\]/g,
  /\\\(([\s\S]+?)\\\)/g,
  /\\begin\{(?:equation|align|gather|multline)\*?\}([\s\S]+?)\\end\{(?:equation|align|gather|multline)\*?\}/g,
];

function normalizeCandidate(candidate) {
  return candidate
    .replace(/\\begin\{[^}]+\}/g, "")
    .replace(/\\end\{[^}]+\}/g, "")
    .replace(/\\\\/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildContext(content, index, length) {
  const start = Math.max(0, index - 280);
  const end = Math.min(content.length, index + length + 280);
  const beforeContext = content.slice(start, index).trim();
  const afterContext = content.slice(index + length, end).trim();

  return {
    beforeContext,
    afterContext,
  };
}

export function extractFormulaCandidates(content, sourceType = "text") {
  if (!content.trim()) return [];

  const candidates = [];
  const seen = new Set();

  for (const pattern of formulaPatterns) {
    for (const match of content.matchAll(pattern)) {
      const rawText = match[0];
      const latex = normalizeCandidate(match[1] ?? rawText);
      if (!latex || seen.has(latex)) continue;

      seen.add(latex);
      const context = buildContext(content, match.index ?? 0, rawText.length);
      candidates.push({
        id: `formula-${candidates.length + 1}`,
        sourceType,
        latex,
        rawText,
        confidence: latex.length > 4 ? 0.82 : 0.45,
        ...context,
      });
    }
  }

  return candidates;
}
