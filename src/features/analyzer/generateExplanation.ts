import type { BoundaryCase, FormulaType } from "../../schemas/formula";

interface ExplanationResult {
  plainExplanation: string;
  strictExplanation: string;
  whyItMatters: string;
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
}

export function generateExplanation(type: FormulaType): ExplanationResult {
  switch (type) {
    case "weighted_loss":
      return {
        plainExplanation:
          "This formula blends several goals into one training objective. Each λ acts like a dial: turning it up makes the optimizer care more about that term, but the raw scale of each loss still matters.",
        strictExplanation:
          "A weighted objective forms a scalar optimization target by linearly combining component losses. The optimizer minimizes the sum of λ_i L_i, so each gradient contribution is scaled by its corresponding λ_i.",
        whyItMatters:
          "Multi-objective losses appear when a paper wants a model to satisfy competing goals, such as reconstruction quality, realism, smoothness, or regularization.",
        boundaryCases: [
          {
            title: "λ_i = 0",
            description: "The corresponding objective contributes no value or gradient to the total loss.",
          },
          {
            title: "Very large λ_i",
            description: "Training can over-prioritize one term and ignore other desired behavior.",
          },
          {
            title: "Different loss scales",
            description: "A small weight can still matter if its loss value or gradient scale is large.",
          },
        ],
        pitfalls: [
          "A larger λ does not always mean the term is more important; loss scale also matters.",
          "Weighted sums hide trade-offs between objectives that may conflict during optimization.",
          "Good weights often require normalization, scheduling, or empirical tuning.",
        ],
      };
    case "softmax":
      return {
        plainExplanation:
          "Softmax turns raw scores into a probability distribution. Higher logits get more probability, and temperature controls whether the distribution is sharp or gentle.",
        strictExplanation:
          "Softmax exponentiates each scaled logit and divides by the sum of all exponentials. This produces positive outputs that sum to one and couples every probability through a shared denominator.",
        whyItMatters:
          "Softmax is the standard bridge between model scores and categorical probabilities in classifiers, attention mechanisms, and sampling systems.",
        boundaryCases: [
          {
            title: "T approaches 0",
            description: "The largest logit receives almost all probability, approaching an argmax-like choice.",
          },
          {
            title: "T approaches infinity",
            description: "The probabilities become closer to uniform because logits are flattened.",
          },
          {
            title: "Add a constant to all logits",
            description: "The output distribution does not change, because only relative differences matter.",
          },
        ],
        pitfalls: [
          "Softmax outputs compete; raising one probability lowers others.",
          "The output can look confident even when the model is wrong.",
          "Temperature changes calibration and sampling behavior without changing logit order.",
        ],
      };
    case "sigmoid":
      return {
        plainExplanation:
          "Sigmoid smoothly squashes any real number into a value between 0 and 1. It is most sensitive near zero and saturates for large positive or negative inputs.",
        strictExplanation:
          "The logistic function σ(x)=1/(1+e^{-x}) is monotonic, differentiable, and bounded. Its derivative σ(x)(1-σ(x)) is largest at x=0.",
        whyItMatters:
          "Sigmoid is useful for binary probabilities, gates, and smooth on/off behavior, especially when outputs should be independent rather than mutually exclusive.",
        boundaryCases: [
          { title: "x is very negative", description: "The output approaches 0." },
          { title: "x = 0", description: "The output is 0.5 and the curve is most sensitive." },
          { title: "x is very positive", description: "The output approaches 1." },
        ],
        pitfalls: [
          "Saturation can cause tiny gradients at extreme values.",
          "Sigmoid outputs do not sum to one across classes.",
          "For multi-class competition, softmax is usually the better fit.",
        ],
      };
    case "gradient_descent":
      return {
        plainExplanation:
          "Gradient descent updates parameters by stepping opposite the gradient. The gradient points uphill, so subtracting it moves toward lower loss.",
        strictExplanation:
          "At step t, parameters are updated by θ_{t+1}=θ_t−η∇L(θ_t). For sufficiently smooth objectives and an appropriate η, repeated updates can converge toward a local minimum.",
        whyItMatters:
          "This update rule is the backbone of modern machine learning training, from linear models to deep neural networks.",
        boundaryCases: [
          { title: "η is too small", description: "Progress is stable but slow." },
          { title: "η is moderate", description: "The path converges efficiently for the demo convex loss." },
          { title: "η is too large", description: "Updates can overshoot, oscillate, or diverge." },
        ],
        pitfalls: [
          "The negative gradient is a local direction, not a global plan.",
          "Learning rate interacts with curvature, scale, and optimizer details.",
          "Real neural losses are often non-convex, so trajectories can be more complex than the demo.",
        ],
      };
    default:
      return {
        plainExplanation:
          "FormulaForge could not confidently match this formula to an MVP template yet. Choose a formula type manually or try one of the examples.",
        strictExplanation: "No rule-based analyzer is available for this exact structure in the current MVP.",
        whyItMatters: "Unknown formulas are a deliberate extension point for future templates and LLM-assisted analysis.",
        boundaryCases: [],
        pitfalls: ["Automatic formula understanding is limited to the supported MVP families."],
      };
  }
}
