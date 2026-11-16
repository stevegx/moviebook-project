import { useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";
import { useAuth } from "@/components/providers/AuthContext";
import { updateProfile } from "@/services/auth";
import type { ProfileInput } from "@/services/auth";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const avatar = user.name.trim().charAt(0).toUpperCase() || "?";
  const handleSave = async (changes: ProfileInput) => {
    setUser(await updateProfile(user.id, changes));
    setEditing(false);
    setSaved(true);
  };

  return (
    <section className="page-shell max-w-2xl space-y-6">
      <h1 className="page-title">Your profile</h1>
      <div className="surface-panel space-y-6 p-6 sm:p-8">
        <div className="flex min-w-0 items-center gap-4">
          <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-movie-accent/15 text-xl font-bold text-movie-accent">
            {avatar}
          </span>
          <div className="min-w-0">
            <p className="break-words text-xl font-semibold">{user.name}</p>
            <p className="break-words text-sm text-movie-text-sec">@{user.username}</p>
          </div>
        </div>
        <dl className="border-t border-movie-border pt-5">
          <dt className="text-sm text-movie-text-sec">Email address</dt>
          <dd className="mt-1 break-words">{user.email}</dd>
        </dl>
        <button className="button-primary" onClick={() => { setSaved(false); setEditing(true); }}>
          Edit profile
        </button>
        {saved && <p role="status" className="text-sm text-movie-accent">Profile updated.</p>}
      </div>

      {editing && <EditProfileModal user={user} onClose={() => setEditing(false)} onSave={handleSave} />}
    </section>
  );
}
