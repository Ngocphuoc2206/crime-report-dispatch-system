import Link from "next/link";

const navigation = [
  { label: "Trang chủ", href: "/", active: true },
  { label: "Tin báo", href: "/report" },
  { label: "Tra cứu", href: "/tracking" },
  { label: "Hỗ trợ", href: "/#help" },
];

function EmblemIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-8">
      <rect width="48" height="48" rx="6" fill="#0f5132" />
      <circle
        cx="24"
        cy="24"
        r="14"
        fill="none"
        stroke="#f6d365"
        strokeWidth="2"
      />
      <path
        d="M24 10l3.4 8 8.6.8-6.5 5.7 2 8.5L24 28.6 16.5 33l2-8.5-6.5-5.7 8.6-.8L24 10z"
        fill="#f6d365"
      />
    </svg>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 md:h-20 md:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="Trang chủ"
        >
          <EmblemIcon />

          <span className="hidden truncate text-xl font-medium uppercase tracking-tight text-(--primary) lg:block xl:text-2xl">
            Cổng thông tin tố giác tội phạm
          </span>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-7 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "relative whitespace-nowrap py-2 text-sm font-semibold transition-colors",
                item.active
                  ? "text-(--primary) after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-(--primary)"
                  : "text-slate-600 hover:text-(--primary)",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md bg-(--primary) px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-(--primary-hover)"
          >
            Đăng nhập dành cho cán bộ
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-(--border) px-4 py-2 text-sm font-semibold text-slate-700">
            Menu
          </summary>

          <div className="absolute right-0 top-12 z-50 flex w-60 flex-col rounded-xl border border-(--border) bg-white p-3 shadow-xl">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-(--primary)"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className="rounded-md bg-(--primary) px-3 py-2 text-center text-sm font-bold text-white"
              >
                Đăng nhập dành cho cán bộ
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
