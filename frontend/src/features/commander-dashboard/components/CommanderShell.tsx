import { InternalShell } from "@/components/layout/InternalShell";

type CommanderShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tổng quan", href: "/commander" },
  { label: "Bản đồ tin báo", href: "/commander/map" },
  { label: "Danh sách hồ sơ", href: "/commander/cases" },
  { label: "Hoạt động gần đây", href: "/commander/activity" },
];

export function CommanderShell({ children }: CommanderShellProps) {
  return (
    <InternalShell
      homeHref="/commander"
      navItems={navItems}
      roleCode="COMMANDER"
      roleLabel="Chỉ huy"
      subtitle="Cổng chỉ huy"
      title="Điều hành và giám sát tin báo"
    >
      {children}
    </InternalShell>
  );
}
