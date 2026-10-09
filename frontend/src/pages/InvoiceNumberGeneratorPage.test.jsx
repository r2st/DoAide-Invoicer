import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import InvoiceNumberGeneratorPage from "./InvoiceNumberGeneratorPage";

function renderPage() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <InvoiceNumberGeneratorPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("InvoiceNumberGeneratorPage", () => {
  it("renders page title", () => {
    renderPage();
    expect(screen.getByText("Invoice Number Generator")).toBeInTheDocument();
  });

  it("renders prefix input with default value", () => {
    renderPage();
    expect(screen.getByDisplayValue("INV")).toBeInTheDocument();
  });

  it("renders format preset buttons", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "INV-2026-001" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "INV/26-27/0001" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
  });

  it("generates 10 sequential numbers", () => {
    renderPage();
    expect(screen.getByText("Preview — 10 Sequential Numbers")).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThanOrEqual(11);
  });

  it("renders Copy All and Download CSV buttons", () => {
    renderPage();
    expect(screen.getByText("Copy All")).toBeInTheDocument();
    expect(screen.getByText("Download CSV")).toBeInTheDocument();
  });

  it("renders WhatsApp share button", () => {
    renderPage();
    expect(screen.getByText("Share on WhatsApp")).toBeInTheDocument();
  });

  it("renders CTA to create invoice", () => {
    renderPage();
    expect(screen.getByText("Create Free Invoice")).toBeInTheDocument();
  });

  it("renders GST numbering rules section", () => {
    renderPage();
    expect(screen.getByText("GST Invoice Numbering Rules")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    renderPage();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Is sequential invoice numbering mandatory under GST?")).toBeInTheDocument();
  });

  it("toggles FAQ answer on click", async () => {
    const user = userEvent.setup();
    renderPage();
    const btn = screen.getByText("Is sequential invoice numbering mandatory under GST?");
    await user.click(btn);
    expect(screen.getByText(/Under Section 16 of the CGST Act/)).toBeInTheDocument();
  });

  it("shows custom pattern input when Custom is selected", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText("Custom"));
    expect(screen.getByPlaceholderText("{prefix}-{fy4}-{seq}")).toBeInTheDocument();
  });

  it("changes prefix and updates preview", async () => {
    const user = userEvent.setup();
    renderPage();
    const input = screen.getByDisplayValue("INV");
    await user.clear(input);
    await user.type(input, "ABC");
    expect(screen.getAllByText(/ABC-/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders JSON-LD structured data", () => {
    renderPage();
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2);
  });
});
