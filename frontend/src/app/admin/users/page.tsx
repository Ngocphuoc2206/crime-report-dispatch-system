import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";
import { AdminUsersContent } from "@/features/admin-users/components/AdminUsersContent";

export default function AdminUsersPage() {
  return (
    <AdminShell>
      <AdminUsersContent />
    </AdminShell>
  );
}
