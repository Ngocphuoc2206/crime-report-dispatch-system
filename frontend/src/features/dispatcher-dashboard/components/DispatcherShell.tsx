import { InternalShell } from "@/components/layout/InternalShell";

type DispatcherShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Tổng quan", href: "/dispatcher" },
  { label: "Chờ điều phối", href: "/dispatcher/pending" },
  { label: "Đã phân công", href: "/dispatcher/assigned" },
  { label: "Tình trạng cán bộ", href: "/dispatcher/officers" },
  { label: "Lịch sử điều phối", href: "/dispatcher/history" },
  { label: "Bản đồ điều phối", href: "/dispatcher/map" },
  { label: "Hỗ trợ", href: "/dispatcher/support" },
];

export function DispatcherShell({ children }: DispatcherShellProps) {
  return (
    <InternalShell
      homeHref="/dispatcher"
      navItems={navItems}
      roleCode="DISPATCHER"
      roleLabel="Điều phối viên"
      subtitle="Cổng điều phối"
      title="Điều phối tin báo và lực lượng"
    >
      {children}
    </InternalShell>
  );
}
