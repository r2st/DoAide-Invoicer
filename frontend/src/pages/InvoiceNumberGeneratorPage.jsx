import { useState } from "react";
import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const CURRENT_FY_START = (() => {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
})();

const FORMAT_PRESETS = [
  { label: "INV-2026-001", pattern: "{prefix}-{fy4}-{seq}" },
  { label: "INV/26-27/0001", pattern: "{prefix}/{fy2s}-{fy2e}/{seq}" },
  { label: "COMPANY-001", pattern: "{prefix}-{seq}" },
  { label: "2026/INV/001", pattern: "{fy4}/{prefix}/{seq}" },
  { label: "Custom", pattern: "" },
];

function buildFYTokens(fyStart) {
  const fyEnd = fyStart + 1;
  return {
    fy4: String(fyStart),
    fy2s: String(fyStart).slice(2),
    fy2e: String(fyEnd).slice(2),
    fyFull: `${fyStart}-${fyEnd}`,
  };
}

function generateNumbers(prefix, fyStart, startNum, pattern, count) {
  const fy = buildFYTokens(fyStart);
  const results = [];
  for (let i = 0; i < count; i++) {
    const num = startNum + i;
    const padLen = String(startNum).length < 3 ? 3 : String(startNum).length;
    const seq = String(num).padStart(padLen, "0");
    let result = pattern
      .replace("{prefix}", prefix)
      .replace("{fy4}", fy.fy4)
      .replace("{fy2s}", fy.fy2s)
      .replace("{fy2e}", fy.fy2e)
      .replace("{fyFull}", fy.fyFull)
      .replace("{seq}", seq);
    results.push(result);
  }
  return results;
}

const FAQ_ITEMS = [
  {
    q: "Is sequential invoice numbering mandatory under GST?",
    a: "Yes. Under Section 16 of the CGST Act, every GST invoice must carry a unique, sequential serial number for each financial year. Gaps in numbering can lead to scrutiny during audits.",
  },
  {
    q: "Can I use alphanumeric invoice numbers?",
    a: "Yes. GST law allows alphanumeric serial numbers containing alphabets, numerals, and special characters like hyphens and slashes. Many businesses use prefixes like branch codes or financial year identifiers.",
  },
  {
    q: "Should invoice numbering reset every financial year?",
    a: "Yes. Invoice serial numbers should be unique within a financial year (April to March in India). Most businesses reset the sequence to 001 at the start of each new financial year.",
  },
  {
    q: "What happens if I skip an invoice number?",
    a: "Skipping invoice numbers can raise red flags during GST audits. If a number is skipped, you should document the reason. The GST department may interpret gaps as suppressed sales.",
  },
  {
    q: "Can different branches use separate invoice number series?",
    a: "Yes. Businesses with multiple branches or GSTINs can maintain separate invoice number series using unique prefixes for each branch, such as MUM-001, DEL-001.",
  },
  {
    q: "What is the maximum length of a GST invoice number?",
    a: "A GST invoice number can be up to 16 characters long. This includes alphabets, numerals, hyphens, and slashes. Plan your format within this limit.",
  },
];

