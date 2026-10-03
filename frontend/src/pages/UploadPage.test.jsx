import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import UploadPage from "./UploadPage";

function renderUpload() {
  const auth = { user: { id: "u1", name: "Test" }, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() };
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <AuthContext.Provider value={auth}>
            <UploadPage />
          </AuthContext.Provider>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("UploadPage", () => {
  it("renders the heading", () => {
    renderUpload();
    expect(screen.getByText("Upload Invoices")).toBeInTheDocument();
  });

  it("renders the drag-and-drop zone", () => {
    renderUpload();
    expect(screen.getByText("Drag and drop invoice images here")).toBeInTheDocument();
  });

  it("renders the choose files button", () => {
    renderUpload();
    expect(screen.getByText("Choose files")).toBeInTheDocument();
  });
});
