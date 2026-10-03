import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { SkeletonPanel } from "../components/Skeleton";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, isAbortError } from "../lib/api";
import { dateLabel, rupees, statusLabel, statusTone } from "../lib/format";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  usePageTitle("Invoice Detail");
  const [invoice, setInvoice] = useState(null);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const ctrl = new AbortController();
    setLoading(true);
    api.getInvoice(id, { signal: ctrl.signal })
      .then((inv) => {
        setInvoice(inv);
        setDraft({
          vendor_name: inv.vendor_name ?? "",
          vendor_gstin: inv.vendor_gstin ?? "",
          buyer_name: inv.buyer_name ?? "",
          buyer_gstin: inv.buyer_gstin ?? "",
          invoice_number: inv.invoice_number ?? "",
          invoice_date: inv.invoice_date ?? "",
          subtotal: inv.subtotal ?? "",
          cgst: inv.cgst ?? "",
          sgst: inv.sgst ?? "",
          igst: inv.igst ?? "",
          total: inv.total ?? "",
        });
      })
      .catch((err) => { if (!isAbortError(err)) setError(err.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [id]);

  useEffect(() => load(), [load]);

  function updateField(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const updated = await api.updateInvoice(id, draft);
      setInvoice(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function approve() {
    setSaving(true);
    try {
      const updated = await api.approveInvoice(id);
      setInvoice(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function reject() {
    setSaving(true);
    try {
      const updated = await api.rejectInvoice(id);
      setInvoice(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteInvoice(id);
      navigate("/invoices");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div>
        <SkeletonPanel lines={8} label="Loading invoice" />
      </div>
    );
  }

  if (!invoice && error) {
    return (
      <div>
        <ErrorBanner message={error} />
        <Link to="/invoices" className="btn btn-ghost">Back to invoices</Link>
      </div>
    );
  }

  const confidence = invoice?.confidence_score;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <Link to="/invoices" className="text-ink-soft hover:text-ink transition-colors">&larr;</Link>
          <div>
            <h1 className="text-xl font-bold">{invoice?.vendor_name || "Invoice Detail"}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`chip chip-${statusTone(invoice?.status)}`}>{statusLabel(invoice?.status)}</span>
              {confidence != null && (
                <span className={`text-xs ${confidence >= 0.8 ? "text-good" : confidence >= 0.5 ? "text-warn" : "text-bad"}`}>
                  {Math.round(confidence * 100)}% confidence
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice?.status === "extracted" && (
            <>
              <button type="button" className="btn btn-primary text-sm" onClick={approve} disabled={saving}>Approve</button>
              <button type="button" className="btn btn-danger text-sm" onClick={reject} disabled={saving}>Reject</button>
            </>
          )}
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">Original Invoice</h2>
          {invoice?.image_path ? (
            <div className="bg-canvas rounded-lg p-4 flex items-center justify-center min-h-[300px]">
              <img
                src={`/api/invoices/${id}/image`}
                alt="Invoice scan"
                className="max-w-full max-h-[500px] rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="bg-canvas rounded-lg p-8 text-center text-ink-soft">
              No image available
            </div>
          )}
        </div>

        <div className="panel">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-4">Extracted Data</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Vendor Name", field: "vendor_name" },
              { label: "Vendor GSTIN", field: "vendor_gstin" },
              { label: "Buyer Name", field: "buyer_name" },
              { label: "Buyer GSTIN", field: "buyer_gstin" },
              { label: "Invoice Number", field: "invoice_number" },
              { label: "Invoice Date", field: "invoice_date", type: "date" },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label htmlFor={field} className="text-xs font-semibold text-ink-soft mb-1 block">{label}</label>
                <input
                  id={field}
                  type={type || "text"}
                  value={draft[field] ?? ""}
                  onChange={(e) => updateField(field, e.target.value)}
                  className="input-field text-sm"
                  disabled={invoice?.status === "approved"}
                />
              </div>
            ))}
          </div>

          {invoice?.items && invoice.items.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink-soft mb-3">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="table-base text-xs">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>HSN</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Rate</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, i) => (
                      <tr key={item.id || i}>
                        <td>{item.description}</td>
                        <td className="font-mono">{item.hsn_code || "—"}</td>
                        <td className="text-right tabular-nums">{item.quantity}</td>
                        <td className="text-right tabular-nums">{rupees(item.unit_price)}</td>
                        <td className="text-right tabular-nums">{rupees(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Subtotal", field: "subtotal" },
              { label: "CGST", field: "cgst" },
              { label: "SGST", field: "sgst" },
              { label: "IGST", field: "igst" },
            ].map(({ label, field }) => (
              <div key={field}>
                <label htmlFor={field} className="text-xs text-ink-soft mb-1 block">{label}</label>
                <input
                  id={field}
                  type="number"
                  step="0.01"
                  value={draft[field] ?? ""}
                  onChange={(e) => updateField(field, e.target.value)}
                  className="input-field text-sm tabular-nums"
                  disabled={invoice?.status === "approved"}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-canvas rounded-[var(--radius)]">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-brand tabular-nums">{rupees(draft.total)}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {invoice?.status !== "approved" && (
              <button type="button" className="btn btn-primary text-sm" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            )}
            <button type="button" className="btn btn-danger text-sm" onClick={handleDelete}>Delete</button>
          </div>

          {invoice?.processing_time_ms && (
            <p className="text-xs text-ink-muted mt-4">
              Processed in {(invoice.processing_time_ms / 1000).toFixed(1)}s
              {invoice.source === "whatsapp" && " via WhatsApp"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
