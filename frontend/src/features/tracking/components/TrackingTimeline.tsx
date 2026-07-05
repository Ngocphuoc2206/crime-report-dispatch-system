import type { TrackingTimelineItem } from "@/features/tracking/types/tracking.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type TrackingTimelineProps = {
  items: TrackingTimelineItem[];
};

function formatDateTime(value?: string) {
  if (!value) return "Chưa cập nhật thời gian";

  return formatVietnamDateTime(value);
}

export function TrackingTimeline({ items }: TrackingTimelineProps) {
  return (
    <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm md:p-8">
      <div className="border-b border-(--border) pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Tiến trình xử lý</h2>
      </div>

      <ol className="mt-8 space-y-6">
        {items.map((item, index) => {
          const isCompleted = item.state === "completed";
          const isCurrent = item.state === "current";
          const isPending = item.state === "pending";

          return (
            <li
              key={item.id}
              className="relative grid grid-cols-[2.5rem_1fr] gap-4"
            >
              {index < items.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute left-5 top-10 h-[calc(100%+1.5rem)] w-0.5",
                    isPending ? "bg-slate-200" : "bg-green-500",
                  ].join(" ")}
                />
              ) : null}

              <span
                className={[
                  "relative z-10 flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold",
                  isCompleted
                    ? "border-green-600 bg-green-600 text-white"
                    : isCurrent
                      ? "border-(--primary) bg-white text-(--primary)"
                      : "border-slate-300 bg-white text-slate-400",
                ].join(" ")}
              >
                {isCompleted ? "✓" : index + 1}
              </span>

              <div
                className={[
                  "rounded-lg border p-5",
                  isCurrent
                    ? "border-red-200 bg-red-50"
                    : isCompleted
                      ? "border-green-100 bg-green-50"
                      : "border-(--border) bg-slate-50",
                ].join(" ")}
              >
                <h3
                  className={[
                    "font-bold",
                    isCurrent
                      ? "text-(--primary)"
                      : isCompleted
                        ? "text-green-800"
                        : "text-slate-500",
                  ].join(" ")}
                >
                  {index + 1}. {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {item.description}
                </p>

                {item.occurredAt ? (
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    {formatDateTime(item.occurredAt)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
