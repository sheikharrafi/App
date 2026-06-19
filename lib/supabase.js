import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create client only if env vars exist
const hasConfig = supabaseUrl && supabaseAnonKey;

// Client-side Supabase client (for browser/components)
export const supabase = hasConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Supabase client (for API routes & server components)
export function createServerSupabaseClient() {
  if (!hasConfig) {
    console.warn("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
