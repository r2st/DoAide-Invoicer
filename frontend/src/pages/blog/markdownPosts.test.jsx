import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PageTitleProvider } from "../../hooks/usePageTitle";
import { ThemeProvider } from "../../hooks/useTheme";
import BlogPostPage from "../BlogPostPage";
import { BLOG_POSTS } from "../BlogListPage";
import { MARKDOWN_POSTS, extractFaq, parseFrontmatter } from "./markdownPosts";

// The prerender script builds its route list from the sitemap.
const sitemap = readFileSync(resolve(__dirname, "../../../public/sitemap.xml"), "utf8");

function renderPost(slug) {
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

describe("markdown blog posts", () => {
  it("loads every post with the frontmatter the page needs", () => {
    expect(MARKDOWN_POSTS.length).toBeGreaterThanOrEqual(3);
    for (const post of MARKDOWN_POSTS) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.description.length).toBeGreaterThan(50);
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.html).toContain("<h2");
      expect(post.faq.length).toBeGreaterThan(0);
    }
  });

  it("lists every post on the blog and in the sitemap", () => {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const { slug } of MARKDOWN_POSTS) {
      expect(slugs).toContain(slug);
      expect(sitemap).toContain(`<loc>https://invoicer.doaide.com/blog/${slug}</loc>`);
    }
  });

  it("renders a markdown post with its body and FAQ", () => {
    const post = MARKDOWN_POSTS[0];
    const { container } = renderPost(post.slug);
    expect(screen.getByRole("heading", { level: 1, name: post.title })).toBeInTheDocument();
    expect(container.querySelector(".md-post h2")).not.toBeNull();
    expect(screen.getByText(post.faq[0].q)).toBeInTheDocument();
  });

  it("parses frontmatter values containing colons", () => {
    const { data } = parseFrontmatter("---\ntitle: A: B\nslug: a-b\n---\nHello");
    expect(data).toEqual({ title: "A: B", slug: "a-b" });
  });

  it("moves the FAQ section out of the body", () => {
    const { faq, rest } = extractFaq("Intro\n\n## Frequently Asked Questions\n\n### Q1?\n\nA [link](/x).\n\n## After\n\nEnd");
    expect(faq).toEqual([{ q: "Q1?", a: "A link." }]);
    expect(rest).not.toContain("Q1?");
  });
});
