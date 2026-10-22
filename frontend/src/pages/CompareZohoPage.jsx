import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const PAGE_URL = "https://invoicer.doaide.com/compare/zoho-invoice";

const ROWS = [
  { feature: "Price", doaide: "Free, forever", zoho: "Free (account required)" },
  { feature: "Sign-up required", doaide: "No — create an invoice instantly", zoho: "Yes — account setup before first invoice" },
  { feature: "Time to first invoice", doaide: "~30 seconds", zoho: "10–15 minutes (org profile, taxes, customers)" },
  { feature: "GST-compliant tax invoice", doaide: "Yes — CGST/SGST/IGST split, HSN/SAC, place of supply", zoho: "Yes — full GST support" },
  { feature: "HSN summary on invoice", doaide: "Yes (GST template)", zoho: "Yes" },
  { feature: "Invoice templates", doaide: "6 free templates", zoho: "10+ templates, deeper customisation" },
  { feature: "PDF download", doaide: "Yes, unlimited", zoho: "Yes" },
  { feature: "WhatsApp sharing", doaide: "Yes — one tap, invoice attached", zoho: "Via integrations" },
  { feature: "Works without installing anything", doaide: "Yes — runs in the browser", zoho: "Web + mobile apps" },
  { feature: "Recurring invoices", doaide: "Yes (free account)", zoho: "Yes" },
  { feature: "Payment reminders", doaide: "Basic", zoho: "Automated reminder workflows" },
  { feature: "Client portal", doaide: "No", zoho: "Yes" },
  { feature: "Time tracking & expenses", doaide: "No", zoho: "Yes" },
  { feature: "Data stays on your device", doaide: "Yes, unless you opt into an account", zoho: "Stored in Zoho cloud" },
  { feature: "Best for", doaide: "Freelancers & small businesses who want a quick GST invoice", zoho: "Businesses that want a full invoicing suite" },
];

const FAQS = [
  {
    q: "Is DoAide Invoicer really free?",
    a: "Yes. Creating, downloading and sharing invoices is free with no sign-up. An optional free account adds invoice history and payment tracking.",
  },
  {
    q: "Is Zoho Invoice free too?",
    a: "Yes, Zoho Invoice has been free since 2021. The difference is setup: Zoho requires creating an account and configuring your organisation before you can invoice, while DoAide Invoicer lets you download a GST invoice in about 30 seconds with no account.",
  },
  {
    q: "Which is better for GST invoices in India?",
    a: "Both produce GST-compliant tax invoices with GSTIN, HSN/SAC codes and CGST/SGST/IGST breakdowns. DoAide Invoicer is faster for one-off invoices; Zoho Invoice suits businesses that also want client portals, time tracking and automated reminders.",
  },
  {
    q: "Can I switch from Zoho Invoice to DoAide Invoicer?",
    a: "There is nothing to migrate for invoice creation — open the generator, enter your business details once (they are remembered on your device) and create your next invoice. For history across devices, create a free account.",
  },
];

function Check() {
  return <svg className="w-4 h-4 text-good inline-block mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>;
}

export default function CompareZohoPage() {
  usePageTitle(
    "DoAide Invoicer vs Zoho Invoice",
    "DoAide Invoicer vs Zoho Invoice compared for Indian businesses: price, GST compliance, HSN codes, templates, WhatsApp sharing and setup time. See which free invoice generator fits you.",
  );

  return (
    <div className="min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "DoAide Invoicer vs Zoho Invoice",
              url: PAGE_URL,
              description: "Side-by-side comparison of DoAide Invoicer and Zoho Invoice for Indian businesses.",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]),
        }}
      />
      <header className="flex items-center max-w-5xl w-full mx-auto px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-brand">DoAide</span>
            <span className="text-ink-muted mx-1.5">|</span>
            <span className="text-ink-strong">Invoicer</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link to="/create" className="btn btn-primary text-sm">Create Invoice</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-3">DoAide Invoicer vs Zoho Invoice</h1>
          <p className="text-ink-soft text-sm max-w-2xl mx-auto">
            Both are free invoicing tools popular with Indian businesses. The honest difference: Zoho Invoice is a
            full invoicing suite that needs an account and setup; DoAide Invoicer gets you a GST-compliant PDF
            invoice in about 30 seconds with no sign-up. Here is the full comparison.
          </p>
        </div>

        <div className="panel overflow-x-auto mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-3 pr-4 text-ink-muted font-mono text-[10px] uppercase tracking-widest">Feature</th>
                <th className="py-3 pr-4 text-brand font-semibold">DoAide Invoicer</th>
                <th className="py-3 text-ink-strong font-semibold">Zoho Invoice</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.feature} className="border-b border-line/60 align-top">
                  <td className="py-3 pr-4 font-medium text-ink-strong">{r.feature}</td>
                  <td className="py-3 pr-4 text-ink-soft">{r.doaide.startsWith("Yes") || r.doaide.startsWith("Free") ? <Check /> : null}{r.doaide}</td>
                  <td className="py-3 text-ink-soft">{r.zoho.startsWith("Yes") || r.zoho.startsWith("Free") ? <Check /> : null}{r.zoho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="panel">
            <h2 className="font-display text-xl text-ink-strong mb-3">Choose DoAide Invoicer if…</h2>
            <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
              <li>You need a GST invoice <strong>right now</strong>, without creating yet another account</li>
              <li>You invoice a handful of clients and don't need a full accounting suite</li>
              <li>You share invoices on <strong>WhatsApp</strong> — it's built in, one tap</li>
              <li>You prefer your business details stored on your own device</li>
              <li>You want HSN/SAC codes, CGST/SGST/IGST splits and amount-in-words handled for you</li>
            </ul>
          </div>
          <div className="panel">
            <h2 className="font-display text-xl text-ink-strong mb-3">Choose Zoho Invoice if…</h2>
            <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
              <li>You want a client portal where customers view and pay invoices</li>
              <li>You need time tracking, expense tracking and project billing</li>
              <li>You want automated payment reminder sequences</li>
              <li>You already use other Zoho products (Books, CRM) and want them connected</li>
              <li>You have a team that needs multi-user access</li>
            </ul>
          </div>
        </div>

        <div className="panel mb-10">
          <h2 className="font-display text-xl text-ink-strong mb-4">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="text-sm font-semibold text-ink-strong mb-1">{f.q}</h3>
                <p className="text-sm text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel text-center bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
          <h2 className="font-display text-xl text-ink-strong mb-2">Try the 30-second invoice</h2>
          <p className="text-sm text-ink-soft mb-4">No sign-up, no setup. Create a GST-compliant invoice and download the PDF free.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/create" className="btn btn-primary">Create a Free Invoice</Link>
            <Link to="/templates" className="btn btn-ghost">Browse Templates</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
