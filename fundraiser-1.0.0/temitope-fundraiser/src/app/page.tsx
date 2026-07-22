"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DonateModal } from "@/components/modals/DonateModal";
import { CareerModal } from "@/components/modals/CareerModal";
import { HeroSection } from "@/components/sections/HeroSection";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LinkRow } from "@/components/ui/LinkRow";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { Tag } from "@/components/ui/Tag";
import { CAMPAIGN, SUPPORT_TYPES } from "@/lib/constants";
import type { CampaignStats, SupportType } from "@/types";

const DEFAULT_STATS: CampaignStats = {
  id: "",
  goal_amount: 350000,
  amount_raised: 0,
  donor_count: 0,
  updated_at: "",
};

const WHY_ITEMS = [
  {
    icon: "🖥️",
    title: "A proper development environment",
    body: "Running VS Code, Jupyter Notebooks, Docker containers, and database tools simultaneously requires more than a basic machine can offer.",
  },
  {
    icon: "🎓",
    title: "Certification readiness",
    body: "Cloud and data engineering certifications require hands-on labs. A capable laptop means I can complete them without workarounds or limitations.",
  },
  {
    icon: "💼",
    title: "Internship preparation",
    body: "Recruiters expect candidates to demonstrate working code. I cannot do that reliably without a machine I control and can configure fully.",
  },
  {
    icon: "📡",
    title: "Impactful data projects",
    body: "My planned Sahel security analytics platform requires processing large datasets, running pipelines, and building dashboards — all at once.",
  },
  {
    icon: "🔓",
    title: "Open-source contribution",
    body: "Contributing to open-source means cloning repos, running tests, and submitting pull requests — a workflow that needs a real local environment.",
  },
  {
    icon: "📈",
    title: "Long-term career foundation",
    body: "The skills I build now compound over time. This laptop is not just for today — it is the foundation for years of professional growth.",
  },
];

