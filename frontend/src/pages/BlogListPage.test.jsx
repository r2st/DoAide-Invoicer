import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageTitleProvider } from "../hooks/usePageTitle";
import { ThemeProvider } from "../hooks/useTheme";
import BlogListPage, { BLOG_POSTS } from "./BlogListPage";

function renderBlog() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PageTitleProvider>
          <BlogListPage />
        </PageTitleProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("BlogListPage", () => {
  it("renders page title", () => {
    renderBlog();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("renders all blog posts", () => {
    renderBlog();
    for (const post of BLOG_POSTS) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    }
  });

  it("renders post excerpts", () => {
    renderBlog();
    expect(screen.getByText(/thousands of Indian businesses/)).toBeInTheDocument();
  });

  it("renders read more links", () => {
    renderBlog();
    expect(screen.getAllByText("Read more →")).toHaveLength(BLOG_POSTS.length);
  });

  it("renders read time", () => {
    renderBlog();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("renders CTA at bottom", () => {
    renderBlog();
    expect(screen.getByText("Create Free Invoice")).toBeInTheDocument();
  });

  it("exports BLOG_POSTS array", () => {
    expect(BLOG_POSTS).toHaveLength(10);
    expect(BLOG_POSTS[0]).toHaveProperty("slug");
    expect(BLOG_POSTS[0]).toHaveProperty("title");
  });

  it("includes GST vs Regular Invoice post", () => {
    const gstPost = BLOG_POSTS.find((p) => p.slug === "gst-invoice-vs-regular-invoice");
    expect(gstPost).toBeTruthy();
    expect(gstPost.title).toContain("GST Invoice vs Regular Invoice");
  });

  it("includes GST Invoice Format 2026 post", () => {
    const post = BLOG_POSTS.find((p) => p.slug === "gst-invoice-format-2026-complete-guide");
    expect(post).toBeTruthy();
    expect(post.title).toContain("GST Invoice Format 2026");
  });

  it("includes E-Invoicing Under GST post", () => {
    const post = BLOG_POSTS.find((p) => p.slug === "e-invoicing-under-gst-requirements");
    expect(post).toBeTruthy();
    expect(post.title).toContain("E-Invoicing Under GST");
  });

  it("includes Proforma Invoice vs Tax Invoice post", () => {
    const post = BLOG_POSTS.find((p) => p.slug === "proforma-invoice-vs-tax-invoice");
    expect(post).toBeTruthy();
    expect(post.title).toContain("Proforma Invoice vs Tax Invoice");
  });
});
