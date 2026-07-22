import { z } from "zod";

/**
 * SECURITY_AUDIT.md Finding 010: `z.string().url()` accepts ANY valid URL,
 * not just LinkedIn — allowing phishing links to be stored and later
 * rendered as "LinkedIn" in the admin dashboard/emails. Restrict to actual
 * linkedin.com hosts (or empty).
 */
const linkedinUrlSchema = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(""))
  .refine(
    (url) => {
      if (!url) return true;
      try {
        const { hostname, protocol } = new URL(url);
        if (protocol !== "https:" && protocol !== "http:") return false;
        return (
          hostname === "linkedin.com" ||
          hostname.endsWith(".linkedin.com")
        );
      } catch {
        return false;
      }
    },
    { message: "Must be a valid linkedin.com URL" },
  );

export const donationSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .min(100, "Minimum donation is ₦100")
    .max(10_000_000, "Amount exceeds maximum"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  twitter: z
    .string()
    .max(100)
    .optional()
    .transform((v) => v?.replace(/^@/, "") || undefined),
  linkedin: linkedinUrlSchema,
  discord: z.string().max(100).optional(),
});

export const guestbookSchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Name too long").trim(),
  social_handle: z.string().max(100).optional(),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(1000, "Message too long (max 1000 characters)")
    .trim(),
  /**
   * SECURITY_AUDIT.md Finding 018: honeypot field. Real visitors never see
   * or fill this input (hidden via CSS in the form); bots that
   * indiscriminately fill every field trip it. Any non-empty value here
   * silently rejects the submission upstream of a DB write.
   */
  website: z.string().max(200).optional().or(z.literal("")),
});

export const careerSupportSchema = z.object({
  submission_type: z.enum([
    "internship",
    "learning_resource",
    "certification",
    "mentorship",
    "project_idea",
    "networking",
  ]),
  name: z.string().min(1, "Name is required").max(80).trim(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  linkedin_url: linkedinUrlSchema,
  message: z.string().min(10, "Please add a bit more detail").max(2000).trim(),
});

export type DonationInput = z.infer<typeof donationSchema>;
export type GuestbookInput = z.infer<typeof guestbookSchema>;
export type CareerSupportInput = z.infer<typeof careerSupportSchema>;
