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
  "gst-invoice-format-2026-complete-guide": {
    faqs: [
      { q: "What is the correct GST invoice format in 2026?", a: "The correct GST invoice format in 2026 must include supplier and recipient GSTIN, a unique sequential invoice number (max 16 characters), date of issue, HSN/SAC codes, itemised tax breakdowns (CGST, SGST, or IGST), place of supply, total taxable value, and the supplier's signature. Businesses with turnover above ₹5 crore must also generate an e-invoice with IRN through the IRP portal." },
      { q: "Is e-invoicing mandatory for all businesses in 2026?", a: "As of 2026, e-invoicing is mandatory for all GST-registered businesses with aggregate turnover exceeding ₹5 crore in any financial year from 2017-18 onwards. The government has progressively lowered the threshold and may reduce it further. Businesses below the threshold can still issue e-invoices voluntarily." },
      { q: "What happens if my GST invoice is missing mandatory fields?", a: "An invoice missing mandatory fields may be treated as invalid under GST law. The buyer cannot claim Input Tax Credit (ITC) on such invoices, and the supplier may face penalties under Sections 122 and 125 of the CGST Act. Missing HSN codes or incorrect GSTIN can also trigger notices during GST audits." },
      { q: "Can I use a free invoice generator for GST-compliant invoices?", a: "Yes. Free invoice generators like DoAide Invoicer include all mandatory GST fields — GSTIN, HSN/SAC codes, place of supply, and automatic CGST/SGST/IGST calculation. They produce legally valid invoices that comply with GST format requirements, though you still need to generate IRN separately through the IRP if e-invoicing applies to you." },
      { q: "How many digits should the HSN code be on a GST invoice?", a: "The required HSN code length depends on your turnover. Businesses with turnover up to ₹5 crore must use 4-digit HSN codes, while businesses with turnover above ₹5 crore must use 6-digit HSN codes. For exports and imports, 8-digit HSN codes are mandatory." },
    ],
    sections: [
      {
        heading: "What Changed in the GST Invoice Format for 2026",
        body: "The GST invoice format has undergone several updates since its introduction in 2017. In 2026, the most significant changes revolve around the expanded e-invoicing mandate, stricter HSN code requirements, and enhanced digital compliance measures. The Central Board of Indirect Taxes and Customs (CBIC) has progressively lowered the e-invoicing threshold from ₹500 crore in 2020 to ₹5 crore in 2023, and the 2026 rules continue to tighten enforcement. Businesses that previously relied on manual invoicing are now required to adopt structured digital formats. Understanding these changes is critical to avoid compliance penalties and ensure your clients can claim Input Tax Credit on your invoices.",
      },
      {
        heading: "Mandatory Fields in a GST Invoice (2026 Rules)",
        body: "Every GST tax invoice issued in 2026 must contain the following fields to be legally valid under the CGST Act. Missing any of these can lead to rejected ITC claims, penalty notices, or audit triggers:",
        list: [
          "Supplier's name, address, and GSTIN — your registered business identity",
          "A unique, sequential invoice number — maximum 16 characters, no gaps allowed within a financial year",
          "Date of issue — the date the invoice is generated, not the delivery date",
          "Recipient's name, address, and GSTIN — mandatory for all B2B transactions; for B2C transactions above ₹50,000, recipient name and address are required",
          "HSN code (for goods) or SAC code (for services) — 4-digit for turnover up to ₹5 crore, 6-digit for turnover above ₹5 crore",
          "Description of goods or services — clear and specific, not generic terms like 'services rendered'",
          "Quantity and unit of measurement — UQC (Unique Quantity Code) as per GST notification",
          "Total value before tax — the base amount before any GST is applied",
          "Taxable value after discounts — the amount on which GST is calculated",
          "Tax rate and amount — separate line items for CGST and SGST (intra-state) or IGST (inter-state)",
          "Place of supply — determines whether CGST+SGST or IGST applies; must include the state name and code",
          "Reverse charge indication — if reverse charge mechanism (RCM) applies, it must be explicitly stated",
          "Signature — digital or physical signature of the supplier or their authorised representative",
        ],
      },
      {
        heading: "E-Invoicing Requirements in 2026",
        body: "E-invoicing through the Invoice Registration Portal (IRP) is now mandatory for businesses with aggregate turnover exceeding ₹5 crore. When you generate an e-invoice, the IRP validates your invoice data, assigns a unique Invoice Reference Number (IRN), digitally signs the invoice, and generates a QR code. The QR code contains key invoice details that can be scanned for instant verification. Your accounting or invoicing software must generate invoices in the prescribed JSON schema and communicate with the IRP via API. Non-compliance with e-invoicing results in the invoice being treated as invalid — the recipient cannot claim ITC, and you may face penalties up to ₹25,000 per invoice under Section 122 of the CGST Act.",
        cta: { text: "Create GST-Compliant Invoice", to: "/create?template=gst-compliant" },
      },
      {
        heading: "GST Invoice Format: Intra-State vs Inter-State",
        body: "The place of supply determines which taxes appear on your invoice. Getting this wrong is one of the most common compliance mistakes, and it directly impacts your GST return filing:",
        list: [
          "Intra-state supply (supplier and recipient in the same state) — charge CGST + SGST at equal rates. For example, 18% GST = 9% CGST + 9% SGST",
          "Inter-state supply (supplier and recipient in different states) — charge IGST at the full rate. For example, 18% GST = 18% IGST",
          "Exports — treated as zero-rated inter-state supply. Issue invoice with IGST at 0% or under Letter of Undertaking (LUT)",
          "Supply to SEZ — treated as inter-state supply, eligible for zero-rating with LUT or IGST refund",
          "Place of supply for services follows specific rules under Sections 12 and 13 of the IGST Act — location of the recipient for most B2B services, location of the supplier for certain B2C services",
        ],
      },
      {
        heading: "Credit Notes and Debit Notes Under GST",
        body: "When you need to adjust a previously issued invoice, GST law requires you to issue a credit note or debit note with specific details. A credit note reduces the tax liability — issue it when goods are returned, when you overcharged, or when a post-supply discount is given. A debit note increases the tax liability — issue it when the original invoice undercharged. Both must reference the original invoice number and date, include the reason for the adjustment, and be reported in your GSTR-1 for the relevant period. Credit notes for a financial year must be issued before 30th November of the following year or the date of filing the annual return, whichever is earlier.",
      },
      {
        heading: "Common Format Mistakes That Trigger GST Notices",
        body: "The GST department uses automated data matching to flag discrepancies. These common mistakes in invoice formatting are the top reasons businesses receive compliance notices:",
        list: [
          "GSTIN mismatch — the recipient's GSTIN on your invoice doesn't match their registration. Always verify on the GST portal before invoicing",
          "Missing or incorrect HSN/SAC codes — using a generic 4-digit code when 6 digits are required, or mapping the wrong code to your product",
          "Non-sequential invoice numbers — gaps in your invoice number series raise red flags during audits. Use a consistent numbering format",
          "Wrong place of supply — billing address vs delivery address confusion leads to incorrect CGST/SGST vs IGST application",
          "Missing reverse charge notation — forgetting to indicate RCM when it applies leads to incorrect tax treatment",
          "Rounding errors — GST amounts must be rounded to the nearest rupee at the invoice level, not at the line-item level",
          "Duplicate invoice numbers — two invoices with the same number in the same financial year is a compliance violation",
        ],
      },
      {
        heading: "Free GST Invoice Template for 2026",
        body: "Creating a GST-compliant invoice from scratch every time is tedious and error-prone. DoAide Invoicer provides a free, ready-to-use GST invoice template that includes every mandatory field for 2026 — GSTIN validation, HSN/SAC codes, automatic CGST/SGST/IGST calculation based on place of supply, sequential invoice numbering, and instant PDF generation. No signup required. Choose the GST Compliant template, fill in your details, and download a legally valid invoice in 30 seconds. You can also use our Invoice Validator tool to check any existing invoice against the latest GST format requirements.",
        cta: { text: "Download Free GST Invoice Template", to: "/create?template=gst-compliant" },
      },
    ],
  },
  "e-invoicing-under-gst-requirements": {
    faqs: [
      { q: "What is e-invoicing under GST?", a: "E-invoicing under GST is a system where B2B invoices are electronically authenticated by the Invoice Registration Portal (IRP). The portal assigns a unique Invoice Reference Number (IRN), digitally signs the invoice using the GST system's certificate, and generates a QR code. It does not mean generating invoices on a government portal — you create invoices in your own software, then report them to the IRP for validation." },
      { q: "Who is required to generate e-invoices in 2026?", a: "As of 2026, all GST-registered businesses with aggregate turnover exceeding ₹5 crore in any financial year from 2017-18 onwards are required to generate e-invoices for all B2B supplies, exports, and supplies to SEZ. Certain categories like banking, insurance, and SEZ units are exempt." },
      { q: "What is an IRN (Invoice Reference Number)?", a: "An IRN is a unique 64-character hash generated by the Invoice Registration Portal for each e-invoice. It is computed from the supplier's GSTIN, document type, document number, and financial year. The IRN serves as the unique identity of the invoice in the GST system and is used for de-duplication and verification." },
      { q: "Can I cancel an e-invoice after generation?", a: "Yes, an e-invoice can be cancelled on the IRP within 24 hours of generation. After 24 hours, you cannot cancel the IRN on the portal — you must issue a credit note against the original invoice and report it in your GSTR-1. The cancellation reason must be recorded." },
      { q: "What are the penalties for not generating e-invoices?", a: "Non-compliance with e-invoicing requirements results in the invoice being treated as if it was never issued. The recipient cannot claim ITC, and the supplier faces a penalty of up to ₹25,000 per invoice under Section 122 of the CGST Act. Additionally, non-compliant invoices will not be auto-populated in GSTR-1, requiring manual rectification." },
    ],
    sections: [
      {
        heading: "What is E-Invoicing Under GST?",
        body: "E-invoicing, or electronic invoicing under India's Goods and Services Tax system, is a mechanism where business-to-business (B2B) invoices are electronically validated and authenticated by the government's Invoice Registration Portal (IRP). Contrary to a common misconception, e-invoicing does not mean creating invoices on a government website. Businesses continue to generate invoices using their own accounting software, ERP systems, or invoicing tools. The invoices are then reported to the IRP, which validates the data, assigns a unique Invoice Reference Number (IRN), digitally signs the document, and returns a QR code. This system was introduced to curb tax evasion, enable real-time tax reporting, automate return filing, and create an interoperable invoicing standard across India's diverse business ecosystem.",
      },
      {
        heading: "Who Must Comply: E-Invoicing Turnover Thresholds",
        body: "The government has progressively expanded the e-invoicing mandate since its launch in October 2020. The turnover thresholds have been reduced in phases to bring more businesses under the compliance net:",
        list: [
          "October 2020 — businesses with turnover above ₹500 crore",
          "January 2021 — threshold lowered to ₹100 crore",
          "April 2021 — threshold lowered to ₹50 crore",
          "April 2022 — threshold lowered to ₹20 crore",
          "October 2022 — threshold lowered to ₹10 crore",
          "August 2023 — threshold lowered to ₹5 crore (current as of 2026)",
          "The aggregate turnover is calculated across all GSTINs under a single PAN, and includes all financial years from 2017-18 onwards — once you cross the threshold in any year, e-invoicing is permanently mandatory",
        ],
      },
      {
        heading: "Exempt Categories: Who Doesn't Need E-Invoices",
        body: "While the mandate is broad, certain categories of registered persons are exempt from e-invoicing requirements:",
        list: [
          "Banking companies, financial institutions, and NBFCs",
          "Insurance companies and insurance intermediaries",
          "Goods Transport Agencies (GTAs)",
          "Registered persons supplying passenger transportation services",
          "Suppliers of cinematograph films to multiplex screens",
          "SEZ units (not SEZ developers — developers must comply)",
          "Government departments and local authorities",
          "Persons registered under Section 14 of the IGST Act (UN bodies and diplomatic missions)",
        ],
      },
      {
        heading: "The E-Invoice Generation Process: Step by Step",
        body: "Understanding the technical flow of e-invoice generation helps you set up your systems correctly. The process involves your invoicing software, the IRP, and the GST portal:",
        list: [
          "Step 1 — Generate the invoice in your accounting/ERP/invoicing software with all mandatory GST fields (supplier GSTIN, recipient GSTIN, HSN/SAC codes, tax breakdowns, place of supply)",
          "Step 2 — Your software converts the invoice into the prescribed JSON schema (version 1.1 as of 2026) and sends it to the IRP via API",
          "Step 3 — The IRP validates the invoice data — checks for duplicate IRNs, validates GSTINs against the GST database, and verifies the JSON structure",
          "Step 4 — If valid, the IRP generates a unique 64-character IRN (hash of GSTIN + invoice number + financial year + document type), digitally signs the invoice, and generates a QR code",
          "Step 5 — The signed invoice with IRN and QR code is returned to your software and simultaneously forwarded to the GST portal for auto-population of GSTR-1",
          "Step 6 — The recipient's GSTR-2B is also auto-populated, enabling seamless ITC matching",
        ],
      },
      {
        heading: "E-Invoice JSON Schema and Technical Requirements",
        body: "The e-invoice JSON schema defines the exact structure your invoicing software must follow when reporting to the IRP. The schema includes mandatory and optional fields grouped into sections: transaction details, document period, supplier information, recipient information, item details, value details, and payment instructions. Your software must use the NIC (National Informatics Centre) API endpoints — the production URL is einvoice1.gst.gov.in. Authentication requires your GSTIN-linked credentials, and API calls use OAuth 2.0 tokens with a 1-hour expiry. Each API call can report one invoice at a time, though bulk generation is supported through batch endpoints. The IRP enforces a rate limit, so high-volume businesses should implement queuing in their integration. For businesses using simple invoicing tools like DoAide Invoicer, the generated PDF serves as your invoice record — you then report the data to the IRP through your GST software or an e-invoicing service.",
      },
      {
        heading: "QR Code Requirements for E-Invoices",
        body: "Every e-invoice generated through the IRP includes a QR code that contains essential invoice parameters for quick verification. The QR code encodes the supplier's GSTIN, recipient's GSTIN, invoice number, date of generation, invoice value, number of line items, HSN code of the main item, and a unique IRN hash. For B2C invoices by notified businesses (those required to issue dynamic QR codes), the QR code must additionally contain a UPI-compatible payment link. This allows customers to scan the QR code and make payment directly. The QR code must be printed on the physical invoice and included in the PDF version. Tax officers can scan the code using the GST Verify App to instantly validate the invoice against IRP records.",
      },
      {
        heading: "Consequences of Non-Compliance",
        body: "The penalties for failing to comply with e-invoicing requirements are substantial and affect both the supplier and the recipient:",
        list: [
          "Invalid invoice — an invoice without IRN is treated as if it was never issued. The supplier's GSTR-1 will not auto-populate, requiring manual entry and reconciliation",
          "ITC denial for the recipient — buyers cannot claim Input Tax Credit on invoices that lack a valid IRN, increasing their effective cost",
          "Penalty under Section 122 — suppliers face a penalty of up to ₹25,000 per invoice for issuing invoices that do not comply with e-invoicing requirements",
          "Penalty under Section 125 — a general penalty of up to ₹25,000 for contravention of any GST provision, which can be applied in addition to Section 122 penalties",
          "GSTR-1/GSTR-3B mismatch — non-e-invoiced transactions create discrepancies in return filing, which trigger automated notices from the GST portal",
          "Audit red flags — systematic non-compliance with e-invoicing is a primary trigger for GST department audits and assessments",
        ],
      },
      {
        heading: "How to Get Started with E-Invoice Compliance",
        body: "If your business has crossed the ₹5 crore turnover threshold, start by reviewing your current invoicing process. Ensure every invoice includes all mandatory GST fields — GSTIN, HSN/SAC codes, place of supply, and proper tax breakdowns. Use a GST-compliant invoicing tool to generate correctly formatted invoices, then integrate with an e-invoicing solution or your CA's software for IRP reporting. DoAide Invoicer's GST Compliant template ensures your invoice data has every field the IRP requires, making the e-invoice reporting step seamless. You can also use our Invoice Validator to check your existing invoices against the latest format requirements before reporting them.",
        cta: { text: "Generate E-Invoice-Ready Invoice", to: "/create?template=gst-compliant" },
      },
    ],
  },
  "proforma-invoice-vs-tax-invoice": {
    faqs: [
      { q: "Is a proforma invoice legally binding in India?", a: "No, a proforma invoice is not legally binding. It is a preliminary document used as a quotation or estimate. It does not create a payment obligation, cannot be used for GST filing or ITC claims, and has no legal validity under the CGST Act. Only a tax invoice issued after the actual supply creates a legal obligation." },
      { q: "Can I claim Input Tax Credit on a proforma invoice?", a: "No. Input Tax Credit (ITC) can only be claimed on a valid tax invoice or debit note issued by a GST-registered supplier. Proforma invoices are not recognised as valid documents for ITC claims under Section 16 of the CGST Act. You must obtain a proper tax invoice after the supply is completed." },
      { q: "When should I use a proforma invoice instead of a tax invoice?", a: "Use a proforma invoice when you need to provide a price estimate, quotation, or preliminary cost breakdown before the actual supply. Common use cases include pre-sale quotations, customs declarations for imports, advance payment requests, and inter-company approvals. Issue the tax invoice only when the goods are delivered or services are completed." },
      { q: "Does a proforma invoice need a GSTIN?", a: "A proforma invoice does not legally require a GSTIN since it is not a document recognised under GST law. However, including your GSTIN on a proforma invoice is considered good practice as it helps the recipient verify your registration status and prepares the groundwork for the final tax invoice." },
      { q: "Can a proforma invoice be converted to a tax invoice?", a: "A proforma invoice itself cannot be 'converted' — it must be replaced by a new tax invoice that meets all GST requirements. The tax invoice should have its own unique sequential number and include all mandatory fields. It is common practice to reference the proforma invoice number on the tax invoice for the client's records." },
    ],
    sections: [
      {
        heading: "What is a Proforma Invoice?",
        body: "A proforma invoice is a preliminary document sent by a seller to a buyer before the actual supply of goods or services takes place. The word 'proforma' comes from Latin, meaning 'for the sake of form' — and that accurately describes its purpose. It provides a detailed estimate of the transaction, including item descriptions, quantities, unit prices, expected taxes, and total cost. Think of it as a formal quotation dressed in invoice format. Indian businesses commonly use proforma invoices when responding to RFQs (Request for Quotation), negotiating with new clients, applying for import licences, requesting advance payments, or seeking internal procurement approvals. Unlike a tax invoice, a proforma invoice does not trigger a payment obligation, is not reported to the GST portal, and cannot be used for Input Tax Credit claims.",
      },
      {
        heading: "What is a Tax Invoice Under GST?",
        body: "A tax invoice is a legally mandated document issued by a GST-registered business when taxable goods are delivered or services are rendered. It is the most important document in the GST ecosystem because it serves as the basis for tax collection, ITC claims, return filing, and compliance verification. Under Section 31 of the CGST Act, a tax invoice must be issued at or before the time of supply. For goods, this means at or before the time of removal or delivery. For services, it must be issued within 30 days of the service being provided. A valid tax invoice contains all mandatory GST fields — supplier and recipient GSTIN, HSN/SAC codes, itemised tax breakdowns (CGST, SGST, or IGST), place of supply, and the supplier's signature. Without a valid tax invoice, the recipient cannot claim ITC, and the supplier's GSTR-1 filing will be incomplete.",
      },
      {
        heading: "Key Differences: Proforma Invoice vs Tax Invoice",
        body: "Understanding the fundamental differences between these two documents is essential for correct GST compliance and financial planning. Here is a comprehensive comparison:",
        list: [
          "Legal status — a tax invoice is a legally binding document required under the CGST Act; a proforma invoice has no legal validity under GST law and creates no payment obligation",
          "When issued — a tax invoice is issued at or before the time of supply (delivery of goods or completion of services); a proforma invoice is issued before any supply takes place, during the negotiation or quotation stage",
          "GST compliance — a tax invoice must include all mandatory GST fields (GSTIN, HSN/SAC, tax breakdowns, place of supply); a proforma invoice has no prescribed format under GST law",
          "Input Tax Credit — only a tax invoice (or debit note) allows the buyer to claim ITC; a proforma invoice cannot be used for ITC claims under any circumstances",
          "GST return filing — tax invoices are reported in GSTR-1 and auto-populated in the recipient's GSTR-2B; proforma invoices are not reported in any GST return",
          "Invoice numbering — tax invoices must follow unique, sequential numbering within a financial year (max 16 characters); proforma invoices can use any numbering system",
          "Payment obligation — a tax invoice creates a legal obligation for the buyer to pay the stated amount; a proforma invoice is merely an estimate and the final amount may change",
          "E-invoicing — tax invoices must be reported to the IRP for businesses above the ₹5 crore threshold; proforma invoices are never reported to the IRP",
          "Accounting treatment — tax invoices are recorded as revenue and accounts receivable; proforma invoices are not recorded as revenue until a tax invoice is issued",
        ],
      },
      {
        heading: "When Indian Businesses Should Use Each Document",
        body: "Choosing the right document at the right stage of a transaction is critical for compliance and professionalism. Here are the most common scenarios:",
        list: [
          "Pre-sale quotation — use a proforma invoice when responding to a client's inquiry with a detailed price estimate, especially when the scope may change during negotiation",
          "Import and export — a proforma invoice is required by customs authorities and banks for import licence applications, letter of credit (LC) opening, and foreign exchange approvals",
          "Advance payment request — send a proforma invoice when requesting a deposit or advance before starting work. Issue the tax invoice when the full supply is completed",
          "Internal approvals — large organisations require a proforma invoice for purchase order approval before vendors can issue the final tax invoice",
          "Actual supply of goods — issue a tax invoice at or before the time of delivery. This is mandatory for every taxable supply",
          "Service completion — issue a tax invoice within 30 days of completing the service. For continuous supply of services, issue invoices based on the payment schedule or due date, whichever is earlier",
          "Recurring supplies — for ongoing contracts, issue a tax invoice for each supply or billing period. A proforma invoice at the start of the contract helps set expectations but does not replace periodic tax invoices",
        ],
      },
      {
        heading: "Common Mistakes Indian Businesses Make",
        body: "Confusion between proforma and tax invoices leads to costly compliance errors. These are the most common mistakes and how to avoid them:",
        list: [
          "Using a proforma invoice as a tax invoice — some businesses send a proforma invoice and never follow up with a tax invoice, which means GST is not properly collected or reported",
          "Claiming ITC on proforma invoices — buyers sometimes submit proforma invoices for ITC claims, which will be rejected and may trigger an audit",
          "Labelling a tax invoice as 'proforma' — marking a valid tax invoice as proforma to delay GST reporting is a compliance violation",
          "Not issuing a tax invoice after receiving advance payment — if you receive payment against a proforma invoice, you must issue a receipt voucher (and eventually a tax invoice) to comply with GST rules",
          "Using the same number series for both — proforma and tax invoices should use distinct number series to avoid confusion in bookkeeping and GST filing",
          "Sending proforma invoices to GST portal — proforma invoices should never be uploaded to GSTR-1 or reported to the IRP. Only tax invoices, credit notes, and debit notes are reported",
        ],
      },
      {
        heading: "How GST Applies to Proforma Invoices",
        body: "Since a proforma invoice is not a recognised document under GST law, it has a unique relationship with the GST system. You can include estimated GST amounts on a proforma invoice for transparency — this helps the buyer understand the total expected cost — but this does not constitute actual tax collection. GST is only collected through a tax invoice. If a buyer makes an advance payment based on a proforma invoice, the supplier must issue a receipt voucher at the time of receiving the advance and account for GST on the advance amount. The tax invoice is then issued at the time of actual supply, and the advance is adjusted against it. For exports, a proforma invoice is used to obtain foreign exchange approvals from banks, but the actual export invoice (with IGST at 0% or under LUT) is the compliance document.",
      },
      {
        heading: "Create Both Types of Invoices with DoAide Invoicer",
        body: "Whether you need a proforma invoice for a quotation or a GST-compliant tax invoice for a completed supply, DoAide Invoicer has you covered. Use the Standard or Professional template for proforma invoices — simply label the document as 'Proforma Invoice' in the title field. For tax invoices, use the GST Compliant template with all mandatory fields pre-configured — GSTIN, HSN/SAC codes, place of supply, and automatic CGST/SGST/IGST calculation. Both are free, require no signup, and generate professional PDFs in 30 seconds. You can also use our Invoice Validator to verify that your tax invoices meet all GST format requirements before sending them.",
        cta: { text: "Create Your Invoice Now", to: "/create" },
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

  const faqs = content.faqs || [];

  return (
    <div className="min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            url: pageUrl,
            author: { "@type": "Organization", name: "Apprend Technologies", url: "https://doaide.com" },
            publisher: { "@type": "Organization", name: "DoAide Invoicer", url: "https://invoicer.doaide.com", logo: { "@type": "ImageObject", url: "https://invoicer.doaide.com/logo.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          }),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            }),
          }}
        />
      )}
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

        {faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl text-ink-strong mb-5">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="panel group">
                  <summary className="cursor-pointer font-display text-lg text-ink-strong group-open:text-brand transition-colors list-none flex items-start gap-2">
                    <span className="text-brand mt-0.5 flex-shrink-0 transition-transform group-open:rotate-90">&#9654;</span>
                    <span>{faq.q}</span>
                  </summary>
                  <p className="text-sm text-ink-soft leading-relaxed mt-3 ml-6">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

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
