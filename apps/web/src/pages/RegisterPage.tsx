import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords didn't match!");
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.post("/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error?.[0]?.message ?? "Registration failed";
        toast.error(message);
      } else {
        console.error(err);
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
          <h1 className="font-serif text-2xl text-primary-dark">Create your account</h1>
          <p className="mt-1 text-sm text-primary-dark/50">Start building your family tree</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              name="name"
              required
              onChange={handleChange}
              placeholder="Your full name"
              className="h-11 w-full rounded-lg border border-primary-light px-3 text-sm text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              name="email"
              required
              onChange={handleChange}
              placeholder="you@example.com"
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
              value={formData.password}
              name="password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-primary-light px-3 text-sm text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmpassword" className="text-xs font-medium uppercase tracking-wide text-primary-dark/60">
              Confirm password
            </label>
            <input
              id="confirmpassword"
              type="password"
              value={formData.confirmpassword}
              name="confirmpassword"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-primary-light px-3 text-sm text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 h-11 w-full rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account…" : "Register"}
          </button>

          <p className="text-center text-xs text-primary-dark/55">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-primary hover:text-primary-dark"
            >
              Log in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
