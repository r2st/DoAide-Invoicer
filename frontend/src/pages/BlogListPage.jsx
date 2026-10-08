import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";

export const BLOG_POSTS = [
  {
    slug: "free-invoice-generator-india-2026",
    title: "Free Invoice Generator India 2026",
    excerpt: "Discover why thousands of Indian businesses are switching to free online invoice generators. Learn what features matter most and how to create GST-compliant invoices in seconds.",
    date: "2026-09-15",
    readTime: "5 min read",
  },
  {
    slug: "gst-invoice-format-guide",
    title: "GST Invoice Format Guide",
    excerpt: "Everything you need to know about GST invoice formats — mandatory fields, the difference between tax invoices and bills of supply, and common mistakes that lead to compliance issues.",
    date: "2026-09-01",
    readTime: "7 min read",
  },
  {
    slug: "how-to-create-professional-invoices",
    title: "How to Create Professional Invoices",
    excerpt: "Professional invoices get you paid faster. Learn the essential elements, branding tips, payment terms best practices, and how to make every invoice reflect your business standards.",
    date: "2026-08-20",
    readTime: "6 min read",
  },
  {
    slug: "how-to-send-invoices-india",
    title: "How to Send Invoices in India: Complete Guide",
    excerpt: "Learn the best ways to send invoices to clients in India — email, WhatsApp, and digital platforms. Covers GST compliance, payment follow-ups, and tips to get paid faster.",
    date: "2026-10-01",
    readTime: "6 min read",
  },
  {
    slug: "gst-invoice-vs-regular-invoice",
    title: "GST Invoice vs Regular Invoice: What Indian Businesses Need to Know",
    excerpt: "Understand the key differences between GST tax invoices and regular invoices — mandatory fields, legal validity, input tax credit eligibility, and when to use each type.",
    date: "2026-10-05",
    readTime: "8 min read",
  },
];

export default function BlogListPage() {
  usePageTitle("Blog");

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

      <div className="max-w-3xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-2">Blog</h1>
          <p className="text-ink-soft text-sm">Guides, tips, and resources for invoicing and GST compliance in India.</p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="panel block hover:border-brand/40 transition-colors group">
              <div className="flex items-center gap-3 mb-2 text-xs text-ink-muted">
                <time>{new Date(post.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="font-display text-xl text-ink-strong group-hover:text-brand transition-colors mb-2">{post.title}</h2>
              <p className="text-sm text-ink-soft">{post.excerpt}</p>
              <span className="text-sm text-brand font-medium mt-3 inline-block">Read more →</span>
            </Link>
          ))}
        </div>

        <div className="panel text-center mt-10 bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
          <h3 className="font-display text-xl text-ink-strong mb-2">Ready to create your first invoice?</h3>
          <p className="text-sm text-ink-soft mb-4">Free, no signup required. Generate professional invoices in 30 seconds.</p>
          <Link to="/create" className="btn btn-primary">Create Free Invoice</Link>
        </div>
      </div>
    </div>
  );
}
