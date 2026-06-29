"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DispatcherShellProps = {
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Tổng quan",
    href: "/dispatcher",
  },
  {
    label: "Chờ điều phối",
    href: "/dispatcher/pending",
  },
  {
    label: "Hồ sơ đã phân công",
    href: "/dispatcher/assigned",
  },
  {
    label: "Tình trạng cán bộ",
    href: "/dispatcher/officers",
  },
  {
    label: "Lịch sử điều phối",
    href: "/dispatcher/history",
  },
  {
    label: "Bản đồ điều phối",
    href: "/dispatcher/map",
  },
  {
    label: "Hỗ trợ",
    href: "/dispatcher/support",
  },
];

export function DispatcherShell({ children }: DispatcherShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fff7f6] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-red-100 bg-[#ffe6e3] lg:flex">
        <div className="px-7 py-7">
          <Link href="/dispatcher" className="block">
            <p className="text-3xl font-black leading-tight text-red-900">
              Điều phối viên
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-red-900/70">
              Trung tâm điều phối
            </p>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const active =
              item.href === "/dispatcher"
                ? pathname === "/dispatcher"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center justify-between rounded-lg px-5 py-4 text-sm font-black transition",
                  active
                    ? "bg-red-100 text-red-800 shadow-sm ring-1 ring-red-200"
                    : "text-red-950/70 hover:bg-red-50 hover:text-red-800",
                ].join(" ")}
              >
                <span>{item.label}</span>
                {active ? (
                  <span className="h-8 w-1 rounded-full bg-[var(--primary)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-red-100 p-5">
          <button className="w-full rounded-lg bg-[var(--primary)] px-5 py-4 font-black text-white shadow-sm hover:bg-[var(--primary-hover)]">
            Cảnh báo khẩn cấp
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-red-100 bg-white/90 px-8 backdrop-blur">
          <h1 className="text-2xl font-black uppercase tracking-wide text-red-900">
            Trung tâm điều phối tin báo
          </h1>

          <div className="flex items-center gap-4">
            <div className="hidden w-80 items-center rounded-lg border border-red-200 bg-white px-4 py-3 md:flex">
              <span className="text-red-900/60">⌕</span>
              <input
                placeholder="Tìm tin báo, cán bộ, đơn vị..."
                className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <button className="relative rounded-lg p-3 text-red-900 hover:bg-red-50">
              🔔
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--primary)]" />
            </button>

            <button className="rounded-lg p-3 text-red-900 hover:bg-red-50">
              ⚙
            </button>

            <div className="flex size-11 items-center justify-center rounded-full bg-red-100 font-black text-red-800">
              ĐP
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
