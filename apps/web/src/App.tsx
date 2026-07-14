import { Routes, Route } from "react-router";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import TreePage from "./pages/TreePage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/family/:id"
          element={
            <ProtectedRoutes>
              <TreePage />
            </ProtectedRoutes>
          }
        />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
