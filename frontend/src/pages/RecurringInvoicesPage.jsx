import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { usePageTitle } from "../hooks/usePageTitle";

const FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const EMPTY_SCHEDULE = {
  clientName: "",
  clientEmail: "",
  description: "",
  amount: "",
  taxRate: 18,
  frequency: "monthly",
  startDate: "",
  endDate: "",
  autoSend: false,
};

function loadSchedules() {
  try {
    return JSON.parse(localStorage.getItem("invoicer_recurring") || "[]");
  } catch { return []; }
}

function saveSchedules(schedules) {
  try { localStorage.setItem("invoicer_recurring", JSON.stringify(schedules)); } catch { /* ignore */ }
}

function nextOccurrence(startDate, frequency) {
  const now = new Date();
  let next = new Date(startDate);
  if (next < now) {
    const intervals = { weekly: 7, biweekly: 14, monthly: 30, quarterly: 91, yearly: 365 };
    const days = intervals[frequency] || 30;
    while (next < now) next.setDate(next.getDate() + days);
  }
  return next.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RecurringInvoicesPage() {
  usePageTitle("Recurring Invoices");
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_SCHEDULE });
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => { setSchedules(loadSchedules()); }, []);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.clientName.trim()) { setError("Client name is required."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Amount must be greater than zero."); return; }
    if (!form.startDate) { setError("Start date is required."); return; }

    const entry = {
      ...form,
      amount: Number(form.amount),
      id: editIndex !== null ? schedules[editIndex].id : Date.now().toString(36),
      createdAt: editIndex !== null ? schedules[editIndex].createdAt : new Date().toISOString(),
      active: true,
    };

    let updated;
    if (editIndex !== null) {
      updated = schedules.map((s, i) => i === editIndex ? entry : s);
    } else {
      updated = [...schedules, entry];
    }

    setSchedules(updated);
    saveSchedules(updated);
    setForm({ ...EMPTY_SCHEDULE });
    setShowForm(false);
    setEditIndex(null);
    setError("");
  };

  const handleDelete = (index) => {
    const updated = schedules.filter((_, i) => i !== index);
    setSchedules(updated);
    saveSchedules(updated);
  };

  const handleToggle = (index) => {
    const updated = schedules.map((s, i) => i === index ? { ...s, active: !s.active } : s);
    setSchedules(updated);
    saveSchedules(updated);
  };

  const handleEdit = (index) => {
    const s = schedules[index];
    setForm({ ...EMPTY_SCHEDULE, ...s, amount: String(s.amount) });
    setEditIndex(index);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ ...EMPTY_SCHEDULE });
    setEditIndex(null);
    setError("");
  };

  const activeCount = schedules.filter((s) => s.active).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Recurring Invoices</h1>
          <p className="text-sm text-ink-soft mt-1">
            Schedule invoices to be generated automatically on a recurring basis.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={() => { setShowForm(true); setEditIndex(null); setForm({ ...EMPTY_SCHEDULE }); setError(""); }}
        >
          + New Schedule
        </button>
      </div>

      {showForm && (
        <div className="panel mb-5">
          <h2 className="font-display text-lg text-ink-strong mb-4">
            {editIndex !== null ? "Edit Schedule" : "Create Recurring Invoice"}
          </h2>
          <ErrorBanner message={error} onDismiss={() => setError("")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Client Name *</label>
              <input className="input-field text-sm" value={form.clientName} onChange={(e) => updateField("clientName", e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Client Email</label>
              <input type="email" className="input-field text-sm" value={form.clientEmail} onChange={(e) => updateField("clientEmail", e.target.value)} placeholder="billing@acme.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Description</label>
              <input className="input-field text-sm" value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Monthly retainer fee" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Amount (₹) *</label>
              <input type="number" min={0} step="0.01" className="input-field text-sm" value={form.amount} onChange={(e) => updateField("amount", e.target.value)} placeholder="25000" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">GST Rate</label>
              <select className="input-field text-sm" value={form.taxRate} onChange={(e) => updateField("taxRate", Number(e.target.value))}>
                {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Frequency *</label>
              <select className="input-field text-sm" value={form.frequency} onChange={(e) => updateField("frequency", e.target.value)}>
                {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Start Date *</label>
              <input type="date" className="input-field text-sm" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">End Date (optional)</label>
              <input type="date" className="input-field text-sm" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.autoSend} onChange={(e) => updateField("autoSend", e.target.checked)} className="accent-brand" id="auto-send" />
              <label htmlFor="auto-send" className="text-sm text-ink-soft cursor-pointer">Auto-send via email when generated</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="button" className="btn btn-primary text-sm" onClick={handleSave}>
              {editIndex !== null ? "Update Schedule" : "Create Schedule"}
            </button>
            <button type="button" className="btn btn-ghost text-sm" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {schedules.length === 0 && !showForm && (
        <div className="panel text-center py-12">
          <div className="text-4xl mb-3 opacity-40">&#x1F504;</div>
          <h3 className="font-display text-xl text-ink-strong mb-2">No recurring invoices yet</h3>
          <p className="text-sm text-ink-soft mb-4">Set up automated invoice schedules for your regular clients.</p>
          <button
            type="button"
            className="btn btn-primary text-sm"
            onClick={() => setShowForm(true)}
          >
            Create Your First Schedule
          </button>
        </div>
      )}

      {schedules.length > 0 && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="stat-card tone-brand flex-1">
              <div className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-1">Active Schedules</div>
              <div className="text-2xl font-bold font-mono">{activeCount}</div>
            </div>
            <div className="stat-card tone-good flex-1">
              <div className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-1">Total Schedules</div>
              <div className="text-2xl font-bold font-mono">{schedules.length}</div>
            </div>
          </div>

          <div className="space-y-3">
            {schedules.map((schedule, i) => (
              <div key={schedule.id} className={`panel flex flex-col sm:flex-row sm:items-center gap-3 ${!schedule.active ? "opacity-50" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink-strong truncate">{schedule.clientName}</h3>
                    <span className={`chip ${schedule.active ? "chip-good" : "chip-neutral"} text-[10px]`}>
                      {schedule.active ? "Active" : "Paused"}
                    </span>
                  </div>
                  {schedule.description && <p className="text-sm text-ink-soft mb-1">{schedule.description}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                    <span>₹{Number(schedule.amount).toLocaleString("en-IN")} + {schedule.taxRate}% GST</span>
                    <span>{FREQUENCIES.find((f) => f.value === schedule.frequency)?.label}</span>
                    <span>Next: {nextOccurrence(schedule.startDate, schedule.frequency)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/create?client=${encodeURIComponent(schedule.clientName)}&amount=${schedule.amount}&tax=${schedule.taxRate}`}
                    className="btn btn-primary text-xs px-3 py-1.5"
                  >
                    Generate Now
                  </Link>
                  <button type="button" className="btn btn-ghost text-xs px-3 py-1.5" onClick={() => handleToggle(i)}>
                    {schedule.active ? "Pause" : "Resume"}
                  </button>
                  <button type="button" className="btn btn-ghost text-xs px-3 py-1.5" onClick={() => handleEdit(i)}>Edit</button>
                  <button type="button" className="btn btn-danger text-xs px-3 py-1.5" onClick={() => handleDelete(i)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
