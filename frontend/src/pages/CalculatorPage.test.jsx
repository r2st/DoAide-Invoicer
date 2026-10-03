import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import CalculatorPage from "./CalculatorPage";

function renderCalc() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <CalculatorPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("CalculatorPage", () => {
  it("renders page title", () => {
    renderCalc();
    expect(screen.getByText("Invoice Tax Calculator")).toBeInTheDocument();
  });

  it("renders stat cards", () => {
    renderCalc();
    expect(screen.getAllByText("Subtotal").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Total Tax").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Grand Total").length).toBeGreaterThanOrEqual(1);
  });

  it("renders add item button", () => {
    renderCalc();
    expect(screen.getByText("+ Add Item")).toBeInTheDocument();
  });

  it("adds a new item when clicking add", async () => {
    const user = userEvent.setup();
    renderCalc();
    expect(screen.getAllByPlaceholderText("Item or service")).toHaveLength(1);
    await user.click(screen.getByText("+ Add Item"));
    expect(screen.getAllByPlaceholderText("Item or service")).toHaveLength(2);
  });

  it("renders GST reference table", () => {
    renderCalc();
    expect(screen.getByText("Common GST Rates — Quick Reference")).toBeInTheDocument();
    expect(screen.getByText("Electronics & appliances")).toBeInTheDocument();
  });

  it("renders inter-state toggle", () => {
    renderCalc();
    expect(screen.getByText("Inter-state (IGST)")).toBeInTheDocument();
  });

  it("renders inclusive tax toggle", () => {
    renderCalc();
    expect(screen.getByText("Amount includes tax")).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    renderCalc();
    expect(screen.getByText("Create Full Invoice")).toBeInTheDocument();
    expect(screen.getByText("Share on WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Share on Twitter")).toBeInTheDocument();
  });

  it("renders bottom CTA", () => {
    renderCalc();
    expect(screen.getByText("Create Free Invoice")).toBeInTheDocument();
  });

  it("calculates tax when amount is entered", async () => {
    const user = userEvent.setup();
    renderCalc();
    const amountInput = screen.getAllByPlaceholderText("0.00")[0];
    await user.clear(amountInput);
    await user.type(amountInput, "10000");
    expect(screen.getAllByText("₹10,000.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("₹1,800.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("₹11,800.00").length).toBeGreaterThanOrEqual(1);
  });
});
