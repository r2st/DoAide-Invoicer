import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { usePageTitle } from "../hooks/usePageTitle";
import { loadClients, saveClient, deleteClient } from "../lib/clientStore";

const EMPTY_CLIENT = { name: "", email: "", phone: "", address: "", gstin: "" };

export default function ClientsPage() {
  usePageTitle("Clients");
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_CLIENT });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => { setClients(loadClients()); }, []);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) { setError("Client name is required."); return; }
    const entry = saveClient({ ...form, id: editId || undefined });
    setClients(loadClients());
    setForm({ ...EMPTY_CLIENT });
    setShowForm(false);
    setEditId(null);
    setError("");
  };

  const handleEdit = (client) => {
    setForm({ name: client.name || "", email: client.email || "", phone: client.phone || "", address: client.address || "", gstin: client.gstin || "" });
    setEditId(client.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = (id) => {
    deleteClient(id);
    setClients(loadClients());
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ ...EMPTY_CLIENT });
    setEditId(null);
    setError("");
  };

  const filtered = search.trim()
    ? clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : clients;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-ink-soft mt-1">Save client details for quick reuse on invoices.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY_CLIENT }); setError(""); }}
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="panel mb-5">
          <h2 className="font-display text-lg text-ink-strong mb-4">
            {editId ? "Edit Client" : "Add New Client"}
          </h2>
          <ErrorBanner message={error} onDismiss={() => setError("")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Client Name *</label>
              <input className="input-field text-sm" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Email</label>
              <input type="email" className="input-field text-sm" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="billing@acme.com" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Phone</label>
              <input type="tel" className="input-field text-sm" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">GSTIN</label>
              <input className="input-field text-sm font-mono" value={form.gstin} onChange={(e) => updateField("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-1">Address</label>
              <textarea className="input-field text-sm" rows={2} value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Street, City, State, PIN" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="button" className="btn btn-primary text-sm" onClick={handleSave}>
              {editId ? "Update Client" : "Save Client"}
            </button>
            <button type="button" className="btn btn-ghost text-sm" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {clients.length > 0 && (
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search clients by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-sm w-full sm:w-72"
          />
        </div>
      )}

      {clients.length === 0 && !showForm && (
        <div className="panel text-center py-12">
          <div className="text-4xl mb-3 opacity-40">&#x1F465;</div>
          <h3 className="font-display text-xl text-ink-strong mb-2">No clients saved yet</h3>
          <p className="text-sm text-ink-soft mb-4">Save your clients&apos; details once and reuse them on every invoice.</p>
          <button type="button" className="btn btn-primary text-sm" onClick={() => setShowForm(true)}>
            Add Your First Client
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="panel p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>GSTIN</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id}>
                    <td className="font-medium text-ink-strong">{client.name}</td>
                    <td className="text-sm">{client.email || "—"}</td>
                    <td className="text-sm">{client.phone || "—"}</td>
                    <td className="font-mono text-xs">{client.gstin || "—"}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/create?client_name=${encodeURIComponent(client.name)}&client_email=${encodeURIComponent(client.email || "")}&client_phone=${encodeURIComponent(client.phone || "")}&client_gstin=${encodeURIComponent(client.gstin || "")}&client_address=${encodeURIComponent(client.address || "")}`}
                          className="btn btn-primary text-xs px-3 py-1.5"
                        >
                          Use for Invoice
                        </Link>
                        <button type="button" className="btn btn-ghost text-xs px-3 py-1.5" onClick={() => handleEdit(client)}>Edit</button>
                        <button type="button" className="btn btn-danger text-xs px-3 py-1.5" onClick={() => handleDelete(client.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {clients.length > 0 && filtered.length === 0 && (
        <div className="panel text-center py-8">
          <p className="text-ink-soft">No clients match &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
