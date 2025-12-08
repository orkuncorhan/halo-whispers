"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      // Giriş/Kayıt başarılı → feed sayfasına gönder
      router.push("/feed");
    } catch (err: any) {
      setError(err.message ?? "Bir şey ters gitti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-2xl p-6 space-y-6 bg-white/70 backdrop-blur">
        <h1 className="text-2xl font-semibold text-center">
          {mode === "login" ? "Halo Whispers'a Giriş Yap" : "Halo Whispers'a Katıl"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">E-posta</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Şifre</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="En az 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-3 py-2 text-sm border bg-black text-white disabled:opacity-60"
          >
            {loading
              ? "İşleniyor..."
              : mode === "login"
                ? "Giriş Yap"
                : "Kayıt Ol"}
          </button>
        </form>

        <button
          type="button"
          className="w-full text-xs underline"
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          {mode === "login"
            ? "Hesabın yok mu? Kayıt ol"
            : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </div>
    </div>
  );
}
