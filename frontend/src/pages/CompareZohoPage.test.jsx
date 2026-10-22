import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import CompareZohoPage from "./CompareZohoPage";

function renderPage() {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/compare/zoho-invoice"]}>
        <PageTitleProvider>
          <CompareZohoPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("CompareZohoPage", () => {
  it("renders the comparison heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("DoAide Invoicer vs Zoho Invoice");
  });

  it("renders the comparison table with both products", () => {
    renderPage();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Sign-up required")).toBeInTheDocument();
    expect(screen.getAllByText(/GST-compliant tax invoice/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders FAQ section and CTA to create an invoice", () => {
    renderPage();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Create a Free Invoice")).toHaveAttribute("href", "/create");
  });

  it("emits FAQPage JSON-LD", () => {
    const { container } = renderPage();
    const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')];
    const data = scripts.flatMap((s) => {
      const parsed = JSON.parse(s.textContent);
      return Array.isArray(parsed) ? parsed : [parsed];
    });
    expect(data.some((d) => d["@type"] === "FAQPage")).toBe(true);
  });
});
