import { render, screen } from "@testing-library/react";
import { SkeletonStats, SkeletonTable, SkeletonText, SkeletonPanel, Spinner } from "./Skeleton";

describe("Skeleton components", () => {
  it("SkeletonText announces loading", () => {
    render(<SkeletonText label="Loading data" />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("SkeletonStats renders the right count of cards", () => {
    const { container } = render(<SkeletonStats count={3} />);
    expect(container.querySelectorAll(".stat-card")).toHaveLength(3);
  });

  it("SkeletonTable renders rows", () => {
    render(<SkeletonTable rows={4} columns={3} />);
    expect(screen.getByText("Loading table...")).toBeInTheDocument();
  });

  it("SkeletonPanel announces loading", () => {
    render(<SkeletonPanel label="Loading form" />);
    expect(screen.getByText("Loading form...")).toBeInTheDocument();
  });

  it("Spinner renders", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });
});
