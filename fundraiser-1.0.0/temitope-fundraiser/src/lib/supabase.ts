import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.",
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing Supabase anon key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY.",
  );
}

// Public client — safe to use in browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client — never expose to browser
export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
