import type { Person } from "@familyroot/shared";
import { Handle, Position } from "@xyflow/react";

interface PersonNodeData {
  person: Person;
  onAddRelative: (person: Person) => void;
  onSelect: (person: Person) => void;
}

const PersonNode = ({ data }: { data: PersonNodeData }) => {
  const { person } = data;
  const isDeceased = Boolean(person.dod);

  return (
    <div
      onClick={() => data.onSelect(person)}
      className="group relative min-w-[9rem] max-w-44 cursor-pointer rounded-xl border border-primary bg-white px-4 pb-3 pt-5 text-center shadow-md shadow-primary-dark/5 transition-shadow hover:shadow-lg hover:shadow-primary-dark/10"
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />

      {/* Avatar */}
      <div className="relative mx-auto w-12">
        {person.picUrl ? (
          <img
            src={person.picUrl}
            alt={person.name}
            className="mx-auto h-12 w-12 rounded-full border-2 border-primary-light object-cover"
          />
        ) : (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary-light font-serif text-lg text-primary-dark">
            {person.name[0]}
          </div>
        )}
        {isDeceased && (
          <span
            title="Deceased"
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary-dark/40"
          />
        )}
      </div>

      {/* Identity */}
      <h1 className="mt-2 truncate font-serif text-sm text-primary-dark">{person.name}</h1>
      <p className="text-[11px] text-primary-dark/45">
        {person.dob.split("T")[0]}
        {isDeceased && person.dod ? ` – ${person.dod.split("T")[0]}` : ""}
      </p>
      {person.bio && (
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-primary-dark/60">{person.bio}</p>
      )}

      {/* Add relative — quiet by default, appears on hover/focus so cards stay clean at rest */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevents card click from firing
          data.onAddRelative(person);
        }}
        className="mt-2.5 w-full rounded-md border border-primary-light px-2 py-1 text-[11px] font-medium text-primary opacity-0 transition-opacity hover:bg-primary-light group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        + Add relative
      </button>

      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
};

export default PersonNode;
