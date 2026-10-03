import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import ExportPage from "./ExportPage";

function renderExport() {
  const auth = { user: { id: "u1" }, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() };
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            <ExportPage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("ExportPage", () => {
  it("renders heading", () => {
    renderExport();
    expect(screen.getByText("Export Invoices")).toBeInTheDocument();
  });

  it("renders format options", () => {
    renderExport();
    expect(screen.getByText("CSV")).toBeInTheDocument();
    expect(screen.getByText("Excel (.xlsx)")).toBeInTheDocument();
    expect(screen.getByText("GST Filing Format")).toBeInTheDocument();
  });

  it("renders download button", () => {
    renderExport();
    expect(screen.getByText("Download Export")).toBeInTheDocument();
  });
});
