import "../styles/sidebar.css";

const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "leads",     icon: "👥", label: "Leads"     },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "settings",  icon: "⚙",  label: "Settings"  },
];

export default function Sidebar({ active, setActive, user, onLogout }) {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎯</div>
        <span className="sidebar-logo-text">LeadFlow</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${active === n.id ? "active" : ""}`}
            onClick={() => setActive(n.id)}
          >
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
            {active === n.id && <div className="nav-item-dot" />}
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div className="sidebar-user">
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">Admin</div>
          </div>
          <span className="sidebar-logout" onClick={onLogout} title="Logout">
            ⏏
          </span>
        </div>
      </div>
    </div>
  );
}
