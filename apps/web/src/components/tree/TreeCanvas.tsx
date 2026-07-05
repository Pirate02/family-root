import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { usePersons, useRelationships } from "../../hooks/useFamily";
import PersonNode from "./PersonNode";

import { computeLayout } from "../../lib/layout";
import type { Person } from "@familyroot/shared";
import { useState } from "react";

const nodeTypes = {
  personNode: PersonNode,
};

const TreeCanvas = ({ familyId }: { familyId: string }) => {
  const { data: persons, isLoading: personLoading } = usePersons(familyId);
  const { data: relationships, isLoading: relLoading } =
    useRelationships(familyId);


  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const [modalOpen, setModalOpen] = useState(false)


  const positions = computeLayout(persons ?? [], relationships ?? []);

  const personNodes = (persons ?? []).map((person) => {
    const layout = positions.find((p) => p.id === person.id);

    return {
      id: person.id,
      type: "personNode",
      position: layout?.position ?? { x: 0, y: 0 },
      data: { person, onAddRelative: (p: person) => {
        setSelectedPerson(p),
        setModalOpen(true)

      } },
    };
  });

  const relationshipEdge = (relationships ?? []).map((relation) => ({
    id: `${relation.source}-${relation.target}-${relation.type}`,
    source: relation.source,
    target: relation.target,
  }));

  if (personLoading || relLoading) return <div> Loading ..</div>;
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          fitView
          nodes={personNodes}
          edges={relationshipEdge}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default TreeCanvas;
