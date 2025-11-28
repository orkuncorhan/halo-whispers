import React from "react";

export const SparkIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-5 w-5 ${className}`}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
  </svg>
);

export const EchoIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-5 w-5 ${className}`}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9S3 7.03 3 12c0 1.48.36 2.89 1 4.14L3 21l4.86-.99C9.11 20.64 10.52 21 12 21Z" />
  </svg>
);

export const BeamIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-5 w-5 ${className}`}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="m22 2-11 11M22 2 15 22l-4-9L2 9l20-7Z" />
  </svg>
);
