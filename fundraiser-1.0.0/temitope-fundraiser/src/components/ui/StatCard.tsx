interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      style={{
        background: accent ? "#EEF3F8" : "#FFFFFF",
        border: `1px solid ${accent ? "#C8D8E8" : "#E8E6E1"}`,
        borderRadius: 12,
        padding: "20px 22px",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#9C9A95", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent ? "#1B3A5C" : "#1A1917", fontFamily: "'Lora', Georgia, serif", lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "#9C9A95", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
