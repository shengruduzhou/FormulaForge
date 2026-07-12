# FormulaForge Novice-First UX Research

## Product position

FormulaForge should not compete as another general paper chatbot. Its differentiated job is narrower and deeper:

> Help a reader who cannot understand a paper equation build a usable mental model of that equation.

The success criterion is not explanation length. A successful learner can restate the purpose, identify functional blocks, explain key symbols, trace the computation, name assumptions, and judge when the formula applies.

## Evidence-informed principles

### Progressive disclosure

Show the global purpose before detailed notation. Reveal structure, symbols, computation, derivation, and limitations in stages. Advanced diagnostics and raw parser details remain available, but should not dominate the novice path.

### Worked examples and self-explanation

A compact worked example reduces the burden of discovering every intermediate step. Self-explanation prompts convert passive reading into retrieval and reconstruction. Learners should attempt an answer before revealing the reference answer.

### Subgoal labeling

Long formulas should be divided into functional blocks with names such as data term, normalization term, regularizer, aggregation, constraint, or weighting term. These labels provide a reusable schema for understanding related equations.

### Context before confidence

A formula alone rarely determines paper-specific symbol meanings. The interface should request surrounding paragraphs, author definitions, equation number, task, and caption. Unsupported interpretations must be labeled as inference and receive lower confidence.

### Adjacent explanations

Keep explanations near their formula fragment. Avoid forcing the learner to alternate repeatedly between a distant equation and a separate wall of prose.

### Truthful visualization

Use flow diagrams for structural relationships. Use numerical plots only when a quantitative relationship is justified. Any invented teaching values must be labeled as illustrative and never presented as paper data.

## Implemented interaction model

1. Input formula, image, and surrounding paper context.
2. Review context-quality guidance before analysis.
3. Receive the complete research-level analysis.
4. Follow a five-stage learning journey:
   - orientation;
   - functional structure;
   - symbols and parameters;
   - computation trace;
   - transfer, assumptions, and limitations.
5. Confirm understanding through self-explanation and delayed-answer checks.
6. Export a formula-specific `SKILL.md` or follow-up prompt for other LLMs and agents.

## Deferred opportunities

These are valuable but should not be added before validating the current learning path:

- PDF equation anchoring with paragraph and bibliography provenance;
- editable symbol corrections that are fed back into re-analysis;
- pseudocode and tensor-shape execution view;
- spaced review of previously analyzed formulas;
- prerequisite graph and adaptive remediation;
- side-by-side comparison of neighboring equations;
- user studies measuring explanation accuracy, completion, delayed recall, and transfer.

## Product metrics

Prefer learning and trust metrics over raw generation volume:

- percentage of users who complete at least three learning stages;
- self-check attempt rate before answer reveal;
- symbol-definition correction rate;
- context completeness at analysis time;
- perceived understanding before and after the journey;
- delayed recall and transfer on a related formula;
- rate of uncertainty notes and user-confirmed corrections;
- time to first correct restatement of formula purpose.
