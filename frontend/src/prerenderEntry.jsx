// Build-time entry used by scripts/prerender.mjs. Renders one route into the
// jsdom document, with the same providers as main.jsx, so each page's head
// effects (usePageTitle and friends) write its own <head> tags.
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./hooks/useAuth";
import { PageTitleProvider } from "./hooks/usePageTitle";
import { ThemeProvider } from "./hooks/useTheme";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function renderRoute(pathname, container) {
  const root = createRoot(container);
  flushSync(() => {
    root.render(
      <ThemeProvider>
        <MemoryRouter initialEntries={[pathname]}>
          <PageTitleProvider>
            <ErrorBoundary>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ErrorBoundary>
          </PageTitleProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );
  });
  // Wait until the markup and title stop changing, so lazy pages have resolved
  // and their head effects have run.
  let last = "";
  for (let i = 0, stable = 0; i < 300 && stable < 15; i++) {
    await sleep(10);
    const now = document.title + container.innerHTML;
    stable = now === last ? stable + 1 : 0;
    last = now;
  }
  return root;
}
