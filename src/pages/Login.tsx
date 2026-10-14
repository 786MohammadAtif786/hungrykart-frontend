import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../types";
import AuthLayout, { inputCls, submitCls } from "./AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(identifier.trim(), password);
      navigate(isAdmin(user) ? "/admin" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Log in">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="font-semibold">Email or mobile number</span>
          <input
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="font-semibold">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </label>
        {error && <p role="alert" className="text-sauce font-semibold text-sm">{error}</p>}
        <button disabled={busy} className={submitCls}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="mt-5 text-sm text-center">
        New here? <Link to="/register" className="font-bold underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}