import type {
  BoundaryCase,
  ComputationStep,
  Domain,
  FormulaType,
  PrerequisiteConcept,
  ReadingOrderItem,
  RelatedFormula,
  SymbolExplanation,
  ToyExample,
  VariableExplanation,
} from "../../schemas/formula";

export interface FormulaBlueprint {
  type: FormulaType;
  domain: Domain;
  oneLineIntuition: string;
  plainExplanation: string;
  beginnerExplanation: string;
  analogy: string;
  strictExplanation: string;
  whyItMatters: string;
  variables: VariableExplanation[];
  symbols: SymbolExplanation[];
  readingOrder: ReadingOrderItem[];
  computationSteps: ComputationStep[];
  toyExample: ToyExample;
  relatedFormulas: RelatedFormula[];
  prerequisites: PrerequisiteConcept[];
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
}

const noVariables: VariableExplanation[] = [];

export const formulaBlueprints: Record<FormulaType, FormulaBlueprint> = {
  weighted_loss: {
    type: "weighted_loss",
    domain: "ai_ml",
    oneLineIntuition: "A weighted loss turns several training goals into one score by giving each goal a volume knob.",
    plainExplanation: "Each component loss measures one kind of error, and each lambda decides how loudly that error speaks in the final objective.",
    beginnerExplanation: "Think of a final grade built from homework, exams, and participation. Each part has a score and a weight; the formula multiplies each score by its weight and then adds the results.",
    analogy: "It is a mixer board: every loss is an audio track, and every lambda is a slider.",
    strictExplanation: "A weighted objective is a linear scalarization of multiple loss functions. During optimization, each component gradient is scaled by its weight before being added to the update signal.",
    whyItMatters: "Many papers train one model to satisfy several goals at once, so the weights reveal the trade-off the author chose.",
    variables: [
      { symbol: "\\lambda_i", role: "weight", meaning: "Controls the influence of loss term i.", adjustable: true, defaultValue: 1, min: 0, max: 3, step: 0.1 },
      { symbol: "L_i", role: "loss term", meaning: "One measurable objective being optimized.", adjustable: true, defaultValue: 1, min: 0, max: 5, step: 0.1 },
    ],
    symbols: [
      { symbol: "\\lambda_i", name: "lambda weight", category: "variable", meaning: "Importance multiplier for a component loss.", readAs: "lambda i" },
      { symbol: "L_i", name: "component loss", category: "variable", meaning: "A separate error score.", readAs: "loss i" },
      { symbol: "\\sum", name: "summation", category: "operator", meaning: "Adds all weighted terms.", readAs: "sum over i" },
    ],
    readingOrder: [
      { order: 1, fragment: "L_i", explanation: "Start with each separate loss value." },
      { order: 2, fragment: "\\lambda_i L_i", explanation: "Scale each loss by its chosen weight." },
      { order: 3, fragment: "\\sum_i", explanation: "Add scaled losses into one objective." },
    ],
    computationSteps: [
      { title: "Measure component losses", description: "Compute each separate loss term." },
      { title: "Apply weights", description: "Multiply every term by its lambda.", expression: "\\lambda_i L_i" },
      { title: "Sum into one objective", description: "The optimizer minimizes the final scalar.", expression: "L=\\sum_i\\lambda_i L_i" },
    ],
    toyExample: {
      title: "Two-loss objective",
      description: "Let L1=2, L2=0.5, lambda1=1, lambda2=0.4.",
      steps: ["Contribution 1 is 1*2=2.", "Contribution 2 is 0.4*0.5=0.2.", "Add them."],
      result: "The total loss is 2.2.",
    },
    relatedFormulas: [
      { id: "regularized-objective", latex: "J(\\theta)=L(\\theta)+\\lambda R(\\theta)", title: "Regularized Objective", domain: "ai_ml", relation: "special_case", explanation: "A common two-term weighted objective." },
      { id: "mse", latex: "L=\\frac1n\\sum_i(y_i-\\hat y_i)^2", title: "Mean Squared Error", domain: "ai_ml", relation: "used_together", explanation: "Often appears as a component loss." },
    ],
    prerequisites: [
      { title: "Multiplication and addition", level: "elementary", reason: "The formula scales values and adds them." },
      { title: "Optimization objective", level: "college_basic", reason: "The combined score is what training minimizes." },
    ],
    boundaryCases: [
      { title: "\\lambda_i=0", description: "That loss term has no effect on the total or gradient." },
      { title: "Very large weight", description: "One objective can dominate the update and suppress the others." },
      { title: "Different scales", description: "A small weight can still matter if its loss values or gradients are large." },
    ],
    pitfalls: ["Weight size and real influence are not the same thing.", "Weighted sums can hide conflicts between goals."],
  },
  sigmoid: {
    type: "sigmoid",
    domain: "ai_ml",
    oneLineIntuition: "Sigmoid turns one unrestricted score into a smooth 0-to-1 value.",
    plainExplanation: "Large negative inputs become close to 0, large positive inputs become close to 1, and x=0 lands exactly halfway.",
    beginnerExplanation: "It is a soft yes/no dial. Instead of jumping from no to yes, it slides gradually.",
    analogy: "A dimmer switch with soft edges rather than a hard light switch.",
    strictExplanation: "The logistic function sigma(x)=1/(1+e^{-x}) is monotone, differentiable, bounded, and has derivative sigma(x)(1-sigma(x)).",
    whyItMatters: "It is used for binary probabilities and gates where outputs should be independent.",
    variables: [
      { symbol: "x", role: "input score", meaning: "Any real number fed into the curve.", adjustable: true, defaultValue: 0, min: -8, max: 8, step: 0.1 },
      { symbol: "\\sigma(x)", role: "output", meaning: "The resulting value between 0 and 1.", adjustable: false },
    ],
    symbols: [
      { symbol: "\\sigma", name: "sigmoid", category: "function", meaning: "The logistic squashing function.", readAs: "sigma" },
      { symbol: "e^{-x}", name: "negative exponential", category: "function", meaning: "Creates the S-shaped curve.", readAs: "e to the negative x" },
      { symbol: "\\frac{1}{...}", name: "reciprocal", category: "operator", meaning: "Turns the denominator into a bounded output.", readAs: "one over" },
    ],
    readingOrder: [
      { order: 1, fragment: "-x", explanation: "Flip the input sign." },
      { order: 2, fragment: "e^{-x}", explanation: "Exponentiate to make a positive denominator part." },
      { order: 3, fragment: "1+e^{-x}", explanation: "Add 1 so the denominator is at least 1." },
      { order: 4, fragment: "\\frac{1}{1+e^{-x}}", explanation: "Take the reciprocal to get a value in (0,1)." },
    ],
    computationSteps: [
      { title: "Negate x", description: "Start with -x." },
      { title: "Exponentiate", description: "Compute e^{-x}." },
      { title: "Build denominator", description: "Add 1.", expression: "1+e^{-x}" },
      { title: "Invert", description: "Divide 1 by that denominator." },
    ],
    toyExample: { title: "At x=0", description: "The midpoint is exact.", steps: ["e^0=1.", "Denominator is 2.", "1/2=0.5."], result: "\\sigma(0)=0.5." },
    relatedFormulas: [
      { id: "softmax", latex: "p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}", title: "Softmax", domain: "ai_ml", relation: "contrast", explanation: "Softmax is the competing multi-class version." },
      { id: "binary-cross-entropy", latex: "-y\\log p-(1-y)\\log(1-p)", title: "Binary Cross Entropy", domain: "ai_ml", relation: "used_together", explanation: "Common loss paired with sigmoid probabilities." },
    ],
    prerequisites: [
      { title: "Exponents", level: "high_school", reason: "The shape comes from e^{-x}." },
      { title: "Functions", level: "high_school", reason: "One input maps to one output." },
    ],
    boundaryCases: [
      { title: "x -> -infinity", description: "The output approaches 0." },
      { title: "x = 0", description: "The output is 0.5 and slope is largest." },
      { title: "x -> infinity", description: "The output approaches 1." },
    ],
    pitfalls: ["Extreme inputs saturate and give tiny gradients.", "Multiple sigmoid outputs do not automatically sum to one."],
  },
  softmax: {
    type: "softmax",
    domain: "ai_ml",
    oneLineIntuition: "Softmax turns competing scores into probabilities that add to one.",
    plainExplanation: "Each score is exponentiated, then divided by the total of all exponentiated scores.",
    beginnerExplanation: "Imagine turning race scores into shares of a pie. Bigger scores get bigger slices, but every slice must fit into one whole pie.",
    analogy: "A vote allocator: high scores attract more votes, but total votes are fixed.",
    strictExplanation: "p_i=e^{z_i}/sum_j e^{z_j} maps logits to the probability simplex and is invariant to adding the same constant to all logits.",
    whyItMatters: "Softmax is the usual final step in classifiers and attention mechanisms.",
    variables: [
      { symbol: "z_i", role: "logit", meaning: "Raw score for item i.", adjustable: true, defaultValue: 2, min: -5, max: 5, step: 0.1 },
      { symbol: "p_i", role: "probability", meaning: "Normalized probability for item i.", adjustable: false },
    ],
    symbols: [
      { symbol: "e^{z_i}", name: "exponential score", category: "function", meaning: "Makes every score positive.", readAs: "e to the z i" },
      { symbol: "\\sum_j", name: "sum over classes", category: "operator", meaning: "Adds all positive scores.", readAs: "sum over j" },
      { symbol: "\\frac", name: "normalization fraction", category: "operator", meaning: "Divides one positive score by the total.", readAs: "divided by" },
    ],
    readingOrder: [
      { order: 1, fragment: "z_i", explanation: "Start with raw scores." },
      { order: 2, fragment: "e^{z_i}", explanation: "Exponentiate each score." },
      { order: 3, fragment: "\\sum_j e^{z_j}", explanation: "Compute the shared total." },
      { order: 4, fragment: "\\frac{e^{z_i}}{\\sum_j e^{z_j}}", explanation: "Divide each item by the total." },
    ],
    computationSteps: [
      { title: "Exponentiate scores", description: "Turn logits into positive values." },
      { title: "Add all exponentials", description: "Build one denominator shared by every class." },
      { title: "Normalize each class", description: "Divide each exponential by the shared sum." },
    ],
    toyExample: { title: "Scores [2,1,0]", description: "Use three logits.", steps: ["Exponentials are about [7.39,2.72,1].", "Total is 11.11.", "Divide each by 11.11."], result: "Probabilities are about [0.67,0.24,0.09]." },
    relatedFormulas: [
      { id: "cross-entropy", latex: "H(p,q)=-\\sum_i p_i\\log q_i", title: "Cross Entropy", domain: "math_stats", relation: "used_together", explanation: "Trains softmax distributions against targets." },
      { id: "log-sum-exp", latex: "\\log\\sum_i e^{z_i}", title: "Log-Sum-Exp", domain: "ai_ml", relation: "prerequisite", explanation: "Numerically stable companion to softmax." },
    ],
    prerequisites: [
      { title: "Exponentials", level: "high_school", reason: "They convert differences into ratios." },
      { title: "Probability normalization", level: "college_basic", reason: "Outputs must sum to one." },
    ],
    boundaryCases: [
      { title: "One score much larger", description: "Its probability approaches 1." },
      { title: "All scores equal", description: "The distribution is uniform." },
      { title: "Add a constant to all scores", description: "The probabilities do not change." },
    ],
    pitfalls: ["Softmax probabilities compete.", "Large logits require numerical stabilization."],
  },
  cross_entropy: {
    type: "cross_entropy",
    domain: "math_stats",
    oneLineIntuition: "Cross entropy measures how expensive it is to believe q when reality follows p.",
    plainExplanation: "It averages the surprise -log q_i using p_i as the importance of each outcome.",
    beginnerExplanation: "If the true outcome is likely under p but q assigns it a tiny probability, the formula charges a big penalty.",
    analogy: "A weather forecast penalty: missing common events hurts more than missing rare events.",
    strictExplanation: "H(p,q)=-sum_i p_i log q_i is the expected code length under q for samples drawn from p.",
    whyItMatters: "It is central to classification, language modeling, compression, and distribution matching.",
    variables: [
      { symbol: "p_i", role: "target probability", meaning: "How often outcome i truly occurs.", adjustable: false },
      { symbol: "q_i", role: "predicted probability", meaning: "How much probability the model assigns to i.", adjustable: true, defaultValue: 0.8, min: 0.01, max: 1, step: 0.01 },
    ],
    symbols: [
      { symbol: "-", name: "negative sign", category: "operator", meaning: "Makes log penalties positive.", readAs: "negative" },
      { symbol: "\\sum_i", name: "expected sum", category: "operator", meaning: "Aggregates over outcomes.", readAs: "sum over i" },
      { symbol: "\\log q_i", name: "log prediction", category: "function", meaning: "Turns low probabilities into large penalties.", readAs: "log q i" },
    ],
    readingOrder: [
      { order: 1, fragment: "q_i", explanation: "Read the predicted probability for outcome i." },
      { order: 2, fragment: "\\log q_i", explanation: "Take its logarithm." },
      { order: 3, fragment: "p_i\\log q_i", explanation: "Weight by how important that outcome is under p." },
      { order: 4, fragment: "-\\sum_i", explanation: "Add and negate to get positive loss." },
    ],
    computationSteps: [
      { title: "Take log predictions", description: "Compute log q_i for each outcome." },
      { title: "Weight by true distribution", description: "Multiply each log prediction by p_i." },
      { title: "Sum and negate", description: "The final value is smaller when q matches p." },
    ],
    toyExample: { title: "One-hot target", description: "If the correct class has q=0.8.", steps: ["Only one p_i is 1.", "Loss is -log(0.8).", "That is about 0.22."], result: "If q falls to 0.1, loss jumps to about 2.30." },
    relatedFormulas: [
      { id: "kl-divergence", latex: "D_{KL}(p\\|q)=\\sum_i p_i\\log\\frac{p_i}{q_i}", title: "KL Divergence", domain: "math_stats", relation: "used_together", explanation: "Cross entropy equals entropy plus KL divergence." },
      { id: "softmax", latex: "q_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}", title: "Softmax", domain: "ai_ml", relation: "used_together", explanation: "Often produces q_i." },
    ],
    prerequisites: [
      { title: "Logarithms", level: "high_school", reason: "The penalty uses log probability." },
      { title: "Expected value", level: "college_basic", reason: "p_i weights the average surprise." },
    ],
    boundaryCases: [
      { title: "q_i=1 for true outcome", description: "That outcome contributes zero loss." },
      { title: "q_i -> 0 while p_i > 0", description: "Loss grows without bound." },
    ],
    pitfalls: ["q_i must be a probability.", "Cross entropy is not symmetric in p and q."],
  },
  bayes_rule: {
    type: "bayes_rule",
    domain: "math_stats",
    oneLineIntuition: "Bayes' rule updates a prior belief after evidence arrives.",
    plainExplanation: "Posterior belief equals evidence fit times prior belief, divided by how common the evidence is overall.",
    beginnerExplanation: "Start with what you believed before, boost it if the evidence fits, then normalize so it remains a probability.",
    analogy: "Re-ranking suspects after a clue: suspects who make the clue likely move up.",
    strictExplanation: "P(A|B)=P(B|A)P(A)/P(B), derived from the symmetry P(A∩B)=P(A|B)P(B)=P(B|A)P(A).",
    whyItMatters: "It powers probabilistic inference, Bayesian statistics, and diagnostic reasoning.",
    variables: noVariables,
    symbols: [
      { symbol: "P(A|B)", name: "posterior", category: "function", meaning: "Belief in A after seeing B.", readAs: "probability of A given B" },
      { symbol: "P(A)", name: "prior", category: "function", meaning: "Belief in A before B.", readAs: "probability of A" },
      { symbol: "P(B|A)", name: "likelihood", category: "function", meaning: "How likely B is if A is true.", readAs: "probability of B given A" },
      { symbol: "P(B)", name: "evidence", category: "function", meaning: "Overall chance of observing B.", readAs: "probability of B" },
    ],
    readingOrder: [
      { order: 1, fragment: "P(A)", explanation: "Start with prior belief." },
      { order: 2, fragment: "P(B|A)", explanation: "Measure how well evidence B fits A." },
      { order: 3, fragment: "P(B|A)P(A)", explanation: "Combine prior and evidence fit." },
      { order: 4, fragment: "/P(B)", explanation: "Normalize by overall evidence probability." },
    ],
    computationSteps: [
      { title: "Multiply likelihood and prior", description: "Build the numerator." },
      { title: "Divide by evidence", description: "Normalize the result." },
    ],
    toyExample: { title: "Small update", description: "P(A)=0.2, P(B|A)=0.9, P(B)=0.3.", steps: ["Numerator is 0.18.", "Divide by 0.3."], result: "Posterior is 0.6." },
    relatedFormulas: [
      { id: "total-probability", latex: "P(B)=\\sum_iP(B|A_i)P(A_i)", title: "Law of Total Probability", domain: "math_stats", relation: "prerequisite", explanation: "Often computes the denominator." },
      { id: "naive-bayes", latex: "P(C|x_1,...,x_n)\\propto P(C)\\prod_iP(x_i|C)", title: "Naive Bayes", domain: "ai_ml", relation: "application", explanation: "Applies Bayes' rule to classification." },
    ],
    prerequisites: [
      { title: "Conditional probability", level: "college_basic", reason: "The formula compares P(A|B) and P(B|A)." },
      { title: "Fractions", level: "elementary", reason: "The denominator normalizes the numerator." },
    ],
    boundaryCases: [
      { title: "P(B)=0", description: "The conditional probability is undefined." },
      { title: "P(A)=0", description: "A zero prior keeps posterior at zero." },
    ],
    pitfalls: ["P(A|B) and P(B|A) are not interchangeable.", "The denominator is essential."],
  },
  combination: {
    type: "combination",
    domain: "discrete_math",
    oneLineIntuition: "A combination counts unordered ways to choose k objects from n.",
    plainExplanation: "The factorials count all possible ordered picks, then divide out the repeated orders inside each chosen group.",
    beginnerExplanation: "If choosing Alice then Bob is the same team as choosing Bob then Alice, you are counting combinations.",
    analogy: "Choosing a committee: the same people form the same committee no matter how you list them.",
    strictExplanation: "The binomial coefficient n choose k equals n!/(k!(n-k)!) and counts k-element subsets of an n-element set.",
    whyItMatters: "It is foundational in counting, probability, graph choices, and binomial expansions.",
    variables: [
      { symbol: "n", role: "total items", meaning: "How many objects are available.", adjustable: true, defaultValue: 5, min: 1, max: 12, step: 1 },
      { symbol: "k", role: "chosen items", meaning: "How many objects are selected.", adjustable: true, defaultValue: 2, min: 0, max: 12, step: 1 },
    ],
    symbols: [
      { symbol: "\\binom{n}{k}", name: "binomial coefficient", category: "function", meaning: "Number of unordered selections.", readAs: "n choose k" },
      { symbol: "!", name: "factorial", category: "operator", meaning: "Product down to 1.", readAs: "factorial" },
      { symbol: "k!", name: "order duplicates", category: "operator", meaning: "Number of ways to order selected items.", readAs: "k factorial" },
    ],
    readingOrder: [
      { order: 1, fragment: "n!", explanation: "Count all arrangements of n items." },
      { order: 2, fragment: "(n-k)!", explanation: "Ignore unchosen item order." },
      { order: 3, fragment: "k!", explanation: "Remove duplicate orders among chosen items." },
    ],
    computationSteps: [
      { title: "Count ordered picks", description: "There are n!/(n-k)! ordered k-picks." },
      { title: "Remove internal order", description: "Divide by k! because order does not matter." },
    ],
    toyExample: { title: "Choose 2 from 4", description: "Objects are A,B,C,D.", steps: ["Pairs are AB, AC, AD, BC, BD, CD.", "There are 6."], result: "\\binom{4}{2}=6." },
    relatedFormulas: [
      { id: "permutation", latex: "P(n,k)=\\frac{n!}{(n-k)!}", title: "Permutation", domain: "discrete_math", relation: "contrast", explanation: "Counts ordered selections." },
      { id: "binomial-theorem", latex: "(x+y)^n=\\sum_k\\binom{n}{k}x^{n-k}y^k", title: "Binomial Theorem", domain: "discrete_math", relation: "application", explanation: "Combination numbers become expansion coefficients." },
    ],
    prerequisites: [
      { title: "Factorials", level: "high_school", reason: "The formula is built from factorials." },
      { title: "Order vs no order", level: "elementary", reason: "That is the central counting distinction." },
    ],
    boundaryCases: [
      { title: "k=0", description: "There is exactly one empty choice." },
      { title: "k=n", description: "There is exactly one all-in choice." },
      { title: "k>n", description: "There are no valid choices." },
    ],
    pitfalls: ["Use permutations when order matters.", "n and k must be non-negative integers."],
  },
  permutation: {
    type: "permutation",
    domain: "discrete_math",
    oneLineIntuition: "A permutation counts ordered ways to choose k objects from n.",
    plainExplanation: "You choose k slots in sequence: n choices for the first slot, fewer choices after each pick.",
    beginnerExplanation: "If Alice then Bob is different from Bob then Alice, you are counting permutations.",
    analogy: "Awarding gold, silver, and bronze from a group: order changes the result.",
    strictExplanation: "P(n,k)=n!/(n-k)! counts injective sequences of length k drawn from n items.",
    whyItMatters: "It appears in arrangements, scheduling, passwords, rankings, and probability.",
    variables: [
      { symbol: "n", role: "total items", meaning: "Available objects.", adjustable: true, defaultValue: 5, min: 1, max: 12, step: 1 },
      { symbol: "k", role: "ordered slots", meaning: "Number of positions to fill.", adjustable: true, defaultValue: 3, min: 0, max: 12, step: 1 },
    ],
    symbols: [
      { symbol: "P(n,k)", name: "permutation count", category: "function", meaning: "Number of ordered selections.", readAs: "P n k" },
      { symbol: "(n-k)!", name: "unused suffix", category: "operator", meaning: "Cancels arrangements of unchosen objects.", readAs: "n minus k factorial" },
    ],
    readingOrder: [
      { order: 1, fragment: "n!", explanation: "Start from all orderings." },
      { order: 2, fragment: "/(n-k)!", explanation: "Remove arrangements of items not selected." },
    ],
    computationSteps: [
      { title: "Fill slot 1", description: "There are n choices." },
      { title: "Fill later slots", description: "Each used item is no longer available." },
      { title: "Multiply choices", description: "This compresses to n!/(n-k)!." },
    ],
    toyExample: { title: "Choose ordered 2 from 4", description: "Objects are A,B,C,D.", steps: ["First slot has 4 choices.", "Second slot has 3 choices."], result: "P(4,2)=12." },
    relatedFormulas: [{ id: "combination", latex: "\\binom{n}{k}=\\frac{P(n,k)}{k!}", title: "Combination", domain: "discrete_math", relation: "contrast", explanation: "Divides out order among the chosen items." }],
    prerequisites: [{ title: "Multiplication principle", level: "elementary", reason: "Ordered choices multiply slot by slot." }],
    boundaryCases: [
      { title: "k=0", description: "One empty ordering." },
      { title: "k>n", description: "No valid ordering without replacement." },
    ],
    pitfalls: ["Do not divide by k! when order matters."],
  },
  set_identity: {
    type: "set_identity",
    domain: "discrete_math",
    oneLineIntuition: "Inclusion-exclusion counts the union by adding both sets and subtracting the overlap once.",
    plainExplanation: "When you add |A| and |B|, elements in both sets are counted twice, so |A cap B| must be subtracted.",
    beginnerExplanation: "Two friend lists may share names. Add both list lengths, then remove the duplicate names counted twice.",
    analogy: "Merging two guest lists and crossing out duplicate entries.",
    strictExplanation: "|A∪B|=|A|+|B|-|A∩B| follows by partitioning the universe into A-only, B-only, overlap, and outside regions.",
    whyItMatters: "This is one of the most useful counting identities in discrete math and probability.",
    variables: noVariables,
    symbols: [
      { symbol: "A\\cup B", name: "union", category: "operator", meaning: "Everything in A or B.", readAs: "A union B" },
      { symbol: "A\\cap B", name: "intersection", category: "operator", meaning: "Everything in both A and B.", readAs: "A intersection B" },
      { symbol: "|A|", name: "cardinality", category: "operator", meaning: "Number of elements in A.", readAs: "size of A" },
    ],
    readingOrder: [
      { order: 1, fragment: "|A|+|B|", explanation: "Add the two set sizes." },
      { order: 2, fragment: "|A\\cap B|", explanation: "Identify the overlap counted twice." },
      { order: 3, fragment: "-|A\\cap B|", explanation: "Subtract one copy of the overlap." },
    ],
    computationSteps: [
      { title: "Count A", description: "Count all elements in A." },
      { title: "Count B", description: "Count all elements in B." },
      { title: "Subtract overlap", description: "Remove the duplicate count of A∩B." },
    ],
    toyExample: { title: "A={1,2,3}, B={3,4}", description: "The overlap is {3}.", steps: ["|A|=3.", "|B|=2.", "|A∩B|=1."], result: "|A∪B|=3+2-1=4." },
    relatedFormulas: [
      { id: "probability-addition", latex: "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)", title: "Probability Addition Rule", domain: "math_stats", relation: "application", explanation: "Same idea for event probabilities." },
      { id: "de-morgan", latex: "\\overline{A\\cup B}=\\bar A\\cap\\bar B", title: "De Morgan's Law", domain: "discrete_math", relation: "used_together", explanation: "Connects set operations with negation." },
    ],
    prerequisites: [
      { title: "Set membership", level: "elementary", reason: "You need to know what belongs to a set." },
      { title: "Counting duplicates", level: "elementary", reason: "The formula fixes double counting." },
    ],
    boundaryCases: [
      { title: "Disjoint sets", description: "If A∩B is empty, the union size is |A|+|B|." },
      { title: "A=B", description: "The formula returns |A|." },
    ],
    pitfalls: ["Do not add set sizes directly when sets overlap.", "Union means or, intersection means and."],
  },
  graph_degree: {
    type: "graph_degree",
    domain: "discrete_math",
    oneLineIntuition: "The total degree of an undirected graph is twice the number of edges.",
    plainExplanation: "Every edge touches two endpoints, so when you add degrees over all vertices, each edge is counted exactly twice.",
    beginnerExplanation: "Count the line ends. Each line has two ends, so total line ends equals 2 times the number of lines.",
    analogy: "Counting handshakes by people counts each handshake once for each participant.",
    strictExplanation: "For an undirected graph G=(V,E), sum_{v∈V}deg(v)=2|E| because each edge contributes one incidence to each endpoint.",
    whyItMatters: "It is a basic invariant used in graph proofs, network analysis, and algorithm sanity checks.",
    variables: noVariables,
    symbols: [
      { symbol: "V", name: "vertices", category: "variable", meaning: "The node set.", readAs: "V" },
      { symbol: "E", name: "edges", category: "variable", meaning: "The edge set.", readAs: "E" },
      { symbol: "\\deg(v)", name: "degree", category: "function", meaning: "Number of edges incident to v.", readAs: "degree of v" },
      { symbol: "\\sum_{v\\in V}", name: "sum over vertices", category: "operator", meaning: "Add one value for every vertex.", readAs: "sum over v in V" },
    ],
    readingOrder: [
      { order: 1, fragment: "\\deg(v)", explanation: "Count edges touching one vertex." },
      { order: 2, fragment: "\\sum_{v\\in V}", explanation: "Add this count for every vertex." },
      { order: 3, fragment: "2|E|", explanation: "Each edge contributes to two endpoint counts." },
    ],
    computationSteps: [
      { title: "Count degree per vertex", description: "Find how many edges touch each vertex." },
      { title: "Add degrees", description: "Sum those counts over all vertices." },
      { title: "Compare to edge count", description: "Every undirected edge has two ends." },
    ],
    toyExample: { title: "Path A-B-C", description: "There are two edges.", steps: ["deg(A)=1.", "deg(B)=2.", "deg(C)=1."], result: "Total degree is 4, equal to 2|E|." },
    relatedFormulas: [
      { id: "average-degree", latex: "\\bar d=\\frac{2|E|}{|V|}", title: "Average Degree", domain: "discrete_math", relation: "application", explanation: "Follows directly from the handshaking lemma." },
      { id: "adjacency-degree", latex: "\\deg(v_i)=\\sum_j A_{ij}", title: "Adjacency Matrix Degree", domain: "discrete_math", relation: "used_together", explanation: "Computes degree from matrix rows." },
    ],
    prerequisites: [
      { title: "Nodes and edges", level: "elementary", reason: "Graphs are made of vertices and edges." },
      { title: "Summation", level: "high_school", reason: "The left side adds over all vertices." },
    ],
    boundaryCases: [
      { title: "Isolated vertex", description: "It contributes 0 to the degree sum." },
      { title: "Self-loop", description: "In many undirected conventions it contributes 2." },
    ],
    pitfalls: ["Directed graphs need in-degree and out-degree.", "Parallel edges depend on graph conventions."],
  },
  logic_quantifier: {
    type: "logic_quantifier",
    domain: "discrete_math",
    oneLineIntuition: "The formula says every x in A has at least one related y in B.",
    plainExplanation: "For each object x you pick from A, you must be able to find some object y in B such that R(x,y) is true.",
    beginnerExplanation: "It is a promise: no matter which A-item you choose, there is a matching B-item for it.",
    analogy: "Every student has at least one assigned mentor.",
    strictExplanation: "∀x∈A, ∃y∈B: R(x,y) is a first-order statement with a universal quantifier over A followed by an existential quantifier over B.",
    whyItMatters: "Quantifier order is central in discrete math, logic, relations, functions, and proofs.",
    variables: noVariables,
    symbols: [
      { symbol: "\\forall", name: "universal quantifier", category: "quantifier", meaning: "For every item.", readAs: "for all" },
      { symbol: "\\exists", name: "existential quantifier", category: "quantifier", meaning: "There exists at least one item.", readAs: "there exists" },
      { symbol: "\\in", name: "membership", category: "relation", meaning: "Belongs to a set.", readAs: "in" },
      { symbol: "R(x,y)", name: "relation", category: "relation", meaning: "A property connecting x and y.", readAs: "R of x y" },
    ],
    readingOrder: [
      { order: 1, fragment: "\\forall x\\in A", explanation: "Pick an arbitrary x from A." },
      { order: 2, fragment: "\\exists y\\in B", explanation: "You must find at least one y from B." },
      { order: 3, fragment: "R(x,y)", explanation: "The chosen pair must satisfy relation R." },
    ],
    computationSteps: [
      { title: "Choose any x", description: "The statement must work for every x in A." },
      { title: "Find a witness y", description: "For that x, at least one y in B must exist." },
      { title: "Check relation", description: "Verify R(x,y) is true." },
    ],
    toyExample: { title: "Students and mentors", description: "A is students, B is mentors, R means assigned-to.", steps: ["Pick student Ana.", "Find mentor Mei.", "Check Ana is assigned to Mei."], result: "If every student has such a mentor, the statement is true." },
    relatedFormulas: [
      { id: "function-totality", latex: "\\forall x\\in A, \\exists! y\\in B: f(x)=y", title: "Function Totality", domain: "discrete_math", relation: "special_case", explanation: "Adds uniqueness to the witness y." },
      { id: "negated-quantifier", latex: "\\exists x\\in A, \\forall y\\in B: \\neg R(x,y)", title: "Negated Quantifier Pattern", domain: "discrete_math", relation: "contrast", explanation: "Shows how quantifiers flip under negation." },
    ],
    prerequisites: [
      { title: "Set membership", level: "elementary", reason: "x and y are chosen from sets." },
      { title: "Quantifiers", level: "college_basic", reason: "The meaning depends on for all vs exists." },
    ],
    boundaryCases: [
      { title: "A is empty", description: "The statement is vacuously true." },
      { title: "B is empty and A is not", description: "No witness y exists, so the statement is false." },
      { title: "Quantifier order swapped", description: "∃y∀x is much stronger than ∀x∃y." },
    ],
    pitfalls: ["Do not swap quantifier order casually.", "Exists means at least one, not exactly one."],
  },
  recurrence_relation: {
    type: "recurrence_relation",
    domain: "discrete_math",
    oneLineIntuition: "A recurrence defines a term using earlier terms.",
    plainExplanation: "Instead of giving a_n directly, the formula tells you how to build it from previous values.",
    beginnerExplanation: "It is like a recipe that says today's value depends on yesterday's value.",
    analogy: "A family tree of computations: each term has parent terms it depends on.",
    strictExplanation: "A recurrence relation defines a sequence by equations connecting a_n to one or more previous terms plus base cases.",
    whyItMatters: "Recurrences describe algorithms, dynamic programming, sequences, and recursive definitions.",
    variables: [{ symbol: "a_n", role: "sequence term", meaning: "The nth value in the sequence.", adjustable: false }],
    symbols: [
      { symbol: "a_n", name: "current term", category: "variable", meaning: "Value being defined.", readAs: "a n" },
      { symbol: "a_{n-1}", name: "previous term", category: "variable", meaning: "Earlier value used to compute current value.", readAs: "a n minus one" },
    ],
    readingOrder: [
      { order: 1, fragment: "base cases", explanation: "Start from known initial values." },
      { order: 2, fragment: "previous terms", explanation: "Use older values." },
      { order: 3, fragment: "a_n", explanation: "Compute the next term." },
    ],
    computationSteps: [
      { title: "Read base values", description: "A recurrence needs starting values." },
      { title: "Apply recursive rule", description: "Use previous terms to produce the next one." },
      { title: "Repeat", description: "Generate the sequence step by step." },
    ],
    toyExample: { title: "Fibonacci style", description: "a_n=a_{n-1}+a_{n-2}, a_0=0, a_1=1.", steps: ["a_2=1+0=1.", "a_3=1+1=2.", "a_4=2+1=3."], result: "The rule builds the sequence from base cases." },
    relatedFormulas: [
      { id: "geometric-recurrence", latex: "a_n=ra_{n-1}", title: "Geometric Recurrence", domain: "discrete_math", relation: "special_case", explanation: "Each term scales the previous term." },
      { id: "master-theorem", latex: "T(n)=aT(n/b)+f(n)", title: "Divide-and-Conquer Recurrence", domain: "discrete_math", relation: "application", explanation: "Used for algorithm running times." },
    ],
    prerequisites: [{ title: "Sequences", level: "high_school", reason: "Recurrences define ordered lists of values." }],
    boundaryCases: [
      { title: "Missing base case", description: "The sequence cannot start." },
      { title: "n below base index", description: "The rule may be undefined." },
    ],
    pitfalls: ["A recurrence is incomplete without base cases.", "Recursive definitions can grow exponentially if expanded naively."],
  },
  gradient_descent: {
    type: "gradient_descent",
    domain: "ai_ml",
    oneLineIntuition: "Gradient descent lowers a loss by stepping opposite the gradient.",
    plainExplanation: "The gradient points uphill, so subtracting a learning-rate-scaled gradient moves parameters downhill.",
    beginnerExplanation: "Imagine standing on a hill in fog. Feel which way goes up fastest, then take a careful step the other way.",
    analogy: "Tuning a knob by nudging it away from the direction that makes the error worse.",
    strictExplanation: "The update theta_{t+1}=theta_t-eta nabla L(theta_t) is a first-order optimization step using local derivative information.",
    whyItMatters: "It is the backbone of modern machine-learning training and many numerical optimization methods.",
    variables: [
      { symbol: "\\theta_t", role: "current parameter", meaning: "The parameter value before this update.", adjustable: false },
      { symbol: "\\eta", role: "learning rate", meaning: "Controls step size.", adjustable: true, defaultValue: 0.15, min: 0.01, max: 0.8, step: 0.01 },
      { symbol: "\\nabla L", role: "gradient", meaning: "Direction of steepest local increase.", adjustable: false },
    ],
    symbols: [
      { symbol: "\\theta_t", name: "current parameter", category: "variable", meaning: "Where the optimizer is now.", readAs: "theta t" },
      { symbol: "\\eta", name: "learning rate", category: "constant", meaning: "Step-size multiplier.", readAs: "eta" },
      { symbol: "\\nabla", name: "gradient", category: "operator", meaning: "Local uphill direction.", readAs: "gradient" },
      { symbol: "-", name: "subtraction", category: "operator", meaning: "Moves opposite the gradient.", readAs: "minus" },
    ],
    readingOrder: [
      { order: 1, fragment: "\\theta_t", explanation: "Start at the current parameter." },
      { order: 2, fragment: "\\nabla L(\\theta_t)", explanation: "Compute the local uphill direction." },
      { order: 3, fragment: "\\eta\\nabla L", explanation: "Scale by the learning rate." },
      { order: 4, fragment: "\\theta_t-\\eta\\nabla L", explanation: "Subtract to move downhill." },
    ],
    computationSteps: [
      { title: "Evaluate gradient", description: "Find how the loss changes near the current parameter." },
      { title: "Scale the update", description: "Multiply the gradient by eta." },
      { title: "Move downhill", description: "Subtract the scaled gradient.", expression: "\\theta_{t+1}=\\theta_t-\\eta\\nabla L(\\theta_t)" },
    ],
    toyExample: {
      title: "One-dimensional x^2",
      description: "Let L(x)=x^2, x=4, eta=0.1.",
      steps: ["Gradient is 2x=8.", "Step size is 0.8.", "New x is 3.2."],
      result: "The parameter moved closer to the minimum at 0.",
    },
    relatedFormulas: [
      { id: "sgd", latex: "\\theta_{t+1}=\\theta_t-\\eta\\nabla L_{batch}(\\theta_t)", title: "Stochastic Gradient Descent", domain: "ai_ml", relation: "special_case", explanation: "Uses a minibatch gradient." },
      { id: "adam", latex: "\\theta_t=\\theta_{t-1}-\\eta\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}", title: "Adam", domain: "ai_ml", relation: "generalization", explanation: "Adds adaptive moment estimates." },
    ],
    prerequisites: [
      { title: "Slope", level: "high_school", reason: "Gradient generalizes slope." },
      { title: "Optimization", level: "college_basic", reason: "The goal is to reduce a loss." },
    ],
    boundaryCases: [
      { title: "eta too small", description: "Progress is stable but slow." },
      { title: "eta too large", description: "The update can overshoot or diverge." },
    ],
    pitfalls: ["The gradient is local, not a global plan.", "Learning rate depends on loss scale and curvature."],
  },
  scaled_dot_product_attention: {
    type: "scaled_dot_product_attention",
    domain: "ai_ml",
    oneLineIntuition: "Scaled dot-product attention lets each query softly choose which keys and values to read from.",
    plainExplanation: "Queries are compared with keys, the scores are scaled to stay numerically stable, softmax turns them into weights, and those weights mix the values.",
    beginnerExplanation: "Imagine asking a question and scanning several notes. Attention scores how relevant each note is, then reads more from the useful notes.",
    analogy: "A research librarian: your query is the question, keys are index cards, and values are the actual passages returned.",
    strictExplanation: "Attention(Q,K,V)=softmax(QK^T/sqrt(d_k))V. The sqrt(d_k) scale prevents dot products from becoming too large as key dimension grows.",
    whyItMatters: "This is the core operation in Transformers, language models, vision transformers, and many sequence models.",
    variables: [
      { symbol: "Q", role: "queries", meaning: "Vectors representing what each token is looking for.", adjustable: false },
      { symbol: "K", role: "keys", meaning: "Vectors representing what each token offers for matching.", adjustable: false },
      { symbol: "V", role: "values", meaning: "Vectors containing the information that will be mixed.", adjustable: false },
      { symbol: "d_k", role: "key dimension", meaning: "Feature dimension used to scale dot products.", adjustable: true, defaultValue: 64, min: 8, max: 256, step: 8 },
    ],
    symbols: [
      { symbol: "QK^T", name: "similarity scores", category: "operator", meaning: "Compares every query with every key.", readAs: "Q K transpose" },
      { symbol: "\\sqrt{d_k}", name: "scale factor", category: "operator", meaning: "Keeps logits in a useful range.", readAs: "square root of d k" },
      { symbol: "\\mathrm{softmax}", name: "attention weights", category: "function", meaning: "Turns scores into row-wise probability weights.", readAs: "softmax" },
      { symbol: "V", name: "values", category: "variable", meaning: "Information vectors being averaged.", readAs: "V" },
    ],
    readingOrder: [
      { order: 1, fragment: "QK^T", explanation: "Compute query-key compatibility scores." },
      { order: 2, fragment: "/\\sqrt{d_k}", explanation: "Scale scores so softmax does not saturate too early." },
      { order: 3, fragment: "\\mathrm{softmax}", explanation: "Convert scores to attention weights." },
      { order: 4, fragment: "(...)V", explanation: "Use weights to mix value vectors." },
    ],
    computationSteps: [
      { title: "Score query-key pairs", description: "Take dot products between queries and keys.", expression: "QK^T" },
      { title: "Scale logits", description: "Divide by sqrt(d_k) before softmax.", expression: "QK^T/\\sqrt{d_k}" },
      { title: "Normalize weights", description: "Apply softmax across each query row." },
      { title: "Mix values", description: "Multiply the attention weights by V." },
    ],
    toyExample: {
      title: "One query, two notes",
      description: "Suppose the scaled scores are [2, 0].",
      steps: ["Softmax gives about [0.88, 0.12].", "The first value receives most of the weight.", "The output is a weighted average of both value vectors."],
      result: "The query mostly reads from the first note but still keeps a small contribution from the second.",
    },
    relatedFormulas: [
      { id: "softmax", latex: "p_i=\\frac{e^{z_i}}{\\sum_j e^{z_j}}", title: "Softmax", domain: "ai_ml", relation: "prerequisite", explanation: "Turns attention scores into weights." },
      { id: "multi-head-attention", latex: "\\mathrm{MHA}(Q,K,V)=\\mathrm{Concat}(head_1,...,head_h)W^O", title: "Multi-Head Attention", domain: "ai_ml", relation: "generalization", explanation: "Runs several attention projections in parallel." },
    ],
    prerequisites: [
      { title: "Dot product", level: "college_basic", reason: "Similarity comes from vector dot products." },
      { title: "Softmax", level: "college_basic", reason: "Scores become normalized weights." },
    ],
    boundaryCases: [
      { title: "Very large d_k without scaling", description: "Softmax can become too sharp and gradients can become small." },
      { title: "Identical keys", description: "Matching scores may be similar, so attention spreads out." },
      { title: "Masked attention", description: "Some positions are forced to zero weight before softmax." },
    ],
    pitfalls: ["Attention weights are not always faithful explanations.", "Q, K, and V are learned projections, not raw tokens.", "The softmax is usually row-wise."],
  },
  layer_norm: {
    type: "layer_norm",
    domain: "ai_ml",
    oneLineIntuition: "Layer normalization recenters and rescales one activation vector before applying learned gain and bias.",
    plainExplanation: "For one token or sample, subtract its feature mean, divide by feature standard deviation, then apply gamma and beta.",
    beginnerExplanation: "It puts a vector on a consistent scale so later layers do not see values that are wildly too large or too small.",
    analogy: "Like grading on a local curve for each student, then applying a learned adjustment.",
    strictExplanation: "LN(x)=gamma * (x-mu)/sqrt(sigma^2+epsilon)+beta, where mu and sigma are computed across features of the same example.",
    whyItMatters: "LayerNorm stabilizes Transformer training and is part of most modern deep-learning blocks.",
    variables: [
      { symbol: "x", role: "activation vector", meaning: "Feature values to normalize.", adjustable: false },
      { symbol: "\\mu", role: "feature mean", meaning: "Average value within the vector.", adjustable: false },
      { symbol: "\\sigma^2", role: "feature variance", meaning: "Spread of values within the vector.", adjustable: false },
      { symbol: "\\gamma, \\beta", role: "learned affine parameters", meaning: "Restores useful scale and shift after normalization.", adjustable: false },
    ],
    symbols: [
      { symbol: "x-\\mu", name: "centering", category: "operator", meaning: "Removes the local mean.", readAs: "x minus mu" },
      { symbol: "\\sqrt{\\sigma^2+\\epsilon}", name: "safe standard deviation", category: "operator", meaning: "Scales by spread while avoiding divide-by-zero.", readAs: "square root of variance plus epsilon" },
      { symbol: "\\gamma", name: "gain", category: "variable", meaning: "Learned multiplier.", readAs: "gamma" },
      { symbol: "\\beta", name: "bias", category: "variable", meaning: "Learned shift.", readAs: "beta" },
    ],
    readingOrder: [
      { order: 1, fragment: "\\mu,\\sigma^2", explanation: "Compute mean and variance across features." },
      { order: 2, fragment: "x-\\mu", explanation: "Center the vector." },
      { order: 3, fragment: "/\\sqrt{\\sigma^2+\\epsilon}", explanation: "Normalize its scale safely." },
      { order: 4, fragment: "\\gamma(...)+\\beta", explanation: "Apply learned gain and bias." },
    ],
    computationSteps: [
      { title: "Compute local statistics", description: "Use features from the same sample or token." },
      { title: "Normalize", description: "Subtract mean and divide by safe standard deviation." },
      { title: "Apply affine parameters", description: "Use gamma and beta so the model can recover useful scale." },
    ],
    toyExample: {
      title: "Three features",
      description: "Let x=[2,4,6].",
      steps: ["The mean is 4.", "Centered values are [-2,0,2].", "Divide by the standard deviation, then apply gamma and beta."],
      result: "The vector keeps relative shape but gets a controlled scale.",
    },
    relatedFormulas: [
      { id: "batch-norm", latex: "\\hat x=\\frac{x-\\mu_B}{\\sqrt{\\sigma_B^2+\\epsilon}}", title: "Batch Normalization", domain: "ai_ml", relation: "contrast", explanation: "Uses batch statistics instead of per-example feature statistics." },
      { id: "residual-block", latex: "y=x+F(\\mathrm{LN}(x))", title: "Pre-Norm Residual Block", domain: "ai_ml", relation: "used_together", explanation: "LayerNorm often appears inside residual blocks." },
    ],
    prerequisites: [
      { title: "Mean and variance", level: "high_school", reason: "Normalization uses local statistics." },
      { title: "Neural activations", level: "college_basic", reason: "The formula acts on hidden vectors." },
    ],
    boundaryCases: [
      { title: "Zero variance", description: "Epsilon prevents division by zero." },
      { title: "gamma = 1, beta = 0", description: "The output is pure normalized activation." },
      { title: "Very small epsilon", description: "Can make nearly constant vectors numerically unstable." },
    ],
    pitfalls: ["LayerNorm statistics are per example, not across the batch.", "Gamma and beta mean the final output is not forced to zero mean and unit variance.", "Placement before or after residual blocks changes training behavior."],
  },
  adam_optimizer: {
    type: "adam_optimizer",
    domain: "ai_ml",
    oneLineIntuition: "Adam adapts gradient descent by tracking smoothed first and second moments of gradients.",
    plainExplanation: "It keeps an average direction m and an average squared-gradient scale v, corrects their early bias, then divides the step by sqrt(v).",
    beginnerExplanation: "Adam remembers both which way gradients usually point and how noisy or large they are, then chooses a more balanced step.",
    analogy: "A runner using both momentum and terrain friction: keep moving in a persistent direction, slow down on unstable ground.",
    strictExplanation: "Adam updates biased moment estimates m_t and v_t, forms bias-corrected estimates hat m_t and hat v_t, then applies theta_t=theta_{t-1}-eta hat m_t/(sqrt(hat v_t)+epsilon).",
    whyItMatters: "Adam is one of the most common optimizers in deep learning because it is robust across many architectures and scales.",
    variables: [
      { symbol: "\\eta", role: "learning rate", meaning: "Global step-size multiplier.", adjustable: true, defaultValue: 0.001, min: 0.0001, max: 0.01, step: 0.0001 },
      { symbol: "\\hat m_t", role: "bias-corrected first moment", meaning: "Smoothed gradient direction.", adjustable: false },
      { symbol: "\\hat v_t", role: "bias-corrected second moment", meaning: "Smoothed squared-gradient scale.", adjustable: false },
      { symbol: "\\epsilon", role: "stability constant", meaning: "Avoids division by zero.", adjustable: false },
    ],
    symbols: [
      { symbol: "\\beta_1", name: "momentum decay", category: "constant", meaning: "Controls memory of gradient direction.", readAs: "beta one" },
      { symbol: "\\beta_2", name: "scale decay", category: "constant", meaning: "Controls memory of squared gradients.", readAs: "beta two" },
      { symbol: "\\hat m_t", name: "corrected momentum", category: "variable", meaning: "Debiased first moment.", readAs: "m hat t" },
      { symbol: "\\sqrt{\\hat v_t}+\\epsilon", name: "adaptive denominator", category: "operator", meaning: "Rescales the update per parameter.", readAs: "square root of v hat t plus epsilon" },
    ],
    readingOrder: [
      { order: 1, fragment: "m_t, v_t", explanation: "Maintain smoothed gradient and squared-gradient estimates." },
      { order: 2, fragment: "\\hat m_t, \\hat v_t", explanation: "Correct startup bias." },
      { order: 3, fragment: "\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)", explanation: "Scale direction by recent gradient magnitude." },
      { order: 4, fragment: "\\theta_t=\\theta_{t-1}-...", explanation: "Subtract the adaptive step." },
    ],
    computationSteps: [
      { title: "Update moments", description: "Blend the new gradient into m_t and v_t." },
      { title: "Bias-correct", description: "Adjust moments early in training." },
      { title: "Compute adaptive step", description: "Divide the direction by sqrt(v) plus epsilon." },
      { title: "Update parameters", description: "Move theta by the scaled step." },
    ],
    toyExample: {
      title: "One parameter",
      description: "If recent gradients are consistently positive, m_hat is positive.",
      steps: ["The numerator points uphill.", "The denominator shrinks or expands the step based on squared gradients.", "Subtracting moves the parameter downhill."],
      result: "Adam behaves like gradient descent with adaptive per-parameter step sizes.",
    },
    relatedFormulas: [
      { id: "gradient-descent", latex: "\\theta_{t+1}=\\theta_t-\\eta\\nabla L(\\theta_t)", title: "Gradient Descent", domain: "ai_ml", relation: "prerequisite", explanation: "Adam generalizes the basic negative-gradient update." },
      { id: "rmsprop", latex: "\\theta_t=\\theta_{t-1}-\\eta\\frac{g_t}{\\sqrt{v_t}+\\epsilon}", title: "RMSProp", domain: "ai_ml", relation: "used_together", explanation: "Adam combines RMSProp-like scaling with momentum." },
    ],
    prerequisites: [
      { title: "Gradient descent", level: "college_basic", reason: "Adam is an adaptive update rule." },
      { title: "Moving averages", level: "college_basic", reason: "Moments are exponentially smoothed." },
    ],
    boundaryCases: [
      { title: "epsilon too large", description: "The adaptive denominator is dominated by epsilon, weakening adaptivity." },
      { title: "beta values near 1", description: "Moments remember a long history but react slowly." },
      { title: "No bias correction", description: "Early steps can be systematically too small." },
    ],
    pitfalls: ["Adam's learning rate is still important.", "Weight decay in AdamW is not the same as L2 penalty inside Adam.", "Adaptive optimizers can generalize differently from SGD."],
  },
  pigeonhole_principle: {
    type: "pigeonhole_principle",
    domain: "discrete_math",
    oneLineIntuition: "If more objects are placed into fewer boxes, at least one box must contain multiple objects.",
    plainExplanation: "The formula ceil(n/m) expresses the minimum guaranteed crowding when n items are distributed among m containers.",
    beginnerExplanation: "Put 11 socks into 10 drawers. Some drawer must contain at least 2 socks.",
    analogy: "A crowded classroom: if seats are fewer than students, someone must share.",
    strictExplanation: "For n objects placed into m nonempty categories, some category contains at least ceil(n/m) objects.",
    whyItMatters: "It is a simple but powerful proof tool in combinatorics, number theory, graph theory, and algorithms.",
    variables: [
      { symbol: "n", role: "objects", meaning: "Number of items being placed.", adjustable: true, defaultValue: 11, min: 1, max: 40, step: 1 },
      { symbol: "m", role: "boxes", meaning: "Number of containers or categories.", adjustable: true, defaultValue: 10, min: 1, max: 20, step: 1 },
    ],
    symbols: [
      { symbol: "\\lceil n/m\\rceil", name: "ceiling average", category: "function", meaning: "Smallest integer at least n/m.", readAs: "ceiling of n over m" },
      { symbol: "n", name: "items", category: "variable", meaning: "Objects distributed into boxes.", readAs: "n" },
      { symbol: "m", name: "boxes", category: "variable", meaning: "Containers or categories.", readAs: "m" },
    ],
    readingOrder: [
      { order: 1, fragment: "n/m", explanation: "Compute the average load per box." },
      { order: 2, fragment: "\\lceil n/m\\rceil", explanation: "Round up because box counts are integers." },
      { order: 3, fragment: "at least one box", explanation: "Guarantee a box with at least that many items." },
    ],
    computationSteps: [
      { title: "Distribute items", description: "Place n objects across m boxes." },
      { title: "Compute average load", description: "Use n divided by m." },
      { title: "Round up", description: "At least one box must reach the ceiling of the average." },
    ],
    toyExample: {
      title: "11 items, 10 boxes",
      description: "The average is 1.1 items per box.",
      steps: ["If every box had at most 1 item, only 10 items fit.", "There are 11 items.", "So one box has at least 2."],
      result: "\\lceil 11/10\\rceil=2.",
    },
    relatedFormulas: [
      { id: "generalized-pigeonhole", latex: "\\max_i |B_i|\\ge \\lceil n/m\\rceil", title: "Generalized Pigeonhole", domain: "discrete_math", relation: "generalization", explanation: "States the ceiling average guarantee." },
      { id: "dirichlet-approximation", latex: "\\left|\\alpha-\\frac{p}{q}\\right|<\\frac{1}{qN}", title: "Dirichlet Approximation", domain: "discrete_math", relation: "application", explanation: "A number-theory application of pigeonhole reasoning." },
    ],
    prerequisites: [
      { title: "Averages", level: "elementary", reason: "The proof compares total count with average load." },
      { title: "Ceiling function", level: "high_school", reason: "Counts must be integers." },
    ],
    boundaryCases: [
      { title: "n <= m", description: "The guarantee may only be one item per nonempty box." },
      { title: "m = 1", description: "The single box contains all n items." },
      { title: "Uneven distribution", description: "The principle guarantees existence, not which box." },
    ],
    pitfalls: ["It proves at least one box exists; it does not identify it.", "The boxes must cover all objects.", "Do not replace the ceiling with ordinary rounding."],
  },
  de_morgan_law: {
    type: "de_morgan_law",
    domain: "discrete_math",
    oneLineIntuition: "De Morgan's law says negating an or turns it into an and of negations, and vice versa.",
    plainExplanation: "The complement of a union is everything outside both sets; the complement of an intersection is everything missing from at least one set.",
    beginnerExplanation: "Not being in A or B means you are not in A and not in B.",
    analogy: "If you did not attend either lecture or lab, then you missed lecture and you missed lab.",
    strictExplanation: "For sets, (A union B)^c=A^c intersection B^c and (A intersection B)^c=A^c union B^c; the logical analogs are not(P or Q)=not P and not Q, not(P and Q)=not P or not Q.",
    whyItMatters: "It connects set algebra, Boolean logic, digital circuits, SQL filters, and proof transformations.",
    variables: noVariables,
    symbols: [
      { symbol: "\\overline{A\\cup B}", name: "complement of union", category: "operator", meaning: "Items outside A or B.", readAs: "not A union B" },
      { symbol: "\\bar A\\cap\\bar B", name: "intersection of complements", category: "operator", meaning: "Items outside A and outside B.", readAs: "A complement intersect B complement" },
      { symbol: "\\neg", name: "not", category: "operator", meaning: "Logical negation.", readAs: "not" },
    ],
    readingOrder: [
      { order: 1, fragment: "A\\cup B", explanation: "Start with membership in A or B." },
      { order: 2, fragment: "\\overline{...}", explanation: "Negate that whole condition." },
      { order: 3, fragment: "\\bar A\\cap\\bar B", explanation: "Rewrite as outside A and outside B." },
    ],
    computationSteps: [
      { title: "Read the grouped operation", description: "Identify whether union/or or intersection/and is inside the negation." },
      { title: "Flip the operation", description: "Union becomes intersection; intersection becomes union." },
      { title: "Negate each part", description: "Apply complement or not to each operand." },
    ],
    toyExample: {
      title: "Two course lists",
      description: "A is lecture attendees, B is lab attendees.",
      steps: ["A union B is anyone attending either session.", "Outside the union means attending neither.", "That equals outside A and outside B."],
      result: "\\overline{A\\cup B}=\\bar A\\cap\\bar B.",
    },
    relatedFormulas: [
      { id: "set-identity", latex: "|A\\cup B|=|A|+|B|-|A\\cap B|", title: "Inclusion-Exclusion", domain: "discrete_math", relation: "used_together", explanation: "Another core set identity." },
      { id: "boolean-demorgan", latex: "\\neg(P\\lor Q)=\\neg P\\land\\neg Q", title: "Boolean De Morgan", domain: "discrete_math", relation: "application", explanation: "The logical version of the set law." },
    ],
    prerequisites: [
      { title: "Union and intersection", level: "elementary", reason: "The law flips these operations." },
      { title: "Complement or negation", level: "high_school", reason: "The outer bar means not." },
    ],
    boundaryCases: [
      { title: "A is empty", description: "The identity reduces to the complement of B." },
      { title: "A is the universe", description: "The complement of A is empty, so the right side behaves accordingly." },
      { title: "Universe not specified", description: "Set complements need an implicit or explicit universe." },
    ],
    pitfalls: ["The bar must apply to the whole expression.", "Do not forget to flip union to intersection.", "Complement depends on the universe."],
  },
  modular_congruence: {
    type: "modular_congruence",
    domain: "discrete_math",
    oneLineIntuition: "A congruence says two numbers have the same remainder after division by a modulus.",
    plainExplanation: "a is congruent to b modulo n when a-b is divisible by n.",
    beginnerExplanation: "Clock time is modular: 14 o'clock and 2 o'clock match on a 12-hour clock.",
    analogy: "A circular number line where numbers landing on the same tick are congruent.",
    strictExplanation: "a equiv b (mod n) iff n divides a-b. This relation partitions integers into residue classes modulo n.",
    whyItMatters: "Modular arithmetic is central in number theory, cryptography, hashing, algorithms, and cyclic schedules.",
    variables: [
      { symbol: "a", role: "left integer", meaning: "First number being compared.", adjustable: true, defaultValue: 14, min: -50, max: 50, step: 1 },
      { symbol: "b", role: "right integer", meaning: "Second number being compared.", adjustable: true, defaultValue: 2, min: -50, max: 50, step: 1 },
      { symbol: "n", role: "modulus", meaning: "Cycle size or divisor.", adjustable: true, defaultValue: 12, min: 2, max: 24, step: 1 },
    ],
    symbols: [
      { symbol: "\\equiv", name: "congruent", category: "relation", meaning: "Same remainder under a modulus.", readAs: "is congruent to" },
      { symbol: "\\pmod n", name: "modulus", category: "operator", meaning: "Use remainders after division by n.", readAs: "modulo n" },
      { symbol: "n\\mid(a-b)", name: "divisibility test", category: "relation", meaning: "n divides the difference.", readAs: "n divides a minus b" },
    ],
    readingOrder: [
      { order: 1, fragment: "a-b", explanation: "Compare the two numbers by subtracting." },
      { order: 2, fragment: "n\\mid(a-b)", explanation: "Check whether the difference is a multiple of n." },
      { order: 3, fragment: "a\\equiv b\\pmod n", explanation: "If yes, they are in the same residue class." },
    ],
    computationSteps: [
      { title: "Find remainders", description: "Divide a and b by n and keep the remainders." },
      { title: "Compare remainders", description: "Equal remainders mean congruence." },
      { title: "Alternative test", description: "Check whether n divides a-b." },
    ],
    toyExample: {
      title: "Clock arithmetic",
      description: "Compare 14 and 2 modulo 12.",
      steps: ["14 leaves remainder 2 when divided by 12.", "2 leaves remainder 2.", "Their difference 12 is divisible by 12."],
      result: "14 equiv 2 (mod 12).",
    },
    relatedFormulas: [
      { id: "mod-addition", latex: "(a+b)\\bmod n", title: "Modular Addition", domain: "discrete_math", relation: "used_together", explanation: "Addition can be reduced by the same modulus." },
      { id: "fermat", latex: "a^{p-1}\\equiv 1\\pmod p", title: "Fermat's Little Theorem", domain: "discrete_math", relation: "application", explanation: "A major theorem about congruences modulo primes." },
    ],
    prerequisites: [
      { title: "Integer division", level: "elementary", reason: "Remainders define congruence." },
      { title: "Divisibility", level: "high_school", reason: "The difference test uses divisibility." },
    ],
    boundaryCases: [
      { title: "n = 1", description: "All integers are congruent modulo 1, so most contexts use n > 1." },
      { title: "Negative integers", description: "Remainders can be normalized into 0 to n-1." },
      { title: "Prime modulus", description: "Many stronger algebraic properties become available." },
    ],
    pitfalls: ["Modulo equality is not ordinary equality.", "Always state the modulus.", "Different programming languages handle negative remainder signs differently."],
  },
  unknown: {
    type: "unknown",
    domain: "general",
    oneLineIntuition: "FormulaForge does not yet have enough structure to explain this formula confidently.",
    plainExplanation: "The formula can be rendered and checked, but it did not match a supported family strongly enough.",
    beginnerExplanation: "Try selecting a formula type manually or adding context from the paper.",
    analogy: "The symbols are visible, but the grammar has not been recognized yet.",
    strictExplanation: "No deterministic analyzer matched this formula family.",
    whyItMatters: "Unknown formulas are the extension point for future parser and LLM-assisted analysis.",
    variables: noVariables,
    symbols: [],
    readingOrder: [],
    computationSteps: [],
    toyExample: { title: "No reliable example", description: "A supported family is needed first.", steps: ["Select a type or load an example."], result: "No numeric result is available." },
    relatedFormulas: [],
    prerequisites: [],
    boundaryCases: [],
    pitfalls: ["Automatic formula understanding is limited to the supported formula families."],
  },
};

export function getFormulaBlueprint(type: FormulaType): FormulaBlueprint {
  return formulaBlueprints[type] ?? formulaBlueprints.unknown;
}
