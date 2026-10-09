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
  "how-to-send-invoices-india": {
    sections: [
      {
        heading: "Why How You Send Invoices Matters",
        body: "Sending an invoice is more than attaching a PDF to an email. In India, where businesses rely heavily on WhatsApp and mobile communication, choosing the right delivery method can mean the difference between getting paid in 7 days versus 45. A well-delivered invoice reaches the right person, in the right format, at the right time — making it easy for your client to process and pay.",
      },
      {
        heading: "Best Ways to Send Invoices in India",
        body: "Indian businesses have several effective channels for invoice delivery. Choose based on your client's preferences and the formality of the relationship:",
        list: [
          "Email — the standard for B2B invoicing. Use a clear subject line: 'Invoice #INV-001 from [Your Business] — Due [Date]'. Attach the PDF and include a brief body with the total amount and payment details.",
          "WhatsApp — increasingly popular for SME invoicing in India. Send the PDF directly in chat with a polite message. WhatsApp Business API allows automated invoice delivery.",
          "Invoice management platforms — tools like DoAide Invoicer generate and send invoices in one step, with tracking to see when clients view them.",
          "Physical delivery — still required for some government contracts and large enterprises. Use registered post or courier for important invoices.",
          "Client portals — large companies like TCS, Infosys, and Wipro require invoice submission through their vendor portals (SAP Ariba, Coupa).",
        ],
      },
      {
        heading: "GST Compliance When Sending Invoices",
        body: "Every invoice you send must comply with GST regulations, regardless of the delivery method. Key compliance points:",
        list: [
          "Include all mandatory fields — supplier GSTIN, recipient GSTIN (B2B), HSN/SAC codes, tax breakdowns",
          "Issue invoices within the prescribed time — for goods, before or at the time of delivery; for services, within 30 days of service completion",
          "Maintain sequential invoice numbering — gaps in numbering can trigger compliance queries",
          "Keep digital copies for 6 years — the GST Act requires records to be maintained for 72 months",
          "E-invoicing is mandatory for businesses with turnover above ₹5 crore — generate IRN through the GST portal",
        ],
      },
      {
        heading: "Tips to Get Paid Faster",
        body: "Indian businesses often face delayed payments. These practices significantly reduce payment cycles:",
        list: [
          "Send invoices immediately after delivery — don't wait until month-end",
          "Include payment instructions on the invoice — UPI ID, bank account, or payment link",
          "Set clear payment terms — Net 15 gets you paid faster than Net 30",
          "Send a polite reminder 3 days before the due date via WhatsApp",
          "Follow up on Day 1 after the due date — a short message works better than a formal email",
          "Offer early payment discounts — '2% discount if paid within 7 days' motivates faster payment",
          "Use read receipts — platforms that track when your invoice is viewed help you time follow-ups",
        ],
      },
      {
        heading: "Send Your First Invoice Now",
        body: "DoAide Invoicer makes it easy to create and send professional, GST-compliant invoices. Generate your invoice in 30 seconds, download the PDF, and share it via WhatsApp or email — completely free, no signup required.",
        cta: { text: "Create & Send Your Invoice", to: "/create" },
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
  "gst-invoice-vs-regular-invoice": {
    sections: [
      {
        heading: "What is a Regular Invoice?",
        body: "A regular invoice — also called a commercial invoice, proforma invoice, or bill — is a basic payment document that records a transaction between a seller and a buyer. It typically includes the seller's and buyer's details, a description of goods or services, quantities, rates, and the total amount due. Regular invoices are used by unregistered businesses, businesses under the GST composition scheme, or for informal transactions where GST compliance is not required.",
      },
      {
        heading: "What is a GST Invoice?",
        body: "A GST invoice (also called a tax invoice) is a legally mandated document issued by GST-registered businesses for taxable supplies. It must include specific fields defined under the Central Goods and Services Tax (CGST) Act, 2017. A valid GST invoice is essential for claiming Input Tax Credit (ITC), filing GST returns, and maintaining compliance. Without a properly formatted GST invoice, the buyer cannot claim ITC, which increases their effective cost.",
        list: [
          "Supplier and recipient GSTIN (Goods and Services Tax Identification Number)",
          "Sequential invoice number (unique, max 16 characters per financial year)",
          "Date of issue and place of supply",
          "HSN code (for goods) or SAC code (for services)",
          "Detailed tax breakdowns — CGST, SGST for intra-state or IGST for inter-state",
          "Total taxable value, tax amount, and invoice total",
          "Digital or physical signature of the supplier",
        ],
      },
      {
        heading: "Key Differences: GST Invoice vs Regular Invoice",
        body: "Understanding these differences is critical for compliance, tax filing, and financial planning:",
        list: [
          "Legal validity — GST invoices are legally required under GST law for all taxable supplies by registered dealers. Regular invoices have no specific legal format requirement.",
          "GSTIN fields — GST invoices must include both supplier and recipient GSTIN (for B2B). Regular invoices do not include GSTIN.",
          "Tax breakdowns — GST invoices show separate CGST, SGST, or IGST amounts at applicable rates. Regular invoices may show a lump-sum total without tax details.",
          "HSN/SAC codes — Mandatory on GST invoices for businesses above the prescribed turnover threshold. Not required on regular invoices.",
          "Place of supply — GST invoices must specify place of supply (determines CGST+SGST vs IGST). Regular invoices do not track this.",
          "Input Tax Credit — Only GST invoices allow the buyer to claim ITC. Purchases made against regular invoices cannot be used for ITC claims.",
          "Who issues which — GST-registered businesses must issue GST invoices. Unregistered businesses, composition scheme dealers, and businesses selling exempt goods issue regular invoices or bills of supply.",
          "E-invoicing — Businesses with turnover above ₹5 crore must generate e-invoices through the GST portal (IRN). This applies only to GST invoices.",
        ],
      },
      {
        heading: "When to Use Each Type",
        body: "The type of invoice you issue depends on your GST registration status and the nature of the transaction:",
        list: [
          "GST-registered businesses (regular scheme) — must issue GST tax invoices for all taxable supplies, both B2B and B2C",
          "Composition scheme businesses — issue a Bill of Supply instead of a tax invoice (cannot charge or show GST separately)",
          "Unregistered businesses — issue regular invoices without GST fields (buyer cannot claim ITC)",
          "Export invoices — GST-registered exporters issue tax invoices with IGST at 0% (zero-rated supply) or under Letter of Undertaking (LUT)",
          "Proforma invoices — used as quotations or estimates before the actual transaction; not valid for GST compliance or ITC claims",
          "Credit and debit notes — issued to adjust previously issued GST invoices (for returns, price changes, or corrections)",
        ],
      },
      {
        heading: "How to Create a GST-Compliant Invoice",
        body: "The easiest way to ensure your invoices meet all GST requirements is to use a purpose-built template. DoAide Invoicer's GST Compliant template includes every mandatory field — GSTIN, HSN/SAC codes, place of supply, and automatic CGST/SGST/IGST calculation. Just fill in your details, and the template handles the compliance. Create your first GST invoice in 30 seconds — free, no signup required.",
        cta: { text: "Create GST Invoice Now", to: "/create?template=gst-compliant" },
      },
    ],
  },
  "input-tax-credit-guide-india": {
    sections: [
      {
        heading: "What is Input Tax Credit (ITC)?",
        body: "Input Tax Credit (ITC) is the mechanism that allows GST-registered businesses to reduce their tax liability by claiming credit for the GST they paid on purchases (inputs). If you buy raw materials, services, or capital goods for your business and pay GST on them, you can subtract that amount from the GST you collect on your sales. This prevents the cascading effect of tax-on-tax and is one of the fundamental benefits of the GST system.",
      },
      {
        heading: "Who Can Claim ITC?",
        body: "Not every business can claim ITC. You must meet these eligibility conditions:",
        list: [
          "You must be registered under GST — unregistered businesses cannot claim ITC",
          "You must have a valid tax invoice or debit note from the supplier",
          "You must have actually received the goods or services",
          "The supplier must have filed their GST return and paid the tax to the government",
          "You must file your GST returns on time — late filing can delay or forfeit ITC claims",
          "The goods or services must be used for business purposes, not personal use",
          "Businesses under the composition scheme cannot claim ITC",
        ],
      },
      {
        heading: "Documents Required for ITC Claims",
        body: "The GST Act specifies which documents are valid for claiming ITC. Missing or incorrect documents are the most common reason for rejected claims:",
        list: [
          "Tax invoice issued by the supplier (must contain GSTIN, HSN/SAC, and tax amount)",
          "Debit note issued by the supplier",
          "Bill of entry for imported goods (customs duty)",
          "ISD (Input Service Distributor) invoice for distributed credits",
          "The invoice must match the details in GSTR-2B (auto-populated from supplier's GSTR-1)",
        ],
      },
      {
        heading: "Common Mistakes That Lead to ITC Rejection",
        body: "Indian businesses lose crores in ITC claims every year due to avoidable errors. Watch out for these:",
        list: [
          "Claiming ITC on invoices from unregistered suppliers — only GST-registered suppliers generate valid tax invoices",
          "GSTIN mismatch — the GSTIN on the invoice must exactly match your registration",
          "Not verifying GSTR-2B reconciliation — if the supplier hasn't filed their return, the ITC won't appear in your 2B",
          "Claiming ITC on blocked items — certain categories like food, club memberships, and personal vehicles are blocked from ITC",
          "Missing the time limit — ITC must be claimed before the earlier of: filing the September return of the following year, or the annual return date",
          "Duplicate claims — claiming the same invoice twice across different return periods",
        ],
      },
      {
        heading: "Items Where ITC Cannot Be Claimed (Blocked Credits)",
        body: "Section 17(5) of the CGST Act lists items where ITC is specifically blocked, regardless of business use:",
        list: [
          "Motor vehicles and conveyances (except when used for specified purposes like transport, training, or resale)",
          "Food and beverages, outdoor catering, beauty treatment, health services, cosmetic and plastic surgery",
          "Membership of a club, health and fitness centre",
          "Rent-a-cab, life insurance, health insurance (except when provided to employees under a statutory obligation)",
          "Travel benefits extended to employees on vacation",
          "Works contract services for construction of immovable property (except plant and machinery)",
          "Goods or services used for personal consumption",
          "Goods lost, stolen, destroyed, written off, or given as free samples",
        ],
      },
      {
        heading: "Maximize Your ITC with Proper Invoicing",
        body: "The key to successful ITC claims starts with proper invoicing. Every invoice you receive — and every invoice you issue — must contain all mandatory GST fields. Use DoAide Invoicer's GST Compliant template to ensure your invoices include GSTIN, HSN/SAC codes, and proper tax breakdowns that support ITC claims for your clients.",
        cta: { text: "Create GST-Compliant Invoice", to: "/create?template=gst-compliant" },
      },
    ],
  },
  "invoice-payment-terms-best-practices": {
    sections: [
      {
        heading: "Why Payment Terms Matter",
        body: "Payment terms are the conditions under which you expect to receive payment for goods or services. They're more than just a line on your invoice — they directly affect your cash flow, working capital, and business relationships. Indian SMEs report an average collection period of 45-90 days, but businesses that use clear, strategic payment terms consistently get paid 30-40% faster. The right payment terms balance your cash flow needs with your client's payment capabilities.",
      },
      {
        heading: "Common Payment Terms Explained",
        body: "Understanding standard payment terms helps you choose the right one for each client relationship:",
        list: [
          "Due on Receipt — payment expected immediately upon receiving the invoice. Best for small transactions and new clients.",
          "Net 15 / Net 30 / Net 45 / Net 60 — payment due within 15, 30, 45, or 60 days of invoice date. Net 30 is the most common in India.",
          "2/10 Net 30 — 2% discount if paid within 10 days, otherwise full amount due in 30 days. Motivates early payment.",
          "50% Advance — half the payment upfront before starting work. Standard for projects, custom manufacturing, and high-value services.",
          "Milestone-based — payments tied to project milestones (e.g., 30% on signing, 40% on delivery, 30% on acceptance). Common in IT and construction.",
          "COD (Cash on Delivery) — payment collected at the time of delivery. Still prevalent in Indian B2C and small B2B transactions.",
          "End of Month (EOM) — payment due at the end of the month in which the invoice was issued.",
        ],
      },
      {
        heading: "Choosing the Right Payment Terms",
        body: "The ideal payment terms depend on several factors specific to your business and client:",
        list: [
          "New clients — start with shorter terms (Net 15 or 50% advance) until trust is established. You can extend terms as the relationship matures.",
          "Large corporates — often insist on Net 60 or Net 90. Factor this into your pricing and negotiate for earlier payment discounts.",
          "Freelancers and agencies — milestone-based or 50% advance protects against scope creep and non-payment.",
          "Recurring services (retainers) — monthly advance payment is ideal. If not possible, Net 15 keeps cash flow healthy.",
          "Product businesses — Due on Receipt or Net 15 for physical goods. Cash on Delivery for first-time buyers.",
          "High-value contracts — always require a significant advance (30-50%) and structure remaining payments around deliverables.",
        ],
      },
      {
        heading: "Late Payment Strategies That Work in India",
        body: "Despite clear terms, late payments are common in India. These strategies help without damaging relationships:",
        list: [
          "Send a reminder 3 days before the due date — a polite WhatsApp message works better than a formal email",
          "Follow up on Day 1 after the due date — prompt follow-up signals that you track payments closely",
          "Include a late fee clause in your terms — '1.5% per month on overdue amounts' is standard and legally enforceable",
          "Offer UPI/bank transfer options — making it easy to pay reduces friction and excuses",
          "Invoice immediately after delivery — don't wait until month-end; delayed invoicing leads to delayed payments",
          "Build relationships with the accounts payable team — knowing the right contact speeds up processing",
          "Use read receipts — knowing when your invoice was viewed helps time follow-ups effectively",
          "Consider factoring for persistent late-payers — invoice factoring services in India can provide 80-90% of invoice value upfront",
        ],
      },
      {
        heading: "How to Add Payment Terms to Your Invoice",
        body: "Clear payment terms on your invoice set expectations from the start. Your invoice should explicitly state: the due date (not just 'Net 30' — write the actual date), accepted payment methods with account details, late fee policy, and any early payment discount. DoAide Invoicer includes a dedicated payment terms section in every template, and our Payment Terms Calculator helps you compute due dates and discounts automatically.",
        cta: { text: "Create Invoice with Payment Terms", to: "/create" },
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
