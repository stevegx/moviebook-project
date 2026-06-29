import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaStar,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import LogoutButton from "./LogoutButton";
import AuthModal from "./AuthModal";
import { Link } from "react-router-dom";
import { FaFilm } from "react-icons/fa";

interface NavbarProps {
  isLoggedIn: boolean;
  currentUser: any | null;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

function Navbar({
  isLoggedIn,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-movie-surface border-b border-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-display text-movie-accent tracking-wide cursor-pointer select-none">
          <FaFilm />
          MovieBook
        </Link>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setSearchQuery("");
              navigate("/");
            }}
            className="text-lg font-medium text-movie-text-main hover:text-movie-accent transition-colors cursor-pointer"
          >
            Home
          </button>

          <button
            onClick={() => {
              setIsDropdownOpen(false);
              if (isLoggedIn) {
                navigate("/feed");
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="text-lg font-medium text-movie-text-main hover:text-movie-accent transition-colors cursor-pointer"
          >
            Feed
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="relative w-64 md:w-100">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            navigate(`/?search=${encodeURIComponent(e.target.value)}`);
          }}
          className="w-full h-10 pl-10 pr-5 bg-movie-bg text-white border border-gray-700 rounded-lg text-sm text-left outline-none focus:border-movie-accent transition-all"
        />
      </form>

      <div className="flex items-center gap-x-6">
        {!isLoggedIn && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/login");
              }}
              className="px-4 py-2 text-sm text-movie-text-main hover:text-movie-accent transition-colors font-bold cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/register");
              }}
              className="px-4 py-2 text-sm bg-movie-accent text-movie-text-main rounded-md font-bold cursor-pointer"
            >
              Register
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-400 hidden md:block select-none">
              Welcome,{" "}
              <span className="text-movie-accent font-semibold">
                {currentUser?.username}
              </span>
            </span>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-movie-accent hover:ring-2 hover:ring-movie-accent transition-all cursor-pointer overflow-hidden focus:outline-none"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-2xl" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-movie-surface border border-gray-800 rounded-lg shadow-2xl py-2 z-50 translate-x-1">
                  <div className="px-4 py-2 border-b border-gray-800 font-medium text-movie-text-sec text-xs tracking-wider">
                    User Menu
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center space-x-3 px-4 py-2.5 text-movie-text-main hover:bg-movie-bg hover:text-movie-accent transition-colors text-left w-full"
                  >
                    <FaUser className="text-gray-500 w-4" />{" "}
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/myreviews");
                    }}
                    className="flex items-center space-x-3 px-4 py-2.5 text-movie-text-main hover:bg-movie-bg hover:text-movie-accent transition-colors text-left w-full"
                  >
                    <FaStar className="text-gray-500 w-4" />{" "}
                    <span>My Reviews</span>
                  </button>

                  <LogoutButton
                    onLogoutSuccess={() => {
                      onLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-movie-bg hover:text-red-400 transition-colors w-full cursor-pointer focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
