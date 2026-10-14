import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout, { inputCls, submitCls } from "./AuthLayout";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const passwordValid = rules.every((r) => r.test(password));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError("Password must meet all the requirements below.");
      return;
    }

    setBusy(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Create account">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="font-semibold">Name</span>
          <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>

        <label className="block">
          <span className="font-semibold">Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </label>

        <label className="block">
          <span className="font-semibold">Mobile number</span>
          <input
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="9876543210"
            className={inputCls}
          />
        </label>

        <div className="block">
          <label htmlFor="password" className="font-semibold">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <ul className="mt-2 space-y-0.5 text-xs">
            {rules.map((r) => {
              const ok = r.test(password);
              return (
                <li key={r.label} className={ok ? "text-green-600" : "text-gray-500"}>
                  {ok ? "✓" : "•"} {r.label}
                </li>
              );
            })}
          </ul>
        </div>

        {error && <p role="alert" className="text-sauce font-semibold text-sm">{error}</p>}
        <button disabled={busy || !passwordValid} className={submitCls}>
          {busy ? "Creating…" : "Sign up"}
        </button>
      </form>

      <p className="mt-5 text-sm text-center">
        Already have an account? <Link to="/login" className="font-bold underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}