import { useState } from "react";
import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const VALID_TAX_RATES = [0, 0.1, 0.25, 3, 5, 12, 18, 28];

function validateGSTIN(gstin) {
  if (!gstin) return { valid: false, message: "GSTIN is required for GST invoices" };
  if (gstin.length !== 15) return { valid: false, message: `GSTIN must be 15 characters (got ${gstin.length})` };
  const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!pattern.test(gstin)) return { valid: false, message: "Invalid GSTIN format. Expected: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 check character" };
  const stateCode = parseInt(gstin.slice(0, 2), 10);
  if (stateCode < 1 || stateCode > 37) return { valid: false, message: `Invalid state code: ${gstin.slice(0, 2)}. Must be between 01 and 37` };
  return { valid: true, message: "Valid GSTIN format" };
}

function validateHSN(hsn) {
  if (!hsn) return { valid: false, message: "HSN/SAC code is required" };
  const clean = hsn.replace(/\s/g, "");
  if (!/^\d+$/.test(clean)) return { valid: false, message: "HSN/SAC must contain only digits" };
  if (clean.length < 2 || clean.length > 8) return { valid: false, message: `HSN/SAC must be 2-8 digits (got ${clean.length})` };
  return { valid: true, message: `Valid ${clean.length}-digit HSN/SAC code` };
}

function validateInvoiceNumber(num) {
  if (!num || !num.trim()) return { valid: false, message: "Invoice number is required" };
  if (num.length > 16) return { valid: false, message: `Invoice number exceeds 16 characters (got ${num.length})` };
  if (!/^[A-Za-z0-9/\-]+$/.test(num)) return { valid: false, message: "Only alphanumeric characters, hyphens, and slashes are allowed" };
  return { valid: true, message: "Valid invoice number format" };
}

