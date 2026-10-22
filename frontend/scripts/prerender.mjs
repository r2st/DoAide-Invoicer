// Post-build prerender (same approach as DoAide-GST): writes dist/<route>/index.html
// for every URL in public/sitemap.xml with that page's own <title>, meta
// description, canonical, Open Graph tags and JSON-LD, as set by its SeoHead.
// Without this every URL serves the homepage's head, so search engines treat
// sub-pages as duplicates of "/".
//
// Also writes:
//   dist/app-shell.html — the SPA with no canonical and noindex, served for any
//     URL that isn't prerendered (index.html is now the prerendered homepage).
//   dist/404.html       — the same shell, which serve sends (with status 404) for
//     anything that isn't a file, a prerendered route or one of APP_ROUTES.
//   dist/serve.json     — routing for `serve dist` (run WITHOUT -s: -s rewrites
//     every extensionless path to index.html before directory indexes are looked at).
//
// Usage: node scripts/prerender.mjs   (run after `vite build`)
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";
import { build } from "vite";

const SITE_URL = "https://invoicer.doaide.com";
const ENTRY = "src/prerenderEntry.jsx";
// Client-side routes that aren't in the sitemap; they get the noindex shell with a 200.
const APP_ROUTES = ["/login", "/auth/callback", "/invoices", "/invoices/:id", "/upload", "/hsn", "/recurring", "/export", "/settings"];

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SSR_OUT = join(ROOT, "node_modules", ".prerender");

// The sitemap is the list of indexable pages, so it is also the list to prerender.
const sitemap = await readFile(join(ROOT, "public/sitemap.xml"), "utf8");
const routes = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname.replace(/(.)\/$/, "$1")))];
const template = await readFile(join(DIST, "index.html"), "utf8");

await build({
  root: ROOT,
  logLevel: "warn",
  build: { ssr: ENTRY, outDir: SSR_OUT, emptyOutDir: true },
});

const canonicalUrl = (route) => (route === "/" ? SITE_URL + "/" : SITE_URL + route);

function upsert(document, selector, tag, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  return el;
}

function hasSchemaType(document, type) {
  return [...document.head.querySelectorAll('script[type="application/ld+json"]')].some((el) => {
    try {
      const data = JSON.parse(el.textContent);
      return (Array.isArray(data) ? data : [data]).some((d) => d && d["@type"] === type);
    } catch {
      return false;
    }
  });
}

// Canonical, og:url and the social title/description always describe the route
// itself, and every sub-page gets a BreadcrumbList if it didn't provide one.
function finalizeHead(document, route) {
  const url = canonicalUrl(route);
  upsert(document, 'link[rel="canonical"]', "link", { rel: "canonical" }).setAttribute("href", url);
  upsert(document, 'meta[property="og:url"]', "meta", { property: "og:url" }).setAttribute("content", url);
  const title = document.title;
  const description = document.head.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  for (const [attr, key, value] of [
    ["property", "og:title", title],
    ["name", "twitter:title", title],
    ["property", "og:description", description],
    ["name", "twitter:description", description],
  ]) {
    const el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (el && value) el.setAttribute("content", value);
  }

  if (route !== "/" && !hasSchemaType(document, "BreadcrumbList")) {
    const segments = route.split("/").filter(Boolean);
    const items = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" }];
    if (segments.length > 1 && routes.includes("/" + segments[0])) {
      items.push({
        "@type": "ListItem", position: 2,
        name: segments[0].charAt(0).toUpperCase() + segments[0].slice(1),
        item: SITE_URL + "/" + segments[0],
      });
    }
    items.push({ "@type": "ListItem", position: items.length + 1, name: title.split(/ [—|:·] /)[0].trim(), item: url });
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
    document.head.appendChild(script);
  }
}

// The homepage's structured data describes the homepage; sub-pages bring their own.
const stripTemplateSchemas = (document) =>
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());

