import { Controls, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { usePersons, useRelationships } from "../../hooks/useFamily";
import PersonNode from "./PersonNode";
import { computeLayout } from "../../lib/layout";
import type { Person } from "@familyroot/shared";
import { useState } from "react";
import AddPersonModal from "./AddPersonModal";
import PersonSidePanle from "../ui/PersonSidePanle";
import { useNavigate } from "react-router";

const nodeTypes = {
  personNode: PersonNode,
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label="Back"
    className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-white text-primary shadow-sm transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/30"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const Legend = () => (
  <div className="absolute bottom-4 left-4 z-10 flex gap-4 rounded-lg border border-primary-light bg-white/90 px-3 py-2 text-xs text-primary-dark/70 shadow-sm backdrop-blur-sm">
    <span className="flex items-center gap-1.5">
      <span className="h-0.5 w-4 rounded-full bg-primary" />
      Parent / child
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="h-0.5 w-4 rounded-full bg-accent-green"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, #4A7C59 0 4px, transparent 4px 7px)" }}
      />
      Spouse
    </span>
  </div>
);

const TreeCanvas = ({ familyId }: { familyId: string }) => {
  const navigate = useNavigate();
  const [sidePanelPerson, setSidePanelPerson] = useState<Person | null>(null);
  const { data: persons, isLoading: personLoading } = usePersons(familyId);
  const { data: relationships, isLoading: relLoading } = useRelationships(familyId);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isFirstPerson = (persons?.length ?? 0) === 0;
  const positions = computeLayout(persons ?? [], relationships ?? []);

  const personNodes = (persons ?? []).map((person) => {
    const layout = positions.find((p) => p.id === person.id);
    return {
      id: person.id,
      type: "personNode",
      position: layout?.position ?? { x: 0, y: 0 },
      data: {
        person,
        onAddRelative: (p: Person) => {
          setSelectedPerson(p);
          setModalOpen(true);
        },
        onSelect: (p: Person) => setSidePanelPerson(p),
      },
    };
  });

  const relationshipEdge = (relationships ?? []).map((relation) => ({
    id: `${relation.source}-${relation.target}-${relation.type}`,
    source: relation.source,
    target: relation.target,
    style:
      relation.type === "parent"
        ? { stroke: "#B4814A", strokeWidth: 2 }
        : { stroke: "#4A7C59", strokeWidth: 2, strokeDasharray: "5,5" },
    type: "smoothstep",
  }));

  if (personLoading || relLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-primary-light/30">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-light border-t-primary" />
        <p className="text-sm text-primary-dark/60">Loading your family tree…</p>
      </div>
    );
  }

  if (persons?.length === 0) {
    return (
      <div className="relative h-screen w-screen bg-primary-light/20">
        <BackButton onClick={() => navigate("/")} />
        <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
          <div>
            <h1 className="font-serif text-xl text-primary-dark">Start your family tree</h1>
            <p className="mt-1 text-sm text-primary-dark/60">Add the first person to begin building it out.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            + Add your first family member
          </button>
        </div>
        {modalOpen && (
          <AddPersonModal
            familyId={familyId}
            isOpen={modalOpen}
            isFirstPerson={true}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-[#faf6f0]">
      <BackButton onClick={() => navigate("/")} />
      <ReactFlowProvider>
        <ReactFlow fitView nodes={personNodes} edges={relationshipEdge} nodeTypes={nodeTypes}>
          <Controls className="!rounded-lg !border !border-primary-light !shadow-sm" />
        </ReactFlow>
      </ReactFlowProvider>
      <Legend />
      {modalOpen && selectedPerson && (
        <AddPersonModal
          selectedPerson={selectedPerson}
          familyId={familyId}
          isOpen={modalOpen}
          isFirstPerson={isFirstPerson}
          onClose={() => {
            setModalOpen(false);
            setSelectedPerson(null);
          }}
        />
      )}
      {sidePanelPerson && (
        <PersonSidePanle
          person={sidePanelPerson}
          persons={persons ?? []}
          relationships={relationships ?? []}
          onClose={() => setSidePanelPerson(null)}
        />
      )}
    </div>
  );
};

export default TreeCanvas;
