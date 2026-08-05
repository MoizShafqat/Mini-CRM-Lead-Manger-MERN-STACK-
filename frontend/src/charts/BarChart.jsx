export default function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, padding: "0 8px" }}>
      {data.map((d) => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.value}</span>
          <div style={{ width: "100%", background: "#0f172a", borderRadius: 6, height: 80, display: "flex", alignItems: "flex-end" }}>
            <div style={{
              width: "100%",
              background: d.color,
              borderRadius: 6,
              height: `${(d.value / max) * 100}%`,
              minHeight: d.value ? 6 : 0,
              transition: "height 0.6s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}