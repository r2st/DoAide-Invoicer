import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBanner from "./ErrorBanner";

describe("ErrorBanner", () => {
  it("renders nothing when message is empty", () => {
    const { container } = render(<ErrorBanner message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the error message", () => {
    render(<ErrorBanner message="Something broke" />);
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("calls onDismiss when close is clicked", async () => {
    const dismiss = vi.fn();
    render(<ErrorBanner message="Error" onDismiss={dismiss} />);
    await userEvent.setup().click(screen.getByLabelText("Dismiss"));
    expect(dismiss).toHaveBeenCalledOnce();
  });
});
