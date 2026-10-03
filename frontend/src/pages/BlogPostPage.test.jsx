import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import BlogPostPage from "./BlogPostPage";

function renderPost(slug = "free-invoice-generator-india-2026") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[`/blog/${slug}`]}>
        <PageTitleProvider>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("BlogPostPage", () => {
  it("renders post title for free-invoice-generator", () => {
    renderPost("free-invoice-generator-india-2026");
    expect(screen.getByText("Free Invoice Generator India 2026")).toBeInTheDocument();
  });

  it("renders post title for gst-invoice-format-guide", () => {
    renderPost("gst-invoice-format-guide");
    expect(screen.getByText("GST Invoice Format Guide")).toBeInTheDocument();
  });

  it("renders post title for professional-invoices", () => {
    renderPost("how-to-create-professional-invoices");
    expect(screen.getByText("How to Create Professional Invoices")).toBeInTheDocument();
  });

  it("renders author", () => {
    renderPost();
    expect(screen.getByText("By DoAide Team")).toBeInTheDocument();
  });

  it("renders article sections", () => {
    renderPost("free-invoice-generator-india-2026");
    expect(screen.getByText(/Why Indian Businesses Need/)).toBeInTheDocument();
    expect(screen.getByText("Features to Look For")).toBeInTheDocument();
  });

  it("renders share buttons", () => {
    renderPost();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("renders related articles", () => {
    renderPost();
    expect(screen.getByText("Related Articles")).toBeInTheDocument();
  });

  it("renders not found for invalid slug", () => {
    renderPost("nonexistent");
    expect(screen.getByText("Post not found")).toBeInTheDocument();
  });

  it("renders inline CTA buttons", () => {
    renderPost("free-invoice-generator-india-2026");
    expect(screen.getByText("Create Your Free Invoice Now")).toBeInTheDocument();
  });
});
