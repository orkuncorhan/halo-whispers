// lib/profile.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export function isProfileComplete(profile: ProfileRow | null) {
  return !!profile?.username && profile.username.trim().length > 0;
}

export async function getMyProfile(supabase: SupabaseClient) {
  try {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
      console.error("getMyProfile auth.getUser error:", {
        message: userErr.message,
        status: (userErr as any).status,
        name: (userErr as any).name,
      });
      return null;
    }

    if (!user) return null;

    // ÖNEMLİ: tablo adı "profiles" olmalı. "public.profiles" yazma.
    const { data, error } = await supabase
      .from("profiles")
      .select("id,username,display_name,bio,created_at,updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      // Next.js overlay bazen objeleri {} diye gösteriyor.
      // Bu yüzden mesajı düz string olarak logluyoruz:
      console.error("getMyProfile select error MESSAGE:", String(error.message));
      console.error("getMyProfile select error RAW:", error);

      return null;
    }

    return (data as ProfileRow) ?? null;
  } catch (e) {
    console.error("getMyProfile unexpected error:", e);
    return null;
  }
}
