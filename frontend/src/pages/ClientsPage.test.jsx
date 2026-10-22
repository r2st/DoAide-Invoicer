import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ClientsPage from "./ClientsPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("ClientsPage", () => {
  beforeEach(() => { localStorage.clear(); });

  function renderPage() {
    return render(<MemoryRouter><ClientsPage /></MemoryRouter>);
  }

  it("renders the page heading", () => {
    renderPage();
    expect(screen.getByText("Clients")).toBeInTheDocument();
  });

  it("shows empty state when no clients exist", () => {
    renderPage();
    expect(screen.getByText("No clients saved yet")).toBeInTheDocument();
  });

  it("opens the form when clicking Add Client", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Add Client"));
    expect(screen.getByText("Add New Client")).toBeInTheDocument();
  });

  it("validates that client name is required", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Add Client"));
    fireEvent.click(screen.getByText("Save Client"));
    expect(screen.getByText("Client name is required.")).toBeInTheDocument();
  });

  it("creates a client and displays it in the table", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Add Client"));
    fireEvent.change(screen.getByPlaceholderText("Acme Corp"), { target: { value: "Test Client" } });
    fireEvent.change(screen.getByPlaceholderText("billing@acme.com"), { target: { value: "test@test.com" } });
    fireEvent.click(screen.getByText("Save Client"));
    expect(screen.getByText("Test Client")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("filters clients by search", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Add Client"));
    fireEvent.change(screen.getByPlaceholderText("Acme Corp"), { target: { value: "Alpha Inc" } });
    fireEvent.click(screen.getByText("Save Client"));

    fireEvent.click(screen.getByText("+ Add Client"));
    fireEvent.change(screen.getByPlaceholderText("Acme Corp"), { target: { value: "Beta LLC" } });
    fireEvent.click(screen.getByText("Save Client"));

    fireEvent.change(screen.getByPlaceholderText("Search clients by name..."), { target: { value: "Alpha" } });
    expect(screen.getByText("Alpha Inc")).toBeInTheDocument();
    expect(screen.queryByText("Beta LLC")).not.toBeInTheDocument();
  });

  it("deletes a client", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Add Client"));
    fireEvent.change(screen.getByPlaceholderText("Acme Corp"), { target: { value: "Delete Me" } });
    fireEvent.click(screen.getByText("Save Client"));
    expect(screen.getByText("Delete Me")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
  });

  it("cancels form without saving", () => {
    renderPage();
    fireEvent.click(screen.getByText("+ Add Client"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add New Client")).not.toBeInTheDocument();
  });
});
