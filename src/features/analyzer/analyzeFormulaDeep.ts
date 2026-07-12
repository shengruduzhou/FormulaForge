import type { DeepAnalysisRequest, DeepFormulaAnalysis } from "../../schemas/deepAnalysis";

interface DeepAnalysisResponse {
  analysis?: DeepFormulaAnalysis | null;
  error?: string;
}

export async function analyzeFormulaDeep(request: DeepAnalysisRequest): Promise<DeepFormulaAnalysis> {
  const response = await fetch("/api/formula/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload = (await response.json().catch(() => ({}))) as DeepAnalysisResponse;
  if (!response.ok || !payload.analysis) {
    throw new Error(payload.error || `Deep analysis failed with status ${response.status}.`);
  }

  return payload.analysis;
}
