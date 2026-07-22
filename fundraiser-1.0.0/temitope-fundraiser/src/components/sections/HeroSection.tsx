"use client";
import { CampaignStats } from "@/types";
import { formatNaira, calcPercent } from "@/lib/format";
import { LAPTOP_SPECS } from "@/lib/constants";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface HeroSectionProps {
  stats: CampaignStats;
  onDonate: () => void;
  onAbout: () => void;
}

/**
 * Color-blocked hero — dark navy panel, large white headline that stays big
 * on mobile (clamp), and ONE accent CTA. Campaign card stacks below the copy
 * on mobile and sits beside it from lg up.
 */
export function HeroSection({ stats, onDonate, onAbout }: HeroSectionProps) {
  return (
    <section className="bg-navy text-white">
      <div className="container-site section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Left: copy */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 mb-4">
              Open Campaign · June 2026
            </div>
            <h1 className="font-display font-bold text-white text-h1 m-0 mb-5">
              Help Me Build My Future in Technology
            </h1>
            <p className="text-[16px] sm:text-[17px] text-white/80 leading-[1.75] m-0 mb-3 max-w-prose">
              My name is <strong className="text-white">Temitope Ogungbuji</strong>.
              I am an aspiring software developer seeking internship
              opportunities while building skills in Python, SQL, and data
              engineering.
            </p>
            <p className="text-[16px] sm:text-[17px] text-white/80 leading-[1.75] m-0 mb-8 max-w-prose">
              I am raising <strong className="text-white">₦350,000</strong> to
              purchase a Dell Latitude 7400 laptop — the tool I need to build
              projects, earn certifications, contribute to open-source, and
              compete for internship roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onDonate} className="btn-primary w-full sm:w-auto px-8">
                Donate Now
              </button>
              <button
                onClick={onAbout}
                className="btn w-full sm:w-auto border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Read my story
              </button>
            </div>
          </div>

          {/* Right: campaign card */}
          <div className="bg-surface text-ink rounded-2xl p-5 sm:p-7 shadow-card">
            {/* Target */}
            <div className="bg-subtle border border-line rounded-xl px-5 py-7 text-center mb-5">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.06em] text-muted mb-3">
                Campaign Target
              </div>
              <div className="font-display font-bold text-navy leading-none text-[clamp(2.5rem,10vw,3.25rem)]">
                {formatNaira(stats.goal_amount)}
              </div>
              <div className="text-[13px] text-faint mt-2">
                Dell Latitude 7400
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {LAPTOP_SPECS.slice(0, 4).map((s) => (
                <div
                  key={s.label}
                  className="bg-canvas border border-line rounded-lg px-3 py-2.5"
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.07em] text-faint">
                    {s.label}
                  </div>
                  <div className="text-[13px] font-semibold text-ink mt-0.5">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <ProgressBar raised={stats.amount_raised} goal={stats.goal_amount} />

            {/* Stats row */}
            <div className="mt-4 flex divide-x divide-line">
              {[
                {
                  value: formatNaira(stats.amount_raised),
                  label: "raised",
                  navy: true,
                },
                { value: String(stats.donor_count), label: "donors" },
                {
                  value: `${calcPercent(stats.amount_raised, stats.goal_amount)}%`,
                  label: "of goal",
                },
              ].map((s) => (
                <div key={s.label} className="flex-1 text-center px-1">
                  <div
                    className={`font-display font-bold text-lg sm:text-xl ${
                      s.navy ? "text-navy" : "text-ink"
                    }`}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] text-faint mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
