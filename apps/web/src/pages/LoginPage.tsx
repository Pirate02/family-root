import { useState } from "react";
import api from "../lib/api";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Logged in");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error ?? "Something went wrong!");
      } else {
        console.log(error);
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f0] px-4">
      <button
        onClick={() => navigate("/")}
        className="mb-6 font-serif text-lg text-primary-dark"
      >
        FamilyRoot
      </button>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-primary-light bg-white p-8 shadow-lg shadow-primary-dark/5"
      >
        <div className="text-center">
          <h1 className="font-serif text-2xl text-primary-dark">Welcome back</h1>
          <p className="mt-1 text-sm text-primary-dark/50">Log in to see your family tree</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="h-11 w-full rounded-lg border border-primary-light px-3 text-sm text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="h-11 w-full rounded-lg border border-primary-light px-3 text-sm text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 h-11 w-full rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in…" : "Log in"}
          </button>

          <p className="text-center text-xs text-primary-dark/55">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer font-medium text-primary hover:text-primary-dark"
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
