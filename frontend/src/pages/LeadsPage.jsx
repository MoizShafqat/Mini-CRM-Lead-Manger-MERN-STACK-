import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import EditModal from "../components/EditModal";
import { STATUS_COLORS } from "../components/StatusBadge";
import "../styles/leads.css";
import "../styles/shared.css";

const EMPTY_LEAD = { name: "", email: "", phone: "", assignedTo: "", status: "new", notes: "" };

export default function LeadsPage({ toast }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [newLead, setNewLead] = useState(EMPTY_LEAD);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8, search, status: statusFilter });
      const res = await apiFetch(`/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalPages(data.pages || 1);
    } catch {
      toast("Failed to load leads", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [page, search, statusFilter]);

  const addLead = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/leads", {
        method: "POST",
        body: JSON.stringify(newLead),
      });
      if (!res.ok) throw new Error();
      setNewLead(EMPTY_LEAD);
      setShowForm(false);
      toast("Lead added ✓");
      fetchLeads();
    } catch {
      toast("Failed to add lead", "error");
    }
  };

  const updateStatus = async (id, status) => {
    await apiFetch(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    toast("Status updated ✓");
    fetchLeads();
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await apiFetch(`/leads/${id}`, { method: "DELETE" });
    toast("Lead deleted", "warn");
    fetchLeads();
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Assigned To", "Status", "Notes", "Created"];
    const rows = leads.map((l) => [
      l.name, l.email, l.phone || "", l.assignedTo || "",
      l.status, (l.notes || "").replace(/,/g, ";"),
      new Date(l.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "leads.csv";
    a.click();
    toast("CSV exported ✓");
  };

  const formFields = [
    ["Name *",     "name",       "text" ],
    ["Email *",    "email",      "email"],
    ["Phone",      "phone",      "text" ],
    ["Assign To",  "assignedTo", "text" ],
  ];

  return (
    <div className="page-enter">
      {editLead && (
        <EditModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSave={fetchLeads}
          toast={toast}
        />
      )}

      {/* Header */}
      <div className="leads-header">
        <div>
          <h2 className="leads-title">Leads</h2>
          <p className="leads-subtitle">Manage and track your prospects</p>
        </div>
        <div className="leads-actions">
          <button className="btn-secondary" onClick={exportCSV}>↓ Export CSV</button>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "+ Add Lead"}
          </button>
        </div>
      </div>

      {/* Add Lead Form */}
      {showForm && (
        <div className="card leads-form">
          <h3 className="leads-form-title">New Lead</h3>
          <form onSubmit={addLead}>
            <div className="leads-form-grid">
              {formFields.map(([ph, k, type]) => (
                <input
                  key={k}
                  className="inp"
                  placeholder={ph}
                  value={newLead[k]}
                  type={type}
                  onChange={(e) => setNewLead({ ...newLead, [k]: e.target.value })}
                  required={ph.includes("*")}
                />
              ))}
              <select
                className="inp"
                value={newLead.status}
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <textarea
              className="inp"
              style={{ resize: "vertical", minHeight: 70, marginBottom: 12 }}
              placeholder="Notes (optional)"
              value={newLead.notes}
              onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
            />
            <button
              className="btn-primary"
              type="submit"
              style={{ width: "auto", padding: "10px 28px" }}
            >
              Save Lead
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="leads-filters">
        <input
          className="inp"
          style={{ flex: 1 }}
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="inp"
          style={{ width: 170 }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* Table */}
      <div className="leads-table-wrap">
        {loading ? (
          <p className="leads-empty">Loading...</p>
        ) : leads.length === 0 ? (
          <p className="leads-empty">No leads found. Add your first one!</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="leads-table">
              <thead>
                <tr>
                  {["Lead", "Phone", "Assigned To", "Status", "Date", "Actions"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead._id}
                    style={{ borderBottom: i < leads.length - 1 ? "1px solid #0f172a" : "none" }}
                  >
                    <td>
                      <div className="lead-cell">
                        <div className="lead-avatar">{lead.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <div className="lead-name">{lead.name}</div>
                          <div className="lead-email">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="lead-secondary">{lead.phone || "—"}</td>
                    <td className="lead-secondary">{lead.assignedTo || "—"}</td>
                    <td>
                      <select
                        className="status-select"
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        style={{
                          background: STATUS_COLORS[lead.status] + "22",
                          color: STATUS_COLORS[lead.status],
                          borderColor: STATUS_COLORS[lead.status] + "44",
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                    </td>
                    <td className="lead-date">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="lead-row-actions">
                        <button className="btn-edit" onClick={() => setEditLead(lead)}>Edit</button>
                        <button className="btn-danger" onClick={() => deleteLead(lead._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span className="pagination-info">Page {page} of {totalPages}</span>
            <button className="pagination-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
