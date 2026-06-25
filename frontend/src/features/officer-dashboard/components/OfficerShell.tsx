"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import type {
  InternalAuthRole,
  LoginResult,
} from "@/features/auth/types/auth.types";
import { usePathname } from "next/navigation";

type OfficerShellProps = {
  children: React.ReactNode;
};

const sidebarItems = [
  { label: "Dashboard", href: "/officer" },
  { label: "Hộp hồ sơ", href: "/officer/cases" },
  { label: "Hồ sơ của tôi", href: "/officer/my-cases" },
  { label: "Theo dõi SLA", href: "/officer/sla" },
  { label: "Kiểm toán hệ thống", href: "/officer/audit" },
];

function getRoleLabel(roles: InternalAuthRole[]) {
  const role = roles.includes("ADMIN")
    ? "ADMIN"
    : roles.includes("COMMANDER")
      ? "COMMANDER"
      : roles.includes("DISPATCHER")
        ? "DISPATCHER"
        : roles[0];

  if (role === "OFFICER") return "Cán bộ trực vụ";
  if (role === "DISPATCHER") return "Điều phối viên";
  if (role === "COMMANDER") return "Chỉ huy đơn vị";
  if (role === "ADMIN") return "Quản trị hệ thống";
  return "Người dùng nội bộ";
}

export function OfficerShell({ children }: OfficerShellProps) {
  const [session, setSession] = useState<LoginResult | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    const currentSession = authSessionStorage.get();

    if (!currentSession) {
      window.location.href = "/login";
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(currentSession);
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-600">
          Đang kiểm tra phiên đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-[#092f57] text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-7">
          <Link href="/officer" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white text-(--primary) shadow-sm">
              🛡
            </span>

            <span>
              <span className="block text-xl font-bold">Hệ thống tố giác</span>
              <span className="block text-sm text-white/70">
                Cán bộ trực vụ
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {sidebarItems.map((item) => {
            const active =
              item.href === "/officer"
                ? pathName === "/officer"
                : pathName.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-(--primary) text-white shadow-sm"
                    : "text-slate-600 hover:bg-red-50 hover:text-(--primary)",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-white/10 text-sm font-bold ring-1 ring-white/10">
              {session.user.fullName.slice(0, 1)}
            </span>

            <div>
              <p className="font-bold">{session.user.fullName}</p>
              <p className="text-sm text-white/65">
                {getRoleLabel(session.user.roles)}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-6 px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">
                Tiếp nhận tin báo
              </h1>

              <span className="rounded bg-green-50 px-3 py-1 text-xs font-bold uppercase text-green-700 ring-1 ring-green-100">
                Trực tuyến
              </span>
            </div>

            <div className="hidden flex-1 justify-end gap-4 md:flex">
              <input
                placeholder="Tìm mã hồ sơ..."
                className="w-80 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-(--primary) focus:bg-white focus:ring-4 focus:ring-red-100"
              />

              <button className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-(--primary)">
                🔔
              </button>

              <button className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-(--primary)">
                ?
              </button>

              <button className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-(--primary)">
                ⚙
              </button>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
