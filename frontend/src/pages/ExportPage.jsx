import { useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import { usePageTitle } from "../hooks/usePageTitle";
import { api } from "../lib/api";

const FORMATS = [
  { value: "csv", label: "CSV", desc: "Comma-separated values, opens in Excel" },
  { value: "excel", label: "Excel (.xlsx)", desc: "Native Excel format with formatting" },
  { value: "gst", label: "GST Filing Format", desc: "JSON format compatible with DoAide GST" },
];

export default function ExportPage() {
  usePageTitle("Export");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [format, setFormat] = useState("csv");
  const [status, setStatus] = useState("approved");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleExport() {
    setExporting(true);
    setError("");
    setSuccess("");
    try {
      const params = { format };
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (status) params.status = status;
      await api.exportInvoices(params);
      setSuccess(`Export started. Your ${format.toUpperCase()} file will download shortly.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Export Invoices</h1>
        <p className="text-sm text-ink-soft mt-1">Download your invoice data in various formats</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {success && (
        <div className="flex justify-between gap-3 px-3 py-2 rounded-[var(--radius)] mb-4 bg-good-bg text-good text-sm" role="status">
          {success}
        </div>
      )}

      <div className="panel max-w-2xl">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">Export Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="date-from" className="text-xs font-semibold text-ink-soft mb-1 block">From Date</label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor="date-to" className="text-xs font-semibold text-ink-soft mb-1 block">To Date</label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="status-filter" className="text-xs font-semibold text-ink-soft mb-1 block">Invoice Status</label>
          <select id="status-filter" value={status} onChange={(e) => setStatus(e.target.value)} className="input-field text-sm">
            <option value="">All statuses</option>
            <option value="approved">Approved only</option>
            <option value="extracted">Extracted (pending review)</option>
          </select>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-ink-soft mb-3">Export Format</p>
          <div className="space-y-2">
            {FORMATS.map((f) => (
              <label
                key={f.value}
                className={`flex items-start gap-3 p-3 rounded-[var(--radius)] border cursor-pointer transition-colors ${
                  format === f.value ? "border-brand bg-[rgba(240,180,41,0.08)]" : "border-line hover:border-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={f.value}
                  checked={format === f.value}
                  onChange={() => setFormat(f.value)}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-semibold text-sm">{f.label}</span>
                  <p className="text-xs text-ink-soft mt-0.5">{f.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Exporting…" : "Download Export"}
        </button>
      </div>
    </div>
  );
}
