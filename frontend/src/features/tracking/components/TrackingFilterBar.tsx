import type { FormEvent } from "react";

type TrackingFilterBarProps = {
  trackingCode: string;
  isLoading: boolean;
  error?: string;
  onTrackingCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TrackingFilterBar({
  trackingCode,
  isLoading,
  error,
  onTrackingCodeChange,
  onSubmit,
}: TrackingFilterBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-(--border) bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-[1fr_13rem] md:items-end">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Mã tra cứu
          </span>

          <input
            value={trackingCode}
            onChange={(event) => onTrackingCodeChange(event.target.value)}
            placeholder="Ví dụ: TB-2026-000001"
            autoComplete="off"
            aria-describedby={error ? "tracking-code-error" : undefined}
            aria-invalid={Boolean(error)}
            className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 font-mono text-base uppercase text-slate-900 outline-none transition placeholder:font-sans placeholder:normal-case placeholder:text-slate-400 focus:border-(--primary) focus:ring-4 focus:ring-red-100"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-sky-700 px-6 py-3 font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Đang tra cứu..." : "Tra cứu hồ sơ"}
        </button>
      </div>

      {error ? (
        <p id="tracking-code-error" className="mt-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
