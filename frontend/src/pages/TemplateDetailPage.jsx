import { Link, useParams } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";
import { TEMPLATES } from "./TemplatesPage";

export default function TemplateDetailPage() {
  const { slug } = useParams();
  const template = TEMPLATES.find((t) => t.slug === slug);
  const related = TEMPLATES.filter((t) => t.slug !== slug).slice(0, 3);

  usePageTitle(template ? `${template.name} Invoice Template` : "Template Not Found");

  if (!template) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink-strong mb-4">Template not found</h1>
          <Link to="/templates" className="btn btn-primary">Browse Templates</Link>
        </div>
      </div>
    );
  }

  const pageUrl = `https://invoicer.doaide.com/template/${slug}`;
  const shareWhatsApp = () => {
    const text = `Check out this ${template.name} invoice template — free to use!\n\n${pageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  const shareTwitter = () => {
    const text = `Free ${template.name} invoice template for your business. Create professional invoices in seconds!\n\n${pageUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const c = template.color;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center max-w-6xl w-full mx-auto px-5 py-5">
        <Link to="/templates" className="flex items-center gap-2 text-sm text-ink-soft hover:text-brand transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          All Templates
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link to={`/create?template=${slug}`} className="btn btn-primary text-sm">Use This Template</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex justify-center">
            <svg viewBox="0 0 400 520" className="w-full max-w-md rounded-xl border border-line shadow-lg" style={{ background: "#fff" }}>
              <rect x="24" y="24" width="160" height="16" rx="3" fill={c} />
              <rect x="24" y="48" width="100" height="8" rx="2" fill="#ddd" />
              <rect x="280" y="24" width="96" height="24" rx="4" fill={c} opacity="0.15" />
              <rect x="292" y="32" width="72" height="8" rx="2" fill={c} />

              <rect x="24" y="90" width="80" height="6" rx="2" fill="#bbb" />
              <rect x="24" y="102" width="120" height="6" rx="2" fill="#ddd" />
              <rect x="24" y="114" width="100" height="6" rx="2" fill="#ddd" />
              <rect x="24" y="126" width="90" height="6" rx="2" fill="#ddd" />
              <rect x="240" y="90" width="80" height="6" rx="2" fill="#bbb" />
              <rect x="240" y="102" width="136" height="6" rx="2" fill="#ddd" />
              <rect x="240" y="114" width="110" height="6" rx="2" fill="#ddd" />
              <rect x="240" y="126" width="120" height="6" rx="2" fill="#ddd" />

              <line x1="24" y1="155" x2="376" y2="155" stroke={c} strokeWidth="2" />
              <rect x="24" y="162" width="140" height="6" rx="2" fill={c} opacity="0.5" />
              <rect x="200" y="162" width="50" height="6" rx="2" fill={c} opacity="0.5" />
              <rect x="270" y="162" width="40" height="6" rx="2" fill={c} opacity="0.5" />
              <rect x="340" y="162" width="36" height="6" rx="2" fill={c} opacity="0.5" />

              {[0, 1, 2, 3, 4].map((row) => (
                <g key={row}>
                  <rect x="24" y={182 + row * 28} width={120 + (row % 3) * 20} height="6" rx="2" fill="#e0e0e0" />
                  <rect x="200" y={182 + row * 28} width="40" height="6" rx="2" fill="#e0e0e0" />
                  <rect x="270" y={182 + row * 28} width="36" height="6" rx="2" fill="#e0e0e0" />
                  <rect x="340" y={182 + row * 28} width="36" height="6" rx="2" fill="#d0d0d0" />
                  <line x1="24" y1={196 + row * 28} x2="376" y2={196 + row * 28} stroke="#f0f0f0" strokeWidth="0.5" />
                </g>
              ))}

              <line x1="240" y1="340" x2="376" y2="340" stroke="#e0e0e0" strokeWidth="0.5" />
              <rect x="240" y="350" width="70" height="6" rx="2" fill="#ccc" />
              <rect x="340" y="350" width="36" height="6" rx="2" fill="#ccc" />
              <rect x="240" y="366" width="70" height="6" rx="2" fill="#ccc" />
              <rect x="340" y="366" width="36" height="6" rx="2" fill="#ccc" />
              <rect x="240" y="382" width="70" height="6" rx="2" fill="#ccc" />
              <rect x="340" y="382" width="36" height="6" rx="2" fill="#ccc" />
              <line x1="240" y1="398" x2="376" y2="398" stroke={c} strokeWidth="2" />
              <rect x="240" y="408" width="70" height="10" rx="2" fill={c} />
              <rect x="332" y="408" width="44" height="10" rx="2" fill={c} />

              <rect x="24" y="440" width="180" height="6" rx="2" fill="#e5e5e5" />
              <rect x="24" y="452" width="140" height="6" rx="2" fill="#e5e5e5" />
              <rect x="24" y="474" width="100" height="6" rx="2" fill="#ddd" />
              <rect x="24" y="486" width="120" height="6" rx="2" fill="#e5e5e5" />
              <rect x="24" y="498" width="80" height="6" rx="2" fill="#e5e5e5" />
            </svg>
          </div>

          <div className="lg:col-span-2">
            <span className={`chip chip-${template.tagColor} mb-3`}>{template.tag}</span>
            <h1 className="font-display text-3xl text-ink-strong mb-2">{template.name} Invoice Template</h1>
            <p className="text-ink-soft mb-6">{template.description}</p>

            <h3 className="text-sm font-semibold text-ink-strong mb-2 uppercase tracking-wide">Features</h3>
            <ul className="space-y-2 mb-6">
              {template.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="text-good">✓</span> {f}
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-ink-strong mb-2 uppercase tracking-wide">Who Is This For?</h3>
            <p className="text-sm text-ink-soft mb-6">{template.who}</p>

            <div className="space-y-3">
              <Link to={`/create?template=${slug}`} className="btn btn-primary w-full text-base py-3">
                Use This Template — Free
              </Link>
              <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp w-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Share on WhatsApp
              </button>
              <button type="button" onClick={shareTwitter} className="btn btn-ghost w-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share on Twitter
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl text-ink-strong mb-6 text-center">More Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((t) => (
              <Link key={t.slug} to={`/template/${t.slug}`} className="panel flex flex-col items-center text-center hover:border-brand/40 transition-colors">
                <span className={`chip chip-${t.tagColor} mb-3`}>{t.tag}</span>
                <h3 className="font-display text-lg text-ink-strong mb-1">{t.name}</h3>
                <p className="text-xs text-ink-soft">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
