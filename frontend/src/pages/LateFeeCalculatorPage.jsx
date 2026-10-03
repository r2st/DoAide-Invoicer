import { useState } from "react";
import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const METHODS = [
  { id: "flat", label: "Flat Fee" },
  { id: "percent", label: "% of Invoice" },
  { id: "daily", label: "Daily Interest" },
  { id: "monthly", label: "Monthly Interest" },
];

export default function LateFeeCalculatorPage() {
  usePageTitle("Late Fee Calculator");
  const [invoiceAmount, setInvoiceAmount] = useState("50000");
  const [dueDate, setDueDate] = useState("2026-09-01");
  const [payDate, setPayDate] = useState("2026-10-03");
  const [method, setMethod] = useState("percent");
  const [flatFee, setFlatFee] = useState("500");
  const [percentRate, setPercentRate] = useState("2");
  const [dailyRate, setDailyRate] = useState("0.05");
  const [monthlyRate, setMonthlyRate] = useState("1.5");

  const amount = parseFloat(invoiceAmount) || 0;
  const due = new Date(dueDate);
  const paid = new Date(payDate);
  const daysLate = Math.max(0, Math.floor((paid - due) / 86400000));
  const monthsLate = Math.max(0, Math.ceil(daysLate / 30));

  let lateFee = 0;
  let description = "";
  if (daysLate > 0) {
    switch (method) {
      case "flat":
        lateFee = parseFloat(flatFee) || 0;
        description = `Flat fee of ₹${lateFee.toLocaleString()}`;
        break;
      case "percent":
        lateFee = amount * ((parseFloat(percentRate) || 0) / 100);
        description = `${percentRate}% of invoice amount`;
        break;
      case "daily":
        lateFee = amount * ((parseFloat(dailyRate) || 0) / 100) * daysLate;
        description = `${dailyRate}% per day × ${daysLate} days`;
        break;
      case "monthly":
        lateFee = amount * ((parseFloat(monthlyRate) || 0) / 100) * monthsLate;
        description = `${monthlyRate}% per month × ${monthsLate} month${monthsLate !== 1 ? "s" : ""}`;
        break;
    }
  }

  const totalDue = amount + lateFee;

  const shareWhatsApp = () => {
    const text = `Late Fee Calculation:\nInvoice: ₹${amount.toLocaleString()}\nDays Late: ${daysLate}\nLate Fee: ₹${lateFee.toLocaleString()}\nTotal Due: ₹${totalDue.toLocaleString()}\n\nFree calculator: https://invoicer.doaide.com/tools/late-fee`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const shareTwitter = () => {
    const text = `₹${amount.toLocaleString()} invoice, ${daysLate} days late = ₹${lateFee.toLocaleString()} penalty. Total: ₹${totalDue.toLocaleString()}\n\nFree late fee calculator: https://invoicer.doaide.com/tools/late-fee`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Late Fee Calculator</h1>
          <p className="tool-subtitle">
            Calculate late payment penalties using flat fees, percentage, or daily/monthly interest — no sign-up required.
          </p>

          <div className="panel">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <label className="calc-label">
                Invoice Amount (₹)
                <input type="number" className="input-field" min={0} value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} />
              </label>
              <label className="calc-label">
                Due Date
                <input type="date" className="input-field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </label>
              <label className="calc-label">
                Payment Date
                <input type="date" className="input-field" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
              </label>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label className="calc-label">Penalty Method</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {METHODS.map((m) => (
                  <button key={m.id} onClick={() => setMethod(m.id)} className={`btn ${method === m.id ? "btn-primary" : "btn-ghost"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              {method === "flat" && (
                <label className="calc-label">Flat Fee (₹)<input type="number" className="input-field" min={0} value={flatFee} onChange={(e) => setFlatFee(e.target.value)} /></label>
              )}
              {method === "percent" && (
                <label className="calc-label">Percentage (%)<input type="number" className="input-field" min={0} max={100} step="0.5" value={percentRate} onChange={(e) => setPercentRate(e.target.value)} /></label>
              )}
              {method === "daily" && (
                <label className="calc-label">Daily Interest Rate (%)<input type="number" className="input-field" min={0} step="0.01" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} /></label>
              )}
              {method === "monthly" && (
                <label className="calc-label">Monthly Interest Rate (%)<input type="number" className="input-field" min={0} step="0.1" value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} /></label>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
            <div className="stat-card tone-warn">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Days Late</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{daysLate}</div>
            </div>
            <div className="stat-card tone-bad">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Late Fee</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{"₹"}{lateFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-card tone-brand">
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Due</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{"₹"}{totalDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          {daysLate > 0 && description && (
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--ink-soft)" }}>Method: {description}</p>
          )}

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp">Share on WhatsApp</button>
            <button type="button" onClick={shareTwitter} className="btn btn-ghost">Share on Twitter</button>
          </div>

          <div className="panel" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>Want to auto-calculate late fees on your invoices?</p>
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
            name: "Late Fee Calculator",
            description: "Calculate late payment penalties and interest charges for overdue invoices.",
            url: "https://invoicer.doaide.com/tools/late-fee",
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
