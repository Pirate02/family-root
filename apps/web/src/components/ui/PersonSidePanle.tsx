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

const PersonSidePanel = ({ person, persons, relationships, onClose }: PersonSidePanleProps) => {
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { mutate: deletePerson, isPending } = useDeletePerson();

  // for children
  const children = relationships.filter((r) => r.source === person.id && r.type === "parent");
  const childPersons = children.map((r) => persons.find((p) => p.id === r.target)).filter(Boolean);

  // for spouse
  const spouseRelation = relationships.find(
    (r) => (r.source === person.id || r.target === person.id) && r.type === "spouse",
  );
  const spouseId = spouseRelation?.source === person.id ? spouseRelation.target : spouseRelation?.source;
  const spouse = persons.find((p) => p.id === spouseId);

  // for parents
  const parentRelations = relationships.filter((r) => r.target === person.id && r.type === "parent");
  const parents = parentRelations.map((r) => persons.find((p) => p.id === r.source)).filter(Boolean);

  const canDelete = childPersons.length === 0;

  const handlePersonDelete = () => {
    deletePerson(
      { familyId: person.familyId, personId: person.id },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          if (isAxiosError(err)) {
            setError(err.response?.data?.error ?? "Failed to delete person");
          } else {
            setError("Something went wrong");
          }
        },
      },
    );
  };

  return (
    <div className="fixed right-0 top-0 z-50 flex h-screen w-80 flex-col border-l border-primary-light bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-primary-light bg-primary-light/40 px-6 py-5">
        <div className="flex items-center gap-3">
          {person.picUrl ? (
            <img
              src={person.picUrl}
              alt={person.name}
              className="h-12 w-12 rounded-full border-2 border-primary-light object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-white font-serif text-lg text-primary-dark">
              {person.name[0]}
            </div>
          )}
          <div>
            <h1 className="font-serif text-base leading-tight text-primary-dark">{person.name}</h1>
            {spouse && <p className="text-xs text-primary-dark/50">Spouse of {spouse.name}</p>}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-primary-dark/50 transition-colors hover:bg-white hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {person.bio && <p className="mb-5 text-sm leading-relaxed text-primary-dark/70">{person.bio}</p>}

        {parents.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-primary-dark/40">Parents</h2>
            <ul className="flex flex-col gap-1.5">
              {parents.map((p) => (
                <li key={p!.id} className="rounded-lg bg-primary-light/40 px-3 py-2 text-sm text-primary-dark">
                  {p!.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-5">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-primary-dark/40">
            Children {childPersons.length > 0 && `(${childPersons.length})`}
          </h2>
          {childPersons.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {childPersons.map((child) => (
                <li key={child!.id} className="rounded-lg bg-primary-light/40 px-3 py-2 text-sm text-primary-dark">
                  {child!.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-primary-dark/40">No children added yet</p>
          )}
        </section>
      </div>

      {/* Footer / destructive action */}
      <div className="border-t border-primary-light px-6 py-4">
        {error && <p className="mb-2 text-xs text-alert">{error}</p>}

        {!canDelete ? (
          <p className="text-center text-xs text-primary-dark/35">
            Remove this person's children first to delete them
          </p>
        ) : confirmingDelete ? (
          <div className="flex flex-col gap-2">
            <p className="text-center text-xs text-primary-dark/60">Remove {person.name}? This can't be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-lg border border-primary-light px-3 py-2 text-xs font-medium text-primary-dark/70 transition-colors hover:bg-primary-light/40"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                onClick={handlePersonDelete}
                className="flex-1 rounded-lg bg-alert px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-alert/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Removing…" : "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="w-full rounded-xl border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Remove person
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonSidePanel;
