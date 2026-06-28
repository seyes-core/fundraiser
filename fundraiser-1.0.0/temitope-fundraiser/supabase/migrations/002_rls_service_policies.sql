-- ─────────────────────────────────────────────────────────────────────────────
-- Service Role Policies (allow server-side API routes full access)
-- Run AFTER 001_initial_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- donations: service role full access
CREATE POLICY "service_role_donations"
  ON donations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- guestbook_entries: service role full access
CREATE POLICY "service_role_guestbook"
  ON guestbook_entries FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- campaign_stats: service role write
CREATE POLICY "service_role_stats_write"
  ON campaign_stats FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- campaign_updates: service role write
CREATE POLICY "service_role_updates_write"
  ON campaign_updates FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- career_support_submissions: service role full access
CREATE POLICY "service_role_submissions"
  ON career_support_submissions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
