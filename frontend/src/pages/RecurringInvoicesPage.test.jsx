import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RecurringInvoicesPage from "./RecurringInvoicesPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("RecurringInvoicesPage", () => {
  function renderPage() {
    return render(<MemoryRouter><RecurringInvoicesPage /></MemoryRouter>);
  }

  it("renders the page heading", () => {
    renderPage();
    expect(screen.getByText("Recurring Invoices")).toBeInTheDocument();
  });

  it("shows empty state when no schedules exist", () => {
    renderPage();
    expect(screen.getByText("No recurring invoices yet")).toBeInTheDocument();
  });

  it("opens the form when clicking New Schedule", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ New Schedule"));
    expect(screen.getByText("Create Recurring Invoice")).toBeInTheDocument();
  });

  it("validates required fields", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ New Schedule"));
    fireEvent.click(screen.getByText("Create Schedule"));
    expect(screen.getByText("Client name is required.")).toBeInTheDocument();
  });

  it("validates amount is greater than zero", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ New Schedule"));
    const clientInput = screen.getByPlaceholderText("Acme Corp");
    fireEvent.change(clientInput, { target: { value: "Test Client" } });
    fireEvent.click(screen.getByText("Create Schedule"));
    expect(screen.getByText("Amount must be greater than zero.")).toBeInTheDocument();
  });

  it("creates a schedule and displays it", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ New Schedule"));

    fireEvent.change(screen.getByPlaceholderText("Acme Corp"), { target: { value: "Test Client" } });
    fireEvent.change(screen.getByPlaceholderText("25000"), { target: { value: "15000" } });
    fireEvent.change(screen.getByDisplayValue("Monthly"), { target: { value: "weekly" } });

    const dateInputs = screen.getAllByDisplayValue("");
    const startDateInput = dateInputs.find((el) => el.type === "date");
    if (startDateInput) fireEvent.change(startDateInput, { target: { value: "2026-11-01" } });

    fireEvent.click(screen.getByText("Create Schedule"));

    expect(screen.getByText("Test Client")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("cancels form without creating schedule", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ New Schedule"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Create Recurring Invoice")).not.toBeInTheDocument();
  });

  it("shows frequency options in the form", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ New Schedule"));
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Quarterly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });
});
