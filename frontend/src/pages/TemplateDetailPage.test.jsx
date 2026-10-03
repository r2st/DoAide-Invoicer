import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import TemplateDetailPage from "./TemplateDetailPage";

function renderDetail(slug = "standard") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[`/template/${slug}`]}>
        <PageTitleProvider>
          <Routes>
            <Route path="/template/:slug" element={<TemplateDetailPage />} />
          </Routes>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("TemplateDetailPage", () => {
  it("renders template name", () => {
    renderDetail("standard");
    expect(screen.getByText("Standard Invoice Template")).toBeInTheDocument();
  });

  it("renders template description", () => {
    renderDetail("professional");
    expect(screen.getByText(/Corporate-style/)).toBeInTheDocument();
  });

  it("renders features list", () => {
    renderDetail("gst-compliant");
    expect(screen.getByText("GSTIN fields")).toBeInTheDocument();
    expect(screen.getByText("HSN/SAC codes")).toBeInTheDocument();
  });

  it("renders use template CTA", () => {
    renderDetail("minimal");
    expect(screen.getAllByText(/Use This Template/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders share buttons", () => {
    renderDetail("creative");
    expect(screen.getByText("Share on WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Share on Twitter")).toBeInTheDocument();
  });

  it("renders related templates", () => {
    renderDetail("standard");
    expect(screen.getByText("More Templates")).toBeInTheDocument();
  });

  it("renders who is this for section", () => {
    renderDetail("international");
    expect(screen.getByText("Who Is This For?")).toBeInTheDocument();
  });

  it("renders not found for invalid slug", () => {
    renderDetail("nonexistent");
    expect(screen.getByText("Template not found")).toBeInTheDocument();
  });
});
