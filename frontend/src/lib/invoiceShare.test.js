import { describe, expect, it, vi } from "vitest";
import {
  WHATSAPP_TEXT_LIMIT,
  canShareFile,
  invoiceTotals,
  invoiceWhatsappText,
  invoiceWhatsappUrl,
  shareInvoiceFile,
} from "./invoiceShare";

const invoice = {
  invoiceNum: "INV-007",
  from: { name: "Sharma Traders", gstin: "27AAAAA0000A1Z5" },
  to: { name: "Mehta Stores", gstin: "" },
  invoiceDate: "2026-10-22",
  dueDate: "2026-11-21",
  items: [
    { description: "Rice 25kg", hsn: "1006", qty: 2, rate: 1000, tax: 5 },
    { description: "Delivery", hsn: "", qty: 1, rate: 500, tax: 18 },
  ],
  interState: false,
  notes: "Thank you",
  bank: { name: "SBI", account: "1234567890", ifsc: "SBIN0001234" },
};

describe("invoiceTotals", () => {
  it("adds GST per rate", () => {
    const t = invoiceTotals(invoice.items);
    expect(t.subtotal).toBe(2500);
    expect(t.totalTax).toBeCloseTo(100 + 90);
    expect(t.grandTotal).toBeCloseTo(2690);
  });
});

describe("invoiceWhatsappText", () => {
  it("carries parties, items, CGST/SGST split, total and bank", () => {
    const text = invoiceWhatsappText(invoice);
    expect(text).toContain("*Invoice INV-007*");
    expect(text).toContain("GSTIN 27AAAAA0000A1Z5");
    expect(text).toContain("Rice 25kg [HSN 1006]");
    expect(text).toContain("CGST @ 2.5%");
    expect(text).toContain("SGST @ 9%");
    expect(text).toMatch(/Total payable: ₹2,690\.00/);
    expect(text).toContain("IFSC SBIN0001234");
    expect(text).toContain("Due: 2026-11-21");
  });

  it("uses IGST for inter-state supply", () => {
    const text = invoiceWhatsappText({ ...invoice, interState: true });
    expect(text).toContain("IGST @ 18%");
    expect(text).not.toContain("CGST");
  });

  it("stays under the limit but keeps the total when there are many items", () => {
    const items = Array.from({ length: 200 }, (_, i) => ({ description: `Line item number ${i}`, hsn: "9983", qty: 1, rate: 100, tax: 18 }));
    const text = invoiceWhatsappText({ ...invoice, items });
    expect(text.length).toBeLessThanOrEqual(WHATSAPP_TEXT_LIMIT);
    expect(text).toMatch(/more item\(s\)/);
    expect(text).toContain("Total payable");
  });

  it("builds an encoded wa.me URL", () => {
    expect(invoiceWhatsappUrl(invoice).startsWith("https://wa.me/?text=")).toBe(true);
  });
});

describe("shareInvoiceFile", () => {
  it("is unsupported without the Web Share API", async () => {
    expect(canShareFile({})).toBe(false);
    expect(await shareInvoiceFile({ invoiceNum: "INV-1", html: "<p/>", text: "t" }, {})).toBe("unsupported");
  });

  it("shares the invoice as an html file", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const result = await shareInvoiceFile({ invoiceNum: "INV/007", html: "<p/>", text: "t" }, { share, canShare: () => true });
    expect(result).toBe("shared");
    expect(share.mock.calls[0][0].files[0].name).toBe("INV-007.html");
  });

  it("reports a cancelled share", async () => {
    const err = Object.assign(new Error("x"), { name: "AbortError" });
    const nav = { share: vi.fn().mockRejectedValue(err), canShare: () => true };
    expect(await shareInvoiceFile({ invoiceNum: "1", html: "", text: "" }, nav)).toBe("cancelled");
  });
});
