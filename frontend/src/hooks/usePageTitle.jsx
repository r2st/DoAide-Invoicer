import { createContext, useContext, useEffect } from "react";

const PageTitleCtx = createContext(null);

export function PageTitleProvider({ children }) {
  return <PageTitleCtx.Provider value={{}}>{children}</PageTitleCtx.Provider>;
}

export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — DoAide Invoicer` : "DoAide Invoicer";
    return () => { document.title = prev; };
  }, [title]);
}
