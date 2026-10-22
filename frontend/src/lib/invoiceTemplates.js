import { amountInWords, rupees } from "./format";
import { invoiceTotals } from "./invoiceShare";

// Renders the invoice document for each template on /templates. Everything is
// plain inline-styled HTML in one self-contained document, so the same string
// works for the print window, the PDF download and the WhatsApp file share.

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(value) {
  return esc(value).replace(/\r?\n/g, "<br/>");
}

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  table { width: 100%; border-collapse: collapse; }
  tr, .no-break { page-break-inside: avoid; }
  thead { display: table-header-group; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; }
  @media print { .footer { display: none; } @page { margin: 14mm; } }
`;

function doc({ title, css, body }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>${BASE_CSS}${css}</style></head><body>${body}<div class="footer">Generated with DoAide Invoicer — invoicer.doaide.com</div></body></html>`;
}

function partyLines(party) {
  const rows = [];
  if (party.email) rows.push(esc(party.email));
  if (party.phone) rows.push(esc(party.phone));
  if (party.address) rows.push(nl2br(party.address));
  if (party.gstin) rows.push(`GSTIN: ${esc(party.gstin)}`);
  return rows.map((r) => `<p>${r}</p>`).join("");
}

function bankBlock(bank, label = "Bank Details") {
  if (!bank?.name && !bank?.account) return "";
  const rows = [];
  if (bank.name) rows.push(`Bank: ${esc(bank.name)}`);
  if (bank.account) rows.push(`A/C: ${esc(bank.account)}`);
  if (bank.ifsc) rows.push(`IFSC: ${esc(bank.ifsc)}`);
  return `<div class="bank no-break"><strong>${label}</strong><br/>${rows.join("<br/>")}</div>`;
}

function notesBlock(notes) {
  if (!notes) return "";
  return `<div class="notes no-break"><strong>Notes:</strong><br/>${nl2br(notes)}</div>`;
}

function taxRows(taxBreakdown, interState, cls = "") {
  return Object.entries(taxBreakdown)
    .filter(([rate]) => Number(rate) > 0)
    .map(([rate, b]) =>
      interState
        ? `<tr class="${cls}"><td>IGST @ ${rate}%</td><td class="num">${rupees(b.tax)}</td></tr>`
        : `<tr class="${cls}"><td>CGST @ ${rate / 2}% + SGST @ ${rate / 2}%</td><td class="num">${rupees(b.tax)}</td></tr>`,
    )
    .join("");
}

function itemRows(items, { showHsn = true } = {}) {
  return items
    .map(
      (it, i) => `<tr>
        <td>${i + 1}</td>
        <td>${esc(it.description) || "—"}</td>
        ${showHsn ? `<td>${esc(it.hsn) || "—"}</td>` : ""}
        <td class="num">${it.qty}</td>
        <td class="num">${rupees(it.rate)}</td>
        <td class="num">${it.tax}%</td>
        <td class="num">${rupees(it.qty * it.rate)}</td>
      </tr>`,
    )
    .join("");
}

