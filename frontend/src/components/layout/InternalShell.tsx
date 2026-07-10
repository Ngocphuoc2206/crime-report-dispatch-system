"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import type {
  InternalAuthRole,
  LoginResult,
} from "@/features/auth/types/auth.types";

export type InternalShellNavItem = {
  label: string;
  href: string;
};

type InternalShellProps = {
  children: React.ReactNode;
  homeHref: string;
  navItems: InternalShellNavItem[];
  roleCode: InternalAuthRole;
  roleLabel: string;
  title: string;
  subtitle: string;
};

const roleInitials: Record<InternalAuthRole, string> = {
  ADMIN: "AD",
  COMMANDER: "CH",
  DISPATCHER: "DP",
  OFFICER: "CB",
};

const rootNavHrefs = new Set([
  "/admin",
  "/commander",
  "/dispatcher",
  "/officer",
]);

function isActivePath(pathname: string, href: string) {
  if (rootNavHrefs.has(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function InternalShell({
  children,
  homeHref,
  navItems,
  roleCode,
  roleLabel,
  title,
  subtitle,
}: InternalShellProps) {
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
        <p className="text-sm font-semibold text-slate-600">
          Đang kiểm tra phiên đăng nhập...
        </p>
      </div>
    );
  }

  const userInitial = session.user.fullName.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 px-6 py-6">
          <Link href={homeHref} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-black text-white">
              {roleInitials[roleCode]}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold text-slate-950">
                Hệ thống tin báo
              </span>
              <span className="block truncate text-sm font-semibold text-slate-500">
                {roleLabel}
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold transition",
                  active
                    ? "border-[var(--primary-muted)] bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-700 ring-1 ring-slate-200">
              {userInitial}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">
                {session.user.fullName}
              </p>
              <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="min-w-0">
              <p className="eyebrow text-[var(--primary)]">
                {subtitle}
              </p>
              <h1 className="truncate text-xl font-extrabold leading-tight text-slate-950">
                {title}
              </h1>
            </div>

            <div className="group relative">
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-black text-white shadow-sm ring-1 ring-[var(--primary-muted)] transition hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--primary-muted)]"
                aria-label="Mở menu tài khoản"
              >
                {userInitial}
              </button>

              <span className="absolute right-0 top-full hidden h-2 w-72 group-hover:block group-focus-within:block" />

              <div className="invisible absolute right-0 top-full z-50 mt-1 w-72 translate-y-0 rounded-xl border border-slate-200 bg-white p-2 text-left opacity-0 shadow-xl shadow-slate-900/10 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="truncate text-sm font-black text-slate-950">
                    {session.user.fullName}
                  </p>
                  <p className="mt-1 truncate text-xs font-bold uppercase tracking-wide text-slate-500">
                    {roleLabel}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-2 flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <span>Thông báo</span>
                  <span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-xs font-black text-[var(--primary)]">
                    Mới
                  </span>
                </button>

                <Link
                  href={homeHref}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Trang làm việc
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[var(--primary)] px-3 text-sm font-black text-white transition hover:bg-[var(--primary-hover)]"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-5 py-3 lg:hidden">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "shrink-0 rounded-lg px-3 py-2 text-sm font-bold",
                    active
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "text-slate-600 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="min-h-[calc(100vh-5rem)]">{children}</main>
      </div>
    </div>
  );
}
