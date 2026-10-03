import { useState } from "react";
import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const STANDARD_TERMS = [
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 45", days: 45 },
  { label: "Net 60", days: 60 },
  { label: "Net 90", days: 90 },
  { label: "Due on Receipt", days: 0 },
];

export default function PaymentTermsPage() {
  usePageTitle("Payment Terms Calculator");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [netDays, setNetDays] = useState(30);
  const [amount, setAmount] = useState("10000");
  const [discountPercent, setDiscountPercent] = useState("2");
  const [discountDays, setDiscountDays] = useState("10");

  const amtVal = parseFloat(amount) || 0;
  const discPct = parseFloat(discountPercent) || 0;
  const discDys = parseInt(discountDays, 10) || 0;

  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + netDays);

  const earlyDate = new Date(invoiceDate);
  earlyDate.setDate(earlyDate.getDate() + discDys);

  const discountAmount = amtVal * (discPct / 100);
  const earlyPayAmount = amtVal - discountAmount;

  const annualizedRate = discDys < netDays && discPct > 0
    ? ((discPct / (100 - discPct)) * (365 / (netDays - discDys)) * 100)
    : 0;

  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const shareWhatsApp = () => {
    const text = `Payment Terms: Net ${netDays}\nInvoice: ₹${amtVal.toLocaleString()}\nDue: ${fmt(dueDate)}\nEarly Pay (${discPct}/${discDys}): ₹${earlyPayAmount.toLocaleString()} by ${fmt(earlyDate)}\n\nCalculated with DoAide Invoicer — https://invoicer.doaide.com/tools/payment-terms`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const shareTwitter = () => {
    const text = `Net ${netDays} payment = due ${fmt(dueDate)}. Early pay discount: ${discPct}% off if paid by ${fmt(earlyDate)}.\n\nFree calculator: https://invoicer.doaide.com/tools/payment-terms`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Payment Terms Calculator</h1>
          <p className="tool-subtitle">
            Calculate due dates, early payment discounts, and annualized savings — no sign-up required.
          </p>

          <div className="panel">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <label className="calc-label">
                Invoice Date
                <input type="date" className="input-field" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </label>
              <label className="calc-label">
                Payment Terms
                <select className="input-field" value={netDays} onChange={(e) => setNetDays(Number(e.target.value))}>
                  {STANDARD_TERMS.map((t) => <option key={t.days} value={t.days}>{t.label}</option>)}
                </select>
              </label>
              <label className="calc-label">
                Invoice Amount (₹)
                <input type="number" className="input-field" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" />
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <label className="calc-label">
                Early Pay Discount (%)
                <input type="number" className="input-field" min={0} max={100} step="0.5" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
              </label>
              <label className="calc-label">
                Discount if Paid Within (days)
                <input type="number" className="input-field" min={0} value={discountDays} onChange={(e) => setDiscountDays(e.target.value)} />
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
            <div className="stat-card tone-brand">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Due Date</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{fmt(dueDate)}</div>
            </div>
            <div className="stat-card tone-good">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Early Pay By</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{fmt(earlyDate)}</div>
            </div>
            <div className="stat-card tone-good">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>You Save</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{"₹"}{discountAmount.toLocaleString()}</div>
            </div>
            <div className="stat-card tone-warn">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Annualized Rate</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{annualizedRate.toFixed(1)}%</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp">Share on WhatsApp</button>
            <button type="button" onClick={shareTwitter} className="btn btn-ghost">Share on Twitter</button>
          </div>

          <div className="panel" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>Want to set payment terms on real invoices?</p>
            <Link to="/create" className="btn btn-primary">Create Free Invoice</Link>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Payment Terms Calculator",
            description: "Calculate due dates and early payment discounts for invoices.",
            url: "https://invoicer.doaide.com/tools/payment-terms",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: { "@type": "Organization", name: "Apprend Technologies", url: "https://doaide.com" },
          }),
        }}
      />
    </div>
  );
}
