import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";

const MOCK_USER = {
  id: "u1",
  name: "Test User",
  email: "test@example.com",
  phone: "+919876543210",
  plan: "free",
  gstin: "27AAPFU0939F1ZV",
  state_code: "27",
  invoice_count_this_month: 5,
};

export function renderWithProviders(ui, {
  user = MOCK_USER,
  loading = false,
  route = "/",
} = {}) {
  const auth = {
    user,
    loading,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            {ui}
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

export { MOCK_USER };
