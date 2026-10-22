import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PaymentTrackingPage from "./PaymentTrackingPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("PaymentTrackingPage", () => {
  beforeEach(() => { localStorage.clear(); });

  function renderPage() {
    return render(<MemoryRouter><PaymentTrackingPage /></MemoryRouter>);
  }

  it("renders the page heading", () => {
    renderPage();
    expect(screen.getByText("Payment Tracking")).toBeInTheDocument();
  });

  it("shows empty state when no payments exist", () => {
    renderPage();
    expect(screen.getByText("No payment records yet")).toBeInTheDocument();
  });

  it("opens the form when clicking Record Payment", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Record Payment"));
    expect(screen.getByText("Record a Payment")).toBeInTheDocument();
  });

  it("validates invoice number is required", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Record Payment"));
    fireEvent.click(screen.getByText("Save Record"));
    expect(screen.getByText("Invoice number is required.")).toBeInTheDocument();
  });

  it("validates amount is greater than zero", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Record Payment"));
    fireEvent.change(screen.getByPlaceholderText("INV-001"), { target: { value: "INV-100" } });
    fireEvent.click(screen.getByText("Save Record"));
    expect(screen.getByText("Amount must be greater than zero.")).toBeInTheDocument();
  });

  it("creates a payment record and displays it", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Record Payment"));
    fireEvent.change(screen.getByPlaceholderText("INV-001"), { target: { value: "INV-100" } });
    fireEvent.change(screen.getByPlaceholderText("Acme Corp"), { target: { value: "Test Client" } });
    fireEvent.change(screen.getByPlaceholderText("25000"), { target: { value: "15000" } });
    fireEvent.click(screen.getByText("Save Record"));
    expect(screen.getByText("INV-100")).toBeInTheDocument();
    expect(screen.getByText("Test Client")).toBeInTheDocument();
    // "Pending" appears in both the chip and the filter button
    const pendingChip = screen.getAllByText("Pending").find((el) => el.classList.contains("chip"));
    expect(pendingChip).toBeInTheDocument();
  });

  it("marks a payment as paid", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Record Payment"));
    fireEvent.change(screen.getByPlaceholderText("INV-001"), { target: { value: "INV-200" } });
    fireEvent.change(screen.getByPlaceholderText("25000"), { target: { value: "5000" } });
    fireEvent.click(screen.getByText("Save Record"));
    fireEvent.click(screen.getByText("Mark Paid"));
    // "Paid" appears in both the chip and the filter button
    const paidChip = screen.getAllByText("Paid").find((el) => el.classList.contains("chip"));
    expect(paidChip).toBeInTheDocument();
  });

  it("filters payments by status", () => {
    renderPage();
    // Create a pending payment
    fireEvent.click(screen.getByText("+ Record Payment"));
    fireEvent.change(screen.getByPlaceholderText("INV-001"), { target: { value: "INV-300" } });
    fireEvent.change(screen.getByPlaceholderText("25000"), { target: { value: "1000" } });
    fireEvent.click(screen.getByText("Save Record"));

    // Filter by "Paid" (the tab button, not the chip)
    const filterButtons = screen.getAllByText("Paid");
    const filterBtn = filterButtons.find((el) => el.tagName === "BUTTON" && el.classList.contains("btn"));
    if (filterBtn) fireEvent.click(filterBtn);
    expect(screen.queryByText("INV-300")).not.toBeInTheDocument();
  });

  it("displays stat cards", () => {
    renderPage();
    expect(screen.getByText("Outstanding")).toBeInTheDocument();
    expect(screen.getByText("Total Collected")).toBeInTheDocument();
  });
});
