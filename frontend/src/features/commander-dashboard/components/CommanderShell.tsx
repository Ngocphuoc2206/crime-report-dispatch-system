"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import type { LoginResult } from "@/features/auth/types/auth.types";

type CommanderShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tong quan", href: "/commander" },
  { label: "Ban do tin bao", href: "/commander/map" },
  { label: "Danh sach ho so", href: "/commander/cases" },
  { label: "Hoat dong gan day", href: "/commander/activity" },
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-semibold text-slate-600">
          Dang kiem tra phien dang nhap...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="px-6 py-8">
          <Link href="/commander" className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-bold text-white">
              C
            </span>

            <span>
              <span className="block text-xl font-black text-[var(--primary)]">
                Chi huy
              </span>
              <span className="block text-sm font-semibold text-slate-500">
                Trung tam dieu hanh
              </span>
            </span>
          </Link>
        </div>

        <div className="border-b border-slate-200 px-6 pb-6">
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-white font-bold text-[var(--primary)] shadow-sm ring-1 ring-slate-200">
              {session.user.fullName.slice(0, 1)}
            </span>

            <div>
              <p className="font-bold text-slate-950">
                {session.user.fullName}
              </p>
              <p className="text-sm text-slate-500">Commander</p>
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
                    ? "bg-blue-100 text-slate-700"
                    : "text-slate-600 hover:bg-red-50 hover:text-[var(--primary)]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-bold text-[var(--primary)] hover:bg-red-50"
          >
            Dang xuat
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-black text-[var(--primary)]">
            Cong dieu hanh tin bao
          </h1>

          <div className="flex items-center gap-4">
            <button className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
              Bell
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
