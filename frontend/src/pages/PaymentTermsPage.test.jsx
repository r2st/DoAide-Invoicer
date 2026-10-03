import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PaymentTermsPage from "./PaymentTermsPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("PaymentTermsPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><PaymentTermsPage /></MemoryRouter>);
    expect(screen.getByText("Payment Terms Calculator")).toBeInTheDocument();
  });

  it("shows due date and early pay results", () => {
    render(<MemoryRouter><PaymentTermsPage /></MemoryRouter>);
    expect(screen.getByText("Due Date")).toBeInTheDocument();
    expect(screen.getByText("Early Pay By")).toBeInTheDocument();
    expect(screen.getByText("You Save")).toBeInTheDocument();
  });

  it("displays Net 30 as default payment term", () => {
    render(<MemoryRouter><PaymentTermsPage /></MemoryRouter>);
    const select = screen.getByDisplayValue("Net 30");
    expect(select).toBeInTheDocument();
  });
});
