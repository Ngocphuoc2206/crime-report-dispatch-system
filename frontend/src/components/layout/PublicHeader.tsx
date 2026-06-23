"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

        <div
          className="relative md:hidden"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <button
            type="button"
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMenuOpen}
            aria-controls="public-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="relative flex size-11 items-center justify-center rounded-md border border-(--border) text-slate-700 transition-colors duration-300 hover:border-(--primary) hover:bg-red-50 hover:text-(--primary)"
          >
            {/* Hamburger */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={[
                "absolute size-6 transition-all duration-300 ease-out",
                isMenuOpen
                  ? "rotate-90 scale-75 opacity-0"
                  : "rotate-0 scale-100 opacity-100",
              ].join(" ")}
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Mũi tên */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={[
                "absolute size-6 transition-all duration-300 ease-out",
                isMenuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-75 opacity-0",
              ].join(" ")}
            >
              <path
                d="m6 15 6-6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            id="public-mobile-menu"
            className={[
              "absolute right-0 top-full z-50 flex w-60 origin-top-right flex-col rounded-xl border border-(--border) bg-white p-3 shadow-xl",
              "transition-all duration-300 ease-out",
              isMenuOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible -translate-y-2 scale-95 opacity-0",
            ].join(" ")}
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="
                relative rounded-md px-3 py-3 text-sm font-semibold text-slate-700
                transition-colors hover:bg-red-50 hover:text-(--primary)
                after:absolute after:inset-x-3 after:bottom-0 after:h-0.5
                after:origin-left after:scale-x-0 after:bg-(--primary)
                after:transition-transform after:duration-300
                hover:after:scale-x-100
              "
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 gap-2">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md bg-(--primary) px-3 py-2 text-center text-sm font-bold text-white"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
