import Link from "next/link";

export function TrackingPrivacyBanner() {
  return (
    <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-2xl text-[var(--primary)]">
            🛡
          </span>

          <div>
            <h2 className="text-lg font-bold text-(--primary)">
              Cam kết bảo mật tuyệt đối
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Thông tin người báo tin và nội dung tin báo được bảo vệ theo các
              tiêu chuẩn bảo mật của hệ thống. Thông tin định danh chỉ được cung
              cấp cho cơ quan có thẩm quyền xử lý trực tiếp.
            </p>
          </div>
        </div>

        <Link
          href="/privacy"
          className="inline-flex shrink-0 justify-center rounded-md bg-[var(--primary)] px-6 py-3 font-bold text-white transition hover:bg-[var(--primary-hover)]"
        >
          Tìm hiểu thêm
        </Link>
      </div>
    </section>
  );
}
