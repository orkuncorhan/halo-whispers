"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
  id: string;
  username: string | null;
  display_name: string | null;
};

type WhisperRow = {
  id: string;
  content: string;
  mood: string | null;
  created_at: string | null;
};

export default function PublicProfilePage() {
  const params = useParams();
  const usernameParam = (params?.username as string) || "";

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [whispers, setWhispers] = useState<WhisperRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProfileAndWhispers = async () => {
      if (!usernameParam) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      const supabase = createClient();

      // 1) Kullanıcı profilini getir
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .eq("username", usernameParam)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error("Public profile load error:", profileError);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData as ProfileData);

      // 2) Bu kullanıcıya ait fısıltıları getir
      const { data: whisperData, error: whisperError } = await supabase
        .from("whispers")
        .select("id, content, mood, created_at")
        .eq("user_id", profileData.id)
        .order("created_at", { ascending: false });

      if (whisperError) {
        console.error("Public profile whispers error:", whisperError);
        setWhispers([]);
      } else {
        setWhispers((whisperData ?? []) as WhisperRow[]);
      }

      setLoading(false);
    };

    loadProfileAndWhispers();
  }, [usernameParam]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Profil yükleniyor...</p>
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Profil bulunamadı</h1>
          <p className="text-sm text-gray-500">
            Bu kullanıcı adıyla kayıtlı bir Halo Walker görünmüyor.
          </p>
        </div>
      </main>
    );
  }

  const displayName =
    profile.display_name || profile.username || "Halo Walker";

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto space-y-6">
      <header className="space-y-2 border-b pb-4">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        {profile.username && (
          <p className="text-sm text-gray-500">@{profile.username}</p>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Fısıltılar</h2>

        {whispers.length === 0 ? (
          <p className="text-sm text-gray-500">
            Bu yürüyüşçünün henüz görünür bir fısıltısı yok.
          </p>
        ) : (
          <ul className="space-y-3">
            {whispers.map((w) => (
              <li
                key={w.id}
                className="border rounded-xl p-3 text-sm space-y-1"
              >
                <p>{w.content}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{w.mood || "neutral"}</span>
                  <span>
                    {w.created_at
                      ? new Date(w.created_at).toLocaleString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
