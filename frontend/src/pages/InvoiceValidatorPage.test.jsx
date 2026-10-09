import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import InvoiceValidatorPage from "./InvoiceValidatorPage";

function renderPage() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <InvoiceValidatorPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("InvoiceValidatorPage", () => {
  it("renders page title", () => {
    renderPage();
    expect(screen.getByText("GST Invoice Validator")).toBeInTheDocument();
  });

  it("renders invoice detail inputs", () => {
    renderPage();
    expect(screen.getByPlaceholderText("INV-2026-001")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("22AAAAA0000A1Z5")).toBeInTheDocument();
  });

  it("renders line items section", () => {
    renderPage();
    expect(screen.getByText("Line Items")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders validate button", () => {
    renderPage();
    expect(screen.getByText("Validate Invoice")).toBeInTheDocument();
  });

  it("adds a new item when clicking add", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    await user.click(screen.getByText("+ Add Item"));
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("shows validation results after clicking validate", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("INV-2026-001"), "INV-001");
    await user.type(screen.getByPlaceholderText("22AAAAA0000A1Z5"), "27AAPFU0939F1ZV");
    await user.type(screen.getByPlaceholderText("9983"), "9983");
    await user.type(screen.getByPlaceholderText("10000"), "10000");
    await user.type(screen.getByPlaceholderText("1800"), "1800");

    await user.click(screen.getByText("Validate Invoice"));
    expect(screen.getByText("Compliance Score")).toBeInTheDocument();
    expect(screen.getByText("Validation Results")).toBeInTheDocument();
    expect(screen.getByText("Passed")).toBeInTheDocument();
  });

  it("shows WhatsApp share after validation", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText("Validate Invoice"));
    expect(screen.getByText("Share Results on WhatsApp")).toBeInTheDocument();
  });

  it("shows reset button after validation", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText("Validate Invoice"));
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("resets form when clicking reset", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText("INV-2026-001"), "TEST-001");
    await user.click(screen.getByText("Validate Invoice"));
    await user.click(screen.getByText("Reset"));
    expect(screen.queryByText("Compliance Score")).not.toBeInTheDocument();
  });

  it("renders CTA to create invoice", () => {
    renderPage();
    expect(screen.getByText("Create Free Invoice")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    renderPage();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("What fields are mandatory on a GST invoice?")).toBeInTheDocument();
  });

  it("toggles FAQ answer on click", async () => {
    const user = userEvent.setup();
    renderPage();
    const btn = screen.getByText("What fields are mandatory on a GST invoice?");
    await user.click(btn);
    expect(screen.getByText(/supplier name & GSTIN/)).toBeInTheDocument();
  });

  it("detects invalid GSTIN format", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText("22AAAAA0000A1Z5"), "INVALID");
    await user.click(screen.getByText("Validate Invoice"));
    expect(screen.getByText(/GSTIN must be 15 characters/)).toBeInTheDocument();
  });

  it("renders JSON-LD structured data", () => {
    renderPage();
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2);
  });
});
