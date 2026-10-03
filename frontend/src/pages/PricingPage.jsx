import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { api } from "../lib/api";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    period: "/month",
    desc: "For freelancers getting started",
    features: [
      { text: "5 invoices/month", included: true },
      { text: "Basic templates", included: true },
      { text: "Email delivery", included: true },
      { text: "Web dashboard", included: true },
      { text: "Custom branding", included: false },
      { text: "Recurring invoices", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹349",
    priceNum: 349,
    period: "/month",
    desc: "For growing businesses",
    features: [
      { text: "Unlimited invoices", included: true },
      { text: "Custom branding", included: true },
      { text: "Recurring invoices", included: true },
      { text: "Payment tracking", included: true },
      { text: "Multi-currency support", included: true },
      { text: "Email & WhatsApp delivery", included: true },
      { text: "API access", included: false },
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹999",
    priceNum: 999,
    period: "/month",
    desc: "For large teams & CAs",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "API access", included: true },
      { text: "Bulk invoicing", included: true },
      { text: "Team accounts", included: true },
      { text: "Advanced analytics", included: true },
      { text: "GST integration", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Upgrade to Enterprise",
    highlight: false,
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PricingPage() {
  usePageTitle("Pricing");
  const auth = useAuth();
  const user = auth?.user ?? null;
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const handleSubscribe = useCallback(
    async (plan) => {
      if (!user) {
        window.location.href = "/?upgrade=" + plan;
        return;
      }

      setLoading(plan);
      setError("");

      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setError("Failed to load payment gateway. Please try again.");
          return;
        }

        const sub = await api.createSubscription(plan);

        const options = {
          key: sub.razorpay_key_id,
          subscription_id: sub.subscription_id,
          name: "DoAide Invoicer",
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan — ₹${plan === "pro" ? "349" : "999"}/month`,
          handler: async (response) => {
            try {
              await api.verifySubscription({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              window.location.href = "/settings";
            } catch {
              setError("Payment verification failed. Contact support if charged.");
            }
          },
          theme: { color: "#f0b429" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          setError("Payment failed. Please try again.");
        });
        rzp.open();
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(null);
      }
    },
    [user],
  );

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

        {error && (
          <div className="max-w-md mx-auto mb-8 px-4 py-3 rounded-[var(--radius)] bg-bad-bg text-bad text-sm text-center" role="alert">
            {error}
            <button type="button" className="ml-2 font-bold bg-transparent border-0 cursor-pointer text-inherit" onClick={() => setError("")}>&times;</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan) => {
            const isCurrent = user?.plan === plan.key;
            const isUpgrade = plan.key !== "free" && !isCurrent;

            return (
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

                {isCurrent ? (
                  <button type="button" className="btn btn-ghost w-full" disabled>
                    Current Plan
                  </button>
                ) : isUpgrade ? (
                  <button
                    type="button"
                    className={`btn w-full ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
                    disabled={loading !== null}
                    onClick={() => handleSubscribe(plan.key)}
                  >
                    {loading === plan.key ? "Processing…" : plan.cta}
                  </button>
                ) : (
                  <Link to="/" className={`btn w-full text-center ${plan.highlight ? "btn-primary" : "btn-ghost"}`}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            );
          })}
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
