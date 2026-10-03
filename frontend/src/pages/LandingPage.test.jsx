import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import LandingPage from "./LandingPage";

function renderLanding() {
  const auth = { user: null, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() };
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            <LandingPage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("LandingPage", () => {
  it("renders the headline", () => {
    renderLanding();
    expect(screen.getByText(/Create a Free Invoice/)).toBeInTheDocument();
  });

  it("renders the primary CTA", () => {
    renderLanding();
    expect(screen.getAllByText("Create Free Invoice").length).toBeGreaterThanOrEqual(1);
  });

  it("renders pricing section", () => {
    renderLanding();
    expect(screen.getByText("Simple, transparent pricing")).toBeInTheDocument();
  });

  it("renders auth form", () => {
    renderLanding();
    expect(screen.getAllByText("Sign in").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Create account")).toBeInTheDocument();
  });

  it("renders free tools section", () => {
    renderLanding();
    expect(screen.getAllByText(/Invoice Generator/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tax Calculator/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Invoice Templates/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders how it works section", () => {
    renderLanding();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Fill in details")).toBeInTheDocument();
  });

  it("renders invoices generated counter", () => {
    renderLanding();
    expect(screen.getByText("10,000+")).toBeInTheDocument();
  });

  it("renders footer with navigation links", () => {
    renderLanding();
    expect(screen.getByText("Free Tools")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
  });
});
