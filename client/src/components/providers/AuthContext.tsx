import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { user as getUser } from "@/services/auth";

type AuthContextType = {
  user: { name?: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name?: string } | null>>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((data) => setUser(data as { name?: string }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
