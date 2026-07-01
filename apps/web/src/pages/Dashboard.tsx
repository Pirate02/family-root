import { useNavigate } from "react-router"

const Dashboard = () => {

  const navigate  = useNavigate();

  const logout =()=> {
    localStorage.removeItem('token')
    navigate('/login')
    

  }
  return (
    <div>
<p>This is Dashboard</p>

<button type="button" onClick={logout}>logout</button>



    </div>
  )
}

export default Dashboard
