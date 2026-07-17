import type { Person, RelationshipEdge } from "@familyroot/shared";
import dagre from "dagre";

const NODE_WIDTH = 250;
const NODE_HEIGHT = 160;
const SPOUSE_OFFSET = 150;

export const computeLayout = (
  persons: Person[],
  relationships: RelationshipEdge[],
):{id: string; position: {x: number, y: number}}[] => {


  const g = new dagre.graphlib.Graph();


  g.setGraph({
    rankdir: 'TB', // top to bottom yo chai 
    nodesep: 80,  // horizontal gap between nodes 
    ranksep: 120, // vertical gap between geneerations 
    edgesep: 20


  })


  g.setDefaultEdgeLabel(()=> ({}))


  // add all persons as node 
  persons.forEach((p)=>{

    g.setNode(p.id, {width: NODE_WIDTH, height: NODE_HEIGHT})


  })


  // add only parent node to dagre - spouse handled seperately 
  relationships.filter(r => r.type === 'parent').forEach(r=> {
    g.setEdge(r.source, r.target)

  })

  dagre.layout(g)


  // first pass get dagree position for all nodes 
  const positions: {id: string; position: {x: number; y: number}}[]=[]


  persons.forEach(p=> {
    const node = g.node(p.id)

    positions.push({
      id: p.id,
      position: {
        x: node.x - NODE_WIDTH/2,
        y: node.y - NODE_HEIGHT/2

      }

    })
  })


  // second pass position spouse beside their partners 


  relationships.filter(r => r.type ==='spouse').forEach(r=> {

    const posA = positions.find(p=> p.id === r.source);
    const posB = positions.find(p=> p.id === r.target);

    if(!posA || !posB) return;

    // those who have parent 
    const aHasParent = relationships.some(rel => rel.type === 'parent' && rel.target === r.source)
    const bHasParent = relationships.some(rel => rel.type === 'parent' && rel.target === r.target)



    if(bHasParent && !aHasParent) {
      // B's position is correct 

      posA.position = {x:posB.position.x + SPOUSE_OFFSET , y: posB.position.y}
    } else if(aHasParent && !bHasParent){

      posB.position  = {x: posA.position.x + SPOUSE_OFFSET, y: posA.position.y}

    }





  })




return positions;



};
