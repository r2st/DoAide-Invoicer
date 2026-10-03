import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ErrorBanner from "./ErrorBanner";

const EMPTY = { email: "", password: "", phone: "", name: "" };

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const registering = mode === "register";

  function switchTo(next) {
    setMode(next);
    setError("");
    setFieldErrors({});
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const problems = {};
    if (!form.email.trim()) problems.email = "Enter your email.";
    if (!form.password) problems.password = "Enter your password.";
    if (registering && !form.phone.trim()) problems.phone = "Enter your phone number.";
    if (Object.keys(problems).length > 0) {
      setFieldErrors(problems);
      return;
    }

    setBusy(true);
    try {
      if (registering) {
        await register({
          email: form.email,
          password: form.password,
          phone: form.phone,
          name: form.name || null,
        });
      } else {
        await login(form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-[var(--glass)] backdrop-blur border border-[var(--glass-border)] rounded-3xl p-7 shadow-lg">
        <div className="flex mb-5 border-b border-[var(--glass-tab-border)]" role="tablist">
          <button
            type="button"
            role="tab"
            className={`flex-1 py-2.5 px-4 text-sm font-medium border-b-2 bg-transparent cursor-pointer transition-colors ${!registering ? "border-brand text-ink-strong" : "border-transparent text-ink-muted"}`}
            aria-selected={!registering}
            onClick={() => switchTo("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            className={`flex-1 py-2.5 px-4 text-sm font-medium border-b-2 bg-transparent cursor-pointer transition-colors ${registering ? "border-brand text-ink-strong" : "border-transparent text-ink-muted"}`}
            aria-selected={registering}
            onClick={() => switchTo("register")}
          >
            Create account
          </button>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError("")} />

        <form onSubmit={handleSubmit} className="grid gap-1.5" noValidate>
          <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mt-3">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            aria-invalid={fieldErrors.email ? true : undefined}
            onChange={(e) => update("email", e.target.value)}
            className="input-field font-mono text-sm"
          />
          {fieldErrors.email && <p className="text-xs text-bad font-mono" role="alert">{fieldErrors.email}</p>}

          <label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mt-3">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={registering ? 8 : undefined}
            autoComplete={registering ? "new-password" : "current-password"}
            value={form.password}
            aria-invalid={fieldErrors.password ? true : undefined}
            onChange={(e) => update("password", e.target.value)}
            className="input-field font-mono text-sm"
          />
          {fieldErrors.password ? (
            <p className="text-xs text-bad font-mono" role="alert">{fieldErrors.password}</p>
          ) : registering && (
            <p className="text-xs text-ink-soft">At least 8 characters.</p>
          )}

          {registering && (
            <>
              <label htmlFor="phone" className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mt-3">WhatsApp Number</label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                aria-invalid={fieldErrors.phone ? true : undefined}
                onChange={(e) => update("phone", e.target.value)}
                className="input-field font-mono text-sm"
              />
              {fieldErrors.phone && <p className="text-xs text-bad font-mono" role="alert">{fieldErrors.phone}</p>}

              <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mt-3">Your name (optional)</label>
              <input
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input-field font-mono text-sm"
              />
            </>
          )}

          <button type="submit" className="btn btn-primary w-full mt-4 text-sm" disabled={busy}>
            {busy ? "Please wait…" : registering ? "Create account" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
