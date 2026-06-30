import Link from "next/link";

export function SupportHelpPanel() {
  return (
    <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
      <h2 className="font-bold text-slate-900">Trợ giúp nhanh</h2>

      <div className="mt-5 space-y-4 text-sm">
        <Link
          href="/tracking"
          className="block font-semibold text-sky-700 hover:text-(--primary)"
        >
          Hướng dẫn tra cứu hồ sơ
        </Link>

        <Link
          href="tel:1900"
          className="block font-semibold text-sky-700 hover:text-(--primary)"
        >
          Tổng đài hỗ trợ 1900 xxxx
        </Link>

        <Link
          href="tel:113"
          className="block font-semibold text-(--primary) hover:underline"
        >
          Đường dây nóng 113
        </Link>
      </div>
    </article>
  );
}
