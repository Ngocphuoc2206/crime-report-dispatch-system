type AnonymousModeToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M12 3 5 6v5.2c0 4.4 2.8 8.3 7 9.8 4.2-1.5 7-5.4 7-9.8V6l-7-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AnonymousModeToggle({
  checked,
  onChange,
}: AnonymousModeToggleProps) {
  return (
    <section className="rounded-md border border-yellow-200 bg-yellow-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="text-(--primary)">
              <ShieldIcon />
            </span>
            Chế độ gửi ẩn danh
          </h2>

          <p className="mt-2 text-sm leading-5 text-slate-600">
            Danh tính của bạn sẽ được mã hóa và bảo vệ tuyệt mật theo pháp luật.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={[
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            checked ? "bg-(--primary)" : "bg-blue-200",
          ].join(" ")}
        >
          <span
            className={[
              "absolute left-0 top-1 size-5 rounded-full bg-white shadow transition-transform duration-200 ease-out",
              checked ? "translate-x-6" : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>
    </section>
  );
}
