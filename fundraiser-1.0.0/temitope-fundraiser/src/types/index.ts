// ─── Campaign ──────────────────────────────────────────────────────────────────
export interface CampaignStats {
  id: string;
  goal_amount: number;
  amount_raised: number;
  donor_count: number;
  updated_at: string;
}

// ─── Donations ────────────────────────────────────────────────────────────────
export interface Donation {
  id: string;
  amount: number;
  donor_email: string | null;
  twitter_profile: string | null;
  linkedin_profile: string | null;
  discord_username: string | null;
  anonymous: boolean;
  transaction_reference: string;
  flw_transaction_id: string | null;
  status: "pending" | "successful" | "failed";
  created_at: string;
}

export interface DonationFormData {
  amount: number;
  email?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
}

// ─── Guestbook ────────────────────────────────────────────────────────────────
export interface GuestbookEntry {
  id: string;
  name: string;
  social_handle: string | null;
  message: string;
  approved: boolean;
  created_at: string;
}

export interface GuestbookFormData {
  name: string;
  social_handle?: string;
  message: string;
}

// ─── Campaign Updates ─────────────────────────────────────────────────────────
export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
}

// ─── Career Support ───────────────────────────────────────────────────────────
export type SupportType =
  | "internship"
  | "learning_resource"
  | "certification"
  | "mentorship"
  | "project_idea"
  | "networking";

export interface CareerSupportSubmission {
  id: string;
  submission_type: SupportType;
  name: string;
  email: string | null;
  linkedin_url: string | null;
  message: string;
  created_at: string;
  status: "new" | "reviewed" | "actioned";
}

export interface CareerSupportFormData {
  submission_type: SupportType;
  name: string;
  email?: string;
  linkedin_url?: string;
  message: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaymentInitResponse {
  payment_link: string;
  tx_ref: string;
}
