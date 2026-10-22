import { createContext, useContext, useEffect } from "react";

const PageTitleCtx = createContext(null);

export function PageTitleProvider({ children }) {
  return <PageTitleCtx.Provider value={{}}>{children}</PageTitleCtx.Provider>;
}

const DESCRIPTION_TAGS = [
  ["name", "description"],
  ["property", "og:description"],
  ["name", "twitter:description"],
];

// `description`, when given, becomes the page's meta description (and its Open
// Graph/Twitter twins) until unmount; scripts/prerender.mjs bakes it into the
// static HTML.
export function usePageTitle(title, description) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — DoAide | Invoicer` : "DoAide | Invoicer";
    const restore = [];
    if (description) {
      for (const [attr, key] of DESCRIPTION_TAGS) {
        const el = document.head.querySelector(`meta[${attr}="${key}"]`);
        if (!el) continue;
        restore.push([el, el.getAttribute("content")]);
        el.setAttribute("content", description);
      }
    }
    return () => {
      document.title = prev;
      for (const [el, content] of restore) el.setAttribute("content", content);
    };
  }, [title, description]);
}
