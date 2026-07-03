"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DonateModal } from "@/components/modals/DonateModal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Divider } from "@/components/ui/Divider";
import { LAPTOP_SPECS } from "@/lib/constants";
import { formatNaira, formatDate } from "@/lib/format";
import type { CampaignStats, CampaignUpdate } from "@/types";

const DEFAULT_STATS: CampaignStats = {
  id: "",
  goal_amount: 350000,
  amount_raised: 0,
  donor_count: 0,
  updated_at: "",
};

export default function TransparencyPage() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [stats, setStats] = useState<CampaignStats>(DEFAULT_STATS);
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);

  useEffect(() => {
    fetch("/api/campaign/stats")
      .then((r) => r.json())
      .then((d) => setStats({ ...DEFAULT_STATS, ...d }))
      .catch(() => {});
    fetch("/api/campaign/updates")
      .then((r) => r.json())
      .then((d) => setUpdates(d.updates ?? []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Nav onDonate={() => setDonateOpen(true)} />
      <main
        style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px 80px" }}
      >
        <SectionLabel>Transparency</SectionLabel>
        <h1
          style={{
            fontSize: "clamp(26px,5vw,42px)",
            fontWeight: 700,
            color: "#1A1917",
            margin: "0 0 12px",
            lineHeight: 1.15,
          }}
        >
          Campaign Transparency
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#6B6860",
            lineHeight: 1.85,
            margin: "0 0 36px",
            maxWidth: 580,
          }}
        >
          Full accountability. Here is everything you need to know — where the
          money goes, how progress is tracked, and what happens after the laptop
          is purchased.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <StatCard
            label="Campaign Goal"
            value={formatNaira(stats.goal_amount)}
          />
          <StatCard
            label="Amount Raised"
            value={formatNaira(stats.amount_raised)}
            sub="Updated in real time"
            accent
          />
          <StatCard
            label="Donors"
            value={stats.donor_count.toString()}
            sub="Anonymous contributors"
          />
        </div>
        <ProgressBar raised={stats.amount_raised} goal={stats.goal_amount} />
        {stats.updated_at && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#9C9A95" }}>
            Last updated: {formatDate(stats.updated_at)}
          </div>
        )}

        <Divider my={40} />

        {/* Laptop spec */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E1",
            borderRadius: 16,
            padding: "26px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 18px",
            }}
          >
            What the funds are for
          </h2>
          <div style={{ display: "grid", gap: 8 }}>
            {LAPTOP_SPECS.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#F3F2EF",
                  borderRadius: 8,
                }}
              >
                <span
                  style={{ fontSize: 13, color: "#6B6860", fontWeight: 600 }}
                >
                  {s.label}
                </span>
                <span
                  style={{ fontSize: 13, color: "#1A1917", fontWeight: 700 }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment */}
        <div
          style={{
            background: "#FDF4E4",
            border: "1px solid #E8C97A",
            borderRadius: 14,
            padding: "22px 20px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#7A500A",
              marginBottom: 10,
            }}
          >
            My commitment to you
          </div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {[
              "I will post photos upon receiving the laptop.",
              "I will write a public thank-you message naming every platform and community that helped.",
              "I will share project updates as I complete work on the laptop.",
              "If the campaign exceeds the goal, I will disclose the excess and announce how it is used.",
              "If the goal is not reached within a reasonable timeframe, I will make a decision and disclose it here.",
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontSize: 13,
                  color: "#8B5E0A",
                  lineHeight: 1.85,
                  marginBottom: 4,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Post-purchase */}
        <div
          style={{
            background: "#F3F2EF",
            border: "1px solid #E8E6E1",
            borderRadius: 14,
            padding: "22px 20px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1A1917",
              marginBottom: 8,
            }}
          >
            📦 Post-Purchase Updates
          </div>
          <div style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.8 }}>
            Once the laptop is purchased, this section will be updated with:
          </div>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {[
              "Unboxing / received photos",
              "A personal thank-you message to all donors and supporters",
              "First project progress updates built on the new machine",
            ].map((i) => (
              <li
                key={i}
                style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.8 }}
              >
                {i}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E1",
            borderRadius: 16,
            padding: "26px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 22px",
            }}
          >
            Campaign Timeline
          </h2>
          {updates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 13, color: "#9C9A95" }}>
                <strong style={{ color: "#6B6860", fontSize: 14 }}>
                  Campaign launched — June 25, 2026
                </strong>
                <br />
                The campaign is now live. Thank you to everyone who has visited,
                shared, and offered encouragement.
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              {updates.map((u) => (
                <div
                  key={u.id}
                  style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#1B3A5C",
                      marginTop: 4,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#9C9A95",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {formatDate(u.created_at)}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1A1917",
                        marginBottom: 6,
                      }}
                    >
                      {u.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#6B6860",
                        lineHeight: 1.8,
                      }}
                    >
                      {u.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button
            onClick={() => setDonateOpen(true)}
            style={{
              padding: "13px 28px",
              borderRadius: 10,
              border: "none",
              background: "#1B3A5C",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Donate to the Campaign
          </button>
        </div>
      </main>
      <Footer />
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </>
  );
}
