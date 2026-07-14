import { Navigate } from "react-router";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  try {
    const payload = JSON.parse(atob(token?.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch {

    localStorage.removeItem('token')
    return <Navigate to='/login' replace/>


  }

  return <>{children}</>;
};

export default ProtectedRoutes;
