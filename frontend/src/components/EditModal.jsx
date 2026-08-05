import { useState } from "react";
import { apiFetch } from "../api/api";
import "../styles/modal.css";
import "../styles/shared.css";

export default function EditModal({ lead, onClose, onSave, toast }) {
  const [form, setForm] = useState({ ...lead });

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/leads/${lead._id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast("Lead updated ✓");
      onSave();
      onClose();
    } catch {
      toast("Failed to update", "error");
    }
  };

  const fields = [
    ["Name",        "name",       "text" ],
    ["Email",       "email",      "email"],
    ["Phone",       "phone",      "text" ],
    ["Assigned To", "assignedTo", "text" ],
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">Edit Lead</h3>
          <span className="modal-close" onClick={onClose}>✕</span>
        </div>

        <form className="modal-form" onSubmit={handle}>
          {fields.map(([ph, key, type]) => (
            <input
              key={key}
              className="inp"
              type={type}
              placeholder={ph}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key === "name" || key === "email"}
            />
          ))}

          <select
            className="inp"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>

          <textarea
            className="inp"
            style={{ resize: "vertical", minHeight: 80 }}
            placeholder="Notes..."
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, margin: 0 }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
