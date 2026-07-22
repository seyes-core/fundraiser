"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DonateModal } from "@/components/modals/DonateModal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GuestbookForm } from "@/components/sections/GuestbookForm";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { formatDate } from "@/lib/format";
import type { GuestbookEntry } from "@/types";
import Link from "next/link";

export default function GuestbookPage() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-14 sm:pb-0">
      <Nav onDonate={() => setDonateOpen(true)} />
      <main className="max-w-[800px] mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
        <SectionLabel>Guestbook</SectionLabel>
        <h1 className="heading-1 m-0 mb-3">Words of support</h1>
        <p
          style={{
            fontSize: 15,
            color: "#6B6860",
            lineHeight: 1.85,
            margin: "0 0 36px",
          }}
        >
          Leave advice, encouragement, an internship tip, a resource
          recommendation, or simply a kind word. Every message is reviewed
          before appearing here.
        </p>

        <GuestbookForm />

        <div style={{ marginTop: 44 }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#9C9A95",
                fontSize: 14,
              }}
            >
              Loading messages…
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1A1917",
                  marginBottom: 6,
                }}
              >
                No messages yet
              </div>
              <div style={{ fontSize: 13, color: "#9C9A95" }}>
                Be the first to leave a word of encouragement.
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#9C9A95",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {entries.length} message{entries.length !== 1 ? "s" : ""}
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {entries.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E6E1",
                      borderRadius: 14,
                      padding: "22px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 10,
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#1A1917",
                          }}
                        >
                          {e.name}
                        </span>
                        {e.social_handle && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 12,
                              color: "#9C9A95",
                            }}
                          >
                            {e.social_handle}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: "#9C9A95" }}>
                        {formatDate(e.created_at)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#6B6860",
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      {e.message}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted mb-4">
            Want to do more than leave a message?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setDonateOpen(true)}
              className="btn-primary w-full sm:w-auto"
            >
              Donate to the Campaign
            </button>
            <Link href="/" className="btn-secondary w-full sm:w-auto">
              Back to campaign
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <StickyCTA onClick={() => setDonateOpen(true)} />
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </div>
  );
}
