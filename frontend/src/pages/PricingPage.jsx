import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    desc: "For freelancers getting started",
    features: [
      { text: "25 invoices/month", included: true },
      { text: "WhatsApp processing", included: true },
      { text: "Web dashboard", included: true },
      { text: "Basic DoAide GST integration", included: true },
      { text: "Bulk upload", included: false },
      { text: "CSV/Excel export", included: false },
      { text: "Priority processing", included: false },
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    desc: "For growing businesses",
    features: [
      { text: "500 invoices/month", included: true },
      { text: "WhatsApp processing", included: true },
      { text: "Web dashboard", included: true },
      { text: "Full DoAide GST integration", included: true },
      { text: "Bulk upload & export", included: true },
      { text: "Priority processing", included: true },
      { text: "Email support", included: true },
    ],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "CA Plan",
    price: "₹2,999",
    period: "/month",
    desc: "For chartered accountants",
    features: [
      { text: "Unlimited invoices", included: true },
      { text: "Multi-client management", included: true },
      { text: "API access", included: true },
      { text: "Full DoAide GST integration", included: true },
      { text: "Bulk upload & export", included: true },
      { text: "Priority processing", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Start CA Plan",
    highlight: false,
  },
];

export default function PricingPage() {
  usePageTitle("Pricing");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center max-w-7xl w-full mx-auto px-5 py-5">
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

      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-ink-strong mb-3">Simple, transparent pricing</h1>
          <p className="text-ink-soft max-w-lg mx-auto">
            Start free, upgrade when you need more. Every plan includes WhatsApp processing,
            AI-powered extraction, and GST-ready data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`panel flex flex-col ${plan.highlight ? "border-brand ring-2 ring-brand/20 relative" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-brand-text text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-sm text-ink-soft mb-3">{plan.desc}</p>
                <div className="text-4xl font-bold text-brand">
                  {plan.price}
                  <span className="text-base font-normal text-ink-soft">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 ${f.included ? "text-good" : "text-ink-muted"}`}>
                      {f.included ? "✓" : "✗"}
                    </span>
                    <span className={f.included ? "" : "text-ink-muted"}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`btn w-full ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-ink-soft">
            All prices exclude GST. Cancel anytime.{" "}
            <a href="mailto:support@doaide.com" className="text-brand hover:text-brand-dark transition-colors">
              Contact us
            </a>{" "}
            for custom plans.
          </p>
        </div>
      </div>
    </div>
  );
}
