import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import OnboardingGuide from "../components/OnboardingGuide";
import ThemeToggle from "../components/ThemeToggle";
import { usePageTitle } from "../hooks/usePageTitle";
import { rupees } from "../lib/format";
import { clearSavedBusiness, loadSavedBusiness, saveBusiness } from "../lib/invoiceDraft";
import { canShareFile, invoiceTotals, invoiceWhatsappText, invoiceWhatsappUrl, shareInvoiceFile } from "../lib/invoiceShare";
import { renderInvoiceHtml, TEMPLATE_SLUGS } from "../lib/invoiceTemplates";
import { TEMPLATES } from "./TemplatesPage";

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
  usePageTitle(
    "Create Free Invoice",
    "Create a GST-compliant invoice online in about 30 seconds. Add your business and line items, then download a PDF or share it on WhatsApp. Free, no sign-up.",
  );
  const [searchParams] = useSearchParams();
  const templateSlug = searchParams.get("template");
  const [template, setTemplate] = useState(() => (TEMPLATE_SLUGS.includes(templateSlug) ? templateSlug : "standard"));

  const [saved] = useState(() => loadSavedBusiness());
  const [from, setFrom] = useState(saved?.from || { name: "", email: "", phone: "", address: "", gstin: "" });
  const [to, setTo] = useState({ name: "", email: "", phone: "", address: "", gstin: "" });
  const [invoiceNum, setInvoiceNum] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [terms, setTerms] = useState(30);
  const [dueDate, setDueDate] = useState(addDays(today(), 30));
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [notes, setNotes] = useState("");
  const [bank, setBank] = useState(saved?.bank || { name: "", account: "", ifsc: "" });
  const [remember, setRemember] = useState(true);
  const [interState, setInterState] = useState(false);
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [reverseCharge, setReverseCharge] = useState(false);

  useEffect(() => { setInvoiceNum(nextInvoiceNumber()); }, []);

  useEffect(() => {
    setDueDate(addDays(invoiceDate, terms));
  }, [invoiceDate, terms]);

  useEffect(() => {
    if (remember) saveBusiness(from, bank);
  }, [remember, from, bank]);

  const toggleRemember = (checked) => {
    setRemember(checked);
    if (!checked) clearSavedBusiness();
  };

  const updateFrom = (k, v) => setFrom((p) => ({ ...p, [k]: v }));
  const updateTo = (k, v) => setTo((p) => ({ ...p, [k]: v }));
  const updateBank = (k, v) => setBank((p) => ({ ...p, [k]: v }));

  const updateItem = (i, k, v) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  };
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i) => setItems((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const { subtotal, taxBreakdown, totalTax, grandTotal } = invoiceTotals(items);

  const invoiceData = useCallback(
    () => ({ invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank, placeOfSupply, reverseCharge }),
    [invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank, placeOfSupply, reverseCharge],
  );

  const invoiceDocument = () => renderInvoiceHtml(template, invoiceData());

  // Phones get the invoice itself as a file; elsewhere the wa.me text has the full summary.
  const shareWhatsApp = async () => {
    const data = invoiceData();
    if (!canShareFile()) {
      window.open(invoiceWhatsappUrl(data), "_blank", "noopener");
      return;
    }
    const result = await shareInvoiceFile({ invoiceNum, html: invoiceDocument(), text: invoiceWhatsappText(data) });
    if (result === "unsupported") window.open(invoiceWhatsappUrl(data), "_blank", "noopener");
  };

  const shareTwitter = () => {
    const text = `I just created a professional invoice with DoAide Invoicer — free, no signup! 🧾\n\nTotal: ${rupees(grandTotal)}\n\nTry it: https://invoicer.doaide.com/create`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  // A hidden iframe survives popup blockers, and the document <title> (the
  // invoice number) becomes the suggested PDF filename in the print dialog.
  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    iframe.srcdoc = invoiceDocument();
    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (!win) return;
      const cleanup = () => setTimeout(() => iframe.remove(), 500);
      win.addEventListener("afterprint", cleanup);
      setTimeout(cleanup, 60000);
      setTimeout(() => {
        win.focus();
        win.print();
      }, 150);
    };
    document.body.appendChild(iframe);
  };

  const previewInvoice = () => {
    const win = window.open("", "_blank", "noopener");
    if (!win) return;
    win.document.write(invoiceDocument());
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center max-w-5xl w-full mx-auto px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-brand">DoAide</span>
            <span className="text-ink-muted mx-1.5">|</span>
            <span className="text-ink-strong">Invoicer</span>
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
            Create a Free Invoice{template !== "standard" ? ` — ${TEMPLATES.find((t) => t.slug === template)?.name || ""}` : ""}
          </h1>
          <p className="text-ink-soft text-sm">No signup required. Fill in the details, preview, and download your invoice.</p>
        </div>

        <OnboardingGuide />

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
                <label className="sm:col-span-2 flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => toggleRemember(e.target.checked)} className="accent-brand" />
                  Remember my business and bank details on this device (no account needed)
                </label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <Field label="Template" id="inv-template">
                  <select id="inv-template" className="input-field" value={template} onChange={(e) => setTemplate(e.target.value)}>
                    {TEMPLATES.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                  </select>
                </Field>
                <p className="text-xs text-ink-muted self-end pb-2">
                  {TEMPLATES.find((t) => t.slug === template)?.description}
                </p>
              </div>
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
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                  <input type="checkbox" checked={interState} onChange={(e) => setInterState(e.target.checked)} className="accent-brand" />
                  Inter-state supply (IGST instead of CGST + SGST)
                </label>
                {template === "gst-compliant" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Field label="Place of Supply" id="inv-pos">
                      <input id="inv-pos" className="input-field" value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} placeholder="e.g. 27 — Maharashtra" />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer self-end pb-2.5">
                      <input type="checkbox" checked={reverseCharge} onChange={(e) => setReverseCharge(e.target.checked)} className="accent-brand" />
                      Tax payable on reverse charge
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <SectionTitle>Line Items</SectionTitle>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="line-item grid grid-cols-12 gap-2 items-end">
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
                      <button type="button" onClick={() => removeItem(i)} className="item-remove text-bad hover:text-red-400 text-lg bg-transparent border-0 cursor-pointer" title="Remove item" aria-label={`Remove item ${i + 1}`} disabled={items.length === 1}>&times;</button>
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

              <button type="button" onClick={previewInvoice} className="btn btn-ghost w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Preview Invoice
              </button>
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
                <p className="text-sm text-ink-soft mb-3">
                  No account needed — your business details are kept on this device for next time.
                  Sign up only if you want invoice history and payment tracking across devices.
                </p>
                <Link to="/#auth" className="btn btn-ghost w-full text-sm">Create an optional account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
