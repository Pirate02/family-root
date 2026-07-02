import { Routes, Route } from "react-router";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import TreePage from "./pages/TreePage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/family/:id" element={<TreePage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  );
}

export default App;
