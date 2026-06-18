import { Link } from "react-router-dom";
import { FaFilm } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

interface FooterProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

function Footer({ isLoggedIn, onLogout }: FooterProps) {
  return (
    <footer className="bg-movie-surface border-t border-[#b4b4b4]/20 text-movie-text-main py-12 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-2xl font-bold font-display text-movie-accent">
            <FaFilm />
            <span>MovieBook</span>
          </div>
          <p className="text-movie-text-sec text-sm leading-relaxed max-w-[300px]">
            Your ultimate movie guide, personal cinema diary, and community platform for film lovers.
          </p>
          
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-movie-text-main font-display mb-1 border-b border-movie-accent/30 pb-1 w-fit">
            Navigation
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-movie-text-sec">
            <li>
              <Link to="/" className="hover:text-movie-accent transition-colors">Home & Explore</Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-movie-accent transition-colors">Sign In</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-movie-accent transition-colors">Create Account</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/feed" className="hover:text-movie-accent transition-colors">Feed</Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-movie-accent transition-colors">My Profile</Link>
                </li>
                <li>
                  <LogoutButton 
                    onLogoutSuccess={onLogout}
                    className="hover:text-red-400 transition-colors text-left cursor-pointer">
                  </LogoutButton>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-movie-text-main font-display mb-1 border-b border-movie-accent/30 pb-1 w-fit">
            Credits
          </h3>
          <p className="text-xs text-movie-text-sec leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB. All movie data and images are provided by TheMovieDB.
          </p>
          <div className="mt-2 px-3 py-1.5 bg-movie-bg/50 rounded border border-[#b4b4b4]/10 w-fit text-[10px] font-bold tracking-wider text-movie-accent">
            POWERED BY TMDB
          </div>
        </div>

      </div>

      <div className="max-full mx-auto px-6 mt-10 pt-6 border-t border-[#b4b4b4]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-movie-text-sec">
        <p>© 2026 MovieBook. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;