import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TOOLS = [
  { path: "/create", title: "Invoice Generator", description: "Create a professional invoice and download it as PDF — no sign-up needed.", icon: "🧾" },
  { path: "/calculator", title: "Invoice Tax Calculator", description: "Calculate GST, CGST, SGST, and IGST for your invoices.", icon: "🧮" },
  { path: "/tools/payment-terms", title: "Payment Terms Calculator", description: "Calculate due dates and early payment discounts for any invoice.", icon: "📅" },
  { path: "/tools/late-fee", title: "Late Fee Calculator", description: "Calculate late payment penalties and interest charges.", icon: "⏰" },
  { path: "/templates", title: "Invoice Templates", description: "Browse free invoice templates for different industries.", icon: "📁" },
];

export default function ToolsIndexPage() {
  usePageTitle("Free Invoice Tools — No Sign-up Required");
  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Free Invoice Tools</h1>
          <p className="tool-subtitle">
            Create invoices, calculate taxes, and manage payment terms — no sign-up required.
          </p>
          <div className="tools-grid">
            {TOOLS.map((t) => (
              <Link key={t.path} to={t.path} className="tool-card">
                <span className="tool-card-icon">{t.icon}</span>
                <h2 className="tool-card-title">{t.title}</h2>
                <p className="tool-card-desc">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Invoice Tools",
            description: "Free invoice tools — generator, tax calculator, payment terms, late fees.",
            url: "https://invoicer.doaide.com/tools",
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
