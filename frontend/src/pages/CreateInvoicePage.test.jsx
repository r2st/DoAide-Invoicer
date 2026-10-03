import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import CreateInvoicePage from "./CreateInvoicePage";

const mockAuth = { user: null, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() };

function renderCreate(route = "/create") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <PageTitleProvider>
          <AuthContext.Provider value={mockAuth}>
            <CreateInvoicePage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("CreateInvoicePage", () => {
  it("renders page title", () => {
    renderCreate();
    expect(screen.getByText(/Create a Free Invoice/)).toBeInTheDocument();
  });

  it("renders from/to sections", () => {
    renderCreate();
    expect(screen.getByText("From (Your Business)")).toBeInTheDocument();
    expect(screen.getByText("Bill To (Client)")).toBeInTheDocument();
  });

  it("renders invoice details section", () => {
    renderCreate();
    expect(screen.getByText("Invoice Details")).toBeInTheDocument();
    expect(screen.getByLabelText("Invoice Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Invoice Date")).toBeInTheDocument();
  });

  it("renders line items section", () => {
    renderCreate();
    expect(screen.getByText("Line Items")).toBeInTheDocument();
    expect(screen.getByText("+ Add Item")).toBeInTheDocument();
  });

  it("renders summary sidebar", () => {
    renderCreate();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getAllByText("Total").length).toBeGreaterThanOrEqual(1);
  });

  it("renders action buttons", () => {
    renderCreate();
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
    expect(screen.getByText("Send via WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Share on Twitter")).toBeInTheDocument();
  });

  it("renders signup CTA", () => {
    renderCreate();
    expect(screen.getByText("Sign Up Free")).toBeInTheDocument();
  });

  it("adds a new line item when clicking add", async () => {
    const user = userEvent.setup();
    renderCreate();
    const descriptions = screen.getAllByPlaceholderText("Item or service");
    expect(descriptions).toHaveLength(1);
    await user.click(screen.getByText("+ Add Item"));
    expect(screen.getAllByPlaceholderText("Item or service")).toHaveLength(2);
  });

  it("auto-generates invoice number", () => {
    renderCreate();
    const input = screen.getByLabelText("Invoice Number");
    expect(input.value).toMatch(/^INV-\d{3}$/);
  });

  it("calculates total when rate is entered", async () => {
    const user = userEvent.setup();
    renderCreate();
    const rateInput = screen.getAllByPlaceholderText("0.00")[0];
    await user.clear(rateInput);
    await user.type(rateInput, "1000");
    expect(screen.getAllByText("₹1,000.00").length).toBeGreaterThanOrEqual(1);
  });
});
