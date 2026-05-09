const supportedTypes = [
  "weighted_loss",
  "softmax",
  "sigmoid",
  "gradient_descent",
  "cross_entropy",
  "bayes_rule",
  "combination",
  "set_identity",
  "graph_degree",
];

function normalizeLatex(latex) {
  return String(latex ?? "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/^\$\$?|\$\$?$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreType(latex, context = "") {
  const haystack = `${latex} ${context}`.toLowerCase();
  const scores = {
    weighted_loss: [/lambda|\\lambda|loss|l_/.test(haystack), /l_\{?(rec|adv|perceptual|total)/.test(haystack)],
    softmax: [/softmax|\\sum.*e\^|e\^\{?z/.test(haystack), /temperature|\/t|p_i/.test(haystack)],
    sigmoid: [/sigmoid|sigma|\\sigma|1\s*\+\s*e\^\{-?x/.test(haystack)],
    gradient_descent: [/theta|\\theta|\\nabla|gradient/.test(haystack), /eta|\\eta|t\+1|descent/.test(haystack)],
    cross_entropy: [/cross entropy|\\log|log/.test(haystack), /-\s*\\sum|y_i.*p_i/.test(haystack)],
    bayes_rule: [/p\(a\|b\)|p\(b\|a\)|bayes/.test(haystack)],
    combination: [/\\binom|c\(n,k\)|n!/.test(haystack), /k!\(n-k\)!|combination/.test(haystack)],
    set_identity: [/\\cup|\\cap|union|intersection/.test(haystack), /\|a\\cup b\||set/.test(haystack)],
    graph_degree: [/deg|\\deg|g=\(v,e\)|graph/.test(haystack), /2\|e\||handshaking|vertex/.test(haystack)],
  };

  let bestType = "unknown";
  let bestScore = 0;

  for (const [type, checks] of Object.entries(scores)) {
    const score = checks.filter(Boolean).length / checks.length;
    if (score > bestScore) {
      bestType = type;
      bestScore = score;
    }
  }

  return {
    type: bestScore >= 0.5 ? bestType : "unknown",
    confidence: bestScore >= 0.5 ? Number(Math.min(0.96, 0.55 + bestScore * 0.35).toFixed(2)) : 0.2,
  };
}

function buildCopy(type, language) {
  const zh = language === "zh";
  const copies = {
    weighted_loss: {
      summary: zh
        ? "加权损失把多个训练目标合成一个总目标，每个权重控制对应目标在优化中的声音大小。"
        : "A weighted loss combines several objectives into one scalar target, with each weight controlling a term's influence.",
      boundaryCases: zh
        ? [
            "lambda 为 0 时，该项不影响总损失和梯度。",
            "lambda 很大时，该项可能压过其他训练目标。",
            "不同损失尺度会改变真实贡献，不能只看权重大小。",
          ]
        : [
            "When lambda is 0, that term contributes no value or gradient.",
            "A very large lambda can dominate the training objective.",
            "Different loss scales change the true contribution, so weights are not the whole story.",
          ],
    },
    softmax: {
      summary: zh ? "Softmax 把一组分数变成总和为 1 的概率分布。" : "Softmax turns scores into a probability distribution that sums to one.",
      boundaryCases: zh ? ["温度接近 0 时接近赢家通吃。", "温度很高时接近均匀分布。", "所有分数加同一常数，结果不变。"] : ["Low temperature is close to winner-take-all.", "High temperature approaches a uniform distribution.", "Adding one constant to every score does not change the output."],
    },
    sigmoid: {
      summary: zh ? "Sigmoid 把任意实数平滑映射到 0 到 1 之间。" : "Sigmoid smoothly maps any real number into the interval from 0 to 1.",
      boundaryCases: zh ? ["输入很负时输出接近 0。", "输入为 0 时输出为 0.5。", "输入很正时输出接近 1。"] : ["Very negative inputs approach 0.", "Input 0 maps to 0.5.", "Very positive inputs approach 1."],
    },
    gradient_descent: {
      summary: zh ? "梯度下降通过减去梯度方向的一小步来降低损失。" : "Gradient descent lowers loss by stepping a small distance opposite the gradient.",
      boundaryCases: zh ? ["学习率太小会很慢。", "学习率合适会稳定下降。", "学习率太大会震荡或发散。"] : ["Tiny learning rates are slow.", "Reasonable learning rates descend steadily.", "Large learning rates can oscillate or diverge."],
    },
    cross_entropy: {
      summary: zh ? "交叉熵惩罚模型给正确答案太低概率。" : "Cross entropy penalizes the model for assigning low probability to the correct answer.",
      boundaryCases: zh ? ["正确概率接近 1 时损失接近 0。", "正确概率接近 0 时损失快速增大。"] : ["Loss approaches 0 as correct probability approaches 1.", "Loss grows quickly as correct probability approaches 0."],
    },
    bayes_rule: {
      summary: zh ? "贝叶斯公式用新证据更新原有信念。" : "Bayes' rule updates an existing belief after new evidence.",
      boundaryCases: zh ? ["P(B)=0 时条件概率无定义。", "先验为 0 时后验也无法变成正数。"] : ["If P(B)=0, the conditional probability is undefined.", "A zero prior cannot be rescued by likelihood."],
    },
    combination: {
      summary: zh ? "组合数计算不考虑顺序的选择数量。" : "Combinations count unordered selections.",
      boundaryCases: zh ? ["k=0 时只有一种选法。", "k=n 时只有一种选法。", "k>n 时没有合法选法。"] : ["k=0 gives one empty selection.", "k=n gives one full selection.", "k>n gives no valid selections."],
    },
    set_identity: {
      summary: zh ? "集合公式描述并集、交集和重复计数。" : "Set identities describe union, intersection, and overlap counting.",
      boundaryCases: zh ? ["不相交时并集大小直接相加。", "两个集合相同时并集和交集都等于该集合。"] : ["Disjoint sets add directly.", "Equal sets have the same union and intersection."],
    },
    graph_degree: {
      summary: zh ? "节点度数表示有多少条边连接到该节点。" : "A node's degree counts how many edges touch it.",
      boundaryCases: zh ? ["孤立点度数为 0。", "自环在常见无向图约定中贡献 2。"] : ["An isolated vertex has degree 0.", "A self-loop often contributes 2 in undirected graphs."],
    },
    unknown: {
      summary: zh ? "当前后端无法可靠识别该公式类型。" : "The backend cannot confidently identify this formula family yet.",
      boundaryCases: [],
    },
  };

  return copies[type] ?? copies.unknown;
}

function buildStructure(type, language) {
  const zh = language === "zh";
  const structures = {
    weighted_loss: {
      label: zh ? "总目标" : "Total Objective",
      role: zh ? "加权求和" : "Weighted sum",
      parts: zh ? ["权重 lambda", "子损失 L_i", "求和得到总损失"] : ["lambda weights", "component losses L_i", "sum into total loss"],
    },
    softmax: {
      label: zh ? "概率归一化" : "Probability Normalization",
      role: zh ? "从分数到概率" : "Scores to probabilities",
      parts: zh ? ["原始分数 z_i", "指数变换", "公共分母", "概率 p_i"] : ["raw logits z_i", "exponentiation", "shared denominator", "probability p_i"],
    },
    graph_degree: {
      label: zh ? "图的度数" : "Graph Degree",
      role: zh ? "点边结构" : "Node-edge structure",
      parts: zh ? ["顶点 V", "边 E", "关联边计数", "握手定理"] : ["vertices V", "edges E", "incident edge count", "handshaking lemma"],
    },
  };

  return structures[type] ?? {
    label: zh ? "公式结构" : "Formula Structure",
    role: zh ? "模板级拆解" : "Template decomposition",
    parts: [],
  };
}

export function analyzeFormulaRequest(body) {
  const latex = normalizeLatex(body?.latex);
  if (!latex) {
    return {
      error: "latex is required",
      analysis: null,
    };
  }

  const language = body?.language === "zh" ? "zh" : "en";
  const selectedType = supportedTypes.includes(body?.selectedType) ? body.selectedType : "auto";
  const detection = scoreType(latex, body?.context);
  const type = selectedType === "auto" ? detection.type : selectedType;
  const copy = buildCopy(type, language);

  return {
    id: body?.id ?? "api-formula",
    latex,
    detectedType: type,
    confidence: selectedType === "auto" ? detection.confidence : 0.99,
    domain: body?.domain ?? "general",
    summary: copy.summary,
    structure: buildStructure(type, language),
    boundaryCases: copy.boundaryCases,
    warnings: type === "unknown" ? ["Choose a type manually or provide more context."] : [],
    createdAt: new Date().toISOString(),
  };
}