const SUPPORT_DESCRIPTIONS: Record<SupportType, string> = {
  internship:
    "Know of an opening, graduate trainee program, or apprenticeship? A referral could change everything.",
  learning_resource:
    "Courses, books, YouTube channels, study roadmaps — share what has helped you succeed in tech.",
  certification:
    "Recommend certifications in data engineering, cloud, analytics, or software development.",
  mentorship:
    "Experienced professionals willing to provide guidance, technical feedback, or industry advice.",
  project_idea:
    "Ideas for data projects, open-source contributions, civic tech solutions, or software applications.",
  networking:
    "Let's build a meaningful professional relationship on LinkedIn, GitHub, or email.",
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

  const siteUrl = encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  const shareLinks = [
    {
      label: "Share on X",
      url: `https://twitter.com/intent/tweet?text=Help+Temitope+Ogungbuji+get+his+first+dev+laptop+%E2%80%94+%E2%82%A6350%2C000+campaign.+Every+contribution+counts!&url=${siteUrl}`,
    },
    {
      label: "Share on WhatsApp",
      url: `https://wa.me/?text=Help+Temitope+get+a+laptop+%26+build+a+tech+career:+${siteUrl}`,
    },
    {
      label: "Share on LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${siteUrl}`,
    },
  ];

  return (
    <div className="pb-14 sm:pb-0">
      <Nav onDonate={() => setDonateOpen(true)} />
      <main>
        {/* 1. Color-blocked hero (dark) */}
        <HeroSection
          stats={stats}
          onDonate={() => setDonateOpen(true)}
          onAbout={() => router.push("/about")}
        />

        {/* 2. Why This Laptop Matters (surface) */}
        <Section tone="surface">
          <SectionLabel>Why This Laptop Matters</SectionLabel>
          <h2 className="heading-2 m-0 mb-3">Access unlocks everything</h2>
          <p className="text-[15px] text-muted leading-[1.85] max-w-prose m-0 mb-9">
            The right hardware is not a luxury — it is a prerequisite for
            participating in modern software development.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="card">
                <div className="text-[28px] mb-3" aria-hidden>
                  {item.icon}
                </div>
                <div className="font-display font-bold text-[15px] text-ink mb-2">
                  {item.title}
                </div>
                <div className="text-[13px] text-muted leading-[1.75]">
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Featured Project (tint) */}
        <Section tone="tint">
          <SectionLabel>Featured Project</SectionLabel>
          <h2 className="heading-2 m-0 mb-7">What I plan to build</h2>

          <div className="bg-surface border border-navy-border rounded-2xl p-5 sm:p-7 mb-3.5">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="text-[40px] sm:text-[44px] leading-none" aria-hidden>
                📡
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                  <h3 className="heading-3 text-navy m-0">
                    Nigeria &amp; Sahel Security Analytics Platform
                  </h3>
                  <span className="px-3 py-0.5 rounded-full bg-navy-border text-navy text-[11px] font-bold">
                    Planned
                  </span>
                </div>
                <p className="text-sm text-[#3A5A78] leading-[1.85] m-0 mb-4">
                  A data ingestion pipeline and analytics dashboard tracking
                  terror attacks, conflict events, and instability trends across
                  Nigeria and the Sahel region. Built to surface actionable
                  intelligence from public datasets — ACLED, GDELT, and open
                  government sources — with the goal of informing civil society
                  and policymakers.
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    "Python",
                    "Data Engineering",
                    "Public Safety",
                    "Open Data",
                    "dbt",
                    "Airflow",
                  ].map((t) => (
                    <Tag key={t} variant="navy">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="text-[32px] sm:text-[36px] leading-none" aria-hidden>
                ⚙️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base text-ink m-0 mb-2">
                  Reusable ETL Pipeline Framework
                </h3>
                <p className="text-[13px] text-muted leading-[1.8] m-0 mb-3">
                  A modular ETL framework for ingesting and transforming
                  structured data from REST APIs and flat files into clean,
                  analysis-ready datasets.
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {["Python", "SQL", "ETL", "Analytics Engineering"].map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 4. Pull-quote (brand) */}
        <Section tone="surface">
          <QuoteBlock
            quote="I want to build systems that address real problems — not abstract exercises. Access to the right tools is the only thing standing between me and that work."
            name="Temitope Ogungbuji"
            role="Aspiring Software Developer"
          />
        </Section>

        {/* 5. GitHub / Open Source (canvas) */}
        <Section tone="canvas">
          <SectionLabel>Open Source</SectionLabel>
          <div className="card flex flex-col sm:flex-row gap-5 sm:items-center">
            <div
              className="w-16 h-16 rounded-full bg-subtle border-2 border-line
                         flex items-center justify-center text-[32px] shrink-0"
              aria-hidden
            >
              🐙
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="heading-3 m-0 mb-2">Follow My Learning Journey</h3>
              <p className="text-sm text-muted leading-[1.8] m-0 mb-4">
                I document my progress and push projects publicly as I build
                skills in Python, SQL, data engineering, and software
                development. Follow along on GitHub to watch the work happen in
                real time.
              </p>
              <a
                href={CAMPAIGN.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto text-sm"
              >
                🐙 github.com/Bambillion
              </a>
            </div>
          </div>
        </Section>

        {/* 6. Other Ways to Help — tappable link rows (tint) */}
        <Section tone="tint">
          <SectionLabel>Other Ways to Help</SectionLabel>
          <h2 className="heading-2 m-0 mb-3">
            Not in a position to donate? That&apos;s completely okay.
          </h2>
          <p className="text-[15px] text-muted leading-[1.85] max-w-prose m-0 mb-7">
            Sharing this campaign costs nothing but a moment of your time —
            and every share increases the chance of reaching the goal.
          </p>
          <div className="bg-surface rounded-2xl px-5 sm:px-7 py-2">
            {shareLinks.map((s) => (
              <LinkRow key={s.label} href={s.url} external label={s.label} />
            ))}
          </div>
        </Section>

        {/* 7. Career Support — tappable link rows (surface) */}
        <Section tone="surface">
          <SectionLabel>Career Support</SectionLabel>
          <h2 className="heading-2 m-0 mb-3">
            Beyond donations: help me grow my career
          </h2>
          <p className="text-[15px] text-muted leading-[1.85] max-w-prose m-0 mb-7">
            While financial support helps me purchase the tools I need, there
            are many other ways to contribute to my journey. Each of these
            actions could be as impactful as a donation.
          </p>
          <div className="bg-canvas border border-line rounded-2xl px-5 sm:px-7 py-2">
            {(
              Object.entries(SUPPORT_TYPES) as [
                SupportType,
                { label: string; icon: string },
              ][]
            ).map(([type, cfg]) => (
              <LinkRow
                key={type}
                onClick={() => setCareerModal(type)}
                icon={cfg.icon}
                label={cfg.label}
                sublabel={SUPPORT_DESCRIPTIONS[type]}
              />
            ))}
          </div>
        </Section>

        {/* 8. Final CTA (dark) */}
        <Section tone="dark" innerClassName="text-center">
          <div className="max-w-[540px] mx-auto">
            <div className="text-[44px] mb-4" aria-hidden>
              🙏
            </div>
            <h2 className="heading-2 text-white m-0 mb-3.5">
              Every contribution matters
            </h2>
            <p className="text-[15px] text-white/80 leading-[1.85] m-0 mb-7">
              Whether you donate, share, mentor, recommend a resource, or simply
              leave an encouraging message — you are part of this story. Thank
              you for supporting my journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setDonateOpen(true)}
                className="btn-primary w-full sm:w-auto px-8"
              >
                Donate Now
              </button>
              <Link
                href="/guestbook"
                className="btn w-full sm:w-auto border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Leave a message
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />

      {/* Sticky bottom CTA bar — mobile only */}
      <StickyCTA onClick={() => setDonateOpen(true)} />

      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      {careerModal && (
        <CareerModal type={careerModal} onClose={() => setCareerModal(null)} />
      )}
    </div>
  );
}
