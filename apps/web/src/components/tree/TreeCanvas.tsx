import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import PersonNode from "./PersonNode";

const nodeTypes = {
  personNode: PersonNode,
};

const fakeNodes = [
  {
    id: "1",
    type: "personNode",
    position: { x: 0, y: 0 },
    data: {
      person: {
        id: "1",
        name: "Dumzan",
        gender: "male" as const,
        bio: "Genius",
        picUrl: "",
        dob: "1995-01-01",
      },
    },
  },
  {
    id: "2",
    type: "personNode",
    position: { x: 0, y: 200 },
    data: {
      person: {
        id: "2",
        name: "Rana",
        gender: "male" as const,
        bio: "Genius Pro",
        picUrl: "",
        dob: "2002-07-01",
      },
    },
  },
];

const fakeEdges = [{ id: "e1-2", source: "1", target: "2" }];

const TreeCanvas = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow fitView nodes={fakeNodes} edges={fakeEdges} nodeTypes={nodeTypes}>
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default TreeCanvas;
