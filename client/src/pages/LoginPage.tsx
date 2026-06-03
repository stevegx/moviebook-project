import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
        alert("Please fill all the fields");
        return;
    }
    
    const userData = {
      email,
      password,
    };

    try {
        const data = await loginUser(userData);
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/home");

    } catch (error) {
        console.log(error);
        alert("Login failed");
    }

    navigate("/home");
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
          <label className="block mb-2">Email:</label>
          <div className="relative mb-[15px]">
            <FaUser className="absolute left-[10px] top-1/2 -translate-y-1/2 text-movie-text-sec" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-2.5 pl-[35px] pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded placeholder:text-movie-text-sec focus:outline-none"
            />
          </div>

          <label className="block mb-2">Password:</label>
          <div className="relative mb-[15px]">
            <FaLock className="absolute left-[10px] top-1/2 -translate-y-1/2 text-movie-text-sec" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2.5 pl-[35px] pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded placeholder:text-movie-text-sec focus:outline-none"
            />

            <span
              className="absolute right-[10px] top-1/2 -translate-y-[40%] cursor-pointer text-movie-text-sec"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <Link className="block mb-[15px] text-movie-accent text-sm text-right pr-2" to="/forgot-password">
            Forgot Password?
          </Link>

          <button className="px-5 py-2.5 bg-movie-accent text-movie-text-main rounded mr-2.5 cursor-pointer hover:bg-[#1b97b2] transition-colors" type="submit">
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