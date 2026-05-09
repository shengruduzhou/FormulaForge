import type {
  BoundaryCase,
  ComputationStep,
  FormulaType,
  PrerequisiteConcept,
  RelatedFormula,
  ToyExample,
} from "../../schemas/formula";

interface ExplanationResult {
  plainExplanation: string;
  beginnerExplanation: string;
  analogy: string;
  strictExplanation: string;
  whyItMatters: string;
  computationSteps: ComputationStep[];
  toyExample: ToyExample;
  relatedFormulas: RelatedFormula[];
  prerequisites: PrerequisiteConcept[];
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
}

const emptyToyExample: ToyExample = {
  title: "Try a concrete example",
  description: "FormulaForge needs a supported formula family before it can build a reliable numeric walkthrough.",
  steps: ["Choose a formula type manually or load one of the examples."],
  result: "No numeric result is available yet.",
};

export function generateExplanation(type: FormulaType): ExplanationResult {
  switch (type) {
    case "weighted_loss":
      return {
        plainExplanation:
          "This formula blends several goals into one training objective. Each lambda acts like a dial: turning it up makes the optimizer care more about that term, while the raw scale of each loss still matters.",
        beginnerExplanation:
          "Imagine grading a project with several rubrics: accuracy, style, and speed. A weighted loss says how much each rubric counts before adding everything into one final score.",
        analogy:
          "It is like mixing audio channels. Raising one slider makes that channel louder, but a naturally loud track may still dominate even with a smaller slider.",
        strictExplanation:
          "A weighted objective forms a scalar optimization target by linearly combining component losses. The optimizer minimizes the sum of lambda_i L_i, so each gradient contribution is scaled by its corresponding lambda_i.",
        whyItMatters:
          "Multi-objective losses appear when a paper wants a model to satisfy competing goals, such as reconstruction quality, realism, smoothness, or regularization.",
        computationSteps: [
          { title: "Read each component loss", description: "Each L_i measures one kind of error or preference." },
          { title: "Scale each component", description: "Multiply each loss by its lambda weight.", expression: "lambda_i L_i" },
          { title: "Add the scaled terms", description: "The optimizer sees one final scalar target.", expression: "L_total = sum_i lambda_i L_i" },
          { title: "Optimize the total", description: "Changing a lambda changes the trade-off between gradient directions." },
        ],
        toyExample: {
          title: "Two-loss score",
          description: "Suppose reconstruction loss is 2.0 and regularization loss is 0.5.",
          steps: ["Set lambda_rec = 1.0, so contribution is 2.0.", "Set lambda_reg = 0.4, so contribution is 0.2.", "Add them: 2.0 + 0.2."],
          result: "The total loss is 2.2, and reconstruction dominates this update.",
        },
        relatedFormulas: [
          {
            id: "mse-loss",
            latex: "L = \\frac{1}{n}\\sum_i (y_i - \\hat{y}_i)^2",
            title: "Mean Squared Error",
            domain: "ai_ml",
            relation: "used_together",
            explanation: "Often appears as one component inside a weighted objective.",
          },
          {
            id: "regularized-objective",
            latex: "J(\\theta)=L(\\theta)+\\lambda R(\\theta)",
            title: "Regularized Objective",
            domain: "ai_ml",
            relation: "special_case",
            explanation: "A common two-term weighted loss: data fit plus regularization.",
          },
        ],
        prerequisites: [
          { title: "Multiplication and addition", level: "elementary", reason: "The total is built from scaled parts." },
          { title: "Optimization objective", level: "college_basic", reason: "Training minimizes the combined scalar loss." },
        ],
        boundaryCases: [
          { title: "lambda_i = 0", description: "The corresponding objective contributes no value or gradient to the total loss." },
          { title: "Very large lambda_i", description: "Training can over-prioritize one term and ignore other desired behavior." },
          { title: "Different loss scales", description: "A small weight can still matter if its loss value or gradient scale is large." },
        ],
        pitfalls: [
          "A larger lambda does not always mean the term is more important; loss scale also matters.",
          "Weighted sums hide trade-offs between objectives that may conflict during optimization.",
          "Good weights often require normalization, scheduling, or empirical tuning.",
        ],
      };
    case "softmax":
      return {
        plainExplanation:
          "Softmax turns raw scores into a probability distribution. Higher logits get more probability, and temperature controls whether the distribution is sharp or gentle.",
        beginnerExplanation:
          "Start with several scores. Softmax turns them into percentages that add to 100%, so the biggest score usually gets the biggest share.",
        analogy:
          "Think of points in a competition being turned into vote shares. A high temperature spreads votes more evenly; a low temperature makes the winner take almost everything.",
        strictExplanation:
          "Softmax exponentiates each scaled logit and divides by the sum of all exponentials. This produces positive outputs that sum to one and couples every probability through a shared denominator.",
        whyItMatters:
          "Softmax is the standard bridge between model scores and categorical probabilities in classifiers, attention mechanisms, and sampling systems.",
        computationSteps: [
          { title: "Scale logits", description: "Divide each score by temperature T.", expression: "z_i / T" },
          { title: "Make scores positive", description: "Exponentiate the scaled logits.", expression: "exp(z_i / T)" },
          { title: "Compute the denominator", description: "Add all exponentials together.", expression: "sum_j exp(z_j / T)" },
          { title: "Normalize", description: "Divide each exponential by the shared sum so probabilities add to 1." },
        ],
        toyExample: {
          title: "Three logits",
          description: "Use logits [2, 1, 0] with T = 1.",
          steps: ["Exponentials are about [7.39, 2.72, 1.00].", "Their sum is about 11.11.", "Divide each value by 11.11."],
          result: "Probabilities are about [0.67, 0.24, 0.09].",
        },
        relatedFormulas: [
          {
            id: "sigmoid",
            latex: "\\sigma(x)=\\frac{1}{1+e^{-x}}",
            title: "Sigmoid",
            domain: "ai_ml",
            relation: "contrast",
            explanation: "Sigmoid maps one score to an independent 0-1 value; softmax makes multiple outputs compete.",
          },
          {
            id: "cross-entropy",
            latex: "L=-\\sum_i y_i\\log p_i",
            title: "Cross Entropy",
            domain: "ai_ml",
            relation: "used_together",
            explanation: "Softmax probabilities are often trained with cross entropy.",
          },
          {
            id: "log-sum-exp",
            latex: "\\log\\sum_i e^{z_i}",
            title: "Log-Sum-Exp",
            domain: "ai_ml",
            relation: "prerequisite",
            explanation: "The stable denominator trick behind many softmax implementations.",
          },
        ],
        prerequisites: [
          { title: "Exponential function", level: "high_school", reason: "Exponentials turn score gaps into positive ratios." },
          { title: "Probability normalization", level: "college_basic", reason: "Outputs must be non-negative and sum to one." },
          { title: "Indexed sums", level: "college_basic", reason: "The denominator sums over all classes." },
        ],
        boundaryCases: [
          { title: "T approaches 0", description: "The largest logit receives almost all probability, approaching an argmax-like choice." },
          { title: "T approaches infinity", description: "The probabilities become closer to uniform because logits are flattened." },
          { title: "Add a constant to all logits", description: "The output distribution does not change, because only relative differences matter." },
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
        beginnerExplanation:
          "A sigmoid is a smooth yes/no dial. Very negative inputs mean almost no, very positive inputs mean almost yes, and zero means halfway.",
        analogy:
          "It feels like a dimmer switch with soft edges instead of a hard on/off switch.",
        strictExplanation:
          "The logistic function sigma(x)=1/(1+e^{-x}) is monotonic, differentiable, and bounded. Its derivative sigma(x)(1-sigma(x)) is largest at x=0.",
        whyItMatters:
          "Sigmoid is useful for binary probabilities, gates, and smooth on/off behavior, especially when outputs should be independent rather than mutually exclusive.",
        computationSteps: [
          { title: "Negate input", description: "Start with -x." },
          { title: "Exponentiate", description: "Compute e^{-x}; this is positive." },
          { title: "Add one", description: "The denominator becomes 1 + e^{-x}." },
          { title: "Invert", description: "Take 1 divided by the denominator to get a 0-1 value." },
        ],
        toyExample: {
          title: "Input x = 0",
          description: "The midpoint is easy to compute.",
          steps: ["e^0 = 1.", "The denominator is 1 + 1 = 2.", "1 / 2 = 0.5."],
          result: "sigma(0) = 0.5.",
        },
        relatedFormulas: [
          {
            id: "softmax",
            latex: "p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}",
            title: "Softmax",
            domain: "ai_ml",
            relation: "contrast",
            explanation: "Softmax is the multi-class competitive cousin of sigmoid.",
          },
          {
            id: "binary-cross-entropy",
            latex: "L=-y\\log p-(1-y)\\log(1-p)",
            title: "Binary Cross Entropy",
            domain: "ai_ml",
            relation: "used_together",
            explanation: "A common loss for sigmoid binary outputs.",
          },
        ],
        prerequisites: [
          { title: "Exponential function", level: "high_school", reason: "The curve shape comes from e^{-x}." },
          { title: "Functions", level: "high_school", reason: "The formula maps each input to one output." },
        ],
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
        beginnerExplanation:
          "Imagine standing on a hill in fog. You feel which direction goes up most steeply, then take a small step the other way.",
        analogy:
          "It is like tuning a knob by repeatedly checking which direction makes the error worse, then moving in the opposite direction.",
        strictExplanation:
          "At step t, parameters are updated by theta_{t+1}=theta_t-eta grad L(theta_t). For sufficiently smooth objectives and an appropriate eta, repeated updates can converge toward a local minimum.",
        whyItMatters:
          "This update rule is the backbone of modern machine learning training, from linear models to deep neural networks.",
        computationSteps: [
          { title: "Evaluate current loss", description: "Look at the loss around the current parameter theta_t." },
          { title: "Compute gradient", description: "Find the local uphill direction.", expression: "grad L(theta_t)" },
          { title: "Scale the step", description: "Multiply the gradient by learning rate eta." },
          { title: "Move downhill", description: "Subtract the scaled gradient.", expression: "theta_{t+1}=theta_t-eta grad L(theta_t)" },
        ],
        toyExample: {
          title: "One-dimensional loss",
          description: "Let L(x)=x^2, start x=4, eta=0.1.",
          steps: ["Gradient is 2x, so grad=8.", "Step is eta * grad = 0.8.", "New x = 4 - 0.8."],
          result: "x becomes 3.2, closer to the minimum at 0.",
        },
        relatedFormulas: [
          {
            id: "sgd",
            latex: "\\theta_{t+1}=\\theta_t-\\eta \\nabla L_{batch}(\\theta_t)",
            title: "Stochastic Gradient Descent",
            domain: "ai_ml",
            relation: "special_case",
            explanation: "Uses a minibatch gradient instead of the full dataset gradient.",
          },
          {
            id: "adam",
            latex: "\\theta_t=\\theta_{t-1}-\\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}",
            title: "Adam",
            domain: "ai_ml",
            relation: "generalization",
            explanation: "Adds adaptive moment estimates to stabilize and rescale steps.",
          },
        ],
        prerequisites: [
          { title: "Slope and derivative", level: "college_basic", reason: "The gradient is a multi-dimensional derivative." },
          { title: "Optimization", level: "college_basic", reason: "The goal is to reduce a loss function." },
        ],
        boundaryCases: [
          { title: "eta is too small", description: "Progress is stable but slow." },
          { title: "eta is moderate", description: "The path converges efficiently for the demo convex loss." },
          { title: "eta is too large", description: "Updates can overshoot, oscillate, or diverge." },
        ],
        pitfalls: [
          "The negative gradient is a local direction, not a global plan.",
          "Learning rate interacts with curvature, scale, and optimizer details.",
          "Real neural losses are often non-convex, so trajectories can be more complex than the demo.",
        ],
      };
    case "cross_entropy":
      return {
        plainExplanation: "Cross entropy measures how surprised the model is by the correct answer. Confident wrong predictions receive a large penalty.",
        beginnerExplanation: "If the true class should get high probability, cross entropy rewards high probability there and punishes low probability sharply.",
        analogy: "It is like a quiz score where being confidently wrong costs much more than being unsure.",
        strictExplanation: "For a target distribution y and predicted distribution p, cross entropy is H(y,p)=-sum_i y_i log p_i. With one-hot labels, it reduces to -log p_correct.",
        whyItMatters: "It is the standard classification loss paired with softmax outputs.",
        computationSteps: [
          { title: "Take predicted probabilities", description: "Use p_i from softmax or another probability model." },
          { title: "Select true targets", description: "The target y_i marks which outcomes should count." },
          { title: "Apply log penalty", description: "Low probability on the true class creates a large negative log." },
          { title: "Sum and negate", description: "The final loss is positive and smaller when predictions match targets." },
        ],
        toyExample: {
          title: "One-hot class",
          description: "Correct class probability is 0.8.",
          steps: ["Only the correct class has y=1.", "Loss = -log(0.8).", "That is about 0.22."],
          result: "If p_correct drops to 0.1, loss jumps to about 2.30.",
        },
        relatedFormulas: [
          { id: "softmax", latex: "p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}", title: "Softmax", domain: "ai_ml", relation: "used_together", explanation: "Usually produces the probability vector p." },
          { id: "kl-divergence", latex: "D_{KL}(y\\|p)=\\sum_i y_i\\log\\frac{y_i}{p_i}", title: "KL Divergence", domain: "math_stats", relation: "used_together", explanation: "Cross entropy differs from KL by the entropy of the target distribution." },
        ],
        prerequisites: [
          { title: "Logarithms", level: "high_school", reason: "The penalty uses -log probability." },
          { title: "Probability distributions", level: "college_basic", reason: "Both y and p are distributions over outcomes." },
        ],
        boundaryCases: [
          { title: "p_correct approaches 1", description: "The loss approaches 0." },
          { title: "p_correct approaches 0", description: "The loss grows without bound." },
        ],
        pitfalls: ["Cross entropy expects probabilities, not arbitrary logits.", "A lower loss means better alignment with targets, not necessarily calibrated confidence."],
      };
    case "bayes_rule":
      return {
        plainExplanation: "Bayes' rule updates a belief after seeing evidence. It combines prior belief and likelihood into a posterior belief.",
        beginnerExplanation: "Start with how likely something seemed before. Then adjust it using how well the new evidence fits that possibility.",
        analogy: "It is like revising a suspect list after hearing a new clue.",
        strictExplanation: "Bayes' rule states P(A|B)=P(B|A)P(A)/P(B), where P(A|B) is posterior, P(A) is prior, P(B|A) is likelihood, and P(B) normalizes the result.",
        whyItMatters: "It is a foundation for probabilistic inference, classifiers, statistics, and Bayesian machine learning.",
        computationSteps: [
          { title: "Choose the hypothesis", description: "A is the thing you want to know." },
          { title: "Observe evidence", description: "B is the evidence you have seen." },
          { title: "Multiply prior and likelihood", description: "Combine belief before evidence with evidence fit.", expression: "P(B|A)P(A)" },
          { title: "Normalize", description: "Divide by P(B) so probabilities remain valid." },
        ],
        toyExample: {
          title: "Simple update",
          description: "Suppose P(A)=0.2, P(B|A)=0.9, and P(B)=0.3.",
          steps: ["Numerator: 0.9 * 0.2 = 0.18.", "Divide by 0.3.", "Posterior is 0.6."],
          result: "After evidence B, belief in A rises from 0.2 to 0.6.",
        },
        relatedFormulas: [
          { id: "total-probability", latex: "P(B)=\\sum_i P(B|A_i)P(A_i)", title: "Law of Total Probability", domain: "math_stats", relation: "prerequisite", explanation: "Often supplies the normalizing denominator." },
        ],
        prerequisites: [
          { title: "Conditional probability", level: "college_basic", reason: "Bayes' rule is built from P(A|B) and P(B|A)." },
          { title: "Fractions", level: "elementary", reason: "The denominator normalizes the result." },
        ],
        boundaryCases: [
          { title: "Evidence impossible", description: "If P(B)=0, the conditional probability is undefined." },
          { title: "Evidence strongly matches A", description: "Large P(B|A) increases the posterior when the denominator is fixed." },
        ],
        pitfalls: ["P(A|B) and P(B|A) are not the same.", "A strong likelihood cannot rescue a prior of exactly zero."],
      };
    case "combination":
      return {
        plainExplanation: "A combination counts how many ways you can choose k items from n items when order does not matter.",
        beginnerExplanation: "If choosing Alice then Bob is the same as choosing Bob then Alice, use combinations.",
        analogy: "It is like choosing a team from a class: the team is the same no matter the order you name students.",
        strictExplanation: "The binomial coefficient C(n,k)=n!/(k!(n-k)!) counts k-element subsets of an n-element set.",
        whyItMatters: "Combinations appear in counting, probability, binomial expansions, graph choices, and discrete math proofs.",
        computationSteps: [
          { title: "Count ordered choices", description: "There are n(n-1)... choices if order mattered." },
          { title: "Remove duplicate orders", description: "Each chosen group has k! internal orderings." },
          { title: "Use the closed form", description: "Divide ordered choices by duplicates.", expression: "\\binom{n}{k}=\\frac{n!}{k!(n-k)!}" },
        ],
        toyExample: {
          title: "Choose 2 from 4",
          description: "Items are A, B, C, D.",
          steps: ["Possible pairs: AB, AC, AD, BC, BD, CD.", "There are 6 pairs.", "Formula gives 4!/(2!2!) = 6."],
          result: "C(4,2)=6.",
        },
        relatedFormulas: [
          { id: "permutation", latex: "P(n,k)=\\frac{n!}{(n-k)!}", title: "Permutation", domain: "discrete_math", relation: "contrast", explanation: "Counts selections where order matters." },
          { id: "binomial-theorem", latex: "(x+y)^n=\\sum_k \\binom{n}{k}x^{n-k}y^k", title: "Binomial Theorem", domain: "discrete_math", relation: "application", explanation: "Combinations become coefficients in expansions." },
        ],
        prerequisites: [
          { title: "Factorials", level: "high_school", reason: "The formula uses n!." },
          { title: "Counting without order", level: "college_basic", reason: "The key idea is removing duplicate arrangements." },
        ],
        boundaryCases: [
          { title: "k = 0", description: "There is exactly one way to choose nothing." },
          { title: "k = n", description: "There is exactly one way to choose everything." },
          { title: "k > n", description: "There are no valid choices." },
        ],
        pitfalls: ["Do not use combinations when order matters.", "n and k should be non-negative integers with k <= n."],
      };
    case "set_identity":
      return {
        plainExplanation: "This formula describes how sets overlap, combine, or subtract from each other.",
        beginnerExplanation: "Think of sets as circles of objects. Union means everything in either circle; intersection means the overlap.",
        analogy: "It is like two guest lists: union is everyone invited by either list, intersection is people on both lists.",
        strictExplanation: "Set identities relate membership conditions such as x in A union B, x in A intersection B, and cardinalities such as |A union B|.",
        whyItMatters: "Set formulas are the grammar of discrete math, probability events, database queries, and logic.",
        computationSteps: [
          { title: "Identify each set", description: "Name what belongs to A and what belongs to B." },
          { title: "Apply the operation", description: "Union keeps elements in A or B; intersection keeps elements in both." },
          { title: "Correct for overlap", description: "When counting a union, subtract the intersection if it was counted twice." },
        ],
        toyExample: {
          title: "Two small sets",
          description: "A={1,2,3}, B={3,4}.",
          steps: ["A union B = {1,2,3,4}.", "A intersection B = {3}.", "|A| + |B| - |A intersection B| = 3 + 2 - 1."],
          result: "|A union B| = 4.",
        },
        relatedFormulas: [
          { id: "inclusion-exclusion", latex: "|A\\cup B|=|A|+|B|-|A\\cap B|", title: "Inclusion-Exclusion", domain: "discrete_math", relation: "generalization", explanation: "The counting rule for overlapping sets." },
          { id: "de-morgan", latex: "\\overline{A\\cup B}=\\overline{A}\\cap\\overline{B}", title: "De Morgan's Law", domain: "discrete_math", relation: "used_together", explanation: "Connects set operations with logical negation." },
        ],
        prerequisites: [
          { title: "Set membership", level: "elementary", reason: "You need to know whether an object belongs to a set." },
          { title: "Logical or/and", level: "high_school", reason: "Union behaves like or; intersection behaves like and." },
        ],
        boundaryCases: [
          { title: "Disjoint sets", description: "If A and B do not overlap, |A union B|=|A|+|B|." },
          { title: "Same set", description: "If A=B, the union and intersection are both A." },
        ],
        pitfalls: ["Union is not ordinary addition when sets overlap.", "The symbol \\cup means union, while \\cap means intersection."],
      };
    case "graph_degree":
      return {
        plainExplanation: "A graph formula describes nodes and edges. The degree of a node counts how many edges touch it.",
        beginnerExplanation: "Picture dots connected by lines. A dot with three lines attached has degree 3.",
        analogy: "It is like a social network: a person's degree is how many direct connections they have.",
        strictExplanation: "For an undirected graph G=(V,E), deg(v) is the number of incident edges at vertex v. The handshaking lemma states sum_{v in V} deg(v)=2|E|.",
        whyItMatters: "Graph degree is a basic measurement for networks, algorithms, discrete math proofs, and graph learning.",
        computationSteps: [
          { title: "List vertices", description: "Vertices are the nodes in V." },
          { title: "List edges", description: "Edges are the connections in E." },
          { title: "Count incident edges", description: "For one vertex, count all edges touching it." },
          { title: "Check total degree", description: "In an undirected graph, every edge contributes 2 to the degree sum." },
        ],
        toyExample: {
          title: "Three-node path",
          description: "Edges are AB and BC.",
          steps: ["deg(A)=1.", "deg(B)=2.", "deg(C)=1.", "Total degree is 4."],
          result: "There are 2 edges, and 2|E|=4, matching the degree sum.",
        },
        relatedFormulas: [
          { id: "adjacency-matrix", latex: "A_{ij}=1 \\text{ if } (i,j)\\in E", title: "Adjacency Matrix", domain: "discrete_math", relation: "used_together", explanation: "Stores graph edges in a matrix." },
          { id: "shortest-path", latex: "d(s,v)=\\min_{(u,v)\\in E} d(s,u)+w(u,v)", title: "Shortest Path Recurrence", domain: "discrete_math", relation: "application", explanation: "Uses graph edges to reason about distances." },
        ],
        prerequisites: [
          { title: "Nodes and edges", level: "elementary", reason: "Graphs are built from dots and connections." },
          { title: "Summation", level: "high_school", reason: "The handshaking lemma sums degrees over vertices." },
        ],
        boundaryCases: [
          { title: "Isolated vertex", description: "A node with no touching edges has degree 0." },
          { title: "Self-loop", description: "In many undirected conventions, a self-loop contributes 2 to degree." },
        ],
        pitfalls: ["Directed graphs have in-degree and out-degree, which differ from undirected degree.", "Parallel edges may change degree counts depending on graph type."],
      };
    default:
      return {
        plainExplanation:
          "FormulaForge could not confidently match this formula to a supported template yet. Choose a formula type manually, add paper context, or try one of the examples.",
        beginnerExplanation:
          "The app can still render the formula, but it does not yet know the right teaching path or visualization for this structure.",
        analogy: "This is like seeing a sentence in a language where the letters are readable but the grammar is not recognized yet.",
        strictExplanation: "No rule-based analyzer is available for this exact structure in the current MVP.",
        whyItMatters: "Unknown formulas are a deliberate extension point for future AST and LLM-assisted analysis.",
        computationSteps: [],
        toyExample: emptyToyExample,
        relatedFormulas: [],
        prerequisites: [],
        boundaryCases: [],
        pitfalls: ["Automatic formula understanding is limited to the supported formula families."],
      };
  }
}
