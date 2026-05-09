import { create } from "zustand";
import type { FormulaAnalysis } from "../schemas/analysis";
import type {
  BoundaryCase,
  ComputationStep,
  Domain,
  FormulaStructureNode,
  FormulaType,
  ToyExample,
} from "../schemas/formula";
import type { VisualizationKind, VisualizationSpec } from "../schemas/visualization";

export type Language = "en" | "zh";

const languageKey = "formulaForge.language";

interface I18nState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(languageKey);
  return stored === "zh" ? "zh" : "en";
}

function persistLanguage(language: Language) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(languageKey, language);
  }
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: getInitialLanguage(),
  setLanguage: (language) => {
    persistLanguage(language);
    set({ language });
  },
  toggleLanguage: () => {
    const next = get().language === "en" ? "zh" : "en";
    persistLanguage(next);
    set({ language: next });
  },
}));

export const uiText = {
  en: {
    workspace: "Workspace",
    examples: "Examples",
    docs: "Docs",
    github: "GitHub",
    formulaInput: "Formula Input",
    formulaType: "Formula Type",
    latexFormula: "LaTeX Formula",
    context: "Context",
    domain: "Domain",
    analyzeFormula: "Analyze Formula",
    loadExample: "Load Example",
    clear: "Clear",
    autoAnalyze: "Auto analysis runs after you pause typing.",
    explanation: "Explanation",
    beginner: "Beginner",
    intuition: "Intuition",
    analogy: "Analogy",
    steps: "Steps",
    example: "Example",
    strict: "Strict",
    variables: "Variables",
    why: "Why",
    pitfalls: "Pitfalls",
    boundaryCases: "Boundary Cases",
    health: "Formula Health Check",
    related: "Related Formulas",
    prerequisites: "Learning Path",
    confidence: "confidence",
    empty: "Paste a formula to start automatic analysis.",
  },
  zh: {
    workspace: "工作台",
    examples: "示例",
    docs: "文档",
    github: "GitHub",
    formulaInput: "公式输入",
    formulaType: "公式类型",
    latexFormula: "LaTeX 公式",
    context: "论文上下文",
    domain: "领域",
    analyzeFormula: "解析公式",
    loadExample: "加载示例",
    clear: "清空",
    autoAnalyze: "停止输入后会自动解析。",
    explanation: "公式解析",
    beginner: "初学者",
    intuition: "直觉",
    analogy: "类比",
    steps: "步骤",
    example: "小例子",
    strict: "严格解释",
    variables: "符号表",
    why: "为什么重要",
    pitfalls: "常见误区",
    boundaryCases: "边界情况",
    health: "公式健康检查",
    related: "相关公式",
    prerequisites: "学习路径",
    confidence: "置信度",
    empty: "粘贴公式后会自动开始解析。",
  },
} as const;

export const formulaTypeLabelsByLanguage: Record<Language, Record<FormulaType | "auto", string>> = {
  en: {
    auto: "Auto Detect",
    weighted_loss: "Weighted Loss",
    softmax: "Softmax",
    sigmoid: "Sigmoid",
    gradient_descent: "Gradient Descent",
    cross_entropy: "Cross Entropy",
    bayes_rule: "Bayes' Rule",
    combination: "Combination",
    permutation: "Permutation",
    set_identity: "Set Identity",
    graph_degree: "Graph Degree",
    logic_quantifier: "Logic / Quantifier",
    recurrence_relation: "Recurrence Relation",
    unknown: "Unknown",
  },
  zh: {
    auto: "自动识别",
    weighted_loss: "加权损失",
    softmax: "Softmax 归一化",
    sigmoid: "Sigmoid 函数",
    gradient_descent: "梯度下降",
    cross_entropy: "交叉熵",
    bayes_rule: "贝叶斯公式",
    combination: "组合数",
    permutation: "排列数",
    set_identity: "集合公式",
    graph_degree: "图论度数",
    logic_quantifier: "逻辑量词",
    recurrence_relation: "递推关系",
    unknown: "未识别",
  },
};

export const domainLabelsByLanguage: Record<Language, Record<Domain, string>> = {
  en: {
    ai_ml: "AI / Machine Learning",
    math_stats: "Math / Statistics",
    discrete_math: "Discrete Math",
    physics: "Physics",
    engineering: "Engineering",
    general: "General",
  },
  zh: {
    ai_ml: "AI / 机器学习",
    math_stats: "数学 / 统计",
    discrete_math: "离散数学",
    physics: "物理",
    engineering: "工程",
    general: "通用",
  },
};

