"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { useTheme, WhisperType, CommentType } from "../../context/ThemeContext";

type WhisperDetailPageProps = {
  params: { id: string };
};

export default function WhisperDetail({ params }: WhisperDetailPageProps) {
  const {
    whispers,
    addComment,
    deleteComment,
    filterToxic,
    getThemeColors,
    username,
  } = useTheme();

  const theme = getThemeColors();
  const whisperId = params.id;

  const whisper: WhisperType | undefined = useMemo(
    () => whispers.find((w) => w.id === whisperId),
    [whispers, whisperId]
  );
  const comments = whisper?.comments ?? [];

  const [commentText, setCommentText] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  if (!whisper) {
    return (
      <div
        className={`min-h-screen ${theme.bg} flex items-center justify-center`}
      >
        <div className="px-6 py-4 rounded-2xl bg-white/80 shadow-md">
          <p className="text-gray-700 font-medium">
            Bu fısıltıyı bulamıyoruz. Belki rüzgâr onu çoktan götürmüştür.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    const result = filterToxic(text);
    if (!result.ok) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return; // küfürlü yorum yayınlanmıyor
    }

    addComment(whisper.id, text);
    setCommentText("");
  };

  const handleDeleteComment = (comment: CommentType) => {
    if (
      window.confirm(
        "Bu yorumu rüzgara karıştırmak (silmek) istediğine emin misin?"
      )
    ) {
      deleteComment(whisper.id, comment.id);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} py-12`}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Whisper kartı */}
        <div
          className={`rounded-3xl ${theme.card} border ${theme.cardBorder} shadow-xl p-6 mb-6`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full ${theme.halo} border border-white/70`}
            />
            <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className={`text-sm font-semibold ${theme.accent}`}>
                @{whisper.profiles?.username ?? "?"}
              </div>
              <div className="text-xs text-gray-400">{whisper.time}</div>
            </div>
            <div className="text-xs text-gray-400">
              {whisper.hop} hope •{" "}
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
            </div>
          </div>
          <p className={`mt-2 text-sm leading-relaxed ${theme.text}`}>
            {whisper.content}
          </p>
            </div>
          </div>
        </div>

        {/* Uyarı kartı */}
        {showWarning && (
          <div className="mb-4 rounded-2xl bg-[#FFF5E5] border border-[#F2C98C] px-4 py-3 text-sm text-[#6B4B20]">
            Enerjimiz biraz düştü mü?
            <br />
            Halo Whispers sadece iyilik ve umut içindir. Kelimelerini biraz
            yumuşatmak ister misin?
          </div>
        )}

        {/* Yorum formu */}
        <div
          className={`rounded-3xl ${theme.card} border ${theme.cardBorder} shadow-md p-5 mb-6`}
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Fısıltıya bir not bırak
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E27A24]/40 focus:border-[#E27A24]/60"
              placeholder={
                username
                  ? `Ne söylemek istersin, ${username}?`
                  : "Ne söylemek istersin?"
              }
              maxLength={280}
            />
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{commentText.length}/280</span>
              <button
                type="submit"
                className="rounded-full bg-[#222222] px-4 py-1.5 text-xs font-semibold tracking-wide text-white hover:bg-black transition"
              >
                Notu gönder
              </button>
            </div>
          </form>
        </div>

        {/* Yorum listesi */}
        <div
          className={`rounded-3xl ${theme.cardSoft} border ${theme.cardBorder} backdrop-blur-xl p-5`}
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Fısıltıya düşen notlar
          </h3>
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400">
              Henüz bir not yok. Belki ilk fısıltı senden gelir.
            </p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-white/60 px-3 py-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">
                        @{c.username}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {c.time}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-700 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(c)}
                    className="ml-2 shrink-0 text-[10px] text-gray-400 hover:text-red-500"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
