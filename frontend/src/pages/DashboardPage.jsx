import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { SkeletonStats, SkeletonTable } from "../components/Skeleton";
import StatCard from "../components/StatCard";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, isAbortError } from "../lib/api";
import { dateLabel, rupees, rupeesShort, statusLabel, statusTone } from "../lib/format";

export default function DashboardPage() {
  usePageTitle("Dashboard");
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    Promise.all([
      api.stats({ signal: ctrl.signal }),
      api.listInvoices({ per_page: 10, sort_by: "created_at", sort_order: "desc" }, { signal: ctrl.signal }),
    ])
      .then(([s, r]) => {
        setStats(s);
        setRecent(r?.items ?? r ?? []);
      })
      .catch((err) => {
        if (!isAbortError(err)) setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  useEffect(() => load(), [load]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-ink-soft mt-0.5">Your invoice processing overview</p>
        </div>
        <Link to="/upload" className="btn btn-primary">Upload Invoices</Link>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading && !stats ? (
        <>
          <SkeletonStats count={4} />
          <SkeletonTable rows={5} columns={5} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Invoices"
              value={stats?.total_invoices ?? 0}
              sub={`${stats?.this_month ?? 0} this month`}
              tone="brand"
            />
            <StatCard
              label="Quota Used"
              value={`${stats?.quota_used ?? 0}/${stats?.quota_limit ?? 25}`}
              sub={stats?.plan ? `${stats.plan} plan` : "Free plan"}
              tone={stats?.quota_used >= stats?.quota_limit ? "bad" : "good"}
            />
            <StatCard
              label="Total Amount"
              value={rupeesShort(stats?.total_amount ?? 0)}
              sub="Across all invoices"
              tone="neutral"
            />
            <StatCard
              label="Pending Review"
              value={stats?.pending_review ?? 0}
              sub="Need your attention"
              tone={stats?.pending_review > 0 ? "warn" : "good"}
            />
          </div>

          <div className="panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Recent Invoices</h2>
              <Link to="/invoices" className="text-sm text-brand hover:text-brand-dark transition-colors">
                View all &rarr;
              </Link>
            </div>

            {recent && recent.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th className="text-right">Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((inv) => (
                      <tr key={inv.id}>
                        <td>
                          <Link to={`/invoices/${inv.id}`} className="text-brand hover:text-brand-dark font-medium">
                            {inv.vendor_name || "Unknown vendor"}
                          </Link>
                        </td>
                        <td className="font-mono text-xs">{inv.invoice_number || "—"}</td>
                        <td className="text-sm">{dateLabel(inv.invoice_date)}</td>
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
            ) : (
              <div className="text-center py-12 text-ink-soft">
                <p className="text-lg mb-2">No invoices yet</p>
                <p className="text-sm mb-4">Send an invoice photo on WhatsApp or upload from the dashboard.</p>
                <Link to="/upload" className="btn btn-primary">Upload your first invoice</Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
