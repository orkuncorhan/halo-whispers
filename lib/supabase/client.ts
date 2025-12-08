"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  console.log("SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("SUPABASE_ANON", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}