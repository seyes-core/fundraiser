"use client";
import { useState } from "react";
import { SupportType } from "@/types";

const CONFIGS: Record<SupportType, { title: string; sub: string; fields: string[] }> = {
  internship: {
    title: "Refer an Internship",
    sub: "Share an opportunity — a role, program, or contact that could help Temitope land his first tech role.",
    fields: ["Role / Company name", "Application link or contact details", "Any relevant context or notes"],
  },
  learning_resource: {
    title: "Share a Learning Resource",
    sub: "Courses, books, YouTube channels, roadmaps — share what has helped you succeed in tech.",
    fields: ["Resource name", "Link or description", "Why you recommend it"],
  },
  certification: {
    title: "Recommend a Certification",
    sub: "Share certifications worth pursuing for a career in data or software engineering.",
    fields: ["Certification name and provider", "Why it's valuable", "Estimated cost or free options"],
  },
  mentorship: {
    title: "Offer Mentorship",
    sub: "Experienced professionals willing to offer guidance, technical feedback, or career advice.",
    fields: ["Your background and expertise", "How you can help Temitope", "Preferred contact or communication method"],
  },
  project_idea: {
    title: "Submit a Project Idea",
    sub: "Ideas for data projects, open-source contributions, civic tech solutions, or software applications.",
    fields: ["Project title or concept", "Description and goals", "Relevant technologies, datasets, or resources"],
  },
  networking: {
    title: "Connect Professionally",
    sub: "Let's build a meaningful professional relationship in the tech community.",
    fields: ["Your background or current role", "How you'd like to connect", "What you're open to discussing or collaborating on"],
  },
};

interface CareerModalProps {
  type: SupportType;
  onClose: () => void;
}

export function CareerModal({ type, onClose }: CareerModalProps) {
  const cfg = CONFIGS[type];
  const [fields, setFields] = useState({ name: "", email: "", linkedin: "", f0: "", f1: "", f2: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!fields.name.trim() || !fields.f0.trim()) {
      setError("Please fill in your name and the first field.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const message = [
        cfg.fields[0] + ": " + fields.f0,
        fields.f1 ? cfg.fields[1] + ": " + fields.f1 : "",
        fields.f2 ? cfg.fields[2] + ": " + fields.f2 : "",
      ].filter(Boolean).join("\n\n");

      const res = await fetch("/api/career-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_type: type,
          name: fields.name,
          email: fields.email || undefined,
          linkedin_url: fields.linkedin || undefined,
          message,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(10,10,10,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
  const modal: React.CSSProperties = { background: "#FFFFFF", borderRadius: 20, padding: "36px 28px", maxWidth: 460, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", position: "relative" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1.5px solid #E8E6E1", borderRadius: 10, fontSize: 14, color: "#1A1917", background: "#FAFAF8", outline: "none", boxSizing: "border-box", marginBottom: 14, fontFamily: "Inter, sans-serif" };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal} role="dialog" aria-modal="true">
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#F3F2EF", border: "none", borderRadius: 99, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#6B6860" }} aria-label="Close">✕</button>

        {!sent ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", color: "#1A1917", marginBottom: 6 }}>{cfg.title}</div>
            <div style={{ fontSize: 13, color: "#6B6860", marginBottom: 22, lineHeight: 1.7 }}>{cfg.sub}</div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#6B6860", display: "block", marginBottom: 5 }}>Your name *</label>
            <input style={inputStyle} placeholder="Name or alias" value={fields.name} onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))} />
            <label style={{ fontSize: 12, fontWeight: 700, color: "#6B6860", display: "block", marginBottom: 5 }}>Email (optional)</label>
            <input type="email" style={inputStyle} placeholder="you@example.com" value={fields.email} onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))} />
            <label style={{ fontSize: 12, fontWeight: 700, color: "#6B6860", display: "block", marginBottom: 5 }}>LinkedIn (optional)</label>
            <input style={inputStyle} placeholder="linkedin.com/in/yourname" value={fields.linkedin} onChange={(e) => setFields((f) => ({ ...f, linkedin: e.target.value }))} />
            {cfg.fields.map((label, i) => (
              <div key={i}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6B6860", display: "block", marginBottom: 5 }}>{label} {i === 0 ? "*" : ""}</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 76 }}
                  value={fields[`f${i}` as "f0" | "f1" | "f2"]}
                  onChange={(e) => setFields((f) => ({ ...f, [`f${i}`]: e.target.value }))} />
              </div>
            ))}
            {error && <div style={{ color: "#C0392B", fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", background: "#1B3A5C", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: loading ? 0.65 : 1 }}>
              {loading ? "Sending…" : "Send →"}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>✨</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Lora', Georgia, serif", marginBottom: 10 }}>Thank you!</div>
            <div style={{ fontSize: 14, color: "#6B6860", lineHeight: 1.8, marginBottom: 24 }}>Your submission has been received. Temitope will review it and follow up if you left contact details.</div>
            <button onClick={onClose} style={{ padding: "11px 28px", borderRadius: 10, border: "1px solid #E8E6E1", background: "#F3F2EF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
