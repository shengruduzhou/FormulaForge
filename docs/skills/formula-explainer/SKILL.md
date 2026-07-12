---
name: formula-understanding-tutor
description: Teach an unfamiliar research-paper formula to a reader who lacks the background to understand it.
---

# Formula Understanding Tutor

## Objective

Turn an unfamiliar paper formula into a mental model the learner can:

1. restate in their own words;
2. trace computationally;
3. connect to the paper task;
4. critique through assumptions and limitations;
5. apply to a nearby example.

Do not merely paraphrase notation or describe what happens when a parameter increases.

## Inputs

Collect as many of these as are available:

- formula in LaTeX, plain text, or image form;
- surrounding paragraph before and after the equation;
- author-provided symbol definitions;
- equation number, section, figure, or caption;
- paper domain and task;
- what the learner does not understand;
- learner level and desired depth.

When context is missing, state which interpretations are uncertain. Never invent a paper-specific definition, dimension, unit, citation, or experiment result.

## Teaching protocol

### 1. Establish the global purpose

Explain:

- what problem the formula solves;
- what enters the formula;
- what the output represents;
- why the paper needs this computation.

Avoid notation details at this stage.

### 2. Build a formula map

Split the expression into meaningful functional blocks. Give each block a subgoal label such as:

- data-fit term;
- normalization term;
- regularization term;
- weighting term;
- similarity term;
- aggregation term;
- constraint term.

Explain how blocks interact and what disappears if a block is removed.

### 3. Build a symbol dictionary

For every symbol, explain:

- name and definition;
- source or provenance;
- scalar/vector/matrix/tensor type;
- shape and units where supported;
- observed, learned, indexed, fixed, or hyperparameter status;
- role and dependencies;
- valid range and edge cases;
- confidence of the interpretation.

### 4. Trace the forward computation

Present the actual execution order. Keep each explanation adjacent to the relevant formula fragment. Use subgoal labels rather than one uninterrupted derivation.

### 5. Give one worked example

Use a small, transparent numerical or symbolic example. Distinguish illustrative values from values reported by the paper.

### 6. Explain derivation and assumptions

Only after forward computation is understood, provide concise and verifiable derivation steps. State the assumption used at each step. Do not reveal private chain-of-thought.

### 7. Explain applicability

Cover:

- typical use cases;
- unsuitable cases;
- boundary behavior;
- numerical stability;
- implementation cautions;
- limitations of the interpretation.

### 8. Require self-explanation

End with questions that ask the learner to explain:

1. the formula's purpose;
2. the role of one key symbol;
3. the computation order;
4. one assumption or limitation;
5. one suitable and one unsuitable application.

## Output order

1. Purpose and output
2. Formula map
3. Symbol dictionary
4. Computation trace
5. Worked example
6. Derivation
7. Assumptions, limitations, and numerical cautions
8. Applications
9. Uncertainty notes
10. Self-check

## Quality constraints

- Prefer progressive disclosure over one long answer.
- Define unavoidable jargon immediately.
- Separate evidence from inference.
- Use diagrams only when they clarify structure.
- Use plots only when a quantitative relationship is justified.
- Do not imply that illustrative data came from the paper.
- Adapt depth to the learner's prior knowledge.
