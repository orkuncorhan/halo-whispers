"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const usernamePattern = /^[a-z0-9_]{3,20}$/;

export default function OnboardingPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = useCallback(
    (value: string) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return "Kullanıcı adı zorunlu.";
      if (!usernamePattern.test(normalized)) {
        return "3-20 karakter, sadece harf/rakam/_ kullan.";
      }
      return null;
    },
    []
  );

  useEffect(() => {
    const prefill = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        setUsername(data.username ?? "");
        setBio(data.bio ?? "");
      }
    };

    prefill();
  }, [router, supabase]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(false);

      const usernameError = validate(username);
      if (usernameError) {
        setFieldErrors({ username: usernameError });
        return;
      }
      setFieldErrors({});

      const normalized = username.trim().toLowerCase();
      const bioValue = bio.trim() || null;

      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message || "Giriş yapman gerekiyor.");
        setLoading(false);
        return;
      }

      const { data: existing, error: existingError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", normalized)
        .neq("id", user.id)
        .maybeSingle();

      if (existingError) {
        setError(existingError.message);
        setLoading(false);
        return;
      }

      if (existing) {
        setFieldErrors({
          username: "Bu kullanıcı adı alınmış.",
        });
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: normalized,
          bio: bioValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      router.push("/mood");
    },
    [bio, router, supabase, username, validate]
  );

  return (
    <main className="min-h-[100dvh] w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[2.5rem] bg-white/80 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Halo Whispers
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Profilini tamamla
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              İyi bir halo için seni tanıyalım. Kullanıcı adın benzersiz olmalı.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-3xl bg-white/70 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">
              Kullanıcı adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="halo_walker"
              className={`w-full rounded-2xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                fieldErrors.username
                  ? "border-red-300 bg-red-50/60 text-red-700"
                  : "border-slate-200 bg-white/70 text-slate-900"
              }`}
              autoComplete="username"
              minLength={3}
              maxLength={20}
            />
            <p className="text-xs text-slate-500">
              3-20 karakter, sadece küçük harf, rakam ve alt çizgi.
            </p>
            {fieldErrors.username && (
              <p className="text-xs font-medium text-red-600">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">
              Biyografi <span className="text-slate-400">(opsiyonel)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              placeholder="Kısaca kendinden bahset."
              maxLength={220}
            />
            <p className="text-xs text-slate-400">{bio.length}/220</p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Profilin güncellendi. Mood sayfasına yönlendiriliyorsun...
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Seçimin kaydedildikten sonra mood sayfasına geçersin.
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Kaydediliyor..." : "Kaydet ve devam et"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
