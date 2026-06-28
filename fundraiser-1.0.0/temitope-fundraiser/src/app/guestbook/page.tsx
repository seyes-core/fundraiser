"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DonateModal } from "@/components/modals/DonateModal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GuestbookForm } from "@/components/sections/GuestbookForm";
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
    <>
      <Nav onDonate={() => setDonateOpen(true)} />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px 80px" }}>
        <SectionLabel>Guestbook</SectionLabel>
        <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 700, color: "#1A1917", margin: "0 0 12px", lineHeight: 1.15 }}>
          Words of support
        </h1>
        <p style={{ fontSize: 15, color: "#6B6860", lineHeight: 1.85, margin: "0 0 36px" }}>
          Leave advice, encouragement, an internship tip, a resource recommendation, or simply a kind word. Every message is reviewed before appearing here.
        </p>

        <GuestbookForm />

        <div style={{ marginTop: 44 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9C9A95", fontSize: 14 }}>Loading messages…</div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1917", marginBottom: 6 }}>No messages yet</div>
              <div style={{ fontSize: 13, color: "#9C9A95" }}>Be the first to leave a word of encouragement.</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#9C9A95", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
                {entries.length} message{entries.length !== 1 ? "s" : ""}
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {entries.map((e) => (
                  <div key={e.id} style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 14, padding: "22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1917" }}>{e.name}</span>
                        {e.social_handle && <span style={{ marginLeft: 8, fontSize: 12, color: "#9C9A95" }}>{e.social_handle}</span>}
                      </div>
                      <span style={{ fontSize: 11, color: "#9C9A95" }}>{formatDate(e.created_at)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#6B6860", lineHeight: 1.8, margin: 0 }}>{e.message}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <p style={{ fontSize: 14, color: "#6B6860", marginBottom: 16 }}>Want to do more than leave a message?</p>
          <button onClick={() => setDonateOpen(true)}
            style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#1B3A5C", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginRight: 10 }}>
            Donate to the Campaign
          </button>
          <Link href="/"
            style={{ padding: "12px 20px", borderRadius: 10, border: "1.5px solid #E8E6E1", background: "#F3F2EF", color: "#1A1917", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Back to campaign
          </Link>
        </div>
      </main>
      <Footer />
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </>
  );
}
