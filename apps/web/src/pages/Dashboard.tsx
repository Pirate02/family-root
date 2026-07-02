import { useNavigate } from "react-router";
import { useFamilies } from "../hooks/useFamily"

const Dashboard = () => {

  const {data: families , isLoading} = useFamilies();
  const navigate = useNavigate();

  if(isLoading ) return <div> Loadgin.. </div>
 


  return (
    <div>
    <h1>My Families</h1>

    {families?.length === 0 && (
      <p>You are not associated with any family yet !</p>
    )}

    {families?.map((family)=>(
      <div key={family.familyId} onClick={()=>navigate(`/family/${family.familyId}`)}>
      {family.family.name}
      </div>

    ))}
    </div>
  )
}

export default Dashboard;
