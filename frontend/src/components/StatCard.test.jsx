import { render, screen } from "@testing-library/react";
import StatCard from "./StatCard";

describe("StatCard", () => {
  it("renders label, value, and sub", () => {
    render(<StatCard label="Invoices" value="42" sub="this month" tone="good" />);
    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("this month")).toBeInTheDocument();
  });

  it("applies tone class", () => {
    const { container } = render(<StatCard label="Test" value="0" tone="warn" />);
    expect(container.querySelector(".tone-warn")).toBeInTheDocument();
  });

  it("renders without sub", () => {
    render(<StatCard label="Count" value="10" />);
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
