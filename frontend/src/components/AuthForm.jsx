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

        <div className="flex items-center gap-3 my-5 text-xs text-ink-muted">
          <span className="flex-1 h-px bg-[var(--glass-tab-border)]" />
          <span>or continue with</span>
          <span className="flex-1 h-px bg-[var(--glass-tab-border)]" />
        </div>

        <div className="grid gap-2.5">
          <a href="/api/v1/auth/google" className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] text-sm font-medium text-ink-strong no-underline hover:border-[#4285F4] transition-colors">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.7 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.5 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.4 6.9-17.7z" />
              <path fill="#FBBC05" d="M10.5 28.6a14.5 14.5 0 0 1 0-9.2l-7.9-6.2a24 24 0 0 0 0 21.6l7.9-6.2z" />
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.7-6c-2.1 1.4-4.8 2.3-7.5 2.3-6.3 0-11.6-4-13.5-9.6l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Google
          </a>
          <a href="/api/v1/auth/github" className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#24292e] bg-[#24292e] text-sm font-medium text-white no-underline hover:bg-[#2f363d] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a href="/api/v1/auth/microsoft" className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] text-sm font-medium text-ink-strong no-underline hover:border-[#00a4ef] transition-colors">
            <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
              <rect fill="#f25022" x="1" y="1" width="10" height="10" />
              <rect fill="#00a4ef" x="1" y="12" width="10" height="10" />
              <rect fill="#7fba00" x="12" y="1" width="10" height="10" />
              <rect fill="#ffb900" x="12" y="12" width="10" height="10" />
            </svg>
            Microsoft
          </a>
        </div>
      </div>
    </div>
  );
}
