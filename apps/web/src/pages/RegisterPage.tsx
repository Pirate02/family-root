import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router";

import axios from "axios";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState('')

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



  const handleSubmit =async(e: React.SubmitEvent)=> {
    e.preventDefault();
    setError('')
    setIsLoading(true)

    if(formData.password !== formData.confirmpassword) {
      setError("passwords didn't match! ")
      setIsLoading(false)
      return;

    }

    try {
      const res = await api.post('/auth/register',formData)
      console.log(res.data)
      localStorage.setItem('token', res.data.token)
      navigate('/')
      
    } catch (err) {
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.error[0].message)
        setError(err.response?.data.error[0].message)
        return

      }else {
        console.error(err)
        setError("Something went wrong !!")

      }


      
    }finally{
      setIsLoading(false)
    }




  }
  return (
    <div className="min-h-screen flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md flex justify-center items-center flex-col gap-2">
      <h1 className="font-bold">Register</h1>
        <div className="w-full flex flex-col gap-4">
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

          {error && (
            <p>{error}</p>

          )}
          <button type="submit" disabled={isLoading} className="bg-blue-500 p-4 rounded text-white hover:bg-blue-700">{isLoading ? "Loading..": "Register"}</button>
        </div>

      </form>
    </div>
  );
};

export default Register;
