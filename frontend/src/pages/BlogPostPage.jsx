import { Link, useParams } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";
import { BLOG_POSTS } from "./BlogListPage";

const CONTENT = {
  "free-invoice-generator-india-2026": {
    sections: [
      {
        heading: "Why Indian Businesses Need a Free Invoice Generator",
        body: "India has over 60 million MSMEs, and the vast majority still create invoices manually using Word documents or Excel spreadsheets. This approach is slow, error-prone, and often results in invoices that don't meet GST compliance requirements. A free online invoice generator eliminates these problems by providing pre-built templates with all mandatory fields, automatic tax calculations, and instant PDF generation.",
      },
      {
        heading: "Features to Look For",
        body: "Not all invoice generators are created equal. When choosing one for your Indian business, look for these essential features:",
        list: [
          "GST compliance — GSTIN fields, HSN/SAC codes, CGST/SGST/IGST breakdowns",
          "Multiple tax rate support — 0%, 5%, 12%, 18%, and 28% slabs",
          "Professional templates — clean designs that reflect your brand",
          "PDF download — print-ready invoices you can email or WhatsApp",
          "No signup required — start creating invoices immediately",
          "Multi-currency — for businesses dealing with international clients",
        ],
      },
      {
        heading: "How to Create a Free Invoice with DoAide Invoicer",
        body: "Creating a professional invoice with DoAide Invoicer takes less than 30 seconds:",
        list: [
          "Go to the Create Invoice page — no signup needed",
          "Enter your business details (name, address, GSTIN)",
          "Add your client's information",
          "Add line items with quantities, rates, and GST rates",
          "Review the auto-calculated tax breakdown",
          "Download your PDF or send it directly via WhatsApp",
        ],
        cta: { text: "Create Your Free Invoice Now", to: "/create" },
      },
      {
        heading: "Save Time with Templates",
        body: "DoAide Invoicer offers 6 professionally designed templates including Standard, Professional, Minimal, Creative, GST Compliant, and International. Each template is free to use and includes all the fields your business needs. Browse our template gallery to find the perfect fit for your brand.",
        cta: { text: "Browse Templates", to: "/templates" },
      },
    ],
  },
  "gst-invoice-format-guide": {
    sections: [
      {
        heading: "Mandatory Fields in a GST Invoice",
        body: "Under the GST Act, every tax invoice must contain specific fields to be legally valid. Missing any of these can result in compliance issues, penalty notices, or rejected input tax credit claims. Here are the mandatory fields:",
        list: [
          "Supplier name, address, and GSTIN",
          "Invoice number (unique, sequential, max 16 characters)",
          "Date of issue",
          "Recipient name, address, and GSTIN (for B2B transactions)",
          "HSN code (for goods) or SAC code (for services)",
          "Description of goods or services",
          "Quantity and unit of measurement",
          "Total value before tax",
          "Taxable value after discounts",
          "Tax rate and amount — CGST, SGST, or IGST",
          "Place of supply (determines CGST+SGST vs IGST)",
          "Signature or digital signature of the supplier",
        ],
      },
      {
        heading: "Tax Invoice vs Bill of Supply vs Credit Note",
        body: "Understanding the difference between these document types is crucial for compliance:",
        list: [
          "Tax Invoice — issued by registered dealers for taxable supplies. Must include all GST fields. Required for B2B and most B2C transactions.",
          "Bill of Supply — issued when the supplier is under the composition scheme or selling exempt goods. Does not include tax amounts.",
          "Credit Note — issued when the taxable amount or tax charged exceeds the actual amount, or when goods are returned. Must reference the original invoice.",
          "Debit Note — issued when the original invoice undercharged. References the original invoice and adds the difference.",
        ],
      },
      {
        heading: "Common GST Invoice Mistakes",
        body: "These are the most frequent errors Indian businesses make with GST invoices:",
        list: [
          "Wrong GSTIN — always verify the client's GSTIN on the GST portal before invoicing",
          "Missing HSN/SAC codes — mandatory for businesses with turnover above ₹5 crore",
          "Incorrect place of supply — this determines whether CGST+SGST or IGST applies",
          "Non-sequential invoice numbers — the GST Act requires unique, sequential numbering",
          "Missing reverse charge notation — required when reverse charge mechanism applies",
          "Incorrect tax rate — using 18% when the item falls under 12% or 28%",
        ],
      },
      {
        heading: "Use a GST-Compliant Template",
        body: "The easiest way to avoid these mistakes is to use a template that includes all mandatory fields by default. DoAide Invoicer's GST Compliant template has every required field built in — GSTIN, HSN/SAC, place of supply, and automatic CGST/SGST/IGST calculation.",
        cta: { text: "Use GST-Compliant Template", to: "/create?template=gst-compliant" },
      },
    ],
  },
  "how-to-create-professional-invoices": {
    sections: [
      {
        heading: "Elements of a Professional Invoice",
        body: "A professional invoice does more than request payment — it represents your brand and builds trust with clients. Every professional invoice should include these elements:",
        list: [
          "Your business logo and brand colors",
          "Clear contact information (email, phone, address)",
          "Unique invoice number for easy reference",
          "Detailed line items with descriptions, not just amounts",
          "Transparent tax breakdown",
          "Payment terms and due date",
          "Bank details or payment instructions",
          "A polite thank-you note",
        ],
      },
      {
        heading: "Branding and Design Tips",
        body: "Your invoice is often the last touchpoint in a transaction. Make it count. Use consistent brand colors — if your logo is blue, use blue accents in your invoice. Choose readable fonts; avoid decorative typefaces for financial documents. White space is your friend — a cluttered invoice looks unprofessional and makes it harder for clients to find the total amount. Keep your logo at a reasonable size — prominent but not overwhelming.",
      },
      {
        heading: "Payment Terms Best Practices",
        body: "Clear payment terms reduce late payments and disputes. Here's what works:",
        list: [
          "Net 30 is the industry standard, but Net 15 gets you paid faster",
          "Always state the due date explicitly, not just the terms",
          "Offer multiple payment methods (bank transfer, UPI, cheque)",
          "Include your bank details directly on the invoice",
          "For large amounts, consider milestone-based payment schedules",
          "Add a polite late payment note — '2% monthly interest on overdue amounts'",
        ],
      },
      {
        heading: "Common Mistakes That Look Unprofessional",
        body: "Avoid these invoice mistakes that undermine your professionalism:",
        list: [
          "Typos and incorrect calculations — always double-check",
          "Missing invoice numbers — makes tracking impossible",
          "Vague descriptions like 'services rendered' — be specific",
          "No payment instructions — don't make clients guess how to pay you",
          "Inconsistent formatting — use the same template every time",
          "Sending invoices late — invoice promptly after delivery",
        ],
      },
      {
        heading: "Start with a Professional Template",
        body: "The fastest path to professional invoices is starting with a well-designed template. DoAide Invoicer offers 6 free templates designed by professionals — from clean minimal layouts to bold creative designs. Pick one that matches your brand and start invoicing in 30 seconds.",
        cta: { text: "Browse Invoice Templates", to: "/templates" },
      },
    ],
  },
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const content = CONTENT[slug];
  const related = BLOG_POSTS.filter((p) => p.slug !== slug);

  usePageTitle(post?.title || "Post Not Found");

  if (!post || !content) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink-strong mb-4">Post not found</h1>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const pageUrl = `https://invoicer.doaide.com/blog/${slug}`;
  const shareWhatsApp = () => {
    const text = `${post.title}\n\n${post.excerpt}\n\nRead more: ${pageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  const shareTwitter = () => {
    const text = `${post.title}\n\n${pageUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center max-w-3xl w-full mx-auto px-5 py-5">
        <Link to="/blog" className="flex items-center gap-2 text-sm text-ink-soft hover:text-brand transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Blog
        </Link>
        <div className="ml-auto"><ThemeToggle /></div>
      </header>

      <article className="max-w-3xl mx-auto px-5 pb-16">
        <header className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-3">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <span>By DoAide Team</span>
            <span>·</span>
            <time>{new Date(post.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="space-y-8">
          {content.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl text-ink-strong mb-3">{section.heading}</h2>
              <p className="text-ink-soft leading-relaxed mb-4">{section.body}</p>
              {section.list && (
                <ul className="space-y-2 mb-4">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="text-brand mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.cta && (
                <Link to={section.cta.to} className="btn btn-primary text-sm mt-2">{section.cta.text}</Link>
              )}
            </section>
          ))}
        </div>

        <div className="border-t border-line mt-10 pt-6">
          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-ink-muted pt-2">Share this article:</span>
            <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </button>
            <button type="button" onClick={shareTwitter} className="btn btn-ghost text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              Twitter
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-display text-xl text-ink-strong mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="panel hover:border-brand/40 transition-colors group">
                <h4 className="font-display text-lg text-ink-strong group-hover:text-brand transition-colors mb-1">{r.title}</h4>
                <p className="text-xs text-ink-muted">{r.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
