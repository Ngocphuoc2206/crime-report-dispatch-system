"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import type { LoginResult } from "@/features/auth/types/auth.types";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tổng quan", href: "/admin" },
  { label: "Quản lý người dùng", href: "/admin/users" },
  { label: "Hồ sơ cán bộ", href: "/admin/officers" },
  { label: "Loại tội phạm", href: "/admin/crime-types" },
  { label: "Quy tắc nguy cấp", href: "/admin/urgency-rules" },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [session, setSession] = useState<LoginResult | null>(null);

  useEffect(() => {
    const currentSession = authSessionStorage.get();

    if (!currentSession) {
      window.location.href = "/login";
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(currentSession);
  }, []);

  function handleLogout() {
    authSessionStorage.clear();
    window.location.href = "/login";
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-semibold text-slate-600">
          Đang kiểm tra phiên đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="px-6 py-8">
          <Link href="/admin" className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-(--primary) text-xl font-bold text-white">
              🛡
            </span>

            <span>
              <span className="block text-xl font-black text-(--primary)">
                Quản trị viên
              </span>
              <span className="block text-sm font-semibold text-slate-500">
                Hệ thống tin báo
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex rounded-lg px-5 py-3 text-sm font-bold transition",
                  active
                    ? "bg-blue-100 text-slate-700"
                    : "text-slate-600 hover:bg-red-50 hover:text-(--primary)",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-5">
          <button className="w-full rounded-lg px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-100">
            Thu gọn sidebar
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm font-bold text-(--primary) hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-black text-(--primary)">
            Cổng quản trị hệ thống tin báo
          </h1>

          <div className="flex items-center gap-4">
            <button className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
              🔔
            </button>

            <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
              {session.user.fullName.slice(0, 1)}
            </span>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
