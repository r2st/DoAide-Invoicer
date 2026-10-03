import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import TemplatesPage, { TEMPLATES } from "./TemplatesPage";

function renderTemplates() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <TemplatesPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("TemplatesPage", () => {
  it("renders page title", () => {
    renderTemplates();
    expect(screen.getByText("Invoice Templates")).toBeInTheDocument();
  });

  it("renders all 6 templates", () => {
    renderTemplates();
    for (const t of TEMPLATES) {
      expect(screen.getByText(t.name)).toBeInTheDocument();
    }
  });

  it("renders use template buttons for each template", () => {
    renderTemplates();
    expect(screen.getAllByText("Use Template")).toHaveLength(6);
  });

  it("renders preview buttons for each template", () => {
    renderTemplates();
    expect(screen.getAllByText("Preview")).toHaveLength(6);
  });

  it("renders template descriptions", () => {
    renderTemplates();
    expect(screen.getByText(/Clean, simple layout/)).toBeInTheDocument();
    expect(screen.getByText(/Corporate-style/)).toBeInTheDocument();
    expect(screen.getByText(/Ultra-clean/)).toBeInTheDocument();
  });

  it("renders tags", () => {
    renderTemplates();
    expect(screen.getAllByText("Free").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Popular").length).toBeGreaterThanOrEqual(1);
  });

  it("renders custom invoice CTA at the bottom", () => {
    renderTemplates();
    expect(screen.getByText("Create Custom Invoice")).toBeInTheDocument();
  });

  it("exports TEMPLATES array with 6 entries", () => {
    expect(TEMPLATES).toHaveLength(6);
    expect(TEMPLATES[0]).toHaveProperty("slug");
    expect(TEMPLATES[0]).toHaveProperty("name");
    expect(TEMPLATES[0]).toHaveProperty("description");
  });
});
