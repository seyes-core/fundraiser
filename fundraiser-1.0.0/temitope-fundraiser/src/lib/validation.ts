import { z } from "zod";

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
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
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
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  message: z.string().min(10, "Please add a bit more detail").max(2000).trim(),
});

export type DonationInput = z.infer<typeof donationSchema>;
export type GuestbookInput = z.infer<typeof guestbookSchema>;
export type CareerSupportInput = z.infer<typeof careerSupportSchema>;
