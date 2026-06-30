export type SpamLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";

type SpamWarningBadgeProps = {
  level?: SpamLevel | string | null;
  score?: number | null;
  reasons?: string | null;
};

const config: Record<
  Exclude<SpamLevel, "NONE">,
  { label: string; className: string }
> = {
  LOW: {
    label: "Nghi spam thấp",
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
  },
  MEDIUM: {
    label: "Nghi spam trung bình",
    className: "border-orange-200 bg-orange-50 text-orange-800",
  },
  HIGH: {
    label: "Nghi spam cao",
    className: "border-red-200 bg-red-50 text-[var(--primary)]",
  },
};

export function SpamWarningBadge({
  level,
  score,
  reasons,
}: SpamWarningBadgeProps) {
  if (!level || level === "NONE") return null;

  const normalizedLevel = level as Exclude<SpamLevel, "NONE">;
  const item = config[normalizedLevel];
  if (!item) return null;

  const title = [
    score == null ? null : `Điểm nghi spam: ${score}`,
    reasons ? `Lý do: ${reasons}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <span
      title={title || undefined}
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
        item.className,
      ].join(" ")}
    >
      {item.label}
      {score == null ? null : ` (${score})`}
    </span>
  );
}