interface AnalysisCopy {
  plainExplanation: string;
  beginnerExplanation: string;
  analogy: string;
  strictExplanation: string;
  whyItMatters: string;
  computationSteps: ComputationStep[];
  toyExample: ToyExample;
  boundaryCases: BoundaryCase[];
  pitfalls: string[];
}

const zhAnalysisCopy: Record<FormulaType, AnalysisCopy> = {
  weighted_loss: {
    plainExplanation:
      "加权损失把多个训练目标合成一个总目标。每个 lambda 像一个旋钮，调大它会让优化器更重视对应损失，但损失本身的数值尺度也同样重要。",
    beginnerExplanation:
      "可以把它想成给作业打分：内容、格式、速度各有分数，也各有权重。先把每一项乘上权重，再加起来，就得到最终成绩。",
    analogy:
      "它像调音台的多个音轨。推高某个滑杆会让那一路声音更明显，但如果某条音轨原本就很响，即使滑杆不高也可能主导整体效果。",
    strictExplanation:
      "加权目标函数通过线性组合多个标量损失得到一个可优化的总目标。优化器最小化 sum_i lambda_i L_i，因此每个子损失的梯度贡献都会被对应的 lambda_i 缩放。",
    whyItMatters:
      "论文中常用它同时平衡重建质量、真实性、平滑性、正则化或感知质量等目标。读懂权重，就是读懂作者希望模型优先满足什么。",
    computationSteps: [
      { title: "读出每个子损失", description: "每个 L_i 衡量一种误差或偏好，比如重建误差、对抗误差或正则项。" },
      { title: "乘上对应权重", description: "用 lambda_i 调节该损失进入总目标时的强弱。", expression: "\\lambda_i L_i" },
      { title: "加成一个总损失", description: "把所有加权项相加，训练时优化器只看到这个总分。", expression: "L_{total}=\\sum_i \\lambda_i L_i" },
      { title: "观察梯度权衡", description: "改变 lambda 会改变各个目标对参数更新方向的影响。" },
    ],
    toyExample: {
      title: "两个损失的小例子",
      description: "假设重建损失是 2.0，正则损失是 0.5。",
      steps: ["令 lambda_rec = 1.0，贡献为 2.0。", "令 lambda_reg = 0.4，贡献为 0.2。", "总损失是 2.0 + 0.2。"],
      result: "最终 L_total = 2.2，这一步更新主要由重建损失主导。",
    },
    boundaryCases: [
      { title: "lambda_i = 0", description: "该项完全不参与总损失，也不会给参数更新提供梯度。" },
      { title: "lambda_i 很大", description: "训练可能过度追求某个目标，牺牲其他目标，比如图像更平滑但细节变差。" },
      { title: "损失尺度不同", description: "权重小不代表影响小。如果某个损失或梯度本身很大，它仍然可能主导训练。" },
    ],
    pitfalls: [
      "不能只看 lambda 大小判断重要性，还要看损失值和梯度尺度。",
      "加权和会掩盖目标之间的冲突，某些项可能在训练中互相拉扯。",
      "实际项目常需要归一化、动态调度或反复实验来确定权重。",
    ],
  },
  softmax: {
    plainExplanation:
      "Softmax 把一组原始分数转换成概率分布。分数越高通常概率越大，temperature 控制分布是更尖锐还是更平均。",
    beginnerExplanation:
      "先有一组分数，Softmax 把它们变成加起来等于 100% 的比例。最高分通常拿到最大比例，但其他分数也会分到一些。",
    analogy:
      "像把比赛得分转换成投票份额。温度低时赢家几乎拿走全部票；温度高时票会分得更平均。",
    strictExplanation:
      "Softmax 对每个缩放后的 logit 做指数变换，再除以所有指数项之和。输出均为正数，总和为 1，并且每个概率都通过同一个分母互相耦合。",
    whyItMatters:
      "它是分类器、注意力机制和采样系统中从模型分数到概率的标准桥梁。",
    computationSteps: [
      { title: "缩放分数", description: "把每个原始分数除以温度 T。", expression: "z_i / T" },
      { title: "变成正数", description: "对缩放后的分数取指数，所有结果都大于 0。", expression: "e^{z_i/T}" },
      { title: "求公共分母", description: "把所有类别的指数项相加。", expression: "\\sum_j e^{z_j/T}" },
      { title: "归一化", description: "每一项除以公共分母，使所有概率加起来等于 1。" },
    ],
    toyExample: {
      title: "三个 logit",
      description: "取分数 [2, 1, 0]，温度 T = 1。",
      steps: ["指数值约为 [7.39, 2.72, 1.00]。", "它们的和约为 11.11。", "每个指数值除以 11.11。"],
      result: "得到的概率约为 [0.67, 0.24, 0.09]。",
    },
    boundaryCases: [
      { title: "T 接近 0", description: "最大 logit 几乎获得全部概率，行为接近 argmax。" },
      { title: "T 趋向无穷大", description: "分数差异被压平，概率逐渐接近均匀分布。" },
      { title: "所有 logit 加同一个常数", description: "输出不变，因为 Softmax 只关心相对差距。" },
    ],
    pitfalls: [
      "Softmax 输出是竞争关系，一个概率升高通常会压低其他概率。",
      "概率看起来很自信，不代表模型一定正确。",
      "温度会改变校准和采样行为，但不会改变 logit 的排序。",
    ],
  },
  sigmoid: {
    plainExplanation:
      "Sigmoid 把任意实数平滑压到 0 和 1 之间。它在 0 附近最敏感，在很大或很小的输入处会饱和。",
    beginnerExplanation:
      "Sigmoid 像一个柔和的是否旋钮：很负接近 0，很正接近 1，输入为 0 时刚好是 0.5。",
    analogy: "它像调光开关，不是突然开关灯，而是从暗到亮平滑过渡。",
    strictExplanation:
      "logistic 函数 sigma(x)=1/(1+e^{-x}) 单调、可导且有界。其导数 sigma(x)(1-sigma(x)) 在 x=0 时最大。",
    whyItMatters: "它常用于二分类概率、门控机制和需要平滑开关行为的模型。",
    computationSteps: [
      { title: "取相反数", description: "先得到 -x。" },
      { title: "计算指数", description: "计算 e^{-x}，它始终为正。" },
      { title: "分母加一", description: "分母变成 1 + e^{-x}。" },
      { title: "取倒数", description: "用 1 除以分母，得到 0 到 1 之间的输出。" },
    ],
    toyExample: {
      title: "输入 x = 0",
      description: "中点最容易计算。",
      steps: ["e^0 = 1。", "分母是 1 + 1 = 2。", "1 / 2 = 0.5。"],
      result: "所以 sigma(0) = 0.5。",
    },
    boundaryCases: [
      { title: "x 很负", description: "输出接近 0，梯度也会变小。" },
      { title: "x = 0", description: "输出为 0.5，曲线变化最快。" },
      { title: "x 很正", description: "输出接近 1，继续增大 x 的影响会越来越小。" },
    ],
    pitfalls: [
      "极端输入会导致梯度很小，训练可能变慢。",
      "多个 sigmoid 输出彼此独立，不会自动加起来等于 1。",
      "多类别互斥分类通常更适合 Softmax。",
    ],
  },
  gradient_descent: {
    plainExplanation:
      "梯度下降沿着梯度的反方向更新参数。梯度指向局部上升最快的方向，所以减去它可以让损失下降。",
    beginnerExplanation: "想象你在雾中下山。你摸到哪边最陡地向上，就朝反方向迈一小步。",
    analogy: "像调旋钮：先判断往哪个方向会让错误变大，再朝相反方向调一点。",
    strictExplanation:
      "第 t 步的更新为 theta_{t+1}=theta_t-eta grad L(theta_t)。在足够光滑的目标和合适学习率下，重复更新可趋近局部最小值。",
    whyItMatters: "这是现代机器学习训练的基础更新规则，从线性模型到深度神经网络都会用到它的变体。",
    computationSteps: [
      { title: "查看当前损失", description: "从当前参数 theta_t 所在位置开始。" },
      { title: "计算梯度", description: "找出局部上升最快的方向。", expression: "\\nabla L(\\theta_t)" },
      { title: "乘以学习率", description: "用 eta 控制这一步走多远。" },
      { title: "向下移动", description: "从当前参数中减去缩放后的梯度。", expression: "\\theta_{t+1}=\\theta_t-\\eta\\nabla L(\\theta_t)" },
    ],
    toyExample: {
      title: "一维损失",
      description: "令 L(x)=x^2，从 x=4 开始，eta=0.1。",
      steps: ["梯度是 2x，所以当前梯度为 8。", "步长为 eta * gradient = 0.8。", "新的 x = 4 - 0.8。"],
      result: "x 变为 3.2，更接近最小值 0。",
    },
    boundaryCases: [
      { title: "学习率太小", description: "更新稳定但很慢，需要很多步才能明显下降。" },
      { title: "学习率合适", description: "在演示的凸损失上会较快靠近最低点。" },
      { title: "学习率太大", description: "可能越过最低点、来回震荡，甚至发散。" },
    ],
    pitfalls: [
      "负梯度只是局部方向，不保证一步走向全局最优。",
      "学习率会和曲率、数据尺度、优化器细节共同作用。",
      "神经网络损失常常非凸，真实轨迹会比示意图复杂。",
    ],
  },
  cross_entropy: {
    plainExplanation: "交叉熵衡量模型对正确答案有多意外。正确类别概率越低，惩罚越大。",
    beginnerExplanation: "如果正确类别应该拿高概率，交叉熵会奖励高概率，严厉惩罚低概率。",
    analogy: "像考试评分：不确定还可以，特别自信地答错会扣得更多。",
    strictExplanation:
      "对目标分布 y 和预测分布 p，交叉熵为 H(y,p)=-sum_i y_i log p_i。若 y 是 one-hot 标签，则退化为 -log p_correct。",
    whyItMatters: "它是分类任务中最常见的损失函数，通常和 Softmax 概率一起使用。",
    computationSteps: [
      { title: "读取预测概率", description: "从 Softmax 或概率模型拿到 p_i。" },
      { title: "读取真实目标", description: "y_i 标记哪些类别应该被计入损失。" },
      { title: "应用 log 惩罚", description: "正确类别概率越低，-log 带来的损失越大。" },
      { title: "求和并取负", description: "得到一个非负损失，预测越贴近目标损失越小。" },
    ],
    toyExample: {
      title: "one-hot 类别",
      description: "正确类别概率为 0.8。",
      steps: ["只有正确类别的 y=1。", "损失 = -log(0.8)。", "约等于 0.22。"],
      result: "如果正确类别概率降到 0.1，损失会跳到约 2.30。",
    },
    boundaryCases: [
      { title: "p_correct 接近 1", description: "损失接近 0，说明模型把概率放在正确类别上。" },
      { title: "p_correct 接近 0", description: "损失会快速变大，理论上趋向无穷。" },
      { title: "标签不是 one-hot", description: "公式仍可用于软标签，此时会对多个目标概率同时计分。" },
    ],
    pitfalls: [
      "交叉熵需要概率输入，不应把任意 logit 直接当成 p_i。",
      "损失更低代表更贴近标签，不一定代表概率校准完美。",
    ],
  },
  bayes_rule: {
    plainExplanation: "贝叶斯公式描述看到证据后如何更新信念。它把先验和似然合成后验。",
    beginnerExplanation: "先看某件事原本有多可能，再根据新证据有多支持它来调整这个可能性。",
    analogy: "像根据新线索重新调整嫌疑人名单。",
    strictExplanation:
      "贝叶斯公式 P(A|B)=P(B|A)P(A)/P(B)，其中 P(A|B) 是后验，P(A) 是先验，P(B|A) 是似然，P(B) 起归一化作用。",
    whyItMatters: "它是概率推断、统计建模、朴素贝叶斯分类器和贝叶斯机器学习的基础。",
    computationSteps: [
      { title: "确定假设", description: "A 是你想判断的事件或原因。" },
      { title: "观察证据", description: "B 是已经看到的证据。" },
      { title: "相乘", description: "把先验和证据匹配程度相乘。", expression: "P(B|A)P(A)" },
      { title: "归一化", description: "除以 P(B)，让结果成为合法概率。" },
    ],
    toyExample: {
      title: "一次简单更新",
      description: "假设 P(A)=0.2，P(B|A)=0.9，P(B)=0.3。",
      steps: ["分子是 0.9 * 0.2 = 0.18。", "再除以 0.3。", "后验概率为 0.6。"],
      result: "看到证据 B 后，对 A 的信念从 0.2 升到 0.6。",
    },
    boundaryCases: [
      { title: "P(B)=0", description: "证据本身不可能发生，条件概率没有定义。" },
      { title: "P(A)=0", description: "如果先验为 0，再强的似然也无法把后验变成正数。" },
      { title: "P(B|A) 很大", description: "在分母固定时，证据越符合 A，后验越高。" },
    ],
    pitfalls: ["P(A|B) 和 P(B|A) 不是一回事。", "分母 P(B) 不是装饰项，它负责把概率归一化。"],
  },
  combination: {
    plainExplanation: "组合数计算从 n 个东西里选 k 个且不关心顺序时有多少种选法。",
    beginnerExplanation: "如果先选 Alice 再选 Bob 和先选 Bob 再选 Alice 算同一种结果，就应该用组合数。",
    analogy: "像从班级里选队员，队伍成员相同就算同一队，不看你先念谁的名字。",
    strictExplanation: "二项式系数 C(n,k)=n!/(k!(n-k)!) 计数 n 元集合的 k 元子集。",
    whyItMatters: "组合数广泛出现在计数、概率、二项式展开、图的边选择和离散数学证明中。",
    computationSteps: [
      { title: "先数有序选择", description: "如果顺序重要，可以先按排列方式数。" },
      { title: "去掉重复顺序", description: "同一组 k 个元素内部有 k! 种排列，实际只算一次。" },
      { title: "使用闭式公式", description: "用阶乘把上面的计数压缩成一个公式。", expression: "\\binom{n}{k}=\\frac{n!}{k!(n-k)!}" },
    ],
    toyExample: {
      title: "从 4 个中选 2 个",
      description: "物品是 A、B、C、D。",
      steps: ["可选组合：AB、AC、AD、BC、BD、CD。", "一共有 6 种。", "公式给出 4!/(2!2!) = 6。"],
      result: "所以 C(4,2)=6。",
    },
    boundaryCases: [
      { title: "k = 0", description: "什么都不选也算一种选法。" },
      { title: "k = n", description: "全部选上也只有一种选法。" },
      { title: "k > n", description: "要选的数量超过总数，没有合法选法。" },
    ],
    pitfalls: ["顺序重要时不要用组合数，应考虑排列。", "n 和 k 通常应为非负整数，并且 k <= n。"],
  },
  set_identity: {
    plainExplanation: "集合公式描述集合之间的合并、重叠、相减或计数关系。",
    beginnerExplanation: "把集合想成装对象的圈。并集是任一圈里的对象，交集是两个圈都包含的对象。",
    analogy: "像两张名单：并集是至少出现在一张名单上的人，交集是两张名单都出现的人。",
    strictExplanation:
      "集合恒等式用成员关系和基数关系描述 A union B、A intersection B、A\\B 等结构。在计数时，重叠部分需要特别处理。",
    whyItMatters: "集合是离散数学、概率事件、逻辑推理和数据库查询的基础语言。",
    computationSteps: [
      { title: "确定集合 A 和 B", description: "先明确哪些对象属于 A，哪些对象属于 B。" },
      { title: "应用集合运算", description: "并集取 A 或 B 中的对象，交集只取同时属于二者的对象。" },
      { title: "修正重复计数", description: "计算并集大小时，交集会被算两次，所以需要减掉一次。" },
    ],
    toyExample: {
      title: "两个小集合",
      description: "A={1,2,3}，B={3,4}。",
      steps: ["A union B = {1,2,3,4}。", "A intersection B = {3}。", "|A| + |B| - |A intersection B| = 3 + 2 - 1。"],
      result: "|A union B| = 4。",
    },
    boundaryCases: [
      { title: "两个集合不相交", description: "如果 A 和 B 没有重叠，则 |A union B|=|A|+|B|。" },
      { title: "两个集合完全相同", description: "如果 A=B，那么并集和交集都等于 A。" },
      { title: "一个集合为空", description: "空集不会增加并集大小，和任何集合的交集仍为空。" },
    ],
    pitfalls: ["并集不是普通加法，重叠元素不能算两遍。", "cup 表示并集，cap 表示交集，方向不要混淆。"],
  },
  graph_degree: {
    plainExplanation: "图公式描述节点和边。一个节点的度数就是有多少条边连接到它。",
    beginnerExplanation: "把图想成点和线。某个点连着三条线，它的度数就是 3。",
    analogy: "像社交网络，一个人的度数就是他的直接好友数量。",
    strictExplanation:
      "在无向图 G=(V,E) 中，deg(v) 表示与顶点 v 关联的边数。握手定理说明 sum_{v in V} deg(v)=2|E|。",
    whyItMatters: "度数是网络、图算法、离散数学证明和图学习中的基础指标。",
    computationSteps: [
      { title: "列出顶点", description: "顶点 V 是图中的节点。" },
      { title: "列出边", description: "边 E 是节点之间的连接。" },
      { title: "数关联边", description: "对一个顶点，数所有碰到它的边。" },
      { title: "检查总度数", description: "在无向图中，每条边会给两个端点各贡献 1。" },
    ],
    toyExample: {
      title: "三个节点的路径",
      description: "边为 AB 和 BC。",
      steps: ["deg(A)=1。", "deg(B)=2。", "deg(C)=1。", "总度数为 4。"],
      result: "图中有 2 条边，2|E|=4，正好等于总度数。",
    },
    boundaryCases: [
      { title: "孤立点", description: "没有任何边连接的节点度数为 0。" },
      { title: "自环", description: "在很多无向图约定中，一个自环对度数贡献 2。" },
      { title: "有向图", description: "需要区分入度和出度，不能直接套无向图度数。" },
    ],
    pitfalls: ["有向图的入度、出度和无向度数不是同一个概念。", "多重边是否重复计数取决于图的定义。"],
  },
  permutation: {
    plainExplanation: "排列数计算从 n 个对象中按顺序选出 k 个对象的方式数。",
    beginnerExplanation: "如果先选 Alice 再选 Bob 和先选 Bob 再选 Alice 算不同结果，就用排列。",
    analogy: "像给比赛排金银铜名次，同样三个人顺序不同就是不同结果。",
    strictExplanation: "P(n,k)=n!/(n-k)! 计数从 n 个对象中抽取长度为 k 的有序不重复序列。",
    whyItMatters: "排列常用于排名、排班、密码、抽样和离散概率。",
    computationSteps: [
      { title: "填第一个位置", description: "第一个位置有 n 种选择。" },
      { title: "填后续位置", description: "每选走一个对象，可选对象少一个。" },
      { title: "连乘", description: "得到 n(n-1)...(n-k+1)。", expression: "\\frac{n!}{(n-k)!}" },
    ],
    toyExample: {
      title: "从 4 个中有序选 2 个",
      description: "对象是 A、B、C、D。",
      steps: ["第一位有 4 种选择。", "第二位剩 3 种选择。"],
      result: "P(4,2)=12。",
    },
    boundaryCases: [
      { title: "k = 0", description: "空排列只有一种。" },
      { title: "k > n", description: "不允许重复时没有合法排列。" },
    ],
    pitfalls: ["顺序不重要时不要用排列，应使用组合。"],
  },
  logic_quantifier: {
    plainExplanation: "这个公式表示：A 中每个 x 都能在 B 中找到至少一个 y，使 R(x,y) 成立。",
    beginnerExplanation: "无论你从 A 里挑哪个对象，都必须能在 B 里找到一个匹配对象。",
    analogy: "像每个学生至少有一位导师。",
    strictExplanation: "这是一个一阶逻辑命题，先对 A 做全称量化，再对 B 做存在量化，最后检查关系 R(x,y)。",
    whyItMatters: "量词顺序是离散数学、谓词逻辑、关系和证明中的核心。",
    computationSteps: [
      { title: "任选 x", description: "命题必须对 A 中每一个 x 成立。" },
      { title: "寻找 y", description: "对当前 x，必须存在至少一个 B 中的 y。" },
      { title: "检查关系", description: "确认 R(x,y) 为真。" },
    ],
    toyExample: {
      title: "学生和导师",
      description: "A 是学生集合，B 是导师集合，R 表示“被分配给”。",
      steps: ["选学生 Ana。", "找到导师 Mei。", "检查 Ana 是否分配给 Mei。"],
      result: "如果每个学生都能找到导师，命题为真。",
    },
    boundaryCases: [
      { title: "A 为空", description: "命题真空成立。" },
      { title: "B 为空且 A 非空", description: "找不到 y，命题为假。" },
      { title: "交换量词顺序", description: "∃y∀x 比 ∀x∃y 强得多，含义不同。" },
    ],
    pitfalls: ["不要随意交换全称量词和存在量词。", "存在表示至少一个，不表示唯一。"],
  },
  recurrence_relation: {
    plainExplanation: "递推关系用前面的项定义后面的项。",
    beginnerExplanation: "它像一个逐步生成序列的规则：先给起点，再用旧值算新值。",
    analogy: "像计算的家谱树，一个值依赖它的父节点值。",
    strictExplanation: "递推关系通过连接 a_n 与前若干项以及初始条件来定义序列。",
    whyItMatters: "递推关系常见于算法分析、动态规划、数列和递归定义。",
    computationSteps: [
      { title: "读取初始值", description: "没有初始值，递推无法开始。" },
      { title: "套用规则", description: "用前面的项计算当前项。" },
      { title: "重复生成", description: "不断应用规则得到后续项。" },
    ],
    toyExample: {
      title: "斐波那契式递推",
      description: "a_n=a_{n-1}+a_{n-2}, a_0=0, a_1=1。",
      steps: ["a_2=1。", "a_3=2。", "a_4=3。"],
      result: "每一项都由前两项生成。",
    },
    boundaryCases: [
      { title: "缺少初始条件", description: "序列无法唯一确定。" },
      { title: "递归展开太深", description: "直接展开可能导致计算量快速膨胀。" },
    ],
    pitfalls: ["递推式不等于闭式公式。", "递推必须说明适用的 n 范围。"],
  },
  unknown: {
    plainExplanation: "FormulaForge 还不能可靠匹配这个公式模板。你可以手动选择公式类型、补充上下文，或尝试示例公式。",
    beginnerExplanation: "应用可以渲染公式，但还不知道应该用哪条讲解路径和哪种图形来解释它。",
    analogy: "像看见一串能读的符号，但还没有判断出它属于哪种语法结构。",
    strictExplanation: "当前 MVP 没有覆盖该结构的规则解析器。",
    whyItMatters: "这是后续 AST、论文上下文和 AI 辅助解析的扩展入口。",
    computationSteps: [],
    toyExample: {
      title: "暂无可靠示例",
      description: "需要先匹配到支持的公式族，才能生成可信的小数字演示。",
      steps: ["请选择一个公式类型，或加载示例公式。"],
      result: "当前没有数值结果。",
    },
    boundaryCases: [],
    pitfalls: ["自动理解目前仅覆盖已支持的公式族。"],
  },
};

