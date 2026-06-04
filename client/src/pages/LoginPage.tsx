import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import FormInput from "../components/FormInput";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
        alert("Please fill all the fields");
        return;
    }
    

    try {
        const data = await loginUser(formData);      
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
    } catch (error) {
        console.log(error);
        alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div>
        <h1 className="text-[36px] text-movie-accent mb-10 font-display font-bold">
          MovieBook
        </h1>   
      </div>

      <div className="w-[400px] bg-movie-surface rounded-lg border border-[#b4b4b4] p-[30px]">
        <h1 className="text-center mb-5 text-2xl font-bold font-display">Welcome Back</h1>

        <form onSubmit={handleLogin}>
          <FormInput
            icon={<FaUser />}
            label="Email:"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email Address"
          />
          <div className="relative">
            <FormInput
              icon={<FaLock />}
              label="Password:"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
            />

            <span
              className="absolute right-[12px] bottom-[14px] cursor-pointer text-movie-text-sec"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button className="w-full px-5 py-2.5 bg-movie-accent text-movie-text-main rounded mt-4 cursor-pointer hover:bg-[#1b97b2] transition-colors" type="submit">
            Login
          </button>

        </form>

        <p className="mt-[30px] mb-0 text-sm">
          Don't have an account?
          <Link className="inline-block ml-2 text-movie-accent text-sm no-underline" to="/register">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;