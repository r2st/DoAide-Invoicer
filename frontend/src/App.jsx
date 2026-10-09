import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import FeedbackWidget from "./components/FeedbackWidget";
import Shell from "./components/Shell";
import { SkeletonPanel } from "./components/Skeleton";
import { useAuth } from "./hooks/useAuth";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import CalculatorPage from "./pages/CalculatorPage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import DashboardPage from "./pages/DashboardPage";
import EmbedPage from "./pages/EmbedPage";
import ExportPage from "./pages/ExportPage";
import HsnLookupPage from "./pages/HsnLookupPage";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import LandingPage from "./pages/LandingPage";
import LateFeeCalculatorPage from "./pages/LateFeeCalculatorPage";
import PaymentTermsPage from "./pages/PaymentTermsPage";
import PricingPage from "./pages/PricingPage";
import SettingsPage from "./pages/SettingsPage";
import SitemapPage from "./pages/SitemapPage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import TemplatesPage from "./pages/TemplatesPage";
import ToolsIndexPage from "./pages/ToolsIndexPage";
import InvoiceNumberGeneratorPage from "./pages/InvoiceNumberGeneratorPage";
import InvoiceValidatorPage from "./pages/InvoiceValidatorPage";
import UploadPage from "./pages/UploadPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SkeletonPanel lines={5} label="Checking your session" />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return (
    <Shell>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Shell>
  );
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SkeletonPanel lines={5} label="Checking your session" />
      </div>
    );
  }
  if (!user) return <LandingPage />;
  return (
    <Shell>
      <ErrorBoundary>
        <DashboardPage />
      </ErrorBoundary>
    </Shell>
  );
}

export default function App() {
  return (
    <>
    <FeedbackWidget />
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/" element={<Home />} />

      {/* Free tools — no login required */}
      <Route path="/create" element={<CreateInvoicePage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/template/:slug" element={<TemplateDetailPage />} />
      <Route path="/tools" element={<ToolsIndexPage />} />
      <Route path="/tools/payment-terms" element={<PaymentTermsPage />} />
      <Route path="/tools/late-fee" element={<LateFeeCalculatorPage />} />
      <Route path="/tools/invoice-number-generator" element={<InvoiceNumberGeneratorPage />} />
      <Route path="/tools/invoice-validator" element={<InvoiceValidatorPage />} />

      {/* SEO & content pages */}
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/embed" element={<EmbedPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />

      {/* Protected app routes */}
      <Route path="/invoices" element={<Protected><InvoiceListPage /></Protected>} />
      <Route path="/invoices/:id" element={<Protected><InvoiceDetailPage /></Protected>} />
      <Route path="/upload" element={<Protected><UploadPage /></Protected>} />
      <Route path="/hsn" element={<Protected><HsnLookupPage /></Protected>} />
      <Route path="/export" element={<Protected><ExportPage /></Protected>} />
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
