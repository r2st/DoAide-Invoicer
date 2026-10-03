import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithProviders } from "../test/helpers";
import DashboardPage from "./DashboardPage";
import * as apiModule from "../lib/api";

vi.mock("../lib/api", async () => {
  const actual = await vi.importActual("../lib/api");
  return {
    ...actual,
    api: {
      ...actual.api,
      stats: vi.fn().mockResolvedValue({
        total_invoices: 42,
        this_month: 10,
        quota_used: 10,
        quota_limit: 25,
        total_amount: 150000,
        pending_review: 3,
        plan: "free",
      }),
      listInvoices: vi.fn().mockResolvedValue({
        items: [
          { id: "1", vendor_name: "ABC Traders", invoice_number: "INV-001", invoice_date: "2026-09-28", total: 32450, status: "approved", source: "whatsapp" },
          { id: "2", vendor_name: "XYZ Corp", invoice_number: "INV-002", invoice_date: "2026-09-25", total: 15000, status: "extracted", source: "web_upload" },
        ],
        total: 2,
      }),
    },
  };
});

describe("DashboardPage", () => {
  it("shows loading skeleton initially", () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText("Loading summary...")).toBeInTheDocument();
  });

  it("renders stats after loading", async () => {
    renderWithProviders(<DashboardPage />);
    await waitFor(() => expect(screen.getByText("42")).toBeInTheDocument());
    expect(screen.getByText("Total Invoices")).toBeInTheDocument();
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });

  it("renders recent invoices table", async () => {
    renderWithProviders(<DashboardPage />);
    await waitFor(() => expect(screen.getByText("ABC Traders")).toBeInTheDocument());
    expect(screen.getByText("XYZ Corp")).toBeInTheDocument();
  });

  it("shows upload button", async () => {
    renderWithProviders(<DashboardPage />);
    await waitFor(() => expect(screen.getByText("Upload Invoices")).toBeInTheDocument());
  });
});
