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

  const handleChangle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmpassword) {
      toast.error("passwords didn't match! ");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.error[0].message);
        toast.error(err.response?.data.error[0].message);
        return;
      } else {
        console.error(err);
        toast.error("Something went wrong !!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex justify-center items-center flex-col gap-2 bg-white p-8 shadow-xl rounded-2xl"
        
      >
        <h1 className="font-bold">Register</h1>
        <div className="w-full flex flex-col gap-4 items-center">
          <input
            type="text"
            value={formData.name}
            name="name"
            required
            onChange={handleChangle}
            className="h-12 w-full outline-none border border-gray-200 rounded p-4 focus:border-blue-500"
            placeholder="name"
          />
          <input
            type="email"
            value={formData.email}
            name="email"
            required
            onChange={handleChangle}
            className="h-12 w-full outline-none border border-gray-200 rounded p-4 focus:border-blue-500"
            placeholder="email"
          />
          <input
            type="password"
            value={formData.password}
            name="password"
            required
            onChange={handleChangle}
            className="h-12 w-full outline-none border border-gray-200 rounded p-4 focus:border-blue-500"
            placeholder="password"
          />
          <input
            type="password"
            value={formData.confirmpassword}
            name="confirmpassword"
            required
            onChange={handleChangle}
            className="h-12 w-full outline-none border border-gray-200 rounded p-4 focus:border-blue-500"
            placeholder="confirm password"
          />

          <span className="text-xs">
            Aleady have an account ?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary-dark cursor-pointer"
            >
              Login
            </span>{" "}
          </span>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 rounded rounded-xl text-primary border bg-primary-light border-primary hover:bg-primary hover:text-white"
          >
            {isLoading ? "Loading.." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
