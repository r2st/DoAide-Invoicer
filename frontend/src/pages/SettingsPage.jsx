import { useEffect, useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";

export default function SettingsPage() {
  usePageTitle("Settings");
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", gstin: "", state_code: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gstin: user.gstin || "",
        state_code: user.state_code || "",
      });
    }
  }, [user]);

  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await new Promise((r) => setTimeout(r, 500));
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Settings</h1>

      <ErrorBanner message={error} onDismiss={() => setError("")} />
      {success && (
        <div className="flex justify-between gap-3 px-3 py-2 rounded-[var(--radius)] mb-4 bg-good-bg text-good text-sm" role="status">
          {success}
          <button type="button" className="text-lg leading-none bg-transparent border-0 cursor-pointer text-inherit" onClick={() => setSuccess("")}>&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="panel">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">Profile</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-ink-soft mb-1 block">Name</label>
                <input id="name" value={profile.name} onChange={(e) => update("name", e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="text-xs font-semibold text-ink-soft mb-1 block">Email</label>
                <input id="email" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="text-xs font-semibold text-ink-soft mb-1 block">WhatsApp Number</label>
                <input id="phone" type="tel" value={profile.phone} onChange={(e) => update("phone", e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label htmlFor="gstin" className="text-xs font-semibold text-ink-soft mb-1 block">GSTIN</label>
                <input id="gstin" value={profile.gstin} onChange={(e) => update("gstin", e.target.value)} className="input-field text-sm font-mono" placeholder="27AAPFU0939F1ZV" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary text-sm" disabled={saving}>
                  {saving ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          <div className="panel">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">WhatsApp Setup</h2>
            <div className="bg-canvas rounded-[var(--radius)] p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-whatsapp/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-whatsapp" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Send invoices via WhatsApp</h3>
                  <p className="text-sm text-ink-soft mb-3">
                    Save our number and start sending invoice photos. We&apos;ll process them automatically.
                  </p>
                  <a
                    href="https://wa.me/919876543210?text=Hi"
                    className="btn btn-whatsapp text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">Current Plan</h2>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand mb-1">
                {user?.plan === "enterprise" ? "Enterprise" : user?.plan === "pro" ? "Pro" : user?.plan === "ca" ? "CA" : "Free"}
              </div>
              <p className="text-sm text-ink-soft mb-4">
                {user?.plan === "free"
                  ? `${user?.invoice_count_this_month ?? 0} / 5 invoices used`
                  : "Unlimited invoices"}
              </p>
              {user?.plan === "free" && (
                <div className="w-full bg-canvas rounded-full h-2 mb-4">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${Math.min(100, ((user?.invoice_count_this_month ?? 0) / 5) * 100)}%` }}
                  />
                </div>
              )}
              {user?.plan === "free" ? (
                <a href="/pricing" className="btn btn-primary text-sm w-full">Upgrade Plan</a>
              ) : (
                <a href="/pricing" className="btn btn-ghost text-sm w-full">Manage Plan</a>
              )}
            </div>
          </div>

          <div className="panel mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">Business Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">GSTIN</dt>
                <dd className="font-mono">{user?.gstin || "Not set"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">State</dt>
                <dd>{user?.state_code || "Not set"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Plan</dt>
                <dd className="capitalize">{user?.plan || "free"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
