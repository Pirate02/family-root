import type { Person, RelationshipEdge } from "@familyroot/shared";

interface PersonSidePanleProps {
  person: Person;
  persons: Person[];
  relationships: RelationshipEdge[];
  onClose: () => void;
}

const PersonSidePanle = ({
  person,
  persons,
  relationships,
  onClose,
}: PersonSidePanleProps) => {
  // for children count

  const children = relationships.filter(
    (r) => r.source === person.id && r.type === "parent",
  );

  const childPersons = children.map(r=> persons.find(p=> p.id === r.target)).filter(Boolean)

  // for spouse name

  const spouseRelation = relationships.find(
    (r) =>
      (r.source === person.id || r.target === person.id) && r.type === "spouse",
  );

  const spouseId =
    spouseRelation?.source === person.id
      ? spouseRelation.target
      : spouseRelation?.source;

  const spouse = persons.find((p) => p.id === spouseId);

  // for parent
  const parentRelations = relationships.filter(
    (r) => r.target === person.id && r.type === "parent",
  );

  const parents = parentRelations
    .map((r) => persons.find((p) => p.id === r.source))
    .filter(Boolean);

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto">
    <button onClick={onClose}>X</button>
      <h1>{person.name}</h1>

      <p>Parent of {childPersons.length}</p>

      {childPersons.map(child => (
        <p key={child!.id}>{child!.name}</p>

      ))}
    </div>
  );
};

export default PersonSidePanle;
