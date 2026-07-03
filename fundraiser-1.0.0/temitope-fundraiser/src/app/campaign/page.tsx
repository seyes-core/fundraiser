import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import ProgressBar from "@/components/ui/ProgressBar";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { CampaignStats, CampaignUpdate } from "@/types";

export const metadata: Metadata = {
  title: "Campaign Transparency",
  description:
    "Full transparency on the Temitope laptop fundraising campaign — current progress, donor count, and all campaign updates.",
};

export const revalidate = 120;

async function getData() {
  const [statsRes, updatesRes] = await Promise.all([
    supabase.from("campaign_stats").select("*").single(),
    supabase
      .from("campaign_updates")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return {
    stats: statsRes.data as CampaignStats | null,
    updates: (updatesRes.data || []) as CampaignUpdate[],
  };
}

export default async function CampaignPage() {
  const { stats, updates } = await getData();

  const defaultStats: CampaignStats = {
    id: "",
    goal_amount: 350000,
    amount_raised: 0,
    donor_count: 0,
    updated_at: new Date().toISOString(),
  };

  const campaignStats = stats || defaultStats;

  return (
    <SiteLayout>
      <div className="section">
        <div className="container-site">
          <div className="max-w-2xl mb-10">
            <p className="label-tag">Campaign Transparency</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Where we stand
            </h1>
            <p className="text-stone-500 leading-relaxed">
              I believe in full transparency. Here you can see exactly how much
              has been raised, how many people have contributed, and updates as
              the campaign progresses.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Progress card */}
            <div className="card">
              <h2 className="font-bold text-ink mb-5">Campaign Progress</h2>
              <ProgressBar stats={campaignStats} size="lg" />
              <p className="text-xs text-stone-400 mt-4">
                Last updated: {formatDate(campaignStats.updated_at)}
              </p>
            </div>

            {/* How funds used */}
            <div className="card">
              <h2 className="font-bold text-ink mb-5">
                How Funds Will Be Used
              </h2>
              <div className="space-y-3">
                {[
                  {
                    item: "Dell Latitude 7400 laptop",
                    amount: "₦350,000",
                    pct: 100,
                  },
                ].map(({ item, amount, pct }) => (
                  <div key={item}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-stone-600">{item}</span>
                      <span className="font-semibold text-ink">{amount}</span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      100% of all funds
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-rule">
                <h3 className="text-sm font-semibold text-ink mb-3">
                  Commitment to donors
                </h3>
                <ul className="space-y-2 text-sm text-stone-500">
                  {[
                    "All funds go directly toward the laptop purchase",
                    "Laptop receipt and unboxing photos will be shared",
                    "Project updates will be posted after purchase",
                    "Donors who provided email will receive an update",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-success shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Campaign updates timeline */}
          <div>
            <h2 className="text-xl font-bold text-ink mb-6">
              Campaign Updates
            </h2>

            {updates.length === 0 ? (
              <div className="card-muted text-center py-10">
                <p className="text-stone-400 text-sm">
                  No updates yet. Check back soon.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div key={update.id} className="card relative">
                    {index === 0 && (
                      <span className="absolute top-4 right-4 tag text-xs">
                        Latest
                      </span>
                    )}
                    <p className="text-xs text-stone-400 mb-2">
                      {formatDate(update.created_at)}
                    </p>
                    <h3 className="font-bold text-ink mb-2">{update.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {update.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Donate CTA */}
          <div className="mt-12 card-muted text-center py-10">
            <h2 className="text-xl font-bold text-ink mb-3">
              Every contribution counts
            </h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
              Whether you give ₦1,000 or ₦50,000, your generosity brings me
              closer to the tools I need to build my career in technology.
            </p>
            <Link href="/#donate" className="btn-primary">
              Donate Now →
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
