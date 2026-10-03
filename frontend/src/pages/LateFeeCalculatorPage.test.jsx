import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import LateFeeCalculatorPage from "./LateFeeCalculatorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("LateFeeCalculatorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><LateFeeCalculatorPage /></MemoryRouter>);
    expect(screen.getByText("Late Fee Calculator")).toBeInTheDocument();
  });

  it("shows penalty method buttons", () => {
    render(<MemoryRouter><LateFeeCalculatorPage /></MemoryRouter>);
    expect(screen.getByText("Flat Fee")).toBeInTheDocument();
    expect(screen.getByText("% of Invoice")).toBeInTheDocument();
    expect(screen.getByText("Daily Interest")).toBeInTheDocument();
  });

  it("displays result stat cards", () => {
    render(<MemoryRouter><LateFeeCalculatorPage /></MemoryRouter>);
    expect(screen.getByText("Days Late")).toBeInTheDocument();
    expect(screen.getByText("Late Fee")).toBeInTheDocument();
    expect(screen.getByText("Total Due")).toBeInTheDocument();
  });
});
