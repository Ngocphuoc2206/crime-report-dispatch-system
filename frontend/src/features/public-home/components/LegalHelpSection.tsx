import Link from "next/link";
import type { LegalHelpItem } from "@/features/public-home/types/publicHome.types";

const legalHelpItems: LegalHelpItem[] = [
  {
    id: "report-guide",
    title: "Hướng dẫn gửi tin báo",
    description: "Các bước chuẩn bị nội dung, vị trí và bằng chứng trước khi gửi tin.",
    icon: "book",
  },
  {
    id: "privacy",
    title: "Bảo mật danh tính",
    description: "Thông tin người báo tin được bảo vệ và chỉ mở theo đúng thẩm quyền.",
    icon: "shield",
  },
];

function SectionIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 text-slate-600"
    >
      <path
        d="M4 4v16h16M8 8l4 4m0 0 4-4m-4 4v7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function HelpIcon({ icon }: { icon: LegalHelpItem["icon"] }) {
  if (icon === "book") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5 5.5A2.5 2.5 0 0 1 7.5 8H19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (icon === "shield-search") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          d="M12 3 5 6v5.2c0 4.4 2.8 8.3 7 9.8 4.2-1.5 7-5.4 7-9.8V6l-7-3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m14.5 14.5 2 2M9 11.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M12 3 5 6v5.2c0 4.4 2.8 8.3 7 9.8 4.2-1.5 7-5.4 7-9.8V6l-7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function HotlineCard() {
  return (
    <article className="relative overflow-hidden rounded-lg bg-[#e31b23] p-8 text-white shadow-xl shadow-red-900/20">
      <div
        aria-hidden="true"
        className="absolute -bottom-8 -right-8 size-28 rounded-full border-18 border-white/10"
      />

      <h3 className="text-xl font-bold">Đường dây nóng 113</h3>

      <p className="mt-4 max-w-xs text-sm leading-6 text-white/90">
        Dành cho các tình huống khẩn cấp về an ninh trật tự.
      </p>

      <Link
        href="tel:113"
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-white px-5 py-4 text-sm font-bold text-(--primary) transition hover:bg-red-50"
      >
        Gọi ngay
      </Link>
    </article>
  );
}

export function LegalHelpSection() {
  return (
    <aside id="help" aria-labelledby="legal-help-heading" className="space-y-5">
      <div className="border-b-2 border-slate-600 pb-3">
        <h2
          id="legal-help-heading"
          className="flex items-center gap-2 text-xl font-bold text-slate-600"
        >
          <SectionIcon />
          Hướng dẫn & Pháp luật
        </h2>
      </div>

      <div className="space-y-4">
        {legalHelpItems.map((item) => (
          <Link
            key={item.id}
            href={`/help/${item.id}`}
            className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-(--border) bg-[#f4f1f0] p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <span className="flex size-11 items-center justify-center rounded bg-white text-(--primary)">
              <HelpIcon icon={item.icon} />
            </span>

            <span>
              <span className="block font-semibold leading-6 text-slate-900">
                {item.title}
              </span>

              <span className="mt-1 block text-sm leading-6 text-slate-600">
                {item.description}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <HotlineCard />
    </aside>
  );
}
