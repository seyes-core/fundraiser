"use client";
import { useState } from "react";
import { PRESET_AMOUNTS } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

type Step = "amount" | "info" | "confirm" | "success";

interface DonateModalProps {
  onClose: () => void;
}

export function DonateModal({ onClose }: DonateModalProps) {
  const [step, setStep] = useState<Step>("amount");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({
    email: "",
    twitter: "",
    linkedin: "",
    discord: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount =
    selectedAmount === -1 ? parseInt(customAmount) : selectedAmount;

  const handleInitiatePayment = async () => {
    if (!finalAmount || finalAmount < 100) {
      setError("Minimum donation is ₦100.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      // Redirect to Flutterwave hosted page
      window.location.href = data.payment_link;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
      setLoading(false);
    }
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(10,10,10,0.55)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };
  const modal: React.CSSProperties = {
    background: "#FFFFFF",
    borderRadius: 20,
    padding: "36px 28px",
    maxWidth: 480,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
    position: "relative",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    padding: "14px 0",
    borderRadius: 10,
    border: "none",
    background: "#1B3A5C",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 16,
    fontFamily: "Inter, sans-serif",
  };
  const btnSecondary: React.CSSProperties = {
    width: "100%",
    padding: "12px 0",
    borderRadius: 10,
    border: "1px solid #E8E6E1",
    background: "#F3F2EF",
    color: "#1A1917",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 8,
    fontFamily: "Inter, sans-serif",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #E8E6E1",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    color: "#1A1917",
    background: "#FAFAF8",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 14,
  };

  return (
    <div
      style={overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={modal}
        role="dialog"
        aria-modal="true"
        aria-label="Donation form"
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#F3F2EF",
            border: "none",
            borderRadius: 99,
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            color: "#6B6860",
          }}
          aria-label="Close donation form"
        >
          ✕
        </button>

        {step === "amount" && (
          <>
            <div
              style={{
                fontSize: 21,
                fontWeight: 700,
                fontFamily: "'Lora', Georgia, serif",
                color: "#1A1917",
                marginBottom: 6,
              }}
            >
              Make a donation
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6B6860",
                marginBottom: 24,
                lineHeight: 1.7,
              }}
            >
              Every contribution goes directly toward purchasing the Dell
              Latitude 7400. Processed securely via Flutterwave.
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9C9A95",
                marginBottom: 10,
              }}
            >
              Select an amount
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setSelectedAmount(a);
                    setCustomAmount("");
                  }}
                  style={{
                    padding: "13px 0",
                    borderRadius: 10,
                    border: `2px solid ${selectedAmount === a ? "#1B3A5C" : "#E8E6E1"}`,
                    background: selectedAmount === a ? "#EEF3F8" : "#FFFFFF",
                    color: selectedAmount === a ? "#1B3A5C" : "#1A1917",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {formatNaira(a)}
                </button>
              ))}
            </div>

            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#6B6860",
                display: "block",
                marginBottom: 6,
              }}
            >
              Or enter a custom amount (₦)
            </label>
            <input
              type="number"
              placeholder="e.g. 3500"
              value={selectedAmount === -1 ? customAmount : ""}
              style={inputStyle}
              min={100}
              onChange={(e) => {
                setSelectedAmount(-1);
                setCustomAmount(e.target.value);
              }}
            />
            {error && (
              <div style={{ color: "#C0392B", fontSize: 13, marginBottom: 10 }}>
                {error}
              </div>
            )}
            <button
              style={btnPrimary}
              onClick={() => {
                if (!finalAmount || finalAmount < 100) {
                  setError("Minimum donation is ₦100.");
                  return;
                }
                setError("");
                setStep("info");
              }}
            >
              Continue →
            </button>
            <button style={btnSecondary} onClick={onClose}>
              Cancel
            </button>
          </>
        )}

        {step === "info" && (
          <>
            <div
              style={{
                fontSize: 21,
                fontWeight: 700,
                fontFamily: "'Lora', Georgia, serif",
                color: "#1A1917",
                marginBottom: 6,
              }}
            >
              Your information
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6B6860",
                marginBottom: 24,
                lineHeight: 1.7,
              }}
            >
              All fields are optional. Your details are private and will never
              appear publicly.
            </div>
            {[
              {
                key: "email",
                label: "Email (for receipt)",
                placeholder: "you@example.com",
                type: "email",
              },
              {
                key: "twitter",
                label: "Twitter/X handle",
                placeholder: "@yourhandle",
                type: "text",
              },
              {
                key: "linkedin",
                label: "LinkedIn URL",
                placeholder: "https://www.linkedin.com/in/yourname",
                type: "url",
              },
              {
                key: "discord",
                label: "Discord username",
                placeholder: "yourname#0000",
                type: "text",
              },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#6B6860",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  style={inputStyle}
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div
              style={{
                fontSize: 12,
                color: "#9C9A95",
                lineHeight: 1.7,
                marginBottom: 4,
              }}
            >
              🔒 Encrypted and visible only to Temitope. Donor names are never
              displayed publicly.
            </div>
            <button style={btnPrimary} onClick={() => setStep("confirm")}>
              Review donation
            </button>
            <button style={btnSecondary} onClick={() => setStep("amount")}>
              ← Back
            </button>
          </>
        )}

        {step === "confirm" && (
          <>
            <div
              style={{
                fontSize: 21,
                fontWeight: 700,
                fontFamily: "'Lora', Georgia, serif",
                color: "#1A1917",
                marginBottom: 20,
              }}
            >
              Confirm your donation
            </div>
            <div
              style={{
                background: "#EEF3F8",
                border: "1px solid #C8D8E8",
                borderRadius: 12,
                padding: "20px 22px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#1B3A5C",
                  fontFamily: "'Lora', Georgia, serif",
                }}
              >
                {formatNaira(finalAmount!)}
              </div>
              <div style={{ fontSize: 13, color: "#6B6860", marginTop: 4 }}>
                One-time donation · Secured by Flutterwave
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#6B6860",
                lineHeight: 1.75,
                marginBottom: 20,
              }}
            >
              You will be redirected to Flutterwave's secure payment page to
              complete your transaction.
            </div>
            {error && (
              <div style={{ color: "#C0392B", fontSize: 13, marginBottom: 10 }}>
                {error}
              </div>
            )}
            <button
              style={{ ...btnPrimary, opacity: loading ? 0.65 : 1 }}
              onClick={handleInitiatePayment}
              disabled={loading}
            >
              {loading
                ? "Redirecting to payment…"
                : `Donate ${formatNaira(finalAmount!)} →`}
            </button>
            <button style={btnSecondary} onClick={() => setStep("info")}>
              ← Back
            </button>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🙏</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'Lora', Georgia, serif",
                marginBottom: 12,
              }}
            >
              Thank you sincerely.
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6B6860",
                lineHeight: 1.85,
                marginBottom: 28,
              }}
            >
              Your donation of <strong>{formatNaira(finalAmount!)}</strong> has
              been received. A receipt has been sent if you provided your email.
              <br />
              <br />
              Your generosity brings Temitope one step closer to building
              technology that matters.
            </div>
            <button
              style={{ ...btnSecondary, width: "auto", padding: "11px 28px" }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