export default function InvoiceNumberGeneratorPage() {
  usePageTitle("Invoice Number Generator — Free GST-Compliant Tool");
  const [prefix, setPrefix] = useState("INV");
  const [fyStart, setFyStart] = useState(CURRENT_FY_START);
  const [startNum, setStartNum] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPattern, setCustomPattern] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const pattern = selectedPreset < FORMAT_PRESETS.length - 1
    ? FORMAT_PRESETS[selectedPreset].pattern
    : customPattern || "{prefix}-{seq}";

  const numbers = generateNumbers(prefix, fyStart, startNum, pattern, 10);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(numbers.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const downloadCSV = () => {
    const csv = "Invoice Number\n" + numbers.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-numbers-${prefix}-${fyStart}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareWhatsApp = () => {
    const text = `Invoice Number Series (${prefix}, FY ${fyStart}-${fyStart + 1}):\n\n${numbers.join("\n")}\n\nGenerated with DoAide Invoicer — https://invoicer.doaide.com/tools/invoice-number-generator`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const fyOptions = [];
  for (let y = CURRENT_FY_START - 2; y <= CURRENT_FY_START + 2; y++) {
    fyOptions.push({ value: y, label: `${y}-${y + 1}` });
  }

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Invoice Number Generator</h1>
          <p className="tool-subtitle">
            Generate sequential, GST-compliant invoice numbers for your business — free, no signup required.
          </p>

          <div className="panel">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <label className="calc-label">
                Business Prefix
                <input
                  className="input-field"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
                  placeholder="INV"
                  maxLength={10}
                />
              </label>
              <label className="calc-label">
                Financial Year
                <select className="input-field" value={fyStart} onChange={(e) => setFyStart(Number(e.target.value))}>
                  {fyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="calc-label">
                Starting Number
                <input
                  type="number"
                  className="input-field"
                  min={1}
                  value={startNum}
                  onChange={(e) => setStartNum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                />
              </label>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ fontWeight: 600, color: "var(--ink-strong)", marginBottom: "0.75rem", fontSize: "1rem" }}>
              Format Pattern
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              {FORMAT_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedPreset(i)}
                  className={`btn ${selectedPreset === i ? "btn-primary" : "btn-ghost"}`}
                  style={{ minHeight: "44px" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {selectedPreset === FORMAT_PRESETS.length - 1 && (
              <div>
                <input
                  className="input-field"
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  placeholder="{prefix}-{fy4}-{seq}"
                />
                <p style={{ fontSize: "0.75rem", color: "var(--ink-muted)", marginTop: "0.5rem" }}>
                  Tokens: {"{prefix}"}, {"{fy4}"}, {"{fy2s}"}, {"{fy2e}"}, {"{fyFull}"}, {"{seq}"}
                </p>
              </div>
            )}
          </div>

          <div className="panel">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ fontWeight: 600, color: "var(--ink-strong)", fontSize: "1rem", margin: 0 }}>
                Preview — 10 Sequential Numbers
              </h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button type="button" onClick={copyAll} className="btn btn-ghost" style={{ minHeight: "44px" }}>
                  {copied ? "Copied!" : "Copy All"}
                </button>
                <button type="button" onClick={downloadCSV} className="btn btn-ghost" style={{ minHeight: "44px" }}>
                  Download CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invoice Number</th>
                  </tr>
                </thead>
                <tbody>
                  {numbers.map((n, i) => (
                    <tr key={i}>
                      <td className="font-mono text-ink-muted">{i + 1}</td>
                      <td className="font-mono font-semibold" style={{ color: "var(--brand)" }}>{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" onClick={shareWhatsApp} className="btn btn-whatsapp" style={{ minHeight: "44px" }}>
              Share on WhatsApp
            </button>
          </div>

          <div className="panel" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--ink-soft)" }}>
              Ready to use these numbers? Create a full GST invoice with auto-numbered series.
            </p>
            <Link to="/create" className="btn btn-primary" style={{ minHeight: "44px" }}>
              Create Free Invoice
            </Link>
          </div>

          <div className="panel">
            <h2 style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              GST Invoice Numbering Rules
            </h2>
            <div style={{ fontSize: "0.9rem", color: "var(--ink-soft)", lineHeight: 1.7 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                Under the GST Act (Section 16 of the CGST/SGST Acts), every tax invoice must contain a consecutive serial number, unique for a financial year. Key requirements:
              </p>
              <ul style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
                <li>Invoice numbers must be <strong>sequential</strong> — no gaps allowed</li>
                <li>Numbers must be <strong>unique within each financial year</strong> (April to March)</li>
                <li>Maximum <strong>16 characters</strong> — alphanumeric with hyphens and slashes</li>
                <li>One or more series can be maintained per GSTIN</li>
                <li>Separate series allowed for different branches or business verticals</li>
              </ul>
            </div>
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
            name: "Invoice Number Generator",
            description: "Generate sequential, GST-compliant invoice numbers for your business. Free online tool with multiple format options.",
            url: "https://invoicer.doaide.com/tools/invoice-number-generator",
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
