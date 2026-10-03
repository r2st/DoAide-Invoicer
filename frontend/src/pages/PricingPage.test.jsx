import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../hooks/useTheme";
import { PageTitleProvider } from "../hooks/usePageTitle";
import PricingPage from "./PricingPage";

function renderPricing() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <PricingPage />
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
    expect(screen.getByText("CA Plan")).toBeInTheDocument();
  });

  it("renders the most popular badge", () => {
    renderPricing();
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("renders pricing amounts", () => {
    renderPricing();
    expect(screen.getByText("₹999")).toBeInTheDocument();
    expect(screen.getByText("₹2,999")).toBeInTheDocument();
  });
});