const zhStructureText: Record<string, string> = {
  "Total Objective": "总目标",
  "Weighted sum": "加权求和",
  "lambda1 x Lrec": "lambda1 × 重建损失",
  Reconstruction: "重建项",
  "lambda2 x Ladv": "lambda2 × 对抗损失",
  Adversarial: "对抗项",
  "lambda3 x Lperceptual": "lambda3 × 感知损失",
  Perceptual: "感知项",
  "Probability Normalization": "概率归一化",
  Pipeline: "计算流程",
  Logits: "原始分数",
  "Raw scores": "模型给出的未归一化分数",
  Exponentiation: "指数变换",
  "Make scores positive": "把分数变成正数",
  "Sum normalization": "求和归一化",
  "Shared denominator": "所有类别共享的分母",
  Distribution: "概率分布",
  "Competing probabilities": "互相竞争的概率",
  "Logistic Squash": "Logistic 压缩",
  Mapping: "映射",
  "Input score": "输入分数",
  "Any real value": "任意实数",
  "Logistic denominator": "Logistic 分母",
  "Smooth saturation": "平滑饱和",
  Output: "输出",
  "0 to 1 value": "0 到 1 的值",
  "Parameter Update": "参数更新",
  "Optimization step": "优化步骤",
  "Current parameter": "当前参数",
  "Where you are now": "当前位置",
  "Compute gradient": "计算梯度",
  "Uphill direction": "局部上升方向",
  "Scale step": "缩放步长",
  "Learning rate": "学习率控制",
  "Move downhill": "向低损失移动",
  "Next parameter": "下一步参数",
  "Prediction Penalty": "预测惩罚",
  "Classification loss": "分类损失",
  "Target y_i": "真实目标 y_i",
  "Correct distribution": "正确分布",
  "Prediction p_i": "预测概率 p_i",
  "Model probability": "模型概率",
  "Log penalty": "对数惩罚",
  "Punish low confidence on truth": "惩罚正确类别低概率",
  "Sum over classes": "对类别求和",
  "Final loss": "最终损失",
  "Belief Update": "信念更新",
  "Conditional probability": "条件概率",
  Prior: "先验",
  "Before evidence": "看到证据之前",
  Likelihood: "似然",
  "Evidence fit": "证据匹配程度",
  Evidence: "证据概率",
  Normalizer: "归一化因子",
  Posterior: "后验",
  "After evidence": "看到证据之后",
  "Choose k from n": "从 n 个中选 k 个",
  "Counting without order": "不考虑顺序的计数",
  "n items": "n 个对象",
  "Total pool": "总池子",
  "k chosen": "选出 k 个",
  "Selection size": "选择数量",
  "Ordered choices": "有序选择",
  "Order still matters": "顺序仍被计入",
  "Divide by k!": "除以 k!",
  "Remove duplicate orders": "去掉重复顺序",
  "Set Relationship": "集合关系",
  "Membership and counting": "成员关系与计数",
  "Set A": "集合 A",
  "First collection": "第一个集合",
  "Set B": "集合 B",
  "Second collection": "第二个集合",
  Union: "并集",
  "In A or B": "属于 A 或 B",
  Intersection: "交集",
  "In both": "同时属于二者",
  "Graph Degree": "图的度数",
  "Node-edge structure": "点边结构",
  Vertices: "顶点",
  Nodes: "节点",
  Edges: "边",
  Connections: "连接",
  Degree: "度数",
  "Edges touching v": "连接到 v 的边数",
  "Degree sum": "度数总和",
  "Each edge counted twice": "每条边被两个端点各数一次",
  "Unknown Formula": "未识别公式",
  "No template matched": "暂无匹配模板",
};

