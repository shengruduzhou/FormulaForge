export const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    formulaTitle: { type: "string" },
    formulaCategory: { type: "string" },
    domain: { type: "string" },
    normalizedLatex: { type: "string" },
    summary: { type: "string" },
    purpose: { type: "string" },
    outputInterpretation: { type: "string" },
    assumptions: { type: "array", items: { type: "string" } },
    parameters: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          symbol: { type: "string" },
          name: { type: "string" },
          category: { type: "string" },
          definition: { type: "string" },
          role: { type: "string" },
          dataType: { type: "string" },
          shape: { type: "string" },
          units: { type: "string" },
          domainOrRange: { type: "string" },
          learnedOrFixed: { type: "string" },
          dependencies: { type: "array", items: { type: "string" } },
          effectWhenIncreased: { type: "string" },
          effectWhenDecreased: { type: "string" },
          edgeCases: { type: "array", items: { type: "string" } },
          exampleValue: { type: "string" },
          confidence: { type: "number" },
        },
        required: [
          "symbol", "name", "category", "definition", "role", "dataType", "shape", "units",
          "domainOrRange", "learnedOrFixed", "dependencies", "effectWhenIncreased",
          "effectWhenDecreased", "edgeCases", "exampleValue", "confidence",
        ],
      },
    },
    terms: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          latex: { type: "string" },
          label: { type: "string" },
          meaning: { type: "string" },
          operation: { type: "string" },
          interaction: { type: "string" },
        },
        required: ["latex", "label", "meaning", "operation", "interaction"],
      },
    },
    readingOrder: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          order: { type: "integer" },
          fragment: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["order", "fragment", "explanation"],
      },
    },
    derivation: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          order: { type: "integer" },
          title: { type: "string" },
          expression: { type: "string" },
          explanation: { type: "string" },
          assumptions: { type: "array", items: { type: "string" } },
        },
        required: ["order", "title", "expression", "explanation", "assumptions"],
      },
    },
    computationProcedure: { type: "array", items: { type: "string" } },
    applications: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          scenario: { type: "string" },
          whyItFits: { type: "string" },
          example: { type: "string" },
        },
        required: ["scenario", "whyItFits", "example"],
      },
    },
    limitations: { type: "array", items: { type: "string" } },
    numericalStability: { type: "array", items: { type: "string" } },
    validationChecks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          check: { type: "string" },
          status: { type: "string", enum: ["pass", "warning", "unknown"] },
          explanation: { type: "string" },
        },
        required: ["check", "status", "explanation"],
      },
    },
    relatedConcepts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          relation: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["name", "relation", "explanation"],
      },
    },
    visualization: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", enum: ["line", "bar", "flow", "none"] },
        title: { type: "string" },
        description: { type: "string" },
        xLabel: { type: "string" },
        yLabel: { type: "string" },
        series: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              points: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    x: { type: "number" },
                    y: { type: "number" },
                    label: { type: "string" },
                  },
                  required: ["x", "y", "label"],
                },
              },
            },
            required: ["name", "points"],
          },
        },
        nodes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              description: { type: "string" },
            },
            required: ["id", "label", "description"],
          },
        },
        edges: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              label: { type: "string" },
            },
            required: ["from", "to", "label"],
          },
        },
        disclaimer: { type: "string" },
      },
      required: ["kind", "title", "description", "xLabel", "yLabel", "series", "nodes", "edges", "disclaimer"],
    },
    confidence: { type: "number" },
    uncertaintyNotes: { type: "array", items: { type: "string" } },
  },
  required: [
    "formulaTitle", "formulaCategory", "domain", "normalizedLatex", "summary", "purpose",
    "outputInterpretation", "assumptions", "parameters", "terms", "readingOrder", "derivation",
    "computationProcedure", "applications", "limitations", "numericalStability", "validationChecks",
    "relatedConcepts", "visualization", "confidence", "uncertaintyNotes",
  ],
};
