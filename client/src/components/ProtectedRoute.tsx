import { Navigate } from "react-router-dom";
import { useAuth } from "./providers/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Φόρτωση...</div>; // Περιμένει το API
  if (!user) return <Navigate to="/login" replace />; // Κάνει redirect ΜΟΝΟ αν τελείωσε το loading και δεν υπάρχει χρήστης

  return children;
}
