import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import SitemapPage from "./SitemapPage";

function renderSitemap() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <SitemapPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("SitemapPage", () => {
  it("renders page title", () => {
    renderSitemap();
    expect(screen.getByText("Sitemap")).toBeInTheDocument();
  });

  it("renders homepage entry", () => {
    renderSitemap();
    expect(screen.getByText("Homepage")).toBeInTheDocument();
  });

  it("renders free tools entries", () => {
    renderSitemap();
    expect(screen.getByText("Free Invoice Generator")).toBeInTheDocument();
    expect(screen.getByText("Invoice Tax Calculator")).toBeInTheDocument();
    expect(screen.getByText("Invoice Templates Gallery")).toBeInTheDocument();
  });

  it("renders template entries", () => {
    renderSitemap();
    expect(screen.getByText("Standard Template")).toBeInTheDocument();
    expect(screen.getByText("Professional Template")).toBeInTheDocument();
    expect(screen.getByText("GST Compliant Template")).toBeInTheDocument();
  });

  it("renders blog entries", () => {
    renderSitemap();
    expect(screen.getByText("Free Invoice Generator India 2026")).toBeInTheDocument();
    expect(screen.getByText("GST Invoice Format Guide")).toBeInTheDocument();
  });

  it("renders priority column", () => {
    renderSitemap();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("1.0")).toBeInTheDocument();
  });
});
