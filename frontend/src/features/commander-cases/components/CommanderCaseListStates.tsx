import Link from "next/link";

export function CommanderCaseLoadingState() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121b3a] p-6">
      <h2 className="text-2xl font-bold text-slate-100">Đang tải dữ liệu</h2>

      <div className="mt-6 space-y-5">
        <div className="h-12 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="h-px bg-white/10" />

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4">
            <div className="h-9 animate-pulse rounded bg-white/10" />
            <div className="h-9 animate-pulse rounded bg-white/10" />
            <div className="h-9 animate-pulse rounded bg-white/10" />
            <div className="h-9 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CommanderCaseEmptyState() {
  return (
    <section className="flex min-h-[25rem] items-center justify-center rounded-xl border border-white/10 bg-[#121b3a] p-8 text-center">
      <div>
        <div className="mx-auto flex size-24 items-center justify-center rounded-2xl bg-white/10 text-5xl text-slate-500">
          ◫
        </div>

        <h2 className="mt-6 text-2xl font-bold text-slate-100">
          Chưa có hồ sơ nào
        </h2>

        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Hiện tại hệ thống chưa ghi nhận hồ sơ tin báo nào trong cơ sở dữ liệu.
        </p>

        <Link
          href="/commander"
          className="mt-6 inline-flex rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
        >
          Quay về tổng quan
        </Link>
      </div>
    </section>
  );
}

export function CommanderCaseNoResultState({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <section className="flex min-h-88 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0d1530] p-8 text-center">
      <div>
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white/10 text-4xl text-slate-500">
          ⌕
        </div>

        <h2 className="mt-6 text-2xl font-bold text-slate-100">
          Không tìm thấy kết quả
        </h2>

        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Không có hồ sơ nào khớp với bộ lọc hiện tại.
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-lg border border-white/15 px-6 py-3 font-bold text-slate-200 hover:bg-white/10"
        >
          Xóa bộ lọc
        </button>
      </div>
    </section>
  );
}

export function CommanderCaseErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="flex min-h-100 items-center justify-center rounded-xl border border-red-400/30 bg-red-400/5 p-8 text-center">
      <div>
        <div className="mx-auto flex size-24 items-center justify-center rounded-2xl border border-red-400/30 bg-red-400/10 text-5xl text-red-200">
          ⚠
        </div>

        <h2 className="mt-6 text-2xl font-bold text-red-200">
          Không thể kết nối máy chủ
        </h2>

        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Đã xảy ra lỗi khi tải danh sách hồ sơ. Vui lòng kiểm tra kết nối mạng
          hoặc thử lại sau.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg border border-red-300/40 px-6 py-3 font-bold text-red-200 hover:bg-red-400/10"
        >
          Thử lại
        </button>
      </div>
    </section>
  );
}
