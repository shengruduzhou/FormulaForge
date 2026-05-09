import { describe, expect, it } from "vitest";
import { softmax } from "../features/visualization/math";

describe("softmax", () => {
  it("returns probabilities summing to one", () => {
    const result = softmax([2, 0, -1], 1);
    expect(result.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
  });

  it("becomes sharper with low temperature", () => {
    const low = softmax([2, 1, 0], 0.2);
    const high = softmax([2, 1, 0], 4);
    expect(low[0]).toBeGreaterThan(high[0]);
  });
});
