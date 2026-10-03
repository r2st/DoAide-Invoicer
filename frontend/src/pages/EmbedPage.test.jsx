import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import EmbedPage from "./EmbedPage";

function renderEmbed() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <EmbedPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("EmbedPage", () => {
  it("renders page title", () => {
    renderEmbed();
    expect(screen.getByText("Embed Invoice Widget")).toBeInTheDocument();
  });

  it("renders customization section", () => {
    renderEmbed();
    expect(screen.getByText("Customize Widget")).toBeInTheDocument();
    expect(screen.getByLabelText("Button Text")).toBeInTheDocument();
  });

  it("renders style options", () => {
    renderEmbed();
    expect(screen.getByText("Primary (Gold)")).toBeInTheDocument();
    expect(screen.getByText("Outline")).toBeInTheDocument();
    expect(screen.getByText("Minimal (Text Link)")).toBeInTheDocument();
  });

  it("renders size options", () => {
    renderEmbed();
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("renders live preview", () => {
    renderEmbed();
    expect(screen.getByText("Live Preview")).toBeInTheDocument();
  });

  it("renders embed code sections", () => {
    renderEmbed();
    expect(screen.getByText("Button Embed Code")).toBeInTheDocument();
    expect(screen.getByText("Iframe Embed")).toBeInTheDocument();
  });

  it("renders copy buttons", () => {
    renderEmbed();
    expect(screen.getByText("Copy Button Code")).toBeInTheDocument();
    expect(screen.getByText("Copy Iframe Code")).toBeInTheDocument();
  });

  it("renders benefits section", () => {
    renderEmbed();
    expect(screen.getByText("Free for your visitors")).toBeInTheDocument();
    expect(screen.getByText("Professional invoices")).toBeInTheDocument();
    expect(screen.getByText("Powered by DoAide")).toBeInTheDocument();
  });

  it("updates button text when changed", async () => {
    const user = userEvent.setup();
    renderEmbed();
    const input = screen.getByLabelText("Button Text");
    await user.clear(input);
    await user.type(input, "Make Invoice");
    expect(screen.getByText("Make Invoice")).toBeInTheDocument();
  });
});
