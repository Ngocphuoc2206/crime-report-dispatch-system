"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
import { authSessionStorage } from "@/features/auth/services/authSessionStorage";
import type { LoginFormState } from "@/features/auth/types/auth.types";

const initialForm: LoginFormState = {
  username: "",
  password: "",
  rememberMe: false,
};

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => form.username.trim() !== "" && form.password !== "" && !submitting,
    [form.password, form.username, submitting],
  );

  function updateField<K extends keyof LoginFormState>(
    key: K,
    value: LoginFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrorMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const result = await authService.login(form);
      authSessionStorage.save(result, form.rememberMe);
      router.replace("/officer");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="rounded-xl border border-red-100 bg-white p-8 shadow-lg shadow-red-900/5 md:p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Đăng nhập hệ thống
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sử dụng tài khoản nội bộ được cấp để truy cập khu vực nghiệp vụ.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <label className="block">
          <span className="text-sm font-bold text-slate-900">
            Tên đăng nhập
          </span>
          <input
            name="username"
            value={form.username}
            autoComplete="username"
            onChange={(event) => updateField("username", event.target.value)}
            placeholder="Ví dụ: officer01"
            className="mt-2 w-full rounded-md border border-red-100 bg-white px-4 py-4 text-base 
            text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-4 focus:ring-red-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-900">Mật khẩu</span>
          <div className="mt-2 flex rounded-md border border-red-100 bg-white focus-within:border-(--primary) focus-within:ring-4 focus-within:ring-red-100">
            <input
              name="password"
              value={form.password}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Nhập mật khẩu"
              className="min-w-0 flex-1 rounded-md px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="flex w-14 items-center justify-center rounded-r-md cursor-pointer text-slate-500 transition hover:text-(--primary)"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={(event) =>
              updateField("rememberMe", event.target.checked)
            }
            className="size-5 rounded border-slate-300 accent-(--primary)"
          />
          Ghi nhớ đăng nhập trên thiết bị này
        </label>

        {errorMessage ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-(--primary)"
          >
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-(--primary) px-6 py-4 text-base font-bold uppercase text-white 
          shadow-lg shadow-red-900/20 transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {submitting ? "Đang xác thực..." : "Đăng nhập"}
        </button>

        <p className="rounded-md bg-slate-50 px-5 py-4 text-center text-sm leading-6 text-slate-600">
          Vai trò và quyền truy cập sẽ được xác định tự động từ tài khoản của
          bạn.
        </p>
      </form>
    </article>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M2.06 12.35a11.45 11.45 0 0 1 19.88 0" />
      <path d="M2.06 11.65a11.45 11.45 0 0 0 19.88 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M10.73 5.08A11.32 11.32 0 0 1 12 5c5 0 9.27 3.11 11 7a12.77 12.77 0 0 1-1.67 2.68" />
      <path d="M6.61 6.6A12.2 12.2 0 0 0 1 12a11.82 11.82 0 0 0 15.45 5.03" />
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
      <path d="M4 4l16 16" />
    </svg>
  );
}
