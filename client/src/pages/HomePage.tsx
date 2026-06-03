import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-movie-bg text-movie-text-main font-body">
      <nav className="w-full bg-movie-surface border-b border-gray-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold font-display text-movie-accent tracking-wide cursor-pointer" onClick={() => navigate("/home")}>
          MovieBook
        </h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm bg-movie-bg hover:bg-movie-surface border border-gray-700 rounded-md transition-colors cursor-pointer"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-sm bg-movie-bg hover:bg-movie-surface border border-gray-700 rounded-md transition-colors cursor-pointer"
          >
            My Profile
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-[#eb5959] hover:bg-[#d44b4b] text-white rounded-md transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-16 p-6 text-center">
        <div className="bg-movie-surface rounded-xl border border-gray-800 p-8 shadow-md">
          <h2 className="text-4xl font-bold font-display mb-4">
            Welcome back, <span className="text-movie-accent">{user?.username || user?.email}</span>!
          </h2>
          <p className="text-movie-text-sec text-lg max-w-md mx-auto">
            Explore your favorite movies, manage your watchlist, and see what's trending today.
          </p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;