"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SparkIcon, EchoIcon, BeamIcon } from "../components/Icons";
import EmptyNotifications from "../components/EmptyNotifications";
import HaloBrandMark from "../components/HaloBrandMark";

type NotificationType = "hope" | "echo" | "beam";

interface NotificationItemProps {
  id: number;
  type: NotificationType;
  user: string;
  text: string;
  time: string;
}

function NotifIcon({ type }: { type: NotificationType }) {
  const size = "h-6 w-6";

  if (type === "hope") {
    return <SparkIcon className={`${size} stroke-amber-500`} />;
  }

  if (type === "echo") {
    return <EchoIcon className={`${size} stroke-blue-400`} />;
  }

  if (type === "beam") {
    return <BeamIcon className={`${size} stroke-slate-600`} />;
  }

  return null;
}

function NotificationItem({ type, user, text, time }: NotificationItemProps) {
  return (
    <div
      className="p-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/70 hover:shadow-[0_4px_28px_rgba(251,191,36,0.15)] hover:bg-white/80 transition-all flex items-center gap-4"
    >
      <NotifIcon type={type} />

      <div className="flex flex-col">
        <span className="text-slate-900 text-sm">
          <span className="font-medium">{user}</span> {text}
        </span>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const notifications: NotificationItemProps[] = [
    { id: 1, type: "hope", user: "Elena", text: "sent you hope.", time: "2m" },
    {
      id: 2,
      type: "echo",
      user: "Marcel",
      text: "echoed your whisper.",
      time: "15m",
    },
    {
      id: 3,
      type: "beam",
      user: "Anna",
      text: "shared your whisper.",
      time: "1h",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 pb-24 pt-16">
      {/* === HEADER KART === */}
      <header
        className="
          mb-10
          flex items-center justify-between
          rounded-2xl
          bg-white/70 backdrop-blur-xl
          px-6 pt-6 pb-4
          shadow-[0_18px_60px_rgba(15,23,42,0.18)]
          border border-white/70
        "
      >
        {/* SOL: LOGO + BAŞLIK */}
        <div className="flex items-center gap-3">
          <HaloBrandMark size={26} />
          <h1 className="text-xl font-semibold text-slate-900">
            Notifications
          </h1>
        </div>

        {/* SAĞ: BACK TO STREAM */}
        <button
          type="button"
          onClick={() => router.push("/feed")}
          className="
            inline-flex items-center
            rounded-full px-3 py-1
            text-[11px] tracking-[0.22em] uppercase
            text-slate-500
            hover:text-slate-900 hover:bg-white/80
            transition
          "
        >
          Back to Stream
        </button>
      </header>

      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} {...n} />)
        )}
      </div>
    </main>
  );
}
