import { useEffect, useRef, useState } from "react";
import AuthForm from "../components/AuthForm";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const TYPEWRITER_LINES = [
  "Send an invoice photo on WhatsApp",
  "AI extracts vendor, GSTIN, line items",
  "GST calculated, HSN codes matched",
  "Export GST-ready data in seconds",
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

const FEATURES = [
  { icon: "📱", title: "WhatsApp-First", desc: "Send a photo, get structured data" },
  { icon: "🤖", title: "AI-Powered OCR", desc: "Auto-extract vendor, GSTIN, items" },
  { icon: "📈", title: "GST-Ready", desc: "HSN codes + tax auto-calculated" },
  { icon: "⚡", title: "30-Second Turnaround", desc: "From photo to structured invoice" },
];

const PRICING = [
  { plan: "Free", price: "₹0", period: "/month", features: ["25 invoices/month", "WhatsApp processing", "Web dashboard"], cta: "Get Started" },
  { plan: "Pro", price: "₹999", period: "/month", features: ["500 invoices/month", "Bulk upload & export", "Priority processing", "Full GST integration"], cta: "Start Pro", highlight: true },
  { plan: "CA Plan", price: "₹2,999", period: "/month", features: ["Unlimited invoices", "Multi-client management", "API access", "Dedicated support"], cta: "Start CA Plan" },
];

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
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <a href="#pricing" className="text-sm text-ink-soft hover:text-brand transition-colors">Pricing</a>
        </div>
      </header>

      <section
        ref={heroRef}
        className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl w-full mx-auto px-5 lg:px-8 py-10 lg:py-20 flex-1"
        style={{ animation: "fade-up 0.8s ease 0.2s both" }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-4xl lg:text-6xl font-normal leading-tight text-ink-strong mb-4">
            Invoice photos to{" "}
            <span className="text-brand italic">GST-ready data</span>
          </h1>
          <p className="font-mono text-sm text-ink-muted leading-relaxed mb-6 max-w-lg">
            Send invoice photos on WhatsApp. AI extracts every field — vendor, GSTIN,
            line items, HSN codes — calculates GST, and feeds it into your filing workflow.
          </p>

          <div className="min-h-[28px] mb-8">
            <span className="font-mono text-sm font-medium text-brand">
              {typed}
              <span className="inline-block ml-px animate-pulse">|</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href="https://wa.me/919876543210?text=Hi"
              className="btn btn-whatsapp text-base px-6 py-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Start on WhatsApp
            </a>
            <a href="#auth" className="btn btn-ghost text-sm">
              Open Dashboard
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-0.5 px-3 py-2.5 border border-[var(--glass-feature-border)] rounded-[var(--radius)] bg-[var(--glass-feature-bg)] text-sm">
                <strong className="text-brand text-sm">{f.icon} {f.title}</strong>
                <span className="text-ink-muted text-xs">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm flex-shrink-0" id="auth">
          <AuthForm />
        </div>
      </section>

      <section id="pricing" className="max-w-7xl w-full mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-center text-ink-strong mb-10">Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((p) => (
            <div
              key={p.plan}
              className={`panel text-center ${p.highlight ? "border-brand ring-1 ring-brand" : ""}`}
            >
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
              <button type="button" className={`btn w-full ${p.highlight ? "btn-primary" : "btn-ghost"}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--glass-tab-border)] mt-auto py-6 px-5">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-muted">
          <a href="https://doaide.com" className="hover:text-brand transition-colors">DoAide</a>
          <a href="https://gst.doaide.com" className="hover:text-brand transition-colors">DoAide GST</a>
          <span>&copy; {new Date().getFullYear()} DoAide. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
