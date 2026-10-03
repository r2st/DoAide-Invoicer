import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import SettingsPage from "./SettingsPage";

function renderSettings() {
  const auth = {
    user: { id: "u1", name: "Test User", email: "test@example.com", phone: "+91 98765", plan: "free", gstin: "27AAPFU0939F1ZV", invoice_count_this_month: 5 },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            <SettingsPage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("SettingsPage", () => {
  it("renders heading", () => {
    renderSettings();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders profile section", () => {
    renderSettings();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
  });

  it("renders WhatsApp setup", () => {
    renderSettings();
    expect(screen.getByText("WhatsApp Setup")).toBeInTheDocument();
    expect(screen.getByText("Open WhatsApp Chat")).toBeInTheDocument();
  });

  it("renders current plan", () => {
    renderSettings();
    expect(screen.getByText("Current Plan")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });
});
