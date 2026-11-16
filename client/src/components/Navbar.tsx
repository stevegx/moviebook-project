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
    <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-movie-border bg-movie-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:px-6 lg:flex-nowrap lg:gap-5 lg:px-8">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 sm:gap-x-5">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-movie-accent sm:text-2xl">
          <FaFilm />
          MovieBook
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setSearchQuery("");
              navigate("/");
            }}
            className="inline-flex min-h-11 items-center rounded text-sm font-semibold transition-colors hover:text-movie-accent"
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
            className="inline-flex min-h-11 items-center rounded text-sm font-semibold transition-colors hover:text-movie-accent"
          >
            Feed
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSearchSubmit} role="search" className="relative order-3 w-full lg:order-none lg:max-w-sm lg:flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FaSearch />
        </div>
        <input
          type="search"
          aria-label="Search movies"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            navigate(`/?search=${encodeURIComponent(e.target.value)}`);
          }}
          className="input-control pl-10"
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
        {!isLoggedIn && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/login");
              }}
              className="inline-flex min-h-11 items-center rounded px-1.5 text-sm font-semibold hover:text-movie-accent sm:px-3"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/register");
              }}
              className="button-primary px-2.5 sm:px-4"
            >
              Register
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="flex items-center space-x-4">
            <span className="hidden max-w-36 truncate text-sm text-movie-text-sec xl:block">
              Welcome,{" "}
              <span className="text-movie-accent font-semibold">
                {currentUser?.username}
              </span>
            </span>

            <div className="relative" ref={dropdownRef}>
              <button
                aria-label="Account menu"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="grid size-11 place-items-center overflow-hidden rounded-full bg-movie-input text-movie-accent transition-colors hover:bg-movie-border"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="size-8" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="surface-panel absolute right-0 z-50 mt-3 w-48 py-2 shadow-2xl">
                  <div className="px-4 py-2 border-b border-movie-border font-medium text-movie-text-sec text-xs tracking-wider">
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

      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
