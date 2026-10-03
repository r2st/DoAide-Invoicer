import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { SkeletonTable } from "../components/Skeleton";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, isAbortError } from "../lib/api";
import { dateLabel, rupees, statusLabel, statusTone } from "../lib/format";

const STATUSES = ["", "processing", "extracted", "approved", "rejected"];

export default function InvoiceListPage() {
  usePageTitle("Invoices");
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(new Set());

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";
  const search = searchParams.get("q") || "";
  const perPage = 20;

  const load = useCallback(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    const params = { page, per_page: perPage, sort_by: "created_at", sort_order: "desc" };
    if (status) params.status = status;
    if (search) params.vendor_name = search;
    api.listInvoices(params, { signal: ctrl.signal })
      .then((res) => {
        setInvoices(res?.items ?? res ?? []);
        setTotal(res?.total ?? 0);
        setSelected(new Set());
      })
      .catch((err) => { if (!isAbortError(err)) setError(err.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [page, status, search]);

  useEffect(() => load(), [load]);

  function setParam(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    });
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === invoices.length) setSelected(new Set());
    else setSelected(new Set(invoices.map((i) => i.id)));
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <span className="text-sm text-ink-soft self-center">{selected.size} selected</span>
          )}
          <Link to="/upload" className="btn btn-primary text-sm">Upload</Link>
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search by vendor name..."
            value={search}
            onChange={(e) => setParam("q", e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
          className="input-field text-sm w-full sm:w-48"
        >
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <SkeletonTable rows={8} columns={6} />
      ) : invoices.length > 0 ? (
        <>
          <div className="panel p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th className="w-10">
                      <input
                        type="checkbox"
                        checked={selected.size === invoices.length && invoices.length > 0}
                        onChange={toggleAll}
                        className="w-4 h-4"
                        aria-label="Select all"
                      />
                    </th>
                    <th>Vendor</th>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Source</th>
                    <th className="text-right">Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(inv.id)}
                          onChange={() => toggleSelect(inv.id)}
                          className="w-4 h-4"
                          aria-label={`Select ${inv.vendor_name || "invoice"}`}
                        />
                      </td>
                      <td>
                        <Link to={`/invoices/${inv.id}`} className="text-brand hover:text-brand-dark font-medium">
                          {inv.vendor_name || "Unknown"}
                        </Link>
                      </td>
                      <td className="font-mono text-xs">{inv.invoice_number || "—"}</td>
                      <td className="text-sm">{dateLabel(inv.invoice_date)}</td>
                      <td>
                        <span className={`chip ${inv.source === "whatsapp" ? "bg-whatsapp/10 text-whatsapp" : "chip-neutral"}`}>
                          {inv.source === "whatsapp" ? "WhatsApp" : "Web"}
                        </span>
                      </td>
                      <td className="text-right tabular-nums">{rupees(inv.total)}</td>
                      <td>
                        <span className={`chip chip-${statusTone(inv.status)}`}>
                          {statusLabel(inv.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                type="button"
                className="btn btn-ghost text-sm"
                disabled={page <= 1}
                onClick={() => setParam("page", String(page - 1))}
              >
                Previous
              </button>
              <span className="text-sm text-ink-soft">Page {page} of {totalPages}</span>
              <button
                type="button"
                className="btn btn-ghost text-sm"
                disabled={page >= totalPages}
                onClick={() => setParam("page", String(page + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="panel text-center py-12">
          <p className="text-ink-soft mb-4">No invoices found.</p>
          <Link to="/upload" className="btn btn-primary">Upload invoices</Link>
        </div>
      )}
    </div>
  );
}
