import { esc, renderInvoiceHtml, TEMPLATE_SLUGS } from "./invoiceTemplates";

const DATA = {
  invoiceNum: "INV-042",
  from: { name: "Sharma Traders", email: "hello@sharma.in", phone: "+91 98765 43210", address: "12 MG Road\nPune, MH", gstin: "27AAAAA0000A1Z5" },
  to: { name: "Mehta Stores", email: "", phone: "", address: "Mumbai", gstin: "27BBBBB0000B1Z4" },
  invoiceDate: "2026-10-22",
  dueDate: "2026-11-21",
  items: [
    { description: "Web design", hsn: "998314", qty: 2, rate: 10000, tax: 18 },
    { description: "Hosting", hsn: "998315", qty: 1, rate: 5000, tax: 18 },
  ],
  interState: false,
  notes: "Thank you!",
  bank: { name: "SBI", account: "1234567890", ifsc: "SBIN0001234" },
  placeOfSupply: "27 — Maharashtra",
  reverseCharge: false,
};

describe("renderInvoiceHtml", () => {
  it("exposes all six template slugs", () => {
    expect(TEMPLATE_SLUGS).toEqual([
      "standard", "professional", "minimal", "creative", "gst-compliant", "international",
    ]);
  });

  it.each(TEMPLATE_SLUGS)("renders %s as a complete document with the core fields", (slug) => {
    const html = renderInvoiceHtml(slug, DATA);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>INV-042</title>");
    expect(html).toContain("Sharma Traders");
    expect(html).toContain("Mehta Stores");
    expect(html).toContain("Web design");
    expect(html).toContain("invoicer.doaide.com");
    // grand total: 25000 + 18% = 29500
    expect(html).toContain("29,500.00");
  });

  it("renders distinct layouts per template", () => {
    const docs = TEMPLATE_SLUGS.map((s) => renderInvoiceHtml(s, DATA));
    expect(new Set(docs).size).toBe(TEMPLATE_SLUGS.length);
  });

  it("falls back to standard for an unknown slug", () => {
    expect(renderInvoiceHtml("nope", DATA)).toBe(renderInvoiceHtml("standard", DATA));
  });

  it("escapes HTML in user-entered fields", () => {
    const html = renderInvoiceHtml("standard", {
      ...DATA,
      from: { ...DATA.from, name: '<script>alert("x")</script>' },
    });
    expect(html).not.toContain('<script>alert("x")</script>');
    expect(html).toContain("&lt;script&gt;");
  });

  describe("gst-compliant template", () => {
    it("includes GST-mandatory fields: HSN, taxable value, place of supply, reverse charge, amount in words, signature", () => {
      const html = renderInvoiceHtml("gst-compliant", DATA);
      expect(html).toContain("TAX INVOICE");
      expect(html).toContain("998314");
      expect(html).toContain("HSN/SAC Summary");
      expect(html).toContain("Taxable Value");
      expect(html).toContain("Place of Supply:</strong> 27 — Maharashtra");
      expect(html).toContain("Reverse Charge:</strong> No");
      expect(html).toContain("Amount in words:");
      expect(html).toContain("Twenty Nine Thousand Five Hundred Rupees Only");
      expect(html).toContain("Authorised Signatory");
    });

    it("splits CGST/SGST for intra-state and IGST for inter-state", () => {
      const intra = renderInvoiceHtml("gst-compliant", DATA);
      expect(intra).toContain("CGST");
      expect(intra).toContain("SGST");
      expect(intra).not.toContain("IGST");
      const inter = renderInvoiceHtml("gst-compliant", { ...DATA, interState: true });
      expect(inter).toContain("IGST");
      expect(inter).not.toContain("CGST %");
    });
  });

  it("escapes quotes via esc", () => {
    expect(esc('a"b<c>&')).toBe("a&quot;b&lt;c&gt;&amp;");
  });
});
