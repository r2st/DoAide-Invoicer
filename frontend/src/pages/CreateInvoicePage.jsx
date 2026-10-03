import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";
import { rupees } from "../lib/format";

function nextInvoiceNumber() {
  let seq = 1;
  try { seq = parseInt(localStorage.getItem("inv_seq") || "0", 10) + 1; } catch {}
  try { localStorage.setItem("inv_seq", String(seq)); } catch {}
  return `INV-${String(seq).padStart(3, "0")}`;
}

function today() { return new Date().toISOString().slice(0, 10); }
function addDays(d, n) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

const PAYMENT_TERMS = [
  { label: "Due on Receipt", days: 0 },
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 45", days: 45 },
  { label: "Net 60", days: 60 },
];

const TAX_RATES = [0, 5, 12, 18, 28];

const EMPTY_ITEM = { description: "", hsn: "", qty: 1, rate: 0, tax: 18 };

function SectionTitle({ children }) {
  return <h2 className="font-display text-xl text-ink-strong mb-3 mt-6 first:mt-0">{children}</h2>;
}

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function CreateInvoicePage() {
  usePageTitle("Create Free Invoice");
  const [searchParams] = useSearchParams();
  const templateSlug = searchParams.get("template");

  const [from, setFrom] = useState({ name: "", email: "", phone: "", address: "", gstin: "" });
  const [to, setTo] = useState({ name: "", email: "", phone: "", address: "", gstin: "" });
  const [invoiceNum, setInvoiceNum] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [terms, setTerms] = useState(30);
  const [dueDate, setDueDate] = useState(addDays(today(), 30));
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [notes, setNotes] = useState("");
  const [bank, setBank] = useState({ name: "", account: "", ifsc: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [interState, setInterState] = useState(false);
  const printRef = useRef(null);

  useEffect(() => { setInvoiceNum(nextInvoiceNumber()); }, []);

  useEffect(() => {
    setDueDate(addDays(invoiceDate, terms));
  }, [invoiceDate, terms]);

  const updateFrom = (k, v) => setFrom((p) => ({ ...p, [k]: v }));
  const updateTo = (k, v) => setTo((p) => ({ ...p, [k]: v }));
  const updateBank = (k, v) => setBank((p) => ({ ...p, [k]: v }));

  const updateItem = (i, k, v) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  };
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i) => setItems((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const taxBreakdown = {};
  items.forEach((it) => {
    const taxable = it.qty * it.rate;
    const rate = it.tax;
    if (!taxBreakdown[rate]) taxBreakdown[rate] = { taxable: 0, tax: 0 };
    taxBreakdown[rate].taxable += taxable;
    taxBreakdown[rate].tax += taxable * (rate / 100);
  });
  const totalTax = Object.values(taxBreakdown).reduce((s, b) => s + b.tax, 0);
  const grandTotal = subtotal + totalTax;

  const buildTextSummary = useCallback(() => {
    let text = `Invoice ${invoiceNum}\n`;
    text += `From: ${from.name}\nTo: ${to.name}\n`;
    text += `Date: ${invoiceDate} | Due: ${dueDate}\n\n`;
    items.forEach((it, i) => {
      text += `${i + 1}. ${it.description || "Item"} — Qty: ${it.qty} × ${rupees(it.rate)} = ${rupees(it.qty * it.rate)}\n`;
    });
    text += `\nSubtotal: ${rupees(subtotal)}\nTax: ${rupees(totalTax)}\nTotal: ${rupees(grandTotal)}`;
    text += `\n\nCreated with DoAide Invoicer — https://invoicer.doaide.com/create`;
    return text;
  }, [invoiceNum, from.name, to.name, invoiceDate, dueDate, items, subtotal, totalTax, grandTotal]);

  const shareWhatsApp = () => {
    const text = buildTextSummary();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const shareTwitter = () => {
    const text = `I just created a professional invoice with DoAide Invoicer — free, no signup! 🧾\n\nTotal: ${rupees(grandTotal)}\n\nTry it: https://invoicer.doaide.com/create`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => {
      const content = printRef.current;
      if (!content) return;
      const win = window.open("", "_blank");
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html><head><title>${invoiceNum}</title><style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1d; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 28px; margin-bottom: 4px; }
        h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 12px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 32px; border-bottom: 3px solid #f0b429; padding-bottom: 20px; }
        .meta { text-align: right; }
        .meta .inv-num { font-size: 24px; font-weight: bold; color: #f0b429; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .party p { font-size: 14px; color: #444; line-height: 1.6; }
        .party .name { font-weight: 600; font-size: 16px; color: #1a1a1d; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f5f5f5; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 2px solid #ddd; }
        td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #eee; }
        .amount { text-align: right; }
        .totals { width: 300px; margin-left: auto; }
        .totals tr td { padding: 6px 12px; }
        .totals .grand { font-weight: bold; font-size: 18px; border-top: 2px solid #f0b429; }
        .notes { margin-top: 32px; padding: 16px; background: #fafafa; border-radius: 8px; font-size: 13px; color: #666; }
        .bank { margin-top: 16px; font-size: 13px; color: #666; }
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; }
        @media print { body { padding: 20px; } .footer { display: none; } }
      </style></head><body>${content.innerHTML}<div class="footer">Generated with DoAide Invoicer — invoicer.doaide.com</div></body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 300);
    }, 100);
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
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link to="/templates" className="text-sm text-ink-soft hover:text-brand transition-colors">Templates</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 pb-16">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl lg:text-4xl text-ink-strong mb-2">
            Create a Free Invoice{templateSlug ? ` — ${templateSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}` : ""}
          </h1>
          <p className="text-ink-soft text-sm">No signup required. Fill in the details, preview, and download your invoice.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-1">
            <div className="panel">
              <SectionTitle>From (Your Business)</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Business Name" id="from-name">
                  <input id="from-name" className="input-field" value={from.name} onChange={(e) => updateFrom("name", e.target.value)} placeholder="Your Business Name" />
                </Field>
                <Field label="Email" id="from-email">
                  <input id="from-email" type="email" className="input-field" value={from.email} onChange={(e) => updateFrom("email", e.target.value)} placeholder="you@example.com" />
                </Field>
                <Field label="Phone" id="from-phone">
                  <input id="from-phone" type="tel" className="input-field" value={from.phone} onChange={(e) => updateFrom("phone", e.target.value)} placeholder="+91 98765 43210" />
                </Field>
                <Field label="GSTIN (optional)" id="from-gstin">
                  <input id="from-gstin" className="input-field font-mono" value={from.gstin} onChange={(e) => updateFrom("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address" id="from-address">
                    <textarea id="from-address" className="input-field" rows={2} value={from.address} onChange={(e) => updateFrom("address", e.target.value)} placeholder="Street, City, State, PIN" />
                  </Field>
                </div>
              </div>
            </div>

            <div className="panel">
              <SectionTitle>Bill To (Client)</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Client Name" id="to-name">
                  <input id="to-name" className="input-field" value={to.name} onChange={(e) => updateTo("name", e.target.value)} placeholder="Client / Company Name" />
                </Field>
                <Field label="Email" id="to-email">
                  <input id="to-email" type="email" className="input-field" value={to.email} onChange={(e) => updateTo("email", e.target.value)} placeholder="client@example.com" />
                </Field>
                <Field label="Phone" id="to-phone">
                  <input id="to-phone" type="tel" className="input-field" value={to.phone} onChange={(e) => updateTo("phone", e.target.value)} placeholder="+91 98765 43210" />
                </Field>
                <Field label="GSTIN (optional)" id="to-gstin">
                  <input id="to-gstin" className="input-field font-mono" value={to.gstin} onChange={(e) => updateTo("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address" id="to-address">
                    <textarea id="to-address" className="input-field" rows={2} value={to.address} onChange={(e) => updateTo("address", e.target.value)} placeholder="Street, City, State, PIN" />
                  </Field>
                </div>
              </div>
            </div>

            <div className="panel">
              <SectionTitle>Invoice Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Field label="Invoice Number" id="inv-num">
                  <input id="inv-num" className="input-field font-mono" value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} />
                </Field>
                <Field label="Invoice Date" id="inv-date">
                  <input id="inv-date" type="date" className="input-field" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </Field>
                <Field label="Payment Terms" id="inv-terms">
                  <select id="inv-terms" className="input-field" value={terms} onChange={(e) => setTerms(Number(e.target.value))}>
                    {PAYMENT_TERMS.map((t) => <option key={t.days} value={t.days}>{t.label}</option>)}
                  </select>
                </Field>
                <Field label="Due Date" id="inv-due">
                  <input id="inv-due" type="date" className="input-field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </Field>
              </div>
              <div className="mt-3">
                <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                  <input type="checkbox" checked={interState} onChange={(e) => setInterState(e.target.checked)} className="accent-brand" />
                  Inter-state supply (IGST instead of CGST + SGST)
                </label>
              </div>
            </div>

            <div className="panel">
              <SectionTitle>Line Items</SectionTitle>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Description</label>
                      <input className="input-field text-sm" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Item or service" />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">HSN/SAC</label>
                      <input className="input-field text-sm font-mono" value={item.hsn} onChange={(e) => updateItem(i, "hsn", e.target.value)} placeholder="Optional" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Qty</label>
                      <input type="number" min={1} className="input-field text-sm" value={item.qty} onChange={(e) => updateItem(i, "qty", Math.max(1, Number(e.target.value)))} />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Rate (₹)</label>
                      <input type="number" min={0} step="0.01" className="input-field text-sm" value={item.rate || ""} onChange={(e) => updateItem(i, "rate", Number(e.target.value))} placeholder="0.00" />
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-ink-muted block mb-1">Tax %</label>
                      <select className="input-field text-sm" value={item.tax} onChange={(e) => updateItem(i, "tax", Number(e.target.value))}>
                        {TAX_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </div>
                    <div className="col-span-1 flex items-end justify-end pb-2.5">
                      <button type="button" onClick={() => removeItem(i)} className="text-bad hover:text-red-400 text-lg bg-transparent border-0 cursor-pointer" title="Remove item" disabled={items.length === 1}>&times;</button>
                    </div>
                    <div className="col-span-12 text-right text-sm font-mono text-ink-soft -mt-1">
                      {rupees(item.qty * item.rate)}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="btn btn-ghost text-sm mt-3">+ Add Item</button>
            </div>

            <div className="panel">
              <SectionTitle>Notes &amp; Bank Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Field label="Notes / Terms" id="notes">
                    <textarea id="notes" className="input-field" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank you note, etc." />
                  </Field>
                </div>
                <div className="space-y-3">
                  <Field label="Bank Name" id="bank-name">
                    <input id="bank-name" className="input-field" value={bank.name} onChange={(e) => updateBank("name", e.target.value)} placeholder="Bank Name" />
                  </Field>
                  <Field label="Account Number" id="bank-acc">
                    <input id="bank-acc" className="input-field font-mono" value={bank.account} onChange={(e) => updateBank("account", e.target.value)} placeholder="Account Number" />
                  </Field>
                  <Field label="IFSC Code" id="bank-ifsc">
                    <input id="bank-ifsc" className="input-field font-mono" value={bank.ifsc} onChange={(e) => updateBank("ifsc", e.target.value.toUpperCase())} placeholder="SBIN0001234" />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="panel">
                <h3 className="font-display text-lg text-ink-strong mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span className="font-mono">{rupees(subtotal)}</span></div>
                  {Object.entries(taxBreakdown).map(([rate, b]) => (
                    Number(rate) > 0 && (
                      <div key={rate} className="text-xs text-ink-muted pl-2 space-y-1">
                        {interState ? (
                          <div className="flex justify-between"><span>IGST @ {rate}%</span><span className="font-mono">{rupees(b.tax)}</span></div>
                        ) : (
                          <>
                            <div className="flex justify-between"><span>CGST @ {rate / 2}%</span><span className="font-mono">{rupees(b.tax / 2)}</span></div>
                            <div className="flex justify-between"><span>SGST @ {rate / 2}%</span><span className="font-mono">{rupees(b.tax / 2)}</span></div>
                          </>
                        )}
                      </div>
                    )
                  ))}
                  <div className="flex justify-between border-t border-line pt-2"><span className="text-ink-soft">Total Tax</span><span className="font-mono">{rupees(totalTax)}</span></div>
                  <div className="flex justify-between border-t border-line pt-2 text-lg font-bold">
                    <span className="text-ink-strong">Total</span>
                    <span className="text-brand font-mono">{rupees(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <button type="button" onClick={handlePrint} className="btn btn-primary w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download PDF
              </button>
              <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp w-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Send via WhatsApp
              </button>
              <button type="button" onClick={shareTwitter} className="btn btn-ghost w-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share on Twitter
              </button>

              <div className="panel bg-[var(--glass-feature-bg)] border-[var(--glass-feature-border)]">
                <p className="text-sm text-ink-soft mb-3">Want to save invoices, track payments, and manage clients?</p>
                <Link to="/" className="btn btn-primary w-full text-sm">Sign Up Free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={printRef} style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="header" style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, borderBottom: "3px solid #f0b429", paddingBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#1a1a1d", marginBottom: 4 }}>{from.name || "Your Business"}</h1>
              {from.email && <p style={{ fontSize: 13, color: "#666" }}>{from.email}</p>}
              {from.phone && <p style={{ fontSize: 13, color: "#666" }}>{from.phone}</p>}
              {from.address && <p style={{ fontSize: 13, color: "#666", whiteSpace: "pre-line" }}>{from.address}</p>}
              {from.gstin && <p style={{ fontSize: 13, color: "#666" }}>GSTIN: {from.gstin}</p>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#f0b429" }}>{invoiceNum}</div>
              <p style={{ fontSize: 13, color: "#666" }}>Date: {invoiceDate}</p>
              <p style={{ fontSize: 13, color: "#666" }}>Due: {dueDate}</p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "#999", marginBottom: 8 }}>Bill To</h2>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1d" }}>{to.name || "Client Name"}</p>
            {to.email && <p style={{ fontSize: 13, color: "#666" }}>{to.email}</p>}
            {to.phone && <p style={{ fontSize: 13, color: "#666" }}>{to.phone}</p>}
            {to.address && <p style={{ fontSize: 13, color: "#666", whiteSpace: "pre-line" }}>{to.address}</p>}
            {to.gstin && <p style={{ fontSize: 13, color: "#666" }}>GSTIN: {to.gstin}</p>}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                <th style={{ background: "#f5f5f5", textAlign: "left", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>#</th>
                <th style={{ background: "#f5f5f5", textAlign: "left", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Description</th>
                <th style={{ background: "#f5f5f5", textAlign: "left", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>HSN/SAC</th>
                <th style={{ background: "#f5f5f5", textAlign: "right", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Qty</th>
                <th style={{ background: "#f5f5f5", textAlign: "right", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Rate</th>
                <th style={{ background: "#f5f5f5", textAlign: "right", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Tax</th>
                <th style={{ background: "#f5f5f5", textAlign: "right", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee" }}>{item.description || "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee" }}>{item.hsn || "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee", textAlign: "right" }}>{item.qty}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee", textAlign: "right" }}>{rupees(item.rate)}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee", textAlign: "right" }}>{item.tax}%</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, borderBottom: "1px solid #eee", textAlign: "right" }}>{rupees(item.qty * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table style={{ width: 280, marginLeft: "auto", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={{ padding: "6px 12px", fontSize: 14, color: "#666" }}>Subtotal</td><td style={{ padding: "6px 12px", fontSize: 14, textAlign: "right" }}>{rupees(subtotal)}</td></tr>
              {Object.entries(taxBreakdown).map(([rate, b]) => (
                Number(rate) > 0 && (interState ? (
                  <tr key={rate}><td style={{ padding: "6px 12px", fontSize: 13, color: "#888" }}>IGST @ {rate}%</td><td style={{ padding: "6px 12px", fontSize: 13, textAlign: "right" }}>{rupees(b.tax)}</td></tr>
                ) : (
                  <tr key={rate}><td style={{ padding: "6px 12px", fontSize: 13, color: "#888" }}>CGST @ {rate / 2}% + SGST @ {rate / 2}%</td><td style={{ padding: "6px 12px", fontSize: 13, textAlign: "right" }}>{rupees(b.tax)}</td></tr>
                ))
              ))}
              <tr><td style={{ padding: "10px 12px", fontSize: 18, fontWeight: "bold", borderTop: "2px solid #f0b429" }}>Total</td><td style={{ padding: "10px 12px", fontSize: 18, fontWeight: "bold", textAlign: "right", borderTop: "2px solid #f0b429" }}>{rupees(grandTotal)}</td></tr>
            </tbody>
          </table>

          {notes && <div style={{ marginTop: 32, padding: 16, background: "#fafafa", borderRadius: 8, fontSize: 13, color: "#666" }}><strong>Notes:</strong><br />{notes}</div>}
          {(bank.name || bank.account) && (
            <div style={{ marginTop: 16, fontSize: 13, color: "#666" }}>
              <strong>Bank Details:</strong><br />
              {bank.name && <span>Bank: {bank.name}<br /></span>}
              {bank.account && <span>A/C: {bank.account}<br /></span>}
              {bank.ifsc && <span>IFSC: {bank.ifsc}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
