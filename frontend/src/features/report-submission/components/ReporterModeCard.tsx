import type { ReporterMode } from "@/features/report-submission/types/reportSubmission.types";

type ReporterModeCardProps = {
  mode: ReporterMode;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (mode: ReporterMode) => void;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="m5 12 4 4L19 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
      <path
        d="M12 3 5 6v5.2c0 4.4 2.8 8.3 7 9.8 4.2-1.5 7-5.4 7-9.8V6l-7-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ReporterModeCard({
  mode,
  title,
  description,
  selected,
  onSelect,
}: ReporterModeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      className={[
        "relative rounded-lg border p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-(--primary) bg-red-50 ring-2 ring-red-100"
          : "border-(--border) bg-white hover:border-red-200",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <span
          className={[
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            selected
              ? "bg-(--primary) text-white"
              : "bg-red-50 text-(--primary)",
          ].join(" ")}
        >
          <ShieldIcon />
        </span>

        <span>
          <span className="block text-lg font-bold text-slate-900">
            {title}
          </span>

          <span className="mt-2 block text-sm leading-6 text-slate-600">
            {description}
          </span>
        </span>
      </div>

      {selected ? (
        <span className="absolute right-5 top-5 flex size-7 items-center justify-center rounded-full bg-(--primary) text-white">
          <CheckIcon />
        </span>
      ) : null}
    </button>
  );
}
