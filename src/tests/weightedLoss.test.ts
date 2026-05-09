import { describe, expect, it } from "vitest";
import { createVisualizationSpec } from "../features/visualization/createVisualizationSpec";

describe("weighted loss visualization spec", () => {
  it("creates adjustable lambda parameters", () => {
    const spec = createVisualizationSpec("weighted_loss");
    expect(spec.kind).toBe("weighted_contribution");
    expect(spec.parameters).toHaveLength(3);
    expect(spec.parameters.every((parameter) => parameter.min === 0)).toBe(true);
  });
});
