"use client";

import React from "react";

export default function HaloBrandMark({
  size = 28,
}: {
  size?: number;
}) {
  const px = `${size}px`;

  return (
    <div
      className="
        inline-flex items-center justify-center rounded-full
        bg-white/70
        shadow-[0_0_24px_rgba(251,191,36,0.45)]
        border border-white/80
      "
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size - 8}
        height={size - 8}
        aria-hidden="true"
      >
        {/* Tek bir ilahi halka – ekstra kare / top yok */}
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="#FBBF24" // amber-400
          strokeWidth="1.7"
        />
      </svg>
    </div>
  );
}
