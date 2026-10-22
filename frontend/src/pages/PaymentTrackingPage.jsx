import { useEffect, useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import StatCard from "../components/StatCard";
import { usePageTitle } from "../hooks/usePageTitle";
import { rupees } from "../lib/format";
import { loadPayments, savePayment, updatePayment, deletePayment, getPaymentStats, PAYMENT_STATUSES } from "../lib/paymentTracker";

const EMPTY_PAYMENT = { invoiceNum: "", clientName: "", amount: "", status: "pending", dueDate: "", notes: "" };

const STATUS_CHIP = { paid: "chip-good", pending: "chip-warn", overdue: "chip-bad" };
const STATUS_LABEL = { paid: "Paid", pending: "Pending", overdue: "Overdue" };

export default function PaymentTrackingPage() {
  usePageTitle("Payment Tracking");
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PAYMENT });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const reload = () => { setPayments(loadPayments()); setStats(getPaymentStats()); };
  useEffect(() => { reload(); }, []);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.invoiceNum.trim()) { setError("Invoice number is required."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Amount must be greater than zero."); return; }
    savePayment({ ...form, id: editId || undefined, amount: Number(form.amount) });
    setForm({ ...EMPTY_PAYMENT });
    setShowForm(false);
    setEditId(null);
    setError("");
    reload();
  };

  const handleMarkPaid = (id) => {
    updatePayment(id, { status: "paid", paidDate: new Date().toISOString().slice(0, 10) });
    reload();
  };

  const handleMarkOverdue = (id) => {
    updatePayment(id, { status: "overdue" });
    reload();
  };

  const handleDelete = (id) => {
    deletePayment(id);
    reload();
  };

  const handleEdit = (p) => {
    setForm({ invoiceNum: p.invoiceNum || "", clientName: p.clientName || "", amount: String(p.amount), status: p.status, dueDate: p.dueDate || "", notes: p.notes || "" });
    setEditId(p.id);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ ...EMPTY_PAYMENT });
    setEditId(null);
    setError("");
  };

  const filtered = filter ? payments.filter((p) => p.status === filter) : payments;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Payment Tracking</h1>
          <p className="text-sm text-ink-soft mt-1">Track payment status for your invoices.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY_PAYMENT }); setError(""); }}
        >
          + Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Outstanding" value={rupees(stats.totalOutstanding || 0)} sub="Pending + Overdue" tone="warn" />
        <StatCard label="Overdue" value={stats.overdueCount || 0} sub="Need follow-up" tone={stats.overdueCount > 0 ? "bad" : "good"} />
        <StatCard label="Paid This Month" value={rupees(stats.paidThisMonth || 0)} sub="Collections" tone="good" />
        <StatCard label="Total Collected" value={rupees(stats.totalCollected || 0)} sub="All time" tone="brand" />
      </div>

      {showForm && (
        <div className="panel mb-5">
          <h2 className="font-display text-lg text-ink-strong mb-4">
            {editId ? "Edit Payment Record" : "Record a Payment"}
          </h2>
          <ErrorBanner message={error} onDismiss={() => setError("")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Invoice Number *</label>
              <input className="input-field text-sm font-mono" value={form.invoiceNum} onChange={(e) => updateField("invoiceNum", e.target.value)} placeholder="INV-001" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Client Name</label>
              <input className="input-field text-sm" value={form.clientName} onChange={(e) => updateField("clientName", e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Amount *</label>
              <input type="number" min={0} step="0.01" className="input-field text-sm" value={form.amount} onChange={(e) => updateField("amount", e.target.value)} placeholder="25000" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Status</label>
              <select className="input-field text-sm" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Due Date</label>
              <input type="date" className="input-field text-sm" value={form.dueDate} onChange={(e) => updateField("dueDate", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Notes</label>
              <input className="input-field text-sm" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Partial payment, etc." />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="button" className="btn btn-primary text-sm" onClick={handleSave}>
              {editId ? "Update Record" : "Save Record"}
            </button>
            <button type="button" className="btn btn-ghost text-sm" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button type="button" className={`btn text-xs ${!filter ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter("")}>All</button>
          {PAYMENT_STATUSES.map((s) => (
            <button key={s} type="button" className={`btn text-xs ${filter === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(s)}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      )}

      {payments.length === 0 && !showForm && (
        <div className="panel text-center py-12">
          <div className="text-4xl mb-3 opacity-40">&#x1F4B3;</div>
          <h3 className="font-display text-xl text-ink-strong mb-2">No payment records yet</h3>
          <p className="text-sm text-ink-soft mb-4">Track which invoices are paid, pending, or overdue.</p>
          <button type="button" className="btn btn-primary text-sm" onClick={() => setShowForm(true)}>
            Record Your First Payment
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="panel p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.invoiceNum}</td>
                    <td className="font-medium">{p.clientName || "—"}</td>
                    <td className="text-right tabular-nums">{rupees(p.amount)}</td>
                    <td><span className={`chip ${STATUS_CHIP[p.status] || "chip-neutral"}`}>{STATUS_LABEL[p.status] || p.status}</span></td>
                    <td className="text-sm">{p.dueDate || "—"}</td>
                    <td>
                      <div className="flex gap-2">
                        {p.status !== "paid" && (
                          <button type="button" className="btn btn-primary text-xs px-3 py-1.5" onClick={() => handleMarkPaid(p.id)}>Mark Paid</button>
                        )}
                        {p.status === "pending" && (
                          <button type="button" className="btn btn-ghost text-xs px-3 py-1.5" onClick={() => handleMarkOverdue(p.id)}>Mark Overdue</button>
                        )}
                        <button type="button" className="btn btn-ghost text-xs px-3 py-1.5" onClick={() => handleEdit(p)}>Edit</button>
                        <button type="button" className="btn btn-danger text-xs px-3 py-1.5" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
