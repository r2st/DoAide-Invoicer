import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import GstRateFinderPage from "./GstRateFinderPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("GstRateFinderPage", () => {
  function renderPage() {
    return render(<MemoryRouter><GstRateFinderPage /></MemoryRouter>);
  }

  it("renders the page heading", () => {
    renderPage();
    expect(screen.getByText("GST Rate Finder")).toBeInTheDocument();
  });

  it("shows all items by default", () => {
    renderPage();
    expect(screen.getByText(/Showing \d+ of \d+ items/)).toBeInTheDocument();
  });

  it("filters results by search query", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/Search products or services/);
    fireEvent.change(input, { target: { value: "cement" } });
    expect(screen.getByText("Cement")).toBeInTheDocument();
    expect(screen.queryByText("Mobile phones")).not.toBeInTheDocument();
  });

  it("filters results by category", () => {
    renderPage();
    const select = screen.getByDisplayValue("All Categories");
    fireEvent.change(select, { target: { value: "Electronics" } });
    expect(screen.getByText("Mobile phones")).toBeInTheDocument();
    expect(screen.queryByText("Cement")).not.toBeInTheDocument();
  });

  it("shows HSN codes in results", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/Search products or services/);
    fireEvent.change(input, { target: { value: "laptop" } });
    expect(screen.getByText("8471")).toBeInTheDocument();
  });

  it("shows SAC codes for services", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/Search products or services/);
    fireEvent.change(input, { target: { value: "IT / Software" } });
    expect(screen.getByText("9983")).toBeInTheDocument();
  });

  it("searches by HSN code", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/Search products or services/);
    fireEvent.change(input, { target: { value: "2523" } });
    expect(screen.getByText("Cement")).toBeInTheDocument();
  });

  it("shows no results message for invalid query", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/Search products or services/);
    fireEvent.change(input, { target: { value: "xyznonexistent" } });
    expect(screen.getByText(/No results found/)).toBeInTheDocument();
  });

  it("shows info cards about HSN, SAC, and GST slabs", () => {
    renderPage();
    expect(screen.getByText("What is HSN Code?")).toBeInTheDocument();
    expect(screen.getByText("What is SAC Code?")).toBeInTheDocument();
    expect(screen.getByText("GST Rate Slabs")).toBeInTheDocument();
  });

  it("has a CTA to create GST invoice", () => {
    renderPage();
    const link = screen.getByText("Create GST Invoice");
    expect(link.closest("a")).toHaveAttribute("href", "/create?template=gst-compliant");
  });
});
