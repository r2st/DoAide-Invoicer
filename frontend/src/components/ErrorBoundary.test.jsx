import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

function Boom() {
  throw new Error("test crash");
}

describe("ErrorBoundary", () => {
  it("renders children normally", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary><p>Hello</p></ErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("catches render errors and shows fallback", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <ErrorBoundary><Boom /></ErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByText("This screen hit an error")).toBeInTheDocument();
    expect(screen.getByText(/test crash/)).toBeInTheDocument();
    spy.mockRestore();
  });

  it("recovers after clicking try again", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    let shouldThrow = true;
    function MaybeThrow() {
      if (shouldThrow) throw new Error("boom");
      return <p>Recovered</p>;
    }

    render(
      <MemoryRouter>
        <ErrorBoundary><MaybeThrow /></ErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByText("This screen hit an error")).toBeInTheDocument();

    shouldThrow = false;
    await userEvent.setup().click(screen.getByText("Try again"));
    expect(screen.getByText("Recovered")).toBeInTheDocument();
    spy.mockRestore();
  });
});
