"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DonateModal } from "@/components/modals/DonateModal";
import { CareerModal } from "@/components/modals/CareerModal";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";
import { CAMPAIGN, SUPPORT_TYPES } from "@/lib/constants";
import type { CampaignStats, SupportType } from "@/types";
import { useRouter } from "next/navigation";

const DEFAULT_STATS: CampaignStats = {
  id: "", goal_amount: 350000, amount_raised: 0, donor_count: 0, updated_at: "",
};

export default function HomePage() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [careerModal, setCareerModal] = useState<SupportType | null>(null);
  const [stats, setStats] = useState<CampaignStats>(DEFAULT_STATS);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/campaign/stats")
      .then((r) => r.json())
      .then((d) => setStats({ ...DEFAULT_STATS, ...d }))
      .catch(() => {});
  }, []);

  const shareLinks = [
    { label: "Share on X", url: `https://twitter.com/intent/tweet?text=Help+Temitope+Ogungbuji+get+his+first+dev+laptop+%E2%80%94+%E2%82%A6350%2C000+campaign.+Every+contribution+counts!&url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL ?? "")}` },
    { label: "Share on WhatsApp", url: `https://wa.me/?text=Help+Temitope+get+a+laptop+%26+build+a+tech+career:+${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL ?? "")}` },
    { label: "Share on LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL ?? "")}` },
  ];

  return (
    <>
      <Nav onDonate={() => setDonateOpen(true)} />
      <main>
        <HeroSection stats={stats} onDonate={() => setDonateOpen(true)} onAbout={() => router.push("/about")} />

        <Divider />

        {/* Why This Laptop Matters */}
        <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
          <SectionLabel>Why This Laptop Matters</SectionLabel>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#1A1917", margin: "0 0 12px" }}>
            Access unlocks everything
          </h2>
          <p style={{ fontSize: 15, color: "#6B6860", maxWidth: 600, lineHeight: 1.85, margin: "0 0 36px" }}>
            The right hardware is not a luxury — it is a prerequisite for participating in modern software development.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {[
              { icon: "🖥️", title: "A proper development environment", body: "Running VS Code, Jupyter Notebooks, Docker containers, and database tools simultaneously requires more than a basic machine can offer." },
              { icon: "🎓", title: "Certification readiness", body: "Cloud and data engineering certifications require hands-on labs. A capable laptop means I can complete them without workarounds or limitations." },
              { icon: "💼", title: "Internship preparation", body: "Recruiters expect candidates to demonstrate working code. I cannot do that reliably without a machine I control and can configure fully." },
              { icon: "📡", title: "Impactful data projects", body: "My planned Sahel security analytics platform requires processing large datasets, running pipelines, and building dashboards — all at once." },
              { icon: "🔓", title: "Open-source contribution", body: "Contributing to open-source means cloning repos, running tests, and submitting pull requests — a workflow that needs a real local environment." },
              { icon: "📈", title: "Long-term career foundation", body: "The skills I build now compound over time. This laptop is not just for today — it is the foundation for years of professional growth." },
            ].map((item) => (
              <div key={item.title} style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 14, padding: "22px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif", marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.75 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Featured Project */}
        <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
          <SectionLabel>Featured Project</SectionLabel>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#1A1917", margin: "0 0 28px" }}>What I plan to build</h2>
          <div style={{ background: "#EEF3F8", border: "1px solid #C8D8E8", borderRadius: 16, padding: "30px 26px", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ fontSize: 44 }}>📡</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B3A5C", margin: 0 }}>Nigeria & Sahel Security Analytics Platform</h3>
                  <span style={{ padding: "3px 12px", borderRadius: 99, background: "#C8D8E8", color: "#1B3A5C", fontSize: 11, fontWeight: 700 }}>Planned</span>
                </div>
                <p style={{ fontSize: 14, color: "#3A5A78", lineHeight: 1.85, margin: "0 0 16px" }}>
                  A data ingestion pipeline and analytics dashboard tracking terror attacks, conflict events, and instability trends across Nigeria and the Sahel region. Built to surface actionable intelligence from public datasets — ACLED, GDELT, and open government sources — with the goal of informing civil society and policymakers.
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Python", "Data Engineering", "Public Safety", "Open Data", "dbt", "Airflow"].map((t) => (
                    <Tag key={t} variant="navy">{t}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 14, padding: "24px 22px" }}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ fontSize: 36 }}>⚙️</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1917", margin: "0 0 8px" }}>Reusable ETL Pipeline Framework</h3>
                <p style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.8, margin: "0 0 12px" }}>
                  A modular ETL framework for ingesting and transforming structured data from REST APIs and flat files into clean, analysis-ready datasets.
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Python", "SQL", "ETL", "Analytics Engineering"].map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* GitHub Section */}
        <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
          <SectionLabel>Open Source</SectionLabel>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#F3F2EF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0, border: "2px solid #E8E6E1" }}>
              🐙
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1A1917", margin: "0 0 8px" }}>Follow My Learning Journey</h3>
              <p style={{ fontSize: 14, color: "#6B6860", lineHeight: 1.8, margin: "0 0 16px" }}>
                I document my progress and push projects publicly as I build skills in Python, SQL, data engineering, and software development. Follow along on GitHub to watch the work happen in real time.
              </p>
              <a href={CAMPAIGN.GITHUB} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "1.5px solid #E8E6E1", background: "#F3F2EF", color: "#1A1917", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                🐙 github.com/Bambillion
              </a>
            </div>
          </div>
        </section>

        <Divider />

        {/* Other Ways to Help */}
        <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
          <SectionLabel>Other Ways to Help</SectionLabel>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#1A1917", margin: "0 0 12px" }}>
            Not in a position to donate?<br />That&apos;s completely okay.
          </h2>
          <p style={{ fontSize: 15, color: "#6B6860", maxWidth: 580, lineHeight: 1.85, margin: "0 0 30px" }}>
            There are meaningful ways to support my journey that cost nothing but a moment of your time.
          </p>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 16, padding: "26px 24px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif", marginBottom: 6 }}>Share this campaign</div>
            <div style={{ fontSize: 13, color: "#6B6860", marginBottom: 18, lineHeight: 1.7 }}>Help me reach more people — every share increases the chance of reaching the goal.</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {shareLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 13, fontWeight: 600, color: "#1A1917", textDecoration: "none", background: "#F3F2EF" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* Beyond Donations */}
        <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
          <SectionLabel>Career Support</SectionLabel>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#1A1917", margin: "0 0 12px" }}>
            Beyond Donations: Help Me Grow My Career
          </h2>
          <p style={{ fontSize: 15, color: "#6B6860", maxWidth: 620, lineHeight: 1.85, margin: "0 0 32px" }}>
            While financial support helps me purchase the tools I need, there are many other ways to contribute to my journey. Each of these actions could be as impactful as a donation.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {(Object.entries(SUPPORT_TYPES) as [SupportType, { label: string; icon: string }][]).map(([type, cfg]) => (
              <div key={type} style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{cfg.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif", marginBottom: 8 }}>{cfg.label}</div>
                <div style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.75, flex: 1, marginBottom: 16 }}>
                  {type === "internship" && "Know of an opening, graduate trainee program, or apprenticeship? A referral could change everything."}
                  {type === "learning_resource" && "Courses, books, YouTube channels, study roadmaps — share what has helped you succeed in tech."}
                  {type === "certification" && "Recommend certifications in data engineering, cloud, analytics, or software development."}
                  {type === "mentorship" && "Experienced professionals willing to provide guidance, technical feedback, or industry advice."}
                  {type === "project_idea" && "Ideas for data projects, open-source contributions, civic tech solutions, or software applications."}
                  {type === "networking" && "Let's build a meaningful professional relationship on LinkedIn, GitHub, or email."}
                </div>
                <button onClick={() => setCareerModal(type)}
                  style={{ padding: "9px 0", borderRadius: 8, border: "1.5px solid #1B3A5C", background: "none", color: "#1B3A5C", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {cfg.label} →
                </button>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Final CTA */}
        <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 540, margin: "0 auto" }}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>🙏</div>
            <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#1A1917", margin: "0 0 14px" }}>Every contribution matters</h2>
            <p style={{ fontSize: 15, color: "#6B6860", lineHeight: 1.85, margin: "0 0 28px" }}>
              Whether you donate, share, mentor, recommend a resource, or simply leave an encouraging message — you are part of this story. Thank you for supporting my journey.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setDonateOpen(true)}
                style={{ padding: "14px 32px", borderRadius: 10, border: "none", background: "#1B3A5C", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
                Donate Now
              </button>
              <Link href="/guestbook"
                style={{ padding: "14px 22px", borderRadius: 10, border: "1.5px solid #E8E6E1", background: "#FFFFFF", color: "#1A1917", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Leave a message
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      {careerModal && <CareerModal type={careerModal} onClose={() => setCareerModal(null)} />}
    </>
  );
}
