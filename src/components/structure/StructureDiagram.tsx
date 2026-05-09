import type { FormulaStructureNode } from "../../schemas/formula";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { FormulaTree } from "./FormulaTree";

export function StructureDiagram({ structure }: { structure: FormulaStructureNode }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-lens-ink">Structure Diagram</h2>
        <p className="mt-1 text-sm text-lens-muted">A template-level decomposition of how the formula is organized.</p>
      </CardHeader>
      <CardBody>
        <FormulaTree node={structure} />
      </CardBody>
    </Card>
  );
}