const zhVisualizationText: Record<VisualizationKind, { title: string; description: string }> = {
  venn: {
    title: "集合关系图",
    description: "用 Venn 图理解并集、交集和重复计数。",
  },
  graph: {
    title: "图的度数示意图",
    description: "查看一个小图，理解度数如何数与节点相连的边。",
  },
  counting_grid: {
    title: "计数网格",
    description: "改变 n 和 k，观察选择数量如何变化。",
  },
  truth_table: {
    title: "真值表",
    description: "用小规模真假表理解逻辑或损失中的关键情况。",
  },
  curve: {
    title: "函数曲线",
    description: "拖动输入，观察函数输出如何变化。",
  },
  probability_tree: {
    title: "概率树",
    description: "沿分支查看概率如何组合与归一化。",
  },
  recurrence_tree: {
    title: "递推树",
    description: "把递推式展开成它依赖的前序项。",
  },
  weighted_contribution: {
    title: "加权贡献探索器",
    description: "拖动 lambda 和基础损失值，观察每一项如何改变总目标。",
  },
  softmax_distribution: {
    title: "Softmax 温度探索器",
    description: "调整 logit 和温度，观察概率质量如何在类别之间移动。",
  },
  sigmoid_curve: {
    title: "Sigmoid 曲线探索器",
    description: "沿着 logistic 曲线移动 x，观察输出如何接近 0 或 1。",
  },
  gradient_descent_trajectory: {
    title: "梯度下降轨迹",
    description: "在凸损失曲面上移动，观察学习率如何改变下降路径。",
  },
  venn_diagram: {
    title: "集合关系图",
    description: "用 Venn 图理解并集、交集和重复计数。",
  },
  combination_counter: {
    title: "组合计数器",
    description: "改变 n 和 k，观察不考虑顺序时有多少种选法。",
  },
  graph_degree_diagram: {
    title: "图的度数示意图",
    description: "查看一个小图，理解度数如何数与节点相连的边。",
  },
  none: {
    title: "暂无可视化",
    description: "请选择支持的公式类型来加载交互模板。",
  },
};

