import { useNavigate } from "react-router";
import { useFamilies } from "../hooks/useFamily";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const { data: families, isLoading } = useFamilies();
  const navigate = useNavigate();


  return (
    <div>
      <h1>My Families</h1>

      {!token && (
        <div>
          <p>Login to view your family</p>
        </div>

      )}


      {token && isLoading && (

          <p>Loading..</p>

      )}

      {token && !isLoading && families?.length === 0 && (
        <p>You are not associated with any family yet !</p>
      )}

      {token && families?.map((family) => (
        <div
          key={family.familyId}
          onClick={() => navigate(`/family/${family.familyId}`)}
        >
          {family.family.name}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
