import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import "../styles/dashboard.css";

export default function AnalyticsPage({ analytics }) {
  const convRate = analytics.total
    ? Math.round((analytics.converted / analytics.total) * 100)
    : 0;
  const contactRate = analytics.total
    ? Math.round(((analytics.contacted + analytics.converted) / analytics.total) * 100)
    : 0;

  const chartData = [
    { label: "New",       value: analytics.new || 0,       color: "#6366f1" },
    { label: "Contacted", value: analytics.contacted || 0, color: "#f59e0b" },
    { label: "Converted", value: analytics.converted || 0, color: "#10b981" },
  ];

  const metrics = [
    { label: "Conversion Rate", value: `${convRate}%`,    sub: "leads became customers", color: "#10b981" },
    { label: "Contact Rate",    value: `${contactRate}%`, sub: "leads were contacted",   color: "#f59e0b" },
    { label: "Total Pipeline",  value: analytics.total || 0, sub: "leads in system",     color: "#6366f1" },
  ];

  return (
    <div className="page-enter">
      <h2 className="page-title">Analytics</h2>
      <p className="page-subtitle">Detailed pipeline performance metrics</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="chart-card">
          <div className="chart-title">Pipeline Overview</div>
          <BarChart data={chartData} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Lead Distribution</div>
          <DonutChart data={chartData} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {metrics.map((m) => (
          <div key={m.label} className="chart-card" style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: m.color, marginBottom: 6 }}>{m.value}</div>
            <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.label}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