// ---------------------------------------------------------------- standard
function renderStandard(data, accent = "#0D9488") {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank } = data;
  const { subtotal, taxBreakdown, grandTotal } = invoiceTotals(items);
  const css = `
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1d; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 32px; border-bottom: 3px solid ${accent}; padding-bottom: 20px; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    .inv-num { font-size: 24px; font-weight: bold; color: ${accent}; }
    .muted { font-size: 13px; color: #666; }
    .section-label { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 8px; }
    .party p { font-size: 13px; color: #666; line-height: 1.6; }
    th { background: #f5f5f5; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 2px solid #ddd; }
    td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #eee; }
    th.num, td.num { text-align: right; }
    .totals { width: 300px; margin-left: auto; }
    .totals td { font-size: 13px; color: #888; border: 0; padding: 6px 12px; }
    .totals .grand td { font-weight: bold; font-size: 18px; color: #1a1a1d; border-top: 2px solid ${accent}; padding: 10px 12px; }
    .notes { margin-top: 32px; padding: 16px; background: #fafafa; border-radius: 8px; font-size: 13px; color: #666; }
    .bank { margin-top: 16px; font-size: 13px; color: #666; }
  `;
  const body = `
    <div class="header">
      <div class="party">
        <h1>${esc(from.name) || "Your Business"}</h1>
        ${partyLines(from)}
      </div>
      <div style="text-align:right">
        <div class="inv-num">${esc(invoiceNum)}</div>
        <p class="muted">Date: ${esc(invoiceDate)}</p>
        <p class="muted">Due: ${esc(dueDate)}</p>
      </div>
    </div>
    <div class="party" style="margin-bottom:24px">
      <div class="section-label">Bill To</div>
      <p style="font-size:16px;font-weight:600;color:#1a1a1d">${esc(to.name) || "Client Name"}</p>
      ${partyLines(to)}
    </div>
    <table>
      <thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead>
      <tbody>${itemRows(items)}</tbody>
    </table>
    <table class="totals">
      <tbody>
        <tr><td>Subtotal</td><td class="num">${rupees(subtotal)}</td></tr>
        ${taxRows(taxBreakdown, interState)}
        <tr class="grand"><td>Total</td><td class="num">${rupees(grandTotal)}</td></tr>
      </tbody>
    </table>
    ${notesBlock(notes)}
    ${bankBlock(bank)}
  `;
  return doc({ title: invoiceNum, css, body });
}

// ------------------------------------------------------------ professional
function renderProfessional(data) {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank } = data;
  const { subtotal, taxBreakdown, grandTotal } = invoiceTotals(items);
  const navy = "#1E3A5F";
  const css = `
    body { font-family: Georgia, 'Times New Roman', serif; color: #222; max-width: 800px; margin: 0 auto; }
    .band { background: ${navy}; color: #fff; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; }
    .band h1 { font-size: 26px; letter-spacing: 0.5px; }
    .band .label { font-size: 13px; text-transform: uppercase; letter-spacing: 3px; opacity: 0.85; }
    .band .inv-num { font-size: 20px; font-weight: bold; }
    .inner { padding: 32px 40px; }
    .parties { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 28px; }
    .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${navy}; border-bottom: 1px solid ${navy}; padding-bottom: 4px; margin-bottom: 8px; font-weight: bold; }
    .party p { font-size: 13px; color: #555; line-height: 1.6; }
    .party .name { font-weight: bold; font-size: 15px; color: #222; }
    .meta-grid { display: flex; gap: 24px; margin-bottom: 24px; font-size: 13px; }
    .meta-grid div { border: 1px solid #e0e0e0; padding: 8px 14px; }
    .meta-grid .k { text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #888; }
    th { background: ${navy}; color: #fff; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #e5e5e5; }
    th.num, td.num { text-align: right; }
    tbody tr:nth-child(even) td { background: #f6f8fa; }
    .totals { width: 300px; margin-left: auto; margin-top: 8px; }
    .totals td { border: 0; font-size: 13px; color: #555; padding: 5px 12px; background: none; }
    .totals .grand td { background: ${navy}; color: #fff; font-weight: bold; font-size: 16px; padding: 10px 12px; }
    .notes { margin-top: 28px; font-size: 13px; color: #555; border-left: 3px solid ${navy}; padding: 10px 16px; background: #f6f8fa; }
    .bank { margin-top: 16px; font-size: 13px; color: #555; border: 1px solid #e0e0e0; padding: 12px 16px; }
  `;
  const body = `
    <div class="band">
      <div>
        <div class="label">Invoice</div>
        <h1>${esc(from.name) || "Your Business"}</h1>
      </div>
      <div style="text-align:right">
        <div class="inv-num">${esc(invoiceNum)}</div>
      </div>
    </div>
    <div class="inner">
      <div class="meta-grid">
        <div><div class="k">Invoice Date</div>${esc(invoiceDate)}</div>
        <div><div class="k">Due Date</div>${esc(dueDate)}</div>
      </div>
      <div class="parties">
        <div class="party" style="flex:1"><div class="section-label">From</div><p class="name">${esc(from.name) || "Your Business"}</p>${partyLines(from)}</div>
        <div class="party" style="flex:1"><div class="section-label">Bill To</div><p class="name">${esc(to.name) || "Client Name"}</p>${partyLines(to)}</div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead>
        <tbody>${itemRows(items)}</tbody>
      </table>
      <table class="totals">
        <tbody>
          <tr><td>Subtotal</td><td class="num">${rupees(subtotal)}</td></tr>
          ${taxRows(taxBreakdown, interState)}
          <tr class="grand"><td>Total Due</td><td class="num">${rupees(grandTotal)}</td></tr>
        </tbody>
      </table>
      ${notesBlock(notes)}
      ${bankBlock(bank, "Payment Details")}
    </div>
  `;
  return doc({ title: invoiceNum, css, body });
}

