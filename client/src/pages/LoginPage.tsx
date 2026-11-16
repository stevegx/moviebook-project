import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/components/providers/AuthContext";
import { login } from "@/services/auth";

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      setUser(await login(form));
      navigate("/");
    } catch {
      setError("Unable to log in. Check your email and password and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <Link className="text-link text-sm" to="/">MovieBook</Link>
        <h1 className="page-title mt-3">Welcome back</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormInput label="Email address" type="email" autoComplete="email" required
            value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FormInput label="Password" type="password" autoComplete="current-password" required
            value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="button-primary w-full" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-movie-text-sec">
          Don't have an account? <Link className="text-link" to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}