function validateDate(dateStr) {
  if (!dateStr) return { valid: false, message: "Invoice date is required" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { valid: false, message: "Invalid date format" };
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (d > today) return { valid: false, message: "Invoice date cannot be in the future" };
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  if (d < oneYearAgo) return { valid: false, message: "Invoice date is more than 1 year old — verify if intended" };
  return { valid: true, message: "Valid invoice date" };
}

function validateTaxRate(rate) {
  const r = parseFloat(rate);
  if (isNaN(r)) return { valid: false, message: "Tax rate is required" };
  if (VALID_TAX_RATES.includes(r)) return { valid: true, message: `${r}% is a valid GST rate` };
  return { valid: false, message: `${r}% is not a standard GST rate. Valid rates: ${VALID_TAX_RATES.join("%, ")}%` };
}

function validateTaxAmount(taxableAmt, taxRate, declaredTax) {
  const taxable = parseFloat(taxableAmt) || 0;
  const rate = parseFloat(taxRate) || 0;
  const declared = parseFloat(declaredTax) || 0;
  if (taxable <= 0) return { valid: false, message: "Taxable amount must be greater than zero" };
  const expected = taxable * (rate / 100);
  const diff = Math.abs(expected - declared);
  if (diff > 1) return { valid: false, message: `Expected tax: ₹${expected.toFixed(2)}, declared: ₹${declared.toFixed(2)} (difference: ₹${diff.toFixed(2)})` };
  return { valid: true, message: `Tax amount matches: ₹${declared.toFixed(2)}` };
}

const EMPTY_ITEM = { description: "", hsn: "", amount: "", taxRate: "18", taxAmount: "" };

const FAQ_ITEMS = [
  {
    q: "What fields are mandatory on a GST invoice?",
    a: "A GST invoice must include: supplier name & GSTIN, invoice number & date, buyer name & address (GSTIN if registered), HSN/SAC code, item description, quantity, taxable value, tax rate & amount (CGST+SGST or IGST), and total value.",
  },
  {
    q: "What is the GSTIN format?",
    a: "GSTIN is a 15-character alphanumeric code: first 2 digits are state code (01-37), next 10 characters are PAN, 13th character is entity number, 14th is 'Z' by default, and 15th is a check digit.",
  },
  {
    q: "What are the valid GST tax rates in India?",
    a: "The standard GST rates are 0%, 0.1%, 0.25%, 3%, 5%, 12%, 18%, and 28%. Most goods and services fall under 5%, 12%, 18%, or 28%. The 0.1% and 0.25% rates apply to specific items like rough diamonds and cut stones.",
  },
  {
    q: "Can the invoice date be a future date?",
    a: "No. As per GST rules, a tax invoice must be issued at or before the time of supply. A future-dated invoice is not valid and can be rejected during input tax credit claims.",
  },
  {
    q: "What happens if my invoice fails validation?",
    a: "An invalid invoice may lead to rejection of Input Tax Credit (ITC) claims by the buyer, penalties during GST audit, and issues during GST return filing. Always ensure your invoices meet all format requirements.",
  },
  {
    q: "Is HSN/SAC code mandatory on GST invoices?",
    a: "Yes. Businesses with turnover above ₹5 crore must mention 6-digit HSN/SAC codes. Businesses with turnover between ₹1.5 crore and ₹5 crore need 4-digit codes. Below ₹1.5 crore, HSN is optional for B2B invoices but recommended.",
  },
];

export default function InvoiceValidatorPage() {
  usePageTitle("GST Invoice Validator — Free Compliance Check");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [sellerGstin, setSellerGstin] = useState("");
  const [buyerGstin, setBuyerGstin] = useState("");
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [validated, setValidated] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const updateItem = (i, k, v) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  };
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i) => setItems((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const runValidation = () => setValidated(true);
  const resetForm = () => {
    setValidated(false);
    setInvoiceNumber("");
    setInvoiceDate(new Date().toISOString().slice(0, 10));
    setSellerGstin("");
    setBuyerGstin("");
    setItems([{ ...EMPTY_ITEM }]);
  };

  const checks = validated ? [
    { label: "Invoice Number", ...validateInvoiceNumber(invoiceNumber) },
    { label: "Invoice Date", ...validateDate(invoiceDate) },
    { label: "Seller GSTIN", ...validateGSTIN(sellerGstin) },
    ...(buyerGstin ? [{ label: "Buyer GSTIN", ...validateGSTIN(buyerGstin) }] : []),
    ...items.flatMap((item, i) => [
      { label: `Item ${i + 1} HSN/SAC`, ...validateHSN(item.hsn) },
      { label: `Item ${i + 1} Tax Rate`, ...validateTaxRate(item.taxRate) },
      { label: `Item ${i + 1} Tax Amount`, ...validateTaxAmount(item.amount, item.taxRate, item.taxAmount) },
    ]),
  ] : [];

  const passCount = checks.filter((c) => c.valid).length;
  const failCount = checks.filter((c) => !c.valid).length;
  const score = checks.length > 0 ? Math.round((passCount / checks.length) * 100) : 0;

  const shareWhatsApp = () => {
    const text = `GST Invoice Validation Result\n\nInvoice: ${invoiceNumber || "N/A"}\nScore: ${score}% (${passCount} passed, ${failCount} failed)\n\n${checks.map((c) => `${c.valid ? "✅" : "❌"} ${c.label}: ${c.message}`).join("\n")}\n\nValidated with DoAide Invoicer — https://invoicer.doaide.com/tools/invoice-validator`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">GST Invoice Validator</h1>
          <p className="tool-subtitle">
            Check if your invoice meets GST compliance requirements — validate GSTIN, HSN codes, tax rates, and mandatory fields instantly.
          </p>

          <div className="panel">
            <h3 style={{ fontWeight: 600, color: "var(--ink-strong)", marginBottom: "0.75rem", fontSize: "1rem" }}>
              Invoice Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <label className="calc-label">
                Invoice Number
                <input className="input-field" value={invoiceNumber} onChange={(e) => { setInvoiceNumber(e.target.value); setValidated(false); }} placeholder="INV-2026-001" />
              </label>
              <label className="calc-label">
                Invoice Date
                <input type="date" className="input-field" value={invoiceDate} onChange={(e) => { setInvoiceDate(e.target.value); setValidated(false); }} />
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              <label className="calc-label">
                Seller GSTIN *
                <input className="input-field" value={sellerGstin} onChange={(e) => { setSellerGstin(e.target.value.toUpperCase()); setValidated(false); }} placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </label>
              <label className="calc-label">
                Buyer GSTIN (optional)
                <input className="input-field" value={buyerGstin} onChange={(e) => { setBuyerGstin(e.target.value.toUpperCase()); setValidated(false); }} placeholder="27BBBBB0000B1Z3" maxLength={15} />
              </label>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ fontWeight: 600, color: "var(--ink-strong)", marginBottom: "0.75rem", fontSize: "1rem" }}>
              Line Items
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item, i) => (
                <div key={i} style={{ padding: "1rem", border: "1px solid var(--line)", borderRadius: "var(--radius)", background: "var(--canvas)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-soft)" }}>Item {i + 1}</span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => { removeItem(i); setValidated(false); }} className="text-bad hover:text-red-400 bg-transparent border-0 cursor-pointer" style={{ fontSize: "1.25rem", lineHeight: 1, minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
                    <label className="calc-label">
                      Description
                      <input className="input-field" value={item.description} onChange={(e) => { updateItem(i, "description", e.target.value); setValidated(false); }} placeholder="Service or product" />
                    </label>
                    <label className="calc-label">
                      HSN/SAC Code
                      <input className="input-field" value={item.hsn} onChange={(e) => { updateItem(i, "hsn", e.target.value); setValidated(false); }} placeholder="9983" maxLength={8} />
                    </label>
                    <label className="calc-label">
                      Taxable Amt (₹)
                      <input type="number" className="input-field" min={0} step="0.01" value={item.amount} onChange={(e) => { updateItem(i, "amount", e.target.value); setValidated(false); }} placeholder="10000" />
                    </label>
                    <label className="calc-label">
                      Tax Rate (%)
                      <select className="input-field" value={item.taxRate} onChange={(e) => { updateItem(i, "taxRate", e.target.value); setValidated(false); }}>
                        {VALID_TAX_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </label>
                    <label className="calc-label">
                      Tax Amount (₹)
                      <input type="number" className="input-field" min={0} step="0.01" value={item.taxAmount} onChange={(e) => { updateItem(i, "taxAmount", e.target.value); setValidated(false); }} placeholder="1800" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => { addItem(); setValidated(false); }} className="btn btn-ghost" style={{ marginTop: "0.75rem", minHeight: "44px" }}>
              + Add Item
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={runValidation} className="btn btn-primary" style={{ minHeight: "44px", minWidth: "200px" }}>
              Validate Invoice
            </button>
            {validated && (
              <button type="button" onClick={resetForm} className="btn btn-ghost" style={{ minHeight: "44px" }}>
                Reset
              </button>
            )}
          </div>

          {validated && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
                <div className={`stat-card ${score === 100 ? "tone-good" : score >= 70 ? "tone-warn" : "tone-bad"}`}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-muted)" }}>Compliance Score</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: score === 100 ? "var(--good)" : score >= 70 ? "var(--warn)" : "var(--bad)" }}>{score}%</div>
                </div>
                <div className="stat-card tone-good">
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-muted)" }}>Passed</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--good)" }}>{passCount}</div>
                </div>
                <div className="stat-card tone-bad">
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-muted)" }}>Failed</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: failCount > 0 ? "var(--bad)" : "var(--ink-muted)" }}>{failCount}</div>
                </div>
              </div>

              <div className="panel">
                <h3 style={{ fontWeight: 600, color: "var(--ink-strong)", marginBottom: "0.75rem", fontSize: "1rem" }}>
                  Validation Results
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {checks.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius)",
                        background: c.valid ? "var(--good-bg)" : "var(--bad-bg)",
                        border: `1px solid ${c.valid ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                      }}
                    >
                      <span style={{ flexShrink: 0, fontSize: "1rem", marginTop: "1px" }}>{c.valid ? "✅" : "❌"}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--ink-strong)" }}>{c.label}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--ink-soft)", marginTop: "2px" }}>{c.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp" style={{ minHeight: "44px" }}>
                  Share Results on WhatsApp
                </button>
              </div>
            </>
          )}

          <div className="panel" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--ink-soft)" }}>
              Need a compliant invoice? Create one that passes all GST checks automatically.
            </p>
            <Link to="/create" className="btn btn-primary" style={{ minHeight: "44px" }}>
              Create Free Invoice
            </Link>
          </div>

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: "1.25rem", marginBottom: "1rem" }}>
              Frequently Asked Questions
            </h2>
            <dl style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="panel" style={{ marginBottom: 0, padding: 0 }}>
                  <dt>
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-ink-strong hover:bg-surface-hover transition-colors"
                      style={{ minHeight: "44px", background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-strong)", fontFamily: "inherit" }}
                      aria-expanded={openFaq === i}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      {item.q}
                      <span style={{ marginLeft: "0.75rem", flexShrink: 0, color: "var(--ink-muted)" }} aria-hidden="true">
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                  </dt>
                  {openFaq === i && (
                    <dd style={{ padding: "0 1.25rem 1rem", fontSize: "0.875rem", color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>
                      {item.a}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "GST Invoice Validator",
            description: "Validate your invoices against GST compliance rules. Check GSTIN format, HSN codes, tax rates, and mandatory fields instantly.",
            url: "https://invoicer.doaide.com/tools/invoice-validator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: { "@type": "Organization", name: "Apprend Technologies", url: "https://doaide.com" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
    </div>
  );
}
