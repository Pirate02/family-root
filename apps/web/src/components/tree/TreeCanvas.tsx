import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { usePersons, useRelationships } from "../../hooks/useFamily";
import PersonNode from "./PersonNode";



const nodeTypes = {
  personNode : PersonNode

}


const TreeCanvas = ({familyId}:{familyId: string}) => {


  const {data: persons, isLoading: personLoading } = usePersons(familyId)
  const {data: relationships, isLoading: relLoading} = useRelationships(familyId)

  const personNode = persons?.map((person,i) => ({

    id: person.id,
    type: 'personNode',
    position: {x: 0, y: i*200},
    data: {
      person: {
        id: person.id,
        name: person.name,
        gender: person.gender,
        bio: person.bio,
        picUrl: person.picUrl,
        dob: person.dob,
        dod: person.dod,
        familyId: person.familyId

      }

    }
  }


  ))

  const relationshipEdge = relationships?.map((relation,i)=> (
    {
      id:`e-${i}`,
      source: relation.source,
      target: relation.target


    }

  ))



  if(personLoading || relLoading) return <div> Loading ..</div>
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow fitView nodes={personNode} edges={relationshipEdge} nodeTypes={nodeTypes}>
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default TreeCanvas;
