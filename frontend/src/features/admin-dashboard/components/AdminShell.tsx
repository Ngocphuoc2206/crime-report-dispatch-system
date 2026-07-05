import { InternalShell } from "@/components/layout/InternalShell";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tổng quan", href: "/admin" },
  { label: "Người dùng", href: "/admin/users" },
  { label: "Đơn vị công an", href: "/admin/units" },
  { label: "Hồ sơ cán bộ", href: "/admin/officers" },
  { label: "Loại tội phạm", href: "/admin/crime-types" },
  { label: "Quy tắc nguy cấp", href: "/admin/urgency-rules" },
];

export function AdminShell({ children }: AdminShellProps) {
  return (
    <InternalShell
      homeHref="/admin"
      navItems={navItems}
      roleCode="ADMIN"
      roleLabel="Quản trị viên"
      subtitle="Cổng quản trị"
      title="Quản trị hệ thống tin báo"
    >
      {children}
    </InternalShell>
  );
}
