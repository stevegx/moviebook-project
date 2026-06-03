import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !username || !firstName || !lastName || !city) {
        alert("Please fill all the fields");
        return;
    }

    const userData = {
      username,
      firstName,
      lastName,
      city,
      email,
      password,
    };

    try {
        const data = await registerUser(userData);

        console.log(data);
        alert("Registration successful");

        navigate("/login");

    } catch (error) {
        console.log(error);
        alert("Registration failed");
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
        <h1 className="text-center mb-5 text-2xl font-bold font-display">Register</h1>

        <form onSubmit={handleRegister}>
          <label className="block mb-2">Username:</label>
          <div className="relative mb-[15px]">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-2.5 pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded box-border focus:outline-none placeholder:text-movie-text-sec"
            />  
          </div>

          <label className="block mb-2">First Name:</label>
          <div className="relative mb-[15px]">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full p-2.5 pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded box-border focus:outline-none placeholder:text-movie-text-sec"
            />
          </div>

          <label className="block mb-2">Last Name:</label>
          <div className="relative mb-[15px]">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full p-2.5 pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded box-border focus:outline-none placeholder:text-movie-text-sec"
            />
          </div>

          <label className="block mb-2">City:</label>
          <div className="relative mb-[15px]">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full p-2.5 pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded box-border focus:outline-none placeholder:text-movie-text-sec"
            />
          </div>

          <label className="block mb-2">Email:</label>
          <div className="relative mb-[15px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-2.5 pr-[35px] mb-[15px] border border-[#b4b4b4] bg-movie-surface text-movie-text-main rounded box-border focus:outline-none placeholder:text-movie-text-sec"
            />
          </div>

          <label className="block mb-2">Password:</label>
          <div className="relative mb-[15px]">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2.5 pr-10 bg-movie-surface text-white border border-[#b4b4b4] rounded box-border focus:outline-none placeholder:text-movie-text-sec"
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-movie-text-sec"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          
          <button className="px-5 py-2.5 bg-movie-accent text-movie-text-main rounded mr-2.5 cursor-pointer hover:bg-[#1b97b2] transition-colors mt-2.5 block" type="submit">
            Create Account
          </button>

        </form>

        <p className="mt-[30px] mb-0 text-sm">
          Already have an account?
          <Link className="inline-block ml-2 text-movie-accent text-sm no-underline" to="/login">
            Login
          </Link>
        </p>
        
      </div>
    </div>
  );
}

export default RegisterPage;