// ----------------------------------------------------------------- minimal
function renderMinimal(data) {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank } = data;
  const { subtotal, taxBreakdown, grandTotal } = invoiceTotals(items);
  const css = `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 56px 48px; max-width: 760px; margin: 0 auto; font-weight: 300; }
    h1 { font-size: 15px; font-weight: 400; text-transform: uppercase; letter-spacing: 6px; color: #999; margin-bottom: 48px; }
    .top { display: flex; justify-content: space-between; margin-bottom: 48px; }
    .k { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #bbb; margin-bottom: 6px; }
    .party p { font-size: 13px; color: #555; line-height: 1.8; }
    .party .name { font-size: 15px; color: #222; font-weight: 400; }
    th { text-align: left; padding: 8px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #bbb; border-bottom: 1px solid #ddd; font-weight: 400; }
    td { padding: 12px 0; font-size: 13px; color: #444; border-bottom: 1px solid #f0f0f0; }
    th.num, td.num { text-align: right; }
    td + td, th + th { padding-left: 16px; }
    .totals { width: 260px; margin-left: auto; margin-top: 16px; }
    .totals td { border: 0; font-size: 12px; color: #999; padding: 4px 0; }
    .totals .grand td { font-size: 20px; color: #222; font-weight: 400; border-top: 1px solid #222; padding-top: 12px; }
    .notes, .bank { margin-top: 40px; font-size: 12px; color: #999; line-height: 1.8; background: none; }
    .notes strong, .bank strong { font-weight: 400; text-transform: uppercase; letter-spacing: 2px; font-size: 10px; color: #bbb; }
  `;
  const body = `
    <h1>Invoice</h1>
    <div class="top">
      <div class="party">
        <div class="k">From</div>
        <p class="name">${esc(from.name) || "Your Business"}</p>
        ${partyLines(from)}
      </div>
      <div class="party">
        <div class="k">Billed To</div>
        <p class="name">${esc(to.name) || "Client Name"}</p>
        ${partyLines(to)}
      </div>
      <div class="party" style="text-align:right">
        <div class="k">Invoice No.</div>
        <p class="name">${esc(invoiceNum)}</p>
        <p>Issued ${esc(invoiceDate)}</p>
        <p>Due ${esc(dueDate)}</p>
      </div>
    </div>
    <table>
      <thead><tr><th>Description</th><th>HSN/SAC</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead>
      <tbody>${items
        .map(
          (it) => `<tr><td>${esc(it.description) || "—"}</td><td>${esc(it.hsn) || "—"}</td><td class="num">${it.qty}</td><td class="num">${rupees(it.rate)}</td><td class="num">${it.tax}%</td><td class="num">${rupees(it.qty * it.rate)}</td></tr>`,
        )
        .join("")}</tbody>
    </table>
    <table class="totals">
      <tbody>
        <tr><td>Subtotal</td><td class="num">${rupees(subtotal)}</td></tr>
        ${taxRows(taxBreakdown, interState)}
        <tr class="grand"><td>Total</td><td class="num">${rupees(grandTotal)}</td></tr>
      </tbody>
    </table>
    ${notesBlock(notes)}
    ${bankBlock(bank)}
  `;
  return doc({ title: invoiceNum, css, body });
}

