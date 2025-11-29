"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import { GlassCard } from "../components/GlassCard";

export default function LoginPage() {
  const { setUsername, isLoggedIn } = useUser();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/feed");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError(
        isTR
          ? "Önce fısıldarken kullanacağın bir isim seç."
          : "Choose a name you’ll use for your whispers."
      );
      return;
    }

    if (trimmed.length > 20) {
      setError(
        isTR
          ? "20 karakteri geçmeyen bir isim seçelim."
          : "Please keep it under 20 characters."
      );
      return;
    }

    setUsername(trimmed);
    router.push("/mood");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--halo-page-bg)]">
      <div className="w-full max-w-md px-6">
        <GlassCard className="p-6 md:p-8 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isTR ? "Halo adını seç" : "Choose your halo name"}
          </h1>
          <p className="text-sm text-neutral-600">
            {isTR
              ? "Bu isim fısıltılarında görünecek. Daha sonra Ayarlar kısmından değiştirebilirsin."
              : "This name will appear with your whispers. You can change it later in Settings."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              placeholder={
                isTR ? "örneğin: softsunrise" : "for example: softsunrise"
              }
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 bg-white/60 backdrop-blur"
            />

            {error && (
              <p className="text-xs text-red-500 leading-snug">{error}</p>
            )}

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              {isTR ? "Halo’ya giriş yap" : "Enter Halo"}
            </button>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
