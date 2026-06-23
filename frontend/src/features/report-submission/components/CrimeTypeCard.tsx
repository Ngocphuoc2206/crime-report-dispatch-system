import type { CrimeType } from "@/features/report-submission/types/reportSubmission.types";

type CrimeTypeCardProps = {
  crimeType: CrimeType;
  selected: boolean;
  onSelect: (crimeType: CrimeType) => void;
};

const toneClassNames = {
  green: "bg-emerald-50 text-emerald-700",
  orange: "bg-orange-50 text-orange-700",
  blue: "bg-blue-50 text-blue-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-slate-100 text-slate-700",
};

function CrimeTypeIcon({ icon }: { icon?: string }) {
  if (icon === "medical") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8">
        <path
          d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (icon === "money") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8">
        <path
          d="M3 7h18v10H3V7Zm4 3h3m4 0h3M7 14h10"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (icon === "network") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8">
        <path
          d="M12 5v4m0 6v4M5 12h4m6 0h4M7 7l3 3m4 4 3 3m0-10-3 3m-4 4-3 3"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8">
      <path
        d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.7-3 2.5-5 5-5s4.3 2 5 5m-1.5 0c.7-2.4 2.2-4 4.5-4 2.5 0 4.3 1.8 5 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CrimeTypeCard({
  crimeType,
  selected,
  onSelect,
}: CrimeTypeCardProps) {
  const tone = crimeType.tone ?? "gray";

  return (
    <button
      type="button"
      onClick={() => onSelect(crimeType)}
      className={[
        "min-h-72 rounded-lg border bg-white p-8 text-left transition",
        "hover:-translate-y-1 hover:shadow-lg",
        selected
          ? "border-(--primary) ring-2 ring-red-100"
          : "border-(--border)",
      ].join(" ")}
    >
      <span
        className={[
          "flex size-16 items-center justify-center rounded-2xl",
          toneClassNames[tone],
        ].join(" ")}
      >
        <CrimeTypeIcon icon={crimeType.icon} />
      </span>

      <span className="mt-8 block text-xl font-bold text-slate-900">
        {crimeType.name}
      </span>

      <span className="mt-4 block text-sm leading-7 text-slate-600">
        {crimeType.description}
      </span>

      {selected ? (
        <span className="mt-5 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-(--primary)">
          Đã chọn
        </span>
      ) : null}
    </button>
  );
}
