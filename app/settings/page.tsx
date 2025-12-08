"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useColorMode } from "../context/ColorModeContext";
import { useLanguage } from "../context/LanguageContext";
import { GlassCard } from "../components/GlassCard";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const { username, setUsername } = useUser();
  const { colorMode, toggleColorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();
  const supabase = createClient();

  const isTR = language === "tr";
  const isDark = colorMode === "dark";
  const [nameInput, setNameInput] = useState(username ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const trimmed = nameInput.trim();
      if (!trimmed) {
        setSaving(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Oturum bulunamadı.");

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: trimmed,
          display_name: trimmed,
        });

      if (upsertError) throw upsertError;

      setUsername(trimmed);
    } catch (err: any) {
      if (err?.name === "AuthSessionMissingError") {
        // Oturum yoksa sessizce geç
        return;
      }
      console.error(err);
      setError(err.message ?? "Profil kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      className={
        "min-h-screen flex items-center justify-center px-4 py-16 transition-colors " +
        (isDark
          ? "bg-[#020617]"
          : "bg-[radial-gradient(circle_at_top,_#fdfbff,_#e3f2ff)]")
      }
    >
      <div className="max-w-xl w-full">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          {isTR ? "<- Geri don" : "<- Go back"}
        </button>

        <GlassCard className="w-full p-8 md:p-10">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-6">
            {isTR ? "Ayarlar" : "Settings"}
          </h1>

          <section className="mb-8">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {isTR ? "Tema" : "Theme"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {isTR ? "Su an: " : "Current: "}
              {colorMode === "light"
                ? isTR
                  ? "Acik"
                  : "Light"
                : isTR
                ? "Koyu"
                : "Dark"}
            </p>
            <button
              type="button"
              onClick={toggleColorMode}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs hover:bg-neutral-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
            >
              {colorMode === "light"
                ? isTR
                  ? "Koyu moda gec"
                  : "Switch to dark"
                : isTR
                ? "Acik moda gec"
                : "Switch to light"}
            </button>
          </section>

          <section className="mb-8">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">
              {isTR ? "Dil" : "Language"}
            </p>

            <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1 mb-2">
              <button
                type="button"
                onClick={() => setLanguage("tr")}
                className={`px-4 py-1.5 text-xs rounded-full transition-colors ${
                  isTR
                    ? "bg-neutral-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Turkce
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-4 py-1.5 text-xs rounded-full transition-colors ${
                  !isTR
                    ? "bg-neutral-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                English
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isTR
                ? "Dil tercihin burada saklanir; arayuz metinlerini buna gore gosteririz."
                : "Your language preference is stored here; we will show the interface in that language."}
            </p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-slate-800 dark:text-slate-100 mb-1"
                htmlFor="username"
              >
                {isTR ? "Kullanici adin" : "Your username"}
              </label>
              <input
                id="username"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  text-slate-900
                  shadow-inner
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sky-300
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-50
                  dark:shadow-[inset_0_0_0_1px_rgba(15,23,42,0.6)]
                "
                placeholder={isTR ? "ornegin: softsunrise" : "e.g. softsunrise"}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="
                w-full
                mt-2
                rounded-2xl
                bg-neutral-900
                text-white
                text-sm
                py-2.5
                font-medium
                hover:bg-neutral-800
                dark:bg-slate-100
                dark:text-slate-900
                dark:hover:bg-slate-200
                transition-colors
              "
            >
              {saving
                ? isTR
                  ? "Kaydediliyor..."
                  : "Saving..."
                : isTR
                ? "Kaydet"
                : "Save"}
            </button>

            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
            {saving && !error && (
              <p className="text-xs text-neutral-500 mt-1">
                Kaydediliyor...
              </p>
            )}
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
