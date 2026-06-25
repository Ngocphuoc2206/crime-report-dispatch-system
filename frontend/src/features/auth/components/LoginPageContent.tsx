import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginSecurityPanel } from "@/features/auth/components/LoginSecurityPanel";

export function LoginPageContent() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef6ff,transparent_35%),linear-gradient(135deg,#fffdfb,#fff5f5)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wide text-[var(--primary)]"
          >
            Cổng thông tin tố giác tội phạm
          </Link>

          <Link
            href="/"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white"
          >
            Về trang chủ
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <LoginSecurityPanel />
          <LoginForm />
        </main>
      </div>
    </div>
  );
}
