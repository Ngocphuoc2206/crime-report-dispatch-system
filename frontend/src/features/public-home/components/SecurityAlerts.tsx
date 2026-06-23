import Link from "next/link";
import { securityAlerts } from "@/features/public-home/data/publicHome.data";
import type { AlertTone } from "@/features/public-home/types/publicHome.types";

const toneClassNames: Record<AlertTone, string> = {
  danger: "border-l-red-700 bg-red-50 text-red-700",
  warning: "border-l-orange-500 bg-orange-50 text-orange-700",
  info: "border-l-sky-700 bg-sky-50 text-sky-700",
  success: "border-l-emerald-600 bg-emerald-50 text-emerald-700",
};

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M15 17H9m10-1-1.4-1.4A2 2 0 0 1 17 13.2V10a5 5 0 0 0-10 0v3.2c0 .5-.2 1-.6 1.4L5 16h14Zm-9 3h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SecurityAlerts() {
  return (
    <section aria-labelledby="security-alerts-heading">
      <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-(--primary) pb-3">
        <h2
          id="security-alerts-heading"
          className="flex items-center gap-2 text-xl font-bold text-(--primary)"
        >
          <BellIcon />
          Thông báo an ninh vùng
        </h2>

        <Link
          href="/news"
          className="text-sm font-semibold text-sky-700 hover:text-(--primary)"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {securityAlerts.map((alert) => (
          <article
            key={alert.id}
            className="rounded-lg border border-(--border) border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded px-2 py-1 text-[0.65rem] font-bold uppercase ${toneClassNames[alert.tone]}`}
              >
                {alert.level}
              </span>

              <time className="shrink-0 text-xs text-slate-500">
                {alert.time} | {alert.date}
              </time>
            </div>

            <h3 className="mt-4 text-base font-semibold leading-6 text-slate-900">
              {alert.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {alert.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
