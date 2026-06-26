import { AdminDashboardContent } from "@/features/admin-dashboard/components/AdminDashboardContent";
import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminDashboardContent />
    </AdminShell>
  );
}
