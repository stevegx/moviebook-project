import { getProfile } from "../services/userService";
import { useEffect, useState } from "react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string; 
}

function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-movie-text-sec">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[450px] bg-movie-surface rounded-lg border border-[#b4b4b4] p-[30px] flex flex-col items-center">
        <h2 className="text-2xl font-bold font-display mb-6 text-movie-text-main">Your Profile</h2>

        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-movie-accent mb-6"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-movie-bg border-2 border-movie-accent mb-6 flex items-center justify-center text-movie-text-sec text-sm">
            No Image
          </div>
        )}

        <div className="w-full text-left space-y-3 mb-6 bg-movie-bg/30 p-4 rounded border border-gray-700/50">
          <p className="text-sm text-movie-text-main m-0">
            <strong className="text-movie-text-sec font-medium">First Name:</strong> {user?.firstName}
          </p>
          <p className="text-sm text-movie-text-main m-0">
            <strong className="text-movie-text-sec font-medium">Last Name:</strong> {user?.lastName}
          </p>
          <p className="text-sm text-movie-text-main m-0">
            <strong className="text-movie-text-sec font-medium">Email:</strong> {user?.email}
          </p>
        </div>

        <button className="w-full px-5 py-2.5 bg-movie-accent text-movie-text-main rounded font-medium cursor-pointer hover:bg-[#1b97b2] transition-colors">
          Edit Profile
        </button>
      </div>    
    </div>    
  );
}

export default ProfilePage;