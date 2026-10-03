import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const STYLES = {
  primary: {
    label: "Primary (Gold)",
    base: "display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:8px;font-family:system-ui,sans-serif;font-weight:600;font-size:14px;text-decoration:none;cursor:pointer;border:none;",
    normal: "background:#F0B429;color:#0A0A0B;",
    hover: "background:#D4A017;",
  },
  outline: {
    label: "Outline",
    base: "display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:8px;font-family:system-ui,sans-serif;font-weight:600;font-size:14px;text-decoration:none;cursor:pointer;",
    normal: "background:transparent;color:#F0B429;border:2px solid #F0B429;",
    hover: "background:rgba(240,180,41,0.1);",
  },
  minimal: {
    label: "Minimal (Text Link)",
    base: "display:inline-flex;align-items:center;gap:6px;font-family:system-ui,sans-serif;font-weight:600;font-size:14px;text-decoration:none;cursor:pointer;border:none;background:transparent;padding:8px 0;",
    normal: "color:#F0B429;",
    hover: "text-decoration:underline;",
  },
};

const SIZES = {
  small: { label: "Small", padding: "8px 16px", fontSize: "12px" },
  medium: { label: "Medium", padding: "12px 24px", fontSize: "14px" },
  large: { label: "Large", padding: "16px 32px", fontSize: "16px" },
};

export default function EmbedPage() {
  usePageTitle("Embed Invoice Widget");
  const [buttonText, setButtonText] = useState("Create Free Invoice");
  const [style, setStyle] = useState("primary");
  const [size, setSize] = useState("medium");
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState("");

  const sizeOverrides = style === "minimal" ? "" : `padding:${SIZES[size].padding};font-size:${SIZES[size].fontSize};`;
  const inlineStyle = STYLES[style].base + STYLES[style].normal + sizeOverrides + (dark ? "background:#1a1a1d;color:#F0B429;border-color:#F0B429;" : "");

  const embedCode = `<a href="https://invoicer.doaide.com/create" target="_blank" rel="noopener" style="${inlineStyle}">${buttonText}</a>`;
  const iframeCode = `<iframe src="https://invoicer.doaide.com/create?embed=1" width="100%" height="600" frameborder="0" style="border:1px solid #e5e5e5;border-radius:8px;"></iframe>`;

  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center max-w-5xl w-full mx-auto px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
            <rect x="4" y="6" width="32" height="28" rx="4" fill="var(--brand)" />
            <rect x="8" y="12" width="18" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="17" width="24" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="22" width="14" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="27" width="20" height="2" rx="1" fill="var(--brand-text)" />
          </svg>
          <span className="font-display text-2xl tracking-tight text-ink-strong">
            DoAide <em className="text-brand">Invoicer</em>
          </span>
        </Link>
        <div className="ml-auto"><ThemeToggle /></div>
      </header>

      <div className="max-w-5xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-2">Embed Invoice Widget</h1>
          <p className="text-ink-soft text-sm max-w-lg mx-auto">
            Add a "Create Free Invoice" button to your website. When visitors click it, they'll create an invoice on DoAide Invoicer — free, no signup required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="panel">
              <h2 className="font-display text-lg text-ink-strong mb-4">Customize Widget</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="btn-text" className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Button Text</label>
                  <input id="btn-text" className="input-field" value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block mb-2">Style</label>
                  <div className="flex gap-2">
                    {Object.entries(STYLES).map(([key, s]) => (
                      <button key={key} type="button" onClick={() => setStyle(key)} className={`btn text-xs ${style === key ? "btn-primary" : "btn-ghost"}`}>{s.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block mb-2">Size</label>
                  <div className="flex gap-2">
                    {Object.entries(SIZES).map(([key, s]) => (
                      <button key={key} type="button" onClick={() => setSize(key)} className={`btn text-xs ${size === key ? "btn-primary" : "btn-ghost"}`}>{s.label}</button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                  <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="accent-brand" />
                  Dark background
                </label>
              </div>
            </div>

            <div className="panel">
              <h3 className="font-display text-lg text-ink-strong mb-3">Button Embed Code</h3>
              <div className="bg-canvas rounded-[var(--radius)] p-3 font-mono text-xs text-ink-soft overflow-x-auto border border-line mb-3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {embedCode}
              </div>
              <button type="button" onClick={() => copyToClipboard(embedCode, "button")} className="btn btn-primary text-sm w-full">
                {copied === "button" ? "Copied!" : "Copy Button Code"}
              </button>
            </div>

            <div className="panel">
              <h3 className="font-display text-lg text-ink-strong mb-3">Iframe Embed</h3>
              <p className="text-sm text-ink-soft mb-3">Embed the full invoice creator directly in your page:</p>
              <div className="bg-canvas rounded-[var(--radius)] p-3 font-mono text-xs text-ink-soft overflow-x-auto border border-line mb-3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {iframeCode}
              </div>
              <button type="button" onClick={() => copyToClipboard(iframeCode, "iframe")} className="btn btn-ghost text-sm w-full">
                {copied === "iframe" ? "Copied!" : "Copy Iframe Code"}
              </button>
            </div>
          </div>

          <div>
            <div className="panel">
              <h3 className="font-display text-lg text-ink-strong mb-4">Live Preview</h3>
              <div className={`rounded-xl p-8 flex items-center justify-center min-h-[120px] ${dark ? "bg-[#1a1a1d]" : "bg-white"}`}>
                <a
                  href="https://invoicer.doaide.com/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...Object.fromEntries(inlineStyle.split(";").filter(Boolean).map((s) => { const [k, ...v] = s.split(":"); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.join(":").trim()]; })) }}
                >
                  {buttonText}
                </a>
              </div>
            </div>

            <div className="panel">
              <h3 className="font-display text-lg text-ink-strong mb-4">Why Add This Widget?</h3>
              <div className="space-y-4">
                {[
                  { title: "Free for your visitors", desc: "No signup needed. Anyone can create a professional invoice instantly." },
                  { title: "Professional invoices", desc: "GST-compliant templates with automatic tax calculation and PDF download." },
                  { title: "Powered by DoAide", desc: "Trusted invoicing platform used by thousands of Indian businesses." },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <span className="text-brand text-lg mt-0.5">✓</span>
                    <div>
                      <h4 className="text-sm font-semibold text-ink-strong">{b.title}</h4>
                      <p className="text-xs text-ink-soft">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)] text-center">
              <p className="text-sm text-ink-soft mb-3">Start creating invoices yourself</p>
              <Link to="/create" className="btn btn-primary text-sm">Create Free Invoice</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
