import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const TYPEWRITER_LINES = [
  "Create a free invoice in 30 seconds",
  "GST-compliant templates, zero signup",
  "Download PDF, share via WhatsApp",
  "Professional invoices for every business",
];

function useTypewriter(lines, typingSpeed = 50, pauseMs = 2000) {
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const line = lines[lineIndex];
    if (!deleting && charIndex < line.length) {
      const t = setTimeout(() => {
        setText(line.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, typingSpeed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIndex === line.length) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex > 0) {
      const t = setTimeout(() => {
        setText(line.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, typingSpeed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setLineIndex((i) => (i + 1) % lines.length);
    }
  }, [charIndex, deleting, lineIndex, lines, typingSpeed, pauseMs]);

  return text;
}

const TOOLS = [
  { icon: "📄", title: "Invoice Generator", desc: "Create beautiful invoices instantly — no signup", to: "/create" },
  { icon: "🧮", title: "Tax Calculator", desc: "GST/CGST/SGST/IGST breakdown calculator", to: "/calculator" },
  { icon: "🎨", title: "Invoice Templates", desc: "6 free professional templates to choose from", to: "/templates" },
];

const FEATURES = [
  { icon: "⚡", title: "30-Second Invoices", desc: "Fill in details, download PDF. That's it." },
  { icon: "📱", title: "WhatsApp Sharing", desc: "Send invoices directly via WhatsApp" },
  { icon: "📈", title: "GST-Ready", desc: "CGST, SGST, IGST — auto-calculated" },
  { icon: "🆓", title: "Free Forever", desc: "No signup needed for basic invoicing" },
];

const COUNTER = { value: "10,000+", label: "invoices generated" };

export default function LandingPage() {
  usePageTitle(null);
  const typed = useTypewriter(TYPEWRITER_LINES);
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink overflow-x-hidden">
      <header className="flex items-center max-w-7xl w-full mx-auto px-5 py-5">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
            <rect x="4" y="6" width="32" height="28" rx="4" fill="var(--brand)" />
            <rect x="8" y="12" width="18" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="17" width="24" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="22" width="14" height="2" rx="1" fill="var(--brand-text)" />
            <rect x="8" y="27" width="20" height="2" rx="1" fill="var(--brand-text)" />
          </svg>
          <span className="font-display text-2xl tracking-tight">
            DoAide <em className="text-brand">Invoicer</em>
          </span>
        </div>
        <nav className="ml-auto flex items-center gap-4">
          <Link to="/create" className="text-sm text-ink-soft hover:text-brand transition-colors hidden sm:inline">Create Invoice</Link>
          <Link to="/templates" className="text-sm text-ink-soft hover:text-brand transition-colors hidden sm:inline">Templates</Link>
          <Link to="/calculator" className="text-sm text-ink-soft hover:text-brand transition-colors hidden sm:inline">Calculator</Link>
          <Link to="/blog" className="text-sm text-ink-soft hover:text-brand transition-colors hidden md:inline">Blog</Link>
          <a href="#pricing" className="text-sm text-ink-soft hover:text-brand transition-colors">Pricing</a>
          <ThemeToggle />
        </nav>
      </header>

      <section
        ref={heroRef}
        className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl w-full mx-auto px-5 lg:px-8 py-10 lg:py-20 flex-1"
        style={{ animation: "fade-up 0.8s ease 0.2s both" }}
      >
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass-feature-bg)] border border-[var(--glass-feature-border)] text-sm text-brand mb-4">
            <span className="font-mono font-bold">{COUNTER.value}</span>
            <span className="text-ink-muted">{COUNTER.label}</span>
          </div>

          <h1 className="font-display text-4xl lg:text-6xl font-normal leading-tight text-ink-strong mb-4">
            Create a Free Invoice{" "}
            <span className="text-brand italic">in 30 Seconds</span>
          </h1>
          <p className="text-ink-soft leading-relaxed mb-6 max-w-lg">
            Professional, GST-compliant invoices with zero signup. Fill in your details, download PDF,
            and share via WhatsApp — completely free.
          </p>

          <div className="min-h-[28px] mb-8">
            <span className="font-mono text-sm font-medium text-brand">
              {typed}
              <span className="inline-block ml-px animate-pulse">|</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/create" className="btn btn-primary text-base px-6 py-3">
              Create Free Invoice
            </Link>
            <a href="#auth" className="btn btn-ghost text-sm">
              Open Dashboard
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {TOOLS.map((tool) => (
              <Link key={tool.title} to={tool.to} className="flex flex-col gap-1 px-4 py-3 border border-[var(--glass-feature-border)] rounded-[var(--radius)] bg-[var(--glass-feature-bg)] text-sm hover:border-brand/40 transition-colors group">
                <strong className="text-brand text-sm">{tool.icon} {tool.title}</strong>
                <span className="text-ink-muted text-xs">{tool.desc}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-0.5 px-3 py-2.5 border border-line rounded-[var(--radius)] bg-surface text-sm">
                <strong className="text-ink-strong text-sm">{f.icon} {f.title}</strong>
                <span className="text-ink-muted text-xs">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm flex-shrink-0" id="auth">
          <AuthForm />
        </div>
      </section>

      <section className="max-w-7xl w-full mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-center text-ink-strong mb-3">How It Works</h2>
        <p className="text-center text-ink-soft mb-10 max-w-md mx-auto text-sm">Three steps to a professional invoice. No account needed.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Fill in details", desc: "Enter your business name, client info, and line items with amounts." },
            { step: "2", title: "Review & customize", desc: "Preview your invoice, choose a template, and verify the tax breakdown." },
            { step: "3", title: "Download & share", desc: "Download as PDF or send directly via WhatsApp. Done in 30 seconds." },
          ].map((s) => (
            <div key={s.step} className="panel text-center">
              <div className="w-10 h-10 rounded-full bg-brand text-brand-text font-bold text-lg flex items-center justify-center mx-auto mb-3">{s.step}</div>
              <h3 className="font-semibold text-ink-strong mb-1">{s.title}</h3>
              <p className="text-sm text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/create" className="btn btn-primary text-base px-8 py-3">Get Started — It's Free</Link>
        </div>
      </section>

      <section id="pricing" className="max-w-7xl w-full mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-center text-ink-strong mb-3">Simple, transparent pricing</h2>
        <p className="text-center text-ink-soft mb-10 text-sm">Free tools for everyone. Pro features when you need them.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { plan: "Free", price: "₹0", period: "/forever", features: ["5 invoices/month", "All templates", "PDF download", "WhatsApp sharing", "Tax calculator"], cta: "Start Free", to: "/create", highlight: false },
            { plan: "Pro", price: "₹349", period: "/month", features: ["Unlimited invoices", "Custom branding", "Recurring invoices", "Payment tracking", "Email & WhatsApp delivery"], cta: "Upgrade to Pro", to: "/pricing", highlight: true },
            { plan: "Enterprise", price: "₹999", period: "/month", features: ["Everything in Pro", "API access", "Bulk invoicing", "Team accounts", "GST integration"], cta: "Upgrade", to: "/pricing", highlight: false },
          ].map((p) => (
            <div
              key={p.plan}
              className={`panel text-center ${p.highlight ? "border-brand ring-1 ring-brand relative" : ""}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-brand-text text-xs font-semibold px-3 py-1 rounded-full">Most Popular</div>
              )}
              <h3 className="text-lg font-semibold mb-1">{p.plan}</h3>
              <div className="text-3xl font-bold text-brand mb-1">{p.price}<span className="text-sm font-normal text-ink-soft">{p.period}</span></div>
              <ul className="text-sm text-ink-soft space-y-2 my-6 text-left">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-good mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={p.to} className={`btn w-full ${p.highlight ? "btn-primary" : "btn-ghost"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--glass-tab-border)] mt-auto py-8 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-ink-strong mb-2">Free Tools</h4>
              <div className="flex flex-col gap-1">
                <Link to="/create" className="text-xs text-ink-soft hover:text-brand transition-colors">Invoice Generator</Link>
                <Link to="/calculator" className="text-xs text-ink-soft hover:text-brand transition-colors">Tax Calculator</Link>
                <Link to="/templates" className="text-xs text-ink-soft hover:text-brand transition-colors">Templates</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-strong mb-2">Resources</h4>
              <div className="flex flex-col gap-1">
                <Link to="/blog" className="text-xs text-ink-soft hover:text-brand transition-colors">Blog</Link>
                <Link to="/pricing" className="text-xs text-ink-soft hover:text-brand transition-colors">Pricing</Link>
                <Link to="/embed" className="text-xs text-ink-soft hover:text-brand transition-colors">Embed Widget</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-strong mb-2">Templates</h4>
              <div className="flex flex-col gap-1">
                <Link to="/template/professional" className="text-xs text-ink-soft hover:text-brand transition-colors">Professional</Link>
                <Link to="/template/gst-compliant" className="text-xs text-ink-soft hover:text-brand transition-colors">GST Compliant</Link>
                <Link to="/template/minimal" className="text-xs text-ink-soft hover:text-brand transition-colors">Minimal</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-strong mb-2">DoAide</h4>
              <div className="flex flex-col gap-1">
                <a href="https://doaide.com" className="text-xs text-ink-soft hover:text-brand transition-colors">DoAide Home</a>
                <a href="https://gst.doaide.com" className="text-xs text-ink-soft hover:text-brand transition-colors">DoAide GST</a>
                <Link to="/sitemap" className="text-xs text-ink-soft hover:text-brand transition-colors">Sitemap</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-muted pt-4 border-t border-line">
            <span>&copy; {new Date().getFullYear()} DoAide. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
