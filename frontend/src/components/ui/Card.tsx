import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-(--border) bg-white shadow-sm ${className}`}
      {...props}
    />
  );
}
