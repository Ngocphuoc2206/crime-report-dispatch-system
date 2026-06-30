function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7">
      <path
        d="M12 3 5 6v5.2c0 4.4 2.8 8.3 7 9.8 4.2-1.5 7-5.4 7-9.8V6l-7-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LawIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7">
      <path
        d="M12 3v18M6 8h12M7 8l-3 6h6L7 8Zm10 0-3 6h6l-3-6Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7">
      <path
        d="M12 3a9 9 0 1 0 9 9M12 7v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function LoginSecurityPanel() {
  return (
    <aside className="overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm">
      <div className="border-t-4 border-[var(--primary)] bg-slate-50 px-8 py-8">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <ShieldIcon />
          </span>

          <div>
            <h1 className="text-2xl font-bold uppercase text-slate-900">
              Cổng điều tra quốc gia
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              Hệ thống đăng nhập nội bộ
            </p>
          </div>
        </div>

        <span className="mt-8 inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-bold uppercase text-green-700">
          Trạng thái an ninh: ổn định
        </span>
      </div>

      <div className="space-y-6 p-8">
        <article className="rounded-lg border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[var(--primary)]">
              <ShieldIcon />
            </span>

            <div>
              <h2 className="font-bold text-slate-900">Truy cập an toàn</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tất cả thông tin đăng nhập được kiểm tra và xác thực trước khi
                truy cập khu vực nghiệp vụ.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <LawIcon />
            </span>

            <div>
              <h2 className="font-bold text-slate-900">Tuân thủ pháp luật</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Hành vi truy cập trái phép hoặc phá hoại hệ thống sẽ bị xử lý
                theo quy định hiện hành.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
              <MonitorIcon />
            </span>

            <div>
              <h2 className="font-bold text-yellow-900">Giám sát chủ động</h2>

              <p className="mt-2 text-sm leading-6 text-yellow-800">
                Hệ thống ghi nhận nhật ký đăng nhập và cảnh báo những truy cập
                bất thường.
              </p>
            </div>
          </div>
        </article>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-slate-600">
              SSL 256-bit
            </span>
            <span className="rounded border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-slate-600">
              AES-GCM
            </span>
            <span className="rounded border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-slate-600">
              Cổng chính phủ
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
