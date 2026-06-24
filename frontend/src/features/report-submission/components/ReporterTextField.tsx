import type { HTMLInputTypeAttribute } from "react";

type ReporterTextFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  error?: string;
  onChange: (name: string, value: string) => void;
};

export function ReporterTextField({
  label,
  name,
  value,
  placeholder,
  required = false,
  type = "text",
  error,
  onChange,
}: ReporterTextFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="text-(--primary)"> *</span> : null}
      </span>

      <input
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className={[
          "mt-2 w-full rounded-md border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400",
          error
            ? "border-red-400 focus:border-(--primary) focus:ring-4 focus:ring-red-100"
            : "border-(--border) focus:border-(--primary) focus:ring-4 focus:ring-red-100",
        ].join(" ")}
      />

      {error ? (
        <span className="mt-1 block text-sm text-(--primary)">{error}</span>
      ) : null}
    </label>
  );
}
