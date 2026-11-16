import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { ProfileInput } from "@/services/auth";

interface Props {
  user: ProfileInput;
  onClose: () => void;
  onSave: (user: ProfileInput) => Promise<void>;
}

export default function EditProfileModal({ user, onClose, onSave }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [profile, setProfile] = useState(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(profile);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not save your profile.");
      setSaving(false);
    }
  }

  return (
    <dialog ref={dialog} className="modal-panel" aria-labelledby="edit-profile-title"
      onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}>
      <h2 id="edit-profile-title" className="section-title mb-5">Edit profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="form-label">
          Name
          <input className="input-control" autoComplete="name" required minLength={3}
            value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
        </label>
        <label className="form-label">
          Username
          <input className="input-control" autoComplete="username" required minLength={3}
            value={profile.username} onChange={(event) => setProfile({ ...profile, username: event.target.value })} />
        </label>
        <label className="form-label">
          Email address
          <input className="input-control" type="email" autoComplete="email" required
            value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button className="button-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </dialog>
  );
}
