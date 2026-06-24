type EmergencyFlagCardProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function EmergencyFlagCard({
  label,
  description,
  checked,
  onChange,
}: EmergencyFlagCardProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "rounded-lg border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md",
        checked
          ? "border-(--primary) bg-red-50 ring-2 ring-red-100"
          : "border-(--border) bg-white",
      ].join(" ")}
    >
      <span className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 flex size-5 items-center justify-center rounded border",
            checked
              ? "border-(--primary) bg-(--primary) text-white"
              : "border-slate-300 bg-white",
          ].join(" ")}
        >
          {checked ? "✓" : ""}
        </span>

        <span>
          <span className="block font-bold text-slate-900">{label}</span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {description}
          </span>
        </span>
      </span>
    </button>
  );
}
