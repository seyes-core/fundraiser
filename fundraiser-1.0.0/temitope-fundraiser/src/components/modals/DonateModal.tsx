"use client";
import { useState } from "react";
import { PRESET_AMOUNTS } from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import { ModalShell } from "@/components/ui/ModalShell";
import { cn } from "@/lib/utils";

type Step = "amount" | "info" | "confirm" | "success";

interface DonateModalProps {
  onClose: () => void;
}

const INFO_FIELDS = [
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
] as const;

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

  return (
    <ModalShell onClose={onClose} ariaLabel="Donation form">
      {step === "amount" && (
        <>
          <div className="font-display font-bold text-[21px] text-ink mb-1.5">
            Make a donation
          </div>
          <div className="text-sm text-muted leading-[1.7] mb-6">
            Every contribution goes directly toward purchasing the Dell
            Latitude 7400. Processed securely via Flutterwave.
          </div>

          <div className="text-xs font-bold uppercase tracking-[0.08em] text-faint mb-2.5">
            Select an amount
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3.5">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setSelectedAmount(a);
                  setCustomAmount("");
                }}
                className={cn(
                  "min-h-tap py-3 rounded-[10px] border-2 font-bold text-sm cursor-pointer transition-colors",
                  selectedAmount === a
                    ? "border-navy bg-navy-light text-navy"
                    : "border-line bg-surface text-ink",
                )}
              >
                {formatNaira(a)}
              </button>
            ))}
          </div>

          <label className="label-tag">Or enter a custom amount (₦)</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 3500"
            value={selectedAmount === -1 ? customAmount : ""}
            className="input-field mb-3.5"
            min={100}
            onChange={(e) => {
              setSelectedAmount(-1);
              setCustomAmount(e.target.value);
            }}
          />
          {error && (
            <div className="text-[#C0392B] text-[13px] mb-2.5">{error}</div>
          )}
          <button
            className="btn-primary w-full mt-4"
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
          <button className="btn-secondary w-full mt-2" onClick={onClose}>
            Cancel
          </button>
        </>
      )}

      {step === "info" && (
        <>
          <div className="font-display font-bold text-[21px] text-ink mb-1.5">
            Your information
          </div>
          <div className="text-sm text-muted leading-[1.7] mb-6">
            All fields are optional. Your details are private and will never
            appear publicly.
          </div>
          {INFO_FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="label-tag">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className="input-field mb-3.5"
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
            </div>
          ))}
          <div className="text-xs text-faint leading-[1.7] mb-1">
            🔒 Encrypted and visible only to Temitope. Donor names are never
            displayed publicly.
          </div>
          <button
            className="btn-primary w-full mt-4"
            onClick={() => setStep("confirm")}
          >
            Review donation
          </button>
          <button
            className="btn-secondary w-full mt-2"
            onClick={() => setStep("amount")}
          >
            ← Back
          </button>
        </>
      )}

      {step === "confirm" && (
        <>
          <div className="font-display font-bold text-[21px] text-ink mb-5">
            Confirm your donation
          </div>
          <div className="bg-navy-light border border-navy-border rounded-xl px-5 py-5 mb-5">
            <div className="font-display font-bold text-[32px] text-navy">
              {formatNaira(finalAmount!)}
            </div>
            <div className="text-[13px] text-muted mt-1">
              One-time donation · Secured by Flutterwave
            </div>
          </div>
          <div className="text-[13px] text-muted leading-[1.75] mb-5">
            You will be redirected to Flutterwave&apos;s secure payment page to
            complete your transaction.
          </div>
          {error && (
            <div className="text-[#C0392B] text-[13px] mb-2.5">{error}</div>
          )}
          <button
            className="btn-primary w-full mt-4"
            onClick={handleInitiatePayment}
            disabled={loading}
          >
            {loading
              ? "Redirecting to payment…"
              : `Donate ${formatNaira(finalAmount!)} →`}
          </button>
          <button
            className="btn-secondary w-full mt-2"
            onClick={() => setStep("info")}
          >
            ← Back
          </button>
        </>
      )}

      {step === "success" && (
        <div className="text-center py-5">
          <div className="text-[52px] mb-4" aria-hidden>
            🙏
          </div>
          <div className="font-display font-bold text-[22px] mb-3">
            Thank you sincerely.
          </div>
          <div className="text-sm text-muted leading-[1.85] mb-7">
            Your donation of <strong>{formatNaira(finalAmount!)}</strong> has
            been received. A receipt has been sent if you provided your email.
            <br />
            <br />
            Your generosity brings Temitope one step closer to building
            technology that matters.
          </div>
          <button className="btn-secondary px-7" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </ModalShell>
  );
}
