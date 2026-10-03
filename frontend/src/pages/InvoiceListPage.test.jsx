import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithProviders } from "../test/helpers";
import InvoiceListPage from "./InvoiceListPage";
import * as apiModule from "../lib/api";

vi.mock("../lib/api", async () => {
  const actual = await vi.importActual("../lib/api");
  return {
    ...actual,
    api: {
      ...actual.api,
      listInvoices: vi.fn().mockResolvedValue({
        items: [
          { id: "1", vendor_name: "ABC Traders", invoice_number: "INV-001", invoice_date: "2026-09-28", total: 32450, status: "approved", source: "whatsapp" },
        ],
        total: 1,
      }),
    },
  };
});

describe("InvoiceListPage", () => {
  it("renders the page heading", () => {
    renderWithProviders(<InvoiceListPage />);
    expect(screen.getByText("Invoices")).toBeInTheDocument();
  });

  it("renders invoices after loading", async () => {
    renderWithProviders(<InvoiceListPage />);
    await waitFor(() => expect(screen.getByText("ABC Traders")).toBeInTheDocument());
  });

  it("renders search and filter inputs", () => {
    renderWithProviders(<InvoiceListPage />);
    expect(screen.getByPlaceholderText("Search by vendor name...")).toBeInTheDocument();
    expect(screen.getByDisplayValue("All statuses")).toBeInTheDocument();
  });
});
