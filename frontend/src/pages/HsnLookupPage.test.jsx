import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import HsnLookupPage from "./HsnLookupPage";

function renderHsn() {
  const auth = { user: { id: "u1" }, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() };
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            <HsnLookupPage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("HsnLookupPage", () => {
  it("renders heading and search input", () => {
    renderHsn();
    expect(screen.getByText("HSN Code Lookup")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search HSN codes/)).toBeInTheDocument();
  });

  it("shows prompt to type more characters", () => {
    renderHsn();
    expect(screen.getByText("Type at least 2 characters to search")).toBeInTheDocument();
  });
});