export const weightedLossVizText = {
  en: {
    lambdaLabel: (index: number, term: string) => `lambda${index + 1} for ${term}`,
    lossLabel: (term: string) => `${term} base value`,
    contributionBar: "Contribution Bar",
    contributionHint: "Total loss updates as weights and base terms move.",
    totalLoss: "L total",
    ariaLabel: "Total loss sensitivity line",
  },
  zh: {
    lambdaLabel: (index: number, term: string) => `${term} 的 lambda${index + 1} 权重`,
    lossLabel: (term: string) => `${term} 的基础损失值`,
    contributionBar: "贡献柱状图",
    contributionHint: "拖动权重和基础损失时，总损失会同步更新。",
    totalLoss: "总损失 L",
    ariaLabel: "总损失对权重变化的敏感曲线",
  },
} as const;

export function localizeFormulaAnalysis(analysis: FormulaAnalysis, language: Language): FormulaAnalysis {
  if (language === "en") return analysis;
  const copy = zhAnalysisCopy[analysis.detectedType] ?? zhAnalysisCopy.unknown;

  return {
    ...analysis,
    plainExplanation: copy.plainExplanation,
    beginnerExplanation: copy.beginnerExplanation,
    analogy: copy.analogy,
    strictExplanation: copy.strictExplanation,
    whyItMatters: copy.whyItMatters,
    computationSteps: copy.computationSteps,
    toyExample: copy.toyExample,
    boundaryCases: copy.boundaryCases,
    pitfalls: copy.pitfalls,
  };
}

export function localizeStructure(structure: FormulaStructureNode, language: Language): FormulaStructureNode {
  if (language === "en") return structure;
  return {
    ...structure,
    label: zhStructureText[structure.label] ?? structure.label,
    role: structure.role ? zhStructureText[structure.role] ?? structure.role : structure.role,
    children: structure.children?.map((child) => localizeStructure(child, language)),
  };
}

export function localizeVisualizationSpec(spec: VisualizationSpec, language: Language): VisualizationSpec {
  if (language === "en") return spec;
  const copy = zhVisualizationText[spec.kind];
  return {
    ...spec,
    title: copy.title,
    description: copy.description,
  };
}
