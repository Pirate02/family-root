import { useState } from "react";
import api from "../lib/api";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token)

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      } else {
        console.log(error);
        setError("Something went wrong !");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl flex flex-col items-center gap-4"
      >
        <h1 className="mb-2 text-3xl font-bold">Welcome!</h1>
        <div className="flex flex-col gap-4 items-center">
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500"
          />

          {error && <p className="w-full text-sm text-primary-dark">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
          >
            {isLoading ? "Loading.." : "Login"}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
