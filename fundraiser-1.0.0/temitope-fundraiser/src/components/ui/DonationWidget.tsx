"use client";

import { useState } from "react";
import { Heart, Lock, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { DONATION_TIERS } from "@/types";
import { formatNaira } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Step = "select" | "details" | "processing" | "success" | "error";

interface DonorDetails {
  email: string;
  twitter: string;
  linkedin: string;
  discord: string;
  anonymous: boolean;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: Record<string, unknown>) => void;
  }
}

export default function DonationWidget() {
  const [step, setStep] = useState<Step>("select");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [details, setDetails] = useState<DonorDetails>({
    email: "",
    twitter: "",
    linkedin: "",
    discord: "",
    anonymous: true,
  });
  const [error, setError] = useState("");

  const selectedAmount = useCustom
    ? parseInt(customAmount.replace(/[^0-9]/g, "")) || 0
    : amount;

  async function handleProceed() {
    if (!selectedAmount || selectedAmount < 100) {
      setError("Please enter a valid amount (minimum ₦100)");
      return;
    }
    setError("");
    setStep("details");
  }

  async function handleDonate() {
    if (!selectedAmount) return;
    setStep("processing");

    try {
      // Initialize donation
      const initRes = await fetch("/api/donations/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          email: details.email || undefined,
          twitter_profile: details.twitter || undefined,
          linkedin_profile: details.linkedin || undefined,
          discord_username: details.discord || undefined,
          anonymous: details.anonymous,
        }),
      });

      const initData = await initRes.json();
      if (!initData.success) throw new Error(initData.error);

      const { tx_ref, public_key, customer_email } = initData.data;

      // Load Flutterwave script
      await loadFlutterwaveScript();

      window.FlutterwaveCheckout({
        public_key,
        tx_ref,
        amount: selectedAmount,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: {
          email: customer_email,
          name: "Supporter",
        },
        customizations: {
          title: "Temitope Laptop Fund",
          description: "Contributing to Temitope's Dell Latitude 7400 campaign",
          logo: "/logo.png",
        },
        callback: async (response: {
          status: string;
          transaction_id: string;
          tx_ref: string;
        }) => {
          if (response.status === "successful") {
            const verRes = await fetch("/api/donations/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transaction_id: response.transaction_id,
                tx_ref: response.tx_ref,
                status: response.status,
              }),
            });
            const verData = await verRes.json();
            setStep(verData.success ? "success" : "error");
          } else {
            setStep("error");
          }
        },
        onclose: () => {
          if (step === "processing") setStep("select");
        },
      });
    } catch {
      setStep("error");
    }
  }

  function loadFlutterwaveScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.FlutterwaveCheckout) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load payment provider"));
      document.head.appendChild(script);
    });
  }

  if (step === "success") {
    return (
      <div className="card text-center py-10">
        <CheckCircle className="w-14 h-14 text-success mx-auto mb-4" />
        <h3 className="text-xl font-bold text-ink mb-2">Thank you so much!</h3>
        <p className="text-stone-500 max-w-sm mx-auto text-sm leading-relaxed">
          Your donation of{" "}
          <strong className="text-ink">
            {formatNaira(selectedAmount || 0)}
          </strong>{" "}
          has been received. You are helping me build my future in technology.
          💙
        </p>
        {details.email && (
          <p className="text-xs text-stone-400 mt-3">
            A receipt has been sent to {details.email}
          </p>
        )}
        <button
          className="btn-secondary mt-6"
          onClick={() => {
            setStep("select");
            setAmount(null);
            setCustomAmount("");
            setDetails({
              email: "",
              twitter: "",
              linkedin: "",
              discord: "",
              anonymous: true,
            });
          }}
        >
          Make another donation
        </button>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="card text-center py-10">
        <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-ink mb-2">
          Something went wrong
        </h3>
        <p className="text-stone-500 text-sm mb-6">
          Your payment could not be completed. You have not been charged.
        </p>
        <button className="btn-primary" onClick={() => setStep("select")}>
          Try again
        </button>
      </div>
    );
  }

  if (step === "details") {
    return (
      <div className="card">
        <button
          className="text-sm text-stone-500 hover:text-ink mb-4 flex items-center gap-1"
          onClick={() => setStep("select")}
        >
          ← Back
        </button>
        <h3 className="font-bold text-ink mb-1">
          Donating {formatNaira(selectedAmount || 0)}
        </h3>
        <p className="text-sm text-stone-500 mb-5">
          These details are optional and will remain private.
        </p>

        <div className="space-y-3">
          <input
            type="email"
            className="input-field"
            placeholder="Email address (for receipt)"
            value={details.email}
            onChange={(e) =>
              setDetails((d) => ({ ...d, email: e.target.value }))
            }
          />
          <input
            type="text"
            className="input-field"
            placeholder="Twitter/X handle (optional)"
            value={details.twitter}
            onChange={(e) =>
              setDetails((d) => ({ ...d, twitter: e.target.value }))
            }
          />
          <input
            type="text"
            className="input-field"
            placeholder="LinkedIn URL (optional)"
            value={details.linkedin}
            onChange={(e) =>
              setDetails((d) => ({ ...d, linkedin: e.target.value }))
            }
          />
          <input
            type="text"
            className="input-field"
            placeholder="Discord username (optional)"
            value={details.discord}
            onChange={(e) =>
              setDetails((d) => ({ ...d, discord: e.target.value }))
            }
          />

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={details.anonymous}
              onChange={(e) =>
                setDetails((d) => ({ ...d, anonymous: e.target.checked }))
              }
              className="mt-0.5 accent-ink"
            />
            <span className="text-sm text-stone-600">
              Keep my donation anonymous (your name will not be publicly
              displayed)
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-mist text-xs text-stone-500">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          Payment processed securely by Flutterwave. Your details are never
          shared publicly.
        </div>

        <button
          className="btn-primary w-full mt-4 py-3.5"
          onClick={handleDonate}
        >
          <Heart className="w-4 h-4" />
          Complete Donation — {formatNaira(selectedAmount || 0)}
        </button>
      </div>
    );
  }

  return (
    <div className="card" id="donate">
      <p className="label-tag">Make a contribution</p>
      <h3 className="text-xl font-bold text-ink mb-1">Support the campaign</h3>
      <p className="text-sm text-stone-500 mb-5">
        Every naira helps. Choose an amount or enter your own.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {DONATION_TIERS.map((tier) => (
          <button
            key={tier.amount}
            className={cn(
              "rounded-lg border text-sm font-semibold py-2.5 transition-all",
              !useCustom && amount === tier.amount
                ? "border-ink bg-ink text-white"
                : "border-rule bg-white text-ink hover:border-stone-400",
            )}
            onClick={() => {
              setAmount(tier.amount);
              setUseCustom(false);
              setError("");
            }}
          >
            {tier.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
          ₦
        </span>
        <input
          type="text"
          inputMode="numeric"
          className={cn(
            "input-field pl-7",
            useCustom && "ring-2 ring-accent border-transparent",
          )}
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            setCustomAmount(val);
            setUseCustom(true);
            setError("");
          }}
          onFocus={() => setUseCustom(true)}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <button
        className="btn-primary w-full mt-4 py-3.5 text-base"
        onClick={handleProceed}
        disabled={!selectedAmount || selectedAmount < 100}
      >
        <Heart className="w-4 h-4" />
        Donate {selectedAmount ? formatNaira(selectedAmount) : "Now"}
        <ChevronRight className="w-4 h-4 ml-auto" />
      </button>

      <div className="flex items-center gap-2 mt-3 text-xs text-stone-400">
        <Lock className="w-3 h-3" />
        Secured by Flutterwave · No donor names displayed publicly
      </div>
    </div>
  );
}
