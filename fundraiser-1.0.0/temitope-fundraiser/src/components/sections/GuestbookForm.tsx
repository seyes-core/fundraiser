"use client";
import { useState } from "react";

export function GuestbookForm() {
  const [form, setForm] = useState({
    name: "",
    social_handle: "",
    message: "",
    website: "", // honeypot — must stay empty; see /api/guestbook
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      setError("Name and message are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #E8E6E1",
    borderRadius: 10,
    fontSize: 14,
    color: "#1A1917",
    background: "#FAFAF8",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
  };

  if (sent) {
    return (
      <div
        style={{
          background: "#EAF5EE",
          border: "1px solid #B7DFC9",
          borderRadius: 12,
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
        <div style={{ fontWeight: 700, color: "#2D6A4F", marginBottom: 4 }}>
          Message received!
        </div>
        <div style={{ fontSize: 13, color: "#3A7A5A" }}>
          Your message will appear here after review. Thank you for the
          encouragement.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E6E1",
        borderRadius: 16,
        padding: "26px 22px",
      }}
    >
      <h3
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 17,
          fontWeight: 700,
          color: "#1A1917",
          margin: "0 0 6px",
        }}
      >
        Leave a message
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6B6860",
          margin: "0 0 20px",
          lineHeight: 1.7,
        }}
      >
        Share advice, encouragement, an internship tip, or a learning resource.
        Messages are reviewed before appearing here.
      </p>
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6860",
            display: "block",
            marginBottom: 5,
          }}
        >
          Your name or alias *
        </label>
        <input
          style={inputStyle}
          placeholder="e.g. A Senior Dev"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6860",
            display: "block",
            marginBottom: 5,
          }}
        >
          Twitter/X, GitHub, or LinkedIn handle (optional)
        </label>
        <input
          style={inputStyle}
          placeholder="@yourhandle"
          value={form.social_handle}
          onChange={(e) =>
            setForm((f) => ({ ...f, social_handle: e.target.value }))
          }
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6860",
            display: "block",
            marginBottom: 5,
          }}
        >
          Your message *
        </label>
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          placeholder="Write something encouraging, share a resource, or drop a career tip…"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
        <div
          style={{
            textAlign: "right",
            fontSize: 11,
            color: "#9C9A95",
            marginTop: 4,
          }}
        >
          {form.message.length}/1000
        </div>
      </div>
      {/* Honeypot — hidden from sighted/keyboard users, bots that fill every
          field will trip it. `tabIndex=-1` + off-screen positioning keeps it
          out of the tab order and away from screen readers' focus flow. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) =>
            setForm((f) => ({ ...f, website: e.target.value }))
          }
        />
      </div>
      {error && (
        <div style={{ color: "#C0392B", fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.name.trim() || !form.message.trim()}
        style={{
          padding: "12px 28px",
          borderRadius: 10,
          border: "none",
          background: "#1B3A5C",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          opacity:
            loading || !form.name.trim() || !form.message.trim() ? 0.55 : 1,
        }}
      >
        {loading ? "Sending…" : "Submit message"}
      </button>
    </div>
  );
}
