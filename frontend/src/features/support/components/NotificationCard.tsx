import Link from "next/link";
import type {
  SupportNotification,
  SupportNotificationTone,
} from "@/features/support/types/support.types";

type NotificationCardProps = {
  notification: SupportNotification;
};

const toneClassNames: Record<
  SupportNotificationTone,
  {
    border: string;
    iconBg: string;
    iconText: string;
    statusText: string;
    icon: string;
  }
> = {
  urgent: {
    border: "border-l-[var(--primary)]",
    iconBg: "bg-red-50",
    iconText: "text-[var(--primary)]",
    statusText: "text-[var(--primary)]",
    icon: "!",
  },
  info: {
    border: "border-l-sky-600",
    iconBg: "bg-sky-50",
    iconText: "text-sky-700",
    statusText: "text-sky-700",
    icon: "✓",
  },
  success: {
    border: "border-l-green-600",
    iconBg: "bg-green-50",
    iconText: "text-green-700",
    statusText: "text-green-700",
    icon: "✓",
  },
  pending: {
    border: "border-l-orange-500",
    iconBg: "bg-orange-50",
    iconText: "text-orange-700",
    statusText: "text-orange-700",
    icon: "⏱",
  },
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const tone = toneClassNames[notification.tone];

  return (
    <article
      className={[
        "rounded-xl border border-(--border) border-l-4 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        tone.border,
      ].join(" ")}
    >
      <div className="grid gap-5 md:grid-cols-[3.5rem_1fr_auto]">
        <span
          className={[
            "flex size-12 items-center justify-center rounded-xl text-xl font-bold",
            tone.iconBg,
            tone.iconText,
          ].join(" ")}
        >
          {tone.icon}
        </span>

        <div>
          <h2 className="font-bold text-slate-900">{notification.title}</h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {notification.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {notification.actionHref && notification.actionLabel ? (
              <Link
                href={notification.actionHref}
                className={[
                  "inline-flex rounded-md px-5 py-3 text-sm font-bold transition",
                  notification.tone === "urgent"
                    ? "bg-(--primary) text-white hover:bg-(--primary-hover)"
                    : "border border-slate-300 text-sky-700 hover:border-sky-700 hover:bg-sky-50",
                ].join(" ")}
              >
                {notification.actionLabel}
              </Link>
            ) : null}

            <span className={`text-xs font-bold uppercase ${tone.statusText}`}>
              {notification.statusLabel}
            </span>
          </div>
        </div>

        <time className="text-sm text-slate-500">{notification.timeLabel}</time>
      </div>
    </article>
  );
}
