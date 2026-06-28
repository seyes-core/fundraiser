"use client";
import { CampaignStats } from "@/types";
import { formatNaira, calcPercent } from "@/lib/format";
import { LAPTOP_SPECS } from "@/lib/constants";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface HeroSectionProps {
  stats: CampaignStats;
  onDonate: () => void;
  onAbout: () => void;
}

export function HeroSection({ stats, onDonate, onAbout }: HeroSectionProps) {
  return (
    <section style={{ maxWidth: 1060, margin: "0 auto", padding: "64px 20px 52px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 52, alignItems: "start" }}>
        {/* Left: copy */}
        <div>
          <SectionLabel>Open Campaign · June 2026</SectionLabel>
          <h1 style={{ margin: "0 0 20px", fontSize: "clamp(30px,5vw,52px)", fontWeight: 700, color: "#1A1917", lineHeight: 1.12, letterSpacing: "-0.025em" }}>
            Help Me Build<br />My Future in<br />Technology
          </h1>
          <p style={{ fontSize: 17, color: "#6B6860", lineHeight: 1.85, margin: "0 0 12px", maxWidth: 520 }}>
            My name is <strong style={{ color: "#1A1917" }}>Temitope Ogungbuji</strong>. I am an aspiring software developer seeking internship opportunities while building skills in Python, SQL, and data engineering.
          </p>
          <p style={{ fontSize: 17, color: "#6B6860", lineHeight: 1.85, margin: "0 0 32px", maxWidth: 520 }}>
            I am raising <strong style={{ color: "#1A1917" }}>₦350,000</strong> to purchase a Dell Latitude 7400 laptop — the tool I need to build projects, earn certifications, contribute to open-source, and compete for internship roles.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={onDonate}
              style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: "#1B3A5C", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
              Donate Now
            </button>
            <button onClick={onAbout}
              style={{ padding: "14px 22px", borderRadius: 10, border: "1.5px solid #E8E6E1", background: "#FFFFFF", color: "#1A1917", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
              Read my story
            </button>
          </div>
        </div>

        {/* Right: laptop card */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 18, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {/* Laptop illustration */}
          <div style={{ background: "#F3F2EF", borderRadius: 12, padding: "28px 20px", textAlign: "center", marginBottom: 22, border: "1px solid #E8E6E1" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B6860", letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" }}>Campaign Target</div>
            <div style={{ fontSize: 52, fontFamily: "'Lora', Georgia, serif", fontWeight: 700, color: "#1B3A5C", lineHeight: 1 }}>
              {formatNaira(stats.goal_amount)}
            </div>
            <div style={{ fontSize: 13, color: "#9C9A95", marginTop: 8 }}>Dell Latitude 7400</div>
          </div>

          {/* Specs grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
            {LAPTOP_SPECS.slice(0, 4).map((s) => (
              <div key={s.label} style={{ background: "#FAFAF8", borderRadius: 8, padding: "9px 12px", border: "1px solid #E8E6E1" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9C9A95" }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1917", marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <ProgressBar raised={stats.amount_raised} goal={stats.goal_amount} />

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1B3A5C", fontFamily: "'Lora', Georgia, serif" }}>{formatNaira(stats.amount_raised)}</div>
              <div style={{ fontSize: 11, color: "#9C9A95", marginTop: 2 }}>raised</div>
            </div>
            <div style={{ width: 1, background: "#E8E6E1" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif" }}>{stats.donor_count}</div>
              <div style={{ fontSize: 11, color: "#9C9A95", marginTop: 2 }}>donors</div>
            </div>
            <div style={{ width: 1, background: "#E8E6E1" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif" }}>{calcPercent(stats.amount_raised, stats.goal_amount)}%</div>
              <div style={{ fontSize: 11, color: "#9C9A95", marginTop: 2 }}>of goal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
