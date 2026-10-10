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

  it("renders GST vs Regular Invoice blog post", () => {
    renderPost("gst-invoice-vs-regular-invoice");
    expect(screen.getByText("GST Invoice vs Regular Invoice: What Indian Businesses Need to Know")).toBeInTheDocument();
    expect(screen.getByText("What is a Regular Invoice?")).toBeInTheDocument();
    expect(screen.getByText("What is a GST Invoice?")).toBeInTheDocument();
    expect(screen.getByText(/Key Differences: GST Invoice vs Regular/)).toBeInTheDocument();
    expect(screen.getByText("When to Use Each Type")).toBeInTheDocument();
    expect(screen.getByText("How to Create a GST-Compliant Invoice")).toBeInTheDocument();
    expect(screen.getByText("Create GST Invoice Now")).toBeInTheDocument();
  });

  it("renders GST Invoice Format 2026 blog post", () => {
    renderPost("gst-invoice-format-2026-complete-guide");
    expect(screen.getByText("GST Invoice Format 2026: Complete Guide with Free Template")).toBeInTheDocument();
    expect(screen.getByText(/What Changed in the GST Invoice Format/)).toBeInTheDocument();
    expect(screen.getByText(/Mandatory Fields in a GST Invoice/)).toBeInTheDocument();
    expect(screen.getByText(/E-Invoicing Requirements in 2026/)).toBeInTheDocument();
    expect(screen.getByText("Download Free GST Invoice Template")).toBeInTheDocument();
  });

  it("renders E-Invoicing Under GST blog post", () => {
    renderPost("e-invoicing-under-gst-requirements");
    expect(screen.getByText("E-Invoicing Under GST: Mandatory Requirements and How to Comply")).toBeInTheDocument();
    expect(screen.getByText("What is E-Invoicing Under GST?")).toBeInTheDocument();
    expect(screen.getByText(/Who Must Comply/)).toBeInTheDocument();
    expect(screen.getByText(/Consequences of Non-Compliance/)).toBeInTheDocument();
    expect(screen.getByText("Generate E-Invoice-Ready Invoice")).toBeInTheDocument();
  });

  it("renders Proforma Invoice vs Tax Invoice blog post", () => {
    renderPost("proforma-invoice-vs-tax-invoice");
    expect(screen.getByText("Proforma Invoice vs Tax Invoice: Key Differences for Indian Businesses")).toBeInTheDocument();
    expect(screen.getByText("What is a Proforma Invoice?")).toBeInTheDocument();
    expect(screen.getByText(/What is a Tax Invoice Under GST/)).toBeInTheDocument();
    expect(screen.getByText(/Key Differences: Proforma Invoice vs Tax/)).toBeInTheDocument();
    expect(screen.getByText("Create Your Invoice Now")).toBeInTheDocument();
  });

  it("renders JSON-LD BlogPosting schema", () => {
    renderPost("gst-invoice-format-2026-complete-guide");
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemas = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const blogSchema = schemas.find((s) => s["@type"] === "BlogPosting");
    expect(blogSchema).toBeTruthy();
    expect(blogSchema.headline).toBe("GST Invoice Format 2026: Complete Guide with Free Template");
    expect(blogSchema.author.name).toBe("Apprend Technologies");
  });

  it("renders JSON-LD FAQPage schema for posts with FAQs", () => {
    renderPost("e-invoicing-under-gst-requirements");
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemas = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const faqSchema = schemas.find((s) => s["@type"] === "FAQPage");
    expect(faqSchema).toBeTruthy();
    expect(faqSchema.mainEntity.length).toBeGreaterThan(0);
    expect(faqSchema.mainEntity[0]["@type"]).toBe("Question");
  });

  it("renders FAQ section with collapsible details", () => {
    renderPost("proforma-invoice-vs-tax-invoice");
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText(/Is a proforma invoice legally binding/)).toBeInTheDocument();
  });
});
