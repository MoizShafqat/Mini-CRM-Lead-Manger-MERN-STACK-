import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import StatusBadge from "../components/StatusBadge";
import "../styles/dashboard.css";

const STATS = (a) => [
  { label: "Total Leads", value: a.total || 0,     color: "#6366f1" },
  { label: "New",         value: a.new || 0,        color: "#3b82f6" },
  { label: "Contacted",   value: a.contacted || 0,  color: "#f59e0b" },
  { label: "Converted",   value: a.converted || 0,  color: "#10b981" },
];

const CHART_DATA = (a) => [
  { label: "New",       value: a.new || 0,       color: "#6366f1" },
  { label: "Contacted", value: a.contacted || 0, color: "#f59e0b" },
  { label: "Converted", value: a.converted || 0, color: "#10b981" },
];

export default function DashboardPage({ analytics, leads }) {
  const convRate = analytics.total
    ? Math.round((analytics.converted / analytics.total) * 100)
    : 0;

  return (
    <div className="page-enter">
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Overview of your lead pipeline</p>

      {/* Stat cards */}
      <div className="stats-grid">
        {STATS(analytics).map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Pipeline Stages</div>
          <BarChart data={CHART_DATA(analytics)} />
        </div>

        <div className="chart-card">
          <div className="chart-title">Lead Distribution</div>
          <DonutChart data={CHART_DATA(analytics)} />
        </div>

        <div className="chart-card">
          <div className="chart-title">Conversion Rate</div>
          <div className="conversion-display">
            <div className="conversion-rate">{convRate}%</div>
            <div className="conversion-label">of leads converted</div>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${convRate}%` }} />
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="recent-card">
        <div className="recent-title">Recent Leads</div>
        {leads.length === 0 && (
          <p style={{ color: "#64748b", fontSize: 14 }}>No leads yet. Add your first one!</p>
        )}
        {leads.slice(0, 5).map((lead) => (
          <div key={lead._id} className="recent-row">
            <div className="recent-avatar">{lead.name?.[0]?.toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div className="recent-name">{lead.name}</div>
              <div className="recent-email">{lead.email}</div>
            </div>
            <StatusBadge status={lead.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
