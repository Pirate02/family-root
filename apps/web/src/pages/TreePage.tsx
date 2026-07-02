import { useParams } from "react-router";
import TreeCanvas from "../components/tree/TreeCanvas"



const TreePage =()=> {

  const {id} = useParams()


  return (
    <TreeCanvas familyId={id!} />


  )


}

export default TreePage;
