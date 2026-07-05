import type { Person } from "@familyroot/shared";
import { Handle, Position } from "@xyflow/react";

interface PersonNodeData {
  person: Person;
  onAddRelative: (person: Person) => void;
}

const PersonNode = ({ data }: { data: PersonNodeData }) => {
  const { person } = data;

  return (
    <div className="min-w-12 max-w-36 rounded-xl border border-primary bg-white p-4 shadow-lg text-center">
      <button
        onClick={() => data.onAddRelative(data.person)}
        className="mt-2 text-xs text-primary border border-primary rounded px-2 py-1 hover:bg-primary-light"
      >
        + Add Relative
      </button>
      <Handle type="target" position={Position.Top} />

      {person.picUrl ? (
        <img
          src={person.picUrl}
          alt="profile picture"
          className="w-12 h-12 mx-auto rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 mx-auto rounded-full bg-primary-light border-2 border-primary flex items-center justify-center font-medium text-primary-dark">
          {person.name[0]}
        </div>
      )}

      <h1 className="mt-2 text-sm font-medium">{person.name}</h1>
      <p className="text-xs text-gray-500">{person.dob.split("T")[0]}</p>
      {person.bio && <p className="text-xs mt-1">{person.bio}</p>}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PersonNode;
