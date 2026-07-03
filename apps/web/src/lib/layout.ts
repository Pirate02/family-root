import type { Person, RelationshipEdge } from "@familyroot/shared";

const HORIZONAL_GAP = 250;
const VERTICAL_GAP = 200;

export const computeLayout = (
  persons: Person[],
  relationships: RelationshipEdge[],
) => {
  const hasParent = new Set(
    relationships.filter((r) => r.type === "parent").map((r) => r.target), // from the relationships give me those who have parents and only targets.
  );
};



const roots =  persons.filter(p=> !hasParent.has(p.id)) 
