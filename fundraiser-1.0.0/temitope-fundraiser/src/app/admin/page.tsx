"use client";
import { useState, useEffect, useCallback } from "react";
import { formatNaira, formatDate } from "@/lib/format";
import type { CampaignStats, GuestbookEntry, CampaignUpdate, CareerSupportSubmission } from "@/types";

type Tab = "overview" | "guestbook" | "updates" | "submissions" | "donations";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  // Data state
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [submissions, setSubmissions] = useState<CareerSupportSubmission[]>([]);
  const [donations, setDonations] = useState<Record<string, unknown>[]>([]);

  // Update form state
  const [newUpdate, setNewUpdate] = useState({ title: "", content: "" });
  const [statsEdit, setStatsEdit] = useState({ amount_raised: 0, donor_count: 0 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const load = useCallback(async () => {
    try {
      const [s, g, u, sub, d] = await Promise.all([
        fetch("/api/admin/stats").then(r => r.json()),
        fetch("/api/admin/guestbook").then(r => r.json()),
        fetch("/api/admin/updates").then(r => r.json()),
        fetch("/api/admin/submissions").then(r => r.json()),
        fetch("/api/admin/donations").then(r => r.json()),
      ]);
      setStats(s);
      setStatsEdit({ amount_raised: s.amount_raised, donor_count: s.donor_count });
      setGuestbook(g.entries ?? []);
      setUpdates(u.updates ?? []);
      setSubmissions(sub.submissions ?? []);
      setDonations(d.donations ?? []);
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setAuthed(true); }
      else { const d = await res.json(); setLoginError(d.error ?? "Incorrect password"); }
    } catch { setLoginError("Connection error. Please try again."); }
    finally { setLoginLoading(false); }
  };

  const approveEntry = async (id: string, approved: boolean) => {
    await fetch("/api/admin/guestbook", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, approved }) });
    setGuestbook(g => g.map(e => e.id === id ? { ...e, approved } : e));
    flash(approved ? "Message approved." : "Message hidden.");
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    await fetch("/api/admin/guestbook", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setGuestbook(g => g.filter(e => e.id !== id));
    flash("Message deleted.");
  };

  const postUpdate = async () => {
    if (!newUpdate.title || !newUpdate.content) return;
    setSaving(true);
    const res = await fetch("/api/admin/updates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUpdate) });
    if (res.ok) {
      const u = await res.json();
      setUpdates(prev => [u, ...prev]);
      setNewUpdate({ title: "", content: "" });
      flash("Update posted.");
    }
    setSaving(false);
  };

  const saveStats = async () => {
    if (!stats) return;
    setSaving(true);
    await fetch("/api/admin/stats", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: stats.id, ...statsEdit }) });
    setStats(s => s ? { ...s, ...statsEdit } : s);
    flash("Campaign stats saved.");
    setSaving(false);
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    await fetch("/api/admin/submissions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setSubmissions(s => s.map(sub => sub.id === id ? { ...sub, status: status as CareerSupportSubmission["status"] } : sub));
    flash("Status updated.");
  };

  const exportCSV = () => window.open("/api/admin/export", "_blank");

  // ── Styles ──
  const S = {
    page: { minHeight: "100vh", background: "#FAFAF8", fontFamily: "Inter, sans-serif" } as React.CSSProperties,
    header: { background: "#1B3A5C", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" } as React.CSSProperties,
    content: { maxWidth: 1100, margin: "0 auto", padding: "28px 20px" } as React.CSSProperties,
    card: { background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 14, padding: "22px 20px", marginBottom: 16 } as React.CSSProperties,
    input: { width: "100%", padding: "10px 13px", border: "1.5px solid #E8E6E1", borderRadius: 8, fontSize: 14, background: "#FAFAF8", color: "#1A1917", outline: "none", boxSizing: "border-box" as const, fontFamily: "Inter, sans-serif" },
    textarea: { width: "100%", padding: "10px 13px", border: "1.5px solid #E8E6E1", borderRadius: 8, fontSize: 14, background: "#FAFAF8", color: "#1A1917", outline: "none", boxSizing: "border-box" as const, minHeight: 100, resize: "vertical" as const, fontFamily: "Inter, sans-serif" },
    btn: (c = "#1B3A5C") => ({ padding: "9px 18px", borderRadius: 8, border: "none", background: c, color: c === "#F3F2EF" ? "#1A1917" : "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }) as React.CSSProperties,
    tab: (active: boolean) => ({ padding: "9px 16px", borderRadius: 8, border: "none", background: active ? "#1B3A5C" : "transparent", color: active ? "#fff" : "#6B6860", fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }) as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 700, color: "#6B6860", display: "block", marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" } as React.CSSProperties,
    badge: (c: string) => ({ display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: c === "new" ? "#EEF3F8" : c === "reviewed" ? "#FDF4E4" : "#EAF5EE", color: c === "new" ? "#1B3A5C" : c === "reviewed" ? "#8B5E0A" : "#2D6A4F" }) as React.CSSProperties,
  };

  // ── Login screen ──
  if (!authed) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E8E6E1", borderRadius: 20, padding: "40px 32px", maxWidth: 380, width: "100%" }}>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1917", marginBottom: 6 }}>Admin Dashboard</div>
          <div style={{ fontSize: 13, color: "#6B6860", marginBottom: 28 }}>Enter your admin password to continue.</div>
          <label style={S.label}>Password</label>
          <input type="password" style={{ ...S.input, marginBottom: 14 }} value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {loginError && <div style={{ color: "#C0392B", fontSize: 13, marginBottom: 12 }}>{loginError}</div>}
          <button style={{ ...S.btn(), width: "100%", padding: "12px 0" }} onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? "Verifying…" : "Sign In →"}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Admin Dashboard</div>
          <div style={{ fontSize: 11, color: "#A8C4E0", marginTop: 2 }}>Temitope Fundraising Campaign</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <div style={{ fontSize: 12, color: "#A8E6C8", fontWeight: 600 }}>{msg}</div>}
          <button style={S.btn("#FFFFFF")} onClick={() => window.open("/", "_blank")}>↗ View site</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E6E1", padding: "0 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, padding: "10px 0" }}>
          {(["overview", "guestbook", "updates", "submissions", "donations"] as Tab[]).map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "guestbook" && guestbook.filter(e => !e.approved).length > 0 && (
                <span style={{ marginLeft: 6, background: "#C8861A", color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 6px" }}>
                  {guestbook.filter(e => !e.approved).length}
                </span>
              )}
              {t === "submissions" && submissions.filter(s => s.status === "new").length > 0 && (
                <span style={{ marginLeft: 6, background: "#C8861A", color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 6px" }}>
                  {submissions.filter(s => s.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={S.content}>

        {/* ── Overview ── */}
        {tab === "overview" && stats && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Goal", value: formatNaira(stats.goal_amount) },
                { label: "Raised", value: formatNaira(stats.amount_raised) },
                { label: "Remaining", value: formatNaira(stats.goal_amount - stats.amount_raised) },
                { label: "Donors", value: stats.donor_count.toString() },
              ].map(s => (
                <div key={s.label} style={{ ...S.card, marginBottom: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9C9A95", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", color: "#1A1917" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif", marginBottom: 18 }}>Update Campaign Stats</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Amount Raised (₦)</label>
                  <input type="number" style={S.input} value={statsEdit.amount_raised}
                    onChange={e => setStatsEdit(s => ({ ...s, amount_raised: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label style={S.label}>Donor Count</label>
                  <input type="number" style={S.input} value={statsEdit.donor_count}
                    onChange={e => setStatsEdit(s => ({ ...s, donor_count: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <button style={S.btn()} onClick={saveStats} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <button style={{ ...S.card, marginBottom: 0, textAlign: "center", cursor: "pointer", border: "1.5px dashed #E8E6E1" }}
                onClick={() => setTab("guestbook")}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>💬</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1917" }}>{guestbook.filter(e => !e.approved).length} pending</div>
                <div style={{ fontSize: 12, color: "#9C9A95" }}>guestbook messages</div>
              </button>
              <button style={{ ...S.card, marginBottom: 0, textAlign: "center", cursor: "pointer", border: "1.5px dashed #E8E6E1" }}
                onClick={() => setTab("submissions")}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>📥</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1917" }}>{submissions.filter(s => s.status === "new").length} new</div>
                <div style={{ fontSize: 12, color: "#9C9A95" }}>career submissions</div>
              </button>
            </div>
          </>
        )}

        {/* ── Guestbook ── */}
        {tab === "guestbook" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", color: "#1A1917" }}>Guestbook Messages</div>
              <div style={{ fontSize: 12, color: "#9C9A95" }}>{guestbook.length} total · {guestbook.filter(e => !e.approved).length} pending</div>
            </div>
            {guestbook.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: "#9C9A95" }}>No messages yet.</div>
            ) : (
              guestbook.map(e => (
                <div key={e.id} style={{ ...S.card, borderLeft: `3px solid ${e.approved ? "#2D6A4F" : "#C8861A"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1917" }}>{e.name}</span>
                      {e.social_handle && <span style={{ marginLeft: 8, fontSize: 12, color: "#9C9A95" }}>{e.social_handle}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#9C9A95" }}>{formatDate(e.created_at)}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: e.approved ? "#EAF5EE" : "#FDF4E4", color: e.approved ? "#2D6A4F" : "#8B5E0A" }}>
                        {e.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.75, margin: "0 0 14px" }}>{e.message}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={S.btn(e.approved ? "#6B6860" : "#2D6A4F")} onClick={() => approveEntry(e.id, !e.approved)}>
                      {e.approved ? "Hide" : "✓ Approve"}
                    </button>
                    <button style={S.btn("#C0392B")} onClick={() => deleteEntry(e.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── Updates ── */}
        {tab === "updates" && (
          <>
            <div style={{ ...S.card, marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", color: "#1A1917", marginBottom: 16 }}>Post a Campaign Update</div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Title</label>
                <input style={S.input} placeholder="e.g. Laptop received!" value={newUpdate.title} onChange={e => setNewUpdate(u => ({ ...u, title: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Content</label>
                <textarea style={S.textarea} placeholder="Share what happened…" value={newUpdate.content} onChange={e => setNewUpdate(u => ({ ...u, content: e.target.value }))} />
              </div>
              <button style={S.btn()} onClick={postUpdate} disabled={saving || !newUpdate.title || !newUpdate.content}>
                {saving ? "Posting…" : "Post Update"}
              </button>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1917", marginBottom: 14 }}>Posted Updates</div>
            {updates.length === 0 ? (
              <div style={{ ...S.card, color: "#9C9A95", textAlign: "center" }}>No updates posted yet.</div>
            ) : (
              updates.map(u => (
                <div key={u.id} style={S.card}>
                  <div style={{ fontSize: 11, color: "#9C9A95", marginBottom: 4 }}>{formatDate(u.created_at)}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1917", marginBottom: 6 }}>{u.title}</div>
                  <div style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.75 }}>{u.content}</div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── Career Submissions ── */}
        {tab === "submissions" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", color: "#1A1917" }}>Career Support Submissions</div>
              <div style={{ fontSize: 12, color: "#9C9A95" }}>{submissions.length} total</div>
            </div>
            {submissions.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: "#9C9A95" }}>No submissions yet.</div>
            ) : (
              submissions.map(s => (
                <div key={s.id} style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1917" }}>{s.name}</span>
                      <span style={{ marginLeft: 10, padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#EEF3F8", color: "#1B3A5C" }}>{s.submission_type.replace("_", " ")}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={S.badge(s.status)}>{s.status}</span>
                      <span style={{ fontSize: 11, color: "#9C9A95" }}>{formatDate(s.created_at)}</span>
                    </div>
                  </div>
                  {s.email && <div style={{ fontSize: 12, color: "#6B6860", marginBottom: 4 }}>📧 {s.email}</div>}
                  {s.linkedin_url && <div style={{ fontSize: 12, color: "#6B6860", marginBottom: 4 }}>🔗 {s.linkedin_url}</div>}
                  <p style={{ fontSize: 13, color: "#6B6860", lineHeight: 1.75, margin: "10px 0 14px", whiteSpace: "pre-wrap" }}>{s.message}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {s.status !== "reviewed" && <button style={S.btn("#C8861A")} onClick={() => updateSubmissionStatus(s.id, "reviewed")}>Mark Reviewed</button>}
                    {s.status !== "actioned" && <button style={S.btn("#2D6A4F")} onClick={() => updateSubmissionStatus(s.id, "actioned")}>Mark Actioned</button>}
                    {s.email && <a href={`mailto:${s.email}`} style={{ ...S.btn("#6B6860"), textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Reply by Email</a>}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── Donations ── */}
        {tab === "donations" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", color: "#1A1917" }}>Donation History</div>
              <button style={S.btn("#2D6A4F")} onClick={exportCSV}>⬇ Export CSV</button>
            </div>
            {donations.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: "#9C9A95" }}>No donations recorded yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F3F2EF" }}>
                      {["Date", "Amount", "Status", "Email", "TX Ref"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#6B6860", letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: "1px solid #E8E6E1" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d: Record<string, unknown>) => (
                      <tr key={d.id as string} style={{ borderBottom: "1px solid #F3F2EF" }}>
                        <td style={{ padding: "10px 14px", color: "#6B6860" }}>{formatDate(d.created_at as string)}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1A1917" }}>{formatNaira(d.amount as number)}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: d.status === "successful" ? "#EAF5EE" : "#FDF4E4", color: d.status === "successful" ? "#2D6A4F" : "#8B5E0A" }}>{d.status as string}</span>
                        </td>
                        <td style={{ padding: "10px 14px", color: "#6B6860" }}>{(d.donor_email as string) ?? "—"}</td>
                        <td style={{ padding: "10px 14px", color: "#9C9A95", fontFamily: "monospace", fontSize: 11 }}>{d.transaction_reference as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