// ---------------------------------------------------------------- creative
function renderCreative(data) {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank } = data;
  const { subtotal, taxBreakdown, grandTotal } = invoiceTotals(items);
  const coral = "#E86C50";
  const css = `
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #2b2b2e; max-width: 820px; margin: 0 auto; }
    .layout { display: flex; min-height: 100vh; }
    .side { background: ${coral}; color: #fff; width: 230px; padding: 40px 24px; flex-shrink: 0; }
    .side h1 { font-size: 22px; margin-bottom: 16px; line-height: 1.3; }
    .side p { font-size: 12px; line-height: 1.7; opacity: 0.92; word-break: break-word; }
    .side .k { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.75; margin: 20px 0 4px; }
    .main { flex: 1; padding: 40px 32px; }
    .big { font-size: 34px; font-weight: 800; color: ${coral}; margin-bottom: 4px; }
    .muted { font-size: 13px; color: #777; }
    .billto { margin: 24px 0; }
    .k2 { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: ${coral}; font-weight: bold; margin-bottom: 6px; }
    .billto p { font-size: 13px; color: #555; line-height: 1.6; }
    th { text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${coral}; border-bottom: 2px solid ${coral}; }
    td { padding: 10px; font-size: 13px; border-bottom: 1px dashed #e8c9c0; }
    th.num, td.num { text-align: right; }
    .totals { width: 280px; margin-left: auto; margin-top: 12px; }
    .totals td { border: 0; font-size: 13px; color: #777; padding: 5px 10px; }
    .totals .grand td { background: ${coral}; color: #fff; font-weight: 800; font-size: 17px; border-radius: 6px; padding: 10px; }
    .notes { margin-top: 28px; font-size: 13px; color: #666; background: #fdf1ee; border-radius: 10px; padding: 14px 18px; }
    .bank { margin-top: 14px; font-size: 13px; color: #666; }
  `;
  const body = `
    <div class="layout">
      <div class="side">
        <h1>${esc(from.name) || "Your Business"}</h1>
        ${from.email ? `<p>${esc(from.email)}</p>` : ""}
        ${from.phone ? `<p>${esc(from.phone)}</p>` : ""}
        ${from.address ? `<div class="k">Address</div><p>${nl2br(from.address)}</p>` : ""}
        ${from.gstin ? `<div class="k">GSTIN</div><p>${esc(from.gstin)}</p>` : ""}
        ${bank?.account ? `<div class="k">Pay To</div><p>${[bank.name, bank.account && `A/C ${bank.account}`, bank.ifsc && `IFSC ${bank.ifsc}`].filter(Boolean).map(esc).join("<br/>")}</p>` : ""}
      </div>
      <div class="main">
        <div class="big">INVOICE</div>
        <p class="muted">${esc(invoiceNum)} · Issued ${esc(invoiceDate)} · Due ${esc(dueDate)}</p>
        <div class="billto">
          <div class="k2">Bill To</div>
          <p style="font-weight:600;font-size:15px;color:#2b2b2e">${esc(to.name) || "Client Name"}</p>
          ${partyLines(to)}
        </div>
        <table>
          <thead><tr><th>Description</th><th>HSN</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead>
          <tbody>${items
            .map(
              (it) => `<tr><td>${esc(it.description) || "—"}</td><td>${esc(it.hsn) || "—"}</td><td class="num">${it.qty}</td><td class="num">${rupees(it.rate)}</td><td class="num">${it.tax}%</td><td class="num">${rupees(it.qty * it.rate)}</td></tr>`,
            )
            .join("")}</tbody>
        </table>
        <table class="totals">
          <tbody>
            <tr><td>Subtotal</td><td class="num">${rupees(subtotal)}</td></tr>
            ${taxRows(taxBreakdown, interState)}
            <tr class="grand"><td>Total</td><td class="num">${rupees(grandTotal)}</td></tr>
          </tbody>
        </table>
        ${notesBlock(notes)}
      </div>
    </div>
  `;
  return doc({ title: invoiceNum, css, body });
}

