export default function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      {/* Glow */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute h-40 w-40 rounded-full bg-amber-200/20 blur-3xl"></div>

        <svg
          className="h-10 w-10 text-amber-400 animate-pulse-slow"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <h2 className="text-lg font-medium text-slate-700">
        No notifications yet.
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        The world is calm. No echoes, no sparks.
      </p>
    </div>
  );
}
