// Blog posts written as Markdown in ./posts/*.md, with a small YAML-style
// frontmatter block (one `key: value` per line). An "## Frequently Asked
// Questions" section of "### Question" + answer paragraphs is also exported as
// FAQ items so the post page can emit FAQPage JSON-LD.
import { marked } from "marked";

const files = import.meta.glob("./posts/*.md", { query: "?raw", import: "default", eager: true });

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    data[m[1]] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

const FAQ_HEADING = /^##\s+(?:Frequently Asked Questions|FAQs?)\b.*$/im;

// Splits the FAQ section out of the body so it is rendered once, by the FAQ component.
export function extractFaq(body) {
  const [before, section] = body.split(FAQ_HEADING);
  if (section === undefined) return { faq: [], rest: body };
  const nextHeading = section.search(/^##\s+/m);
  const faqText = nextHeading === -1 ? section : section.slice(0, nextHeading);
  const after = nextHeading === -1 ? "" : section.slice(nextHeading);
  const faq = faqText
    .split(/^###\s+/m)
    .slice(1)
    .map((chunk) => {
      const [q, ...rest] = chunk.split(/\r?\n/);
      const a = rest.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
      return { q: q.trim(), a };
    })
    .filter((item) => item.q && item.a);
  return faq.length ? { faq, rest: before + after } : { faq: [], rest: body };
}

export function parsePost(raw) {
  const { data, body } = parseFrontmatter(raw);
  const { faq, rest } = extractFaq(body);
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    keywords: data.keywords || "",
    date: data.date,
    category: data.category || "Guide",
    readTime: data.readTime || `${Math.max(1, Math.round(body.split(/\s+/).length / 200))} min read`,
    html: marked.parse(rest, { async: false }),
    faq,
  };
}

export const MARKDOWN_POSTS = Object.values(files)
  .map(parsePost)
  .filter((p) => p.slug && p.title)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

export function getMarkdownPost(slug) {
  return MARKDOWN_POSTS.find((p) => p.slug === slug);
}
