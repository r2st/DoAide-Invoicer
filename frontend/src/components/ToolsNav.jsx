import { Link, useLocation } from "react-router-dom";

const TOOLS = [
  { path: "/tools", label: "All Tools" },
  { path: "/create", label: "Invoice Generator" },
  { path: "/calculator", label: "Tax Calculator" },
  { path: "/tools/invoice-number-generator", label: "Number Generator" },
  { path: "/tools/invoice-validator", label: "Validator" },
  { path: "/tools/gst-rate-finder", label: "GST Rates" },
  { path: "/templates", label: "Templates" },
];

export default function ToolsNav() {
  const { pathname } = useLocation();
  return (
    <nav className="tools-nav">
      <Link to="/" className="tools-nav-brand">
        DoAide <em>Invoicer</em>
      </Link>
      <div className="tools-nav-links">
        {TOOLS.map((t) => (
          <Link key={t.path} to={t.path} className={`tools-nav-link${pathname === t.path ? " active" : ""}`}>
            {t.label}
          </Link>
        ))}
      </div>
      <Link to="/" className="tools-nav-cta">Sign up free</Link>
    </nav>
  );
}
