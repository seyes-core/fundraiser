"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();
  const txRef = params.get("tx_ref");
  const status = params.get("status");
  const [verified, setVerified] = useState<"checking" | "success" | "failed">(
    "checking",
  );

  useEffect(() => {
    if (!txRef) {
      setVerified("failed");
      return;
    }
    fetch(`/api/donate/verify?tx_ref=${txRef}`)
      .then((r) => r.json())
      .then((d) =>
        setVerified(d.status === "successful" ? "success" : "failed"),
      )
      .catch(() => setVerified("failed"));
  }, [txRef]);

  return (
    <div style={{ textAlign: "center", maxWidth: 440, padding: "0 20px" }}>
      {verified === "checking" && (
        <>
          <div style={{ fontSize: 44, marginBottom: 16 }}>⏳</div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#1A1917",
              marginBottom: 10,
            }}
          >
            Confirming your donation…
          </div>
          <div style={{ fontSize: 14, color: "#6B6860", lineHeight: 1.8 }}>
            Please wait while we verify your payment.
          </div>
        </>
      )}

      {verified === "success" && (
        <>
          <div style={{ fontSize: 56, marginBottom: 18 }}>🙏</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 12px",
            }}
          >
            Thank you sincerely.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#6B6860",
              lineHeight: 1.85,
              margin: "0 0 10px",
            }}
          >
            Your donation has been received and confirmed.
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#6B6860",
              lineHeight: 1.85,
              margin: "0 0 28px",
            }}
          >
            If you provided an email address, a receipt has been sent. Your
            generosity brings Temitope one step closer to building technology
            that matters.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                background: "#1B3A5C",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Back to campaign
            </Link>
            <a
              href={`https://twitter.com/intent/tweet?text=I+just+donated+to+help+%40temitope_dev+build+his+first+laptop+and+launch+his+tech+career.+Every+contribution+counts!&url=https://fundraiser-one-inky.vercel.app`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: "1.5px solid #E8E6E1",
                background: "#F3F2EF",
                color: "#1A1917",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Share on X
            </a>
          </div>
        </>
      )}

      {verified === "failed" && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1917",
              margin: "0 0 12px",
            }}
          >
            Payment not confirmed yet
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6B6860",
              lineHeight: 1.85,
              margin: "0 0 28px",
            }}
          >
            If money was deducted from your account, your payment may still be
            processing. Please check back in a few minutes. If the problem
            persists contact Temitope directly.
          </p>
          <Link
            href="/"
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: "#1B3A5C",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Back to campaign
          </Link>
        </>
      )}
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAF8",
      }}
    >
      <Suspense
        fallback={
          <div style={{ textAlign: "center", color: "#6B6860", fontSize: 14 }}>
            Loading…
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
