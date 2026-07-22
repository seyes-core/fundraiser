"use client";
import { useState } from "react";
import { SupportType } from "@/types";
import { ModalShell } from "@/components/ui/ModalShell";

const CONFIGS: Record<
  SupportType,
  { title: string; sub: string; fields: string[] }
> = {
  internship: {
    title: "Refer an Internship",
    sub: "Share an opportunity — a role, program, or contact that could help Temitope land his first tech role.",
    fields: [
      "Role / Company name",
      "Application link or contact details",
      "Any relevant context or notes",
    ],
  },
  learning_resource: {
    title: "Share a Learning Resource",
    sub: "Courses, books, YouTube channels, roadmaps — share what has helped you succeed in tech.",
    fields: ["Resource name", "Link or description", "Why you recommend it"],
  },
  certification: {
    title: "Recommend a Certification",
    sub: "Share certifications worth pursuing for a career in data or software engineering.",
    fields: [
      "Certification name and provider",
      "Why it's valuable",
      "Estimated cost or free options",
    ],
  },
  mentorship: {
    title: "Offer Mentorship",
    sub: "Experienced professionals willing to offer guidance, technical feedback, or career advice.",
    fields: [
      "Your background and expertise",
      "How you can help Temitope",
      "Preferred contact or communication method",
    ],
  },
  project_idea: {
    title: "Submit a Project Idea",
    sub: "Ideas for data projects, open-source contributions, civic tech solutions, or software applications.",
    fields: [
      "Project title or concept",
      "Description and goals",
      "Relevant technologies, datasets, or resources",
    ],
  },
  networking: {
    title: "Connect Professionally",
    sub: "Let's build a meaningful professional relationship in the tech community.",
    fields: [
      "Your background or current role",
      "How you'd like to connect",
      "What you're open to discussing or collaborating on",
    ],
  },
};

interface CareerModalProps {
  type: SupportType;
  onClose: () => void;
}

export function CareerModal({ type, onClose }: CareerModalProps) {
  const cfg = CONFIGS[type];
  const [fields, setFields] = useState({
    name: "",
    email: "",
    linkedin: "",
    f0: "",
    f1: "",
    f2: "",
  });
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
      ]
        .filter(Boolean)
        .join("\n\n");

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

  return (
    <ModalShell onClose={onClose} ariaLabel={cfg.title} maxWidth="max-w-[460px]">
      {!sent ? (
        <>
          <div className="font-display font-bold text-xl text-ink mb-1.5">
            {cfg.title}
          </div>
          <div className="text-[13px] text-muted leading-[1.7] mb-5">
            {cfg.sub}
          </div>

          <label className="label-tag">Your name *</label>
          <input
            className="input-field mb-3.5"
            placeholder="Name or alias"
            value={fields.name}
            onChange={(e) =>
              setFields((f) => ({ ...f, name: e.target.value }))
            }
          />

          <label className="label-tag">Email (optional)</label>
          <input
            type="email"
            className="input-field mb-3.5"
            placeholder="you@example.com"
            value={fields.email}
            onChange={(e) =>
              setFields((f) => ({ ...f, email: e.target.value }))
            }
          />

          <label className="label-tag">LinkedIn (optional)</label>
          <input
            className="input-field mb-3.5"
            placeholder="linkedin.com/in/yourname"
            value={fields.linkedin}
            onChange={(e) =>
              setFields((f) => ({ ...f, linkedin: e.target.value }))
            }
          />

          {cfg.fields.map((label, i) => (
            <div key={i}>
              <label className="label-tag">
                {label} {i === 0 ? "*" : ""}
              </label>
              <textarea
                className="textarea-field mb-3.5 min-h-[76px] !resize-y"
                value={fields[`f${i}` as "f0" | "f1" | "f2"]}
                onChange={(e) =>
                  setFields((f) => ({ ...f, [`f${i}`]: e.target.value }))
                }
              />
            </div>
          ))}
          {error && (
            <div className="text-[#C0392B] text-[13px] mb-2.5">{error}</div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? "Sending…" : "Send →"}
          </button>
        </>
      ) : (
        <div className="text-center py-5">
          <div className="text-[44px] mb-3.5" aria-hidden>
            ✨
          </div>
          <div className="font-display font-bold text-xl mb-2.5">
            Thank you!
          </div>
          <div className="text-sm text-muted leading-[1.8] mb-6">
            Your submission has been received. Temitope will review it and
            follow up if you left contact details.
          </div>
          <button onClick={onClose} className="btn-secondary px-7">
            Close
          </button>
        </div>
      )}
    </ModalShell>
  );
}
