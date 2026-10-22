import { rupees } from "./format";

// WhatsApp text for a finished invoice: who, what, the GST split and how to
// pay. wa.me carries the text in the URL, so it is capped; phones with the
// Web Share API get the full invoice as an .html attachment instead.

export const WHATSAPP_TEXT_LIMIT = 3000;
export const CREATE_URL = "https://invoicer.doaide.com/create";

export function invoiceTotals(items) {
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const taxBreakdown = {};
  items.forEach((it) => {
    const taxable = it.qty * it.rate;
    if (!taxBreakdown[it.tax]) taxBreakdown[it.tax] = { taxable: 0, tax: 0 };
    taxBreakdown[it.tax].taxable += taxable;
    taxBreakdown[it.tax].tax += taxable * (it.tax / 100);
  });
  const totalTax = Object.values(taxBreakdown).reduce((s, b) => s + b.tax, 0);
  return { subtotal, taxBreakdown, totalTax, grandTotal: subtotal + totalTax };
}

export function invoiceWhatsappText(invoice, limit = WHATSAPP_TEXT_LIMIT) {
  const { invoiceNum, from, to, invoiceDate, dueDate, items, interState, notes, bank } = invoice;
  const { subtotal, taxBreakdown, totalTax, grandTotal } = invoiceTotals(items);

  const head = [`*Invoice ${invoiceNum}*`, `From: ${from.name || "—"}${from.gstin ? ` (GSTIN ${from.gstin})` : ""}`];
  head.push(`To: ${to.name || "—"}${to.gstin ? ` (GSTIN ${to.gstin})` : ""}`);
  head.push(`Date: ${invoiceDate} | Due: ${dueDate}`);

  const lines = items.map((it, i) => {
    const hsn = it.hsn ? ` [HSN ${it.hsn}]` : "";
    return `${i + 1}. ${it.description || "Item"}${hsn} — ${it.qty} × ${rupees(it.rate)} = ${rupees(it.qty * it.rate)} (+${it.tax}% GST)`;
  });

  const tax = [`Subtotal: ${rupees(subtotal)}`];
  Object.entries(taxBreakdown).forEach(([rate, b]) => {
    if (Number(rate) <= 0) return;
    if (interState) tax.push(`IGST @ ${rate}%: ${rupees(b.tax)}`);
    else tax.push(`CGST @ ${rate / 2}%: ${rupees(b.tax / 2)} | SGST @ ${rate / 2}%: ${rupees(b.tax / 2)}`);
  });
  if (totalTax === 0) tax.push("GST: ₹0.00");
  tax.push(`*Total payable: ${rupees(grandTotal)}*`);

  const pay = [];
  if (bank?.account) pay.push(`Pay to: ${bank.name ? `${bank.name} ` : ""}A/C ${bank.account}${bank.ifsc ? `, IFSC ${bank.ifsc}` : ""}`);
  if (notes) pay.push(`Notes: ${notes}`);

  const footer = `Made free with DoAide Invoicer — ${CREATE_URL}`;
  const fixed = [head.join("\n"), tax.join("\n"), pay.join("\n"), footer].join("\n\n").length + 4;

  // Keep totals and payment details; drop line items from the end if needed.
  let body = lines;
  const room = limit - fixed;
  if (body.join("\n").length > room) {
    const kept = [];
    let used = 0;
    for (const l of lines) {
      if (used + l.length + 40 > room) break;
      kept.push(l);
      used += l.length + 1;
    }
    body = [...kept, `…and ${lines.length - kept.length} more item(s)`];
  }

  return [head.join("\n"), body.join("\n"), tax.join("\n"), pay.join("\n"), footer]
    .filter(Boolean)
    .join("\n\n");
}

export function invoiceWhatsappUrl(invoice) {
  return `https://wa.me/?text=${encodeURIComponent(invoiceWhatsappText(invoice))}`;
}

export function canShareFile(nav = typeof navigator !== "undefined" ? navigator : undefined) {
  if (!nav?.share || !nav?.canShare || typeof File === "undefined") return false;
  try {
    return nav.canShare({ files: [new File(["x"], "x.html", { type: "text/html" })] });
  } catch {
    return false;
  }
}

// Returns "shared", "cancelled" or "unsupported".
export async function shareInvoiceFile({ invoiceNum, html, text }, nav = typeof navigator !== "undefined" ? navigator : undefined) {
  if (!canShareFile(nav)) return "unsupported";
  const name = `${String(invoiceNum || "invoice").replace(/[^A-Za-z0-9_-]+/g, "-")}.html`;
  const file = new File([html], name, { type: "text/html" });
  try {
    await nav.share({ files: [file], title: `Invoice ${invoiceNum}`, text });
    return "shared";
  } catch (err) {
    return err?.name === "AbortError" ? "cancelled" : "unsupported";
  }
}
