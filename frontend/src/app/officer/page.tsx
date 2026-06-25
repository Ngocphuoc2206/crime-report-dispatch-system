"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import type { LoginResult } from "@/features/auth/types/auth.types";

function getRoleLabel(role: string) {
  if (role === "DISPATCHER") return "Điều phối viên";
  if (role === "OFFICER") return "Cán bộ";
  if (role === "COMMANDER") return "Chỉ huy";
  if (role === "ADMIN") return "Quản trị";
  return role;
}

export default function OfficerDashboardPage() {
  const [session, setSession] = useState<LoginResult | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(authSessionStorage.get());
  }, []);

  function handleLogout() {
    authSessionStorage.clear();
    window.location.href = "/login";
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-(--background) px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-xl border border-yellow-200 bg-yellow-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-900">Chưa đăng nhập</h1>

          <p className="mt-3 text-sm leading-6 text-yellow-800">
            Vui lòng đăng nhập bằng tài khoản nội bộ để truy cập khu vực nghiệp
            vụ.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-md bg-[var(--primary)] px-6 py-3 font-semibold text-white"
          >
            Đăng nhập
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12">
      <section className="mx-auto max-w-5xl rounded-xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Khu vực nghiệp vụ
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Xin chào, {session.user.fullName}
        </h1>

        <p className="mt-3 text-slate-600">
          Vai trò:{" "}
          <span className="font-bold text-[var(--primary)]">
            {session.user.roles.map(getRoleLabel).join(", ")}
          </span>
        </p>

        <p className="mt-1 text-slate-600">
          Tên đăng nhập: {session.user.username}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tracking"
            className="rounded-md border border-slate-500 px-6 py-3 text-center font-semibold text-slate-600 hover:bg-slate-50"
          >
            Xem hồ sơ tin báo
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Đăng xuất
          </button>
        </div>
      </section>
    </div>
  );
}
