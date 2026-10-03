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
    expect(screen.getByText(/Invoice photos to/)).toBeInTheDocument();
  });

  it("renders the WhatsApp CTA", () => {
    renderLanding();
    expect(screen.getByText("Start on WhatsApp")).toBeInTheDocument();
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

  it("renders feature cards", () => {
    renderLanding();
    expect(screen.getByText(/WhatsApp-First/)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered OCR/)).toBeInTheDocument();
  });
});
