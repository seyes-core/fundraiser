import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";
const ADMIN = process.env.ADMIN_EMAIL ?? "";

export async function sendDonorThankYou(
  to: string,
  amount: number,
  txRef: string
) {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", maximumFractionDigits: 0,
  }).format(amount);

  await resend.emails.send({
    from: `Temitope's Campaign <${FROM}>`,
    to,
    subject: `Thank you for your donation — ${formatted} received`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;color:#1A1917;">
        <div style="border-bottom:2px solid #1B3A5C;padding-bottom:16px;margin-bottom:28px;">
          <h2 style="margin:0;font-size:22px;color:#1B3A5C;">Thank you sincerely.</h2>
        </div>
        <p style="line-height:1.8;font-size:15px;">
          Your donation of <strong>${formatted}</strong> has been received and will go directly toward purchasing the Dell Latitude 7400 laptop.
        </p>
        <p style="line-height:1.8;font-size:15px;">
          This machine will help me build data pipelines, earn certifications, contribute to open-source, and apply for internships in technology. You are directly part of that journey.
        </p>
        <div style="background:#EEF3F8;border-radius:10px;padding:16px 20px;margin:24px 0;">
          <p style="margin:0;font-size:13px;color:#3A5A78;"><strong>Transaction reference:</strong> ${txRef}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#3A5A78;"><strong>Amount:</strong> ${formatted}</p>
        </div>
        <p style="line-height:1.8;font-size:14px;color:#6B6860;">
          I will post updates on this campaign page — including photos when the laptop arrives and progress on my first projects.
        </p>
        <p style="font-size:14px;color:#6B6860;">With gratitude,<br/><strong>Temitope Ogungbuji</strong></p>
      </div>
    `,
  });
}

export async function notifyAdmin(data: {
  amount: number;
  txRef: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
}) {
  if (!ADMIN) return;

  const fmt = new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", maximumFractionDigits: 0,
  }).format(data.amount);

  await resend.emails.send({
    from: `Campaign Bot <${FROM}>`,
    to: ADMIN,
    subject: `New donation: ${fmt}`,
    html: `
      <div style="font-family:monospace;font-size:14px;color:#1A1917;">
        <h3>New donation received</h3>
        <p><strong>Amount:</strong> ${fmt}</p>
        <p><strong>TX Ref:</strong> ${data.txRef}</p>
        <hr/>
        <p><strong>Donor email:</strong> ${data.email || "—"}</p>
        <p><strong>Twitter:</strong> ${data.twitter || "—"}</p>
        <p><strong>LinkedIn:</strong> ${data.linkedin || "—"}</p>
        <p><strong>Discord:</strong> ${data.discord || "—"}</p>
      </div>
    `,
  });
}
