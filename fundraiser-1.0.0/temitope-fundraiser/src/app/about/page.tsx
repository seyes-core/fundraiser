"use client";
import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DonateModal } from "@/components/modals/DonateModal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";
import { CAMPAIGN, SKILLS_CURRENT, SKILLS_LEARNING } from "@/lib/constants";

export default function AboutPage() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <Nav onDonate={() => setDonateOpen(true)} />
      <main
        style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px 80px" }}
      >
        <SectionLabel>About</SectionLabel>
        <h1
          style={{
            fontSize: "clamp(28px,5vw,44px)",
            fontWeight: 700,
            color: "#1A1917",
            margin: "0 0 32px",
            lineHeight: 1.15,
          }}
        >
          Temitope Ogungbuji
        </h1>

        {/* Bio */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E1",
            borderRadius: 16,
            padding: "28px 26px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 16px",
            }}
          >
            Biography
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#6B6860",
              lineHeight: 1.9,
              margin: "0 0 16px",
            }}
          >
            I am an aspiring software developer and active job seeker based in
            Nigeria, focused on building a career in data engineering, analytics
            engineering, and software development. I started with Python and
            SQL, and have been steadily expanding my knowledge across the
            technology stack.
          </p>
          <p
            style={{
              fontSize: 15,
              color: "#6B6860",
              lineHeight: 1.9,
              margin: "0 0 16px",
            }}
          >
            My interest in technology is not abstract — I want to build systems
            that address real problems. The project I am most excited about is a
            data pipeline and analytics platform that surfaces security and
            terrorism trends across Nigeria and the Sahel region, using public
            datasets to inform civil society and policymakers.
          </p>
          <p
            style={{
              fontSize: 15,
              color: "#6B6860",
              lineHeight: 1.9,
              margin: 0,
            }}
          >
            I am looking for internship opportunities, mentorship, and
            connections within the technology community. I believe in building
            in public and sharing my learning journey openly on GitHub.
          </p>
        </div>

        {/* Skills grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E6E1",
              borderRadius: 14,
              padding: "22px 20px",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1A1917",
                margin: "0 0 14px",
              }}
            >
              Current Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {SKILLS_CURRENT.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "#EEF3F8",
              border: "1px solid #C8D8E8",
              borderRadius: 14,
              padding: "22px 20px",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1B3A5C",
                margin: "0 0 14px",
              }}
            >
              Currently Learning
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {SKILLS_LEARNING.map((s) => (
                <Tag key={s} variant="navy">
                  {s}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E1",
            borderRadius: 16,
            padding: "28px 26px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 24px",
            }}
          >
            Learning Roadmap
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {[
              {
                phase: "Now",
                label: "Foundation Deepening",
                items: [
                  "Python (advanced OOP, type hints, testing)",
                  "SQL (window functions, query optimization)",
                  "Git workflow and code review practices",
                ],
              },
              {
                phase: "Next",
                label: "Data Engineering Core",
                items: [
                  "Apache Airflow or Prefect for orchestration",
                  "dbt for analytics engineering",
                  "PostgreSQL & cloud-hosted databases",
                  "REST API ingestion and data contracts",
                ],
              },
              {
                phase: "Later",
                label: "Systems Programming",
                items: [
                  "C Programming (memory management, pointers)",
                  "C++ (systems thinking, performance)",
                  "Java (enterprise patterns, Spring fundamentals)",
                ],
              },
              {
                phase: "Goal",
                label: "Professional Entry",
                items: [
                  "Data Engineering or Software Developer internship",
                  "AWS Solutions Architect or GCP Associate certification",
                  "5+ deployed open-source projects on GitHub",
                  "Active contributor to a civic tech initiative",
                ],
              },
            ].map((r) => (
              <div
                key={r.phase}
                style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: r.phase === "Goal" ? "#1B3A5C" : "#F3F2EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 11,
                    color: r.phase === "Goal" ? "#fff" : "#6B6860",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {r.phase}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#1A1917",
                      marginBottom: 6,
                    }}
                  >
                    {r.label}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {r.items.map((i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: 13,
                          color: "#6B6860",
                          lineHeight: 1.8,
                        }}
                      >
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career goals */}
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
              fontSize: 20,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 14px",
            }}
          >
            Career Goals
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#6B6860",
              lineHeight: 1.85,
              margin: "0 0 14px",
            }}
          >
            My immediate goal is to secure an internship in data engineering,
            analytics engineering, or software development. Longer term, I aim
            to work on infrastructure that addresses Africa&apos;s most pressing
            problems — from security data to public health analytics to civic
            technology.
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#6B6860",
              lineHeight: 1.85,
              margin: "0 0 14px",
            }}
          >
            I am open to remote, hybrid, and in-person opportunities. I am
            particularly interested in organizations working at the intersection
            of technology and public good.
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {[
              "Data Engineering",
              "Analytics Engineering",
              "Software Development",
              "Civic Tech",
              "Open Source",
            ].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        <Divider my={40} />

        <div style={{ textAlign: "center" }}>
          <a
            href={CAMPAIGN.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 22px",
              borderRadius: 10,
              border: "1.5px solid #E8E6E1",
              background: "#F3F2EF",
              color: "#1A1917",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              marginRight: 12,
            }}
          >
            🐙 View on GitHub
          </a>
          <button
            onClick={() => setDonateOpen(true)}
            style={{
              padding: "11px 22px",
              borderRadius: 10,
              border: "none",
              background: "#1B3A5C",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Support Temitope
          </button>
        </div>
      </main>
      <Footer />
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </>
  );
}