// ------------------------------------------------------------ gst-compliant
// Full tax-invoice layout under rule 46 of the CGST Rules: HSN/SAC and taxable
// value per line, CGST/SGST or IGST split per line, an HSN summary, the total
// in words, place of supply and a signature block.
function renderGstCompliant(data) {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank, placeOfSupply, reverseCharge } = data;
  const { subtotal, taxBreakdown, totalTax, grandTotal } = invoiceTotals(items);
  const green = "#059669";

  const lineRows = items
    .map((it, i) => {
      const taxable = it.qty * it.rate;
      const tax = taxable * (it.tax / 100);
      const taxCols = interState
        ? `<td class="num">${it.tax}%</td><td class="num">${rupees(tax)}</td>`
        : `<td class="num">${it.tax / 2}%</td><td class="num">${rupees(tax / 2)}</td><td class="num">${it.tax / 2}%</td><td class="num">${rupees(tax / 2)}</td>`;
      return `<tr>
        <td>${i + 1}</td>
        <td>${esc(it.description) || "—"}</td>
        <td>${esc(it.hsn) || "—"}</td>
        <td class="num">${it.qty}</td>
        <td class="num">${rupees(it.rate)}</td>
        <td class="num">${rupees(taxable)}</td>
        ${taxCols}
        <td class="num">${rupees(taxable + tax)}</td>
      </tr>`;
    })
    .join("");

  // HSN-wise summary, as GSTR-1 asks for.
  const hsnMap = {};
  items.forEach((it) => {
    const key = `${it.hsn || "—"}|${it.tax}`;
    if (!hsnMap[key]) hsnMap[key] = { hsn: it.hsn || "—", rate: it.tax, taxable: 0, tax: 0 };
    const taxable = it.qty * it.rate;
    hsnMap[key].taxable += taxable;
    hsnMap[key].tax += taxable * (it.tax / 100);
  });
  const hsnRows = Object.values(hsnMap)
    .map((h) => {
      const taxCols = interState
        ? `<td class="num">${rupees(h.tax)}</td>`
        : `<td class="num">${rupees(h.tax / 2)}</td><td class="num">${rupees(h.tax / 2)}</td>`;
      return `<tr><td>${esc(h.hsn)}</td><td class="num">${h.rate}%</td><td class="num">${rupees(h.taxable)}</td>${taxCols}<td class="num">${rupees(h.taxable + h.tax)}</td></tr>`;
    })
    .join("");

  const css = `
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1d; padding: 32px; max-width: 840px; margin: 0 auto; font-size: 13px; }
    .title { text-align: center; font-size: 18px; font-weight: 800; letter-spacing: 3px; color: ${green}; border: 2px solid ${green}; padding: 8px; margin-bottom: 20px; }
    .grid { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 16px; }
    .k { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 4px; }
    .party p { font-size: 12.5px; color: #555; line-height: 1.6; }
    .party .name { font-weight: 700; font-size: 14px; color: #1a1a1d; }
    .meta { font-size: 12.5px; color: #444; border: 1px solid #ddd; padding: 10px 14px; }
    .meta div { margin-bottom: 4px; }
    th { background: ${green}; color: #fff; text-align: left; padding: 7px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 7px 8px; font-size: 12px; border: 1px solid #e2e8e5; }
    th.num, td.num { text-align: right; }
    h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${green}; margin: 18px 0 6px; }
    .totals { width: 320px; margin-left: auto; margin-top: 10px; }
    .totals td { border: 0; font-size: 12.5px; color: #555; padding: 4px 8px; }
    .totals .grand td { font-weight: 800; font-size: 16px; color: #1a1a1d; border-top: 2px solid ${green}; padding-top: 8px; }
    .words { margin-top: 12px; padding: 10px 14px; background: #f0faf6; border: 1px solid #cdeee0; font-size: 12.5px; }
    .notes { margin-top: 16px; padding: 12px 14px; background: #fafafa; border-radius: 6px; font-size: 12px; color: #666; }
    .bank { margin-top: 12px; font-size: 12.5px; color: #555; }
    .sign { display: flex; justify-content: space-between; margin-top: 48px; align-items: flex-end; }
    .sign .box { text-align: center; font-size: 11px; color: #777; }
    .sign .line { border-top: 1px solid #999; width: 200px; margin-bottom: 4px; padding-top: 4px; }
  `;

  const taxHead = interState
    ? '<th class="num">IGST %</th><th class="num">IGST Amt</th>'
    : '<th class="num">CGST %</th><th class="num">CGST Amt</th><th class="num">SGST %</th><th class="num">SGST Amt</th>';
  const hsnHead = interState ? '<th class="num">IGST</th>' : '<th class="num">CGST</th><th class="num">SGST</th>';

  const body = `
    <div class="title">TAX INVOICE</div>
    <div class="grid">
      <div class="party" style="flex:1">
        <div class="k">Supplier</div>
        <p class="name">${esc(from.name) || "Your Business"}</p>
        ${partyLines(from)}
      </div>
      <div class="party" style="flex:1">
        <div class="k">Recipient (Bill To)</div>
        <p class="name">${esc(to.name) || "Client Name"}</p>
        ${partyLines(to)}
      </div>
      <div class="meta">
        <div><strong>Invoice No:</strong> ${esc(invoiceNum)}</div>
        <div><strong>Invoice Date:</strong> ${esc(invoiceDate)}</div>
        <div><strong>Due Date:</strong> ${esc(dueDate)}</div>
        ${placeOfSupply ? `<div><strong>Place of Supply:</strong> ${esc(placeOfSupply)}</div>` : ""}
        <div><strong>Reverse Charge:</strong> ${reverseCharge ? "Yes" : "No"}</div>
        <div><strong>Supply Type:</strong> ${interState ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)"}</div>
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Taxable Value</th>${taxHead}<th class="num">Total</th></tr></thead>
      <tbody>${lineRows}</tbody>
    </table>
    <div class="no-break">
      <h3>HSN/SAC Summary</h3>
      <table>
        <thead><tr><th>HSN/SAC</th><th class="num">Tax Rate</th><th class="num">Taxable Value</th>${hsnHead}<th class="num">Total</th></tr></thead>
        <tbody>${hsnRows}</tbody>
      </table>
    </div>
    <table class="totals">
      <tbody>
        <tr><td>Taxable Value</td><td class="num">${rupees(subtotal)}</td></tr>
        ${taxRows(taxBreakdown, interState)}
        <tr><td>Total Tax</td><td class="num">${rupees(totalTax)}</td></tr>
        <tr class="grand"><td>Invoice Total</td><td class="num">${rupees(grandTotal)}</td></tr>
      </tbody>
    </table>
    <div class="words no-break"><strong>Amount in words:</strong> ${esc(amountInWords(grandTotal))}</div>
    ${notesBlock(notes)}
    ${bankBlock(bank)}
    <div class="sign no-break">
      <div class="box"><div class="line">Receiver's Signature</div></div>
      <div class="box"><div style="margin-bottom:40px;font-size:12px;color:#444">For <strong>${esc(from.name) || "Your Business"}</strong></div><div class="line">Authorised Signatory</div></div>
    </div>
  `;
  return doc({ title: invoiceNum, css, body });
}

