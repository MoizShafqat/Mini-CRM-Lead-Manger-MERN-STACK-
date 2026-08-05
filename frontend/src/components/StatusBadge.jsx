import "../styles/modal.css";

export const STATUS_COLORS = {
  new: "#6366f1",
  contacted: "#f59e0b",
  converted: "#10b981",
};

export default function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || "#64748b";
  return (
    <span
      className="status-badge"
      style={{
        background: c + "22",
        color: c,
        borderColor: c + "44",
      }}
    >
      {status}
    </span>
  );
}
