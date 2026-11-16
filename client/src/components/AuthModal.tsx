import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fadeIn">
      <div className="surface-panel relative flex w-full max-w-md flex-col gap-5 p-6 shadow-2xl sm:p-8">
        
        <button 
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <FaTimes />
        </button>

        <div className="space-y-2">
          <h3 className="section-title">
            Join the Community!
          </h3>
          <p className="text-movie-text-sec text-sm leading-relaxed">
            Log in or create an account to read and write community reviews.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-2">
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            className="button-primary w-full"
          >
            Sign In
          </button>
          <button
            onClick={() => { onClose(); navigate("/register"); }}
            className="button-secondary w-full"
          >
            Create an Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default AuthModal;
