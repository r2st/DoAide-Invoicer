import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedbackWidget from "./FeedbackWidget";

beforeEach(() => {
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("FeedbackWidget", () => {
  it("renders the floating button", () => {
    render(<FeedbackWidget />);
    expect(screen.getByRole("button", { name: /feedback/i })).toBeInTheDocument();
  });

  it("opens modal on click", async () => {
    render(<FeedbackWidget />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /feedback/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Send Feedback")).toBeInTheDocument();
  });

  it("submits feedback and shows success", async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: true, json: () => ({ status: "ok" }) });
    render(<FeedbackWidget />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /feedback/i }));
    await user.selectOptions(screen.getByRole("combobox"), "Bug");
    await user.type(screen.getByPlaceholderText(/tell us/i), "Something broke");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /sent/i })).toBeInTheDocument());

    expect(globalThis.fetch).toHaveBeenCalledWith("/api/feedback", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ category: "Bug", message: "Something broke" }),
    }));
  });

  it("shows error on failure", async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false });
    render(<FeedbackWidget />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /feedback/i }));
    await user.type(screen.getByPlaceholderText(/tell us/i), "fail test");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  });

  it("closes modal on cancel", async () => {
    render(<FeedbackWidget />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /feedback/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