// ------------------------------------------------------------ international
function renderInternational(data) {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank } = data;
  const { subtotal, taxBreakdown, grandTotal } = invoiceTotals(items);
  const cyan = "#0891B2";
  const css = `
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1d; padding: 40px; max-width: 800px; margin: 0 auto; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    h1 { font-size: 24px; }
    .badge { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${cyan}; border: 1px solid ${cyan}; border-radius: 999px; padding: 4px 12px; }
    .rule { height: 4px; background: linear-gradient(90deg, ${cyan}, #67e8f9); border-radius: 2px; margin: 16px 0 28px; }
    .parties { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 28px; }
    .k { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: ${cyan}; font-weight: 700; margin-bottom: 6px; }
    .party p { font-size: 13px; color: #555; line-height: 1.6; }
    .party .name { font-weight: 600; font-size: 15px; color: #1a1a1d; }
    .meta p { font-size: 13px; color: #555; line-height: 1.8; text-align: right; }
    .meta .inv { font-size: 18px; font-weight: 700; color: ${cyan}; }
    th { text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #fff; background: ${cyan}; }
    td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #e0f2f7; }
    th.num, td.num { text-align: right; }
    .totals { width: 300px; margin-left: auto; margin-top: 10px; }
    .totals td { border: 0; font-size: 13px; color: #666; padding: 5px 12px; }
    .totals .grand td { font-weight: 700; font-size: 17px; color: #1a1a1d; border-top: 2px solid ${cyan}; padding-top: 10px; }
    .currency-note { font-size: 11px; color: #999; text-align: right; margin-top: 4px; }
    .notes { margin-top: 28px; padding: 14px 18px; background: #f0fbfd; border-radius: 8px; font-size: 13px; color: #555; }
    .bank { margin-top: 14px; font-size: 13px; color: #555; }
  `;
  const body = `
    <div class="top">
      <h1>${esc(from.name) || "Your Business"}</h1>
      <span class="badge">Invoice</span>
    </div>
    <div class="rule"></div>
    <div class="parties">
      <div class="party" style="flex:1"><div class="k">From</div><p class="name">${esc(from.name) || "Your Business"}</p>${partyLines(from)}</div>
      <div class="party" style="flex:1"><div class="k">Bill To</div><p class="name">${esc(to.name) || "Client Name"}</p>${partyLines(to)}</div>
      <div class="meta">
        <p class="inv">${esc(invoiceNum)}</p>
        <p>Issue date: ${esc(invoiceDate)}</p>
        <p>Due date: ${esc(dueDate)}</p>
        <p>Currency: INR (₹)</p>
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Description</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead>
      <tbody>${itemRows(items, { showHsn: false })}</tbody>
    </table>
    <table class="totals">
      <tbody>
        <tr><td>Subtotal</td><td class="num">${rupees(subtotal)}</td></tr>
        ${taxRows(taxBreakdown, interState)}
        <tr class="grand"><td>Total (INR)</td><td class="num">${rupees(grandTotal)}</td></tr>
      </tbody>
    </table>
    <div class="currency-note">All amounts in Indian Rupees (INR) unless stated otherwise.</div>
    ${notesBlock(notes)}
    ${bankBlock(bank, "Payment / Wire Details")}
  `;
  return doc({ title: invoiceNum, css, body });
}

const RENDERERS = {
  standard: renderStandard,
  professional: renderProfessional,
  minimal: renderMinimal,
  creative: renderCreative,
  "gst-compliant": renderGstCompliant,
  international: renderInternational,
};

export const TEMPLATE_SLUGS = Object.keys(RENDERERS);

export function renderInvoiceHtml(slug, data) {
  const render = RENDERERS[slug] || renderStandard;
  return render(data);
}
