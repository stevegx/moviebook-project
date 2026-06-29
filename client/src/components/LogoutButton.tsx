import { useNavigate } from "react-router-dom";
import { logout } from "@/services/auth";
import { FaSignOutAlt } from "react-icons/fa";
interface LogoutProp {
  onLogoutSuccess: () => void;
  className?: string;
}

function LogoutButton({onLogoutSuccess, className}: LogoutProp) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); 
      window.dispatchEvent(new Event("authChange"));
    } finally {
      onLogoutSuccess();
      navigate("/");
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className={className || "items-center gap-2 text-lg font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer mr-5 focus:outline-none"}
    >
      <FaSignOutAlt />
      Logout
    </button>
  );
}

export default LogoutButton;