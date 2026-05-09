import type { FormulaStructureNode } from "../../schemas/formula";
import { localizeStructure, useI18nStore } from "../../i18n";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { FormulaTree } from "./FormulaTree";

export function StructureDiagram({ structure }: { structure: FormulaStructureNode }) {
  const language = useI18nStore((state) => state.language);
  const localizedStructure = localizeStructure(structure, language);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">{language === "zh" ? "结构图" : "Structure Diagram"}</h2>
        <p className="mt-1 text-sm text-lens-muted">
          {language === "zh" ? "按模板拆解公式由哪些部分组成，以及每一部分承担什么作用。" : "A template-level decomposition of how the formula is organized."}
        </p>
      </CardHeader>
      <CardBody>
        <FormulaTree node={localizedStructure} />
      </CardBody>
    </Card>
  );
}
