import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { ThemeProvider } from "../hooks/useTheme";
import { PageTitleProvider } from "../hooks/usePageTitle";
import PricingPage from "./PricingPage";

const mockAuth = {
  user: null,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

function renderPricing(authOverrides = {}) {
  const auth = { ...mockAuth, ...authOverrides };
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            <PricingPage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("PricingPage", () => {
  it("renders heading", () => {
    renderPricing();
    expect(screen.getByText("Simple, transparent pricing")).toBeInTheDocument();
  });

  it("renders all three plans", () => {
    renderPricing();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("renders the most popular badge on Pro", () => {
    renderPricing();
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("renders correct pricing amounts", () => {
    renderPricing();
    expect(screen.getByText("₹0")).toBeInTheDocument();
    expect(screen.getByText("₹349")).toBeInTheDocument();
    expect(screen.getByText("₹999")).toBeInTheDocument();
  });

  it("renders free tier features", () => {
    renderPricing();
    expect(screen.getByText("5 invoices/month")).toBeInTheDocument();
    expect(screen.getByText("Basic templates")).toBeInTheDocument();
    expect(screen.getByText("Email delivery")).toBeInTheDocument();
  });

  it("renders pro tier features", () => {
    renderPricing();
    expect(screen.getByText("Unlimited invoices")).toBeInTheDocument();
    expect(screen.getAllByText("Custom branding").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Payment tracking")).toBeInTheDocument();
    expect(screen.getByText("Multi-currency support")).toBeInTheDocument();
  });

  it("renders enterprise tier features", () => {
    renderPricing();
    expect(screen.getByText("Everything in Pro")).toBeInTheDocument();
    expect(screen.getByText("Bulk invoicing")).toBeInTheDocument();
    expect(screen.getByText("Team accounts")).toBeInTheDocument();
    expect(screen.getByText("Advanced analytics")).toBeInTheDocument();
    expect(screen.getByText("GST integration")).toBeInTheDocument();
  });

  it("shows Current Plan for authenticated user on free plan", () => {
    renderPricing({
      user: { id: 1, plan: "free", phone: "+919876543210" },
    });
    expect(screen.getByText("Current Plan")).toBeInTheDocument();
  });

  it("shows upgrade buttons for free user", () => {
    renderPricing({
      user: { id: 1, plan: "free", phone: "+919876543210" },
    });
    expect(screen.getByText("Upgrade to Pro")).toBeInTheDocument();
    expect(screen.getByText("Upgrade to Enterprise")).toBeInTheDocument();
  });

  it("shows Current Plan on pro for pro user", () => {
    renderPricing({
      user: { id: 1, plan: "pro", phone: "+919876543210" },
    });
    const buttons = screen.getAllByText("Current Plan");
    expect(buttons.length).toBe(1);
  });

  it("renders Get Started Free link for unauthenticated users", () => {
    renderPricing();
    expect(screen.getByText("Get Started Free")).toBeInTheDocument();
  });
});
