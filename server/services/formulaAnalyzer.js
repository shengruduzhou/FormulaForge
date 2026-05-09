const supportedTypes = [
  "weighted_loss",
  "softmax",
  "sigmoid",
  "gradient_descent",
  "cross_entropy",
  "bayes_rule",
  "combination",
  "permutation",
  "set_identity",
  "graph_degree",
  "logic_quantifier",
  "recurrence_relation",
];

function normalizeLatex(latex) {
  return String(latex ?? "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/^\$\$?|\$\$?$/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreType(latex, context = "") {
  const value = `${latex} ${context}`.toLowerCase();
  const compact = value.replace(/\s+/g, "");
  const score = {
    weighted_loss: Number(/\\lambda|weighted|loss/.test(value)) + Number(/l_\{|objective|rec|adv/.test(value)),
    softmax: Number(/e\^\{?z|\\sum.*e\^|softmax/.test(value)) + Number(/p_i|logit|z_i/.test(value)),
    sigmoid: Number(/\\sigma|sigmoid/.test(value)) + Number(/1\+e\^\{?-?x|1\s*\+\s*e\^\{?-?x/.test(compact)),
    gradient_descent: Number(/\\theta|theta/.test(value)) + Number(/\\eta|eta|\\nabla|gradient|descent/.test(value)),
    cross_entropy: Number(/h\(p,q\)|cross.?entropy|\\log|log/.test(value)) + Number(/-\s*\\sum|p_i.*q_i|y_i.*p_i/.test(value)),
    bayes_rule: Number(/p\(a\|b\)|p\(b\|a\)|bayes|posterior|prior|likelihood/.test(value)) + Number(/\\frac/.test(value)),
    combination: Number(/\\binom|\\choose|combination|binomial/.test(value)) + Number(/k!\(n-k\)!/.test(compact)),
    permutation: Number(/p\(n,k\)|permutation/.test(value)) + Number(/n!\/\(n-k\)!/.test(compact)),
    set_identity: Number(/\\cup|\\cap|inclusion|venn|union|intersection/.test(value)) + Number(/\|a\\cupb\||\|a\\cupb\|/.test(compact)),
    graph_degree: Number(/\\deg|deg|degree|graph|vertex|edge|handshaking/.test(value)) + Number(/2\|e\|/.test(compact)),
    logic_quantifier: Number(/\\forall|\\exists|∀|∃|predicate|quantifier/.test(value)) + Number(/r\(x,y\)|\\in/.test(value)),
    recurrence_relation: Number(/recurrence|a_n|a_\{n\}|fibonacci/.test(value)) + Number(/n-1|n\+1|a_\{n-1\}/.test(value)),
  };

  const [type, bestScore] = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
  return {
    type: bestScore >= 1 ? type : "unknown",
    confidence: bestScore >= 1 ? Math.min(0.96, 0.55 + bestScore * 0.18) : 0.2,
    scores: score,
  };
}

const copies = {
  weighted_loss: {
    summary: "A weighted loss combines several objectives into one scalar target, with each weight controlling a term's influence.",
    symbols: ["lambda_i: importance multiplier", "L_i: component loss", "sum: total objective"],
    boundaryCases: ["lambda_i=0 removes a term.", "Very large weights can dominate training.", "Loss scale can matter as much as weight size."],
    visualizationSpec: { kind: "weighted_contribution", title: "Weighted Contribution Explorer" },
  },
  sigmoid: {
    summary: "Sigmoid turns one unrestricted score into a smooth value between 0 and 1.",
    symbols: ["x: input score", "e^{-x}: exponential bend", "sigma(x): output probability-like value"],
    boundaryCases: ["Large negative x approaches 0.", "x=0 gives 0.5.", "Large positive x approaches 1."],
    visualizationSpec: { kind: "curve", title: "Sigmoid Curve" },
  },
  softmax: {
    summary: "Softmax turns competing scores into probabilities that add to one.",
    symbols: ["z_i: raw score", "e^{z_i}: positive score", "sum_j: shared denominator", "p_i: normalized probability"],
    boundaryCases: ["Equal logits produce a uniform distribution.", "One huge logit dominates.", "Adding one constant to all logits changes nothing."],
    visualizationSpec: { kind: "probability_tree", title: "Softmax Probability Tree" },
  },
  cross_entropy: {
    summary: "Cross entropy measures how costly it is to believe q when the target distribution is p.",
    symbols: ["p_i: target probability", "q_i: predicted probability", "log q_i: surprise penalty"],
    boundaryCases: ["q_i close to 1 gives low loss.", "q_i close to 0 with p_i>0 gives very high loss."],
    visualizationSpec: { kind: "truth_table", title: "Cross Entropy Surprise Table" },
  },
  combination: {
    summary: "A combination counts unordered ways to choose k objects from n.",
    symbols: ["n: total objects", "k: chosen objects", "!: factorial", "binom(n,k): unordered count"],
    boundaryCases: ["k=0 gives one empty choice.", "k=n gives one all-in choice.", "k>n gives no valid choice."],
    visualizationSpec: { kind: "counting_grid", title: "Combination Counting Grid" },
  },
  permutation: {
    summary: "A permutation counts ordered ways to choose k objects from n.",
    symbols: ["n: total objects", "k: ordered slots", "P(n,k): ordered count"],
    boundaryCases: ["k=0 gives one empty ordering.", "k>n gives no valid ordering without replacement."],
    visualizationSpec: { kind: "counting_grid", title: "Permutation Counting Grid" },
  },
  set_identity: {
    summary: "Inclusion-exclusion counts a union by adding both sets and subtracting the overlap once.",
    symbols: ["A cup B: union", "A cap B: intersection", "|A|: set size"],
    boundaryCases: ["Disjoint sets add directly.", "If A=B, the formula returns |A|."],
    visualizationSpec: { kind: "venn", title: "Venn Diagram" },
  },
  graph_degree: {
    summary: "The sum of all vertex degrees in an undirected graph is twice the number of edges.",
    symbols: ["V: vertices", "E: edges", "deg(v): edges touching v"],
    boundaryCases: ["An isolated vertex contributes 0.", "A self-loop often contributes 2."],
    visualizationSpec: { kind: "graph", title: "Graph Degree Diagram" },
  },
  bayes_rule: {
    summary: "Bayes' rule updates a prior belief after evidence arrives.",
    symbols: ["P(A): prior", "P(B|A): likelihood", "P(B): evidence", "P(A|B): posterior"],
    boundaryCases: ["P(B)=0 is undefined.", "A zero prior cannot be rescued by likelihood."],
    visualizationSpec: { kind: "probability_tree", title: "Bayes Evidence Tree" },
  },
  logic_quantifier: {
    summary: "The statement says every x in A has at least one related y in B.",
    symbols: ["forall: for every", "exists: at least one", "R(x,y): relation to satisfy"],
    boundaryCases: ["If A is empty, the statement is vacuously true.", "If B is empty and A is not, the statement is false.", "Swapping quantifier order changes the meaning."],
    visualizationSpec: { kind: "truth_table", title: "Quantifier Truth Table" },
  },
  recurrence_relation: {
    summary: "A recurrence defines a term using previous terms plus base cases.",
    symbols: ["a_n: current term", "a_{n-1}: previous term", "base cases: starting values"],
    boundaryCases: ["Without base cases the sequence cannot start.", "Naive expansion can grow quickly."],
    visualizationSpec: { kind: "recurrence_tree", title: "Recurrence Tree" },
  },
  gradient_descent: {
    summary: "Gradient descent lowers loss by stepping opposite the gradient.",
    symbols: ["theta_t: current parameter", "eta: learning rate", "nabla L: uphill direction"],
    boundaryCases: ["Tiny learning rates are slow.", "Large learning rates can oscillate or diverge."],
    visualizationSpec: { kind: "curve", title: "Gradient Descent Trajectory" },
  },
  unknown: {
    summary: "The backend cannot confidently identify this formula family yet.",
    symbols: [],
    boundaryCases: [],
    visualizationSpec: { kind: "none", title: "No visualization available" },
  },
};

function buildReadingOrder(type) {
  const orders = {
    sigmoid: ["Read x", "Compute e^{-x}", "Add 1", "Take the reciprocal"],
    softmax: ["Read logits z_i", "Exponentiate each score", "Sum exponentials", "Divide each score by the shared sum"],
    cross_entropy: ["Read q_i", "Take log q_i", "Weight by p_i", "Sum and negate"],
    combination: ["Count ordered picks", "Remove unchosen order", "Divide by k! duplicate orders"],
    set_identity: ["Add |A| and |B|", "Find the overlap", "Subtract the overlap once"],
    graph_degree: ["Count degree per vertex", "Sum over vertices", "Each edge is counted twice"],
    bayes_rule: ["Start with prior", "Multiply by likelihood", "Divide by evidence"],
    logic_quantifier: ["Pick any x in A", "Find some y in B", "Check R(x,y)"],
  };
  return (orders[type] ?? []).map((text, index) => ({ order: index + 1, explanation: text }));
}

export function analyzeFormulaRequest(body) {
  const latex = normalizeLatex(body?.latex);
  if (!latex) return { error: "latex is required", analysis: null };

  const selectedType = supportedTypes.includes(body?.selectedType) ? body.selectedType : "auto";
  const detection = scoreType(latex, body?.context);
  const type = selectedType === "auto" ? detection.type : selectedType;
  const copy = copies[type] ?? copies.unknown;

  return {
    id: body?.id ?? "api-formula",
    latex,
    normalizedLatex: latex,
    detectedType: type,
    formulaFamily: type,
    confidence: selectedType === "auto" ? detection.confidence : 0.99,
    domain: body?.domain ?? "general",
    oneLineIntuition: copy.summary,
    summary: copy.summary,
    symbols: copy.symbols,
    readingOrder: buildReadingOrder(type),
    boundaryCases: copy.boundaryCases,
    relatedFormulas: [],
    visualizationSpec: { ...copy.visualizationSpec, description: copy.summary, parameters: [] },
    warnings: type === "unknown" ? ["Choose a type manually or provide more context."] : [],
    createdAt: new Date().toISOString(),
  };
}
