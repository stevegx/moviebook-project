import React, { useState } from "react";
import Navbar from "../Navbar";
import { useAuth } from "../providers/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

function NavBarLayout({ children }: LayoutProps) {
  const { user: authUser, setUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = (authUser as any)?.user || authUser;
  const isLoggedIn = !!currentUser;

  const handleLogoutSuccess = () => {
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-movie-bg">
      <Navbar
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogoutSuccess}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="grow">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              searchQuery,
              currentUser,
            } as any);
          }
          return child;
        })}
      </main>
    </div>
  );
}

export default NavBarLayout;
