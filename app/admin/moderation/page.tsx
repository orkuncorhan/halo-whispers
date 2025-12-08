"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/app/context/UserContext";

type AdminWhisperRow = {
  id: string;
  content: string;
  mood: string | null;
  created_at: string | null;
  profiles: {
    username: string | null;
    display_name: string | null;
  } | null;
};

type AdminReportRow = {
  id: string;
  reason: string | null;
  status: string;
  created_at: string | null;
  whisper: {
    id: string;
    content: string;
    mood: string | null;
    created_at: string | null;
    profiles: {
      username: string | null;
      display_name: string | null;
    } | null;
  } | null;
};

export default function AdminModerationPage() {
  const { userId } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [whispers, setWhispers] = useState<AdminWhisperRow[]>([]);
  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Admin kontrolü
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .maybeSingle();

      if (profileError || !profile?.is_admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Son 100 fısıltıyı al
      const { data, error } = await supabase
        .from("whispers")
        .select(
          `
          id,
          content,
          mood,
          created_at,
          profiles (
            username,
            display_name
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Admin fetch failed:", error);
        setWhispers([]);
      } else {
        setWhispers((data ?? []) as AdminWhisperRow[]);
      }

      const { data: reportData, error: reportError } = await supabase
        .from("whisper_reports")
        .select(
          `
       id,
       reason,
       status,
       created_at,
       whisper: whispers (
         id,
         content,
         mood,
         created_at,
         profiles (
           username,
           display_name
         )
       )
     `
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (reportError) {
        console.error("Admin reports fetch error:", reportError);
        setReports([]);
      } else {
        setReports((reportData ?? []) as AdminReportRow[]);
      }

      setLoading(false);
    };

    run();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu fısıltıyı silmek istediğine emin misin?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("whispers").delete().eq("id", id);

    if (error) {
      console.error("Admin delete error:", error);
      alert("Silme sırasında bir hata oluştu.");
      return;
    }

    // UI'dan kaldır
    setWhispers((prev) => prev.filter((w) => w.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Yükleniyor...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Erişim yok</h1>
          <p className="text-sm text-gray-500">
            Bu sayfa yalnızca Halo Whispers adminleri içindir.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto space-y-6">
      <header className="space-y-2 border-b pb-4">
        <h1 className="text-2xl font-bold">Moderatör Paneli</h1>
        <p className="text-sm text-gray-500">
          Uygunsuz içeriği hızlıca kaldırabilirsin.
        </p>
      </header>

      <section className="space-y-3">
        {whispers.length === 0 ? (
          <p className="text-sm text-gray-500">Hiç fısıltı yok.</p>
        ) : (
          <ul className="space-y-3">
            {whispers.map((w) => {
              const author =
                w.profiles?.display_name ||
                w.profiles?.username ||
                "Anon Walker";

              return (
                <li
                  key={w.id}
                  className="border rounded-xl p-3 space-y-2 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{author}</p>
                      <p>{w.content}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="text-xs border px-2 py-1 rounded hover:bg-red-50"
                    >
                      Sil
                    </button>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
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
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Raporlar</h2>

        {reports.length === 0 ? (
          <p className="text-sm text-gray-500">
            Henüz bildirilmiş bir fısıltı yok.
          </p>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => {
              const w = r.whisper;
              const profile = w?.profiles;
              const authorName =
                profile?.display_name || profile?.username || "Anon Walker";

              return (
                <li
                  key={r.id}
                  className="border rounded-xl p-3 space-y-2 text-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        Rapor durumu: {r.status}
                      </p>
                      <p className="font-semibold">{authorName}</p>
                      <p>{w?.content}</p>
                      {r.reason && (
                        <p className="text-xs text-gray-600">
                          Bildiren notu: “{r.reason}”
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
