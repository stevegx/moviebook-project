import React, { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useAuth } from "../providers/AuthContext"; // Χρησιμοποιούμε το global Auth

interface LayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: LayoutProps) {
  // Παίρνουμε τον έτοιμο χρήστη και τη συνάρτηση που τον αλλάζει από το Context
  const { user: authUser, setUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Φιλτράρουμε αν το user object έχει εσωτερικό property .user
  const currentUser = (authUser as any)?.user || authUser;
  const isLoggedIn = !!currentUser;

  // Η συνάρτηση logout που έλειπε
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

      <Footer isLoggedIn={isLoggedIn} onLogout={handleLogoutSuccess} />
    </div>
  );
}

export default MainLayout;
