import Link from "next/link";

const footerLinks = [
  { label: "Chính sách bảo mật", href: "/privacy" },
  { label: "Điều khoản sử dụng", href: "/terms" },
  { label: "Liên hệ công tác", href: "/contact" },
  { label: "Sơ đồ trang", href: "/sitemap" },
];

const footerColumns = [
  [
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Điều khoản sử dụng", href: "/terms" },
  ],
  [{ label: "Liên hệ công tác", href: "/contact" }],
  [{ label: "Sơ đồ trang", href: "/sitemap" }],
];

function FooterMiniIcon({ label }: { label: string }) {
  return (
    <span
      aria-label={label}
      className="inline-flex size-6 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-500"
    >
      ●
    </span>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-(--border) bg-[#f1eeee]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:py-12">
        <div className="max-w-xl">
          <p className="font-bold uppercase text-(--primary)">Bộ Công an</p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            © 2026 Bộ Công an – Cổng thông tin tiếp nhận, giải quyết tin báo, tố
            giác về tội phạm.
          </p>

          <div className="mt-4 flex gap-2">
            <FooterMiniIcon label="Bảo mật" />
            <FooterMiniIcon label="Xác thực" />
            <FooterMiniIcon label="Dấu vân tay" />
          </div>
        </div>

        <nav
          aria-label="Liên kết chân trang"
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 lg:w-auto lg:min-w-2xl"
        >
          {footerColumns.map((column, index) => (
            <div key={index} className="flex flex-col gap-3">
              {column.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-600 transition-colors hover:text-(--primary)"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
