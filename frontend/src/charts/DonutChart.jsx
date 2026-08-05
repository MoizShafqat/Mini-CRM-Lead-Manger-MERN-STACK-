export default function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 54, cx = 70, cy = 70, stroke = 20;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d) => {
    const dash = (d.value / total) * circumference;
    const seg = { ...d, dash, gap: circumference - dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0f172a" strokeWidth={stroke} />
        {segments.map((s) => (
          <circle
            key={s.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px", transition: "stroke-dasharray 0.6s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#f1f5f9" fontSize={22} fontWeight={700}>
          {data.reduce((s, d) => s + d.value, 0)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize={11}>
          Total
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{d.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginLeft: "auto" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
