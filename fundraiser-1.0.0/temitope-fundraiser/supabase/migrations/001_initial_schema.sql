-- ─────────────────────────────────────────────────────────────────────────────
-- Temitope Fundraising Campaign — Initial Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── campaign_stats ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaign_stats (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_amount  INTEGER NOT NULL DEFAULT 350000,
  amount_raised INTEGER NOT NULL DEFAULT 0,
  donor_count  INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the single stats row
INSERT INTO campaign_stats (goal_amount, amount_raised, donor_count)
VALUES (350000, 0, 0)
ON CONFLICT DO NOTHING;

-- ─── donations ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount                INTEGER NOT NULL CHECK (amount >= 100),
  donor_email           TEXT,
  twitter_profile       TEXT,
  linkedin_profile      TEXT,
  discord_username      TEXT,
  anonymous             BOOLEAN NOT NULL DEFAULT TRUE,
  transaction_reference TEXT NOT NULL UNIQUE,
  flw_transaction_id    TEXT,
  status                TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'successful', 'failed')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donations_tx_ref ON donations(transaction_reference);
CREATE INDEX idx_donations_status  ON donations(status);
CREATE INDEX idx_donations_created ON donations(created_at DESC);

-- ─── guestbook_entries ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  social_handle TEXT CHECK (char_length(social_handle) <= 100),
  message       TEXT NOT NULL CHECK (char_length(message) BETWEEN 5 AND 1000),
  approved      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guestbook_approved ON guestbook_entries(approved);
CREATE INDEX idx_guestbook_created  ON guestbook_entries(created_at DESC);

-- ─── campaign_updates ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaign_updates (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content    TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  image_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed launch update
INSERT INTO campaign_updates (title, content)
VALUES (
  'Campaign Launched',
  'The fundraising campaign is now live. Thank you to everyone who has visited, shared, and offered words of encouragement. Every contribution and every share brings me one step closer to the goal.'
);

-- ─── career_support_submissions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_support_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_type TEXT NOT NULL CHECK (submission_type IN (
    'internship', 'learning_resource', 'certification',
    'mentorship', 'project_idea', 'networking'
  )),
  name            TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  email           TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  linkedin_url    TEXT,
  message         TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'reviewed', 'actioned')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_type    ON career_support_submissions(submission_type);
CREATE INDEX idx_submissions_status  ON career_support_submissions(status);
CREATE INDEX idx_submissions_created ON career_support_submissions(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE campaign_stats             ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_entries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates           ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_support_submissions ENABLE ROW LEVEL SECURITY;

-- campaign_stats: public read, no public write
CREATE POLICY "public_read_stats"
  ON campaign_stats FOR SELECT USING (true);

-- donations: no public access (service role only)
-- (no policy = denied for anon key)

-- guestbook_entries: public can read approved, no public write
CREATE POLICY "public_read_approved_entries"
  ON guestbook_entries FOR SELECT USING (approved = true);

-- campaign_updates: public read
CREATE POLICY "public_read_updates"
  ON campaign_updates FOR SELECT USING (true);

-- career_support_submissions: no public read (service role only)

-- ─────────────────────────────────────────────────────────────────────────────
-- Stored Procedures
-- ─────────────────────────────────────────────────────────────────────────────

-- Atomic increment of campaign stats on verified donation
CREATE OR REPLACE FUNCTION increment_campaign_stats(p_amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE campaign_stats
  SET
    amount_raised = amount_raised + p_amount,
    donor_count   = donor_count + 1,
    updated_at    = NOW()
  WHERE id = (SELECT id FROM campaign_stats LIMIT 1);
END;
$$;
