import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../hooks/useTheme";
import ThemeToggle from "./ThemeToggle";

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("renders with initial theme label", () => {
    renderToggle();
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", expect.stringContaining("Auto"));
  });

  it("cycles through themes on click", async () => {
    renderToggle();
    const btn = screen.getByRole("button");
    const user = userEvent.setup();

    await user.click(btn);
    expect(btn).toHaveAttribute("aria-label", expect.stringContaining("Light"));

    await user.click(btn);
    expect(btn).toHaveAttribute("aria-label", expect.stringContaining("Dark"));

    await user.click(btn);
    expect(btn).toHaveAttribute("aria-label", expect.stringContaining("Auto"));
  });
});
