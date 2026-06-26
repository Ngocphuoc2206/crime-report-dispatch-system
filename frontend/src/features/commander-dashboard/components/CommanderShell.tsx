"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import { useEffect, useState } from "react";
import type { LoginResult } from "@/features/auth/types/auth.types";

type CommanderShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tổng quan", href: "/commander" },
  { label: "Bản đồ tin báo", href: "/commander/map" },
  { label: "Danh sách hồ sơ", href: "/commander/cases" },
  { label: "Hoạt động gần đây", href: "/commander/activity" },
];

export function CommanderShell({ children }: CommanderShellProps) {
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
      <div className="flex min-h-screen items-center justify-center bg-[#090f24] text-slate-200">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090f24] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#0d1530] lg:flex lg:flex-col">
        <div className="bg-cyan-200 px-7 py-6">
          <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900">
            Trung tâm điều hành
          </h1>
        </div>

        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-cyan-200">
              {session.user.fullName.slice(0, 1)}
            </span>

            <div>
              <p className="font-bold text-white">{session.user.fullName}</p>
              <p className="text-sm text-slate-400">Chỉ huy</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const active =
              item.href === "/commander"
                ? pathname === "/commander"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex rounded-lg px-5 py-3 text-sm font-bold transition",
                  active
                    ? "bg-(--primary) text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-white/10 px-5 py-3 text-left text-sm font-bold text-red-200 hover:bg-white/10"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#090f24]/95 px-8 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Trung tâm điều hành tin báo
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">
              🔔
            </button>

            <button className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">
              ?
            </button>

            <button className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">
              ⚙
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
