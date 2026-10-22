import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/invoices", label: "Invoices" },
  { to: "/clients", label: "Clients" },
  { to: "/upload", label: "Upload" },
  { to: "/hsn", label: "HSN Lookup" },
  { to: "/recurring", label: "Recurring" },
  { to: "/payments", label: "Payments" },
  { to: "/export", label: "Export" },
  { to: "/settings", label: "Settings" },
];

export default function Shell({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => { setNavOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setNavOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="flex items-center gap-4 lg:gap-8 px-4 lg:px-6 py-3 bg-surface border-b border-line">
        <div className="flex items-center gap-2 font-bold">
          <span className="text-xl text-ink-strong font-bold tracking-tight">
            <span className="text-brand">DoAide</span>
            <span className="text-ink-muted mx-1">|</span>
            <span>Invoicer</span>
          </span>
        </div>

        <button
          type="button"
          ref={toggleRef}
          className="lg:hidden ml-auto p-2 border border-line rounded-[var(--radius)] bg-surface cursor-pointer"
          aria-expanded={navOpen}
          aria-controls="main-nav"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span className="block w-4.5 h-0.5 bg-ink rounded relative before:content-[''] before:absolute before:w-full before:h-full before:bg-ink before:rounded before:-top-1.5 after:content-[''] after:absolute after:w-full after:h-full after:bg-ink after:rounded after:top-1.5" aria-hidden="true" />
          <span className="visually-hidden">{navOpen ? "Close menu" : "Open menu"}</span>
        </button>

        <nav
          id="main-nav"
          className={`${navOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row gap-1 lg:gap-1 flex-1 absolute lg:relative top-full left-0 right-0 lg:top-auto bg-surface lg:bg-transparent border-b lg:border-0 border-line p-3 lg:p-0 z-10`}
          aria-label="Main"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-[var(--radius)] text-sm transition-colors ${
                  isActive
                    ? "bg-[rgba(13,148,136,0.12)] text-brand font-semibold"
                    : "text-ink-soft hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user && (
            <span className="text-sm text-ink-soft">
              {user.name || user.phone || user.email}
            </span>
          )}
          <ThemeToggle />
          <button type="button" className="btn btn-ghost text-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {navOpen && (
        <div className="fixed inset-0 bg-black/25 z-[5] lg:hidden" onClick={() => setNavOpen(false)} aria-hidden="true" />
      )}

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6" id="main">
        {children}
      </main>
    </div>
  );
}
