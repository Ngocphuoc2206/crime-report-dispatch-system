import type { OfficerCaseTimelineItem } from "@/features/officer-cases/types/officerCase.types";

type OfficerCaseTimelineProps = {
  items: OfficerCaseTimelineItem[];
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function OfficerCaseTimeline({ items }: OfficerCaseTimelineProps) {
  return (
    <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Nhật ký xử lý</h2>

      <ol className="mt-6 space-y-6">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="relative grid grid-cols-[2rem_1fr] gap-4"
          >
            {index < items.length - 1 ? (
              <span className="absolute left-4 top-8 h-[calc(100%+1.5rem)] w-0.5 bg-slate-200" />
            ) : null}

            <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-(--primary) text-xs font-bold text-white">
              {index + 1}
            </span>

            <div>
              <p className="font-bold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {formatDateTime(item.occurredAt)} • {item.actor}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
