import "../styles/dashboard.css";

export default function SettingsPage({ user }) {
  const details = [
    ["Role",   "Admin"      ],
    ["Plan",   "Free Tier"  ],
    ["Status", "Active ✓"  ],
  ];

  return (
    <div className="page-enter">
      <h2 className="page-title">Settings</h2>
      <p className="page-subtitle">Your account details</p>

      <div className="chart-card" style={{ padding: 28, maxWidth: 480 }}>
        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #334155" }}>
          <div style={{ width: 56, height: 56, background: "#6366f1", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18 }}>{user.name}</div>
            <div style={{ color: "#64748b", fontSize: 14 }}>{user.email}</div>
          </div>
        </div>

        {/* Details */}
        {details.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #0f172a" }}>
            <span style={{ color: "#64748b", fontSize: 14 }}>{k}</span>
            <span style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
