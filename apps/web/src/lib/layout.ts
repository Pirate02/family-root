import type { Person, RelationshipEdge } from "@familyroot/shared";

const HORIZONAL_GAP = 250;
const VERTICAL_GAP = 200;


export const computeLayout = (
  persons: Person[],
  relationships: RelationshipEdge[],
) => {
  const hasParent = new Set(
    relationships.filter((r) => r.type === "parent").map((r) => r.target), // from the relationships give me those who have parents and only targets.
  );
  const roots = persons.filter(p => !hasParent.has(p.id))



  const generationMap = new Map<String, number>()


  roots.forEach(p => generationMap.set(p.id, 0)) // roots are generation zero - no parents 

  // for each relationship child generation = parent's generation +1
  relationships.filter(r => r.type === 'parent').forEach(r => {
    const parentGen = generationMap.get(r.source) ?? 0
    generationMap.set(r.target, parentGen + 1)

  })

  const byGeneration = new Map<number, Person[]>();

  persons.forEach(p => {
    const gen = generationMap.get(p.id) ?? -1  // -1 for disconnected 
    if (!byGeneration.has(gen)) byGeneration.set(gen, [])
    byGeneration.get(gen)!.push(p)


  })

  const positions: { id: string , position: {x:number, y:number}} [] = [];


  byGeneration.forEach((personsInGen, generation)=> {
    const count = personsInGen.length;

    personsInGen.forEach((p,index)=>{
      positions.push({
        id: p.id,
        position: {
          x: (index - (count-1)/2) * HORIZONAL_GAP,
          y: generation * VERTICAL_GAP

        }

      })

    })

  })

  return positions;







};






