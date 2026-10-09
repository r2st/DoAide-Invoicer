import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

const SITEMAP_ENTRIES = [
  { url: "/", name: "Homepage", priority: "1.0" },
  { url: "/create", name: "Free Invoice Generator", priority: "0.9" },
  { url: "/calculator", name: "Invoice Tax Calculator", priority: "0.9" },
  { url: "/templates", name: "Invoice Templates Gallery", priority: "0.9" },
  { url: "/template/standard", name: "Standard Template", priority: "0.8" },
  { url: "/template/professional", name: "Professional Template", priority: "0.8" },
  { url: "/template/minimal", name: "Minimal Template", priority: "0.8" },
  { url: "/template/creative", name: "Creative Template", priority: "0.8" },
  { url: "/template/gst-compliant", name: "GST Compliant Template", priority: "0.8" },
  { url: "/template/international", name: "International Template", priority: "0.8" },
  { url: "/pricing", name: "Pricing", priority: "0.7" },
  { url: "/blog", name: "Blog", priority: "0.7" },
  { url: "/blog/free-invoice-generator-india-2026", name: "Free Invoice Generator India 2026", priority: "0.6" },
  { url: "/blog/gst-invoice-format-guide", name: "GST Invoice Format Guide", priority: "0.6" },
  { url: "/blog/how-to-create-professional-invoices", name: "How to Create Professional Invoices", priority: "0.6" },
  { url: "/tools/invoice-number-generator", name: "Invoice Number Generator", priority: "0.8" },
  { url: "/tools/invoice-validator", name: "GST Invoice Validator", priority: "0.8" },
  { url: "/tools/gst-rate-finder", name: "GST Rate Finder", priority: "0.8" },
  { url: "/tools/payment-terms", name: "Payment Terms Calculator", priority: "0.7" },
  { url: "/tools/late-fee", name: "Late Fee Calculator", priority: "0.7" },
  { url: "/blog/how-to-send-invoices-india", name: "How to Send Invoices in India", priority: "0.6" },
  { url: "/blog/gst-invoice-vs-regular-invoice", name: "GST vs Regular Invoice", priority: "0.6" },
  { url: "/blog/input-tax-credit-guide-india", name: "Input Tax Credit Guide", priority: "0.6" },
  { url: "/blog/invoice-payment-terms-best-practices", name: "Payment Terms Best Practices", priority: "0.6" },
  { url: "/embed", name: "Embed Widget", priority: "0.5" },
];

export default function SitemapPage() {
  usePageTitle("Sitemap");

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
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink-strong mb-2">Sitemap</h1>
          <p className="text-ink-soft text-sm">All pages on DoAide Invoicer</p>
        </div>

        <div className="panel overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Page</th>
                <th>URL</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {SITEMAP_ENTRIES.map((entry) => (
                <tr key={entry.url}>
                  <td className="font-medium">{entry.name}</td>
                  <td>
                    <Link to={entry.url} className="text-brand hover:text-brand-dark font-mono text-xs transition-colors">
                      {entry.url}
                    </Link>
                  </td>
                  <td className="font-mono text-ink-muted">{entry.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
