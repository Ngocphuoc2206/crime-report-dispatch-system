import { InternalShell } from "@/components/layout/InternalShell";

type OfficerShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tổng quan", href: "/officer" },
  { label: "Hộp hồ sơ", href: "/officer/cases" },
  { label: "Hồ sơ của tôi", href: "/officer/my-cases" },
  { label: "Kiểm toán hệ thống", href: "/officer/audit" },
];

export function OfficerShell({ children }: OfficerShellProps) {
  return (
    <InternalShell
      homeHref="/officer"
      navItems={navItems}
      roleCode="OFFICER"
      roleLabel="Cán bộ trực ban"
      subtitle="Cổng cán bộ"
      title="Tiếp nhận và xử lý tin báo"
    >
      {children}
    </InternalShell>
  );
}
