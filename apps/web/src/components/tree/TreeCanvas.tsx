import { Controls, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { usePersons, useRelationships } from "../../hooks/useFamily";
import PersonNode from "./PersonNode";

import { computeLayout } from "../../lib/layout";
import type { Person } from "@familyroot/shared";
import { useState } from "react";
import AddPersonModal from "./AddPersonModal";
import PersonSidePanle from "../ui/PersonSidePanle";

const nodeTypes = {
  personNode: PersonNode,
};

const TreeCanvas = ({ familyId }: { familyId: string }) => {
  const [sidePanelPerson, setSidePanelPerson] = useState<Person | null>(null);
  const { data: persons, isLoading: personLoading } = usePersons(familyId);
  const { data: relationships, isLoading: relLoading } =
    useRelationships(familyId);

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
          console.log(p);
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
        ? { stroke: "#B4B14A", strokeWidth: 2 }
        : { stroke: "#4A7C59", strokeDasharray: "5,5" },
    type: "smoothstep",
  }));

  if (personLoading || relLoading) return <div> Loading ..</div>;

  if (persons?.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <button
            onClick={() => setModalOpen(true)}
            className="border border-primary rounded-xl p-4"
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
      </>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#faf6f0" }}>
      <ReactFlowProvider>
        <ReactFlow
          fitView
          nodes={personNodes}
          edges={relationshipEdge}
          nodeTypes={nodeTypes}
        >
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
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
