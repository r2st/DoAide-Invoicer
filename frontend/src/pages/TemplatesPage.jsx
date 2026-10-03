import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

export const TEMPLATES = [
  {
    slug: "standard",
    name: "Standard",
    tag: "Free",
    tagColor: "good",
    description: "Clean, simple layout perfect for any business. Includes all essential fields.",
    features: ["Business details", "Line items table", "Tax summary", "Payment terms", "Notes section"],
    color: "#6B7280",
    who: "Small businesses, shops, and service providers who need a straightforward, no-fuss invoice.",
  },
  {
    slug: "professional",
    name: "Professional",
    tag: "Popular",
    tagColor: "brand",
    description: "Corporate-style invoice with logo placement, accent colors, and structured layout.",
    features: ["Logo placement", "Color accents", "Structured header", "Detailed line items", "Bank details"],
    color: "#1E3A5F",
    who: "Consultants, agencies, and B2B companies that want to project a polished, corporate image.",
  },
  {
    slug: "minimal",
    name: "Minimal",
    tag: "Free",
    tagColor: "good",
    description: "Ultra-clean, whitespace-heavy design. Modern and elegant for creative professionals.",
    features: ["Generous whitespace", "Modern typography", "Simple layout", "Clean totals", "Minimal borders"],
    color: "#D1D5DB",
    who: "Designers, photographers, and creative freelancers who want their invoice to reflect their aesthetic.",
  },
  {
    slug: "creative",
    name: "Creative",
    tag: "Free",
    tagColor: "good",
    description: "Bold colors and unique layout for freelancers who want to stand out.",
    features: ["Bold color scheme", "Unique layout", "Sidebar design", "Accent graphics", "Personality-driven"],
    color: "#E86C50",
    who: "Artists, content creators, and freelancers who want invoices as unique as their work.",
  },
  {
    slug: "gst-compliant",
    name: "GST Compliant",
    tag: "GST Ready",
    tagColor: "good",
    description: "Includes all mandatory GST fields — GSTIN, HSN, SAC, place of supply, and tax breakdowns.",
    features: ["GSTIN fields", "HSN/SAC codes", "Place of supply", "CGST/SGST/IGST split", "Reverse charge"],
    color: "#059669",
    who: "Indian businesses required to issue GST-compliant tax invoices under the GST Act.",
  },
  {
    slug: "international",
    name: "International",
    tag: "Popular",
    tagColor: "brand",
    description: "Multi-currency support with bilingual layout, ideal for export businesses and global teams.",
    features: ["Multi-currency", "Bilingual fields", "Country codes", "Exchange rate", "Export-ready format"],
    color: "#0891B2",
    who: "Exporters, remote teams, and global freelancers who invoice clients across borders.",
  },
];

function TemplateSvg({ template, size = 180 }) {
  const c = template.color;
  return (
    <svg viewBox="0 0 200 260" width={size} className="rounded-lg border border-line" style={{ background: "#fff" }}>
      <rect x="12" y="12" width="80" height="8" rx="2" fill={c} />
      <rect x="12" y="26" width="50" height="4" rx="1" fill="#ddd" />
      <rect x="140" y="12" width="48" height="12" rx="2" fill={c} opacity="0.15" />
      <rect x="146" y="16" width="36" height="4" rx="1" fill={c} />

      <rect x="12" y="50" width="60" height="4" rx="1" fill="#ccc" />
      <rect x="12" y="58" width="45" height="3" rx="1" fill="#e5e5e5" />
      <rect x="12" y="64" width="55" height="3" rx="1" fill="#e5e5e5" />
      <rect x="120" y="50" width="68" height="4" rx="1" fill="#ccc" />
      <rect x="120" y="58" width="50" height="3" rx="1" fill="#e5e5e5" />
      <rect x="120" y="64" width="60" height="3" rx="1" fill="#e5e5e5" />

      <line x1="12" y1="82" x2="188" y2="82" stroke={c} strokeWidth="1.5" />
      <rect x="12" y="86" width="70" height="3" rx="1" fill={c} opacity="0.6" />
      <rect x="100" y="86" width="25" height="3" rx="1" fill={c} opacity="0.6" />
      <rect x="140" y="86" width="20" height="3" rx="1" fill={c} opacity="0.6" />
      <rect x="170" y="86" width="18" height="3" rx="1" fill={c} opacity="0.6" />

      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect x="12" y={98 + row * 16} width={60 + (row % 3) * 10} height="3" rx="1" fill="#e0e0e0" />
          <rect x="100" y={98 + row * 16} width="20" height="3" rx="1" fill="#e0e0e0" />
          <rect x="140" y={98 + row * 16} width="18" height="3" rx="1" fill="#e0e0e0" />
          <rect x="170" y={98 + row * 16} width="18" height="3" rx="1" fill="#d0d0d0" />
          <line x1="12" y1={106 + row * 16} x2="188" y2={106 + row * 16} stroke="#f0f0f0" strokeWidth="0.5" />
        </g>
      ))}

      <line x1="120" y1="175" x2="188" y2="175" stroke="#e5e5e5" strokeWidth="0.5" />
      <rect x="120" y="180" width="35" height="3" rx="1" fill="#ccc" />
      <rect x="170" y="180" width="18" height="3" rx="1" fill="#ccc" />
      <rect x="120" y="190" width="35" height="3" rx="1" fill="#ccc" />
      <rect x="170" y="190" width="18" height="3" rx="1" fill="#ccc" />
      <line x1="120" y1="200" x2="188" y2="200" stroke={c} strokeWidth="1.5" />
      <rect x="120" y="206" width="35" height="5" rx="1" fill={c} />
      <rect x="166" y="206" width="22" height="5" rx="1" fill={c} />

      <rect x="12" y="228" width="90" height="3" rx="1" fill="#e5e5e5" />
      <rect x="12" y="236" width="70" height="3" rx="1" fill="#e5e5e5" />
      <rect x="12" y="248" width="50" height="3" rx="1" fill="#ddd" />
    </svg>
  );
}

export default function TemplatesPage() {
  usePageTitle("Invoice Templates");

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
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link to="/create" className="btn btn-primary text-sm">Create Invoice</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-2">Invoice Templates</h1>
          <p className="text-ink-soft text-sm max-w-lg mx-auto">Choose from 6 professionally designed templates. All free to use — no signup required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <div key={t.slug} className="panel flex flex-col items-center text-center hover:border-brand/40 transition-colors">
              <div className="mb-4">
                <span className={`chip chip-${t.tagColor}`}>{t.tag}</span>
              </div>
              <TemplateSvg template={t} />
              <h2 className="font-display text-xl text-ink-strong mt-4 mb-1">{t.name}</h2>
              <p className="text-sm text-ink-soft mb-4">{t.description}</p>
              <div className="flex gap-2 mt-auto w-full">
                <Link to={`/create?template=${t.slug}`} className="btn btn-primary flex-1 text-sm">Use Template</Link>
                <Link to={`/template/${t.slug}`} className="btn btn-ghost flex-1 text-sm">Preview</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="panel text-center mt-10 bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
          <h3 className="font-display text-xl text-ink-strong mb-2">Can't find what you need?</h3>
          <p className="text-sm text-ink-soft mb-4">Create a fully custom invoice with your own layout and branding.</p>
          <Link to="/create" className="btn btn-primary">Create Custom Invoice</Link>
        </div>
      </div>
    </div>
  );
}
