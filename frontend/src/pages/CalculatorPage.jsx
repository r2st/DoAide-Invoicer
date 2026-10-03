import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";
import { rupees } from "../lib/format";

const TAX_RATES = [0, 5, 12, 18, 28];

const EMPTY_ITEM = { description: "", amount: 0, tax: 18 };

const GST_REFERENCE = [
  { item: "Food & beverages", rate: "5%" },
  { item: "Clothing (under ₹1,000)", rate: "5%" },
  { item: "Clothing (₹1,000+)", rate: "12%" },
  { item: "Electronics & appliances", rate: "18%" },
  { item: "IT & software services", rate: "18%" },
  { item: "Professional services", rate: "18%" },
  { item: "Restaurants (non-AC)", rate: "5%" },
  { item: "Restaurants (AC / 5-star)", rate: "18%" },
  { item: "Luxury goods & cars", rate: "28%" },
  { item: "Cement", rate: "28%" },
];

export default function CalculatorPage() {
  usePageTitle("Invoice Tax Calculator");
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [interState, setInterState] = useState(false);
  const [inclusive, setInclusive] = useState(false);

  const updateItem = (i, k, v) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  };
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i) => setItems((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const breakdown = {};
  let subtotal = 0;
  let totalTax = 0;

  items.forEach((it) => {
    const rate = it.tax;
    let taxable, tax;
    if (inclusive) {
      taxable = it.amount / (1 + rate / 100);
      tax = it.amount - taxable;
    } else {
      taxable = it.amount;
      tax = taxable * (rate / 100);
    }
    subtotal += taxable;
    totalTax += tax;
    if (!breakdown[rate]) breakdown[rate] = { taxable: 0, tax: 0 };
    breakdown[rate].taxable += taxable;
    breakdown[rate].tax += tax;
  });

  const grandTotal = subtotal + totalTax;

  const buildSummary = () => {
    let text = "Invoice Tax Calculation\n\n";
    items.forEach((it, i) => {
      text += `${i + 1}. ${it.description || "Item"} — ${rupees(it.amount)} @ ${it.tax}% GST\n`;
    });
    text += `\nSubtotal: ${rupees(subtotal)}\nTotal Tax: ${rupees(totalTax)}\nGrand Total: ${rupees(grandTotal)}`;
    text += `\n\nCalculated with DoAide Invoicer — https://invoicer.doaide.com/calculator`;
    return text;
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildSummary())}`, "_blank", "noopener");
  };

  const shareTwitter = () => {
    const text = `GST Calculation:\nSubtotal: ${rupees(subtotal)} | Tax: ${rupees(totalTax)} | Total: ${rupees(grandTotal)}\n\nFree GST calculator: https://invoicer.doaide.com/calculator`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

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
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-2">Invoice Tax Calculator</h1>
          <p className="text-ink-soft text-sm">Calculate GST, CGST, SGST, and IGST for your invoices — free, no signup.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="panel">
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                  <input type="checkbox" checked={interState} onChange={(e) => setInterState(e.target.checked)} className="accent-brand" />
                  Inter-state (IGST)
                </label>
                <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                  <input type="checkbox" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} className="accent-brand" />
                  Amount includes tax
                </label>
              </div>

              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Description</label>
                      <input className="input-field text-sm" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Item or service" />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Amount (₹)</label>
                      <input type="number" min={0} step="0.01" className="input-field text-sm" value={item.amount || ""} onChange={(e) => updateItem(i, "amount", Number(e.target.value))} placeholder="0.00" />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Tax %</label>
                      <select className="input-field text-sm" value={item.tax} onChange={(e) => updateItem(i, "tax", Number(e.target.value))}>
                        {TAX_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-end justify-end pb-2.5">
                      <button type="button" onClick={() => removeItem(i)} className="text-bad hover:text-red-400 text-lg bg-transparent border-0 cursor-pointer" title="Remove" disabled={items.length === 1}>&times;</button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="btn btn-ghost text-sm mt-3">+ Add Item</button>
            </div>

            {Object.keys(breakdown).some((r) => Number(r) > 0) && (
              <div className="panel">
                <h3 className="font-display text-lg text-ink-strong mb-3">Tax Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="table-base">
                    <thead>
                      <tr>
                        <th>Rate</th>
                        <th>Taxable Amount</th>
                        {interState ? <th>IGST</th> : <><th>CGST</th><th>SGST</th></>}
                        <th>Total Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(breakdown).filter(([r]) => Number(r) > 0).map(([rate, b]) => (
                        <tr key={rate}>
                          <td className="font-mono">{rate}%</td>
                          <td className="font-mono">{rupees(b.taxable)}</td>
                          {interState ? (
                            <td className="font-mono">{rupees(b.tax)}</td>
                          ) : (
                            <>
                              <td className="font-mono">{rupees(b.tax / 2)}</td>
                              <td className="font-mono">{rupees(b.tax / 2)}</td>
                            </>
                          )}
                          <td className="font-mono font-semibold">{rupees(b.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="panel">
              <h3 className="font-display text-lg text-ink-strong mb-3">Common GST Rates — Quick Reference</h3>
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr><th>Item / Service</th><th>GST Rate</th></tr>
                  </thead>
                  <tbody>
                    {GST_REFERENCE.map((g) => (
                      <tr key={g.item}><td>{g.item}</td><td className="font-mono font-semibold">{g.rate}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="stat-card tone-brand">
                <div className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-1">Subtotal</div>
                <div className="text-2xl font-bold font-mono">{rupees(subtotal)}</div>
              </div>
              <div className="stat-card tone-warn">
                <div className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-1">Total Tax</div>
                <div className="text-2xl font-bold font-mono text-warn">{rupees(totalTax)}</div>
              </div>
              <div className="stat-card tone-good">
                <div className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-1">Grand Total</div>
                <div className="text-2xl font-bold font-mono text-good">{rupees(grandTotal)}</div>
              </div>

              <Link to="/create" className="btn btn-primary w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Create Full Invoice
              </Link>
              <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp w-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Share on WhatsApp
              </button>
              <button type="button" onClick={shareTwitter} className="btn btn-ghost w-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share on Twitter
              </button>

              <div className="panel bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
                <p className="text-sm text-ink-soft mb-3">Need a full invoice? Create one free in 30 seconds.</p>
                <Link to="/create" className="btn btn-primary w-full text-sm">Create Free Invoice</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
