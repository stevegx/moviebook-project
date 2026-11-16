import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/components/providers/AuthContext";
import { register } from "@/services/auth";

export default function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "", password_confirmation: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setPending(true);
    try {
      setUser(await register(form));
      navigate("/");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not create your account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <Link className="text-link text-sm" to="/">MovieBook</Link>
        <h1 className="page-title mt-3">Create an account</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormInput label="Name" autoComplete="name" required minLength={3}
            value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <FormInput label="Username" autoComplete="username" required minLength={4}
            value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          <FormInput label="Email address" type="email" autoComplete="email" required
            value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FormInput label="Password" type="password" autoComplete="new-password" required minLength={8}
            value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <FormInput label="Confirm password" type="password" autoComplete="new-password" required minLength={8}
            value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="button-primary w-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-movie-text-sec">
          Already have an account? <Link className="text-link" to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}
