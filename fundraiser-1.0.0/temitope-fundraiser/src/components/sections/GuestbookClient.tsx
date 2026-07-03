"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function GuestbookClient() {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Name and message are required.");
      return;
    }
    if (message.trim().length < 5) {
      setError("Message must be at least 5 characters.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          social_handle: handle.trim() || undefined,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      } else {
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card text-center py-8">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="font-bold text-ink mb-2">Thank you!</h3>
        <p className="text-stone-500 text-sm leading-relaxed">
          Your message has been submitted and will appear after a quick review.
        </p>
        <button
          className="btn-secondary mt-4 text-sm"
          onClick={() => {
            setDone(false);
            setName("");
            setHandle("");
            setMessage("");
          }}
        >
          Leave another message
        </button>
      </div>
    );
  }

  return (
    <div className="card sticky top-20">
      <h2 className="font-bold text-ink mb-1">Sign the guestbook</h2>
      <p className="text-stone-500 text-xs mb-5">
        All messages are reviewed before appearing publicly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="name"
            className="text-xs font-semibold text-stone-600 mb-1.5 block"
          >
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            className="input-field"
            placeholder="Name or alias"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label
            htmlFor="handle"
            className="text-xs font-semibold text-stone-600 mb-1.5 block"
          >
            Social handle{" "}
            <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            id="handle"
            type="text"
            className="input-field"
            placeholder="@yourhandle or Discord"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-xs font-semibold text-stone-600 mb-1.5 block"
          >
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            className="textarea-field min-h-[120px]"
            placeholder="Encouragement, advice, internship leads, resources — anything helpful."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            required
          />
          <p className="text-xs text-stone-400 mt-1 text-right">
            {message.length}/1000
          </p>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Sign Guestbook"}
        </button>
      </form>
    </div>
  );
}
