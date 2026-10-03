import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./hooks/useAuth";
import { PageTitleProvider } from "./hooks/usePageTitle";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <PageTitleProvider>
          <ErrorBoundary>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ErrorBoundary>
        </PageTitleProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
