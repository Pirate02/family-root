import type { Person, RelationshipEdge } from "@familyroot/shared";
import { useDeletePerson } from "../../hooks/useFamily";
import { useState } from "react";
import { isAxiosError } from "axios";

interface PersonSidePanleProps {
  person: Person;
  persons: Person[];
  relationships: RelationshipEdge[];
  onClose: () => void;
}

const PersonSidePanel = ({
  person,
  persons,
  relationships,
  onClose,
}: PersonSidePanleProps) => {
  const [error, setError] = useState("");

  const { mutate: deletePerson, isPending } = useDeletePerson();
  // for children count

  const children = relationships.filter(
    (r) => r.source === person.id && r.type === "parent",
  );

  const childPersons = children
    .map((r) => persons.find((p) => p.id === r.target))
    .filter(Boolean);

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

  const handlePersonDelete = () => {
    deletePerson(
      {
        familyId: person.familyId,
        personId: person.id,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            setError(error.response?.data?.error ?? "failed to delete person");
          } else {
            setError("something went wrong");
          }
        },
      },
    );
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto">
      <button onClick={onClose}>X</button>

      {parents && parents.map((p) => <p key={p!.id}>{p!.name}</p>)}
      <h1>{person.name}</h1>
      {spouse && <h1>Spouse of {spouse.name}</h1>}

      {person.bio && <p> {person.bio}</p>}
      <p>Parent of {childPersons.length}</p>

      {childPersons.map((child) => (
        <p key={child!.id}>{child!.name}</p>
      ))}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {childPersons.length === 0 && (
        <button
          disabled={isPending}
          onClick={handlePersonDelete}
          className="w-full p-4 text-primary rounded rounded-xl cursor-pointer border border-primary mt-2 hover:bg-primary hover:text-white"
        >
          {isPending ? "..pending" : "Remove person"}{" "}
        </button>
      )}
    </div>
  );
};

export default PersonSidePanel;