const dom = new JSDOM(template, { url: SITE_URL + "/", pretendToBeVisual: true });
const { window } = dom;
const noop = () => {};
const stubFetch = async () => ({ ok: false, status: 503, json: async () => ({}), text: async () => "" });
Object.assign(window, {
  matchMedia: () => ({ matches: false, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop }),
  scrollTo: noop,
  fetch: stubFetch,
  IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
  ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
});
for (const key of ["window", "document", "navigator", "localStorage", "sessionStorage", "location", "history",
  "HTMLElement", "Element", "Node", "Event", "CustomEvent", "KeyboardEvent", "MouseEvent", "getComputedStyle",
  "matchMedia", "IntersectionObserver", "ResizeObserver", "requestAnimationFrame", "cancelAnimationFrame", "scrollTo"]) {
  Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true });
}
globalThis.fetch = stubFetch;
window.Element.prototype.scrollIntoView = noop;

// Fallback for URLs that aren't prerendered: the plain SPA shell, kept out of the index.
const shell = new JSDOM(template);
const shellDoc = shell.window.document;
shellDoc.head.querySelectorAll('link[rel="canonical"], meta[property="og:url"]').forEach((el) => el.remove());
stripTemplateSchemas(shellDoc);
upsert(shellDoc, 'meta[name="robots"]', "meta", { name: "robots" }).setAttribute("content", "noindex, follow");
await writeFile(join(DIST, "app-shell.html"), shell.serialize());
await writeFile(join(DIST, "404.html"), shell.serialize());

const { renderRoute } = await import(pathToFileURL(join(SSR_OUT, "prerenderEntry.js")).href);
const { document } = window;
const templateHead = document.head.innerHTML;
const homeTitle = new JSDOM(template).window.document.title;

const rendered = [];
const failed = [];
const titles = new Map();
for (const route of routes) {
  try {
    document.head.innerHTML = templateHead;
    if (route !== "/") stripTemplateSchemas(document);
    const container = document.getElementById("root");
    container.innerHTML = "";
    window.history.replaceState(null, "", route);
    window.localStorage.clear();
    const root = await renderRoute(route, container);
    finalizeHead(document, route);
    if (route !== "/" && document.title === homeTitle) console.warn(`warning: ${route} still has the homepage title`);
    titles.set(document.title, [...(titles.get(document.title) || []), route]);
    const html = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    root.unmount();
    const outFile = route === "/" ? join(DIST, "index.html") : join(DIST, route.slice(1), "index.html");
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html);
    rendered.push(route);
  } catch (err) {
    failed.push(route);
    console.error(`prerender failed for ${route}: ${err.message}`);
    if (route === "/") continue;
    // Still give the route its own indexable, self-canonical shell rather than the
    // noindex fallback, so a render bug can't de-index a real page.
    const page = new JSDOM(template);
    stripTemplateSchemas(page.window.document);
    finalizeHead(page.window.document, route);
    const outFile = join(DIST, route.slice(1), "index.html");
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, page.serialize());
  }
}
for (const [title, paths] of titles) if (paths.length > 1) console.warn(`warning: duplicate title "${title}": ${paths.join(", ")}`);

// serve applies rewrites to every extensionless path before it looks at the
// filesystem, so each prerendered route is listed explicitly. There is no "**"
// catch-all: serve re-applies the remaining rules to each rewritten path, so a
// catch-all would also swallow /<route>/index.html. Unknown paths get 404.html.
await writeFile(join(DIST, "serve.json"), JSON.stringify({
  cleanUrls: false,
  rewrites: [
    { source: "/", destination: "/index.html" },
    ...routes.filter((r) => r !== "/").map((r) => ({ source: r, destination: `${r}/index.html` })),
    ...APP_ROUTES.map((r) => ({ source: r, destination: "/app-shell.html" })),
  ],
}, null, 2) + "\n");

await rm(SSR_OUT, { recursive: true, force: true });
console.log(`prerendered ${rendered.length}/${routes.length} routes`);
// A broken route still gets a self-canonical shell, so only fail the build if prerendering is broadly broken.
process.exit(failed.length > routes.length * 0.2 ? 1 : 0);
